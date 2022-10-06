const db = require('../config/database')
const ts = require('../utilities')

const getOrders = (req, res) => {
  db.pool.query('SELECT * FROM orders ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const getOrderById = (req, res) => {
  const id = parseInt(req.params.id)
      db.pool.query('SELECT * FROM orders WHERE id = $1', [id], (error, results) => {
          if (error) {
          throw error
          }
          res.status(200).json(results.rows)
      })
}

const createOrder = (req, res) => {

created_at = ts.timestamp

  const { user_id, total, status} = req.body
  db.pool.query('INSERT INTO orders (user_id, total, status, created_at) VALUES ($1, $2, $3, $4) RETURNING *', [user_id, total, status, created_at], (error, results) => {
    if (error) {
      throw error
    } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
        throw error
    }
    res.status(201).send(`Order added with ID: ${results.rows[0].id}`)
  })
}


const updateOrder = (req, res) => {
  const id = parseInt(req.params.id)
  modified_at = ts.timestamp
  const { user_id, total, status} = req.body
  db.pool.query(
    'UPDATE orders SET user_id = $1, total = $2, status = $3, modified_at = $4 WHERE id = $5 RETURNING *',
    [user_id, total, status, modified_at, id],
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

const deleteOrder = (req, res) => {
  const id = parseInt(req.params.id)
  db.pool.query('DELETE FROM orders WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`Order deleted with ID: ${id}`)
  })
}

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
}