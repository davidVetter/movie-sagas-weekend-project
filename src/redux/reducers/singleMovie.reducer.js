// reducer for storing the single movies being used for the detail page
const singleMovie = (state = [], action) => {
    switch (action.type) {
        case 'SET_DETAIL_MOVIE':
            return action.payload;
        default: 
            return state;
    }
}

export default singleMovie;