const jwt = require("jsonwebtoken")


const Authentication = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"]
        //if (!token) token = req.headers["x-api-key"]
        if (!token) return res.status(400).send({ status: false, msg: "Token is required." })

        let decodeToken = jwt.verify(token, "secret key of project-1")
        req["decodedToken"] = decodeToken
        if (!decodeToken) return res.status(400).send({ status: false, msg: "Token is invlid" })

        next()
    }
    catch (error) {
        res.status(500).send({ error: error.message })
    }
}




let Authorization = async function (req, res, next) {
    try {
        let loggedInAuthorId = req.decodedToken.authorId
        let reqestedAuthorId = req.params.authorId
        if (reqestedAuthorId!= loggedInAuthorId) {
            return res.status(403).send({ status: false, message: "no permission" })
        }
        next()
    }
    catch (error) {
        res.status(500).send({ error: error.message })
    }
}



module.exports.Authentication = Authentication
module.exports.Authorization = Authorization