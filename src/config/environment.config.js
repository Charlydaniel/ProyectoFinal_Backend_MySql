import dotenv from 'dotenv'

dotenv.config()

const ENVIRONMENT={
    /*MONGO_DB_CONNECTION_STRING: process.env.MONGO_DB_CONNECTION_STRING,*/
    MYSQ_HOST:process.env.MYSQL_HOST,
    MYSQL_PORT:process.env.MYSQL_PORT,
    MYSQL_DATABASE:process.env.MYSQL_DATABASE,
    MYSQL_USERNAME:process.env.MYSQL_USERNAME,
    MYSQL_PASSWORD:process.env.MYSQL_PASSWORD,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    GMAIL_PASSWORD:process.env.GMAIL_PASSWORD,
    GMAIL_USERNAME:process.env.GMAIL_USERNAME,
    URL_API_BACKEND:process.env.URL_API_BACKEND,
    URL_FRONTEND:process.env.URL_FRONTEND
}
export default ENVIRONMENT