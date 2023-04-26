import { combineReducers } from 'redux';

// reducer import
import customizationReducer from './customizationReducer';
import contextReducer from './contextReducer ';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
    customization: customizationReducer,
    context: contextReducer
});

export default reducer;
