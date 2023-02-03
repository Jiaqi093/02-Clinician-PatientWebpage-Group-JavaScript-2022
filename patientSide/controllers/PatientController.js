// import the db.js model

const {data} = require("../models/db.js");
const {patient} = require('../models/db.js')
const {comment} = require('../models/db.js')


//some local helper functions
function checkInput(input) {
  return (input !== undefined) && (input !== "")
};

function sortFunction(a, b) {
  if (a[1] === b[1]) {
      return 0;
  }
  else {
      return (a[1] < b[1]) ? 1 : -1;
  }
}

// handle request to get one data instance

const getHomeData = async(req, res) => {
      
  res.render('HomePage.hbs', {patientData: req.user.supprtMSG, patientName:req.user.nameGiven}) 
    
}
//this controller renders the recording data and also fetcehc patient entered data to the page
const getRecordingData = async(req, res) => {

  res.render('redataCopy.hbs', {patientInfo: req.user.toJSON(),patientName:req.user.nameGiven}) 
  
}

//this controller method is for the form for the patient entry of their data
const postAllEntry = async(req, res) => {


  let user = await patient.findOne({_id: req.user._id}).lean()
  
  let found = false;
  let currDate = new Date();

  for (let i = 0; i < user.historyData.length; i++) {
      let currentData = user.historyData[i];

      if (currDate.getMonth() === currentData.when.getMonth() && currDate.getDate() === currentData.when.getDate() && currDate.getFullYear() === currentData.when.getFullYear()) {
          found = true;

          if (currentData.bloodGlucoseLevel === null) {

              patient.findOneAndUpdate(
                  
                  { "historyData._id":currentData._id}, 
                  
                  {$set: {"historyData.$.bloodGlucoseLevel": req.body.bloodGlucoseLevel
                         }
                  }, 
                                  
                  function(err,doc) {
                  }
              );
              if (checkInput(req.body.bloodGlucoseLevel)) {
                  count++;
                  patient.findOneAndUpdate(
                  
                      { "historyData._id":currentData._id}, 
                      
                      {$set: {"historyData.$.bloodGlucoseLevelWhen": new Date()
                             }
                      }, 
                                      
                      function(err,doc) {
                      }
                  );
              }

          }

          if (currentData.weight === null) {

              patient.findOneAndUpdate(
                  
                  { "historyData._id":currentData._id}, 
                  
                  {$set: {"historyData.$.weight": req.body.weight
                         }
                  }, 
                                  
                  function(err,doc) {
                  }
              );
              if (checkInput(req.body.weight)) {
                  count++;
                  patient.findOneAndUpdate(
                  
                      { "historyData._id":currentData._id}, 
                      
                      {$set: {"historyData.$.weightWhen": new Date()
                             }
                      }, 
                                      
                      function(err,doc) {
                      }
                  );
              }
          }

          if (currentData.doseOfInsulinTaken === null) {

              patient.findOneAndUpdate(
                  
                  {"historyData._id":currentData._id}, 
                  
                  {$set: {"historyData.$.doseOfInsulinTaken": req.body.doseOfInsulinTaken
                         }
                  }, 
                                  
                  function(err,doc) {
                  }
              );
              if (checkInput(req.body.doseOfInsulinTaken)) {
                  count++;
                  patient.findOneAndUpdate(
                  
                      { "historyData._id":currentData._id}, 
                      
                      {$set: {"historyData.$.doseOfInsulinTakenWhen": new Date()
                             }
                      }, 
                                      
                      function(err,doc) {
                      }
                  );
              }
          }

          if (currentData.exercise === null) {

              patient.findOneAndUpdate(
                  
                  {"historyData._id":currentData._id}, 
                  
                  {$set: {"historyData.$.exercise": req.body.exercise
                         }
                  }, 
                                  
                  function(err,doc) {
                  }
              );
              if (checkInput(req.body.exercise)) {
                  count++;
                  patient.findOneAndUpdate(
                  
                      { "historyData._id":currentData._id}, 
                      
                      {$set: {"historyData.$.exerciseWhen": new Date()
                             }
                      }, 
                                      
                      function(err,doc) {
                      }
                  );
              }
          }
          break;
      }
  }

  if (!found) {

      if (checkInput(req.body.bloodGlucoseLevel)) {
          var bloodGlucoseLevelWhenIfEntered = new Date();
      } else {
          bloodGlucoseLevelWhenIfEntered = null;
      }
      if (checkInput(req.body.weight)) {
          var weightWhenIfEntered = new Date();
      } else {
          weightWhenIfEntered = null;
      }
      if (checkInput(req.body.doseOfInsulinTaken)) {
          var doseOfInsulinTakenWhenIfEntered = new Date();
      } else {
          doseOfInsulinTakenWhenIfEntered = null;
      }
      if (checkInput(req.body.exercise)) {
          var exerciseWhenIfEntered = new Date();
      } else {
          exerciseWhenIfEntered = null;
      }

      let newData = new data(
          {
              when: new Date(),

              bloodGlucoseLevelWhen: bloodGlucoseLevelWhenIfEntered,
              weightWhen: weightWhenIfEntered,
              doseOfInsulinTakenWhen: doseOfInsulinTakenWhenIfEntered,
              exerciseWhen: exerciseWhenIfEntered,
      
              bloodGlucoseLevel: req.body.bloodGlucoseLevel,
              weight: req.body.weight,
              doseOfInsulinTaken: req.body.doseOfInsulinTaken,
              exercise: req.body.exercise
          }
      )
      newData.save();
      
      let thisUser = await patient.findOne({_id: req.user._id})
      thisUser.historyData.push(newData);
      thisUser.save();
  }

  res.redirect("/patient/recordingData")
}


