import base64

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import TextField


class Base64Field(models.TextField):

    description = "A Base64 field that converts values to a Bas64 string and back"

    def contribute_to_class(self, cls, name):
        if self.db_column is None:
            self.db_column = name
        self.field_name = name + '_base64'
        super(Base64Field, self).contribute_to_class(cls, self.field_name)

    def from_db_value(self, value, expression, connection):
        if value is None:
            return value
        return base64.b64decode(value)

    def to_python(self, value):
        if value is None or len(value) is 0:
            return value
        try:
            return base64.b64encode(value.encode('ascii')).decode('ascii')
        except (TypeError, ValueError):
            raise ValidationError("This value must be a string.")


    def formfield(self, **kwargs):
        from django.db.models import TextField
        defaults = {'form_class': TextField}
        defaults.update(kwargs)
        return super(TextField, self).formfield(**defaults)
