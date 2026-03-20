from django.urls import path
from .views import (CreateLibrarianView, CreateReaderView, CurrentUserView, SetupPasswordView, UpdateLibrarianCredentialsView, UpdateReaderView, 
                    UpdateLibrarianView, UpdateReaderCredentialsView, UpdateReaderActiveStatusView, ProfileView, ReaderDetailView,
                    LibrarianDetailView, ReadersListView, LibrariansListView, ReaderDeleteView, LibrarianDeleteView, LogoutView, ActorsChoicesView)

urlpatterns = [
    path('create-librarian/', CreateLibrarianView.as_view(), name='create-librarian'),
    path('create-reader/', CreateReaderView.as_view(), name='create-reader'),
    path('setup-password/<uidb64>/<token>/', SetupPasswordView.as_view(), name='setup-password'),
    path('update-reader/<uuid:id>/', UpdateReaderView.as_view(), name='update-reader'),
    path('update-librarian/<uuid:id>/', UpdateLibrarianView.as_view(), name='update-librarian'),
    path('update-librarian-credentials/<uuid:id>/', UpdateLibrarianCredentialsView.as_view(), name='update-librarian-credentials'),
    path('update-reader-credentials/<uuid:id>/', UpdateReaderCredentialsView.as_view(), name='update-reader-credentials'),
    path('update-reader-active-status/<uuid:id>/', UpdateReaderActiveStatusView.as_view(), name='update-reader-active-status'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('readers/<uuid:id>/', ReaderDetailView.as_view(), name='reader-detail'),
    path('librarians/<uuid:id>/', LibrarianDetailView.as_view(), name='librarian-detail'),
    path('readers/', ReadersListView.as_view(), name='readers-list'),
    path('librarians/', LibrariansListView.as_view(), name='librarians-list'),
    path('delete-reader/<uuid:id>/', ReaderDeleteView.as_view(), name='delete-reader'),
    path('delete-librarian/<uuid:id>/', LibrarianDeleteView.as_view(), name='delete-librarian'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path("logout/", LogoutView.as_view(), name="logout"),
    path('actors-choices/', ActorsChoicesView.as_view(), name='actors-choices'),
]