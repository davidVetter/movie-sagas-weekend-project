import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

function AddMovieForm() {
    const [title, setTitle] = useState('');
    const [posterUrl, setPosterUrl] = useState('');
    const [description, setDescription] = useState('');
    const [movieGenre, setMovieGenre] = useState([]);
    const genres = useSelector(store => store.genres);
    const history = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: 'FETCH_GENRES' })
    }, []);

    const checkInputs = () => {
        if (!title || !posterUrl || !description || !movieGenre) {
            return false;
        } else {
            return true;
        }
    }

    const handleSave = (e) => {
        e.preventDefault();
        if (checkInputs()) {
        dispatch({
            type: 'ADD_MOVIE',
            payload: {
                title,
                posterUrl,
                description,
                movieGenre
            }
        })
        setTitle('');
        setPosterUrl('');
        setDescription('');
        setMovieGenre([]);
        dispatch({ type: 'FETCH_MOVIES'});
        history.push('/'); 
        }
    }
    // clears local state and moves user to home page ('/')
    // on click of cancel button
    const handleCancel = (e) => {
        e.preventDefault();
        setTitle('');
        setPosterUrl('');
        setDescription('');
        setMovieGenre([]);
        history.push('/');
    }

    const handleGenres = (e) => {
        let arr = [...movieGenre];
        if (arr.some(genre => genre === e.target.value) || e.target.value === 'Please select one...') {
            return;
        }
        arr.push(e.target.value);
        console.log('this is arr: ', arr);
        setMovieGenre(arr);
    }

    return (
        <div className="addMovieForm">
            <h2>Add Movie Form</h2>
            <form>
            <input onChange={e => setTitle(e.target.value)} placeholder='Title' value={title} required/><br />
            <input onChange={e => setPosterUrl(e.target.value)} placeholder='Poster URL' value={posterUrl} required/><br />
            <textarea onChange={e => setDescription(e.target.value)} placeholder='Description' value={description} required/><br />
            {genres.length > 0 && <select onChange={(e) => handleGenres(e)} required>
                                    <option>Please select one...</option>
                                    {genres.map((genre, i) => <option value={genre.id} key={i}>{genre.name}</option>)}
                                </select>}<br />
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
            <p>{title}</p>
            <p>{posterUrl}</p>
            <p>{description}</p>
            {movieGenre.length > 0 && movieGenre.map((genre, index) => <p key={index}>{genres[genre-1].name}</p>)}
            </form>
        </div>
    )
}
export default AddMovieForm;