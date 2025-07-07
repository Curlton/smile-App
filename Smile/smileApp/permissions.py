from rest_framework.permissions import BasePermission, SAFE_METHODS
import logging

logger = logging.getLogger(__name__)


class RoleBasedPermission(BasePermission):
    """
    Role-based permission class using Django Groups:
    - Superusers: Full access
    - Admin group: Full access
    - Manager group: All methods except DELETE
    - Viewer group: Read-only access to specific views
    - Others: No access
    """

    def has_permission(self, request, view):
        user = request.user

        if not user or not user.is_authenticated:
            logger.info("Access denied: User not authenticated.")
            return False

        # ✔ Superusers always allowed
        if user.is_superuser:
            logger.debug(f"Access granted: User '{user.username}' is superuser.")
            return True

        # Get user's group names (lowercase for uniform comparison)
        groups = list(user.groups.values_list('name', flat=True))
        groups_lower = [g.lower() for g in groups]
        method = request.method

        # ✔ Admin group: full access
        if 'admin' in groups_lower:
            logger.debug(f"Access granted: User '{user.username}' in 'admin' group.")
            return True

        # ✔ Manager group: all except DELETE
        if 'manager' in groups_lower:
            if method == 'DELETE':
                logger.info(f"Access denied: Manager '{user.username}' attempted DELETE.")
                return False
            logger.debug(f"Access granted: Manager '{user.username}' with method {method}.")
            return True

        # ✔ Viewer group: safe methods only on specific views
        if 'viewer' in groups_lower:
            if method not in SAFE_METHODS:
                logger.info(f"Access denied: Viewer '{user.username}' attempted unsafe method '{method}'.")
                return False

            allowed_views = {
                'childsummaryview',  # APIView class name lowercased
                'childdetailview',   # APIView class name lowercased
                'childprogram',      # ViewSet basename lowercased
                'program',           # ViewSet basename lowercased
            }
            view_name = (getattr(view, 'basename', None) or view.__class__.__name__).lower()

            if view_name in allowed_views:
                logger.debug(f"Access granted: Viewer '{user.username}' accessing '{view_name}'.")
                return True
            else:
                logger.info(f"Access denied: Viewer '{user.username}' tried to access '{view_name}'.")
                return False

        # ❌ No allowed group found
        logger.info(f"Access denied: User '{user.username}' with groups {groups} not permitted.")
        return False

    def has_object_permission(self, request, view, obj):
        # Apply the same logic for object-level permissions
        return self.has_permission(request, view)