//this controller method fecthces patient's recorded data and display on table 
const viewData = async(req, res) => {
  res.render('viewData.hbs', {patientInfo:req.user.toJSON(),patientName:req.user.nameGiven}) 
}

const postPatientComment = async(req, res) => {


  let newComment = new comment(
    {
      when: Date(),
      patientID: req.params._id,
      clinicianEmail: req.user.clinicianEmail,
      firstName: req.user.nameGiven,
      lastName: req.user.nameFamily,
      comments: req.body.patientComment
    })

    newComment.save();
    res.redirect("/patient/recordingData")
}


//patient login and change password
const renderLogin = (req, res) => {
  res.render("patientLogin.hbs", req.session.flash);
};
  
const renderChangePwd = (req, res) => {
  res.render("changePwd.hbs");
};
  
const updatePwd = async (req, res) => {
  try {
    const Patient = await patient.findById(req.user._id);
    if (!(req.body.oldPwd == Patient.password)) {
      return res.render("changePwd", {
        message: "Incorrect Current Password!",
      });
    }

    if (req.body.oldPwd == req.body.newPwd) {
      return res.render("changePwd", {
        message: "New password is same as old one!",
      });
    }

    if (!(req.body.newPwd == req.body.confirm)) {
      return res.render("changePwd", {
        message: "Those passwords did not match. Try again.",
      });
    }

    Patient.password = req.body.confirm;
    await Patient.save();
    res.render("changePwd", { message: "Successed!" });

    } catch (err) {
      console.log(err);
      res.send("error happens when update password");
    }
};
  
const logout = (req, res) => {
  req.logout();
  res.redirect("/patient/login");
};

const getAboutWeb = async(req, res) => {
  res.render("Aboutwebsite.hbs", { loggedin: req.isAuthenticated()})
}

const getAboutDiabetes  = async(req, res) => {
  res.render("AboutDiabetes.hbs", { loggedin: req.isAuthenticated()})
}

const get404 = async(req, res) => {
  res.render("404.hbs")
}

const getLeaderboard = async(req, res) => {
  var allInfo = [];
  let allPatients = await patient.find({}).lean()

  if (allPatients) {
      patientLen = allPatients.length;
      
      for(let i = 0; i<patientLen; i++){
          // if history data
          historyLen = allPatients[i].historyData.length;

          // current date - register date  
          let currDate = new Date();
          let registerDate = allPatients[i].registrationDate;

          var Difference_In_Time = currDate.getTime() - registerDate.getTime()
          var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

         
          temp = [];
          temp.push(allPatients[i].nameGiven + " " + allPatients[i].nameFamily)
          if (Difference_In_Days >= 1){
            var rate = Math.round(historyLen/Difference_In_Days*100)
            temp.push(rate)
          }else{
            Difference_In_Days = 1
            var rate = Math.round(historyLen/Difference_In_Days*100)
            temp.push(rate)
          }

          allInfo.push(temp)
          
      }

      allInfo.sort(sortFunction);
      result = allInfo.slice(0,5);

      
      for(let j =0; j<result.length; j++){
          result[j].push(j+1);
      }

      res.render('LeaderBoard.hbs', {Alldata: result});
  }
}


// exports an object, which contain functions imported by router
module.exports = {
    getHomeData,
    getRecordingData,
    postAllEntry,
    viewData,
    postPatientComment,
    renderLogin,
    renderChangePwd,
    updatePwd,
    logout,
    getAboutWeb,
    getAboutDiabetes,
    get404,
    getLeaderboard
}
