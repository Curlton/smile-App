from django.core.management.base import BaseCommand
from django.contrib.auth.models import Group, Permission
from django.contrib.contenttypes.models import ContentType
from smileApp.models import Child, Sponsor, Donation, Program, Staff

class Command(BaseCommand):
    help = "Create default groups: Admin, Manager, Viewer with permissions"

    def handle(self, *args, **options):
        # Clear existing groups
        for group_name in ['Admin', 'Manager', 'Viewer']:
            Group.objects.filter(name=group_name).delete()

        # Create groups
        admin_group = Group.objects.create(name='Admin')
        manager_group = Group.objects.create(name='Manager')
        viewer_group = Group.objects.create(name='Viewer')

        # Get content types for models
        models = [Child, Sponsor, Donation, Program, Staff]
        permissions = Permission.objects.filter(content_type__model__in=[
            model._meta.model_name for model in models
        ])

        # Assign all permissions to Admin
        admin_group.permissions.set(permissions)

        # Assign view, add, and change permissions to Manager
        manager_permissions = permissions.filter(codename__in=[
            p.codename for p in permissions if (
                p.codename.startswith("view_") or p.codename.startswith("add_") or p.codename.startswith("change_")
            )
        ])
        manager_group.permissions.set(manager_permissions)

        # Assign view-only permissions to Viewer
        viewer_permissions = permissions.filter(codename__startswith="view_")
        viewer_group.permissions.set(viewer_permissions)

        self.stdout.write(self.style.SUCCESS("Groups and permissions created successfully."))
 
