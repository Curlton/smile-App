from rest_framework import serializers
from .models import Child, Sponsor, Donation, Program, ChildProgram, Staff
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        groups = list(user.groups.values_list('name', flat=True))
        groups_lower = [g.lower() for g in groups]

        if user.is_superuser:
            role = 'admin'
        elif 'admin' in groups_lower:
            role = 'admin'
        elif 'manager' in groups_lower:
            role = 'manager'
        elif 'viewer' in groups_lower:
            role = 'viewer'
        else:
            role = None

        token['username'] = user.username
        token['role'] = role
        token['groups'] = groups

        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        groups = list(self.user.groups.values_list('name', flat=True))
        groups_lower = [g.lower() for g in groups]

        if self.user.is_superuser:
            role = 'admin'
        elif 'admin' in groups_lower:
            role = 'admin'
        elif 'manager' in groups_lower:
            role = 'manager'
        elif 'viewer' in groups_lower:
            role = 'viewer'
        else:
            raise serializers.ValidationError("User role not found. Contact admin.")

        # ➕ Add fields to the token response
        data['username'] = self.user.username
        data['groups'] = groups
        data['is_superuser'] = self.user.is_superuser  # <--- add this
        data['role'] = role

        return data


# -------------------- CHILD SERIALIZERS --------------------

class ChildSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Child
        fields = ['id', 'first_name', 'last_name']

class ChildSerializer(serializers.ModelSerializer):
    class Meta:
        model = Child
        fields = '__all__'

class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = '__all__'

class ChildProgramSerializer(serializers.ModelSerializer):
    child = ChildSerializer(read_only=True)
    program = ProgramSerializer(read_only=True)
    child_id = serializers.PrimaryKeyRelatedField(queryset=Child.objects.all(), source='child', write_only=True)
    program_id = serializers.PrimaryKeyRelatedField(queryset=Program.objects.all(), source='program', write_only=True)

    class Meta:
        model = ChildProgram
        fields = '__all__'

class ChildDetailSerializer(serializers.ModelSerializer):
    childprogram = ChildProgramSerializer(many=True, read_only=True)
    photo = serializers.SerializerMethodField()
    image_data = serializers.ImageField(required=False)

    class Meta:
        model = Child
        fields = '__all__'

    def get_photo(self, obj):
        return obj.image_data.url if obj.image_data else None

# -------------------- SPONSOR / DONATION --------------------

class SponsorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sponsor
        fields = '__all__'

class DonationSerializer(serializers.ModelSerializer):
    sponsor = SponsorSerializer(read_only=True)
    sponsor_id = serializers.PrimaryKeyRelatedField(queryset=Sponsor.objects.all(), source='sponsor', write_only=True)

    class Meta:
        model = Donation
        fields = '__all__'

# -------------------- STAFF SERIALIZER --------------------

class StaffSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='name.username', read_only=True)
    email = serializers.EmailField(source='name.email', read_only=True)
    groups = serializers.SerializerMethodField()
    name_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='name', write_only=True)

    class Meta:
        model = Staff
        fields = ['id', 'name_id', 'username', 'email', 'groups', 'position', 'is_volunteer', 'phone', 'created_at']
        read_only_fields = ['created_at']

    def get_groups(self, obj):
        return list(obj.name.groups.values_list('name', flat=True))
