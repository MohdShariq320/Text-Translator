const express = require('express');
const path = require('path');
require('./db/conn');

// Initializing express
const app = express();

app.use(express.json());

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// setting route for API call
const Route = require('./routes/Route');
app.use('/translate' ,Route);

// stating server
const PORT = 8000
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
