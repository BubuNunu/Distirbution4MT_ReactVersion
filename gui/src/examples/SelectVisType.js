import * as React from "react";
import { connect } from "react-redux";
import { Select } from 'antd';
import { updateVisType } from "../actions/index.js";

const { Option } = Select;

const mapStateToProps = state => {
    return {
        visTypeValue: state.visTypeValue
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateVisType: keyValue => dispatch(updateVisType(keyValue))
    };
};


class VisTypeSelection extends React.Component {
    render() {
        const { updateVisType, visTypeValue } = this.props;
        return (
            <div>
                <Select defaultValue={visTypeValue} style={{ width: 150 }} onChange={updateVisType}>
                    <Option value="streamgraph">Streamgraph</Option>
                    <Option value="piechart">Pie Chart</Option>
                    <Option value="donutchart">Donut Chart</Option>
                </Select>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VisTypeSelection);