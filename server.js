require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const cors = require('cors')
const session = require('express-session')
const bcrypt = require('bcrypt')


// express app init and config
const app = express()
app.use(morgan('short'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
    cors({
        origin: 'http://localhost:3001',
        methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
        credentials: true,
    })
)

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

app.use(
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
)

app.get('/', (req, res) => {
    res.status(200).send('Are you out there?')
})

app.post('/register', async (req, res) => {
    const { firstname, surname, email, password } = req.body

    if (
        firstname == null ||
        surname == null ||
        email == null ||
        password == null
    ) {
        return res.sendStatus(403)
    }

    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 10)
        const data = await pool.query(
            'INSERT INTO users (firstname, surname, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [firstname, surname, email, hashedPassword]
        )

        if (data.rows.length === 0) {
            res.sendStatus(403)
        }
        const user = data.rows[0]

        req.session.user = {
            id: user.id,
            firstname: user.firstname,
            surname: user.surname,
            email: user.email,
        }

        res.status(200)
        return res.json({ user: req.session.user })
    } catch (e) {
        console.error(e)
        return res.sendStatus(403)
    }
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body

    if (email == null || password == null) {
        return res.sendStatus(403)
    }

    try {
        const data = await pool.query(
            'SELECT id, firstname, surname, email, password FROM users WHERE email = $1',
            [email]
        )

        if (data.rows.length === 0) {
            return res.sendStatus(403)
        }
        const user = data.rows[0]

        const matches = bcrypt.compareSync(password, user.password)
        if (!matches) {
            return res.sendStatus(403)
        }

        req.session.user = {
            id: user.id,
            firstname: user.firstname,
            surname: user.surname,
            email: user.email,
        }

        res.status(200)
        return res.json({ user: req.session.user })
    } catch (e) {
        console.error(e)
        return res.sendStatus(403)
    }
})

app.post('/logout', async (req, res) => {
    try {
        await req.session.destroy()
        return res.sendStatus(200)
    } catch (e) {
        console.error(e)
        return res.sendStatus(500)
    }
})

app.post('/fetch-user', async (req, res) => {
    if (req.sessionID && req.session.user) {
        res.status(200)
        return res.json({ user: req.session.user })
    }
    return res.sendStatus(403)
})


// now listen on port 3000...
const port = 4000
app.listen(port, () => {
    console.log(`App started on port ${port}`)
})