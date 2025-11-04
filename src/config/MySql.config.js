// db.js
import mysql from 'mysql2/promise'
import ENVIRONMENT from './environment.config.js'

const pool = mysql.createPool({

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

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Conexión exitosa a la base de datos');
    
    connection.release(); 
  } catch (error) {
    console.error('❌ Error de conexión a la base de datos:', error);
  }
})();

export default pool;
