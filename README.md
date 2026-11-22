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
- **Autenticación:** JSON Web Tokens con `@nestjs/jwt`.
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
│   │   │   │   │   ├── comentario.model.ts
│   │   │   │   │   ├── publicacion.model.ts
│   │   │   │   │   └── usuario.model.ts
│   │   │   │   ├── validators/
│   │   │   │   │   └── validadores.ts
│   │   │   │   ├── autenticacion.service.ts
│   │   │   │   ├── comentarios.service.ts
│   │   │   │   ├── publicaciones.service.ts
│   │   │   │   ├── sesion.service.ts
│   │   │   │   ├── sesion.interceptor.ts
│   │   │   │   ├── vencimiento-sesion.service.ts
│   │   │   │   ├── token.ts
│   │   │   │   └── errores.ts
│   │   │   ├── pages/
│   │   │   │   ├── cargando/
│   │   │   │   ├── login/
│   │   │   │   ├── registro/
│   │   │   │   ├── publicaciones/
│   │   │   │   ├── publicacion-detalle/
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
│   │   │   ├── autenticacion.service.ts
│   │   │   └── token.service.ts
│   │   │
│   │   ├── usuarios/
│   │   │   ├── usuario.schema.ts
│   │   │   ├── usuarios.module.ts
│   │   │   └── usuarios.service.ts
│   │   │
│   │   ├── publicaciones/
│   │   │   ├── dto/
│   │   │   │   ├── crear-comentario.dto.ts
│   │   │   │   ├── crear-publicacion.dto.ts
│   │   │   │   ├── editar-comentario.dto.ts
│   │   │   │   ├── id-comentario.dto.ts
│   │   │   │   ├── id-publicacion.dto.ts
│   │   │   │   ├── listar-comentarios.dto.ts
│   │   │   │   └── listar-publicaciones.dto.ts
│   │   │   ├── comentario.schema.ts
│   │   │   ├── comentarios.controller.ts
│   │   │   ├── comentarios.service.ts
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
| `JWT_SECRET` | Secreto con el que se firman y verifican los tokens JWT. Tiene que ser una cadena larga y aleatoria. Si falta, el backend no arranca. |

Ejemplo de configuración local:

```env
MONGODB_URI=mongodb+srv://usuario:clave@cluster0.xxxxx.mongodb.net/redsocial_dev
FRONT_URL=http://localhost:4200
PORT=3000
CLOUDINARY_CLOUD_NAME=nombre_del_cloud
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
JWT_SECRET=una_cadena_larga_y_aleatoria_de_al_menos_32_caracteres
```

Reemplazar los valores de ejemplo por las credenciales correspondientes. Para desarrollo se recomienda usar una base distinta de la de producción (en el ejemplo, `redsocial_dev`). No compartir ni subir el archivo `.env` al repositorio.

Una forma de generar un `JWT_SECRET` aleatorio:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

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

### Sprint 3 (entregado)

**Frontend (Angular)**
- Página de la publicación (`/publicaciones/:id`): la publicación se ve en grande, con sus comentarios debajo. Se llega con el botón "Comentarios" de cada tarjeta.
- Comentarios: se pueden escribir, se muestran del más reciente al más antiguo, se traen de a 5 y el botón "Cargar más comentarios" suma los siguientes sin perder los anteriores.
- Edición de comentarios: el autor puede editar su comentario y este queda marcado como "(editado)".
- Mi Perfil: cada una de las últimas 3 publicaciones muestra sus 3 comentarios más recientes, con un enlace a la página completa.
- Login y registro guardan el token JWT en el navegador (`localStorage`). El registro deja al usuario con la sesión iniciada.
- Pantalla "Cargando": al iniciar la aplicación muestra un spinner mientras valida el token contra el backend. Si es válido, redirige a Publicaciones; si no, al Login.
- Aviso de vencimiento: a los 10 minutos de sesión aparece un modal que avisa que quedan 5 minutos y pregunta si se quiere extender la sesión. Si se acepta, se refresca el token.
- Si una petición devuelve 401, la sesión se cierra y se redirige al Login con un modal de "Sesión vencida".
- El interceptor HTTP ahora envía el token en el header `Authorization: Bearer <token>`.

