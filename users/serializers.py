from rest_framework import serializers
from django.utils.crypto import get_random_string
from django.contrib.auth import get_user_model
from .validators import validate_user_password, validate_username
from .services import send_account_setup_email
from .models import User, RoleChoices

User = get_user_model()

class CreateLibrarianSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=20, validators=[validate_username])
    password = serializers.CharField(write_only=True, validators=[validate_user_password])

    class Meta:
        model = User
        fields = [
            'username',
            'password',
            'first_name', 
            'last_name', 
            'middle_name',
            'email', 
            'phone_number'
        ]
    
    
    def create(self, validated_data):
        validated_data['role'] = RoleChoices.LIBRARIAN
        validated_data['is_active'] = True
        return User.objects.create_user(**validated_data)


class CreateReaderSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length=20, validators=[validate_username])
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            'username',
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
    username = serializers.CharField(max_length=20)
    old_password = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, validators=[validate_user_password])


    def validate(self, attrs):
        user = self.instance
        # Перевірка старого пароля
        if not user.check_password(attrs["old_password"]):
            raise serializers.ValidationError({
                "old_password": "Incorrect old password."
            })

        # Перевірка унікальності username
        if User.objects.filter(username=attrs["username"]).exclude(id=user.id).exists():
            raise serializers.ValidationError({
                "username": "Username already taken."
            })

        return attrs



    def update(self, instance, validated_data):
        password = validated_data['password']
        instance.username = validated_data['username']
        instance.set_password(password)
        instance.save()
        return instance
    

class UpdateReaderCredentialsSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True, required=False)


    def validate(self, attrs):
        user = self.instance

        # Перевірка унікальності username
        if User.objects.filter(username=attrs["username"]).exclude(id=user.id).exists():
            raise serializers.ValidationError({
                "username": "Username already taken."
            })

        return attrs


    def update(self, instance, validated_data):
        instance.username = validated_data['username']
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
    end_date = serializers.DateField()


    def update(self, instance, validated_data):
        instance.is_active = validated_data['is_active']
        instance.end_date = validated_data['end_date']
        instance.save()
        return instance
    

class ReaderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'first_name', 
            'last_name', 
            'middle_name',
            'email', 
            'phone_number',
            'actor_type',
            'profession',
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
            'username',
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
    class Meta:
        model = User
        fields = [
            'id',
            'first_name', 
            'last_name', 
            'middle_name',
            'actor_type',
            'profession',
            'is_active'
        ]


class LibrariansListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'first_name', 
            'last_name', 
            'middle_name'
        ]