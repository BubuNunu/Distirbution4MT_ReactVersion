import * as React from "react";
import { connect } from "react-redux";
import { Slider, InputNumber} from 'antd';
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
        // let categoryNum = data[0].fieldData.CategoryDictionary.nTuples

        return (
            <div>
                <div>
                    <Slider
                        min={1}
                        max={categoryNum}
                        onChange={updateSliderValue}
                        value={typeof sliderValue === 'number' ? sliderValue : 0}
                    />
                </div>
                <div>
                    <InputNumber
                        min={1}
                        max={categoryNum}
                        style={{ margin: '0 0px' }}
                        value={sliderValue}
                        onChange={updateSliderValue}
                    />
                </div>
            </div>
        );
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(IntegerStep);