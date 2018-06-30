
from django.core.files.storage import FileSystemStorage
from django.db import models
from django.contrib.postgres.fields import ArrayField, JSONField
from .modules.db_fields import Base64Field


#file storage

style_storage = FileSystemStorage(location = '/media/stylesheets')
script_storage = FileSystemStorage(location = '/media/scripts')

# models

class Classes(models.Model):
    name = models.CharField(max_length=512, null=False)
    attributes = JSONField(null=False)


class PageWidthRange(models.Model):
    start_width = models.IntegerField()
    end_width = models.IntegerField()
    ref_width = models.IntegerField()


class Element(models.Model):
    name = models.CharField(max_length=512, null=False, db_index=True)
    id_attr = models.CharField(max_length=512)
    name_attr = models.CharField(max_length=512)
    tag_name = models.CharField(max_length=25, null=False, db_index=True)
    class_name = models.CharField(max_length=512)
    description = models.TextField()
    attributes = JSONField(null=True)
    perc_page_height = models.FloatField(null=False)
    perc_page_width = models.FloatField(null=False)


class Page(models.Model):
    name = models.CharField(max_length=512, null=False, db_index=True)
    description = models.TextField()


class Project(models.Model):
    name = models.CharField(max_length=512, null=False, db_index=True)
    description = models.TextField()


class ScriptFunc(models.Model):
    name = models.CharField(max_length=512, null=False, db_index=True)
    description = models.TextField()
    func = Base64Field(null=False)


class ScriptSheet(models.Model):
    name = models.CharField(max_length=512, null=False, db_index=True)
    file_path = models.FileField(storage=script_storage)
    description = models.TextField()


class StyleSheet(models.Model):
    name = models.CharField(max_length=512, null=False, db_index=True)
    file = models.FileField(storage=style_storage)
    description = models.TextField()


# lookup tables

class ClassesClasses(models.Model):
    classes = models.ForeignKey(Classes, on_delete=models.DO_NOTHING)
    related_classes = ArrayField(models.IntegerField())


class ClassesStylesheet(models.Model):
    classes = models.ForeignKey(Classes, on_delete=models.DO_NOTHING)
    style_sheet = models.ForeignKey(StyleSheet, on_delete=models.DO_NOTHING)


class ElementChildren(models.Model):
    parent = models.ForeignKey(Element, on_delete=models.DO_NOTHING, related_name='parent')
    child = models.ForeignKey(Element, on_delete=models.DO_NOTHING, related_name='child')


class ElementClasses(models.Model):
    classes = models.ForeignKey(Classes, on_delete=models.DO_NOTHING)
    element = models.ForeignKey(Element, on_delete=models.DO_NOTHING)


class PageElement(models.Model):
    element = models.ForeignKey(Element, on_delete=models.DO_NOTHING)
    page = models.ForeignKey(Page, on_delete=models.DO_NOTHING)
    left = models.IntegerField()
    top = models.IntegerField()


class PagePageWidthRange(models.Model):
    page = models.ForeignKey(Page, on_delete=models.DO_NOTHING)
    width_range = models.ForeignKey(PageWidthRange, on_delete=models.DO_NOTHING)


class PageProject(models.Model):
    page = models.ForeignKey(Page, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=True)


class PageScriptSheet(models.Model):
    page = models.ForeignKey(Page, on_delete=models.DO_NOTHING)
    script_sheet = models.ForeignKey(ScriptSheet, on_delete=models.DO_NOTHING)


class PageStylesheet(models.Model):
    page = models.ForeignKey(Page, on_delete=models.DO_NOTHING)
    style_sheet = models.ForeignKey(StyleSheet, on_delete=models.DO_NOTHING)


class ScriptScriptSheet(models.Model):
    script_sheet = models.ForeignKey(ScriptSheet, on_delete=models.DO_NOTHING)
    func = models.ForeignKey(ScriptFunc, on_delete=models.DO_NOTHING)
