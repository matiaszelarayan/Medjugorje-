from django.core.management.base import BaseCommand
from accounts.models import User

class Command(BaseCommand):
    help = "Crea un usuario administrador y un colaborador por defecto si no existen."

    def handle(self, *args, **options):
        admin_email = "admin@local"
        admin_pass = "admin123"
        colab_email = "colab@local"
        colab_pass = "colab123"

        if not User.objects.filter(email=admin_email).exists():
            User.objects.create_superuser(email=admin_email, password=admin_pass, nombre="Admin", apellido="Sistema")
            self.stdout.write(self.style.SUCCESS(f"Admin creado: {admin_email} / {admin_pass}"))
        else:
            self.stdout.write("Admin ya existe.")

        if not User.objects.filter(email=colab_email).exists():
            User.objects.create_user(email=colab_email, password=colab_pass, nombre="Colab", apellido="Default", rol="colaborador")
            self.stdout.write(self.style.SUCCESS(f"Colaborador creado: {colab_email} / {colab_pass}"))
        else:
            self.stdout.write("Colaborador ya existe.")
