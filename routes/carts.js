const express = require('express');
const cart = require('../middleware/carts')
const { ensureAuthentication } = require('../utilities')

cartsRouter = express.Router()

// cart CRUD
cartsRouter.get('/', cart.getCarts)
cartsRouter.get('/user/:id', cart.getCartByUserId)
cartsRouter.post('/',  cart.createCart)
cartsRouter.put('/user/:id', cart.updateCartByUserId)
cartsRouter.delete('/:id', cart.deleteCart)

module.exports = cartsRouter