**Backend (NestJS)**
- Login y registro generan un token JWT que identifica al usuario y su perfil, y que vence a los 15 minutos. Ambas rutas lo devuelven junto con los datos del usuario.
- `POST /auth/autorizar`: valida que un token sea válido y no esté vencido. Si lo es, devuelve los datos del usuario; si no, responde 401.
- `POST /auth/refrescar`: valida el token y devuelve uno nuevo con los mismos datos y otros 15 minutos de vida.
- `UsuarioActualGuard` pasó de leer el header provisorio `x-usuario-id` a validar el token JWT. El resto de la aplicación no cambió.
- Comentarios: traer los comentarios de una publicación (paginados, más recientes primero), agregar uno nuevo y modificar el propio (queda con `modificado: true`).
- `GET /publicaciones/:id`: trae una sola publicación, para su página.
- Colección `comentarios` (un documento por comentario).

> **Cambio de autenticación:** en el Sprint 2 el frontend identificaba al usuario con el header provisorio `x-usuario-id`. En este sprint se reemplazó por un token JWT, tal como estaba previsto. Una sesión guardada por el Sprint 2 (sin token) se descarta y hay que volver a ingresar.

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
- Token JWT con el id del usuario, su nombre de usuario y su perfil, que vence a los 15 minutos.
- Validación del token (`/auth/autorizar`) y renovación (`/auth/refrescar`).

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

**Comentarios**

| Campo | Regla |
|---|---|
| Mensaje | Obligatorio (no puede ser solo espacios), hasta 350 caracteres. |

**Listado de publicaciones (parámetros de la URL, todos opcionales)**

| Parámetro | Regla | Valor por defecto |
|---|---|---|
| `orden` | `fecha` o `meGusta`. | `fecha` |
| `usuario` | Id de MongoDB válido del autor. | Todos los autores |
| `offset` | Entero mayor o igual a 0. | `0` |
| `limit` | Entero entre 1 y 50. | `10` |

**Listado de comentarios (parámetros de la URL, todos opcionales)**

| Parámetro | Regla | Valor por defecto |
|---|---|---|
| `offset` | Entero mayor o igual a 0. | `0` |
| `limit` | Entero entre 1 y 50. | `5` |

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
- Página individual de cada publicación (`GET /publicaciones/:id`).

### Me gusta

- Un usuario puede dar Me gusta una sola vez a cada publicación y quitarlo cuando quiera.
- Cada Me gusta se guarda como un documento propio en la colección `megustas`, con su fecha de creación, para poder contar los Me gusta por día en estadísticas de sprints posteriores.
- La cantidad de Me gusta se guarda también dentro de la publicación, para poder ordenar por ese valor.

### Comentarios

- Cualquier usuario con sesión puede comentar una publicación.
- Cada comentario se guarda en la colección `comentarios`, con la publicación, el autor, el mensaje, el indicador `modificado` y su fecha de creación.
- Los comentarios se listan del más reciente al más antiguo, paginados con `offset` y `limit`.
- Solo quien escribió un comentario puede editarlo (ni siquiera un administrador). Al editarlo, el comentario queda con `modificado: true` y la pantalla lo muestra como "(editado)".
- Si el texto editado es idéntico al anterior, el comentario no se marca como modificado.
- Si la publicación no existe o está dada de baja, sus comentarios tampoco están disponibles (404).

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

- **AutenticacionService:** casos de uso de registro, login, autorización y refresco del token. No accede directamente a la base.
- **TokenService:** el único lugar que sabe cómo se firma y se verifica un token JWT.
- **UsuariosService:** acceso a la colección `usuarios`.
- **PublicacionesService:** reglas de negocio de publicaciones y Me gusta, y acceso a las colecciones `publicaciones` y `megustas`.
- **ComentariosService:** reglas de negocio de comentarios y acceso a la colección `comentarios`. Para comprobar que la publicación existe usa `PublicacionesService`.
- **AlmacenamientoService:** integración con Cloudinary. Es el único lugar que sabe cómo se suben las imágenes.
- **comun/:** guard y decorador compartidos para identificar al usuario de cada pedido.

Dependencias entre módulos:

```text
AppModule
 ├── UsuariosModule          (exporta UsuariosService)
 ├── AutenticacionModule     (usa UsuariosModule y AlmacenamientoModule; exporta TokenService)
 └── PublicacionesModule     (usa UsuariosModule, AutenticacionModule y AlmacenamientoModule;
                              incluye publicaciones, Me gusta y comentarios)
```

### Frontend

