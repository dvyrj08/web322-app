const express = require('express');
const app = express();
const path = require('path');
const storeService = require('./store-service');

const PORT = process.env.PORT || 8080;

// Middleware to serve static files
app.use(express.static('public'));

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
