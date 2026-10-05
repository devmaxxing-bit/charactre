import json

from django.http import JsonResponse

from .serializers import CharacterSerializer

def characters(request):
	if request.method != 'POST':
		response = JsonResponse({'detail': 'Метод не поддерживается.'}, status=405)
		response['Allow'] = 'POST'
		return response

	try:
		payload = json.loads(request.body)
	except (json.JSONDecodeError, UnicodeDecodeError):
		return JsonResponse({'errors': {'non_field_errors': ['Некорректный JSON.']}}, status=400)

	serializer = CharacterSerializer(data=payload)
	if not serializer.is_valid():
		return JsonResponse({'errors': serializer.errors}, status=400)

	serializer.save()
	return JsonResponse(serializer.data, status=201)