- **core/:** lógica transversal. Servicios que hablan con la API, la sesión, el interceptor, el control del vencimiento de la sesión, los modelos, los validadores y la traducción de errores.
- **pages/:** una carpeta por pantalla. Cada pantalla decide qué se muestra y llama a los servicios.
- **shared/:** piezas reutilizables sin lógica de negocio: el modal, la tarjeta de publicación y el paginador en español.

`PublicacionCard` es un componente de presentación: recibe los datos por entradas (`input`) y avisa lo que hace el usuario mediante salidas (`output`: Me gusta y eliminar). No llama al backend; eso lo decide la pantalla que lo usa. Se reutiliza en Publicaciones, Mi Perfil y la página de la publicación (en versión grande), y permite proyectar contenido adentro (`ng-content`), que Mi Perfil usa para mostrar los comentarios.

Servicios de sesión:

- **SesionService:** guarda el token y los datos del usuario (en memoria y en `localStorage`) y los expone con signals.
- **sesionInterceptor:** agrega el token a cada pedido hacia la API y detecta los 401.
- **VencimientoSesionService:** programa el aviso de vencimiento, ofrece extender la sesión y lleva al login cuando la sesión vence.

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

Todos los mensajes de la aplicación se muestran mediante un servicio de modales reutilizable (`ModalService`), construido sobre Angular Material. También se usa para pedir confirmación antes de eliminar una publicación y para avisar que la sesión está por vencer.

### Autenticación con JWT (Sprint 3)

Login y registro devuelven `{ token, usuario }`. El token se firma con `JWT_SECRET`, vence a los 15 minutos y lleva el id del usuario (`sub`), su nombre de usuario y su perfil. Las rutas protegidas usan `UsuarioActualGuard`, que lee el header `Authorization: Bearer <token>`, verifica la firma y el vencimiento, y busca al usuario en la base. Del token solo se confía en el id: el perfil y el estado habilitado se consultan siempre en la base, así un cambio de rol o una baja se nota en el momento. Ante un token ausente, inválido o vencido, o un usuario inexistente o deshabilitado, la respuesta es la misma (401), para no revelar cuál fue el motivo. Al pasar del header provisorio del Sprint 2 al JWT, solo cambió el interior del guard y el del interceptor del frontend; el resto de la aplicación no se modificó.

El token es independiente del servidor: no se guarda en ningún lado del backend, se valida por su firma. Por eso un token anterior sigue siendo válido hasta que vence, aunque se haya pedido uno nuevo con `/auth/refrescar`. Al refrescar, el payload se arma de nuevo (con los mismos campos) en lugar de copiar el anterior, porque un token ya firmado trae `iat` y `exp`, y la librería rechaza firmar un payload que ya tiene `exp`.

### Token en el navegador

El frontend guarda el token y los datos del usuario en `localStorage`, bajo la clave `firelink.sesion`, para que la sesión sobreviva a una recarga. Una sesión guardada por el Sprint 2 (sin token) se descarta. El interceptor agrega el token solo a los pedidos hacia nuestro backend: el token no sale hacia otros servidores.

### Pantalla "Cargando" y validación del token

La aplicación arranca en `/cargando` (la raíz y las rutas inexistentes redirigen ahí). Esa pantalla muestra un spinner y le pregunta al backend (`/auth/autorizar`) si el token guardado sigue siendo válido:

- Sin token, va directo al Login.
- Con token válido, guarda los datos actuales del usuario que devuelve el backend y va a Publicaciones.
- Si el backend responde 401, borra la sesión guardada y va al Login.
- Si el backend no responde (por ejemplo, Render está despertando), no se borra la sesión: se muestra un mensaje con el botón "Reintentar". Un problema de conexión no dice nada sobre la validez del token.

### Vencimiento y extensión de la sesión

`VencimientoSesionService` lee la fecha de vencimiento del propio token y programa un aviso 5 minutos antes de que venza, es decir, a los 10 minutos de haberlo recibido. Como el cálculo sale del vencimiento del token y no de un contador propio, el aviso no se pierde ni se reinicia al recargar la página. Al aparecer el modal:

- **"Extender sesión":** se pide un token nuevo (`/auth/refrescar`), se guarda y se programa el siguiente aviso.
- **"No, gracias":** no pasa nada; la sesión sigue hasta que venza.

Cada vez que cambia el token (login, refresco, cierre de sesión), el aviso se reprograma automáticamente.

### Error 401 en cualquier petición

