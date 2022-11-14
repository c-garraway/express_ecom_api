const db = require('../config/database')
const ts = require('../utilities')

const getCartItems = (req, res) => {
  db.pool.query('SELECT * FROM cartItems ORDER BY cartitems.id', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}

const getCartItemsByUserId = (req, res) => {
  const user_id = parseInt(req.params.id)
      db.pool.query('SELECT cartitems.id, cartitems.product_id AS productID, cartitems.quantity, users.id AS userID, carts.id AS cartID, products.name, LOWER(products.description) AS description, ROUND(products.price,2) AS price FROM users, carts, cartitems, products WHERE users.id = carts.user_id AND carts.id = cartitems.cart_id AND products.id = cartitems.product_id AND users.id = $1 ORDER BY cartitems.id', [user_id], (error, results) => {
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
    res.status(201).send({message: results.rows[0]})
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
             res.status(200).send({message: results.rows[0]})         	
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
    res.status(200).send({message: `item id:${id} deleted`})
  })
}

module.exports = {
  getCartItems,
  getCartItemsByUserId,
  createCartItem,
  updateCartItem,
  deleteCartItem
}