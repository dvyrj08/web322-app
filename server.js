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

// Add these lines for multer, cloudinary, and streamifier
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

const PORT = process.env.PORT || 8080;

// Cloudinary configuration
cloudinary.config({
    cloud_name: 'dzulmzqxn',
    api_key: '946272788226926',
    api_secret: 'vR3q-m8F2Jtr6shBkP6P-8-Nr5o',
    secure: true
});

// Multer upload setup without disk storage
const upload = multer(); // no { storage: storage } since we are not using disk storage

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
    if (req.query.category) {
        storeService.getItemsByCategory(req.query.category)
            .then(data => res.json(data))
            .catch(err => res.status(500).json({ message: err }));
    } else if (req.query.minDate) {
        storeService.getItemsByMinDate(req.query.minDate)
            .then(data => res.json(data))
            .catch(err => res.status(500).json({ message: err }));
    } else {
        storeService.getAllItems()
            .then(data => res.json(data))
            .catch(err => res.status(500).json({ message: err }));
    }
});

// Route to get all categories
app.get('/categories', (req, res) => {
    storeService.getCategories()
        .then(data => res.json(data))
        .catch(err => res.status(500).json({ message: err }));
});

// Route to serve the addItem.html file
app.get('/items/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/addItem.html'));
});

// Route to handle adding items
app.post('/items/add', upload.single("featureImage"), (req, res) => {
    if (req.file) {
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }

        upload(req).then((uploaded) => {
            processItem(uploaded.url);
        });
    } else {
        processItem("");
    }

    function processItem(imageUrl) {
        req.body.featureImage = imageUrl;

        // Process the req.body and add it as a new Item before redirecting to /items
        storeService.addItem(req.body).then(() => {
            res.redirect('/items');
        }).catch((err) => {
            res.status(500).send("Unable to add item");
        });
    }
});

// Route to get an item by id
app.get('/item/:id', (req, res) => {
    storeService.getItemById(req.params.id)
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
