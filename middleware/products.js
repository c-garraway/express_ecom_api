"use strict"
const db = require('../config/database')

const getProducts = async (req, res) => {

  try {
    const data = await db.pool.query('SELECT id, name, LOWER(description) AS description, ROUND(price,2) AS price FROM products ORDER BY id ASC')
    
    if (data.rows.length === 0) {
      return res.status(404).send({message: "Products Not Found"})
    }
    const products = data.rows
  
    res.status(200).send(products)
    //res.status(200).json(results.rows)
    
  } catch (error) {
    console.error(error)
    res.status(403).send({message: error.detail})
  }
}
//TODO: add check for existing product
const getProductById = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
      const data = await db.pool.query('SELECT * FROM products WHERE id = $1', [id]
      ) 
    const product = data.rows[0]
  
    res.status(200).send(product)  
    //res.status(200).json(results.rows)
      
  } catch (error) {
    console.error(error)
    res.status(403).send({message: error.detail})
  }
}

const createProduct = async (req, res) => {
  const { name, description, price } = req.body

  try {
    const data = await db.pool.query('INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *', [name, description, price])
    
    if (data.rows.length === 0) {
      return res.status(400).send({message: "Bad request"})
    }
    const product = data.rows[0]
    
    res.status(201).send(product)   
   
  } catch (error) {
    console.error(error)
    res.status(403).send({message: error.detail})
  }  
}


const updateProduct = async (req, res) => {
  const id = parseInt(req.params.id)
  const { name, description, price} = req.body

  try {
    const data = await db.pool.query(
      'UPDATE products SET name = $1, description = $2,  price = $3 WHERE id = $4 RETURNING *',
      [name, description, price, id]) 
    
    if (data.rows.length === 0) {
      return res.status(400).send({message: "Order Not Found"})
    }

    const product = data.rows[0]
        
    res.status(200).send(product) 
    //res.status(200).send(`Product modified with ID: ${results.rows[0].id}`)         	

  } catch (error) {
    console.error(error)
    res.status(403).send({message: error.detail})
    
  }
}

const deleteProduct = async (req, res) => {
  const id = parseInt(req.params.id)

  try {
    const data = await db.pool.query('DELETE FROM products WHERE id = $1', [id])

  if (data.rows.length === 0) {
    return res.status(400).send({message: "Order Not Found"})
  }
  const product = data.rows[0]

  res.status(200).send(`Product deleted: ${product}`)

  } catch (error) {
    console.error(error)
    res.status(403).send({message: error.detail})
    
  }
  
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}