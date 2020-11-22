/**
 * Yerim Heo
 * 11/15/2020
 * CSE 154 AF Wilson Tang
 * This is the "index.js" file of the Guitar Reference website. It defines the
 * behavior of the website and fetches information from the API.
 */
"use strict";

(function() {

  const IMG_PATH = "guitar-chords/";

  /**
   * Add a function that will be called when the window is loaded.
   */
  window.addEventListener("load", init);

  /**
   * Fetches all the chords and songs to display and initializes the form
   */
  function init() {
    fetchChords();
    fetchSongs();
    qs("form").addEventListener("submit", (e) => {
      e.preventDefault();
      postSong();
    });
    qs("select").addEventListener("change", fetchSongChords);
  }

  /**
   * Fetches a list of chords
   */
  function fetchChords() {
    fetch('/chords')
      .then(checkStatus)
      .then(resp => resp.text())
      .then(displayChords)
      .catch(handleError);
  }

  /**
   * Takes the chords returned from the API and displays them
   * @param {text} chords a list of chords from our API
   */
  function displayChords(chords) {
    let chord = chords.split("\n");
    for (let i = 0; i < chord.length; i++) {
      let image = gen("img");
      image.src = IMG_PATH + chord[i] + ".png";
      image.alt = "Guitar tab of the chord " + chord[i];
      image.addEventListener("click", function() {
        makeSong(this);
      });
      id("chords").appendChild(image);
    }
  }

  /**
   * Fetches a list of songs for the dropdown
   */
  function fetchSongs() {
    fetch('/songs')
      .then(checkStatus)
      .then(resp => resp.json())
      .then(showSongs)
      .catch(handleError);
  }

  /**
   * Adds all the songs in the API to the dropdown
   * @param {JSON} songs a list of all song titles
   */
  function showSongs(songs) {
    for (let i = 0; i < songs.keys.length; i++) {
      let option = gen("option");
      option.value = songs.keys[i].toLowerCase().replaceAll(' ', '-');
      option.innerText = songs.keys[i];
      id("songs").appendChild(option);
    }
  }

  /**
   * Fetches the chords in the selected song
   */
  function fetchSongChords() {
    let select = id("songs");
    let selected = select.options[select.selectedIndex].innerText;
    if (selected !== "Select") {
      fetch('/songs?name=' + selected)
        .then(checkStatus)
        .then(resp => resp.json())
        .then(displaySong)
        .catch(handleError);
    } else {
      while (id("new-chords").firstChild) {
        id("new-chords").removeChild(id("new-chords").firstChild);
      }
    }
  }

  /**
   * Displays the chords in the selected song
   * @param {JSON} tabs a list of all the chords in the song
   */
  function displaySong(tabs) {
    while (id("error").firstChild) {
      id("error").removeChild(id("error").firstChild);
    }
    while (id("new-chords").firstChild) {
      id("new-chords").removeChild(id("new-chords").firstChild);
    }
    let chords = tabs.result.chords.split(" ");
    for (let i = 0; i < chords.length; i++) {
      let chordPic = gen("img");
      chordPic.src = IMG_PATH + chords[i] + ".png";
      chordPic.alt = "Guitar tab of the chord " + chords[i];
      id("new-chords").appendChild(chordPic);
    }
  }

  /**
   * Displays chords clicked on from the bottom list in the song board
   * @param {object} chord the chord clicked on
   */
  function makeSong(chord) {
    let select = id("songs");
    let selected = select.options[select.selectedIndex].value;
    let board = id("error");
    while (board.firstChild) {
      board.removeChild(board.firstChild);
    }
    if (selected !== "select") {
      select.selectedIndex = 0;
      while (id("new-chords").firstChild) {
        id("new-chords").removeChild(id("new-chords").firstChild);
      }
    }
    let newChord = gen("img");
    newChord.src = chord.src;
    newChord.alt = chord.alt;
    newChord.id = chord.alt.substring(24);
    id("new-chords").appendChild(newChord);
    newChord.addEventListener("click", function() {
      id("new-chords").removeChild(this);
    });
  }

  /**
   * Posts a new song title and its chords to the server
   */
  function postSong() {
    let newSong = qs("input").value;
    if (newSong === '') {
      sendMessage("Please enter a title for your song.");
      return;
    }
    let newChords = id("new-chords").querySelectorAll("img");
    if (newChords.length < 1) {
      sendMessage("Please enter at least one chord for your song.");
      return;
    }
    let chords = "";
    for (let i = 0; i < newChords.length; i++) {
      chords += newChords[i].id;
      if (i < newChords.length - 1) {
        chords += " ";
      }
    }
    let params = new FormData(id("song-tab"));
    params.append("chords", chords);
    fetch('/post', {method: "POST", body: params})
      .then(checkStatus)
      .then(resp => resp.json())
      .then(updateList)
      .catch(handleError);
  }

  /**
   * Updates the dropdown to include the new song added
   * @param {text} song title of the song added
   */
  function updateList(song) {
    if (song === "A song with this title already exists.") {
      sendMessage(song);
    } else {
      let newOption = gen("option");
      newOption.value = song.toLowerCase();
      newOption.innerText = song;
      id("songs").appendChild(newOption);
      sendMessage("Song was added successfully!");
    }
  }

  /**
   * Displays either an error or success message
   * @param {text} message the message to display for the user
   */
  function sendMessage(message) {
    while (id("error").contains(qs("p"))) {
      id("error").removeChild(id("error").firstChild);
    }
    let msg = gen("p");
    msg.innerText = message;
    if (message !== "Song was added successfully!") {
      msg.id = "error";
    } else {
      msg.id = "success";
    }
    id("error").appendChild(gen("br"));
    id("error").appendChild(msg);
  }

  /**
   * Makes sure the response we get is OK
   * @param {response} res the response from the API
   * @return {response} returns the response
   */
  async function checkStatus(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Display an error if something goes wrong
   */
  function handleError() {
    let error = gen("p");
    error.textContent = "Sorry, something went wrong. Please try again.";
    error.id = "error";
    id("error").appendChild(error);
  }

  /** ------------------------------ Helper Functions  ------------------------------ */
  /**
   * Note: You may use these in your code, but remember that your code should not have
   * unused functions. Remove this comment in your own code.
   */

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} idName - element ID
   * @returns {object} DOM object associated with id.
   */
  function id(idName) {
    return document.getElementById(idName);
  }

  /**
   * Returns the first element that matches the given CSS selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} The first DOM object matching the query.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns a new element with the given tag name.
   * @param {string} tagName - HTML tag name for new DOM element.
   * @returns {object} New DOM object for given HTML tag.
   */
  function gen(tagName) {
    return document.createElement(tagName);
  }

})();