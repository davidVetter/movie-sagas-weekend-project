import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import './EditMovieForm.css'

function EditMovieForm() {
    const movie = useSelector((store) => store.singleMovie);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const dispatch = useDispatch();
    const history = useHistory();
    // allows reading of the current url
    let location = useLocation();

    useEffect(() => {
        // console.log('this is location: ', location.pathname);
        // uses reg exp to search string for any number characters and stores
        // them in "id" variable
        let id = location.pathname.match(/\d+/g);
        // console.log('this is id: ', Number(id));
        // get the movie data for the movie id in the url
        dispatch({ type: 'FETCH_MOVIE_BY_ID', payload: id});
        // set local state to the movie in the single movie store
        // if one is currently in the store
        if (movie.length > 0) {
        setTitle(movie[0].title);
        setDescription(movie[0].description);
        }
        // console.log('this is movie after a url change: ', movie);
    },[location.pathname]) // run function on url change

    // Handles when save button is clicked
    // validates title and description
    // sends object of movie data to update that movies current
    // entry in the database based on movie id
    // clears local state and moves user to home page
    const handleSave = () => {
        // This uses the store if local store state is cleared by
        // the user refreshing
        let movieTitle = title;
        let movieDescription = description;
        if (!title.trim()) {
            movieTitle = movie[0].title;
        }
        if (!description.trim()) {
            movieDescription = movie[0].description;
        }
        // sends update info update movie saga
        dispatch({
            type: 'UPDATE_MOVIE',
            payload: {
                title: movieTitle,
                description: movieDescription,
                id: location.pathname.match(/\d+/g)
            }
        });
        // clear local state
        setTitle('');
        setDescription('');
        // move user back to movie list page
        history.push('/');
    }

    // Handles when cancel button is clicked
    // clears local state and moves user back to home page
    const handleCancel = () => {
        setTitle('');
        setDescription('');
        history.push('/');
    }

    const handleRemove = (movieid, genreid) => {
        swal({ // Sweet alert for delete confirmation
            title: "Remove Genre?",
            text: "Are you sure you want to remove this genre? (cannot be undone)",
            buttons: {
              cancel: true,
              confirm: {
                text: "Remove",
                className: "redBtn",
              },
            },
          }).then((result) => {
            if (result) {
                dispatch({
                    type: "REMOVE_GENRE",
                    payload: {
                        movieid,
                        genreid
                    }
                });
            }
          });
    }

    return (
      <div className="movieEditDiv">
        <h2>Edit Page</h2>
        {console.log("This is movie: ", movie, "This is title: ", title)}
        {console.log("This is description: ", description)}
        {/* Conditionally renders the details and inputs of the movie to edit
        based on if there is a movie currently in the singleMovie store */}
        {movie.length > 0 ? (
          <div key={movie[0].id} className="movieEditInnerDiv">
            <label>
              Title:&nbsp;
              <input
                className="editTitleInput"
                value={title || movie[0].title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <br />
            <img
              className="editImg"
              src={movie[0].poster}
              alt={movie[0].title}
            />
            {/* Displays all genres for the movie if there is more than one */}
            <div className="genreDiv">
              <div className="genreInnerDiv">
                {movie.map((genre, index) => {
                  return (
                    <span key={index} className="genreSpan">
                      {console.log("this is index: ", index)}
                      {index > 0 && <p>|</p>}
                      <h4
                        onClick={() =>
                          handleRemove(genre.movie_id, genre.genre_id)
                        }
                        className="genreHeaders"
                        key={genre.id}
                      >
                        {genre.name}&nbsp;❌
                      </h4>
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="editDescriptionDiv">
              <div className="innerEditDescription">
                <p className="descriptionHead">Description:</p>
                <textarea
                  className="editTextArea"
                  value={description || movie[0].description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </div>
            <br />
            <button onClick={handleSave}>Save</button>&nbsp;
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