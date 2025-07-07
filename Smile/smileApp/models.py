from django.db import models
from django.contrib.auth.models import User

# -------------------- ENUM CHOICES --------------------

class Gender(models.TextChoices):
    MALE = 'Male', 'Male'
    FEMALE = 'Female', 'Female'

class ChildStatus(models.TextChoices):
    FULL = 'Full', 'Full'
    HALF = 'Half', 'Half'
    EXITED = 'Inactive', 'Inactive'

# -------------------- MODELS --------------------

class Child(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=Gender.choices)
    birth_date = models.DateField()
    status = models.CharField(max_length=20, choices=ChildStatus.choices, default=ChildStatus.FULL)
    entry_date = models.DateField()
    address = models.TextField(blank=True)
    guardian_name = models.CharField(max_length=100)
    guardian_contact = models.CharField(max_length=100)
    image_data = models.ImageField(upload_to='children_photos/', null=True, blank=True)
    reason = models.CharField(max_length=100)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Sponsor(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    address = models.TextField()
    sponsor_type = models.CharField(max_length=50)
    preferred_contact = models.CharField(max_length=20)

    def __str__(self):
        return self.name

class Donation(models.Model):
    sponsor = models.ForeignKey('Sponsor', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    donation_date = models.DateField()
    payment_method = models.CharField(max_length=100)
    purpose = models.TextField()

    def __str__(self):
        return f"Donation by {self.sponsor.name} - ${self.amount}"

class Program(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    location = models.TextField()

    def __str__(self):
        return self.title

class ChildProgram(models.Model):
    child = models.ForeignKey('Child', on_delete=models.CASCADE, related_name='childprogram')
    program = models.ForeignKey('Program', on_delete=models.CASCADE)
    level = models.CharField(max_length=100)
    assesment = models.BinaryField()
    location = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField()
    fees_per_term = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.child.first_name} - {self.program.title}"

class Staff(models.Model):
    """
    Staff profile extending the built-in User model.
    Role-based access is managed using Django Groups on the User model.
    """

    name = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_profile')
    position = models.CharField(max_length=100, help_text="Staff member's job position/title.")
    is_volunteer = models.BooleanField(default=False, help_text="Indicates if the staff is a volunteer.")
    phone = models.CharField(max_length=20, help_text="Contact phone number.")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Staff"
        verbose_name_plural = "Staff Members"
        ordering = ['-created_at']

    def __str__(self):
        group_names = self.get_group_names()
        return f"{self.name.username} - {group_names}"

    def get_group_names(self):
        """
        Returns a comma-separated list of group names assigned to the user.
        """
        groups = self.name.groups.values_list('name', flat=True)
        return ", ".join(groups) if groups else "No Group"
