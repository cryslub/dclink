// action - state management
import * as actionTypes from './actions';

export const initialState = {
    state: {},
    link: '',
    playerOpen: false
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const contextReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.MENU_OPEN:
            return {
                ...state,
                state: action.state
            };
        case actionTypes.PLAY:
            return {
                ...state,
                link: action.link
            };
        case actionTypes.TOGGLE_PLAYER:
            return {
                ...state,
                playerOpen: action.playerOpen
            };
        default:
            return state;
    }
};

export default contextReducer;
