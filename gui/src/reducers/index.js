import { LOADING_DATA } from "../constants/actionTypes";
import { UPDATE_SLIDER_VALUE } from "../constants/actionTypes";
import { UPDATE_VisType_VALUE } from "../constants/actionTypes";
import { UPDATE_Legend_Data } from "../constants/actionTypes";

const initialState = {
    data: {
    },
    sliderValue: 3,
    visTypeValue: "streamgraph",
    legendData: [0]
};

function rootReducer(state = initialState, action) {
    if (action.type === LOADING_DATA) {
        // console.info("Data Loaded");
        console.info(action.payload);
        return Object.assign({}, state, action.payload);
    }
    else if (action.type === UPDATE_SLIDER_VALUE) {
        // console.info("update slider");
        return Object.assign({}, state, {sliderValue: action.payload});
    }else if (action.type === UPDATE_VisType_VALUE) {
        // console.info("update selection");
        return Object.assign({}, state, {visTypeValue: action.payload});
    }else if (action.type === UPDATE_Legend_Data) {
        // console.info("update legendData");
        return Object.assign({}, state, {legendData: action.payload});
    }
    return state;
}



export default rootReducer;
