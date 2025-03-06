from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields= ["id", "username", "password"]
        extra_kwargs = { "password": {"write_only" : True}}

    def create(self, validated_data):
        newUser = User.objects.create_user(**validated_data)
        return newUser
    
class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fiels = ['id','title', 'content', 'created_at', 'auther']
        extra_kwargs = {'auther': {"read_only": True}}