const LocalStrategy = require("passport-local").Strategy;

const {clinician} = require("../models/clinician.js");


module.exports = (passport) => {

  // store user information in and retrieve user info from session
  passport.serializeUser((user, done) => {
    done(null, {_id: user._id, role: user.role})
  })

  passport.deserializeUser((login, done) => {
    
    clinician.findById(login._id, (err, user) => {
      return done(err, user)
    })
 
  })

  passport.use(
    "clinician-login", 
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback : true
    },
    (req, email, password, done) => {
        process.nextTick(() => {
          clinician.findOne({'email': email}, async(err, clinician) => {
              if (err) {
                return done(err);
              } else if (!clinician) {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
              } else if (!(password == clinician.password)) {
                return done(null, false, req.flash('loginMessage', 'Wrong password.'));
              } else {
                return done(null, clinician, req.flash('loginMessage', 'Succeed!'));
              }
            });
        })
    })
  )

  
}