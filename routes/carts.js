const express = require('express');
const cart = require('../middleware/carts')
const { ensureAuthentication } = require('../utilities')

cartsRouter = express.Router()

// cart CRUD
cartsRouter.get('/', cart.getCarts)
cartsRouter.get('/:id', cart.getCartByUserId)
cartsRouter.post('/',  cart.createCart)
cartsRouter.put('/:id', cart.updateCart)
cartsRouter.delete('/:id', cart.deleteCart)

module.exports = cartsRouter