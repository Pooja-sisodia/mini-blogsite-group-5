const mongoose = require("mongoose");

const isValidName=function(name){
    if(/^[a-z ]{1,15}$/i.test(name)){
        return true
    }
}

const isValidTitle=function(title){
    return["Mr","Miss","Mrs"].indexOf(title) !== 0
}

const isValidEmail=function(email){
    if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data.email)) {
        return true;
    
}}

const isValidPassword=function(password){
    if(!/^[a-zA-Z0-9@*#]{8,15}$/.test(password)) return true
    return false
}

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};


const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

module.exports = {isValidName,isValidEmail,isValidPassword,isValid,isValidObjectId,isValidTitle}
