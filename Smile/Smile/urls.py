from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Custom token view and user profile view
from smileApp.views import CustomTokenObtainPairView, get_user_profile

# Simple JWT's token refresh view
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # ✅ Custom JWT token obtain endpoint
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # ✅ Standard JWT token refresh endpoint
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ✅ User profile endpoint
    path("api/user/profile/", get_user_profile, name="get_user_profile"),

    # ✅ SmileApp routes
    path('api/', include('smileApp.urls')),
]

# ✅ Media file serving in development
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