El interceptor detecta las respuestas 401 de los pedidos autenticados: cierra la sesión, cierra los modales abiertos, lleva al Login y muestra un único modal de "Sesión vencida". Quedan fuera de este comportamiento las rutas de login, registro y autorizar, donde un 401 tiene otro significado (credenciales incorrectas, o el manejo propio de la pantalla "Cargando"). Solo se actúa si el token de la petición sigue siendo el de la sesión actual, para que una respuesta tardía no cierre una sesión nueva. Mientras se redirige, `ModalService` no muestra los errores de las pantallas que estaban pidiendo datos, para que no se apilen sobre el aviso.

### Comentarios

- **Colección propia:** cada comentario es un documento con su publicación, su autor, el mensaje, `modificado` y su fecha. Un índice sobre `(publicacion, createdAt, _id)` hace rápido el listado de los comentarios de una publicación, del más nuevo al más antiguo.
- **Paginación y "cargar más":** el listado devuelve `{ datos, total, offset, limit }`. El frontend trae 5 comentarios por vez y los suma a los que ya muestra. Como se pagina con `offset`, si otro usuario comenta mientras tanto, un comentario podría repetirse entre páginas: el frontend descarta por id los que ya muestra.
- **Quién puede editar:** solo el autor del comentario. Cualquier otro usuario recibe 403 (el botón "Editar" ni siquiera aparece en pantalla).
- **Publicaciones dadas de baja:** los servicios exigen que la publicación esté habilitada, por lo que, si una publicación se da de baja, sus comentarios dejan de estar disponibles (404) sin lógica adicional.

### Me gusta: índice único y operaciones atómicas

- El índice único `(publicacion, usuario)` de la colección `megustas` garantiza que no existan dos Me gusta del mismo usuario a la misma publicación, aunque lleguen dos pedidos al mismo tiempo. Un Me gusta repetido responde 409.
- La cantidad se actualiza con `$inc`, una operación atómica de MongoDB: dos Me gusta simultáneos no se pisan, como pasaría si se leyera el número, se sumara uno y se guardara.
- La respuesta devuelve el estado nuevo (`cantidadMeGusta` y `meGusta`), así el frontend actualiza solo esa tarjeta sin recargar la página.

### Paginación con offset y limit

El listado devuelve `{ datos, total, offset, limit }`. El total permite armar el paginador, y el orden incluye siempre el `_id` como desempate para que una publicación no se repita ni se salte entre páginas. El listado trae los Me gusta del usuario sobre toda la página con una sola consulta, en lugar de preguntar publicación por publicación. En el frontend, si una página queda vacía porque se eliminaron publicaciones, se vuelve a la última página existente, y se ignoran las respuestas viejas que lleguen fuera de orden.

### Baja lógica

Las publicaciones no se borran: se marcan como no habilitadas. Se conservan los datos, sus Me gusta y sus comentarios, y se pueden recuperar o auditar.

---

## Endpoints principales

Todas las rutas, salvo `/auth/registro`, `/auth/login` y `/salud`, requieren el header `Authorization: Bearer <token>` con un token válido (el que devuelve el login o el registro).

| Método | Ruta | Descripción | Respuestas |
|---|---|---|---|
| POST | `/auth/registro` | Registra un usuario nuevo (`multipart/form-data`). Devuelve `{ token, usuario }`. | 201, 400, 409, 413, 502 |
| POST | `/auth/login` | Verifica las credenciales. Devuelve `{ token, usuario }`. | 200, 400, 401 |
| POST | `/auth/autorizar` | Valida el token. Devuelve los datos del usuario. | 200, 401 |
| POST | `/auth/refrescar` | Valida el token y devuelve uno nuevo (`{ token }`) con otros 15 minutos de vida. | 200, 401 |
| GET | `/publicaciones` | Lista publicaciones. Parámetros: `orden`, `usuario`, `offset`, `limit`. | 200, 400, 401 |
| GET | `/publicaciones/:id` | Trae una publicación. | 200, 400, 401, 404 |
| POST | `/publicaciones` | Crea una publicación (`multipart/form-data`: `titulo`, `descripcion` e `imagen` opcional). | 201, 400, 401, 413, 502 |
| POST | `/publicaciones/:id/me-gusta` | Da Me gusta a una publicación. | 201, 400, 401, 404, 409 |
| DELETE | `/publicaciones/:id/me-gusta` | Quita el Me gusta propio. | 200, 400, 401, 404 |
| DELETE | `/publicaciones/:id` | Baja lógica de una publicación (solo el creador o un administrador). | 204, 400, 401, 403, 404 |
| GET | `/publicaciones/:id/comentarios` | Lista los comentarios de una publicación, los más recientes primero. Parámetros: `offset`, `limit`. | 200, 400, 401, 404 |
| POST | `/publicaciones/:id/comentarios` | Agrega un comentario (`{ "mensaje": "..." }`). | 201, 400, 401, 404 |
| PUT | `/publicaciones/:id/comentarios/:comentarioId` | Modifica el mensaje de un comentario propio (`{ "mensaje": "..." }`) y lo marca como `modificado: true`. | 200, 400, 401, 403, 404 |
| GET | `/salud` | Comprueba el estado del backend y la conexión con MongoDB. | 200 |

