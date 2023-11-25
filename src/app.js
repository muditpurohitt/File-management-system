// src/app.js

//importing the necessary modules
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const folderRoutes = require('./routes/folderRoutes');
const pool = require('./config/database');

//defining instances(process is a global variable that is providing info about current nodejs process)
const app = express();
const PORT = 3000;


//middleware to parse the incoming data to read the body
app.use(express.json());
// Setup database tables
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
  )
`).then(() => console.log('User table created'));

//directing the flow to auth
app.use('/auth', authRoutes);
app.use('/folders', folderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
