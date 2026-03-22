from rest_framework.viewsets import ModelViewSet
from users.permissions import IsLibrarian, IsLibrarianOrSuperUser
from .models import Profession
from .serializers import ProfessionSerializer


class ProfessionViewSet(ModelViewSet):
    queryset = Profession.objects.all()
    serializer_class = ProfessionSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [IsLibrarianOrSuperUser()]
        return [IsLibrarian()]