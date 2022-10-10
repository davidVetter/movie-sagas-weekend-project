import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import './AddMovieForm.css'

function AddMovieForm() {
    const [title, setTitle] = useState('');
    const [posterUrl, setPosterUrl] = useState('');
    const [description, setDescription] = useState('');
    const [movieGenre, setMovieGenre] = useState([]);
    const genres = useSelector(store => store.genres);
    const history = useHistory();
    const dispatch = useDispatch();
    // useEffect to fetch genres on page load
    useEffect(() => {
        dispatch({ type: 'FETCH_GENRES' })
    }, []);
    // This function determines if the inputs are empty of not
    const checkInputs = () => {
        if (!title.trim() || !posterUrl.trim() || !description.trim() || !movieGenre) {
            return false;
        } else {
            return true;
        }
    }
    // Handles when save button is clicked
    // validates inputs, then sends data from inputs to sagas
    // to be put in the database
    // clears local state, updates current movie store and moves
    // user back to home page with updated movies
    const handleSave = (e) => {
        e.preventDefault();
        if (checkInputs()) {
        dispatch({
            type: 'ADD_MOVIE', // saga that add a movie to db
            payload: { // sends data from inputs to sagas
                title,
                posterUrl,
                description,
                movieGenre
            }
        })
        setTitle(''); // clears local state
        setPosterUrl('');
        setDescription('');
        setMovieGenre([]); 
        dispatch({ type: 'FETCH_MOVIES'}); // update current movies store
        history.push('/'); // move user
        }
    }
    // clears local state and moves user to home page ('/')
    // on click of cancel button
    const handleCancel = (e) => {
        e.preventDefault();
        setTitle(''); // clear local state
        setPosterUrl('');
        setDescription('');
        setMovieGenre([]);
        history.push('/'); // move user
    }

    // This gets handles selecting multiple genres for the movie being added
    // It validates against the same genre being added multiple times and from the 
    // default select message from being added as genre
    const handleGenres = (e) => {
        let arr = [...movieGenre]; // make copy of current genres
        if (arr.some(genre => genre === e.target.value) || e.target.value === 'Please select one...') {
            return;
        }
        arr.push(e.target.value); // pushes current selection to copy of genre array
        // console.log('this is arr: ', arr);
        setMovieGenre(arr); // updates local state with new array of genres
    }
    // Renders inputs for adding a movie to the database
    // User is able to save (add movie to db) and be returned to the movie list
    // or 'cancel' and have inputs cleared and user is returned to the home page
    return (
      <div className="addMovieForm">
        <div className="addMovieInnerDiv">
          <h2 className="addFormHeader">Add Movie Form</h2>
          <form>
            <input
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              value={title}
              required
            />
            <br />
            <br />
            <input
              onChange={(e) => setPosterUrl(e.target.value)}
              placeholder="Poster URL"
              value={posterUrl}
              required
            />
            <br />
            <br />
            <textarea
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              value={description}
              required
            />
            <br />
            <p className="selectGenreMsg">Select any genres that apply</p>
            {genres.length > 0 && (
              <select onChange={(e) => handleGenres(e)} required>
                <option>Please select one...</option>
                {genres.map((genre, i) => (
                  <option value={genre.id} key={i}>
                    {genre.name}
                  </option>
                ))}
              </select>
            )}
            <br />
            <br />
            <button onClick={handleSave}>Save</button>&nbsp;
            <button onClick={handleCancel}>Cancel</button>
            {movieGenre.length > 0 && <h3>Selected genres:</h3>}
            {movieGenre.length > 0 &&
              movieGenre.map((genre, index) => (
                <p key={index}>{genres[genre - 1].name}</p>
              ))}
          </form>
        </div>
      </div>
    );
}
export default AddMovieForm;