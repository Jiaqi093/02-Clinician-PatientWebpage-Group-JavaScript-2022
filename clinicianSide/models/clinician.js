const mongoose = require('mongoose')


const clinicianSchema = new mongoose.Schema(
    {
        email: {type:String, required: true, unique: true},
        givenName: String,
        familyName: String,
        password:String,
    }
)


const clinician = mongoose.model("clinician", clinicianSchema);

module.exports = {clinician}