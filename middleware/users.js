const { pool } = require('../config/database')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const { timestamp } = require('./utilities')

const registerUser = async (req, res) => {
    const { first_name, last_name, email_address, password } = req.body

    if (
        first_name == null ||
        last_name == null ||
        email_address == null ||
        password == null
    ) {
        return res.status(400).send({message: "Bad request"})
    }

    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        const created_at = timestamp
        const data = await pool.query(
            'INSERT INTO users (first_name, last_name, email_address, password, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [first_name, last_name, email_address, hashedPassword, created_at]
        )

        if (data.rows.length === 0) {
            return res.status(400).send({message: "Bad request"})
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
        return res.json(req.session.user )
    } catch (e) {
        
        return res.status(403).send({message: e.detail})
    }
}

const loginUser =  async (req, res) => {
    const { email_address, password } = req.body

    if (email_address == null || password == null) {
        return res.status(401).send({message: "Invalid credentials"})
    }

    try {
        const data = await pool.query(
            'SELECT * FROM users WHERE email_address = $1',
            [email_address]
        )

        if (data.rows.length === 0) {
            return res.status(401).send({message: "Invalid credentials"})
        }
        const user = data.rows[0]

        const matches = await bcrypt.compareSync(password, user.password)
        if (!matches) {
            return res.status(401).send({message: "Invalid credentials"})
        }
        req.session.authenticated = true
        req.session.userCartSession_id = uuid.v4()
        req.session.user = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email_address: user.email_address,
            address: user.address,
            created_at: user.created_at
        }

        res.status(200)
        return res.json(req.session.user )
    } catch (e) {
        console.error(e)
        return res.status(400).send({message: "Bad request"})
    }
}

const logoutUser = async (req, res) => {
    try {
        await req.session.destroy()
        return res.status(200).send({message: "logged out"})
    } catch (e) {
        console.error(e)
        return res.status(500).send({message: "Internal Server Error"})
    }
}

const fetchUser = async (req, res) => {
    if (req.sessionID && req.session.user) {
        res.status(200)
        return res.json({ user: req.session.user })
    }
    return res.status(500).send({message: "Internal Server Error"})
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    fetchUser
}