from django.contrib import admin
from .models import (
    Child,
    Sponsor,
    Donation,
    Program,
    ChildProgram,
    Staff,
)

@admin.register(Child)
class ChildAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'gender', 'birth_date', 'status', 'entry_date')
    search_fields = ('first_name', 'last_name', 'guardian_name')
    list_filter = ('status', 'gender')

@admin.register(Sponsor)
class SponsorAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'sponsor_type', 'preferred_contact')
    search_fields = ('name', 'email')

@admin.register(Donation)
class DonationAdmin(admin.ModelAdmin):
    list_display = ('sponsor', 'amount', 'donation_date', 'payment_method')
    list_filter = ('donation_date',)
    search_fields = ('sponsor__name', 'purpose')

@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ('title', 'location')
    search_fields = ('title',)

@admin.register(ChildProgram)
class ChildProgramAdmin(admin.ModelAdmin):
    list_display = ('child', 'program', 'level', 'start_date', 'end_date')
    list_filter = ('program', 'start_date')
    search_fields = ('child__first_name', 'program__title')

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ('get_username', 'get_groups', 'position', 'is_volunteer', 'phone', 'created_at')
    list_filter = ('is_volunteer', 'position', 'name__groups')
    search_fields = ('name__username', 'position', 'phone')
    ordering = ('-created_at',)

    @admin.display(description='Username')
    def get_username(self, obj):
        return obj.name.username

    @admin.display(description='Groups')
    def get_groups(self, obj):
        groups = obj.name.groups.values_list('name', flat=True)
        return ", ".join(groups) if groups else 'No Group'
