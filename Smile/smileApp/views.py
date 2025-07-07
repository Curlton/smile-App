from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Prefetch
from rest_framework.serializers import ModelSerializer

from .models import Child, Sponsor, Donation, Program, ChildProgram, Staff
from .serializers import (
    ChildDetailSerializer, ChildSummarySerializer, SponsorSerializer,
    DonationSerializer, ProgramSerializer, ChildProgramSerializer,
    StaffSerializer
)
from .permissions import RoleBasedPermission
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer



# ------------------- USER VIEW ----------------------

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, RoleBasedPermission]


# ------------------- CHILD VIEWS --------------------

class ChildSummaryView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request):
        children = Child.objects.all()
        serializer = ChildSummarySerializer(children, many=True)
        return Response(serializer.data)

class ChildDetailView(APIView):
    permission_classes = [IsAuthenticated, RoleBasedPermission]

    def get(self, request, pk):
        child = get_object_or_404(
            Child.objects.prefetch_related(
                Prefetch('childprogram', queryset=ChildProgram.objects.select_related('program'))
            ),
            pk=pk
        )
        serializer = ChildDetailSerializer(child)
        return Response(serializer.data)

class ChildViewSet(viewsets.ModelViewSet):
    queryset = Child.objects.all()
    serializer_class = ChildDetailSerializer
    permission_classes = [IsAuthenticated, RoleBasedPermission]
    parser_classes = (MultiPartParser, FormParser)


# ------------------- OTHER CRUD --------------------

class SponsorViewSet(viewsets.ModelViewSet):
    queryset = Sponsor.objects.all()
    serializer_class = SponsorSerializer
    permission_classes = [IsAuthenticated, RoleBasedPermission]

class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated, RoleBasedPermission]

class ProgramViewSet(viewsets.ModelViewSet):
    queryset = Program.objects.all()
    serializer_class = ProgramSerializer
    permission_classes = [IsAuthenticated, RoleBasedPermission]

class ChildProgramViewSet(viewsets.ModelViewSet):
    queryset = ChildProgram.objects.all()
    serializer_class = ChildProgramSerializer
    permission_classes = [IsAuthenticated, RoleBasedPermission]

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer
    permission_classes = [IsAuthenticated, RoleBasedPermission]


# ------------------- USER PROFILE --------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # ✅ Removed RoleBasedPermission
def get_user_profile(request):
    user = request.user
    groups = list(user.groups.values_list('name', flat=True))
    return Response({
        "username": user.username,
        "groups": groups,
        "is_superuser": user.is_superuser,
    })
