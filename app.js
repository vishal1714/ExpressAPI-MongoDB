const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const colors = require('colors');
const bodyParser = require('body-parser');
const { CreatePath } = require('./controllers/APILogManager');

dotenv.config({ path: './config/Config.env' });
const ConnectDB = require('./config/DB');

ConnectDB();
CreatePath(process.env.LOGDIR);

const app = express();
app.use(express.json());

if (process.env.NODE_ENV == 'Dev') {
  app.use(morgan('dev'));
}
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, resp, next) => {
  resp.setHeader('Access-Control-Allow-Headers', '*');
  resp.setHeader('Access-Control-Allow-Origin', '*');
  resp.removeHeader('X-Powered-By', '*');
  resp.removeHeader('Server', '*');
  next();
});

//Web reander Route
if (process.env.WEBUI == 'ON') {
  const webroute = require('./routes/Web');
  app.use('/', webroute); 
}else {
  app.get("/" , (req,resp,next) => {
    resp.status(200).send("Raje Tech Employee API")
  })
}


// Employee API Route
const route = require('./routes/APIv1');
app.use('/api/v1', route);

// Employee Secure API Route
const secureroute = require('./routes/APIv2Secure');
app.use('/api/v2', secureroute);

//Admin API Route
const adminroute = require('./routes/Admin');
app.use('/apiadmin', adminroute);

// Error handling
app.use((req, resp, next) => {
  var error = new Error('Not Found ⛔ ');
  error.status = 404;
  next(error);
});

app.use((error, req, resp, next) => {
  resp.status(error.status || 500);
  resp.json({
    Error: {
      message: error.message,
    },
  });
});

//console.log = function(){};
//
const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(
    `Server Started in ${process.env.NODE_ENV} mode on Port ${PORT}`.white.bold
  )
);
