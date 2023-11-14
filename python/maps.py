import googlemaps
import json

# Tu API Key
gmaps = googlemaps.Client(key='')

# Carga tu archivo JSON
with open('centros.json', 'r') as file:
    data = json.load(file)

# Coordenadas de Burgos
origin = '42.349797, -3.675550'

# Procesa cada objeto en el archivo JSON
for item in data:
    destination = f"{item['posicion']['latitud']},{item['posicion']['longitud']}"
    result = gmaps.directions(origin, destination, mode="driving", alternatives=False)

    # Extrae la distancia y el tiempo
    if result:
        distance = result[0]['legs'][0]['distance']['text']
        duration = result[0]['legs'][0]['duration']['text']

        # Actualiza el JSON
        item['distancia'] = {
            'km': distance,
            'tiempo': duration
        }

# Guarda los cambios en el archivo JSON
with open('centros_actualizado.json', 'w') as file:
    json.dump(data, file, indent=4, ensure_ascii=False)