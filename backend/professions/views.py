from rest_framework.viewsets import ModelViewSet
from users.permissions import IsLibrarian
from .models import Profession
from .serializers import ProfessionSerializer


class ProfessionViewSet(ModelViewSet):
    queryset = Profession.objects.all()
    serializer_class = ProfessionSerializer
    permission_classes = [IsLibrarian]