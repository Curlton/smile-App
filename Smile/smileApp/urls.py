from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ChildViewSet, SponsorViewSet, DonationViewSet,
    ProgramViewSet, ChildProgramViewSet, StaffViewSet,
    ChildSummaryView, ChildDetailView, get_user_profile,
    UserViewSet  # <-- add this import
)

router = DefaultRouter()
router.register(r'children', ChildViewSet)
router.register(r'sponsors', SponsorViewSet)
router.register(r'donations', DonationViewSet)
router.register(r'programs', ProgramViewSet)
router.register(r'childprograms', ChildProgramViewSet)
router.register(r'staffs', StaffViewSet)
router.register(r'users', UserViewSet)  # <-- register user endpoint here

urlpatterns = [
    # Include all standard CRUD via router
    path('', include(router.urls)),

    # Custom endpoints for children summary & detail
    path('children-summary/', ChildSummaryView.as_view(), name='children_summary'),
    path('children-detail/<int:pk>/', ChildDetailView.as_view(), name='child_detail'),

    # User profile
    path('user/profile/', get_user_profile, name='get_user_profile'),
]

