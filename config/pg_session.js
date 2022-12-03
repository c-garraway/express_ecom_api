"use strict"
const session = require('express-session')
//const {pool, conObject} = require('./database')

module.exports = (app) => {
// pg init
//pool.connect()

// session store and session config
/* const store = new (require('connect-pg-simple')(session))({
    conObject,
}) */

app.use(
    session({
        //store: store,
        secret: process.env.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
            secure: false,
            //httpOnly: false,
            //sameSite: false,
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
)
}