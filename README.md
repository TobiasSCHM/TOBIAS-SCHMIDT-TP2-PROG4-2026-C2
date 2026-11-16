# Red Social - TP2 Programación IV

Aplicación web de una red social desarrollada como Trabajo Práctico N.º 2 de Programación IV, UTN Avellaneda, Tecnicatura Universitaria en Programación.

**Alumno:** Tobias Schmidt

**Deploy (frontend):** <COMPLETAR-URL-DE-VERCEL>

**API (backend):** https://tobias-schmidt-tp2-prog4-2026-c2.onrender.com

**Repositorio:** https://github.com/TobiasSCHM/TOBIAS-SCHMIDT-TP2-PROG4-2026-C2

> El backend está alojado en un plan gratuito de Render que se suspende por inactividad. La primera carga después de un rato sin uso puede tardar cerca de un minuto en responder.

---

## Tecnologías

- **Frontend:** Angular 22 y TypeScript, con Angular Material y formularios reactivos.
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
│   │   │   │   │   └── usuario.model.ts
│   │   │   │   ├── validators/
│   │   │   │   │   └── validadores.ts
│   │   │   │   ├── autenticacion.service.ts
│   │   │   │   └── errores.ts
│   │   │   ├── pages/
│   │   │   │   ├── login/
│   │   │   │   ├── registro/
│   │   │   │   ├── publicaciones/
│   │   │   │   └── mi-perfil/
│   │   │   ├── shared/
│   │   │   │   └── modal/
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
│   │   ├── almacenamiento/
│   │   │   ├── almacenamiento.module.ts
│   │   │   └── almacenamiento.service.ts
│   │   │
│   │   ├── publicaciones/
│   │   │   └── publicaciones.module.ts
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
| `FRONT_URL` | Origen permitido para las solicitudes del frontend. |
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

### Usuarios

- Almacenamiento de nombre, apellido, correo electrónico, nombre de usuario y fecha de nacimiento.
- Descripción personal.
- Imagen de perfil opcional.
- Perfil predeterminado `usuario`.
- Soporte para los perfiles `usuario` y `administrador`. El registro público nunca permite elegir el perfil `administrador`.

### Almacenamiento de imágenes

- Integración con Cloudinary mediante subida firmada.
- Carga de imágenes de perfil.
- Restricción de formatos permitidos: JPG, PNG y WEBP.
- Límite de tamaño de archivo de 2 MB.

### Estado del backend

- Endpoint `GET /salud` para verificar el estado del servidor.
- Comprobación del estado de conexión con MongoDB.

---

## Decisiones técnicas

### Separación entre frontend y backend

Se utilizaron Angular y NestJS para separar la interfaz de usuario de la lógica de negocio y el acceso a los datos.

### MongoDB y Mongoose

Se eligió MongoDB Atlas como base de datos y Mongoose para definir esquemas, administrar documentos y realizar consultas. El correo y el nombre de usuario tienen índices únicos, por lo que la base de datos impide duplicados incluso ante solicitudes simultáneas.

### Encriptación de contraseñas

Se utiliza bcryptjs para almacenar hashes de contraseñas en lugar de guardar las contraseñas originales. Esto permite verificar las credenciales sin almacenar el texto plano. El campo de la contraseña no se devuelve en las consultas por defecto.

### Almacenamiento externo de imágenes

Se utiliza Cloudinary para almacenar las imágenes de perfil y guardar sus URLs en la base de datos, evitando almacenar los archivos directamente en MongoDB. Los servicios de hosting gratuitos suelen tener disco efímero, por lo que no es conveniente guardar los archivos en el servidor.

### Validaciones en dos capas

El frontend valida para dar una respuesta inmediata al usuario, y el backend valida para garantizar la seguridad de los datos. Se utiliza el `ValidationPipe` global de NestJS junto con DTOs para validar los datos recibidos por la API y rechazar propiedades que no estén contempladas en los objetos de entrada, como un intento de asignarse el perfil `administrador` al registrarse.

### Modales en lugar de alertas

Todos los mensajes de la aplicación se muestran mediante un servicio de modales reutilizable (`ModalService`), construido sobre Angular Material.

---

## Endpoints principales

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| POST | `/auth/registro` | Registra un usuario nuevo (`multipart/form-data`). | 201, 400, 409, 413 |
| POST | `/auth/login` | Verifica las credenciales e inicia sesión. | 200, 400, 401 |
| GET | `/salud` | Comprueba el estado del backend y la conexión con MongoDB. | 200 |

Significado de los códigos: 201 usuario creado, 200 operación correcta, 400 datos inválidos, 401 credenciales incorrectas, 409 correo o nombre de usuario ya registrado y 413 imagen demasiado pesada.

---

## Pruebas de la API

La colección de Thunder Client se encuentra en `backend/pruebas/coleccion-thunder-client.json`. Incluye un caso de éxito y uno de error por endpoint, con el código de estado esperado. Usa una variable `api` que se configura con la dirección del backend local o desplegado.

---

## Despliegue

- **Frontend (Vercel):** el directorio raíz del proyecto es `frontend` y el archivo `vercel.json` redirige todas las rutas a `index.html`, para que funcionen las direcciones directas de una aplicación de una sola página.
- **Backend (Render):** el directorio raíz del servicio es `backend`. Las variables de entorno (`MONGODB_URI`, `FRONT_URL` y las de Cloudinary) se configuran en el panel del servicio y no forman parte del repositorio. `FRONT_URL` contiene la dirección del frontend desplegado, para permitir sus solicitudes (CORS).

---

## Estado del proyecto

Trabajo Práctico N.º 2 — Programación IV.

Esta versión corresponde al desarrollo del Sprint 1.
