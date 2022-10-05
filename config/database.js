require('dotenv').config()

module.exports = () => {
    const { Client } = require('pg')
    const conObject = {
        user: process.env.USER,
        host: process.env.HOST,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        port: process.env.PORT,
    }

    const client = new Client(conObject)
    client.connect()
}