require('dotenv').config()
const morgan = require('morgan')
const express = require('express')
const { ensureAuthentication } = require('./utilities')
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

const product = require('./middleware/products')
const cart = require('./middleware/carts')
const cartItems = require('./middleware/cartItems')
const orders = require('./middleware/orders')
const orderitems = require('./middleware/orderitems')
const users = require('./middleware/users')



app.get('/', (req, res) => {
    res.status(200).send('Are you out there?') //DEV
})

// users CRUD
app.post('/logout', ensureAuthentication, users.logoutUser)
app.post('/fetchUser', ensureAuthentication, users.fetchUser)
app.post('/register', users.registerUser)
app.post('/login', users.loginUser)
//app.put('/users/:id', ensureAuthentication, users.updateUser)
//app.delete('/users/:id', ensureAuthentication, users.deleteUser)

// product CRUD
app.get('/products', product.getProducts)
app.get('/products/:id', product.getProductById)
app.post('/products', product.createProduct)
app.put('/products/:id', product.updateProduct)
app.delete('/products/:id', product.deleteProduct)

// cart CRUD
app.get('/carts', ensureAuthentication, cart.getCarts)
app.get('/carts/:id', ensureAuthentication, cart.getCartByUserId)
app.post('/carts', ensureAuthentication, cart.createCart)
app.put('/carts/:id', ensureAuthentication, cart.updateCart)
app.delete('/carts/:id', ensureAuthentication, cart.deleteCart)

// cartItems CRUD
app.get('/cartItems', ensureAuthentication, cartItems.getCartItems)
app.get('/cartItems/:id', ensureAuthentication, cartItems.getCartItemsByCartId)
app.post('/cartItems', ensureAuthentication, cartItems.createCartItem)
app.put('/cartItems/:id', ensureAuthentication, cartItems.updateCartItem)
app.delete('/cartItems/:id', ensureAuthentication, cartItems.deleteCartItem)

// orders CRUD
app.get('/orders', ensureAuthentication, orders.getOrders)
app.get('/orders/:id', ensureAuthentication, orders.getOrderById)
app.post('/orders', ensureAuthentication, orders.createOrder)
app.put('/orders/:id', ensureAuthentication, orders.updateOrder)
app.delete('/orders/:id', ensureAuthentication, orders.deleteOrder)

// orderItems CRUD
app.get('/orderitems', ensureAuthentication, orderitems.getOrderItems)
app.get('/orderitems/:id', ensureAuthentication, orderitems.getOrderItemById)
app.post('/orderitems', ensureAuthentication, orderitems.createOrderItem)
app.put('/orderitems/:id', ensureAuthentication, orderitems.updateOrderItem)
app.delete('/orderitems/:id', ensureAuthentication, orderitems.deleteOrderItem)

// now listen on port 3000...
const port = 4000
app.listen(port, () => {
    console.log(`App started on port ${port}`)
})