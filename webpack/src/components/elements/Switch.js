/**
 * Created by KangYe on 2017/4/28.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Switch, Form, Icon} from 'antd';
import {initFormData,initDynamicFormData, updateFormData,updateDynamicFormData} from '../../actions/formAction';
import {FormItemLayout, MapStateToProps,getIsCascadeElement} from '../../utility/common';
import _ from 'lodash';

const FormItem = Form.Item;


export class QSwitch extends React.Component {
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
        if (this.props.isNewForm) {
            const value = this.props.definition.defaultvalue;
            if(this.props.isDynamic) {
                const dataPosition = this.props.dataPosition;
                this.props.dispatch(initDynamicFormData(this.objectPath, value, dataPosition));
            } else {
                this.props.dispatch(initFormData(this.objectPath, value));
            }
        }
    }

    handleOnChange(sw) {
        const value = sw;
        if(!this.props.isDynamic) {
            this.props.dispatch(updateFormData(this.objectPath, value));
        } else {
            const dataPosition = this.props.dataPosition;
            this.props.dispatch(updateDynamicFormData(this.objectPath, value, dataPosition));
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        //only render when value is changed or form is submitting
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
    render() {
        const {getFieldDecorator} = this.props.form;
        const key = this.getDynamicKey();
        return (
            <FormItem {...FormItemLayout()} label={this.state.label}  style={{display:this.isHidden}}>
                {getFieldDecorator(key, {
                    rules: this.Rules
                })(<Switch
                    checked={this.getValue(this.props.formData)}
                    checkedChildren={<Icon type='check'/>}
                    unCheckedChildren={<Icon type='cross'/>}
                    onChange={(sw) => this.handleOnChange(sw)}
                />)}
            </FormItem>
        );
    }
}

export default connect(MapStateToProps)(QSwitch);