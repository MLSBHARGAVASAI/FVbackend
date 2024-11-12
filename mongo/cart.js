// getting-started.js
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://mlsbhargavasai5002:Fr9sc1i7CXafvaS1@cluster0.9wslz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
  // use await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test'); if your database has auth enabled
}



// Define the Cart schema
const cartSchema = new mongoose.Schema({
  name: String,
  img: String,
  price: String,
  quantity: { type: Number, default: 1 },
});

// Create the Cart model
const Cart = mongoose.model('Cart', cartSchema);

// Export the Cart model
module.exports = Cart;
