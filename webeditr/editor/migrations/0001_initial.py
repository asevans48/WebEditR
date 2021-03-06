# Generated by Django 2.0.5 on 2018-07-25 18:57

import django.contrib.postgres.fields
import django.contrib.postgres.fields.jsonb
import django.core.files.storage
from django.db import migrations, models
import django.db.models.deletion
import editor.modules.db_fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Background',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=512)),
                ('background_css', django.contrib.postgres.fields.jsonb.JSONField()),
            ],
        ),
        migrations.CreateModel(
            name='Classes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=512)),
                ('attributes', django.contrib.postgres.fields.jsonb.JSONField()),
            ],
        ),
        migrations.CreateModel(
            name='ClassesClasses',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('related_classes', django.contrib.postgres.fields.ArrayField(base_field=models.IntegerField(), size=None)),
                ('classes', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.Classes')),
            ],
        ),
        migrations.CreateModel(
            name='ClassesStylesheet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('classes', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.Classes')),
            ],
        ),
        migrations.CreateModel(
            name='Element',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=512)),
                ('id_attr', models.CharField(max_length=512)),
                ('name_attr', models.CharField(max_length=512)),
                ('tag_name', models.CharField(db_index=True, max_length=25)),
                ('class_name', models.CharField(max_length=512)),
                ('description', models.TextField()),
                ('attributes', django.contrib.postgres.fields.jsonb.JSONField(null=True)),
                ('css_attributes', django.contrib.postgres.fields.jsonb.JSONField(null=True)),
                ('perc_page_height', models.FloatField()),
                ('perc_page_width', models.FloatField()),
            ],
        ),
        migrations.CreateModel(
            name='ElementChildren',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('child', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='child', to='editor.Element')),
            ],
        ),
        migrations.CreateModel(
            name='ElementClasses',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('classes', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.Classes')),
                ('element', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.Element')),
            ],
        ),
        migrations.CreateModel(
            name='ElementContent',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('element', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.Element')),
            ],
        ),
        migrations.CreateModel(
            name='ExternalScriptSheet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=512)),
                ('url', models.URLField()),
            ],
        ),
        migrations.CreateModel(
            name='ExternalStyleSheet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=512)),
                ('url', models.URLField()),
            ],
        ),
        migrations.CreateModel(
            name='Page',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=512)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='PageBackground',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('background', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.Background')),
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.Page')),
            ],
        ),
        migrations.CreateModel(
            name='PageElement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('left', models.IntegerField()),
                ('top', models.IntegerField()),
                ('element', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.Element')),
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.Page')),
            ],
        ),
        migrations.CreateModel(
            name='PageExternalScriptSheet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.Page')),
                ('script_sheet', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.ExternalScriptSheet')),
            ],
        ),
        migrations.CreateModel(
            name='PageExternalStylesheet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.Page')),
                ('style_sheet', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.ExternalStyleSheet')),
            ],
        ),
        migrations.CreateModel(
            name='PagePageWidthRange',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.Page')),
            ],
        ),
        migrations.CreateModel(
            name='PageProject',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='editor.Page')),
            ],
        ),
        migrations.CreateModel(
            name='PageScriptSheet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.Page')),
            ],
        ),
        migrations.CreateModel(
            name='PageStylesheet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('page', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.Page')),
            ],
        ),
        migrations.CreateModel(
            name='PageWidthRange',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_width', models.IntegerField()),
                ('end_width', models.IntegerField()),
                ('ref_width', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Project',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=512)),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='ProjectElement',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('element', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.Element')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.Project')),
            ],
        ),
        migrations.CreateModel(
            name='ProjectStylesheet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('project', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.Project')),
            ],
        ),
        migrations.CreateModel(
            name='ScriptFunc',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=512)),
                ('description', models.TextField()),
                ('func_base64', editor.modules.db_fields.Base64Field(db_column='func')),
            ],
        ),
        migrations.CreateModel(
            name='ScriptScriptSheet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('func', models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.ScriptFunc')),
            ],
        ),
        migrations.CreateModel(
            name='ScriptSheet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=512)),
                ('file_path', models.FileField(storage=django.core.files.storage.FileSystemStorage(location='/media/scripts'), upload_to='')),
                ('description', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='StyleSheet',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=512)),
                ('file', models.FileField(storage=django.core.files.storage.FileSystemStorage(location='/media/stylesheets'), upload_to='')),
                ('description', models.TextField()),
            ],
        ),
        migrations.AddField(
            model_name='scriptscriptsheet',
            name='script_sheet',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.ScriptSheet'),
        ),
        migrations.AddField(
            model_name='projectstylesheet',
            name='style_sheet',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.StyleSheet'),
        ),
        migrations.AddField(
            model_name='pagestylesheet',
            name='style_sheet',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.StyleSheet'),
        ),
        migrations.AddField(
            model_name='pagescriptsheet',
            name='script_sheet',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.ScriptSheet'),
        ),
        migrations.AddField(
            model_name='pageproject',
            name='project',
            field=models.ForeignKey(on_delete=True, to='editor.Project'),
        ),
        migrations.AddField(
            model_name='pagepagewidthrange',
            name='width_range',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.PageWidthRange'),
        ),
        migrations.AddField(
            model_name='elementchildren',
            name='page',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.Page'),
        ),
        migrations.AddField(
            model_name='elementchildren',
            name='parent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='parent', to='editor.Element'),
        ),
        migrations.AddField(
            model_name='classesstylesheet',
            name='style_sheet',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, to='editor.StyleSheet'),
        ),
    ]
