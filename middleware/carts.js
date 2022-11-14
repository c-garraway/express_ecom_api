const db = require('../config/database')
const ts = require('../utilities')


const getCarts = async (req, res) => {

  try {
    const data = await db.pool.query('SELECT * FROM carts ORDER BY id ASC') 

    if (data.rows.length === 0) {
      return res.status(404).send({message: "Carts Not Found"})
    }
    const carts = data.rows
  
    res.status(200).send({carts})
    
  } catch (error) {
      res.status(403).send({message: error.detail})
  }
}

const getCartByUserId = async (req, res) => {
  const user_id = parseInt(req.params.id)

  try {
    const data = await db.pool.query('SELECT * FROM carts WHERE user_id = $1', [user_id] )

    if (data.rows.length === 0) {
      return res.status(404).send({message: "Cart Not Found"})
    }
    const cart = data.rows[0]
    
    res.status(200).send({cart})
      
  } catch (error) {
      res.status(403).send({message: error.detail})
  }
      
}

const createCart = async (req, res) => {
  const {user_id} = req.body
  const created_at = ts.timestamp

  try {  
    const data = await db.pool.query(
        'INSERT INTO carts (user_id, created_at) VALUES ($1, $2) RETURNING *',
        [user_id, created_at]
    )

    if (data.rows.length === 0) {
      return res.status(400).send({message: "Bad request"})
    }
    const cart = data.rows[0]
    
    res.status(201).send({cart})

  } catch (error) {
      res.status(403).send({message: error.detail})
  }
}


const updateCartByUserId = async (req, res) => {
  const user_id = parseInt(req.params.id)

  try {
    const data = await db.pool.query(
      'UPDATE carts SET total = ( SELECT ROUND(SUM(products.price), 2)FROM users, carts, cartitems, products WHERE users.id = carts.user_id AND carts.id = cartitems.cart_id AND products.id = cartitems.product_id AND users.id = $1) WHERE carts.user_id = $1 RETURNING *',
      [user_id])
       
    if (data.rows.length === 0) {
      return res.status(400).send({message: "Cart Not Found"})
    }

    const cart = data.rows[0]
       
    res.status(200).send({cart})       	

  } catch (error) {
      res.status(403).send({message: error.detail})
  }
}

const deleteCart = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const data = await db.pool.query('DELETE FROM carts WHERE id = $1', [id])
     
    if (data.rows.length === 0) {
      return res.status(400).send({message: "Cart Not Found"})
    }
    const cart = data.rows[0]

    res.status(200).send(`Cart deleted: ${cart}`)
    
  } catch (error) {
      res.status(403).send({message: error.detail})
  }
}

module.exports = {
  getCarts,
  getCartByUserId,
  createCart,
  updateCartByUserId,
  deleteCart
}