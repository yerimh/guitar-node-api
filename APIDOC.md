# Guitar Chord API Documentation
The Guitar Chord API provides information about various chords that can be played on guitar, as well as songs and the chords in them.

## Get a list of all guitar chords in this service.
**Request Format:** /chords

**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** Return a list of all of the guitar chord that you can look up in this API.

**Example Request:** /chords

**Example Response:**
```
a
a7
ab
am
b
b7
bb
bb7
...
```

**Error Handling:**
- N/A

## Get a list of all songs and its chords or get chords for one specific song.
**Request Format:** /songs?name=songName

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Return a list of the songs in the API and the chords in each song in the order that they appear.

**Example Request:** /songs?name=Riptide

**Example Response:**
```
{chords: "am g c"}
```

**Error Handling:**
- N/A

## Post a new song and chords
**Request Format:** /post

**Request Type:** POST

**Returned Data Format**: JSON

**Description:** Given the name of a song which doesn't already exist in the API, it will add it to the list of songs in the dropdown and add the chords to the API and return the name of the song added.

**Example Request:** /post

**Example Response:**
```json
{
  "Riptide"
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (JSON error):
  - If passed in a song title that already exists, returns an error with the message: `A song with this title already exists.`
- Possible 500 (server) errors (JSON error):
  - If a server error happens, returns an error with the message: `Some unknown error happened on the server side.`
