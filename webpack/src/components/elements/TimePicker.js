/**
 * Created by KangYe on 2017/4/24.
 */
import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {TimePicker, Form} from 'antd';
import {initFormData,initDynamicFormData ,updateFormData,updateDynamicFormData} from '../../actions/formAction';
import {IsNullorUndefined, FormItemLayout, MapStateToProps,getIsCascadeElement} from '../../utility/common';
import _ from 'lodash';
import {timePickerProType} from '../../utility/propTypes';
const FormItem = Form.Item;

export class QTimePicker extends React.Component {
    constructor() {
        super();
    }

    get objectKey() {
        return this.state.name;
    }

    get objectPath() {
        return this.state.path || this.state.name;
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
    }

    shouldComponentUpdate(nextProps, nextState) {
        const currentValue = this.getValue(this.props.formData);
        const nextValue = this.getValue(nextProps.formData);
        let isCascadElement=getIsCascadeElement(nextProps.formData,this.props.formData,this.state.conditionMap);
        //only render when value is changed or form is submitting
        return currentValue !== nextValue || nextProps.isSubmitting ||isCascadElement ;
    }
    getValue(formData){
        if(this.props.isDynamic) {
            const dataPosition = this.props.dataPosition;
            const path = `${dataPosition.objectName}[${dataPosition.index}].${this.objectPath}`;
            return _.get(formData, path);
        } else {
            return _.get(formData, this.objectPath);
        }
    }
    getDynamicKey() {
        if(this.props.isDynamic) {
            const dataPosition = this.props.dataPosition;
            const index = dataPosition.index;
            return `${this.objectKey}-${index}`;
        } else {
            return this.objectKey;
        }
    }
    get Rules(){
        if(this.isHidden==='none'||this.isDisabled){
            return [];
        }else{
            return this.state.rules;
        }
    }
    get isHidden() {
        if (!this.state.conditionMap  || this.state.conditionMap.length == 0) {
            return this.state.hidden ? 'none' : '';
        } else {
            let ElementAttribute = this.state.conditionMap.map((item, index)=> {
                let itemValue = _.get(this.props.formData, item.whichcontrol);
                switch (item.how) {
                    case 'equal': {
                        return item.value === itemValue && item.action === 'hidden' && item.actionValue ? 'none' : '';
                    }
                }
                return '';
            });
            return _.includes(ElementAttribute, 'none') ? 'none' : '';
        }
    }
    get isDisabled(){
        if(!this.state.conditionMap|| this.state.conditionMap.length == 0) {
            return this.state.disabled;
        }else {
            let ElementAttribute = this.state.conditionMap.map((item, index)=> {
                let itemValue = _.get(this.props.formData, item.whichcontrol);
                switch (item.how) {
                    case 'equal': {
                        return item.value === itemValue && item.action === 'disabled' && item.actionValue;
                    }
                    case 'greater': {
                        return '';
                    }
                    case 'less': {
                        return '';
                    }
                }
            });
            return _.includes(ElementAttribute, true);
        }
    }
    handleOnChange(date, dateString) {
        const value = dateString;
        if (!value) {
            this.state.value = new Date();
        }
        if(!this.props.isDynamic) {
            this.props.dispatch(updateFormData(this.objectPath, value));
        } else {
            const dataPosition = this.props.dataPosition;
            this.props.dispatch(updateDynamicFormData(this.objectPath, value, dataPosition));
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const key = this.getDynamicKey();
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