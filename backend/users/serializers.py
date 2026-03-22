from rest_framework import serializers
from django.utils.crypto import get_random_string
from django.contrib.auth import get_user_model
from .validators import validate_user_password
from .services import send_account_setup_email
from .models import User, RoleChoices

User = get_user_model()

class CreateLibrarianSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_user_password])

    class Meta:
        model = User
        fields = [
            'password',
            'first_name', 
            'last_name', 
            'middle_name',
            'email', 
            'phone_number'
        ]


    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already taken.")
        return value
    
    
    def create(self, validated_data):
        validated_data['role'] = RoleChoices.LIBRARIAN
        validated_data['is_active'] = True
        validated_data['pending_password_setup'] = False
        return User.objects.create_user(**validated_data)


class CreateReaderSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            'password',
            'first_name', 
            'last_name', 
            'middle_name',
            'email', 
            'phone_number',
            'actor_type',
            'profession',
            'graduation_date'
        ]


    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already taken.")
        return value


    def create(self, validated_data):
        validated_data['role'] = RoleChoices.READER
        password = validated_data.pop('password', None)
        if password:
            # Бібліотекар задав пароль сам
            validate_user_password(password)
            user = User.objects.create_user(
                **validated_data,
                password=password,
                is_active=True
            )
        else:
            # Генеруємо тимчасовий пароль
            temp_password = get_random_string(20)

            user = User.objects.create_user(
                **validated_data,
                password=temp_password,
                is_active=False
            )

            send_account_setup_email(user)

        return user
    

class UpdateReaderSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'first_name', 
            'last_name', 
            'middle_name',
            'email', 
            'phone_number',
            'actor_type',
            'profession',
            'graduation_date'
        ]


class UpdateLibrarianSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'first_name', 
            'last_name', 
            'middle_name',
            'email', 
            'phone_number'
        ]


class UpdateLibrarianCredentialsSerializer(serializers.Serializer):
    email = serializers.EmailField()
    old_password = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, validators=[validate_user_password])


    def validate(self, attrs):
        user = self.instance
        # Перевірка старого пароля
        if not user.check_password(attrs["old_password"]):
            raise serializers.ValidationError({
                "old_password": "Incorrect old password."
            })

        # Перевірка унікальності email
        if User.objects.filter(email=attrs["email"]).exclude(id=user.id).exists():
            raise serializers.ValidationError({
                "email": "Email already taken."
            })

        return attrs


    def update(self, instance, validated_data):
        password = validated_data['password']
        instance.email = validated_data['email']
        instance.set_password(password)
        instance.save()
        return instance
    

class UpdateReaderCredentialsSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, required=False)


    def validate(self, attrs):
        user = self.instance

        # Перевірка унікальності email
        if User.objects.filter(email=attrs["email"]).exclude(id=user.id).exists():
            raise serializers.ValidationError({
                "email": "Email already taken."
            })

        return attrs


    def update(self, instance, validated_data):
        instance.email = validated_data['email']
        password = validated_data.get('password')
        if password:
            validate_user_password(password)
            instance.set_password(password)
            instance.save()
        else:
            instance.set_password(get_random_string(20))
            instance.is_active = False
            instance.pending_password_setup = True
            instance.save()
            send_account_setup_email(instance)
        return instance
    

class SetupPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True, validators=[validate_user_password])


    def update(self, instance, validated_data):
        password = validated_data['password']
        instance.set_password(password)
        instance.pending_password_setup = False
        instance.is_active = True
        instance.save()
        return instance
    

class UpdateReaderActiveStatusSerializer(serializers.Serializer):
    is_active = serializers.BooleanField()
    end_date = serializers.DateField(allow_null=True)


    def update(self, instance, validated_data):
        instance.is_active = validated_data['is_active']
        instance.end_date = validated_data['end_date']
        instance.save()
        return instance
    

class ReaderDetailSerializer(serializers.ModelSerializer):
    profession_name = serializers.CharField(source="profession.name", read_only=True)
    actor_type_display = serializers.CharField(
        source="get_actor_type_display",
        read_only=True
    )
    class Meta:
        model = User
        fields = [
            'id',
            'first_name', 
            'last_name', 
            'middle_name',
            'email', 
            'phone_number',
            'actor_type',
            'actor_type_display',
            'profession',
            'profession_name',
            'graduation_date',
            'is_active',
            'created_at',
            'updated_at',
            'end_date',
            'role'
        ]


class LibrarianDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'first_name', 
            'last_name', 
            'middle_name',
            'email', 
            'phone_number',
            'created_at',
            'updated_at',
            'role'
        ]


class SuperUserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'first_name', 
            'last_name', 
            'middle_name',
            'email', 
            'phone_number',
            'created_at',
            'updated_at',
            'role'
        ]


class ReadersListSerializer(serializers.ModelSerializer):
    profession_name = serializers.CharField(source="profession.name", read_only=True)
    actor_type_display = serializers.CharField(
        source="get_actor_type_display",
        read_only=True
    )

    class Meta:
        model = User
        fields = [
            'id',
            'first_name', 
            'last_name', 
            'email',
            'actor_type',
            'actor_type_display',
            'profession',
            'profession_name',
            'graduation_date',
            'is_active',
            'created_at'
        ]


class LibrariansListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'first_name', 
            'last_name', 
            'middle_name',
            'email',
            'phone_number',
            'created_at',
            'updated_at'
        ]