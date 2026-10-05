class CharacterSerializer:
    fields = {'name', 'character_class', 'level', 'weapon', 'description'}

    def __init__(self, data=None, instance=None):
        self.initial_data = data
        self.instance = instance
        self.validated_data = None
        self.errors = {}

    def is_valid(self):
        from .models import Character

        if not isinstance(self.initial_data, dict):
            self.errors = {'non_field_errors': ['Ожидается JSON-объект.']}
            return False

        errors = {}
        unknown_fields = set(self.initial_data) - self.fields
        if unknown_fields:
            errors['non_field_errors'] = [
                f'Неизвестные поля: {", ".join(sorted(unknown_fields))}.'
            ]

        name = self.initial_data.get('name')
        if not isinstance(name, str) or not name.strip():
            errors['name'] = ['Укажите имя персонажа.']
        elif len(name.strip()) > 100:
            errors['name'] = ['Имя не должно превышать 100 символов.']

        character_class = self.initial_data.get('character_class')
        valid_classes = {value for value, _ in Character.CHARACTER_CLASSES}
        if character_class not in valid_classes:
            errors['character_class'] = ['Выберите допустимый класс персонажа.']

        level = self.initial_data.get('level')
        if isinstance(level, bool) or not isinstance(level, int) or not 1 <= level <= 100:
            errors['level'] = ['Уровень должен быть целым числом от 1 до 100.']

        weapon = self.initial_data.get('weapon')
        valid_weapons = {value for value, _ in Character.WEAPONS}
        if weapon not in valid_weapons:
            errors['weapon'] = ['Выберите допустимое оружие.']

        description = self.initial_data.get('description', '')
        if not isinstance(description, str):
            errors['description'] = ['Описание должно быть текстом.']
        elif len(description) > 500:
            errors['description'] = ['Описание не должно превышать 500 символов.']

        self.errors = errors
        if errors:
            return False

        self.validated_data = {
            'name': name.strip(),
            'character_class': character_class,
            'level': level,
            'weapon': weapon,
            'description': description.strip(),
        }
        return True

    def save(self):
        if self.validated_data is None:
            raise ValueError('Call is_valid() before save().')
        from .models import Character

        self.instance = Character.objects.create(**self.validated_data)
        return self.instance

    def data(self):
        if self.instance is None:
            return None
        return {
            'id': self.instance.pk,
            'name': self.instance.name,
            'character_class': self.instance.character_class,
            'level': self.instance.level,
            'weapon': self.instance.weapon,
            'description': self.instance.description,
        }