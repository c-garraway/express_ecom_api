const db = require('../config/database')
const ts = require('./utilities')

const getCartItems = async (req, res) => {

  try {
    const data = await db.pool.query('SELECT * FROM cartItems ORDER BY cartitems.id') 
    
    if (data.rows.length === 0) {
      return res.status(404).send({message: "Cart Items Not Found"})
    }
    const cartItems = data.rows
        
    res.status(200).send({cartItems})
    
  } catch (error) {
    res.status(403).send({message: error.detail})
  }
  
}

const getCartItemsByUserId = async (req, res) => {
  const user_id = parseInt(req.params.id)

  try {
    const data = await db.pool.query('SELECT cartitems.id, cartitems.product_id AS productID, cartitems.quantity, users.id AS userID, carts.id AS cartID, products.name, LOWER(products.description) AS description, ROUND(products.price,2) AS price FROM users, carts, cartitems, products WHERE users.id = carts.user_id AND carts.id = cartitems.cart_id AND products.id = cartitems.product_id AND users.id = $1 ORDER BY cartitems.id', [user_id])
      
    /* if (data.rows.length === 0) {
      return res.status(404).send(data.rows) //TODO: review response
    } */
    const cartItems = data.rows

    res.status(200).send(cartItems)
  
  } catch (error) {
    res.status(403).send({message: error.detail})
  }
}

const createCartItem = async (req, res) => {
  const created_at = ts.timestamp
  const {cart_id, product_id, quantity} = req.body

  try {
    const data = await db.pool.query('INSERT INTO cartItems (cart_id, product_id, quantity, created_at) VALUES ($1, $2, $3, $4) RETURNING *', [cart_id, product_id, quantity, created_at])
      
    if (data.rows.length === 0) {
      return res.status(404).send({message: "Bad Request"})
    }
    const cartItem = data.rows[0]
    
    res.status(201).send({cartItem})
    

  } catch (error) {
    res.status(403).send({message: error.detail})
  }
}


const updateCartItem = async (req, res) => {
  const id = parseInt(req.params.id)
  const modified_at = ts.timestamp
  const {cart_id, product_id, quantity} = req.body

  try {
    const data = await db.pool.query(
      'UPDATE cartItems SET cart_id = $1, product_id = $2, quantity = $3, modified_at = $4 WHERE id = $5 RETURNING *',
      [cart_id, product_id, quantity, modified_at, id])

    if (data.rows.length === 0) {
      return res.status(404).send({message: "Cart Item Not Found"})
    }
    const cartItem = data.rows[0]           
      
    res.status(200).send({cartItem})         	

  } catch (error) {
    res.status(403).send({message: error.detail})
  }
}

const deleteCartItem = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const data = await db.pool.query('DELETE FROM cartItems WHERE id = $1', [id])
    
    if (data.rows.rowCount === 0) {
      return res.status(404).send({message: "Cart Item Not Found"})
    }
    const cartItem = data.rows[0]

    res.status(200).send({message: `Cart item deleted: ${cartItem}`})

  } catch (error) {
    res.status(403).send({message: error.detail})
  }
}

module.exports = {
  getCartItems,
  getCartItemsByUserId,
  createCartItem,
  updateCartItem,
  deleteCartItem
}