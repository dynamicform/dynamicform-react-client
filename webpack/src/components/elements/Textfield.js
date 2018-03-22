import React from 'react';
import {connect} from 'react-redux';
import {initFormData,initDynamicFormData, updateFormData, updateDynamicFormData} from '../../actions/formAction';
import {Form, Input} from 'antd';
import {FormItemLayout,getIsCascadeElement} from '../../utility/common';
import {MapStateToProps} from '../../utility/common';
import _ from 'lodash';
import {textfieldPropTypes} from '../../utility/propTypes';

const FormItem = Form.Item;

export class QTextField extends React.Component{
    constructor(props){
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.state = {
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
            const value = this.props.definition.defaultvalue ? this.props.definition.defaultvalue : '';
            //if the element is dynamic added, stop create new object, is this should map to array?
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
        return currentValue !== nextValue || nextProps.isSubmitting || isCascadElement;
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
        if (!this.state.conditionMap || this.state.conditionMap.length == 0) {
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
    handleOnChange(event) {
        const value = event.target.value;
        if(!this.props.isDynamic) {
            this.props.dispatch(updateFormData(this.objectPath, value));
        } else {
            const dataPosition = this.props.dataPosition;
            this.props.dispatch(updateDynamicFormData(this.objectPath, value, dataPosition));
        }
    }

    render(){
        const {getFieldDecorator} = this.props.form;
        const key = this.getDynamicKey();
        const value = this.getValue(this.props.formData);
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
                    initialValue: value
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