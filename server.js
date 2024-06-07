/*********************************************************************************

WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source (including 3rd party web sites) or distributed to other students.

Name: Divyraj Solanki 
Student ID: 149093213 
Date: 7 June 2024
Vercel Web App URL: https://web322-app-nine.vercel.app/about
GitHub Repository URL: https://github.com/dvyrj08/web322-app

********************************************************************************/ 

const express = require('express');
const app = express();
const path = require('path');
const storeService = require('./store-service');

const PORT = process.env.PORT || 8080;

// Middleware to serve static files
app.use(express.static(__dirname + "/public/"));

// Route for "/about"
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/about.html'));
});

// Redirect "/" to "/about"
app.get('/', (req, res) => {
    res.redirect('/about');
});

// Route to get all published items
app.get('/shop', (req, res) => {
    storeService.getPublishedItems()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ message: err }));
});

// Route to get all items
app.get('/items', (req, res) => {
    storeService.getAllItems()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ message: err }));
});

// Route to get all categories
app.get('/categories', (req, res) => {
    storeService.getCategories()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ message: err }));
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// Initialize the store service and start the server
storeService.initialize()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Express http server listening on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log(`Failed to start server: ${err}`);
    });

    