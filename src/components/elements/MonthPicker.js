/**
 * Created by KangYe on 2017/5/2.
 */
import React from 'react';
import {DatePicker, Form} from 'antd';
import {connect} from 'react-redux';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {initFormData,initDynamicFormData,updateFormData,updateDynamicFormData} from '../../actions/formAction';
import {IsNullorUndefined, FormItemLayout, MapStateToProps,getIsCascadeElement} from '../../utility/common';
import _ from 'lodash';
import {monthPickerPropType} from '../../utility/propTypes';
import Base from './Base';
const {MonthPicker} = DatePicker;
const FormItem = Form.Item;

export class QMonthPicker extends Base {
    constructor(props) {
        super(props);
        this.state = {
            ...props.definition
        };
    }
    componentWillMount() {
        this.state = this.props.definition || this.state;
        if(this.getValue(this.props.formData)){
            this.state.defaultvalue =moment(this.getValue(this.props.formData), IsNullorUndefined(this.state.format) ? 'YYYY-MM' : this.state.format);
        }else{
            if(this.props.definition.defaultvalue){
                this.state.defaultvalue =moment(this.props.definition.defaultvalue, IsNullorUndefined(this.state.format) ? 'YYYY-MM' : this.state.format);
            }else{
                this.state.defaultvalue =null;
            }
        }
        if (this.props.isNewForm) {
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

    shouldComponentUpdate(nextProps, nextState) {
        const currentValue = this.getValue(this.props.formData);
        const nextValue = this.getValue(nextProps.formData);
        let isCascadElement=getIsCascadeElement(nextProps.formData,this.props.formData,this.state.conditionMap);
        //only render when value is changed or form is submitting
        return currentValue !== nextValue || nextProps.isSubmitting || isCascadElement ;
    }
    handleOnChange(date, dateString) {
        const value = dateStrings;
        this.props.dispatch(updateFormData(this.objectPath, value));
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const key = this.DynamicKey;
        return (
            <FormItem {...FormItemLayout()} style={{display:this.isHidden}}  label={this.state.label}>
                {getFieldDecorator(key, {
                    rules: this.Rules,
                    initialValue: this.state.defaultvalue === '' ? null : this.state.defaultvalue
                })(<MonthPicker
                    placeholder={this.state.placeholder}
                    style={this.state.style}
                    popupStyle={this.state.popupstyle}
                    allowClear={true}
                    disabled={this.isDisabled}
                    format={IsNullorUndefined(this.state.format) ? 'YYYY-MM' : this.state.format}
                    onChange={(date, dateString) => this.handleOnChange(date, dateString)}
                />)}
            </FormItem>
        );
    }
}
QMonthPicker.propTypes = monthPickerPropType;
export default connect(MapStateToProps)(QMonthPicker);