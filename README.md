# Red Social - TP2 Programación IV

Aplicación web de una red social (FireLink) desarrollada como Trabajo Práctico N.º 2 de Programación IV, UTN Avellaneda, Tecnicatura Universitaria en Programación.

**Alumno:** Tobias Schmidt

**Deploy (frontend):** https://tobias-schmidt-tp2-prog4-c2.vercel.app

**API (backend):** https://tobias-schmidt-tp2-prog4-2026-c2.onrender.com

**Repositorio:** https://github.com/TobiasSCHM/TOBIAS-SCHMIDT-TP2-PROG4-2026-C2

> El backend está alojado en un plan gratuito de Render que se suspende por inactividad. La primera carga después de un rato sin uso puede tardar cerca de un minuto en responder.

---

## Tecnologías

- **Frontend:** Angular 22 y TypeScript, con Angular Material, formularios reactivos y signals.
- **Backend:** NestJS 12 y TypeScript.
- **Base de datos:** MongoDB Atlas.
- **ODM:** Mongoose.
- **Validaciones:** class-validator y class-transformer.
- **Encriptación de contraseñas:** bcryptjs.
- **Almacenamiento de imágenes:** Cloudinary.
- **Pruebas de la API:** Thunder Client.
- **Hosting frontend:** Vercel.
- **Hosting backend:** Render.

---

## Estructura

```text
TOBIAS-SCHMIDT-TP2-PROG4-2026-C2/
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── models/
│   │   │   │   │   ├── publicacion.model.ts
│   │   │   │   │   └── usuario.model.ts
│   │   │   │   ├── validators/
│   │   │   │   │   └── validadores.ts
│   │   │   │   ├── autenticacion.service.ts
│   │   │   │   ├── publicaciones.service.ts
│   │   │   │   ├── sesion.service.ts
│   │   │   │   ├── sesion.interceptor.ts
│   │   │   │   └── errores.ts
│   │   │   ├── pages/
│   │   │   │   ├── login/
│   │   │   │   ├── registro/
│   │   │   │   ├── publicaciones/
│   │   │   │   └── mi-perfil/
│   │   │   ├── shared/
│   │   │   │   ├── modal/
│   │   │   │   ├── publicacion-card/
│   │   │   │   └── paginador-es.ts
│   │   │   ├── app.ts
│   │   │   ├── app.html
│   │   │   ├── app.css
│   │   │   ├── app.config.ts
│   │   │   └── app.routes.ts
│   │   ├── environments/
│   │   │   ├── environment.ts
│   │   │   └── environment.development.ts
│   │   ├── index.html
│   │   └── styles.css
│   └── vercel.json
│
├── backend/
│   ├── src/
│   │   ├── autenticacion/
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   └── registro.dto.ts
│   │   │   ├── autenticacion.controller.ts
│   │   │   ├── autenticacion.module.ts
│   │   │   └── autenticacion.service.ts
│   │   │
│   │   ├── usuarios/
│   │   │   ├── usuario.schema.ts
│   │   │   ├── usuarios.module.ts
│   │   │   └── usuarios.service.ts
│   │   │
│   │   ├── publicaciones/
│   │   │   ├── dto/
│   │   │   │   ├── crear-publicacion.dto.ts
│   │   │   │   ├── id-publicacion.dto.ts
│   │   │   │   └── listar-publicaciones.dto.ts
│   │   │   ├── publicacion.schema.ts
│   │   │   ├── megusta.schema.ts
│   │   │   ├── publicaciones.controllers.ts
│   │   │   ├── publicaciones.module.ts
│   │   │   └── publicaciones.service.ts
│   │   │
│   │   ├── almacenamiento/
│   │   │   ├── almacenamiento.module.ts
│   │   │   └── almacenamiento.service.ts
│   │   │
│   │   ├── comun/
│   │   │   ├── usuario-actual.guard.ts
│   │   │   └── usuario-actual.decorator.ts
│   │   │
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   │
│   ├── pruebas/
│   │   └── coleccion-thunder-client.json
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## Cómo ejecutar el proyecto localmente

### Requisitos

- Node.js 24.x y npm.
- Una instancia de MongoDB Atlas.
- Una cuenta de Cloudinary para el almacenamiento de imágenes.

### 1. Clonar el repositorio

```bash
git clone https://github.com/TobiasSCHM/TOBIAS-SCHMIDT-TP2-PROG4-2026-C2.git
cd TOBIAS-SCHMIDT-TP2-PROG4-2026-C2
```

### 2. Configurar el backend

```bash
cd backend
npm install
```

Crear un archivo `.env` tomando como referencia `.env.example`. Las variables necesarias son:

| Variable | Descripción |
|---|---|
| `MONGODB_URI` | Cadena de conexión a MongoDB Atlas. |
| `FRONT_URL` | Origen permitido para las solicitudes del frontend (varios orígenes se separan con coma). |
| `PORT` | Puerto en el que se ejecuta el backend. |
| `CLOUDINARY_CLOUD_NAME` | Nombre de la cuenta de Cloudinary. |
| `CLOUDINARY_API_KEY` | Clave de API de Cloudinary. |
| `CLOUDINARY_API_SECRET` | Secreto de API de Cloudinary. |

Ejemplo de configuración local:

```env
MONGODB_URI=mongodb+srv://usuario:clave@cluster0.xxxxx.mongodb.net/redsocial_dev
FRONT_URL=http://localhost:4200
PORT=3000
CLOUDINARY_CLOUD_NAME=nombre_del_cloud
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

