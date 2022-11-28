"use strict"
const express = require('express');
const orderItems = require('../middleware/orderitems')
//const { ensureAuthentication } = require('../middleware/utilities')

const orderItemsRouter = express.Router()

// orderItems CRUD
/* orderItemsRouter.get('/', orderItems.getOrderItems) */
orderItemsRouter.get('/user/:id', orderItems.getOrderItemsByUserId)
orderItemsRouter.post('/', orderItems.createOrderItem)
orderItemsRouter.put('/:id', orderItems.updateOrderItem)
orderItemsRouter.delete('/:id', orderItems.deleteOrderItem)
orderItemsRouter.delete('/order/:id', orderItems.deleteOrderItemsByOrderId)


module.exports = orderItemsRouter