Significado de los códigos: 200 operación correcta, 201 recurso creado, 204 operación correcta sin contenido, 400 datos inválidos, 401 credenciales incorrectas o token ausente, inválido o vencido, 403 sin permiso para la acción, 404 el recurso no existe, 409 conflicto (correo o nombre de usuario ya registrado, o Me gusta repetido), 413 imagen demasiado pesada y 502 falla del servicio de imágenes.

---

**Casos incluidos**

| Endpoint | Caso | Resultado esperado |
|---|---|---|
| POST /auth/registro | Datos válidos | 201 con `{ token, usuario }` |
| POST /auth/registro | Correo ya registrado | 409 |
| POST /auth/login | Credenciales correctas | 200 con `{ token, usuario }` |
| POST /auth/login | Contraseña incorrecta | 401 |
| POST /auth/autorizar | Token válido | 200 con los datos del usuario |
| POST /auth/autorizar | Sin token | 401 |
| POST /auth/refrescar | Token válido | 200 con un `{ token }` nuevo |
| GET /publicaciones | Con token | 200 |
| GET /publicaciones | Sin token | 401 |
| GET /publicaciones | Token alterado | 401 |
| GET /publicaciones/:id | Id existente | 200 |
| GET /publicaciones/:id | Id inválido | 400 |
| GET /publicaciones/:id | Id válido que no existe | 404 |
| POST /publicaciones | Datos válidos | 201 |
| POST /publicaciones | Sin título | 400 |
| POST /publicaciones/:id/me-gusta | Primer Me gusta | 201 |
| POST /publicaciones/:id/me-gusta | Me gusta repetido | 409 |
| DELETE /publicaciones/:id/me-gusta | Quitar Me gusta dado | 200 |
| DELETE /publicaciones/:id | Usuario que no es el creador ni administrador | 403 |
| DELETE /publicaciones/:id | Creador de la publicación | 204 |
| POST /publicaciones/:id/comentarios | Mensaje válido | 201 |
| POST /publicaciones/:id/comentarios | Mensaje vacío | 400 |
| POST /publicaciones/:id/comentarios | Mensaje de más de 350 caracteres | 400 |
| GET /publicaciones/:id/comentarios | `?offset=0&limit=5` | 200 con `{ datos, total, offset, limit }` |
| GET /publicaciones/:id/comentarios | `?limit=0` | 400 |
| PUT /publicaciones/:id/comentarios/:comentarioId | Comentario propio | 200 con `modificado: true` |
| PUT /publicaciones/:id/comentarios/:comentarioId | Comentario de otro usuario | 403 |
| PUT /publicaciones/:id/comentarios/:comentarioId | Comentario inexistente | 404 |
| GET /salud | Servidor activo | 200 |

---

## Despliegue

- **Frontend (Vercel):** el directorio raíz del proyecto es `frontend` y el archivo `vercel.json` redirige todas las rutas a `index.html`, para que funcionen las direcciones directas de una aplicación de una sola página.
- **Backend (Render):** el directorio raíz del servicio es `backend`. Las variables de entorno (`MONGODB_URI`, `FRONT_URL`, las de Cloudinary y `JWT_SECRET`) se configuran en el panel del servicio y no forman parte del repositorio. `FRONT_URL` contiene la dirección del frontend desplegado, para permitir sus solicitudes (CORS). `JWT_SECRET` es obligatorio: si falta, el backend no arranca. En producción conviene usar un secreto distinto del que se usa en desarrollo.

---

## Estado del proyecto

Trabajo Práctico N.º 2 — Programación IV.
