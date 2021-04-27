import * as React from "react";
import * as d3 from "d3";
import { connect } from "react-redux";
// require("../common/kdeRenderer.js")
// require("../common/three.min.js")


const mapStateToProps = state => {
    return {
        data: state.data,
        sliderValue: state.sliderValue
    };
};

// update global data: functionsdfgd
const mapDispatchToProps = dispatch => {
    return {
    };
};


class MapView extends React.Component {
    constructor(props) {
        super(props);
        this.container = React.createRef();
    }

    componentDidMount() {
        this.initializeCanvas();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.updateCanvas(nextProps);
    }

    renderSvg(props) {
        const { divID, canvasHeight, data, sliderValue } = props;
        console.log("props in map view: ", divID, canvasHeight, data, sliderValue)
        const height = canvasHeight;
        const width = this.container.current.getBoundingClientRect().width * 0.91;

        // chicago data
        let centerLatLong = [41.77269, -87.61115]
        // //// Purdue univerisity data
        // let centerLatLong = [40.42, -86.89]

        // var Stadia_AlidadeSmooth = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        //     maxZoom: 20,
        //     attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        // });

        // let map = L.map(divID, {
        //     center: centerLatLong,
        //     zoom: 10
        // });


        // // add lat and long when mouse move on the map
        // {
        //     L.Control.MousePosition = L.Control.extend({
        //         options: {
        //             position: 'bottomleft',
        //             separator: ' : ',
        //             emptyString: 'Unavailable',
        //             lngFirst: false,
        //             numDigits: 5,
        //             lngFormatter: undefined,
        //             latFormatter: undefined,
        //             prefix: ""
        //         },

        //         onAdd: function (map) {
        //             this._container = L.DomUtil.create('div', 'leaflet-control-mouseposition');
        //             L.DomEvent.disableClickPropagation(this._container);
        //             map.on('mousemove', this._onMouseMove, this);
        //             this._container.innerHTML = this.options.emptyString;
        //             // console.log("I can work mousemove");
        //             return this._container;
        //         },

        //         onRemove: function (map) {
        //             map.off('mousemove', this._onMouseMove)
        //         },

        //         _onMouseMove: function (e) {
        //             var lng = this.options.lngFormatter ? this.options.lngFormatter(e.latlng.lng) : L.Util.formatNum(e.latlng.lng, this.options.numDigits);
        //             var lat = this.options.latFormatter ? this.options.latFormatter(e.latlng.lat) : L.Util.formatNum(e.latlng.lat, this.options.numDigits);
        //             var value = this.options.lngFirst ? lng + this.options.separator + lat : lat + this.options.separator + lng;
        //             var prefixAndValue = this.options.prefix + ' ' + value;
        //             this._container.innerHTML = prefixAndValue;
        //         }

        //     });

        //     L.Map.mergeOptions({
        //         positionControl: false
        //     });

        //     L.Map.addInitHook(function () {
        //         if (this.options.positionControl) {
        //             this.positionControl = new L.Control.MousePosition();
        //             this.addControl(this.positionControl);
        //         }
        //     });

        //     L.control.mousePosition = function (options) {
        //         return new L.Control.MousePosition(options);
        //     };
        //     L.control.mousePosition().addTo(map);
        // }

        // Stadia_AlidadeSmooth.addTo(map);

        // const kdeRenderer = new KDERenderer(map);









    }

    initializeCanvas() {
        // console.log("data to draw type1mt: ", this.props);
        this.renderSvg(this.props);
    }

    updateCanvas(props) {
        const { divID } = props;
        const divDomItem = d3.select("#" + divID);
        divDomItem.remove();
        this.renderSvg(props);
    }

    render() {
        const { divID, canvasHeight } = this.props;
        // console.log(this.props);
        return (
            <div ref={this.container}>
                <div id={divID} height={canvasHeight}>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapView);
