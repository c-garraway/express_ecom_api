const db = require('../config/database')
const ts = require('../utilities')

const getCartItems = (req, res) => {
  db.pool.query('SELECT * FROM cartItems ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const getCartItemsByCartId = (req, res) => {
  const cart_id = parseInt(req.params.id)
      db.pool.query('SELECT * FROM cartItems WHERE cart_id = $1', [cart_id], (error, results) => {
          if (error) {
          throw error
          }
          res.status(200).json(results.rows)
      })
}

const createCartItem = (req, res) => {

created_at = ts.timestamp
  const {cart_id, product_id, quantity} = req.body
  db.pool.query('INSERT INTO cartItems (cart_id, product_id, quantity, created_at) VALUES ($1, $2, $3, $4) RETURNING *', [cart_id, product_id, quantity, created_at], (error, results) => {
    if (error) {
      throw error
    } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
        throw error
    }
    res.status(201).send(`CartItem added with ID: ${results.rows[0].id}`)
  })
}


const updateCartItem = (req, res) => {
  const id = parseInt(req.params.id)
  modified_at = ts.timestamp
  const {cart_id, product_id, quantity} = req.body
  db.pool.query(
    'UPDATE cartItems SET cart_id = $1, product_id = $2, quantity = $3, modified_at = $4 WHERE id = $5 RETURNING *',
    [cart_id, product_id, quantity, modified_at, id],
    (error, results) => {
      if (error) {
        throw error
      } 
      if (typeof results.rows == 'undefined') {
          res.status(404).send(`Resource not found`);
      } else if (Array.isArray(results.rows) && results.rows.length < 1) {
          res.status(404).send(`CartItem not found`);
      } else {
             res.status(200).send(`CartItem modified with ID: ${results.rows[0].id}`)         	
      }
    }
  )
}

const deleteCartItem = (req, res) => {
  const id = parseInt(req.params.id)
  db.pool.query('DELETE FROM cartItems WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`CartItem deleted with ID: ${id}`)
  })
}

module.exports = {
  getCartItems,
  getCartItemsByCartId,
  createCartItem,
  updateCartItem,
  deleteCartItem
}