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

const getCartByUserId = async (req, res) => {
  const user_id = parseInt(req.params.id)

  try {
    const data = await db.pool.query('SELECT * FROM carts WHERE user_id = $1', [user_id] )

    if (data.rows.length === 0) {
        return res.status(404).send({message: "Cart Not Found"})
    }
    const cart = data.rows[0]
    
    res.status(200)
    return res.json({cart})
      
  } catch (error) {
      return res.status(403).send({message: error.detail})
  }
      
}

const createCart = async (req, res) => {

  const {user_id} = req.body

  try {
    
    created_at = ts.timestamp

    const data = await db.pool.query(
        'INSERT INTO carts (user_id, created_at) VALUES ($1, $2) RETURNING *',
        [user_id, created_at]
    )

    if (data.rows.length === 0) {
        return res.status(400).send({message: "Bad request"})
    }
    const cart = data.rows[0]
    
    res.status(200)
    return res.json({cart})

  } catch (e) {
    return res.status(403).send({message: e.detail})
  }
}


const updateCartByUserId = (req, res) => {
  const user_id = parseInt(req.params.id)
  modified_at = ts.timestamp
  db.pool.query(
    'UPDATE carts SET total = ( SELECT ROUND(SUM(products.price), 2)FROM users, carts, cartitems, products WHERE users.id = carts.user_id AND carts.id = cartitems.cart_id AND products.id = cartitems.product_id AND users.id = $1) WHERE carts.user_id = $1 RETURNING *',
    [user_id],
    (error, results) => {
      if (error) {
        throw error
      } 
      if (typeof results.rows == 'undefined') {
          res.status(404).send(`Resource not found`);
      } else if (Array.isArray(results.rows) && results.rows.length < 1) {
          res.status(404).send(`Cart not found`);
      } else {
             res.status(200).send(results.rows)         	
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
  updateCartByUserId,
  deleteCart
}