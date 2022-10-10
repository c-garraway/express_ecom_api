const express = require('express');
const orderItems = require('../middleware/orderitems')
const { ensureAuthentication } = require('../utilities')

orderItemsRouter = express.Router()

// orderItems CRUD
orderItemsRouter.get('/', ensureAuthentication, orderItems.getOrderItems)
orderItemsRouter.get('/:id', ensureAuthentication, orderItems.getOrderItemById)
orderItemsRouter.post('/', ensureAuthentication, orderItems.createOrderItem)
orderItemsRouter.put('/:id', ensureAuthentication, orderItems.updateOrderItem)
orderItemsRouter.delete('/:id', ensureAuthentication, orderItems.deleteOrderItem)

module.exports = orderItemsRouter