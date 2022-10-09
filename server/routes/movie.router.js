const express = require('express');
const router = express.Router();
const pool = require('../modules/pool')

router.get('/', (req, res) => {
  const query = `SELECT * FROM movies ORDER BY "title" ASC`;
  pool.query(query)
    .then( result => {
      res.send(result.rows);
    })
    .catch(err => {
      console.log('ERROR: Get all movies', err);
      res.sendStatus(500)
    })

});

router.get('/:id', (req, res) => {
  let id = req.params.id;
  const query = `SELECT * FROM "movies" 
                JOIN "movies_genres" ON "movies_genres"."movie_id"="movies"."id"
                JOIN "genres" ON "genres"."id"="movies_genres"."genre_id"
                WHERE "movies"."id"=$1`
  pool.query(query, [id]).then(result => {
    console.log('This is results.rows from single GET: ', result.rows);
    res.send(result.rows);
  }).catch(err => {
    console.log('ERROR: Get single movie', err);
    res.sendStatus(500)
  })
});

router.put('/:id', (req, res) => {
  const movie = req.body;
  const query = `UPDATE "movies" SET "title"=$1, "poster"=$2, "description"=$3 WHERE "id"=$4;`;

  pool.query(query, [movie.title, movie.poster, movie.description, req.params.id])
      .then((result) => {
        res.sendStatus(200);
      })
      .catch((error) => {
        console.log('error in PUT: ', error);
        res.sendStatus(500);
      });
});

router.post('/', (req, res) => {
  console.log(req.body);
  // RETURNING "id" will give us back the id of the created movie
  const insertMovieQuery = `
  INSERT INTO "movies" ("title", "poster", "description")
  VALUES ($1, $2, $3)
  RETURNING "id";`

  // FIRST QUERY MAKES MOVIE
  pool.query(insertMovieQuery, [req.body.title, req.body.posterUrl, req.body.description])
  .then(result => {
    console.log('New Movie Id:', result.rows[0].id); //ID IS HERE!
    
    const createdMovieId = result.rows[0].id

    // Now handle the genre reference
    const insertMovieGenreQuery = `
      INSERT INTO "movies_genres" ("movie_id", "genre_id")
      VALUES  ($1, $2);
      `
      // Loop to add multiple genres for the new movie
      for (let genre of req.body.movieGenre) {
      // SECOND QUERY ADDS GENRE FOR THAT NEW MOVIE
      pool.query(insertMovieGenreQuery, [createdMovieId, genre]).then(result => {
        //Now that both are done, send back success!
        console.log('genre was added: ', genre);
        // res.sendStatus(201);
      }).catch(err => {
        // catch for second query
        console.log(err);
        res.sendStatus(500)
      })
      }

// Catch for first query
  }).catch(err => {
    console.log(err);
    res.sendStatus(500)
  })
})

module.exports = router;