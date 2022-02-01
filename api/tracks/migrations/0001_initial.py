# Generated by Django 4.0.1 on 2022-02-01 08:12

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Artist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Mood',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Playlist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('cover', models.URLField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Track',
            fields=[
                ('id', models.CharField(max_length=10, primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=200)),
                ('length', models.IntegerField(default=0)),
                ('bpm', models.IntegerField(default=0)),
                ('featured_artists', models.ManyToManyField(related_name='featured_artist', to='tracks.Artist')),
                ('genres', models.ManyToManyField(related_name='genre', to='tracks.Genre')),
                ('main_artists', models.ManyToManyField(related_name='main_artist', to='tracks.Artist')),
                ('moods', models.ManyToManyField(related_name='mood', to='tracks.Mood')),
            ],
        ),
        migrations.CreateModel(
            name='PlaylistTrack',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('rank', models.FloatField(default=1.0, validators=[django.core.validators.MinValueValidator(1.0)])),
                ('added_at', models.DateTimeField()),
                ('playlist', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tracks', to='tracks.playlist')),
                ('track', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tracks.track')),
            ],
            options={
                'unique_together': {('playlist', 'rank'), ('playlist', 'track')},
            },
        ),
    ]