import mongoose from 'mongoose'
import ENVIRONMENT from './environment.config.js'

//console.log(ENVIRONMENT)

async function connectMongoDb(){
    try{
        await mongoose.connect(ENVIRONMENT.MONGO_DB_CONNECTION_STRING,
            {
      serverSelectionTimeoutMS: 30000, // ⏱️ tiempo máximo para encontrar el servidor (30s)
      socketTimeoutMS: 45000,          // ⏱️ tiempo máximo para operaciones en curso (45s)
      connectTimeoutMS: 30000,         // ⏱️ tiempo máximo para establecer la conexión inicial (30s)
      family: 4,                       // IPv4 (a veces evita demoras por IPv6)
    }
        )
        console.log("Conexión exitosa con MongoDB")
    }
    catch(error){
        console.error("Falló la conexión a MongoDB")
        console.log(error)
    }
    
} export default connectMongoDb