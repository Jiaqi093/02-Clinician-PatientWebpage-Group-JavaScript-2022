// Import express
const express = require("express");

// Set your app up as an express app
const app = express();
//
app.use(express.static("public"));
app.use(express.static("images"));
const exphbs = require("express-handlebars");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");


/*passport!!!!*/
require("dotenv").config();

const passport = require('passport');
const flash = require("express-flash");
const session = require("express-session");
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 900000}
}))
app.use(passport.initialize())

app.use(passport.session())


mongoose.connect(
  "mongodb+srv://account:password@cluster0.xdvtv.mongodb.net/D3",
  { useNewUrlParser: true },
  { useUnifiedTopology: true }
);


app.set("view engine", "ejs");

app.engine(
  "hbs",
  exphbs.engine({
    defaultlayout: "main",
    extname: "hbs",

    helpers: {
      isSafe: function (v1, v2, v3) {
        if (v1 < v2 && v1 > v3) {
          return true;
        } else {
          return false;
        }
      },

      timeEQ: function (v1) {
        //var currTime = moment.tz(v1, "Australia/Melbourne");

        var currDate = new Date();

        return (
          currDate.getMonth() === v1.getMonth() &&
          currDate.getDate() === v1.getDate() &&
          currDate.getFullYear() === v1.getFullYear()
        );
      },

      isDataEntered: function (v1) {
        if (v1 != null) {
          return true;
        } else if (v1 == null) {
          return false;
        }
      },

      isNull: function (v1) {
        if (v1.length === 0) {
          return true;
        }
      },

      lastElem: function (v1) {
        return v1[v1.length-1];
      },
      
      getDateTime: function(v1){

        let year = v1.getFullYear();
        let month = v1.getMonth() + 1;
        let date = v1.getDate();
        let hour = v1.getHours();
        let min = v1.getMinutes();
    
        return year.toString()+"/"+month.toString()+"/"+date.toString()+"   "+hour.toString()+":"+min.toString()


       
    },
    isRequired: function (v1) {
    
      if(v1){
          return false
      } else {
          return true
      }
  },
    },
  })
);

app.set("view engine", "hbs");

// Set up to handle POST requests
app.use(express.json()); // needed if POST data is in JSON format

// middleware to log a message each time a request arrives at the server - handy for debugging
app.use((req, res, next) => {
  console.log("message arrived: " + req.method + " " + req.path);
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));

// link to our router
const clinicianRouter = require("./routes/ClinicianRouter");

app.use("/clinician", clinicianRouter);

// Tells the app to listen on port 3000 and logs tha tinformation to the console.
app.listen(process.env.PORT || 3000, () => {
  console.log("The library app is running!");
});
