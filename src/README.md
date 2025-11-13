

## Endpoints de autenticacion:
## /api/auth

-Registro de nuevo usuario
/register'

POST: 

Body:
json 
{
    email,
    name,
    password
}

RESPUESTA: 
json
{
    ok: true,
    message: `Registro exitoso para dan.bsas22@gmail.com`,
    usuario: created_user
}

-----------------------------------

-Inicio de sesión / Autenticación:

/login

POST

BODY

json:
{
    email,
    password
}

RESPUESTA:
json

{
    ok: true,
    message: 'Loguin exitoso',
    status: 200,
    data: {
        authorization_token: Token de autorización JWT,
        user:'Juse@123',
        email:'dan.bsas22@gmail.com'
}

-----------------------------------


-Validación de autenticación :

/verify-email/:verification_token

PARAMS:
Authorization: Bearer token


RESPUESTA:
json

{
    ok: true,
    status: 200,
    message: 'Usuario validado ok',
    user_id:id de usuario,
    user_name:Nombre de usuariio,
    user_email:mail de usuario
    
}

-----------------------------------


## Endpoints de workspaces:
## /api/workspaces

Obtención de todos los Workspaces activos:

/

GET:

NO RECIBE PARAMETROS

RESPUESTA:

{
    status:201,
    message:`Workspaces encontrados del usuario: dan.bsas22@gmail.com`,
    ok:true,
    data: [workspaces]
}

-----------------------------------


-Creacion de nuevo Workspace:

/new_workspace

POST:

BODY:
json

{
    nam,
    image
}


RESPUESTA:
json

{
    ok: ok,
    status: status,
    message: msg,
    workspace_id: 120
}

-----------------------------------

Obtencion de un Workspace por ID:

/:workspace_id

PARAMS: id de workspace buscado

RESPUESTA:
json

{
    ok: true,
    message: `Workspace: encontrado`,
    data: {
    workspace: Object workspace
    }
}

-----------------------------------

Actualización de Workspace por id.
(Se usa actualmente para eliminación logica)

/update/:workspace_id

PARAMS: id de workspace

{
    "img_workspace": ""
}
*Actualmente se utiliza solo para baja lógica, los parametros que se envian por Body no son utilizados.
*Estta adaptado apra que a futuro se envie nombre de campo y dato como en el ejemplo para hacer update 
de cualeuier atributo que no sea restringido

-----------------------------------

Eliminadión de usuario:

/delete/:workspace_id
Actualmente en desuso, preparado apra cuando se deje de usar /update/:workspace_id para 
eliminación lógica.

-----------------------------------
/workspace/:workspace_name

Obtener un Workspace por el nombre:

*Actualmente no se utiliza desde el front-end

PARAMS: Nombre del workspace consultado:

RESPUESTA:
json

{
    ok: true,
    message: `Workspace: ${workspace_name} encontrado`,
    data: {
        workspace: workspace
    }
}

-----------------------------------

## Endpoints de usuarios:
## /api/users

Obtencion de todos los usuarios activos:
/

No recibe parametros

RESPUESTA
json

{
    ok: true,
    message: 'usuarios obtenidos correctamente',
    status: 201,
    data:
    {
        users: lista de objetos de usuarios
    }
}

-----------------------------------

Obtencion de un usuario por id:

/:user_id

PARAMS: id de usuario

RESPUESTA:
json

{
    ok: true,
    message: `Usuario  encontrado`,
    status: 201,
    data: {
        user: id de usuario,
        user_name: Carlos,
        user_email: dan.bsas22@gmail.com
    }
}

-----------------------------------

Modificación de un usuario por id:
/update/:user_id

PARAMS: id de usuario.

BODY:
json

{
    "campo_a_actualizar":"valor"
}

RESPUESTA:
json

{
    ok:true,
    message:'Se envio usuario',
    user: Objet usuario
}

-----------------------------------

Validación de sesión de usuario desde el midleware de autenticación:

/get_user/get

No recibe parametros de entrada.

RESPUESTA:
json

{
    ok:true,
    message:'Se envio usuario',
    user:request.user
}

-----------------------------------

## Endpoints de miembros/workspaces:
## /api/workspace_member

Agregado de un miembro a un workspace:

/:workspace_id/add_member

PARAMS: id de workspace

BODY
json

{
    user_id: 28
}


RESPUESTA:
json

{
    ok: true,
    message: 'Miembro creado para el workspace',
    status: status,
}
-----------------------------------

Eliminacion de miembro de un workspace:

/delete_member/:workspace_id

PARAMS: id de workspace

BODY:
json

{
    user_id: 28
}

RESPUESTA:
json

{
    ok: true,
    status: 404,
    message: `Miembro NOMBRE DE MIEMBRO eliminado correctamente del workspace NOMBRE DE WORKSPACE`
}

-----------------------------------

Obtencion de miembros activoas de un workspace:

/:workspace_id/member_workspace

PARAMS: id de workspace

BODY:
json

{
    user_id: 28
}

RESPUESTA:
json
{
        ok: true,
        status: 404,
        message: `Miembro NOMBRE DE MIEMBRO eliminado correctamente del workspace NOMBRE DE WORKSPACE`
}

-----------------------------------

Invitación a miembros a un workspace.

/invite/:workspace_id

BODY:
json

{
    members,
    workspace_id 
}
*members es una lista de miembros, ya que se pueden invitar a varios a la vez.
En caso de que el mail recibido no sea de un miembro se envia mail ofreciendo 
registrarse en la aplicación (Invitacion a Slack)

-----------------------------------
Confirmacion de invitación a un Workspace:

/confirm-invitation/:verification_token

PARAMS: Token de verificación recibido por mail

RESPUESTA:
Redirección a ruta de login de frontend:

response.redirect(`${ENVIRONMENT.URL_FRONTEND}/login`)

-----------------------------------

Obtener miembros de un workspace:

/get_by_workspaces/get_members

BODY:
json

{
    workspace_id: 300
}

RESPUESTA: 
json

{
    ok: true,
    status: 201,
    message: "Miembros encontrados",
    members: cantidad de miembros,
    data: lista Objets de miembro
}

-----------------------------------

Obtencion de workspaces de un miembro:
/get_by_member/get_workspaces

BODY:

RESPUESTA:
json

{
    ok: true,
    status: 201,
    message: "Workspaces encontrados",
    workspaces: workspaces.length,
    data: workspaces
}

-----------------------------------

Obtencion de los miembros de los workspace del usuario activo
(para mostrar en la lista de workspaces del usuario)

/getmembers_of_my_wp/

No recibe aprametros de ingreso, se utilizan los datos de susesión para obtener los listados.
Se obtienen con su id de usuario.

RESPUESTA:
json

{
    ok:true,
    status:200,
    data:listado de Objets de miembros,
    message:'Se envian miembros correctamente'
}

-----------------------------------


## Endpoints de canales:
## /api/channels

Crear canal para el workspace
Se usa principalemente para crear el canal por default cuando se crea el nuevo Workspace:

/create/:workspace_id'


PARAMS: id de workspace

BODY
json

{
    name: Nombre de canal
}

RESPONSE:
json

{
ok: true,
status: 201,
message: "Canal creado con éxito",
data: {
    channels: Objet de canal creado,
}
}

-----------------------------------

Obtener canales de un workspace para el usuario de la sesión:
(el usuario debe pertenecer al canal)

/get_channel_by_workspace/:workspace_id

PARAMS: id de workspace

BODY
json

{
    ok: true,
    status: 200,
    message: "Lista de canales obtenida",
    data:channels
    
}


