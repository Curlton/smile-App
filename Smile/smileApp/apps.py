from django.apps import AppConfig

class SmileAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'smileApp'

    def ready(self):
        pass
        #import smileApp.signals  # Make sure this line is indented inside the method
