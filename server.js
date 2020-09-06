const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const config = require('config')


//Set database and connect to mongoDB
app.use(express.json());
const db = config.get('mongoURI');
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true
    })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

//Use routes
app.use('/api/owes', require('./routes/api/owes'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

//Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    //Set static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.port || 5000;
app.listen(port, () => console.log(`Server started on port ${port}`));