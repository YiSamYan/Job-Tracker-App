# Generated by Django 5.1.1 on 2024-09-20 17:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('jobs', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='status',
            field=models.CharField(choices=[('applied', 'Applied'), ('interviewing', 'Interviewing'), ('rejected', 'Rejected'), ('offered', 'Offered'), ('n/a', 'N/A')], default='n/a', max_length=20),
        ),
    ]
