# Generated by Django 3.0.3 on 2022-04-18 08:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_task_description'),
    ]

    operations = [
        migrations.RenameField(
            model_name='task',
            old_name='description',
            new_name='desc',
        ),
    ]