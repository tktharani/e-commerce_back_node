const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const verifyToken = require('./middleware/UserMiddleware'); // Import the middleware
const productRouter = require('./routes/ProductRoute');
const userRouter = require('./routes/UserRoute');
 const cartRouter=require('./routes/CartRoute')

const PORT = process.env.PORT || 5000;
const MONGODB_URL = "mongodb://localhost/productdatabase";

mongoose.connect(MONGODB_URL)
  .then(() => {
    console.log(`${MONGODB_URL} connection successfully....`);
  })
  .catch((err) => {
    console.error("Error in connecting to MongoDB", err.message);
  });

// Middleware
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));
app.use(express.json());

// Static Files
app.use("/public", express.static(__dirname + "/public"));

// Routes
app.get('/images/:filename', (req, res) => {
  const filename = req.params.filename;
  res.sendFile(path.join(__dirname, 'public', 'data', 'uploads', filename));
});
app.use(productRouter);
app.use(userRouter);
 app.use(cartRouter)



// Protected and Unprotected Routes
app.use("/unprotected", (req, res) => {
  res.status(200).send("This is an unprotected API");
});

app.use("/protected", verifyToken, (req, res, next) => {
  res.status(200).send("This is a protected API");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
