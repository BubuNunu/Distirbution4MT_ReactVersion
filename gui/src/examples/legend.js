import * as React from "react";
import { connect } from "react-redux";
import * as d3 from "d3";

const colorMap = new Uint8Array([
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
const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('')
let abbrevMap = {
    "FOURCORNERHUSTLERS": "Four Corner Hustlers",
    "GANGSTERDISCIPLES": "GANGSTER DISCIPLES",
    "TWOSIX": "TWO SIX",
    "BLACKPSTONES": "BLACK P STONES",
    "SPANISHVICELORDS": "SPANISH VICE LORDS",
    "BLACKDISCIPLES": "BLACK DISCIPLES",
    "BLACKGANGSTERS": "BLACK GANGSTERS",
    "NA": "NA",
    "NEWBREED": "NEW BREED",
    "AMBROSE": "AMBROSE",
    "LATINDRAGONS": "LATIN DRAGONS",
    "BLACKSOULS": "BLACK SOULS",
    "LATINSAINTS": "LATIN SAINTS",
    "VICELORDS": "VICE LORDS",
    "MICKEYCOBRAS": "MICKEY COBRAS",
    "SATANDISCIPLES": "SATAN DISCIPLES",
    "CICEROINSANEVICELORDS": "CICERO INSANE VICE LORDS",
    "EBONYVICELORDS": "EBONY VICE LORDS",
    "LATINKINGS": "LATIN KINGS",
    "TRAVELINGVICELORDS": "TRAVELING VICE LORDS",
    "MAFIAINSANEVICELORDS": "MAFIA INSANE VICE LORDS",
    "KRAZYGETDOWNBOYS": "KRAZY GETDOWN BOYS",
    "CONSERVATIVEVICELORDS": "CONSERVATIVE VICE LORDS",
    "RENEGADEVICELORDS": "RENEGADE VICE LORDS",
    "SPANISHCOBRAS": "SPANISH COBRAS",
    "SPANISHGANGSTERDISCIPLES": "SPANISH GANGSTER DISCIPLES",
    "IMPERIALGANGSTERS": "IMPERIAL GANGSTERS",
    "UNDERTAKERVICELORDS": "UNDERTAKER VICE LORDS",
    "LATINCOUNTS": "LATIN COUNTS",
    "UNKNOWNVICELORDS": "UNKNOWN VICE LORDS",
    "INSANEDEUCES": "INSANE DEUCES",
    "INSANEUNKNOWNS": "INSANE UNKNOWNS",
    "MANIACLATINDISCIPLES": "MANIAC LATIN DISCIPLES",
    "LARAZA": "LA RAZA",
    "SPANISHLORDS": "SPANISH LORDS",
    "LATINJIVERS": "LATIN JIVERS",
    "ELRUKNS": "EL RUKNS",
    "12THSTREETPLAYERS": "12TH STREET PLAYERS",
    "INSANEPOPES": "INSANE POPES",
    "GANGSTERSTONES": "GANGSTER STONES",
    "IMPERIALINSANEVICELORDS": "IMPERIAL INSANE VICE LORDS",
    "BLOODS": "BLOODS",
    "LATINOSOUTOFCONTROL": "LATINOS OUT OF CONTROL",
    "SINCITYBOYS": "SIN CITY BOYS",
    "LAFAMILIASTONES": "LA FAMILIA STONES",
    "SURENO13": "SURENO 13",
    "SIMONCITYROYALS": "SIMON CITY ROYALS",
    "Y.L.O.DISCIPLES": "Y.L.O. DISCIPLES",
    "INSANEDRAGONS": "INSANE DRAGONS",
    "TITANICPSTONES": "TITANIC P STONES",
    "GAYLORDS": "GAYLORDS",
    "ORCHESTRAALBANY": "ORCHESTRA ALBANY",
    "WOLCOTTBOYS": "WOLCOTT BOYS",
    "HARRISONGENTS": "HARRISON GENTS",
    "MANIACCAMPBELLBOYS": "MANIAC CAMPBELL BOYS",
    "ASHLANDVIKINGS": "ASHLAND VIKINGS",
    "BISHOPS": "BISHOPS",
    "PARTYPEOPLE": "PARTY PEOPLE",
    "LATINEAGLES": "LATIN EAGLES",
    "LATINBROTHERSORGANIZATION": "LATIN BROTHERS ORGANIZATION",
    "LATINSOULS": "LATIN SOULS",
    "ALMIGHTYPOPES": "ALMIGHTY POPES",
    "MORGANBOYS": "MORGAN BOYS",
    "RACINEBOYS": "RACINE BOYS"
}

const mapStateToProps = state => {
    return {
        data: state.data,
        legendData: state.legendData
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

class Legend extends React.Component {
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
        const { svgID, canvasHeight, data, legendData } = props;
        const margin = { top: 10, right: 0, bottom: 0, left: 0 };
        const height = canvasHeight;
        const width = this.container.current.getBoundingClientRect().width * 0.95;

        d3.select("#" + svgID).style("width", width);
        const svg = d3.select("#" + svgID + "-base")

        let circleRaduis = 5
        // Add one dot in the legend for each name.
        svg.selectAll("mydots")
            .data(legendData)
            .enter()
            .append("circle")
            .attr("cx", circleRaduis + 3)
            .attr("cy", function (d, i) { return circleRaduis + 3 + i * circleRaduis * 3 }) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", circleRaduis)
            .style("fill", function (d) {
                let colorId = d % 12
                let color = rgbToHex(colorMap[colorId * 3],
                    colorMap[colorId * 3 + 1],
                    colorMap[colorId * 3 + 2])
                // console.log("color: ", color)
                return color
            })

        // Add name for the legend
        svg.selectAll("mylabels")
            .data(legendData)
            .enter()
            .append("text")
            .attr("x", circleRaduis + 3 + circleRaduis + 5)
            .attr("y", function (d, i) { return circleRaduis + 3 + i * circleRaduis * 3 }) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", "black")
            .text(function (d) {
                let name = data[0].fieldData.CategoryDictionary.data[d].slice(1, -1)
                return abbrevMap[name]
            })
            .attr("text-anchor", "left")
            .attr("font-size", "0.5rem")
            .style("alignment-baseline", "middle")
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
                <p class="toolTitile">Color Legend</p>
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
)(Legend);