"use strict"
const express = require('express');
const product = require('../middleware/products')

const productRouter = express.Router()

// product CRUD
productRouter.get('/', product.getProducts)
productRouter.get('/:id', product.getProductById)
productRouter.post('/', product.createProduct)
productRouter.put('/:id', product.updateProduct)
productRouter.delete('/:id', product.deleteProduct)

module.exports = productRouter