Reemplazar los valores de ejemplo por las credenciales correspondientes. Para desarrollo se recomienda usar una base distinta de la de producción (en el ejemplo, `redsocial_dev`). No compartir ni subir el archivo `.env` al repositorio.

Iniciar el backend:

```bash
npm run start:dev
```

El servidor queda disponible en `http://localhost:3000`. Para comprobar su funcionamiento y la conexión con MongoDB, acceder a `http://localhost:3000/salud`.

### 3. Configurar el frontend

Abrir una segunda terminal:

```bash
cd frontend
npm install
npm start
```

La aplicación queda disponible en `http://localhost:4200`.

**Conexión con el backend:** el frontend toma la dirección de la API del archivo de entorno que corresponde a cada modo:

| Modo | Comando | Archivo de entorno | API utilizada |
|---|---|---|---|
| Desarrollo | `npm start` | `src/environments/environment.development.ts` | `http://localhost:3000` |
| Producción | `npm run build` (Vercel) | `src/environments/environment.ts` | `https://tobias-schmidt-tp2-prog4-2026-c2.onrender.com` |

### 4. Crear un usuario administrador (opcional)

El registro público siempre crea usuarios con perfil `usuario`. Para probar las acciones de administrador, cambiar el campo `perfil` de un usuario a `"administrador"` directamente en la colección `usuarios` de MongoDB Atlas.

---

## Descripción de los sprints

### Sprint 1 (entregado)

**Frontend (Angular)**
- Pantallas de Registro, Login, Publicaciones y Mi Perfil, con navegación entre ellas.
- Registro con nombre, apellido, correo, nombre de usuario, contraseña, repetir contraseña, fecha de nacimiento, descripción breve e imagen de perfil opcional (con vista previa).
- Login con correo o nombre de usuario.
- Formularios con validaciones y mensajes por campo.
- Todos los mensajes se muestran con modales; no se utiliza `alert()`.
- Favicon propio y diseño uniforme con Angular Material.
- Deploy en hosting.

**Backend (NestJS)**
- Módulos Publicaciones, Autenticación y Usuarios.
- Ruta de registro: valida los datos, guarda la contraseña encriptada y la imagen de perfil, y almacena su URL en la base de datos.
- Ruta de login: verifica las credenciales y devuelve los datos del usuario.

### Sprint 2 (entregado)

**Frontend (Angular)**
- Sesión del usuario: al ingresar se guardan sus datos en el navegador y se mantienen al recargar la página.
- Pantalla de Publicaciones: listado paginado (5, 10 o 20 por página) con orden por más recientes o por más Me gusta.
- Tarjeta de publicación reutilizable (`PublicacionCard`) con autor, fecha, título, descripción, imagen opcional y botón de Me gusta.
- Dar y quitar Me gusta, con actualización inmediata de la tarjeta y bloqueo del botón mientras se procesa.
- Eliminar publicaciones propias, con modal de confirmación.
- Pantalla Mi Perfil: datos del usuario y sus últimas 3 publicaciones.
- Interceptor HTTP que agrega la identificación del usuario a cada pedido hacia la API.
- Paginador de Angular Material traducido al español.
- Mensajes de las pantallas que requieren sesión cuando no se ingresó.

**Backend (NestJS)**
- Módulo Publicaciones completo: alta con imagen opcional, listado paginado con orden y filtro por autor, Me gusta y baja lógica.
- Colección `publicaciones` y colección `megustas` (un documento por cada Me gusta).
- Guard `UsuarioActualGuard` y decorador `@UsuarioActual()` para proteger las rutas de publicaciones.
- Reglas de permisos: solo el creador o un administrador pueden eliminar una publicación.
- Validación de los parámetros de la URL (`orden`, `usuario`, `offset`, `limit` e `id`) con DTOs.

