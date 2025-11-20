import mysql from 'mysql2/promise'
import ENVIRONMENT from './environment.config.js'

let pool

if (!global._mysqlPool) {
  global._mysqlPool = mysql.createPool({
    host: ENVIRONMENT.MYSQ_HOST,
    port: ENVIRONMENT.MYSQL_PORT,
    user: ENVIRONMENT.MYSQL_USERNAME,
    password: ENVIRONMENT.MYSQL_PASSWORD,
    database: ENVIRONMENT.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 5,     
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    connectTimeout:10000,
  });

/* 
  global._mysqlPool.getConnection()
    .then(conn => {
      console.log('✅ Conexión exitosa a la base de datos');
      conn.release();
    })
    .catch(err => {
      console.error('❌ Error al conectar a la base de datos:', err);
    }); */
}

pool = global._mysqlPool;
export default pool;
