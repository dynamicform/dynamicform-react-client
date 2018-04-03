import React from 'react';
import {connect} from 'react-redux';
import {initFormData,initDynamicFormData,updateDynamicFormData,updateFormData} from '../../actions/formAction';
import {Form, Checkbox} from 'antd';
import _ from 'lodash';
import {checkBoxGroupPropType} from '../../utility/propTypes';
import {FormItemLayout, MapStateToProps,getIsCascadeElement} from '../../utility/common';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
import Base from './Base';

export class QCheckBoxGroup extends Base {
    constructor(props) {
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.state = {
            ...props.definition
        };
    }
    componentWillMount() {
        if(this.props.isNewForm) {
            const value = this.getValue(this.props.formData);
            if(this.props.isDynamic) {
                const dataPosition = this.props.dataPosition;
                this.props.dispatch(initDynamicFormData(this.objectPath, value, dataPosition));
            } else {
                this.props.dispatch(initFormData(this.objectPath, value));
            }
        }
        
        if(this.props.isDynamic) {
            const dataPosition = this.props.dataPosition;
            this.props.dispatch(initDynamicFormData(this.objectPath, null, dataPosition));
        }
        
        const result = _.find(this.props.formDictionary.data, {'value': this.state.optionDataKey});
        if (!_.isUndefined(result)) {
            this.setState({
                options: result.children
            });
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        //only render when value is changed or form is submitting
        const currentValue = this.getValue(this.props.formData);
        const nextValue = this.getValue(nextProps.formData);
        let isCascadElement=getIsCascadeElement(nextProps.formData,this.props.formData,this.state.conditionMap);
        //only render when value is changed or form is submitting
        return currentValue !== nextValue || nextProps.isSubmitting || isCascadElement;
    }
    handleOnChange(values) {
        const value = values;
        this.props.dispatch(updateFormData(this.objectPath, value));
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const options = this.state.options.map((option, index) => {
                return {label: option[this.state.textField], value: option[this.state.valueField]};
            }
        );
        const key = this.DynamicKey;
        const value = this.getValue(this.props.formData);
        return (
            <FormItem {...FormItemLayout()}  style={{display:this.isHidden}}  label={this.state.label}>
                {getFieldDecorator(key, {
                    rules: this.Rules,
                    initialValue: value
                })(<CheckboxGroup
                        options={options}
                        defaultValue={this.getValue(this.props.formData)}
                        style={this.state.style}
                        disabled={this.isDisabled}
                        onChange={this.handleOnChange}
                />)}
            </FormItem>

        );
    }
}
QCheckBoxGroup.propTypes = checkBoxGroupPropType;
export default connect(MapStateToProps)(QCheckBoxGroup);