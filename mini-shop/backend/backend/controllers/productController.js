const Product = require('../models/Product');

// GET /api/products?search=&category=&page=&limit=
const getProducts = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;
    const query = {};

    if (category) query.category = category.toLowerCase();
    if (search) query.$text = { $search: search };

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.min(parseInt(limit, 10) || 12, 50);

    const [products, total, categories] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Product.countDocuments(query),
      Product.distinct('category'),
    ]);

    res.json({
      products,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      categories,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

// POST /api/products (admin only)
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, image, category, stock } = req.body;
    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({ message: 'Name, description, price, and category are required' });
    }

    const product = await Product.create({ name, description, price, image, category, stock });
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id (admin only)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const { name, description, price, image, category, stock } = req.body;
    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (image !== undefined) product.image = image;
    if (category !== undefined) product.category = category;
    if (stock !== undefined) product.stock = stock;

    await product.save();
    res.json({ product });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id (admin only)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
