import * as React from "react";
import { connect } from "react-redux";
import { Slider, InputNumber, Row, Col } from 'antd';
import { updateSliderValue } from "../actions/index.js";
const mapStateToProps = state => {
    return {
        data: state.data,
        sliderValue: state.sliderValue
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateSliderValue: newValue => dispatch(updateSliderValue(newValue))
    };
};

class IntegerStep extends React.Component {
    render() {
        const { data, updateSliderValue, sliderValue } = this.props;
        // console.log("data: ", data)
        let categoryNum = 64
        // if (data) {
        //     categoryNum = data[0].fieldData.CategoryDictionary.nTuples
        // }
        // console.log("categoryNum: ", categoryNum)

        return (
            <Row>
                <Col span={12}>
                    <Slider
                        min={1}
                        max={categoryNum}
                        onChange={updateSliderValue}
                        value={typeof sliderValue === 'number' ? sliderValue : 0}
                    />
                </Col>
                <Col span={4}>
                    <InputNumber
                        min={1}
                        max={categoryNum}
                        style={{ margin: '0 16px' }}
                        value={sliderValue}
                        onChange={updateSliderValue}
                    />
                </Col>
            </Row>
        );
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IntegerStep);