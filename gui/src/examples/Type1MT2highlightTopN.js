import * as React from "react";
import * as d3 from "d3";
import { connect } from "react-redux";
import { StreamGraph } from "../common/drawStream.js"

const mapStateToProps = state => {
    return {
        data: state.data,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};
/***************************************local varibales***************************/
let weight4tichness = "max"
let weight4gaussian = "median"
let colorBrewerQuantitative12 = new Uint8Array([
    166, 206, 227,
    31, 120, 180,
    178, 223, 138,
    51, 160, 44,
    251, 154, 153,
    227, 26, 28,
    253, 191, 111,
    255, 127, 0,
    202, 178, 214,
    106, 61, 154,
    255, 255, 153,
    177, 89, 40,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
    0, 0, 0,
])
let colorMap = colorBrewerQuantitative12
let categoryArr = []
/************************************General function to draw mt*******************************/
const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('')
function updateLinearX(curYBottom, curYTop, range0, range1) {
    let linearY = d3.scaleLinear()
        .domain([curYBottom, curYTop])
        .range([range0, range1])
    return linearY
}
function sortBranchPs(topP, value, downIndex) {
    let sortedArr = []
    let cur = topP
    while (value.indexOf(cur) >= 0) {
        sortedArr.push(cur)
        cur = downIndex[cur]
    }
    if (cur >= 0) {
        sortedArr.push(cur)
    }
    return sortedArr
}
function getData4mergetree(objects) {
    let branchMap = new Map()
    for (let i = 0; i < objects[0].pointData.VertexId.nTuples; i++) {
        let group = null
        if (branchMap.has(objects[0].pointData.BranchId.data[i])) {
            group = branchMap.get(objects[0].pointData.BranchId.data[i])
            group.push(i)
        } else {
            group = [i]
        }
        branchMap.set(objects[0].pointData.BranchId.data[i], group)
    }
    // console.log("branchMap: ", branchMap)
    let result = []
    for (const [key, value] of branchMap.entries()) {
        // find the top point of the branch.
        let set4indegree = new Set()
        for (let index = 0; index < value.length; index++) {
            set4indegree.add(objects[0].pointData.NextId.data[value[index]])
        }
        let topPoint = value.find(elem => !set4indegree.has(elem))
        // console.log("topPoint: ", topPoint)
        let sortedArr = sortBranchPs(topPoint, value, objects[0].pointData.NextId.data)
        result.push([key, sortedArr])
    }
    // get the domain  of the x range
    let xarr = []
    for (let j = 0; j < objects[0].pointData.VertexId.nTuples; j++) {
        xarr.push(objects[0].pointData.Layout.data[2 * j + 1])
    }
    return { "data": result, "xRange": d3.extent(xarr), "yRange": d3.extent(objects[0].pointData.KDE.data) }
}
function drawStreamgraph4eachBranch(data2stream, yScale, xScale, width, data2draw, pointData, svg) {
    let countMin = Infinity
    let countMax = -1
    for (let j = 0; j < data2stream.length; j++) {
        countMin = Math.min(countMin, data2stream[j][2])
        countMax = Math.max(countMax, data2stream[j][2])
    }
    // here to set the width of streamgraph for the branch
    let streamWmin = width / (data2draw.data.length * 3),
        streamWmax = width / (data2draw.data.length)
    let streamWScale = d3.scaleLinear()
        .domain([countMin, countMax])
        .range([streamWmin, streamWmax])

    // draw the stream graph for each branch
    for (let index = 0; index < data2stream.length; index++) {
        let streamUnit = streamWScale(data2stream[index][2])

        let currentLayers = StreamGraph.HierarchicalClusteringOrder(data2stream[index][1], weight4tichness)
        currentLayers = StreamGraph.StreamLayout_2norm_Gauss(currentLayers, weight4gaussian)
        let graph_draw_data = StreamGraph.getLayersData(currentLayers)
        // console.log("currentLayers for branch: ", index, currentLayers)
        // console.log("graph_draw_data for branch: ", index, graph_draw_data)


        let arcYTop = yScale(pointData.KDE.data[data2draw.data[index][1][0]]) // top point of the branch: y value
        let arcYBottom = yScale(pointData.KDE.data[data2draw.data[index][1].slice(-2)[0]]) // bottom point of the branch. the streamgraph contain the last point on the main branch.
        if (index == 0) {
            // for the main branch, the last point is the real last one in data2draw
            arcYBottom = yScale(pointData.KDE.data[data2draw.data[index][1].slice(-1)[0]])
        }
        let arcX = xScale(pointData.Layout.data[2 * data2draw.data[index][1][0] + 1])


        let linearY = d3.scaleLinear()
            .domain([0, currentLayers[0].size.length - 1])
            .range([arcYTop, arcYBottom]) // to show a little arc top for each branch
        let linearX = updateLinearX(graph_draw_data[1], graph_draw_data[2], arcX, arcX + 2 * streamUnit) // put the streamgraph in the middle of the arc

        let LayersArea = d3.area()
            .curve(d3.curveBasis)
            .x0(function (d) {
                // console.log("x: ", linearX(d[0]))
                return linearX(d[0]);
            })
            .x1(function (d) {
                return linearX(d[1]);
            })
            .y(function (d) {
                return linearY(d.time);
            });

        svg.selectAll(".stream" + index)
            .data(graph_draw_data[0])
            .enter()
            .append("path")
            .attr("class", "stream" + index)
            .attr("id", (d, i) => {
                return "streamLayer" + i
            })
            .style("fill", function (d) {
                // console.log("d in layer: ", d)
                let colorId = d.id % 12
                return rgbToHex(colorMap[colorId * 3],
                    colorMap[colorId * 3 + 1],
                    colorMap[colorId * 3 + 2])
            })
            .style("fill-opacity", 1)
            .style("stroke", function (d) {
                return "white";
            })
            .style("stroke-width", function (d) {
                return 0;
            })
            .attr("name", function (d) {
                return d.id
            })
            .attr("d", LayersArea)
            .on("mouseover", (d) => {
                // console.log("hovering : ", d)
            })
            // .on("mouseout", handleMouseOut)
            .on("click", function (d) {
                console.log("click the layer of the streamgraph: ", categoryArr[d.id])
                // console.log("count arr: ", data2stream[])
            })
    }
}
function drawMergeTree(data2draw, margin, height, width, svgID, pointData, data2stream) {
    d3.select("#" + svgID).style("width", width);
    const svg = d3.select("#" + svgID + "-base")

    let extraX = (data2draw.xRange[1] - data2draw.xRange[0]) / 10
    let extraY = (data2draw.yRange[1] - data2draw.yRange[0]) / 20

    let xScale = d3.scaleLinear()
        .domain([data2draw.xRange[0] - extraX, data2draw.xRange[1] + extraX])
        .range([margin.left, width - margin.right]);

    let yScale = d3.scaleLinear()
        .domain([data2draw.yRange[0] - extraY, data2draw.yRange[1] + extraY])
        .range([height - margin.bottom, margin.top]);

    let lineGenerator = d3.line()
        .x(function (d, i) {
            return xScale(pointData.Layout.data[2 * d + 1])
        })
        .y(function (d, i) {
            return yScale(pointData.KDE.data[d])
        })
    lineGenerator.curve(d3.curveLinear)

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(xScale).tickFormat(d3.format(".2")));

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(yScale).tickFormat(d3.format(".2")));

    // text label for the x axis
    svg.append("g")
        .attr(
            "transform",
            "translate(" +
            (Number(width) - 50) +
            "," +
            (Number(height)) +
            ")"
        )
        .append("text")
        .attr("font-size", "0.6rem")
        .text("Layout");

    // text label for the y axis
    svg.append("g")
        .attr(
            "transform",
            "translate(" + 0 + "," + Number(margin.top - 10) + ")"
        )
        .append("text")
        .attr("font-size", "0.6rem")
        .text("Density");

    // create the arc leaf of merge three
    svg.selectAll(".arcLine")
        .data(data2draw.data)
        .enter()
        .append("path")
        .attr("class", "arcLine")
        .attr("id", (d, i) => "arcLineID" + i)
        .attr("d", (d, i) => {
            return lineGenerator(d[1])
        })
        .attr("stroke-width", 2)
        .attr("stroke", "black")
        .style("fill", "none")

    // draw the stream graph for each arc
    drawStreamgraph4eachBranch(data2stream, yScale, xScale, width, data2draw, pointData, svg)

}

