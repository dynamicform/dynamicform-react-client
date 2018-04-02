/**
 * Created by KangYe on 2017/4/24.
 */
import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {TimePicker, Form} from 'antd';
import _ from 'lodash';
import {initFormData,initDynamicFormData ,updateFormData,updateDynamicFormData} from '../../actions/formAction';
import {IsNullorUndefined, FormItemLayout, MapStateToProps,getIsCascadeElement} from '../../utility/common';
import {timePickerProType} from '../../utility/propTypes';
import Base from './Base';
const FormItem = Form.Item;

export class QTimePicker extends Base {
    constructor(props) {
        super(props);
        this.state = {
            ...props.definition
        };
    }
    componentWillMount() {
        this.state = this.props.definition || this.state;
        if(this.getValue(this.props.formData)){
            this.state.defaultvalue =moment(this.getValue(this.props.formData), IsNullorUndefined(this.state.format) ? 'kk:mm:ss' : this.state.format);
        }else{
            if(this.props.definition.defaultvalue){
                this.state.defaultvalue =moment(this.props.definition.defaultvalue, IsNullorUndefined(this.state.format) ? 'kk:mm:ss' : this.state.format);
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
        return currentValue !== nextValue || nextProps.isSubmitting ||isCascadElement ;
    }
    handleOnChange(date, dateString) {
        const value = dateString;
        this.props.dispatch(updateFormData(this.objectPath, value));
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const key = this.DynamicKey;
        return (
            <FormItem {...FormItemLayout()} style={{display:this.isHidden}} label={this.state.label}>
                {getFieldDecorator(key, {
                    rules: this.Rules,
                    initialValue: this.state.defaultvalue === '' ? null : this.state.defaultvalue
                })(<TimePicker
                        placeholder={this.state.placeholder}
                        disabled={this.isDisabled}
                        use12Hours={this.state.use12hours}
                        format={IsNullorUndefined(this.state.format) ? 'HH:mm:ss' : this.state.format}
                        onChange={(date, dateString) => this.handleOnChange(date, dateString)}
                    />
                )}
            </FormItem>
        );
    }
}
QTimePicker.propTypes = timePickerProType;
export default connect(MapStateToProps)(QTimePicker);