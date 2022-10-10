require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const session = require('express-session')

// express app init and config
const app = express()
app.use(morgan('short'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

const productRouter = require('./routes/product')
app.use('/products', productRouter)

const usersRouter = require('./routes/users')
app.use('/users', usersRouter)

const cartsRouter = require('./routes/carts')
app.use('/carts', cartsRouter)

const cartItemsRouter = require('./routes/cartitems')
app.use('/cartitems', cartItemsRouter)

const ordersRouter = require('./routes/orders')
app.use('/orders', ordersRouter)

const orderItemsRouter = require('./routes/orderitems')
app.use('/orderitems', orderItemsRouter)

// Dev testing
app.get('/', (req, res) => {
    res.status(200).send('Are you out there?')
})

// now listen on port 3000...
const port = 4000
app.listen(port, () => {
    console.log(`App started on port ${port}`)
})