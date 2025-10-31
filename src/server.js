
import express, { response } from 'express'
import workspace_router from './routes/Workspaces.route.js'
import user_router from './routes/users.route.js'
import member_routes from './routes/member_workspace.route.js'
import { engine } from 'express-handlebars'
import workspacesRepository from './Repositories/workspaces.repository.js'
import auth_router from './routes/auth.router.js'
import cors from 'cors'



/* const token_test = jwt.sign(
    {   //playload: Carga util, la informacion que llevara el token.
        nombre: 'pepe'
    },
    //Clave secreta para firmar, es lo que hace que sea seguro. Buena prctica es cambiarla periodicamente.
    ENVIRONMENT.JWT_SECRET_KEY,
    {
        //Expieracion del tiken
        expiresIn: '24h'
    }
)
//console.log(token_test)

 */
//////CONEXION EXPRESS: 

//Crear una aplicación de express: un servidor Web
const app=express()

//Habilitamos a que nuestro servidor pueda recibir consultas de origen cruzado. Esto es para que 
//el front pueda comunicarse con el sever backend
app.use(cors())

//MOTOR DE PLANTILLAS DE NODE.JS PARA EXPRESS
//Aca configuramos el motor para que lo utilice como motor de plantillas.

app.engine('handlebars',engine({

    //Configuracion necesaria para poder acceder luego a los objetos devueltos por 
    //la DB, sino no podras verlos en la reenderización
    runtimeOptions:{
        allowProtoPropertiesByDefault:true,
        allowProtoMethodsByDefault:true
    }
}))
app.set('view engine','handlebars')
app.set('views','./src/views')

//MIDELWARE JSON EXPRESS.
//Habilitamos el envío de json a nuestro servidor, si no está esta opcion no nos pueden enviar json.
//se pone primero para habilitar que nos envien json y luego configuramos el enrutaror.
// Cada vez que me llegue una consulta lo parcearemos a un objeto de java script
app.use(express.json())


//Necesito que mi aplicaicon se escuche en algún puerto:
//listen asigna un lugar donde se va a ejecutar nuestra aplicación.
//primer parametro: nro de puerto
//Segundo parametro una callback que se ejecutara si logra establecerse (prenderse el servidor)
app.listen(8080,()=>{
console.log('Conexion establecida con el host')
})



//app.get() Nos permite configurar un endpoint en nuestro servidor.
//El primer parametro es un string que representa el endpoint que estamos configurando.
//El segundo parametro es una function que representa la acciòn que se ejecutarà
//cuando suceda la consulta. Programaciòn orientada a evento (como el addEvent Listener)
//Este a la vez recive: Request que es un objeto con la configuraciòn de la consulta
//Response es un obejto con la configuraciòn de la respuesta
// Response.send es un metodo que permite enviar un valor como respuesta de un servidor.

app.get('/status', (request, response) => {
  response.send('<h1>Estado correcto!</h1>')
})


/* //En caso de enviar un objeto será transformado a JSON

app.get('/object', (request, response) => {
  response.send(
        {
            nombre:'Carlos',
            apellido:'Peralta'
        }
  )
})
 */

//connectMongodb()

//PROBAMOS HANDLEBAR:

app.get('/test-handle',async (request,response)=>{

    const edad = 19
    const workspaces= await workspacesRepository.getAll()
    //Respondo con la plantilla home:
    response.render('home',
        {
            name:'Carlos',
            is_admin:true,
            //Esto es porque en handlebar no podes hacer consiciones de >< =, 
            // entonces las paso aca directamente
            es_mayor:edad >= 18,
            workspaces:workspaces   
        }
    )
})


/* app.get('/workspace/:workspace_id',async (request,response)=>{
    const {workspace_id}=request.params
    const workspace_detail= await workspacesRepository.getById(workspace_id)
    const edad= 19

    response.render('workspace_detail',
        {
            es_mayor: edad>=18,
            workspace:workspace_detail
        }
    )
}) */

//Aca voy a hacer que mi aplicacion use para workspaces el workspace_router:
// Configuro en mi servidor que todas las consultas que empiecen a /api/workspaces se deleguen
// al workspace_router

app.use('/api/workspaces', workspace_router)
app.use('/api/users',user_router) 
app.use('/api/auth',auth_router) 
app.use('/api/workspace_member',member_routes)


/* app.use('/api/status',(request,response)=>{
    response.send(
        {
            ok:true,
            message:pong
        }
    )
}) */
//MemberWokspaceRepository.create('68e07218144422349c955a10','68e11ba3ad69c5f26934bfd5')
//const workspaces_dl_usuario= await MemberWokspaceRepository.getAllWorkspacesByUserId('68e07218144422349c955a10')
// console.log(workspaces_dl_usuario)

//INSERTS:


/* Users.insertOne(
    {
    name:'Pepe',
    email:'pp@gmail.com',
    password:'clave1'
    }
) */

/* Workspaces.insertOne(
    {
    name:'Clase 11',
    }
) */

  /*   //Opcion para probar código asincrónico: then se ejecuta cuando se resuelva la promesa
    userRepository.updateById('68b78d8cce895420d041c13f',{name:'sr. Pepe'})
    .then(()=> console.log('insertado'))
    //catchs se activara cuando falle la promesa:
    .catch((razon_error)=>{
        console.log('Error al actualizar:', razon_error)
    }) */
    

/*     userRepository.getAll()
    .then((res) => console.log(res))   */

/*  workspacesRepository.getById(1).then((response)=>{
    console.log(response)
})  */

/* MemberWokspaceRepository.getMemberWorkspaceByUserIdAndWorkspaceId(3,1).then((response)=>{
    console.log(response)
}
) */