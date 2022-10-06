const db = require('../config/database')
const ts = require('../utilities')

const getOrderItems = (req, res) => {
  db.pool.query('SELECT * FROM orderitems ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const getOrderItemById = (req, res) => {
  const id = parseInt(req.params.id)
      db.pool.query('SELECT * FROM orderitems WHERE id = $1', [id], (error, results) => {
          if (error) {
          throw error
          }
          res.status(200).json(results.rows)
      })
}

const createOrderItem = (req, res) => {

created_at = ts.timestamp

  const { order_id, product_id, quantity} = req.body
  db.pool.query('INSERT INTO orderitems (order_id, product_id, quantity, created_at) VALUES ($1, $2, $3, $4) RETURNING *', [order_id, product_id, quantity, created_at], (error, results) => {
    if (error) {
      throw error
    } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
        throw error
    }
    res.status(201).send(`Order added with ID: ${results.rows[0].id}`)
  })
}


const updateOrderItem = (req, res) => {
  const id = parseInt(req.params.id)
  modified_at = ts.timestamp
  const { order_id, product_id, quantity } = req.body
  db.pool.query(
    'UPDATE orderitems SET order_id = $1, product_id = $2, quantity = $3, modified_at = $4 WHERE id = $5 RETURNING *',
    [order_id, product_id, quantity, modified_at, id],
    (error, results) => {
      if (error) {
        throw error
      } 
      if (typeof results.rows == 'undefined') {
          res.status(404).send(`Resource not found`);
      } else if (Array.isArray(results.rows) && results.rows.length < 1) {
          res.status(404).send(`Order not found`);
      } else {
             res.status(200).send(`Order modified with ID: ${results.rows[0].id}`)         	
      }
    }
  )
}

const deleteOrderItem = (req, res) => {
  const id = parseInt(req.params.id)
  db.pool.query('DELETE FROM orderitems WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`Order deleted with ID: ${id}`)
  })
}

module.exports = {
  getOrderItems,
  getOrderItemById,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem
}