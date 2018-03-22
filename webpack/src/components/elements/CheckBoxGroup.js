import React from 'react';
import {connect} from 'react-redux';
import {initFormData,initDynamicFormData,updateDynamicFormData,updateFormData} from '../../actions/formAction';
import {Form, Checkbox} from 'antd';
import _ from 'lodash';
import {checkBoxGroupPropType} from '../../utility/propTypes';
import {FormItemLayout, MapStateToProps,getIsCascadeElement} from '../../utility/common';
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

export class QCheckBoxGroup extends React.Component {
    constructor(props) {
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.state = {
            ...props.definition
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        //only render when value is changed or form is submitting
        const currentValue = this.getValue(this.props.formData);
        const nextValue = this.getValue(nextProps.formData);
        let isCascadElement=getIsCascadeElement(nextProps.formData,this.props.formData,this.state.conditionMap);
        //only render when value is changed or form is submitting
        return currentValue !== nextValue || nextProps.isSubmitting || isCascadElement;
    }
    get objectKey() {
        return this.state.name;
    }
    get objectPath() {
        return this.state.path || this.state.name;
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
    componentWillMount() {
        const result = _.find(this.props.formDictionary.data, {'value': this.state.optionDataKey});
        if (!_.isUndefined(result)) {
            this.setState({
                options: result.children
            });
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

    handleOnChange(values) {
        const value = values;
        if(!this.props.isDynamic) {
            this.props.dispatch(updateFormData(this.objectPath, value));
        } else {
            const dataPosition = this.props.dataPosition;
            this.props.dispatch(updateDynamicFormData(this.objectPath, value, dataPosition));
        }
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const options = this.state.options.map((option, index) => {
                return {label: option[this.state.textField], value: option[this.state.valueField]};
            }
        );
        const key = this.getDynamicKey();
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