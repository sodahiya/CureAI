// Import necessary modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// Initialize Express app
const app = express();

// Set up middleware to parse JSON and handle URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// MongoDB connection setup (Replace with your own MongoDB URI)
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Set up routes
app.get('/', (req, res) => {
    res.render('index');  // Renders 'index.ejs' from the views folder
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
