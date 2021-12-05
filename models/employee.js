const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    id : {
        type : Number,
        required : true,
        unique : true
    },

    firstname : {
        type : String,
        required : true,
    },

    lastname : {
        type : String,
        required : true,
    },

    emailid : {
        type : String,
        match : /.+\@.+\..+/,
        required : true,
    }
});

const Employee = mongoose.model("employee" , EmployeeSchema);
module.exports = Employee;