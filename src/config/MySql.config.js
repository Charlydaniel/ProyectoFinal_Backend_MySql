import mysql from 'mysql2/promise'
import ENVIRONMENT from './environment.config.js'



const pool = mysql.createPool({
    host:ENVIRONMENT.MYSQ_HOST,
    port:ENVIRONMENT.MYSQL_PORT,
    user:ENVIRONMENT.MYSQL_USERNAME,
    password:ENVIRONMENT.MYSQL_PASSWORD,
    database:ENVIRONMENT.MYSQL_DATABASE
})

pool.getConnection().then((conection)=>{
    console.log('Conexion exitosa a la base de datos')
})
.catch((err)=>{

    console.log(err)
})

export default pool