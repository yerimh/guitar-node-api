/**
 * Yerim Heo
 * 11/15/2020
 * CSE 154 AF Wilson Tang
 * This is the "app.js" file of the Guitar Reference website. It sends information
 * about the songs and chords to the website.
 */
'use strict';
const express = require('express');
const multer = require('multer');
const app = express();
const fs = require("fs").promises;

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module

let chords = [
  'a', 'a7', 'ab', 'am',
  'b', 'b7', 'bb', 'bb7', 'bbm', 'bm',
  'c', 'c7', 'cm', 'c-sharp-m',
  'd', 'd7', 'dd', 'dm',
  'e', 'e7', 'eb7', 'e-flat', 'em',
  'f', 'f7', 'fm', 'f-sharp', 'f-sharp-7', 'f-sharp-m',
  'g', 'g7', 'gm', 'g-sharp-m'
];

// define all endpoints here
app.get('/chords', function(req, res) {
  res.type('text');
  res.send(getChords());
});

app.get('/songs', async function(req, res) {
  let songName = req.query['name'];
  let data = await fs.readFile('songs.json', 'utf8');
  data = JSON.parse(data);
  if (!songName) {
    let keys = Object.keys(data);
    res.json({
      keys
    });
  } else {
    let result = data[songName];
    res.json({
      result
    });
  }
});

app.post('/post', async function(req, res) {
  let name = req.body.name.trim();
  let newChords = req.body.chords.trim();

  try {
    let data = await fs.readFile('songs.json', 'utf8');
    data = JSON.parse(data);
    let keys = Object.keys(data);
    data[name] = {
      'chords': newChords
    };
    if (keys.includes(name)) {
      res.status(400).json({
        "error": "A song with this title already exists."
      });
    } else {
      await fs.writeFile('songs.json', JSON.stringify(data));
      res.json(name);
    }
  } catch (error) {
    res.status(500).json({
      "error": "Some unknown error happened on the server side."
    });
  }
});

/**
 * Returns the list of chords
 * @returns {text} a list of guitar chords
 */
function getChords() {
  let result = '';
  for (let i = 0; i < chords.length; i++) {
    result += chords[i];
    if (i < chords.length - 1) {
      result += '\n';
    }
  }
  return result;
}

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);