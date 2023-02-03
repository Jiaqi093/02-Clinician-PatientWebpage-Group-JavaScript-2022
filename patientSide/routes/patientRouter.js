const express = require('express');

const passport = require("passport");
require("../config/passport")(passport);
const utility = require("./patientUtility.js");

// create our Router object
const patientRouter = express.Router()

// import people controller functions
const PatientController = require('../controllers/PatientController')

// login part
patientRouter.get("/login", utility.unLoggedIn, PatientController.renderLogin);

patientRouter.post("/login", utility.unLoggedIn,
    passport.authenticate("patient-login", {
    successRedirect: "/patient/home",
    failureRedirect: "/patient/login",
    failureflash: true,
  })
);

//change password part
patientRouter.get("/updatePwd",utility.isLoggedIn,PatientController.renderChangePwd);

patientRouter.post("/updatePwd", utility.isLoggedIn, PatientController.updatePwd);

//about pages
patientRouter.get("/aboutWebsite", PatientController.getAboutWeb);
patientRouter.get("/aboutDiabetes", PatientController.getAboutDiabetes);

//log out
patientRouter.post("/logout", utility.isLoggedIn, PatientController.logout);

//render home page for patient user
patientRouter.get("/home", utility.isLoggedIn, PatientController.getHomeData);

patientRouter.get('/recordingData', utility.isLoggedIn, PatientController.getRecordingData)

//render the get leaderboard
patientRouter.get('/leaderboard', utility.isLoggedIn, PatientController.getLeaderboard)

patientRouter.get('/viewData', utility.isLoggedIn, PatientController.viewData)

//this is the post for the recording data page
patientRouter.post("/:_id", PatientController.postAllEntry)

patientRouter.post("/:_id/comment", PatientController.postPatientComment)

//404page
patientRouter.get('*', PatientController.get404)

// export the router
module.exports = patientRouter
