const { default: mongoose } = require("mongoose");

const dataSchema = new mongoose.Schema(
    {
        when: {type: Date, default: Date.now},

        bloodGlucoseLevelWhen: Date,
        weightWhen: Date,
        doseOfInsulinTakenWhen: Date,
        exerciseWhen: Date,

        bloodGlucoseLevel: Number,
        weight: Number,
        doseOfInsulinTaken: Number,
        exercise: Number
    }
)

const commentSchema = new mongoose.Schema(
    {
        when: {type: Date, default: Date.now},
        
        clinicianEmail:String,
        patientID:String,
        firstName: String,
        lastName: String,
        comments:String
    },

    {timestamps: true}
)

const patientSchema = new mongoose.Schema(
    {
        nameGiven: {type: String, required: true},
        nameFamily: {type: String, required: true},
        email: {type:String, required: true, unique: true},
        password: {type:String, required: true},

        clinicianEmail: {type:String, required: true},

        bloodGlucoseRequired: {type:Boolean, default: false},
        weightRequired: {type:Boolean, default: false},
        doseOfInsulinTakenRequired: {type:Boolean, default: false},
        exerciseRequired: {type:Boolean, default: false},


        bloodGlucoseLevelMin: Number,
        bloodGlucoseLevelMax: Number,

        weightMax: Number, 
        weightMin: Number,

        doseOfInsulinTakenMin: Number,
        doseOfInsulinTakenMax: Number,

        exerciseMin: Number,
        exerciseMax: Number,

        historyData: [dataSchema],
        supprtMSG: String,
        clinicianNote: String,

        registrationDate: Date,
    }
)

const data = mongoose.model("data",dataSchema);
const comment = mongoose.model("comment", commentSchema);
const patient = mongoose.model("patient", patientSchema);


module.exports = {data, comment, patient};