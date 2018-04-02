import React from 'react';
import {connect} from 'react-redux';
import {initFormData,initDynamicFormData, updateFormData, updateDynamicFormData} from '../../actions/formAction';
import {Form, Input} from 'antd';
import {FormItemLayout,getIsCascadeElement,MapStateToProps} from '../../utility/common';
import _ from 'lodash';
import {textfieldPropTypes} from '../../utility/propTypes';
import Base from './Base';
const FormItem = Form.Item;

export class QTextField extends Base{
    constructor(props){
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.state = {
            ...props.definition
        };
    }
    componentWillMount(){
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
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     const currentValue = this.getValue(this.props.formData);
    //     const nextValue = this.getValue(nextProps.formData);
    //     let isCascadElement=getIsCascadeElement(nextProps.formData,this.props.formData,this.state.conditionMap);
    //     //only render when value is changed or form is submitting
    //     return currentValue !== nextValue || nextProps.isSubmitting || isCascadElement;
    // }
    handleOnChange(event) {
        const value = event.target.value;
        this.props.dispatch(updateFormData(this.objectPath, value));
    }
    render(){
        const {getFieldDecorator} = this.props.form;
        const key = this.DynamicKey;
        const value = this.getValue(this.props.formData);
        //console.log('QTextField=>render=>value',value)
        if(_.isArray(this.state.rules)) {
            this.state.rules.map((data, index)=> {
                if (data.pattern != null) {
                    data.pattern = eval(data.pattern);

                }
            });
        }
        return (
            <FormItem {...FormItemLayout()} style={{display:this.isHidden}}  label={this.state.label}>
                {getFieldDecorator(key, {
                    rules: this.Rules,
                    initialValue: value,
                })(
                    <Input
                        addonBefore={this.state.addonBefore}
                        addonAfter={this.state.addonAfter}
                        type={this.state.inputType}
                        placeholder={this.state.placeholder}
                        disabled={this.isDisabled}
                        onChange={this.handleOnChange}/>
                )}
            </FormItem>
        );
    }
}
QTextField.propTypes = textfieldPropTypes;
export default connect(MapStateToProps)(QTextField);