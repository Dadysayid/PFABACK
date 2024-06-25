const path = require('path');
const mongoose = require("mongoose");
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const userRoute=require('./routes/userRoute')
const authRoute=require('./routes/authRoute')
const annocementRoute=require('./routes/annocementRoute')
const vactRoute=require('./routes/vacationRoute')
const meetingRoute=require('./routes/meetingRoute')
var bodyParser = require('body-parser')

// express app
const app = express();

// Enable other domains to access your application
app.use(cors());
app.options('*', cors());

// compress all responses
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use('/api/v1/users', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/vact', vactRoute);
app.use('/api/v1/meeting', meetingRoute);
app.use('/api/v1/annocement', annocementRoute);




// Middlewares
app.use(express.json({ limit: '20kb' }));
app.use('/uploads' , express.static(__dirname+'/uploads'))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}



mongoose
  .connect(
    "mongodb+srv://devali:dady1111@cluster0.cvjs7xr.mongodb.net/all-data?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
   
      console.log(`yhuhhujhu/`);

  })
  .catch((err) => {
    console.log(err);
  });



const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running running on port ${PORT}`);
});



