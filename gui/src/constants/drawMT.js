import * as d3 from "d3";
import { StreamGraph } from "../common/drawStream.js"

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
/************************************General function to draw mt*******************************/
const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('')
function updateLinearX(curYBottom, curYTop, range0, range1) {
    let linearX = d3.scaleLinear()
        .domain([curYBottom, curYTop])
        .range([range0, range1])
    return linearX
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
function drawStreamgraph4eachBranch(data2stream, yScale, xScale, width, data2draw, pointData, svg, categoryArr) {
    // let countMin = Infinity
    // let countMax = -1
    // for (let j = 0; j < data2stream.length; j++) {
    //     countMin = Math.min(countMin, data2stream[j][2])
    //     countMax = Math.max(countMax, data2stream[j][2])
    // }
    let countMin = Math.min(...pointData.Size.data)
    let countMax = Math.max(...pointData.Size.data)
    // console.log("pointData: ", pointData.Size.data, Math.min(...pointData.Size.data))
    // console.log("countMin, countMax: ", countMin, countMax)
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

        let arcYTop = yScale(pointData.KDE.data[data2draw.data[index][1][0]]) // top point of the branch: y value
        let arcYBottom = yScale(pointData.KDE.data[data2draw.data[index][1].slice(-2)[0]]) // bottom point of the branch.
        if (index == 0) {
            // for the main branch, the last point is the real last one in data2draw
            arcYBottom = yScale(pointData.KDE.data[data2draw.data[index][1].slice(-1)[0]])
        }
        let arcX = xScale(pointData.Layout.data[2 * data2draw.data[index][1][0] + 1])


        let linearY = d3.scaleLinear()
            .domain([0, currentLayers[0].size.length - 1])
            .range([arcYTop, arcYBottom]) // to show a little arc top for each branch

        // get to the center of the beginning of streamgraph
        let xBottom4begin = Infinity,
            xTop4begin = -Infinity;

        for (let index = 0; index < graph_draw_data[0].length; index++) {
            const x0 = graph_draw_data[0][index][0][0]
            const x1 = graph_draw_data[0][index][0][1]
            xBottom4begin = Math.min(xBottom4begin, x0)
            xTop4begin = Math.max(xTop4begin, x1)

        }
        // console.log("ymin4first, ymax4first: ", xBottom4begin, xTop4begin)
        let scaleX = d3.scaleLinear()
            .domain([graph_draw_data[1], graph_draw_data[2]])
            .range([0, 2 * streamUnit])
        let middleX = (scaleX(xBottom4begin) + scaleX(xTop4begin)) / 2
        // console.log("middleX: ", middleX, 2 * streamUnit)

        let linearX = updateLinearX(graph_draw_data[1], graph_draw_data[2], arcX - middleX, arcX - middleX + 2 * streamUnit) // put the streamgraph in the middle of the arc

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
                return "streamLayer" + d.id
            })
            .style("fill", function (d) {
                if (d.id == "restCountID") return "gray";
                let colorId = d.id % 12
                return rgbToHex(colorMap[colorId * 3],
                    colorMap[colorId * 3 + 1],
                    colorMap[colorId * 3 + 2])
            })
            .style("fill-opacity", 0.8)
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
            .on("mouseover", function (d) {
                let cateLayer2show = d3.select(this).attr("id")
                svg.selectAll("#" + cateLayer2show).style("fill-opacity", 1)
            })
            .on("mouseout", function (d) {
                let cateLayer2show = d3.select(this).attr("id")
                svg.selectAll("#" + cateLayer2show).style("fill-opacity", 0.8)
            })
            .on("click", function (d) {
                console.log("d for the layer: ", d)
                console.log("click the layer of the streamgraph: ", categoryArr[d.id])
            })
    }
}
function getLayersData4version2SG(layers) {
    // layers: [[branchid, [{"size":[c0, c1, ...], "id":catid}, ..{}]]...]
    let data = []
    let YBottom = Infinity,
        YTop = -Infinity;
    for (let i = 0; i < layers.length; i++) {
        data.push([]);
    }
    // initilize start layers: top and bottom
    let topLocations = Array(layers[0].size.length).fill(0)
    let bottomLocations = Array(layers[0].size.length).fill(0)
    // get the locations of the points for each category of the streamgraph
    for (let i = 0; i < layers.length; i++) {
        data[i].id = layers[i].id;
        // get the location for each point in each layer
        for (let j = 0; j < layers[i].size.length; j++) {
            topLocations[j] += layers[i].size[j]
            data[i].push([bottomLocations[j], topLocations[j]])
            data[i][j].time = j;
        }

        let curveBottom = d3.interpolateBasis(bottomLocations);
        let curveTop = d3.interpolateBasis(topLocations);

        for (let j = 0; j < layers[i].size.length; j++) {
            YBottom = Math.min(YBottom, curveBottom(j / (layers[i].size.length - 1)));
            YTop = Math.max(YTop, curveTop(j / (layers[i].size.length - 1)));
        }

        bottomLocations = topLocations.slice()
    }

    return [data, YBottom, YTop];
}
function drawfixedSG4eachBranch(data2stream, yScale, xScale, width, data2draw, pointData, svg, categoryArr) {
    let countMin = Math.min(...pointData.Size.data)
    let countMax = Math.max(...pointData.Size.data)

    // here to set the width of streamgraph for the branch
    let streamWmin = width / (data2draw.data.length * 3),
        streamWmax = width / (data2draw.data.length)
    let streamWScale = d3.scaleLinear()
        .domain([countMin, countMax])
        .range([streamWmin, streamWmax])

    // draw the stream graph for each branch
    for (let index = 0; index < data2stream.length; index++) {
        let streamUnit = streamWScale(data2stream[index][2])

        let graph_draw_data = getLayersData4version2SG(data2stream[index][1])
        // console.log("graph_draw_data: ", graph_draw_data)

        let arcYTop = yScale(pointData.KDE.data[data2draw.data[index][1][0]]) // top point of the branch: y value
        let arcYBottom = yScale(pointData.KDE.data[data2draw.data[index][1].slice(-2)[0]]) // bottom point of the branch.
        if (index == 0) {
            // for the main branch, the last point is the real last one in data2draw
            arcYBottom = yScale(pointData.KDE.data[data2draw.data[index][1].slice(-1)[0]])
        }
        let arcX = xScale(pointData.Layout.data[2 * data2draw.data[index][1][0] + 1])


        let linearY = d3.scaleLinear()
            .domain([0, graph_draw_data[0][0].length - 1])
            .range([arcYTop, arcYBottom]) // to show a little arc top for each branch

        let linearX = updateLinearX(graph_draw_data[1], graph_draw_data[2], arcX, arcX + 2 * streamUnit) // put the streamgraph in the middle of the arc

        let LayersArea = d3.area()
            .curve(d3.curveBasis)
            .x0(function (d) {
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
                return "streamLayer" + d.id
            })
            .style("fill", function (d) {
                if (d.id == "restCountID") return "gray";
                let colorId = d.id % 12
                return rgbToHex(colorMap[colorId * 3],
                    colorMap[colorId * 3 + 1],
                    colorMap[colorId * 3 + 2])
            })
            .style("fill-opacity", 0.8)
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
            .on("mouseover", function (d) {
                let cateLayer2show = d3.select(this).attr("id")
                svg.selectAll("#" + cateLayer2show).style("fill-opacity", 1)
            })
            .on("mouseout", function (d) {
                let cateLayer2show = d3.select(this).attr("id")
                svg.selectAll("#" + cateLayer2show).style("fill-opacity", 0.8)
            })
            .on("click", function (d) {
                console.log("click the layer of the streamgraph: ", categoryArr[d.id])
            })
    }
}
function piechartView(data2stream, yScale, xScale, width, data2draw, pointData, svg, categoryArr) {
    let intersectionSet = new Set();
    for (let i = 0; i < data2draw.data.length; i++) {
        if (data2draw.data[i][0] == 0) {
            continue
        }
        intersectionSet.add(data2draw.data[i][1].slice(-1)[0]);
    }

    //// the pichartData based on data4stream, notice it don't contain the last point on the parent's branch
    let data4piechart = []
    for (let i = 0; i < data2draw.data.length; i++) {
        // create info for the branch
        let branchInfo = []
        branchInfo.push(data2draw.data[i][0]);
        // get the locations for pie on the branch
        let locations = [];
        locations.push([data2draw.data[i][1][0], 0]);
        let pointNum4branchExceptlastone = data2draw.data[i][1].length - 2
        if (branchInfo[0] == 0) {
            pointNum4branchExceptlastone = data2draw.data[i][1].length - 1
        }
        for (let j = 1; j < pointNum4branchExceptlastone; j++) {
            if (intersectionSet.has(data2draw.data[i][1][j])) {
                locations.push([data2draw.data[i][1][j], j]);
            }
        }
        if (branchInfo[0] == 0) {
            locations.push([data2draw.data[i][1][data2draw.data[i][1].length - 1], data2draw.data[i][1].length - 1]);
        } else {
            locations.push([data2draw.data[i][1][data2draw.data[i][1].length - 2], data2draw.data[i][1].length - 2]);
        }

        branchInfo.push(locations)
        data4piechart.push(branchInfo)
    }
    console.log("data4piechart: ", data4piechart);
    console.log("data2stream: ", data2stream)
    console.log("pointData: ", pointData)

    // draw the pie chart
    //// get the radius for the pie
    let countMin = Math.min(...pointData.Size.data)
    let countMax = Math.max(...pointData.Size.data)

    // here to set the width of streamgraph for the branch
    let pieWmax = width / (data2draw.data.length),
        pieWmin = width / (data2draw.data.length * 0.5)
    let pieWscale = d3.scaleLinear()
        .domain([countMin, countMax])
        .range([pieWmax, pieWmin])

    const pie = d3.pie()
        .value(d => d[0])

    let borderWidth = 1;

    for (let i = 0; i < data4piechart.length; i++) {
        // draw all the pies on the branch
        const branchId = data4piechart[i][0];
        for (let j = 0; j < data4piechart[i][1].length - 1; j++) {
            const position4pie = data4piechart[i][1][j];
            let x = xScale(pointData.Layout.data[2 * position4pie[0] + 1])
            let y = yScale(pointData.KDE.data[position4pie[0]])
            const position4pieData = data4piechart[i][1][j + 1];
            let radius = pieWscale(pointData.Size.data[position4pieData[0]]);
            const arc = d3.arc()
                .innerRadius(0)
                .outerRadius(radius - borderWidth * 5);
            let distribution = [];
            for (let k = 0; k < data2stream[branchId][1].length; k++) {
                distribution.push([data2stream[branchId][1][k].size[position4pieData[1]], data2stream[branchId][1][k].id])
            }
            // console.log("distribution: ", branchId, position4pie, distribution)

            const svg4pie = svg.append("g")
                .attr("class", "g4pie")
                .attr("id", "g4pie_" + branchId + "_" + position4pieData[0])
                .attr("transform", `translate(${x}, ${y})`);
            const path = svg4pie.selectAll(".piePath")
                .data(pie(distribution))
                .enter()
                .append("path")
                .attr("class", "piePath")
                .attr("fill", (d) => {
                    // console.log("d in the pie: ", d)
                    if (d.data[1] == "restCountID") return "gray";
                    let colorId = d.data[1] % 12
                    return rgbToHex(colorMap[colorId * 3],
                        colorMap[colorId * 3 + 1],
                        colorMap[colorId * 3 + 2])
                })
                .attr("d", arc)
                .attr("stroke", "white")
                .attr("stroke-width", borderWidth + "px")

        }

    }

}



