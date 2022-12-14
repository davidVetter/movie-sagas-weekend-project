import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App/App.js';
import { createStore, combineReducers, applyMiddleware } from 'redux';
// Provider allows us to use redux within our react app
import { Provider } from 'react-redux';
import logger from 'redux-logger';
// Import saga middleware
import createSagaMiddleware from 'redux-saga';
import { takeEvery, put } from 'redux-saga/effects';
import axios from 'axios';
import movies from './redux/reducers/movie.reducer';
import singleMovie from './redux/reducers/singleMovie.reducer';
import genres from './redux/reducers/genre.reducer';

// Create the rootSaga generator function
function* rootSaga() {
    yield takeEvery('FETCH_MOVIES', fetchAllMovies);
    yield takeEvery('FETCH_MOVIE_BY_ID', fetchMovieById);
    yield takeEvery('ADD_MOVIE', addMovie);
    yield takeEvery('UPDATE_MOVIE', updateMovie);
    yield takeEvery('REMOVE_GENRE', removeGenre);
    yield takeEvery('FETCH_GENRES', fetchAllGenres);
}

function* fetchAllMovies() {
    // get all movies from the DB
    try {
        const movies = yield axios.get('/api/movie');
        console.log('get all:', movies.data);
        yield put({ type: 'SET_MOVIES', payload: movies.data });

    } catch {
        console.log('get all error');
    }
        
}

// This function will get a single movie by movie id from the database
function* fetchMovieById(action) {
    try {
        const movie = yield axios.get(`/api/movie/${action.payload}`);
        // console.log('get single: ', movie.data);
        yield put({ type: 'SET_DETAIL_MOVIE', payload: movie.data });
    } catch (err) {
        console.log('Error in getting movie by id: ', err);
    }
}

// This saga will add a new movie to the database
function* addMovie(action) {
    try {
        // console.log(action.payload);
        yield axios.post(`api/movie`, action.payload);
        yield put({ type: 'FETCH_MOVIES' });
    } catch (err) {
        console.log('Error in POST new movie ', err);
    }
}

// this saga will update a movie's title and description
function* updateMovie(action) {
    try {
        // console.log('this is action.payload for updateMovie: ', action.payload);
        yield axios.put(`/api/movie/${action.payload.id}`, 
        {
            title: action.payload.title,
            description: action.payload.description
        });
        yield put({ type: 'FETCH_MOVIES' });
    } catch (err) {
        console.log('error in PUT movie ', err);
    }
}

function* removeGenre(action) {
    try {
        // console.log('This is action.payload in removeCategory: ', action.payload);
        yield axios.delete(`api/movie/${action.payload.movieid}/${action.payload.genreid}`);
        yield put({ type: 'FETCH_MOVIE_BY_ID', payload: action.payload.movieid });
    } catch (err) {
        console.log('Error in DELETE movies: ', err);
    }
}

function* fetchAllGenres() {
    // get all genres from the DB
    try {
        const genres = yield axios.get('/api/genre');
        // console.log('this is get all genres: ', genres);
        yield put({ type: 'SET_GENRES', payload: genres.data });
    } catch (err) {
        console.log('Error in getting genres: ', err);
    }
}

// Create sagaMiddleware
const sagaMiddleware = createSagaMiddleware();

// Create one store that all components can use
const storeInstance = createStore(
    combineReducers({
        movies,
        genres,
        singleMovie
    }),
    // Add sagaMiddleware to our store
    applyMiddleware(sagaMiddleware, logger),
);

// Pass rootSaga into our sagaMiddleware
sagaMiddleware.run(rootSaga);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={storeInstance}>
        <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
