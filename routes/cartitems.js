const express = require('express');
const cartItems = require('../middleware/cartitems')
const { ensureAuthentication } = require('../utilities')

cartItemsRouter = express.Router()

// cartItems CRUD
cartItemsRouter.get('/', ensureAuthentication, cartItems.getCartItems)
cartItemsRouter.get('/:id', ensureAuthentication, cartItems.getCartItemsByCartId)
cartItemsRouter.post('/', ensureAuthentication, cartItems.createCartItem)
cartItemsRouter.put('/:id', ensureAuthentication, cartItems.updateCartItem)
cartItemsRouter.delete('/:id', ensureAuthentication, cartItems.deleteCartItem)

module.exports = cartItemsRouter