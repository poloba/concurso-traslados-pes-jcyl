# Concurso de traslados PES JCYL 2023/2024

**IMPORTANTE**: Los datos estan scrappeados de la web oficial y extraido de los documentos originales en pdf relativos al **concurso de traslados del año 2023/2024**
https://github.com/poloba/concurso-traslados-pes-jcyl/blob/master/python/centros.json

Hay un script hecho en python para calcular la distancia y tiempo con el api de google maps, necesitas una key valida para traerte los datos. Hay que modificar `origin = '42.349797, -3.675550'` para establecer tus coordinadas de origen.
https://github.com/poloba/concurso-traslados-pes-jcyl/blob/master/python/maps.py

El listado por defecto se ordenará según el tiempo al punto de origen, se puede editar en la interfaz web las posiciones de las filas arrastrando las filas cuando estas en el modo editar. Luego te lo puedes bajar como excel.

![Screenshot 2024-11-10 at 18 58 40](https://github.com/user-attachments/assets/81248295-f5d4-46e2-b837-f504764589d7)

### `npm i && npm run start`

Para abrir la app en local [http://localhost:3000](http://localhost:3000)

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Para crear una build de producción

Hecho por Pol Escolar en Noviembre de 2023.
