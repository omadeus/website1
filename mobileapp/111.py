from django.core.files.storage import FileSystemStorage
from django.http import HttpResponse
from .models import Database

c = Database.objects.last()
id = c.id
print(id)