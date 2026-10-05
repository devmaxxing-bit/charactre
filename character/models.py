from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator


class Character(models.Model):
	CHARACTER_CLASSES = [
		('Воин', 'Воин'),
		('Маг', 'Маг'),
		('Лучник', 'Лучник'),
		('Разбойник', 'Разбойник'),
	]
	WEAPONS = [
		('Меч', 'Меч'),
		('Посох', 'Посох'),
		('Лук', 'Лук'),
		('Кинжалы', 'Кинжалы'),
	]

	name = models.CharField(max_length=100)
	character_class = models.CharField(max_length=30, choices=CHARACTER_CLASSES)
	level = models.PositiveSmallIntegerField(
		validators=[MinValueValidator(1), MaxValueValidator(100)]
	)
	weapon = models.CharField(max_length=30, choices=WEAPONS)
	description = models.CharField(max_length=500, blank=True)

	def __str__(self):
		return self.name
