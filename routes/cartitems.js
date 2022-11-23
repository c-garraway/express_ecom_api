const express = require('express');
const cartItems = require('../middleware/cartitems')
const { ensureAuthentication } = require('../middleware/utilities')

cartItemsRouter = express.Router()

// cartItems CRUD
/* cartItemsRouter.get('/', cartItems.getCartItems) */
cartItemsRouter.get('/user/:id', cartItems.getCartItemsByUserId)
cartItemsRouter.post('/', cartItems.createCartItem)
cartItemsRouter.put('/:id', cartItems.updateCartItem)
cartItemsRouter.delete('/:id', cartItems.deleteCartItem)
cartItemsRouter.delete('/cart/:id', cartItems.deleteCartItemsByCartId)

module.exports = cartItemsRouter