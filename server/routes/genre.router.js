const express = require('express');
const router = express.Router();
const pool = require('../modules/pool')

// This GET will get all the current genres in the 'genres' table
router.get('/', (req, res) => {
  const query = `SELECT * FROM "genres" ORDER BY "id"`;
  pool.query(query)
    .then( result => {
      res.send(result.rows);
    })
    .catch(err => {
      console.log('ERROR: Get all movies', err);
      res.sendStatus(500)
    })
});

module.exports = router;