> **Autenticación provisoria:** en este sprint el frontend identifica al usuario con el header `x-usuario-id`, que el backend usa para buscarlo en la base. El perfil y el estado habilitado se leen siempre de la base de datos, nunca del cliente. En el Sprint 3 se reemplaza por un token JWT sin cambiar el resto de la aplicación.

---

## Funcionalidades implementadas

### Autenticación y registro

- Registro de usuarios.
- Inicio de sesión mediante correo electrónico o nombre de usuario.
- Validación de los datos ingresados, tanto en el frontend como en el backend.
- Comprobación de que el correo y el nombre de usuario no estén registrados previamente.
- Verificación de coincidencia entre contraseña y repetición de contraseña.
- Encriptación de contraseñas mediante bcrypt.
- Devolución de los datos públicos del usuario sin exponer su contraseña.
- Mensaje de error único ante credenciales incorrectas, sin indicar si falló el usuario o la contraseña.

### Reglas de validación

**Registro**

| Campo | Regla |
|---|---|
| Nombre y apellido | Obligatorios, hasta 50 caracteres. |
| Correo | Obligatorio, con formato válido. |
| Nombre de usuario | De 3 a 20 caracteres: letras, números o guion bajo. |
| Contraseña | Mínimo 8 caracteres, una mayúscula y un número. |
| Repetir contraseña | Debe coincidir con la contraseña. |
| Fecha de nacimiento | Obligatoria, no puede ser futura. |
| Descripción | Opcional, hasta 200 caracteres. |
| Imagen de perfil | Opcional: JPG, PNG o WEBP de hasta 2 MB. |

**Publicaciones**

| Campo | Regla |
|---|---|
| Título | Obligatorio, hasta 100 caracteres. |
| Descripción | Obligatoria, hasta 1000 caracteres. |
| Imagen | Opcional: JPG, PNG o WEBP de hasta 2 MB. |

**Listado de publicaciones (parámetros de la URL, todos opcionales)**

| Parámetro | Regla | Valor por defecto |
|---|---|---|
| `orden` | `fecha` o `meGusta`. | `fecha` |
| `usuario` | Id de MongoDB válido del autor. | Todos los autores |
| `offset` | Entero mayor o igual a 0. | `0` |
| `limit` | Entero entre 1 y 50. | `10` |

### Usuarios

- Almacenamiento de nombre, apellido, correo electrónico, nombre de usuario y fecha de nacimiento.
- Descripción personal.
- Imagen de perfil opcional.
- Perfil predeterminado `usuario`.
- Soporte para los perfiles `usuario` y `administrador`. El registro público nunca permite elegir el perfil `administrador`.

### Publicaciones

- Alta de publicaciones con título, descripción e imagen opcional, asociadas al usuario que las crea.
- Listado paginado, ordenado por fecha (más nuevas primero) o por cantidad de Me gusta, con filtro opcional por autor.
- Cada publicación del listado incluye los datos públicos del autor (nombre, apellido, nombre de usuario e imagen de perfil, nunca el correo) y un indicador `meGusta` que dice si el usuario que consulta ya le dio Me gusta.
- Las publicaciones dadas de baja no se listan.

### Me gusta

- Un usuario puede dar Me gusta una sola vez a cada publicación y quitarlo cuando quiera.
- Cada Me gusta se guarda como un documento propio en la colección `megustas`, con su fecha de creación, para poder contar los Me gusta por día en estadísticas de sprints posteriores.
- La cantidad de Me gusta se guarda también dentro de la publicación, para poder ordenar por ese valor.

### Baja lógica de publicaciones

- Eliminar una publicación no la borra de la base: queda con `habilitada: false` y deja de listarse.
- Solo pueden eliminarla su creador o un usuario con perfil `administrador`.

### Almacenamiento de imágenes

- Integración con Cloudinary mediante subida firmada.
- Imágenes de perfil (carpeta `redsocial/perfiles`) e imágenes de publicaciones (carpeta `redsocial/publicaciones`).
- Restricción de formatos permitidos: JPG, PNG y WEBP.
- Límite de tamaño de archivo de 2 MB.

### Estado del backend

- Endpoint `GET /salud` para verificar el estado del servidor.
- Comprobación del estado de conexión con MongoDB.

---

## Arquitectura

### Backend

Cada módulo tiene una responsabilidad concreta, y cada servicio se ocupa de una sola cosa:

