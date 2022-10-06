require('dotenv').config()
const session = require('express-session')


    // pg init and config
    const Pool = require('pg').Pool
    const conObject = {
        user: process.env.USER,
        host: process.env.HOST,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
        port: process.env.PORT,
    }

    const pool = new Pool(conObject)
    pool.connect()

    // session store and session config
    const store = new (require('connect-pg-simple')(session))({
        conObject,
    })

    /* app.use(
        session({
            store: store,
            secret: process.env.SESSION_SECRET,
            saveUninitialized: false,
            resave: false,
            cookie: {
                secure: false,
                httpOnly: false,
                sameSite: false,
                maxAge: 1000 * 60 * 60 * 24,
            },
        })
    ) */

module.exports = {
    pool: pool
}
