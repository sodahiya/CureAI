const express = require('express');
const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override');

// const mongoose = require('mongoose');
// require('dotenv').config();

const app = express();


// setting for the views directory and serving static files
app.set('view engine' , ejs);
app.set("views" , path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname , "public")));

// setting the middlewares to accept post requests
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// to override post and get Request 
app.use(methodOverride('_method'))

// // MongoDB connection URL using environment variable
// const mongoURI = process.env.MONGO_URI; // Getting MongoDB URI from the .env file

// Connect to MongoDB
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected successfully"))
//   .catch(err => console.error("MongoDB connection error:", err));

// Example route for testing
app.get('/', (req, res) => {
  res.render('index.ejs')
});
app.get('/signup' , (req, res)=>{
    res.render('signup.ejs')
})
app.get('/login' , (req, res)=>{
    res.render('login.ejs')
})
// Start the server using the PORT from .env file
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
