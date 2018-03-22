import React from 'react';
import {connect} from 'react-redux';
import {Form, InputNumber } from 'antd';
import _ from 'lodash';
import {inputNumberPropType} from '../../utility/propTypes';
import {initFormData,initDynamicFormData,updateFormData,updateDynamicFormData } from '../../actions/formAction';
import {FormItemLayout,getIsCascadeElement} from '../../utility/common';
const FormItem = Form.Item;


function mapStateToProps(store) {
    return {
        form: store.formReducer.form,
        formData: store.formReducer.formData,
        isNewForm: store.formReducer.isNewForm,
        isSubmitting: store.formReducer.isSubmitting
    };
}


export class QInputNumber extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            othervalue:'',
            ...props.definition
        };
    }
    get objectKey() {
        return this.state.name;
    }

    get objectPath() {
        return this.state.path || this.state.name;
    }
    componentWillMount(){
        //init formdata if there is no prop
        if(this.props.isNewForm) {
            const value = this.getValue(this.props.formData)||this.props.definition.defaultvalue;
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
        return currentValue !== nextValue || nextProps.isSubmitting ||isCascadElement;
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
    handleOnChange = (data) => {
        const value = data;
        if(!this.props.isDynamic) {
            this.props.dispatch(updateFormData(this.objectPath, value));
        } else {
            const dataPosition = this.props.dataPosition;
            this.props.dispatch(updateDynamicFormData(this.objectPath, value, dataPosition));
        }
    }
    handleConfirm = (rule, value, callback) => {
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
        const key = this.getDynamicKey();
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
export default connect(mapStateToProps)(QInputNumber);