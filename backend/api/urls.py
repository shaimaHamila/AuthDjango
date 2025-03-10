from django.urls import path
from . import views
urlpatterns = [
    # path('user/register/', CreateUserView.as_view(), name= "register"),
    path("notes/", views.NoteListCreate.as_view(), name='note-list'),
    path("notes/edit/<int:pk>/", views.NoteUpdate.as_view(), name="edit-note"), 
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name= "delte-note")
]