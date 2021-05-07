import axios from "axios";
import { LOADING_DATA } from "../constants/actionTypes";
import { UPDATE_SLIDER_VALUE } from "../constants/actionTypes";
import { UPDATE_VisType_VALUE } from "../constants/actionTypes";
import { UPDATE_Legend_Data } from "../constants/actionTypes";
require("../common/ttkWebSocketIO.js");

export function getData() {
    return function (dispatch, getState) {
        // version to use server.py to get data
        // axios
        //     .post(
        //         "/getData/",
        //         {
        //             dataName: "histogram",
        //             meta: "tbd"
        //         },
        //         { timeout: 160000 }
        //     )
        //     .then(response => {
        //         const parsedData = JSON.parse(JSON.stringify(response.data));
        //         // alert(parsedData);
        //         let data = getState.data;
        //         data = parsedData;
        //         console.log(parsedData);
        //         dispatch({ type: LOADING_DATA, payload: { data: data } });
        //     });

        // version to use data from front end, no backend in the platform
        /************************************communication with TTK*******************************/

        // 1) Create a WebSocketIO instance for requestData and sendData from/or ttk
        const requestDatafromTTK = new window.TTK.ttkWebSocketIO();

        // 2) Attach connection listeners
        requestDatafromTTK.on('open', () => {
            console.log('requestDatafromTTK Connected.')
            requestDatafromTTK.sendString('RequestInputVtkDataSet');
        });
        requestDatafromTTK.on('close', () => console.log('requestDatafromTTK Connection Closed.'));
        requestDatafromTTK.on('error', () => console.log('Error for requestDatafromTTK (see console for details).'));

        // 3) Create a button that will trigger a connection request (default ip/port)
        requestDatafromTTK.connect('localhost', 9285);

        // 4) In this example we assume every message sequence the sever is sending encodes
        // a serialized vtkDataObject, so each sequence is fed into a factory constructor.
        requestDatafromTTK.on('messageSequence', msgs => {
            window.TTK.vtkDataSet.createFromMessageSequence(msgs).then(objects => {
                console.log("Recived objects from TTK.")
                // console.log("received objects: ", objects)
                dispatch({ type: LOADING_DATA, payload: { data: objects } });
            });
        });

    };
}
export function updateSliderValue(payload) {
    return {type: UPDATE_SLIDER_VALUE, payload};
}
export function updateVisType(payload) {
    return {type: UPDATE_VisType_VALUE, payload};
}
export function updateLegendData(payload) {
    return {type: UPDATE_Legend_Data, payload};
}