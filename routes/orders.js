"use strict"
const express = require('express');
const orders = require('../middleware/orders')
const { ensureAuthentication } = require('../middleware/utilities')

const ordersRouter = express.Router()

// orders CRUD
/* ordersRouter.get('/', orders.getOrders) */
ordersRouter.get('/user/:id', orders.getOrderByUserId)
ordersRouter.post('/', orders.createOrder)
ordersRouter.put('/user/:id', orders.updateOrderByUserId)
ordersRouter.delete('/:id', orders.deleteOrder)

module.exports = ordersRouter