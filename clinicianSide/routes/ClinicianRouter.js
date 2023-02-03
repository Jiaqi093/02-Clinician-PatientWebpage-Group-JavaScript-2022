const express = require('express')
const passport = require("passport");
require("../config/passport")(passport);
const utility = require("./clinicianUtility.js");

// create our Router object
const clinicianRouter = express.Router()

// require our controller
const clinicianController = require('../controllers/clinicianController')

// login page render
clinicianRouter.get("/login", utility.unLoggedIn, clinicianController.renderLogin);

//post information from login page
clinicianRouter.post(
  "/login",
  utility.unLoggedIn,
  passport.authenticate("clinician-login", {
    successRedirect: "/clinician/home",
    failureRedirect: "/clinician/login",
    failureflash: true,
  })
);

//render the change password page
clinicianRouter.get( "/updatePwd", utility.isLoggedIn, clinicianController.renderChangePwd);

//post the new details regarding the changed password
clinicianRouter.post("/updatePwd", utility.isLoggedIn, clinicianController.updatePwd);

//log out
clinicianRouter.post("/logout", utility.isLoggedIn, clinicianController.logout);

//render the home screen
clinicianRouter.get("/home", utility.isLoggedIn, clinicianController.getClinician);

  
//render the comment screen and all the recent comments
clinicianRouter.get('/comment', utility.isLoggedIn,clinicianController.getAllPatientComment)

//render the working with specific patient page
clinicianRouter.get('/:patient_id', utility.isLoggedIn,clinicianController.getSpecificPatient)

//render the specific patient view data page
clinicianRouter.get('/:patient_id/viewData',utility.isLoggedIn, clinicianController.getViewPatientData)

//dash board add new user
clinicianRouter.post("/newUser", clinicianController.postNewUser)

//for clinician to post specific requirement to individual patient
clinicianRouter.post("/:patient_id", clinicianController.postNewPatientRequirement)

//for the timeseries
clinicianRouter.post("/:patient_id/newTimeSeries", clinicianController.postNewTimeSeries)




module.exports = clinicianRouter