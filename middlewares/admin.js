// const jwt = require("jsonwebtoken");

// const authenticateToken = (req, res, next) => {
//     const token = req.header("Authorization");

//     if (!token) return res.status(401).send("Access denied. No token provided.");

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (ex) {
//         res.status(400).send("Invalid token.");
//     }
// };

// const isAdmin = (req, res, next) => {
//     // Check if the authenticated user is an admin
//     if (req.user.userType !== 'admin') {
//         return res.status(403).json({ message: "Access denied. User is not an admin." });
//     }
//     // If the user is an admin, proceed to the next middleware or route handler
//     next();
// };


// module.exports = {
//     authenticateToken,
//     isAdmin,
// };
