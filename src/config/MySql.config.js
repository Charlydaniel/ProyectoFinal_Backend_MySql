import mysql from 'mysql2/promise'
import ENVIRONMENT from './environment.config.js'



const pool = mysql.createPool({
    host:ENVIRONMENT.MYSQ_HOST,
    port:ENVIRONMENT.MYSQL_PORT,
    user:ENVIRONMENT.MYSQL_USERNAME,
    password:ENVIRONMENT.MYSQL_PASSWORD,
    database:ENVIRONMENT.MYSQL_DATABASE,
    waitForConnections: true,  // ✅ espera si no hay conexión libre
    connectionLimit: 5,        // ✅ respeta el límite de Clever Cloud
    queueLimit: 0,             // ✅ sin límite de cola
    enableKeepAlive: true,     // ✅ mantiene activas las conexiones
    keepAliveInitialDelay: 0
})

pool.getConnection().then((conection)=>{
    console.log('Conexion exitosa a la base de datos')
    connection.release();
})
.catch((err)=>{

    console.log(err)
})

export default pool