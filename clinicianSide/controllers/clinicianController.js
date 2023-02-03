const {patient} = require('../models/db.js')
const {clinician} = require('../models/clinician.js');
const {comment} = require('../models/db.js')

const moment = require('moment')
const today = moment().startOf('day')

//this finds a specific clinician and we display information about his patient
const getClinician =  async(req, res) => {

    //find the patient corresponding to the clinician
    const allPatient = await patient.find({clinicianEmail: req.user.email}).lean()

    //pass the current date to the dashboard handlebar
    date = new Date();
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();
    const today = year.toString()+"/"+month.toString()+"/"+day.toString();

    if(allPatient){
        res.render('dashboard.hbs', {patients:allPatient, clinicianINFO:req.user.toJSON(), clinicianName: req.user.givenName, date:today})
    }
}

const renderLogin = (req, res) => {
    res.render("clinicianLogin.hbs", req.session.flash);
};

const postNewUser = async(req, res) => {
    //check whether the email entry is registered
    const User = await patient.findOne({email:req.body.email}).lean()

    //if the user already exists
    if(User){
        res.redirect("/clinician/home")
        
    } else {
        let newUser = new patient({ 
            nameGiven: req.body.givenName,
            nameFamily: req.body.familyName,
            email: req.body.email,
            password:req.body.password,
            clinicianEmail: req.user.email, 
            BGLrequired: false,
            DOIrequired:false,
            weightrequired:false,
            exerciseRequired:false,
            registrationDate: {type: Date, default: Date.now}
        })

        newUser.save();
        res.redirect("/clinician/home")
    }
};

//this is for fecthing data that belongs to certain patient when we are accesing this patient's view data page
const getSpecificPatient = async(req, res) => {

    const onePatient = await patient.findOne({_id:req.params.patient_id}).lean()
    
    if (onePatient) {
        res.render('workingWithPatient', {patientINFO: onePatient}) 
    } else {
        res.send([])
    }
};

// this is the post that we have get all our requirement of the user to the databse
const postNewPatientRequirement = async(req,res) => {

    
    const onePatient = await patient.findOne({_id:req.params.patient_id}).lean()

    patient.findOneAndUpdate({email:onePatient.email}, 
                           {$set: {bloodGlucoseLevelMin: req.body.BGLMin, 
                                   bloodGlucoseLevelMax: req.body.BGLMax,
                                   weightMax: req.body.WeightMax, 
                                   weightMin: req.body.WeightMin,
                                   exerciseMin: req.body.ExerMin,
                                   exerciseMax: req.body.ExerMax,
                                   doseOfInsulinTakenMin: req.body.MinDOI,
                                   doseOfInsulinTakenMax: req.body.MaxDOI,
                                   supprtMSG:req.body.supportMSG,
                                   clinicianNote:req.body.clinicalNote,
                                  }}, {new: true}, (err, doc) => {
  });

  currURL = "/clinician/" + req.params.patient_id
  res.redirect(currURL)
}

const postNewTimeSeries = async(req, res) => {

    let BGLCheckBoxBool = req.body['BGLCheckBox'];
    let DOICheckBoxBool = req.body['DOICheckBox'];
    let exerciseCheckBoxBool = req.body['exerciseCheckBox'];
    let weightCheckBoxBool = req.body['weightCheckBox'];

    let BGLBool = false;
    let DOIBool = false;
    let weightBool = false;
    let exerciseBool = false;

  if(BGLCheckBoxBool === "on") {
   
      BGLBool = true;
  } else {
      BGLBool = false
  }

  if (DOICheckBoxBool === "on") {
      DOIBool = true;
  } else {
      DOIBool = false;
  }

  if (weightCheckBoxBool === "on") {
      weightBool = true;
  } else {
      weightBool = false;
  }

  if (exerciseCheckBoxBool === "on") {
      exerciseBool = true;
  } else {
      exerciseBool = false;
  }

  const onePatient = await patient.findOne({_id:req.params.patient_id}).lean()

  patient.findOneAndUpdate({email:onePatient.email}, 
                         {$set: {
                                 bloodGlucoseRequired: BGLBool, 
                                 doseOfInsulinTakenRequired: DOIBool,
                                 weightRequired: weightBool,
                                 exerciseRequired: exerciseBool
                                }}, {new: true}, (err, doc) => {
});

currURL = "/clinician/" + req.params.patient_id
res.redirect(currURL)

}


const getViewPatientData = async(req, res) => {
    const onePatient = await patient.findOne({_id:req.params.patient_id}).lean()

    if(onePatient){
        res.render('viewData.hbs', {oneItem:onePatient})
    } else {
        res.send([])
    }
}

const getAllPatientComment = async(req, res) => {

    const allComments = await comment.find({clinicianEmail: req.user.email,
        createdAt: {
            $gte: today.toDate(),
            $lte: moment(today).endOf('day').toDate()
        }
    } ).lean()
    
    res.render('allComments', {allComments:allComments, clinicianID:req.user._id})

}

const renderChangePwd = (req, res) => {
    res.render("changePwd.hbs");
  };
  
const updatePwd = async (req, res) => {
    try {
      const Clinician = await clinician.findById(req.user._id);
      if (!(req.body.oldPwd == Clinician.password)) {
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
      Clinician.password = req.body.confirm;
      await Clinician.save();
      res.render("changePwd", { message: "Successed!" });
    } catch (err) {
      console.log(err);
      res.send("error happens when update password");
    }
};

const logout = (req, res) => {
    req.logout();
    res.redirect("/clinician/login");
  };

const get404 = async(req, res) => {
    res.render("404.hbs")
}
  
module.exports = {
    getClinician,
    postNewUser,
    getSpecificPatient,
    postNewPatientRequirement,
    getViewPatientData,
    getAllPatientComment,
    updatePwd,
    renderLogin,
    renderChangePwd,
    logout,
    postNewTimeSeries,
    get404,
}


