const LocalStrategy = require("passport-local").Strategy;

const {patient} = require("../models/db.js");


module.exports = (passport) => {

  // store user information in and retrieve user info from session
passport.serializeUser((user, done) => {
  done(null, {_id: user._id, role: user.role})
})

passport.deserializeUser((login, done) => {

    patient.findById(login._id, (err, user) => {
      return done(err, user)
    })

})

  passport.use(
    "patient-login", 
    new LocalStrategy({
        usernameField: "email",
        passwordField: "password",
        passReqToCallback : true
    },
    (req, email, password, done) => {
        process.nextTick(() => {
          patient.findOne({'email': email}, async(err, patient) => {
              if (err) {
                return done(err);
              } else if (!patient) {
                return done(null, false, req.flash('loginMessage', 'No user found.'));
              } else if (!(password == patient.password)) {
                return done(null, false, req.flash('loginMessage', 'Wrong password.'));
              } else {
                return done(null, patient, req.flash('loginMessage', 'Succeed!'));
              }
            });
        })
    })
  )
}