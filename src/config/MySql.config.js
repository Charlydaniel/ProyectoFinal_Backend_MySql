import mysql from 'mysql2/promise'
import ENVIRONMENT from './environment.config.js'


if (!global._pool) {
  global._pool = mysql.createPool({
    host: ENVIRONMENT.MYSQ_HOST,
    port: ENVIRONMENT.MYSQL_PORT,
    user: ENVIRONMENT.MYSQL_USERNAME,
    password: ENVIRONMENT.MYSQL_PASSWORD,
    database: ENVIRONMENT.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 5,     
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
  });


  global._pool.getConnection()
    .then(conn => {
      console.log('✅ Conexión exitosa a la base de datos');
      conn.release();
    })
    .catch(err => {
      console.error('❌ Error al conectar a la base de datos:', err);
    });
}

const pool = global._pool;
export default pool;
