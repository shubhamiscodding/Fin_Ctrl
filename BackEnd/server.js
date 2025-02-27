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



// Apply JWT middleware to protected routes
app.use('/FinCtrl/admin', adminroutes);
app.use('/FinCtrl/event', eventroutes);
app.use('/FinCtrl/user', userroutes);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
