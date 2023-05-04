// action - state management
import * as actionTypes from './actions';

export const initialState = {
    state: {},
    link: '',
    person: {},
    playerOpen: false,
    personInfoOpen: false,
    anchorRef: null
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
        case actionTypes.TOGGLE_PERSON_INFO:
            console.log(action.personInfoOpen);
            return {
                ...state,
                personInfoOpen: action.personInfoOpen,
                person: action.person,
                anchorRef: action.anchorRef
            };
        default:
            return state;
    }
};

export default contextReducer;
