// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const adminroutes = require('./routes/admin'); 
// const eventroutes = require('./routes/event');
// const userroutes = require('./routes/user');

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());
// app.use(cors());

// app.use('/FinCtrl/admin', adminroutes);
// app.use('/FinCtrl/event', eventroutes);
// app.use('/FinCtrl/user', userroutes);

// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken'); // Import JWT
const adminroutes = require('./routes/admin'); 
const eventroutes = require('./routes/event');
const userroutes = require('./routes/user');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET; // Load JWT secret key

app.use(express.json());
app.use(cors());

// Middleware to verify JWT
// const verifyToken = (req, res, next) => {
//     const token = req.header('Authorization');
//     if (!token) {
//         return res.status(401).json({ message: "Access denied, no token provided" });
//     }

//     try {
//         const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(400).json({ message: "Invalid token" });
//     }
// };

// Apply JWT middleware to protected routes
app.use('/FinCtrl/admin', adminroutes);
app.use('/FinCtrl/event', eventroutes);
app.use('/FinCtrl/user', userroutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
