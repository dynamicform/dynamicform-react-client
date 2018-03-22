/**
 * Created by KangYe on 2017/4/21.
 */

import React from 'react';
import {connect} from 'react-redux';
import {DatePicker, Form} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import _ from 'lodash';
import {initFormData,initDynamicFormData, updateFormData,updateDynamicFormData} from '../../actions/formAction';
import {IsNullorUndefined, FormItemLayout, MapStateToProps,getIsCascadeElement} from '../../utility/common';
import {rangePickerPropType} from '../../utility/propTypes';
const {RangePicker} = DatePicker;
const FormItem = Form.Item;

export class QRangePicker extends React.Component {
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
            this.state.defaultvalue.starttime = moment(this.getValue(this.props.formData)[0], this.state.format);
            this.state.defaultvalue.endtime = moment(this.getValue(this.props.formData)[1], this.state.format);
        }else{
            if(this.props.definition.defaultvalue){
                if (this.state.defaultvalue.starttime) {
                    this.state.defaultvalue.starttime = moment(this.state.defaultvalue.starttime, this.state.format);
                }
                if (this.state.defaultvalue.endtime) {
                    this.state.defaultvalue.endtime = moment(this.state.defaultvalue.endtime, this.state.format);
                }
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
        return currentValue !== nextValue || nextProps.isSubmitting || isCascadElement ;
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
    handleOnChange(date, dateStrings) {
        const value = dateStrings;
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
        let rule;
        if (!_.isUndefined(this.state.defaultvalue.starttime._isAMomentObject)) {
            rule = {
                rules: this.Rules,
                initialValue: [this.state.defaultvalue.starttime, this.state.defaultvalue.endtime]
            };
        } else {
            rule = {
                rules: this.Rules
            };
        }
        return (
            <FormItem {...FormItemLayout()} style={{display:this.isHidden}}  label={this.state.label}>
                {getFieldDecorator(key, rule)(
                    <RangePicker
                        onChange={(date, dateStrings) => this.handleOnChange(date, dateStrings)}
                        disabled={this.isDisabled}
                        showTime={this.state.showtime}
                        format={IsNullorUndefined(this.state.format) ? 'YYYY-MM-DD kk:mm:ss' : this.state.format}
                    />
                )}
            </FormItem>
        );
    }
}
QRangePicker.propTypes = rangePickerPropType;
export default connect(MapStateToProps)(QRangePicker);