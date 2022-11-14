const db = require('../config/database')
const ts = require('../utilities')

const getOrders = async (req, res) => {

  try {
    const data = await db.pool.query('SELECT * FROM orders ORDER BY id ASC'
    )
    if (data.rows.length === 0) {
      return res.status(404).send({message: "Carts Not Found"})
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
      return res.status(404).send({message: "Cart Not Found"})
    }
    const order = data.rows[0]
    
    res.status(200).send({order})

  } catch (error) {
    res.status(403).send({message: error.detail})
  }    
}

const createOrder = async (req, res) => {
  const created_at = ts.timestamp
  const { user_id, total, status} = req.body
  try {
    const data = await db.pool.query('INSERT INTO orders (user_id, total, status, created_at) VALUES ($1, $2, $3, $4) RETURNING *', [user_id, total, status, created_at]
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
  const id = parseInt(req.params.id)
  const modified_at = ts.timestamp
  const { user_id, total, status} = req.body

  try {
    const data = await db.pool.query(
      'UPDATE orders SET user_id = $1, total = $2, status = $3, modified_at = $4 WHERE id = $5 RETURNING *',
      [user_id, total, status, modified_at, id]
    )
    if (data.rows.length === 0) {
      return res.status(400).send({message: "Cart Not Found"})
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