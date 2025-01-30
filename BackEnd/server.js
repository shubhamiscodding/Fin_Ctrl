const express = require('express');
const cors = require('cors');
const adminroutes = require('./routes/admin'); 
const eventroutes = require('./routes/event');
const userroutes = require('./routes/user');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use('/FinCtrl/admins', adminroutes);
app.use('/FinCtrl/events', eventroutes);
app.use('/FinCtrl/users', userroutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
