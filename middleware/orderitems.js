"use strict"
const db = require('../config/database')
const ts = require('./utilities')

const getOrderItems = async (req, res) => {

  try {
    const data = await db.pool.query('SELECT * FROM orderitems ORDER BY id ASC') 
      
    if (data.rows.length === 0) {
      return res.status(404).send({message: "Order Items Not Found"})
    }
    const orderItems = data.rows
  
    res.status(200).send({orderItems})
    
    /* res.status(200).json(results.rows) */

  } catch (error) {
    res.status(403).send({message: error.detail})
  }
  
}

const getOrderItemsByUserId = async (req, res) => {
  const user_id = parseInt(req.params.id)

  try {
    const data = await db.pool.query('SELECT orderitems.id, orderitems.product_id AS productID, orderitems.quantity, users.id AS userID, orders.id AS orderID, products.name, LOWER(products.description) AS description, ROUND(products.price,2) AS price FROM users, orders, orderitems, products WHERE users.id = orders.user_id AND orders.id = orderitems.order_id AND products.id = orderitems.product_id AND users.id = $1 ORDER BY orderitems.id', [user_id]) 
    
    /* if (data.rows.length === 0) {
      return res.status(404).send(data.rows) //TODO: review response
    } */
    const orderItems = data.rows
  
    res.status(200).send(orderItems)

  } catch (error) {
    res.status(403).send({message: error.detail})
  } 
}

const createOrderItem = async (req, res) => {
  const created_at = ts.timestamp
  const { order_id, product_id, quantity} = req.body
  
  try {
    const data = await db.pool.query('INSERT INTO orderitems (order_id, product_id, quantity, created_at) VALUES ($1, $2, $3, $4) RETURNING *', [order_id, product_id, quantity, created_at])
    
    if (data.rows.length === 0) {
      return res.status(404).send({message: "Bad Request"})
    }
    const orderItem = data.rows[0]
  
    res.status(200).send(orderItem)

  } catch (error) {
    res.status(403).send({message: error.detail})
  }
}


const updateOrderItem = async (req, res) => {
  const id = parseInt(req.params.id)
  const modified_at = ts.timestamp
  const { order_id, product_id, quantity } = req.body

  try {
    const data = await db.pool.query(
      'UPDATE orderitems SET order_id = $1, product_id = $2, quantity = $3, modified_at = $4 WHERE id = $5 RETURNING *',
      [order_id, product_id, quantity, modified_at, id]) 
    
      if (data.rows.length === 0) {
        return res.status(404).send({message: "Order Item Not Found"})
      }
      const orderItem = data.rows[0]
    
      res.status(200).send({orderItem})

  } catch (error) {
    res.status(403).send({message: error.detail})
  }
}

const deleteOrderItem = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const data = await db.pool.query('DELETE FROM orderitems WHERE id = $1', [id])
    
    const orderItem = data.rows[0]
  
    res.status(200).send({message: `Deleted order item id: ${orderItem}`})
  } catch (error) {
    res.status(403).send({message: error.detail})
  } 
}


const deleteOrderItemsByOrderId = async (req, res) => {
  const order_id = parseInt(req.params.id)

  try {
    const data = await db.pool.query('DELETE FROM orderitems WHERE order_id = $1', [order_id])
  
    res.status(200).send({message: `Deleted order items for order id: ${order_id}`})
  } catch (error) {
    res.status(403).send({message: error.detail})
  } 
}

module.exports = {
  getOrderItems,
  getOrderItemsByUserId,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
  deleteOrderItemsByOrderId
}