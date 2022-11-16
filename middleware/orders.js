const db = require('../config/database')
const ts = require('./utilities')

const getOrders = async (req, res) => {

  try {
    const data = await db.pool.query('SELECT * FROM orders ORDER BY id ASC'
    )
    if (data.rows.length === 0) {
      return res.status(404).send({message: "Orders Not Found"})
    }
    const orders = data.rows
  
    res.status(200).send({orders})
    
  } catch (error) {
    res.status(403).send({message: error.detail})
  }
}

const getOrderByUserId = async (req, res) => {
  const user_id = parseInt(req.params.id)

  try {
    const data = await db.pool.query('SELECT * FROM orders WHERE user_id = $1', [user_id]
    )
    
    if (data.rows.length === 0) {
      return res.status(404).send({message: "Order Not Found"})
    }
    const order = data.rows[0]
    
    res.status(200).send(order)

  } catch (error) {
    res.status(403).send({message: error.detail})
  }    
}

const createOrder = async (req, res) => {
  const created_at = ts.timestamp
  const { user_id, status} = req.body
  try {
    const data = await db.pool.query('INSERT INTO orders (user_id, status, created_at) VALUES ($1, $2, $3) RETURNING *', [user_id, status, created_at]
    )

    if (data.rows.length === 0) {
      return res.status(400).send({message: "Bad request"})
    }
    const order = data.rows[0]
    
    res.status(201).send({order})
    
  } catch (error) {
    res.status(403).send({message: error.detail})
  }
}

const updateOrderByUserId = async (req, res) => {
  const user_id = parseInt(req.params.id)
  const modified_at = ts.timestamp

  try {
    const data = await db.pool.query(
      'UPDATE orders SET total = ( SELECT ROUND(SUM(products.price), 2)FROM users, orders, orderitems, products WHERE users.id = orders.user_id AND orders.id = orderitems.order_id AND products.id = orderitems.product_id AND users.id = $1), tax = ROUND(total * .13, 2), grand_total = total + tax + shipping, modified_at = $2 WHERE orders.user_id = $1 RETURNING *',
      [user_id, modified_at]
    )
    if (data.rows.length === 0) {
      return res.status(400).send({message: "Order Not Found"})
    }

    const order = data.rows[0]
       
    res.status(200).send({order})  
 
  } catch (error) {
    res.status(403).send({message: error.detail})
  }
}

const deleteOrder = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const data = await db.pool.query('DELETE FROM orders WHERE id = $1', [id]) 
      
    if (data.rows.length === 0) {
      return res.status(400).send({message: "Order Not Found"})
    }
    const order = data.rows[0]

    res.status(200).send(`Order deleted: ${order}`)
    
  } catch (error) {
    res.status(403).send({message: error.detail})
  }
  
}

module.exports = {
  getOrders,
  getOrderByUserId,
  createOrder,
  updateOrderByUserId,
  deleteOrder
}