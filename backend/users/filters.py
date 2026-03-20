import django_filters
from .models import User


class ReaderFilter(django_filters.FilterSet):
    graduation_from = django_filters.DateFilter(
        field_name="graduation_date",
        lookup_expr="gte"
    )

    graduation_to = django_filters.DateFilter(
        field_name="graduation_date",
        lookup_expr="lte"
    )

    class Meta:
        model = User
        fields = ["actor_type", "profession", "is_active"]