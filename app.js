const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/error');

const path = require("path");
const app = express();

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: 'backend/config/config.env' });
}

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const user = require('./routes/userRoute');
const product = require('./routes/productRoute');
const order = require('./routes/orderRoute');
const payment = require('./routes/paymentRoute');
const categoryRoutes = require('./routes/categoryRoute');
const contactusRoutes = require('./routes/contactusRoute');
const roleRoutes = require('./routes/roleRoute');

app.use('/api/v1', user);
app.use('/api/v1', product);
app.use('/api/v1', order);
app.use('/api/v1', payment);
app.use('/api/v1', categoryRoutes);
app.use('/api/v1', contactusRoutes);
app.use('/api/v1', roleRoutes);

// serve uploaded images
app.use('/admin/product/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(errorMiddleware);

module.exports = app;
