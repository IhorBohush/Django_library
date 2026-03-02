from django.urls import path
from .views import (CreateLibrarianView, CreateReaderView, SetupPasswordView, UpdateLibrarianCredentialsView, UpdateReaderView, 
                    UpdateLibrarianView, UpdateReaderCredentialsView, UpdateReaderActiveStatusView, ProfileView, ReaderDetailView,
                    LibrarianDetailView, ReadersListView, LibrariansListView, ReaderDeleteView, LibrarianDeleteView, LogoutView)

urlpatterns = [
    path('create-librarian/', CreateLibrarianView.as_view(), name='create-librarian'),
    path('create-reader/', CreateReaderView.as_view(), name='create-reader'),
    path('setup-password/<uidb64>/<token>/', SetupPasswordView.as_view(), name='setup-password'),
    path('update-reader/<uuid:user_id>/', UpdateReaderView.as_view(), name='update-reader'),
    path('update-librarian/<uuid:user_id>/', UpdateLibrarianView.as_view(), name='update-librarian'),
    path('update-librarian-credentials/<uuid:user_id>/', UpdateLibrarianCredentialsView.as_view(), name='update-librarian-credentials'),
    path('update-reader-credentials/<uuid:user_id>/', UpdateReaderCredentialsView.as_view(), name='update-reader-credentials'),
    path('update-reader-active-status/<uuid:user_id>/', UpdateReaderActiveStatusView.as_view(), name='update-reader-active-status'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('readers/<uuid:user_id>/', ReaderDetailView.as_view(), name='reader-detail'),
    path('librarians/<uuid:user_id>/', LibrarianDetailView.as_view(), name='librarian-detail'),
    path('readers/', ReadersListView.as_view(), name='readers-list'),
    path('librarians/', LibrariansListView.as_view(), name='librarians-list'),
    path('delete-reader/<uuid:user_id>/', ReaderDeleteView.as_view(), name='delete-reader'),
    path('delete-librarian/<uuid:user_id>/', LibrarianDeleteView.as_view(), name='delete-librarian'),
    path("logout/", LogoutView.as_view(), name="logout"),
]