- **AutenticacionService:** casos de uso de registro y login. No accede directamente a la base.
- **UsuariosService:** acceso a la colección `usuarios`.
- **PublicacionesService:** reglas de negocio de publicaciones y Me gusta, y acceso a las colecciones `publicaciones` y `megustas`.
- **AlmacenamientoService:** integración con Cloudinary. Es el único lugar que sabe cómo se suben las imágenes.
- **comun/:** guard y decorador compartidos para identificar al usuario de cada pedido.

Dependencias entre módulos:

```text
AppModule
 ├── UsuariosModule          (exporta UsuariosService)
 ├── AutenticacionModule     (usa UsuariosModule y AlmacenamientoModule)
 └── PublicacionesModule     (usa UsuariosModule y AlmacenamientoModule)
```

### Frontend

- **core/:** lógica transversal. Servicios que hablan con la API, la sesión, el interceptor, los modelos, los validadores y la traducción de errores.
- **pages/:** una carpeta por pantalla. Cada pantalla decide qué se muestra y llama a los servicios.
- **shared/:** piezas reutilizables sin lógica de negocio: el modal, la tarjeta de publicación y el paginador en español.

`PublicacionCard` es un componente de presentación: recibe los datos por entradas (`input`) y avisa lo que hace el usuario mediante salidas (`output`: Me gusta y eliminar). No llama al backend; eso lo decide la pantalla que lo usa (Publicaciones y Mi Perfil comparten la misma tarjeta).

---

## Decisiones técnicas

### Separación entre frontend y backend

Se utilizaron Angular y NestJS para separar la interfaz de usuario de la lógica de negocio y el acceso a los datos.

### MongoDB y Mongoose

Se eligió MongoDB Atlas como base de datos y Mongoose para definir esquemas, administrar documentos y realizar consultas. El correo y el nombre de usuario tienen índices únicos, por lo que la base de datos impide duplicados incluso ante solicitudes simultáneas.

### Encriptación de contraseñas

Se utiliza bcryptjs para almacenar hashes de contraseñas en lugar de guardar las contraseñas originales. Esto permite verificar las credenciales sin almacenar el texto plano. El campo de la contraseña no se devuelve en las consultas por defecto.

### Almacenamiento externo de imágenes

Se utiliza Cloudinary para almacenar las imágenes de perfil y de publicaciones y guardar sus URLs en la base de datos, evitando almacenar los archivos directamente en MongoDB. Los servicios de hosting gratuitos suelen tener disco efímero, por lo que no es conveniente guardar los archivos en el servidor.

### Validaciones en dos capas

El frontend valida para dar una respuesta inmediata al usuario, y el backend valida para garantizar la seguridad de los datos. Se utiliza el `ValidationPipe` global de NestJS junto con DTOs para validar los datos recibidos por la API y rechazar propiedades que no estén contempladas en los objetos de entrada, como un intento de asignarse el perfil `administrador` al registrarse. Los parámetros de la URL (`id`, `orden`, `offset`, `limit`) también se validan con DTOs: un id mal escrito responde 400 en lugar de provocar un error 500.

### Modales en lugar de alertas

Todos los mensajes de la aplicación se muestran mediante un servicio de modales reutilizable (`ModalService`), construido sobre Angular Material. También se usa para pedir confirmación antes de eliminar una publicación.

### Identificación provisoria del usuario (Sprint 2)

Las rutas de publicaciones están protegidas por `UsuarioActualGuard`, que lee el header `x-usuario-id`, busca al usuario en la base y deja el resultado disponible mediante el decorador `@UsuarioActual()`. Del cliente solo se confía en el id: el perfil y el estado habilitado se consultan siempre en la base. Ante un header ausente, un id inválido, un usuario inexistente o deshabilitado, la respuesta es la misma (401), para no revelar cuál fue el motivo. En el Sprint 3 solo cambia el interior del guard (validar un JWT) y el interceptor del frontend (enviar el token).

### Me gusta: índice único y operaciones atómicas

- El índice único `(publicacion, usuario)` de la colección `megustas` garantiza que no existan dos Me gusta del mismo usuario a la misma publicación, aunque lleguen dos pedidos al mismo tiempo. Un Me gusta repetido responde 409.
- La cantidad se actualiza con `$inc`, una operación atómica de MongoDB: dos Me gusta simultáneos no se pisan, como pasaría si se leyera el número, se sumara uno y se guardara.
- La respuesta devuelve el estado nuevo (`cantidadMeGusta` y `meGusta`), así el frontend actualiza solo esa tarjeta sin recargar la página.

### Paginación con offset y limit

