
import express, { response } from 'express'
import workspace_router from './routes/Workspaces.route.js'
import user_router from './routes/users.route.js'
import member_routes from './routes/member_workspace.route.js'
import { engine } from 'express-handlebars'
import workspacesRepository from './Repositories/workspaces.repository.js'
import auth_router from './routes/auth.router.js'
import cors from 'cors'
import channels_route from './routes/channel.route.js'



const app=express()

app.use(cors())


app.engine('handlebars',engine({

    runtimeOptions:{
        allowProtoPropertiesByDefault:true,
        allowProtoMethodsByDefault:true
    }
}))
app.set('view engine','handlebars')
app.set('views','./src/views')


app.use(express.json())

app.listen(8080,()=>{
console.log('Conexion establecida con el host')
})


app.get('/status', (request, response) => {
  response.send('<h1>Estado correcto!</h1>')
})


//PROBAMOS HANDLEBAR:

app.get('/test-handle',async (request,response)=>{

    const edad = 19
    const workspaces= await workspacesRepository.getAll()

    response.render('home',
        {
            name:'Carlos',
            is_admin:true,
            //Esto es porque en handlebar no podes hacer coniciones de >< =, 
            // entonces las paso aca directamente
            es_mayor:edad >= 18,
            workspaces:workspaces   
        }
    )
})




app.use('/api/workspaces', workspace_router)
app.use('/api/users',user_router) 
app.use('/api/auth',auth_router) 
app.use('/api/workspace_member',member_routes)
app.use('/api/channels',channels_route)

