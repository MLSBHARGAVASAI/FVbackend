const express = require('express');
const app = express();
let port = process.env.PORT || 5000;
app.set("view engine", "ejs");

const fruits = require("./mongo/fruits"); // Ensure this path and file are correct
const vegetables = require("./mongo/vegetables"); // Ensure this path and file are correct
const Cart=require("./mongo/cart")

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Root route
app.get('/', (req, res) => {
    res.render("home.ejs");
});

// Route to display all fruits
app.get("/fruits", async (req, res) => {
    try {
        let allfruits = await fruits.find();
        res.render("f.ejs", { allfruits });
    } catch (error) {
        console.error("Error fetching fruits:", error);
        res.status(500).send("Error fetching fruits");
    }
});

// Route to display all vegetables
app.get("/vegetables", async (req, res) => {
    try {
        let allveggies = await vegetables.find();
        res.render("v.ejs", { allveggies });
    } catch (error) {
        console.error("Error fetching vegetables:", error);
        res.status(500).send("Error fetching vegetables");
    }
});

// Route to render add-fruit form
app.get("/add-fruit", (req, res) => {
    res.render("addfru.ejs");
});

// Route to add a new fruit
app.post("/add-fruit", async (req, res) => {
    const { name, img, description, price } = req.body;
    try {
        const newFruit = new fruits({ name, img, description, price });
        await newFruit.save();
        res.redirect("/fruits");
    } catch (error) {
        console.error("Error adding fruit:", error);
        res.status(500).send("Error adding fruit");
    }
});

// Route to render add-vegetable form
app.get("/add-vegetable", (req, res) => {
    res.render("addveg.ejs");
});

// Route to add a new vegetable
app.post("/add-vegetable", async (req, res) => {
    const { name, img, description, price } = req.body;
    try {
        const newVegetable = new vegetables({ name, img, description, price });
        await newVegetable.save();
        res.redirect("/vegetables");
    } catch (error) {
        console.error("Error adding vegetable:", error);
        res.status(500).send("Error adding vegetable");
    }
});

// Route to delete a fruit
app.post("/delete-fruit/:id", async (req, res) => {
    try {
        await fruits.findByIdAndDelete(req.params.id);
        res.redirect("/fruits");
    } catch (error) {
        console.error("Error deleting fruit:", error);
        res.status(500).send("Error deleting fruit");
    }
});

// Route to delete a vegetable
app.post("/delete-vegetable/:id", async (req, res) => {
    try {
        await vegetables.findByIdAndDelete(req.params.id);
        res.redirect("/vegetables");
    } catch (error) {
        console.error("Error deleting vegetable:", error);
        res.status(500).send("Error deleting vegetable");
    }
});

// Route to add an item to the cart
app.get('/add-to-cart/:id', async (req, res) => {
    const { id } = req.params;

    // First try to find the item in the fruits collection
    let item = await fruits.findById(id);
    
    // If not found in fruits, try vegetables collection
    if (!item) {
        item = await vegetables.findById(id);
    }

    // If the item is not found in either collection
    if (!item) {
        return res.status(404).json({ error: 'Item not found' });
    }

    const { name, img, description, price } = item;

    try {
        // Check if the item already exists in the cart
        let cartItem = await Cart.findOne({ name }); // Find by name to handle duplicates in cart

        if (cartItem) {
            // If item exists in cart, increment quantity
            cartItem.quantity += 1;
            await cartItem.save();
            res.redirect('/cart'); // Redirect to cart after adding the item
        } else {
            // If item doesn't exist in cart, create a new cart item
            cartItem = new Cart({ name, img, price, quantity: 1 });
            await cartItem.save();
            res.redirect('/cart'); // Redirect to cart after adding the item
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding item to cart' });
    }
});


  
app.get('/delete-cart-item/:id', async function (req, res) {
        try {
            await Cart.findByIdAndDelete(req.params.id);
            res.redirect('/cart');
        } catch (error) {
            res.status(500).send('Error deleting item from cart');
        }
    });

// Route to view the cart
app.get("/cart", async(req, res) => {
    res.render("cart.ejs", { cartItems: await Cart.find() });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
