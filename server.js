const express = require('express')
const app = express();
const session = require('express-session');
const db = require('./db');
require('dotenv').config();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.set('view engine', 'ejs');
const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 3000;

// Import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// Use the routers
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);

app.get('/bharatvoter' , async (req, res) => {
    
        res.render('logouthome'); 
      
  });

  app.get('/process??' , async (req, res) => {
    
    res.render('logout_process'); 
  
});

app.get('/about??' , async (req, res) => {
    
  res.render('logout_aboutpage'); 

});

  
app.listen(PORT, ()=>{
    console.log('listening on port 7000');
})