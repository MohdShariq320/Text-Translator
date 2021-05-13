const mysql = require('mysql');

// Making connection to use mysql database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'text_translator'
});

connection.connect((err) => {
    if(err) {
        console.log('Error in connecting database');
        return;
    }

    console.log('mysql database connected!');
})

module.exports = connection;