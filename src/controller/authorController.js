const authorModel = require("../model/authorModel")


//============================================= Register Author ==================================================================

const isValid = function (value) {
    if (typeof value === "string" && value.trim().length === 0) return false
    if (typeof value === "undefined" || value === null) return false
    return true;
};

// ===title should be one of the following constants ===
const isValidTitle = function (title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}

//create a author
const createAuthor = async function (req, res) {
    try {
        let data = req.body;
        if (Object.keys(data).length === 0)                                                         //request body should not empty
            return res.status(400).send({ status: false, message: "please enter author details" });

        if (!isValid(data.fname))
            return res.status(400).send({ status: false, message: "please enter first name" });

        if (!(/^[a-zA-Z]+$/i).test(data.fname))
            return res.status(400).send({ status: false, message: "please provide valid first name It should be in Alphabet format" });

        if (!isValid(data.lname))
            return res.status(400).send({ status: false, message: "please enter last name" });

        if (!(/^[a-zA-Z]+$/i).test(data.lname))
            return res.status(400).send({ status: false, message: "please enter valid last name It should be in Alphabet format" });

        if (!isValid(data.title))
            return res.status(400).send({ status: false, message: "please enter title" });

        if (!isValidTitle(data.title))
            return res.status(400).send({ status: false, message: "please enter valid title" });

        if (!isValid(data.email))
            return res.status(400).send({ status: false, message: "please enter email address" });

        if (!/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data.email))
            return res.status(400).send({ status: false, message: "please enter valid email" });


        const checkusedEmail = await authorModel.findOne({ email: data.email });
        if (checkusedEmail) {                                                             //check if emaild not already in used
            return res.status(400).send({ status: false, message: "email already used" });
        }

        if (!isValid(data.password))
            return res.status(400).send({ status: false, message: "please enter password" });

        if (!/^[a-zA-Z0-9@*#]{8,15}$/.test(data.password))
            return res.status(400).send({ status: false, message: "Use any special character and Numbers password" });

        let savedData = await authorModel.create(data)
        return res.status(201).send({ status: true, message: "Author has been created successfully ", data: savedData })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}


// //============================================= Register Author ==================================================================

// const createAuthor = async function (req, res) {
//     try {
//         let data = req.body
//         let { fname, lname, title, email, password } = data
//         if ((!Object.keys(data)).length == 0) return res.status(400).send({ status: false, msg: "Please enter the data" })

//         //=================================================================================================================================================

//         if (!isValid(fname)) return res.status(400).send({ status: false, msg: "first Name is require" })
//         if (!isValidName(fname)) return res.status(400).send({ status: false, msg: "please enter valid first name It should be in Alphabet format" })

//         //=======================================================================================================================================================================================================

//         if (!isValid(lname)) return res.status(400).send({ status: false, msg: "Last Name is required" })
//         if (!isValidName(lname)) return res.status(400).send({ status: false, msg: "please enter valid last name It should be in Alphabet format" })

//         //=================================================================================================================================================

//         if (!isValid(title)) return res.status(400).send({ status: false, msg: "title is required" })
//         if (!isValidTitle(title)) return res.status(400).send({ status: false, msg: `title must be in "Mr","Miss","Mrs"` })

//         //===============================================================================================================================================================

//         if (!isValid(email)) return res.status(400).send({ status: false, msg: "email is required" })
//         if (!isValidEmail(email)) return res.status(400).send({ status: false, msg: "Please enter valid Email id" })
        
//         //for unique email Id

//         let checkEmail = await authorModel.findOne({ email: data.email })
//         if (checkEmail) return res.status(400).send({ status: false, msg: "This email already exist." })

//         //=================================================================================================================================================

//         if (!isValid(password)) return res.status(400).send({ status: false, msg: "Password is required" })
//         if (!isValidPassword(password)) return res.status(400).send({ status: false, msg: "The password must be at least 1 Uppercase letter, 1 Lowercase letter, 1 Number, 1 Special character" })

//         //=================================================================================================================================================

//         let savedData = await authorModel.create(data)
//         return res.status(201).send({ status: true, message: "Author has been created successfully ", data: savedData })
//     }
//     catch (err) {
//         return res.status(500).send({ status: false, message: err.message })
//     }
// }


// //============================================= Author Login ==================================================================










module.exports.authorRegister = createAuthor