const { pool } = require('../config/database')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const { timestamp } = require('../utilities')

//TODO: Check for existing email in db
const registerUser = async (req, res) => {
    const { first_name, last_name, email_address, password } = req.body

    if (
        first_name == null ||
        last_name == null ||
        email_address == null ||
        password == null
    ) {
        return res.sendStatus(403)
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const created_at = timestamp
        const data = await pool.query(
            'INSERT INTO users (first_name, last_name, email_address, password, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [first_name, last_name, email_address, hashedPassword, created_at]
        )

        if (data.rows.length === 0) {
            res.sendStatus(403)
        }
        const user = data.rows[0]
        req.session.authenticated = true
        req.session.userCartSession_id = uuid.v4()
        req.session.user = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email_address: user.email_address,
            created_at: user.created_at
        }

        res.status(200)
        return res.json({ user: req.session.user })
    } catch (e) {
        console.error(e)
        return res.sendStatus(403)
    }
}

const loginUser =  async (req, res) => {
    const { email_address, password } = req.body

    if (email_address == null || password == null) {
        return res.sendStatus(403)
    }

    try {
        const data = await pool.query(
            'SELECT * FROM users WHERE email_address = $1',
            [email_address]
        )

        if (data.rows.length === 0) {
            return res.sendStatus(403)
        }
        const user = data.rows[0]

        const matches = await bcrypt.compareSync(password, user.password)
        if (!matches) {
            return res.sendStatus(403)
        }
        req.session.authenticated = true
        req.session.userCartSession_id = uuid.v4()
        req.session.user = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email_address: user.email_address,
            created_at: user.created_at
        }

        res.status(200)
        return res.json({ user: req.session.user })
    } catch (e) {
        console.error(e)
        return res.sendStatus(403)
    }
}

const logoutUser = async (req, res) => {
    try {
        await req.session.destroy()
        return res.sendStatus(200)
    } catch (e) {
        console.error(e)
        return res.sendStatus(500)
    }
}

const fetchUser = async (req, res) => {
    if (req.sessionID && req.session.user) {
        res.status(200)
        return res.json({ user: req.session.user })
    }
    return res.sendStatus(403)
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    fetchUser
}