import {HashRouter as Router, Route, NavLink} from 'react-router-dom';
import './App.css';
import MovieList from '../MovieList/MovieList'
import DetailsPage from '../DetailsPage/DetailsPage';
import AddMovieForm from '../AddMovieForm/AddMovieForm';
import EditMovieForm from '../EditMovieForm/EditMovieForm';

function App() {
  return (
    <div className="App">
      <h1>Only Movies You Need</h1>
      <Router> 
        <div className='navlinks'>
          <NavLink
            to="/"
            exact
          >
            Home
          </NavLink>&nbsp;
          <NavLink
            to="/addmovie"
            exact
          >
            Add Movie
          </NavLink>  
        </div>      
        <Route path="/" exact>
          <MovieList />
        </Route>
        {/* Details page */}
        <Route path='/details'>
          <DetailsPage />
        </Route>
        {/* Add Movie page */}
        <Route path='/addmovie'>
          <AddMovieForm />
        </Route>
        <Route path='/editmovie'>
          <EditMovieForm />
        </Route>
      </Router>
    </div>
  );
}


export default App;
