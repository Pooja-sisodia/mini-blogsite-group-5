const authorModel = require("../model/authorModel")
const jwt = require("jsonwebtoken")

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
const isValidName=function(name){
    return (/^[a-zA-Z]+$/i).test(name)
}


//create a author
const createAuthor = async function (req, res) {
    try {
        let data = req.body;
        let{fname,lname,title,email,password}=data
        if (Object.keys(data).length === 0)     //request body should not empty
            return res.status(400).send({ status: false, message: "please enter details" });

        if (!isValid(fname))
            return res.status(400).send({ status: false, message: "please enter first name" });

        if (!isValidName(fname))
            return res.status(400).send({ status: false, message: "please provide valid first name It should be in Alphabet format" });

        if (!isValid(lname))
            return res.status(400).send({ status: false, message: "please enter last name" });

        if (!isValidName(lname))
            return res.status(400).send({ status: false, message: "please enter valid last name It should be in Alphabet format" });

        if (!isValid(title))
            return res.status(400).send({ status: false, message: "please enter title" });

        if (!isValidTitle(title))
            return res.status(400).send({ status: false, message: "please enter valid title" });
``
        if (!isValid(email))
            return res.status(400).send({ status: false, message: "please enter email address" });

        if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email))
            return res.status(400).send({ status: false, message: "please enter valid email" });


        const checkusedEmail = await authorModel.findOne({ email: data.email });
        if (checkusedEmail) {                                                             //check if emaild not already in used
            return res.status(400).send({ status: false, message: "email already used" });
        }

        if (!isValid(password))
            return res.status(400).send({ status: false, message: "please enter password" });

        if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password))

            return res.status(400).send({ status: false, message: "Use any special character and Numbers password" });

        let savedData = await authorModel.create(data)
        return res.status(201).send({ status: true, message: "Author has been created successfully ", data: savedData })
    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}

/*===================================================LoginAuthor========================================================= */


const loginAuthor = async function (req, res) {
    let emailId = req.body.email;
    let password = req.body.password;
    if(!isValid (emailId)) return res.status(400).send({status:false, msg: "please provide email"})
    if (!/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(emailId))
        return res.status(400).send({ status: false, message: "please enter valid email" });
    if (!isValid(password))
    return res.status(400).send({ status: false, message: "please enter password" });
  
    let author = await authorModel.findOne({ email: emailId, password: password });
    if (!author)
      return res.send({
        status: false,
        msg: "username or the password is not correct",
      });
  
    // Once the login is successful, create the jwt token with sign function
    // Sign function has 2 inputs:

    let token = jwt.sign(
      {
        authorId: author._id.toString(),
      },
      "secret key of project-1"
    );

    res.send({ status: true, data: token });
  };


module.exports.loginAuthor = loginAuthor
module.exports.authorRegister = createAuthor

