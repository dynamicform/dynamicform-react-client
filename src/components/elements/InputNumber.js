import React from 'react';
import {connect} from 'react-redux';
import {Form, InputNumber } from 'antd';
import _ from 'lodash';
import {inputNumberPropType} from '../../utility/propTypes';
import {initFormData,initDynamicFormData,updateFormData,updateDynamicFormData } from '../../actions/formAction';
import {FormItemLayout,getIsCascadeElement,MapStateToProps} from '../../utility/common';
import Base from './Base';
const FormItem = Form.Item;


export class QInputNumber extends Base{
    constructor(props){
        super(props);
        this.state = {
            othervalue:'',
            ...props.definition
        };
        this.handleOnChange= this.handleOnChange.bind(this);
        this.handleConfirm= this.handleConfirm.bind(this);
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
    shouldComponentUpdate(nextProps, nextState) {
        const currentValue = this.getValue(this.props.formData);
        const nextValue = this.getValue(nextProps.formData);
        let isCascadElement=getIsCascadeElement(nextProps.formData,this.props.formData,this.state.conditionMap);
        //only render when value is changed or form is submitting
        return currentValue !== nextValue || nextProps.isSubmitting ||isCascadElement;
    }
    handleOnChange (value) {
        this.props.dispatch(updateFormData(this.objectPath, value));
    }
    handleConfirm (rule, value, callback) {
        let targetValue = _.get(this.props.formData, this.state.target);
        let rules = this.state.definitionMap && 
                    this.state.definitionMap[targetValue] && 
                    this.state.definitionMap[targetValue].rules;
        if( rules && Array.isArray(rules) ) {
            rules = rules.map((data, index)=> {
                if (data.pattern != null) {
                    data.pattern=eval(data.pattern);
                }
                return data;
            });
            for( let v of rules ){//只处理正则校验
                if( v.pattern && !new RegExp(v.pattern).test(value) ) {
                    callback(v.message);
                    return; 
                }
            }
        }
        callback();
    }
    render(){
        const key = this.DynamicKey;
        const value = this.getValue(this.props.formData);
        const { getFieldDecorator } = this.props.form;
        let rules = [];
        if(Array.isArray(this.Rules)) {
            rules = this.Rules.map((data, index)=> {
                if (data.pattern != null) {
                    data.pattern=eval(data.pattern);
                }
                return data;
            });
        }
        rules.push({
            validator: this.handleConfirm
        });
        let options = {
            rules: rules,
            initialValue: value,
        };
        return(
            <FormItem {...FormItemLayout()}  style={{display:this.isHidden}}   label={this.state.label} >
                <div>{getFieldDecorator(key, options )(
                    <InputNumber min={this.state.min}
                                 max={this.state.max}
                                 style={this.state.inputStyle}
                                 disabled={this.isDisabled}
                                 onChange={(event) => this.handleOnChange(event)} />
                )}{this.state.textAfter}</div>
             </FormItem>

        );
    }
}
QInputNumber.propTypes = inputNumberPropType;
export default connect(MapStateToProps)(QInputNumber);