const express = require('express');
const orders = require('../middleware/orders')
const { ensureAuthentication } = require('../utilities')

ordersRouter = express.Router()

// orders CRUD
ordersRouter.get('/', ensureAuthentication, orders.getOrders)
ordersRouter.get('/:id', ensureAuthentication, orders.getOrderById)
ordersRouter.post('/', ensureAuthentication, orders.createOrder)
ordersRouter.put('/:id', ensureAuthentication, orders.updateOrder)
ordersRouter.delete('/:id', ensureAuthentication, orders.deleteOrder)

module.exports = ordersRouter