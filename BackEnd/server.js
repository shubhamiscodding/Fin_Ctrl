const express = require('express');
const cors = require('cors');
const adminroutes = require('./routes/admin'); 
const eventroutes = require('./routes/event');
const userroutes = require('./routes/user');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());


app.use('/api', adminroutes); 
app.use('/api', eventroutes);
app.use('/api', userroutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
