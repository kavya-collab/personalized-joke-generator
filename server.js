// server.js
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Middleware to serve static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Route to serve the home page
app.get('/', (req, res) => {
    res.render('index');
});

// Route to handle the form submission and fetch the joke
app.post('/joke', async (req, res) => {
    const name = req.body.name;
    if (name) {
        try {
            const response = await axios.get('https://v2.jokeapi.dev/joke/Programming');
            const jokeData = response.data;
            let joke;

            if (jokeData.type === 'single') {
                joke = jokeData.joke;
            } else if (jokeData.type === 'twopart') {
                joke = `${jokeData.setup} ... ${jokeData.delivery}`;
            }

            const personalizedJoke = joke.replace(/Chuck Norris/g, name);
            res.render('joke', { joke: personalizedJoke });
        } catch (error) {
            console.error('Error fetching joke:', error);
            res.render('joke', { joke: 'Sorry, something went wrong. Please try again later.' });
        }
    } else {
        res.render('joke', { joke: 'Please enter your name.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