class Type0MT extends React.Component {
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
        const { svgID, canvasHeight, data } = props;

        const margin = { top: 24, right: 25, bottom: 30, left: 45 };
        const height = canvasHeight;
        const width = this.container.current.getBoundingClientRect().width * 0.91;
        categoryArr = data[0].fieldData.CategoryDictionary.data
        let data2drawMT = getData4mergetree(data)
        // console.log("data2drawMT: ", data2drawMT)
        let cateCount = data[0].pointData.KDE_ByType_I0.nComponents
        let data2stream4type0 = data2drawMT.data.map(pArr => {
            let distributionOnBranch = [
                pArr[0],
                [],
                data[0].pointData.Size.data[pArr[1][pArr[1].length - 1]] // get the maximum count of the arc, it's last second point. The streamgraph don't contain the last point on the main branch.
            ]
            for (let j4cat = 0; j4cat < cateCount; j4cat++) {
                distributionOnBranch[1].push({ "size": [], "id": j4cat })
            }

            for (let pointIndexinBranchID = 0; pointIndexinBranchID < pArr[1].length; pointIndexinBranchID++) {
                for (let j4cat = 0; j4cat < cateCount; j4cat++) {
                    distributionOnBranch[1][j4cat]["size"].push(data[0].pointData.KDE_ByType_I0.data[pArr[1][pointIndexinBranchID] * cateCount + j4cat])
                }
            }
            return distributionOnBranch
        })
        // console.log("data2stream4type0: ", data2stream4type0)
        drawMergeTree(data2drawMT, margin, height, width, svgID, data[0].pointData, data2stream4type0)
    }

    initializeCanvas() {
        // console.log("data to draw type1mt: ", this.props);
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
)(Type0MT);
