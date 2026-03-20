from rest_framework.routers import DefaultRouter
from .views import BookViewSet, BookCopyViewSet, AttachmentViewSet

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='book')
router.register(r'book-copies', BookCopyViewSet, basename='book-copy')
router.register(r'attachments', AttachmentViewSet, basename='attachment')

urlpatterns = router.urls