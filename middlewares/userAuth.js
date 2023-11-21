const { log } = require("console");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const auth = async function (req, res, next) {
    const { authorization } = req.headers;
    console.log("your token :",authorization);
    if (!authorization) {
        return res.status(401).json({ message: "please login first" });
    } else {

        try {
            var result = await promisify(jwt.verify)(
                authorization,
                "amazonCloneProject"
            );
            //  send user id and user type to the next request
            req.id = result.id;
            req.userType = result.userType;
            // console.log(result)
            next();
        } catch (err) {
            res.status(401).json({ message: "please log in first" });
        }
    }
};
module.exports = { auth };
