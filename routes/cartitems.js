const express = require('express');
const cartItems = require('../middleware/cartitems')
const { ensureAuthentication } = require('../utilities')

cartItemsRouter = express.Router()

// cartItems CRUD
cartItemsRouter.get('/', cartItems.getCartItems)
cartItemsRouter.get('/:id', cartItems.getCartItemsByUserId)
cartItemsRouter.post('/', cartItems.createCartItem)
cartItemsRouter.put('/:id', cartItems.updateCartItem)
cartItemsRouter.delete('/:id', cartItems.deleteCartItem)

module.exports = cartItemsRouter