const exphbs = require('express-handlebars')
require("dotenv").config();

// Import express
const express = require('express')

// Set your app up as an express app
const app = express()

const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://account:passworde@cluster0.xdvtv.mongodb.net/D3", {useNewUrlParser: true}, {useUnifiedTopology: true});

// configure Handlebars
app.engine('hbs', exphbs.engine({ 
    defaultlayout: 'main',
    extname: 'hbs',

    helpers: {
        isSafe: function (v1, v2, v3) {
            
            if( v1 < v2 && v1 > v3){
                return true
            } else {
                return false
            }
        },

        timeEQ: function(v1){


            var currDate = new Date();

            return (currDate.getMonth()===v1.getMonth() && currDate.getDate()===v1.getDate() && currDate.getFullYear()===v1.getFullYear())
        },

        isRequired: function (v1) {
    
            if(v1){
                return false
            } else {
                return true
            }
        },


        isDataEntered: function(v1){
            if(v1 != null){
                return true
            } else if (v1 == null) {
                return false
            }
        },

        getDateTime: function(v1){

            let year = v1.getFullYear();
            let month = v1.getMonth() + 1;
            let date = v1.getDate();
            let hour = v1.getHours();
            let min = v1.getMinutes();
        
            return year.toString()+"/"+month.toString()+"/"+date.toString()+"   "+hour.toString()+":"+min.toString()

        }, 

        firstPlace: function(v1) {
            if (v1 == 1) {
                return true
            } else {
                return false
            }
        },

        secondPlace: function(v1) {
            if (v1 == 2) {
                return true
            }
        },

        thirdPlace: function(v1) {
            if (v1 == 3) {
                return true
            }
        },

        fourthPlace: function(v1) {
            if (v1 == 4) {
                return true
            }
        },

        fifthPlace: function(v1) {
            if (v1 == 5) {
                return true
            }
        },

        isbadge: function(v1){
            if (v1 > 80) {
                return true
            }
        }
    }
}))

// set Handlebars view engine
app.set('view engine', 'hbs')

app.use(express.static('public'))
app.use(express.static("images"))

// Set up to handle POST requests
app.use(express.json()) // needed if POST data is in JSON format
app.use(express.urlencoded({ extended: false })) // only needed for URL-encoded input


/*!!!!!!!!Login Part!!!!!!!!*/
const passport = require('passport');
const flash = require("express-flash");
const session = require("express-session");


require('./config/passport')(passport);
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 900000}
}))
app.use(passport.initialize())
app.use(passport.session())

// link to our router
const patientRouter = require('./routes/patientRouter')

// the demo routes are added to the end of the '/people' path
app.use('/patient', patientRouter)

// Tells the app to listen on port 3000 and logs that information to the console.
app.listen(process.env.PORT || 3000, () => {
    console.log('The library app is running!')
    })    
