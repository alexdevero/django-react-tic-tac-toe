from rest_framework import serializers
from .models import History

class HistorySerializer(serializers.ModelSerializer):
  class Meta:
    model = History
    fields = ('id' ,'title', 'text')
