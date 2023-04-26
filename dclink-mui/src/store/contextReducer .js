// action - state management
import * as actionTypes from './actions';

export const initialState = {
    state: {}
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const contextReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.MENU_OPEN:
            return {
                ...state,
                state: action.state
            };
        default:
            return state;
    }
};

export default contextReducer;
