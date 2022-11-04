const db = require('../config/database')
const ts = require('../utilities')

//TODO: add logic for userID check before getting carts
const getCarts = (req, res) => {
  db.pool.query('SELECT * FROM carts ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const getCartByUserId = (req, res) => {
  const user_id = parseInt(req.params.id)
      db.pool.query('SELECT * FROM carts WHERE user_id = $1', [user_id], (error, results) => {
          if (error) {
          throw error
          }
          res.status(200).json(results.rows)
      })
}

const createCart = (req, res) => {

created_at = ts.timestamp

  const { user_id} = req.body
  db.pool.query('INSERT INTO carts (user_id, created_at) VALUES ($1, $2) RETURNING *', [user_id, created_at], (error, results) => {
    if (error) {
      throw error
    } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
        throw error
    }
    res.status(201).send(`Cart added with ID: ${results.rows[0].id}`)
  })
}


const updateCart = (req, res) => {
  const id = parseInt(req.params.id)
  modified_at = ts.timestamp
  const { user_id } = req.body
  db.pool.query(
    'UPDATE carts SET user_id = $1, modified_at = $2 WHERE id = $3 RETURNING *',
    [user_id, modified_at, id],
    (error, results) => {
      if (error) {
        throw error
      } 
      if (typeof results.rows == 'undefined') {
          res.status(404).send(`Resource not found`);
      } else if (Array.isArray(results.rows) && results.rows.length < 1) {
          res.status(404).send(`Cart not found`);
      } else {
             res.status(200).send(`Cart modified with ID: ${results.rows[0].id}`)         	
      }
    }
  )
}

const deleteCart = (req, res) => {
  const id = parseInt(req.params.id)
  db.pool.query('DELETE FROM carts WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`Cart deleted with ID: ${id}`)
  })
}

module.exports = {
  getCarts,
  getCartByUserId,
  createCart,
  updateCart,
  deleteCart
}