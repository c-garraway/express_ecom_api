require('dotenv').config()
const morgan = require('morgan')
const express = require('express')


// express app init and config
const app = express()
app.use(morgan('short'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const pgSession = require('./config/pg_session')
pgSession(app)

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

// now listen on port 3000...
const port = 4000
app.listen(port, () => {
    console.log(`App started on port ${port}`)
})