import { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { NavigateBefore, NavigateNext } from '@mui/icons-material';
import './DetailsPage.css'

function DetailsPage() {
    const movie = useSelector((store) => store.singleMovie);
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
        // reg exp courtesy of Geeks for Geeks
        // https://www.geeksforgeeks.org/extract-a-number-from-a-string-using-javascript/
        let id = location.pathname.match(/\d+/g);
        // console.log('this is id: ', Number(id));
        dispatch({ type: 'FETCH_MOVIE_BY_ID', payload: id});
        // console.log('this is movie after a url change: ', movie);
    },[location]) // this useEffect runs whenever the url is changed

    return (
      <div className="movieDetailDiv">
        {/* {console.log("This is movie: ", movie)} */}
        {/* Conditionally render movie details or message that results can't be found */}
        {movie.length > 0 ? (
          <div key={movie[0].id} className="movieDetailInnerDiv">
            <h3 className="movieTitleHeading">{movie[0].title}</h3>
            <div className="imgBtnDetail">
              {Number(location.pathname.match(/\d+/g)) > 1 ? (
                <div
                  className="backForwardBtn"
                  onClick={() =>
                    history.push(
                      `/details/${Number(location.pathname.match(/\d+/g)) - 1}`
                    )
                  }
                >
                  <NavigateBefore />
                </div>
              ) : (
                <div className="backForwardBtn">
                  <NavigateBefore />
                </div>
              )}
              <img
                className="detailsImg"
                src={movie[0].poster}
                alt={movie[0].title}
              />
              <p
                className="backForwardBtn"
                onClick={() =>
                  history.push(
                    `/details/${Number(location.pathname.match(/\d+/g)) + 1}`
                  )
                }
              >
                <NavigateNext />
              </p>
            </div>
            {movie[0].genre_id &&
            <div className="genreDiv">
              <div className="genreInnerDiv">
                {movie.map((genre, index) => {
                  return (
                    <span key={index} className="genreSpan">
                        {/* {console.log('this is index: ', index)} */}
                        {index > 0 && <p>|</p>}
                        <h4 className="genreHeaders" key={genre.id}>{genre.name}</h4>
                    </span>
                    );
                })}
              </div>
            </div>}
            <p className="detailsDescriptionBlock">{movie[0].description}</p>
            <button onClick={() => history.push("/")}>Home Page</button>&nbsp;
            <button
              onClick={() =>
                history.push(`/editmovie/${location.pathname.match(/\d+/g)}`)
              }
            >
              Edit Movie
            </button>
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

export default DetailsPage;