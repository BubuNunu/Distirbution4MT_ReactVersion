import * as React from "react";
import * as d3 from "d3";
import { connect } from "react-redux";
import { drawMT } from "../constants/drawMT.js"


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


class Type0MT_version extends React.Component {
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
        const { svgID, canvasHeight, data, sliderValue } = props;

        const margin = { top: 24, right: 25, bottom: 30, left: 45 };
        const height = canvasHeight;
        const width = this.container.current.getBoundingClientRect().width * 0.91;
        let categoryArr = data[0].fieldData.CategoryDictionary.data
        let data2drawMT = drawMT.getData4mergetree(data)
        let cateCount = data[0].pointData.KDE_ByType_I0.nComponents
        let data2stream4type = drawMT.getData4streamgraph(data2drawMT, data, cateCount, "KDE_ByType_I0", sliderValue)
        
        drawMT.drawMergeTree_version2(data2drawMT, margin, height, width, svgID, data[0].pointData, data2stream4type, categoryArr)
    }

    initializeCanvas() {
        console.log("data to draw type1mt: ", this.props);
        this.renderSvg(this.props);
    }

    updateCanvas(props) {
        const { svgID } = props;
        const svgRoot = d3.select("#" + svgID);
        svgRoot.select("g").remove();
        svgRoot.append("g").attr("id", svgID + "-base");
        this.renderSvg(props);
    }

    render() {
        const { svgID, canvasHeight } = this.props;
        // console.log(this.props);
        return (
            <div ref={this.container}>
                <svg id={svgID} height={canvasHeight}>
                    <g id={svgID + "-base"} />
                </svg>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Type0MT_version);