El listado devuelve `{ datos, total, offset, limit }`. El total permite armar el paginador, y el orden incluye siempre el `_id` como desempate para que una publicación no se repita ni se salte entre páginas. El listado trae los Me gusta del usuario sobre toda la página con una sola consulta, en lugar de preguntar publicación por publicación. En el frontend, si una página queda vacía porque se eliminaron publicaciones, se vuelve a la última página existente, y se ignoran las respuestas viejas que lleguen fuera de orden.

### Baja lógica

Las publicaciones no se borran: se marcan como no habilitadas. Se conservan los datos y sus Me gusta, y se pueden recuperar o auditar.

---

## Endpoints principales

Las rutas de `/publicaciones` requieren el header `x-usuario-id` con el id de un usuario existente y habilitado.

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| POST | `/auth/registro` | Registra un usuario nuevo (`multipart/form-data`). | 201, 400, 409, 413, 502 |
| POST | `/auth/login` | Verifica las credenciales y devuelve los datos del usuario. | 200, 400, 401 |
| GET | `/publicaciones` | Lista publicaciones. Parámetros: `orden`, `usuario`, `offset`, `limit`. | 200, 400, 401 |
| POST | `/publicaciones` | Crea una publicación (`multipart/form-data`: `titulo`, `descripcion` e `imagen` opcional). | 201, 400, 401, 413, 502 |
| POST | `/publicaciones/:id/me-gusta` | Da Me gusta a una publicación. | 201, 400, 401, 404, 409 |
| DELETE | `/publicaciones/:id/me-gusta` | Quita el Me gusta propio. | 200, 400, 401, 404 |
| DELETE | `/publicaciones/:id` | Baja lógica de una publicación (solo el creador o un administrador). | 204, 400, 401, 403, 404 |
| GET | `/salud` | Comprueba el estado del backend y la conexión con MongoDB. | 200 |

Significado de los códigos: 200 operación correcta, 201 recurso creado, 204 operación correcta sin contenido, 400 datos inválidos, 401 credenciales incorrectas o usuario no identificado, 403 sin permiso para la acción, 404 el recurso no existe, 409 conflicto (correo o nombre de usuario ya registrado, o Me gusta repetido), 413 imagen demasiado pesada y 502 falla del servicio de imágenes.

---

## Pruebas de la API

La colección de Thunder Client se encuentra en `backend/pruebas/coleccion-thunder-client.json`.

**Cómo usarla**

1. Instalar la extensión Thunder Client en VS Code.
2. En Collections, elegir Import y seleccionar el archivo anterior.
3. Crear (o importar) un entorno con estas variables:
   - `api`: `http://localhost:3000` en local, o `https://tobias-schmidt-tp2-prog4-2026-c2.onrender.com` en producción.
   - `usuarioId`: el `id` que devuelve el login, para el header `x-usuario-id` de las rutas de publicaciones.

**Casos incluidos**

| Endpoint | Caso | Resultado esperado |
|---|---|---|
| POST /auth/registro | Datos válidos | 201 |
| POST /auth/registro | Correo ya registrado | 409 |
| POST /auth/login | Credenciales correctas | 200 |
| POST /auth/login | Contraseña incorrecta | 401 |
| GET /publicaciones | Con usuario identificado | 200 |
| GET /publicaciones | Sin header `x-usuario-id` | 401 |
| POST /publicaciones | Datos válidos | 201 |
| POST /publicaciones | Sin título | 400 |
| POST /publicaciones/:id/me-gusta | Primer Me gusta | 201 |
| POST /publicaciones/:id/me-gusta | Me gusta repetido | 409 |
| DELETE /publicaciones/:id/me-gusta | Quitar Me gusta dado | 200 |
| DELETE /publicaciones/:id | Usuario que no es el creador ni administrador | 403 |
| DELETE /publicaciones/:id | Creador de la publicación | 204 |
| GET /salud | Servidor activo | 200 |

---

## Despliegue

- **Frontend (Vercel):** el directorio raíz del proyecto es `frontend` y el archivo `vercel.json` redirige todas las rutas a `index.html`, para que funcionen las direcciones directas de una aplicación de una sola página.
- **Backend (Render):** el directorio raíz del servicio es `backend`. Las variables de entorno (`MONGODB_URI`, `FRONT_URL` y las de Cloudinary) se configuran en el panel del servicio y no forman parte del repositorio. `FRONT_URL` contiene la dirección del frontend desplegado, para permitir sus solicitudes (CORS).

---

## Estado del proyecto

Trabajo Práctico N.º 2 — Programación IV.

Esta versión corresponde al desarrollo del Sprint 2.
