const express = require('express');
const cart = require('../middleware/carts')
const { ensureAuthentication } = require('../utilities')

cartsRouter = express.Router()

// cart CRUD
cartsRouter.get('/', ensureAuthentication, cart.getCarts)
cartsRouter.get('/:id', ensureAuthentication, cart.getCartByUserId)
cartsRouter.post('/', ensureAuthentication, cart.createCart)
cartsRouter.put('/:id', ensureAuthentication, cart.updateCart)
cartsRouter.delete('/:id', ensureAuthentication, cart.deleteCart)

module.exports = cartsRouter