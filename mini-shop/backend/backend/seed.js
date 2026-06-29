// Run with: npm run seed
// Wipes existing products and inserts a small sample catalog so the
// store has something to show immediately after setup.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Product = require('./models/Product');

const sampleProducts = [
  {
    name: 'Canvas Weekender Bag',
    description: 'A durable canvas duffel with leather trim, built for weekend trips and gym days alike.',
    price: 78,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600',
    category: 'bags',
    stock: 24,
  },
  {
    name: 'Ceramic Pour-Over Set',
    description: 'A hand-glazed ceramic dripper and matching mug, for a slower morning coffee ritual.',
    price: 42,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600',
    category: 'home',
    stock: 40,
  },
  {
    name: 'Merino Wool Crewneck',
    description: 'Lightweight merino wool sweater that regulates temperature in any season.',
    price: 95,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600',
    category: 'apparel',
    stock: 15,
  },
  {
    name: 'Walnut Desk Organizer',
    description: 'Solid walnut tray with sections for pens, cards, and small desk essentials.',
    price: 34,
    image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600',
    category: 'home',
    stock: 30,
  },
  {
    name: 'Recycled Nylon Backpack',
    description: 'Water-resistant daypack made from recycled nylon, with a padded 15" laptop sleeve.',
    price: 88,
    image: 'https://images.unsplash.com/photo-1622560480654-d96214fdc887?w=600',
    category: 'bags',
    stock: 18,
  },
  {
    name: 'Stoneware Dinner Set (4pc)',
    description: 'Matte-glazed stoneware plates, dishwasher and microwave safe.',
    price: 64,
    image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=600',
    category: 'home',
    stock: 22,
  },
  {
    name: 'Linen Button-Up Shirt',
    description: 'Breathable European linen, relaxed fit, garment-dyed for a soft worn-in feel.',
    price: 58,
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600',
    category: 'apparel',
    stock: 0,
  },
  {
    name: 'Brass Desk Lamp',
    description: 'Adjustable brass lamp with a warm dimmable bulb, solid marble base.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',
    category: 'home',
    stock: 12,
  },
];

const run = async () => {
  await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);
  console.log(`Seeded ${sampleProducts.length} products.`);
  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
