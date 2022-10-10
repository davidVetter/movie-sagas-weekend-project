import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './MovieList.css'
import { useHistory } from 'react-router-dom';

function MovieList() {
    const history = useHistory();
    const dispatch = useDispatch();
    const movies = useSelector(store => store.movies);
    // Fetches current movies on page load
    useEffect(() => {
        dispatch({ type: 'FETCH_MOVIES' });
    }, []);

    // This funciton moves the user to the details page for the movie they selected
    const handleClick = (id) => {
        history.push(`/details/${id}`);
    }
    // Render a collection of div elements the contain a title and img for each
    // movie currently in the movie store
    // each img can be clicked and the user moved to that movie's details page
    return (
        <main className='mainSection'>
            <h1>Featuring:</h1>
            <section className="movies">
                {movies.map(movie => {
                    return (
                      <div key={movie.id} onClick={() => handleClick(movie.id)} className="imgCard">
                        <h3>{movie.title}</h3>
                        <img
                          className="posterImg"
                        //   onClick={() => handleClick(movie.id)}
                          src={movie.poster}
                          alt={movie.title}
                        />
                      </div>
                    );
                })}
            </section>
        </main>

    );
}

export default MovieList;