import { LOADING_DATA } from "../constants/actionTypes";
import { UPDATE_SLIDER_VALUE } from "../constants/actionTypes";

const initialState = {
    data: {
    },
    histogramData: {

    },
    sliderValue: 5
};

function rootReducer(state = initialState, action) {
    if (action.type === LOADING_DATA) {
        console.info("Data Loaded");
        console.info(action.payload);
        return Object.assign({}, state, action.payload);
    }
    else if (action.type === UPDATE_SLIDER_VALUE) {
        console.info("update slider");
        return Object.assign({}, state, {sliderValue: action.payload});
    }
    return state;
}



export default rootReducer;
