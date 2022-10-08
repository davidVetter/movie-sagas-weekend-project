import {HashRouter as Router, Route} from 'react-router-dom';
import './App.css';
import MovieList from '../MovieList/MovieList'
import DetailsPage from '../DetailsPage/DetailsPage';
import AddMovieForm from '../AddMovieForm/AddMovieForm';

function App() {
  return (
    <div className="App">
      <h1>The Movies Saga!</h1>
      <Router>        
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
      </Router>
    </div>
  );
}


export default App;
