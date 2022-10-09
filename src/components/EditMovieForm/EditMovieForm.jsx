import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

function EditMovieForm() {
    const movie = useSelector((store) => store.singleMovie);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const dispatch = useDispatch();
    const history = useHistory();
    // allows reading of the current url
    let location = useLocation();
    // This keeps movieId current if the user types a new id
    // in the browser address bar and presses enter
    useEffect(() => {
        // console.log('this is location: ', location.pathname);
        // uses reg exp to search string for any number characters and stores
        // them in "id" variable
        let id = location.pathname.match(/\d+/g);
        // console.log('this is id: ', Number(id));
        dispatch({ type: 'FETCH_MOVIE_BY_ID', payload: id});
        if (movie.length > 0) {
        setTitle(movie[0].title);
        setDescription(movie[0].description);
        }
        // console.log('this is movie after a url change: ', movie);
    },[location.pathname]) // this useEffect runs whenever the url is changed

    const handleSave = () => {
        dispatch({
            type: 'UPDATE_MOVIE',
            payload: {
                title,
                description,
                id: location.pathname.match(/\d+/g)
            }
        });
        setTitle('');
        setDescription('');
        history.push('/');
    }

    const handleCancel = () => {
        setTitle('');
        setDescription('');
        history.push('/');
    }

    return (
      <div className="movieEditDiv">
        <h2>Edit Page</h2>
        {console.log("This is movie: ", movie, 'This is title: ', title)}
        {console.log('This is description: ', description)}
        {movie.length > 0 ? (
          <div key={movie[0].id} className="movieEditInnerDiv">
            <label>Title:
            <input value={title || movie[0].title} onChange={e => setTitle(e.target.value)}/>
            </label><br />
            <img src={movie[0].poster} alt={movie[0].title} />
            <div className="genreDiv">
              {movie.map((genre) => {
                return <h4 key={genre.id}>{genre.name}</h4>;
              })}
            </div>
            <label>Description:
            <textarea value={description || movie[0].description} onChange={e => setDescription(e.target.value)}></textarea>
            </label><br />
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        ) : (
          <div>
            <h2>
              Oops no results found! <br />
              Sorry please return to the home page...
            </h2>
            <button onClick={() => history.push("/")}>Home Page</button>
          </div>
        )}
      </div>
    );
}
export default EditMovieForm;