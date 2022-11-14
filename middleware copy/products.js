const db = require('../config/database')

const getProducts = (req, res) => {
  db.pool.query('SELECT id, name, LOWER(description) AS description, ROUND(price,2) AS price FROM products ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).json(results.rows)
  })
}
//TODO: add check for existing product
const getProductById = (req, res) => {
  const id = parseInt(req.params.id)
      db.pool.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
          if (error) {
          throw error
          }
          res.status(200).json(results.rows)
      })
}

const createProduct = (req, res) => {
  const { name, description, price } = req.body
  db.pool.query('INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *', [name, description, price], (error, results) => {
    if (error) {
      throw error
    } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
        throw error
    }
    res.status(201).send(`Product added with ID: ${results.rows[0].id}`)
  })
}


const updateProduct = (req, res) => {
  const id = parseInt(req.params.id)
  const { name, description, price} = req.body
  db.pool.query(
    'UPDATE products SET name = $1, description = $2,  price = $3 WHERE id = $4 RETURNING *',
    [name, description, price, id],
    (error, results) => {
      if (error) {
        throw error
      } 
      if (typeof results.rows == 'undefined') {
          res.status(404).send(`Resource not found`);
      } else if (Array.isArray(results.rows) && results.rows.length < 1) {
          res.status(404).send(`Product not found`);
      } else {
             res.status(200).send(`Product modified with ID: ${results.rows[0].id}`)         	
      }
    }
  )
}

const deleteProduct = (req, res) => {
  const id = parseInt(req.params.id)
  db.pool.query('DELETE FROM products WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    res.status(200).send(`Product deleted with ID: ${id}`)
  })
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}