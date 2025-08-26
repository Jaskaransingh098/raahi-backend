const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Initialize environment variables BEFORE loading any modules that use them
dotenv.config();

const cors = require("cors");
const tourRoutes = require('./routes/tourRoutes');
const trekRoutes = require("./routes/trekRoutes");
const adminRoutes = require('./routes/adminRoutes');
const mailRoutes = require("./routes/mailRoutes");
const path = require("path");


const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
console.log("Serving uploads from:", path.join(__dirname, "uploads"));
app.use('/api/tours', tourRoutes);
app.use('/api/treks', trekRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/mail", mailRoutes);


console.log("MAIL_USER:", process.env.MAIL_USER);
// Do not log MAIL_PASS for security


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));


app.get('/', (req, res) => {
    res.send('Backend is running!');
});




const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});