export const drawMT = {
    getData4mergetree: function (objects) {
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
    },
    drawMergeTree: function (data2draw, margin, height, width, svgID, pointData, data2stream, categoryArr) {
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
        drawStreamgraph4eachBranch(data2stream, yScale, xScale, width, data2draw, pointData, svg, categoryArr)

    },
    getData4streamgraph: function (data2drawMT, data, cateCount, kdetype, sliderValue) {
        // get the last point of the branch, then get the distribution of cats at the point, the category can be soreted by the count at the point

        let data2stream4type = data2drawMT.data.map(pArr => {
            //// last point on the each branch => help to find the topN categories on the hotspot(branch)
            let lastPointonBranch = pArr[1][pArr[1].length - 2]
            if (pArr[0] == 0) {
                lastPointonBranch = pArr[1][pArr[1].length - 1]
            }
            // console.log("lastPointonBranch: ", lastPointonBranch)
            //// get the category sorted by the kdebytype1 at the last point of main branch
            let cat_to_count = []
            for (let i = 0; i < cateCount; i++) {
                cat_to_count.push([i, data[0].pointData.KDE_ByType_I1.data[cateCount * lastPointonBranch + i]])
            }
            cat_to_count.sort(function (a, b) { return b[1] - a[1] })
            cat_to_count = cat_to_count.slice(0, sliderValue)
            let topNcategories = new Set(cat_to_count.map(item => item[0]))

            let distributionOnBranch = [
                pArr[0],
                [],
                // -1: get the maximum count of the arc, it's last second point. The streamgraph don't contain the last point on the main branch.
                // -2: the real last point on the branch except the main branch.
                data[0].pointData.Size.data[pArr[1][pArr[1].length - 2]]
            ]
            if (pArr[0] == 0) {
                distributionOnBranch[2] = data[0].pointData.Size.data[pArr[1][pArr[1].length - 1]]
            }
            // create the distribution for topN category of each vertex
            for (let j4cat of topNcategories) {
                distributionOnBranch[1].push({ "size": [], "id": j4cat })
            }
            // create the count of the rest of the categories for each vertex
            distributionOnBranch[1].push({ "size": [], "id": "restCountID" })

            for (let pointIndexinBranchID = 0; pointIndexinBranchID < pArr[1].length; pointIndexinBranchID++) {
                if (pArr[0] != 0 && pointIndexinBranchID == pArr[1].length - 1) {
                    continue
                }
                for (let j4cat of topNcategories) {
                    let distribution4categroy = distributionOnBranch[1].find(item => item["id"] == j4cat)
                    distribution4categroy["size"].push(data[0].pointData[kdetype].data[pArr[1][pointIndexinBranchID] * cateCount + j4cat])
                }
                // get the size array for the restCategories
                let cateRestCount = 0
                for (let j4cat = 0; j4cat < cateCount; j4cat++) {
                    if (!topNcategories.has(j4cat)) {
                        cateRestCount += data[0].pointData[kdetype].data[pArr[1][pointIndexinBranchID] * cateCount + j4cat]
                    }
                }
                let distribution4cateRests = distributionOnBranch[1].find(item => item["id"] == "restCountID")
                distribution4cateRests["size"].push(cateRestCount)
            }
            return distributionOnBranch
        })
        return data2stream4type
    },
    drawMergeTree_version2: function (data2draw, margin, height, width, svgID, pointData, data2stream, categoryArr, visTypeValue, type4mt) {
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

        // draw type0 or type1
        if (type4mt == 0) {
            drawfixedSG4eachBranch(data2stream, yScale, xScale, width, data2draw, pointData, svg, categoryArr)
        } else {
            // draw the stream graph for each arc
            if (visTypeValue == "streamgraph") {
                drawfixedSG4eachBranch(data2stream, yScale, xScale, width, data2draw, pointData, svg, categoryArr)
            } else if (visTypeValue == "piechart") {
                console.log("draw the pie chart for merge tree. ")
                piechartView(data2stream, yScale, xScale, width, data2draw, pointData, svg, categoryArr)
            } else if (visTypeValue == "donutchart") {
                console.log("draw the donut chart. ")
            }
        }

    }
}