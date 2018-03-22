import React from 'react';
import {connect} from 'react-redux';
import {Form, Cascader } from 'antd';
import _ from 'lodash';

import {initFormData,initDynamicFormData,updateDynamicFormData,updateFormData} from '../../actions/formAction';
import {FormItemLayout,MapStateToProps,getIsCascadeElement} from '../../utility/common';
import {cascadeSelectPropType} from '../../utility/propTypes';
const FormItem = Form.Item;


export class CascadeSelect extends React.Component {
    constructor() {
        super();
        this.handleOnChange = this.handleOnChange.bind(this);
    }

    componentWillMount() {
        this.state = this.props.definition;
        if(!_.isUndefined(_.find(this.props.formDictionary.data,{'value':this.state.optionDataKey}))){
            this.state.options=_.find(this.props.formDictionary.data,{'value':this.state.optionDataKey}).children;
        }

        if (this.props.isNewForm) {
            const value = this.getValue(this.props.formData)||this.props.definition.defaultvalue;
            if(this.props.isDynamic) {
                const dataPosition = this.props.dataPosition;
                this.props.dispatch(initDynamicFormData(this.objectPath, value, dataPosition));
            } else {
                this.props.dispatch(initFormData(this.objectPath, value));
            }
        }
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
            return _.get(formData, this.state.path);
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
    shouldComponentUpdate(nextProps, nextState) {
        const currentValue = this.getValue(this.props.formData);
        const nextValue = this.getValue(nextProps.formData);
        let isCascadElement=getIsCascadeElement(nextProps.formData,this.props.formData,this.state.conditionMap);
        return currentValue !== nextValue || nextProps.isSubmitting || isCascadElement;
    }
    get Rules(){
        if(this.isHidden==='none'||this.isDisabled){
            return [];
        }else{
            return this.state.rules;
        }
    }
    handleOnChange(value) {
        if(!this.props.isDynamic) {
            this.props.dispatch(updateFormData(this.objectPath, value));
        } else {
            const dataPosition = this.props.dataPosition;
            this.props.dispatch(updateDynamicFormData(this.objectPath, value, dataPosition));
        }
    }

    render() {
        const props = {
            options: this.state.options,
            onChange: this.handleOnChange,
            size: 'large',
            style: {width: '100%'},
            placeholder: this.state.placeholder,
            disabled: this.state.disabled
        };

        const { getFieldDecorator } = this.props.form;
        const key = this.getDynamicKey();
        const value = this.getValue(this.props.formData);
        return (
            <FormItem {...FormItemLayout()} style={{display:this.isHidden}} label={this.state.label}>
                {getFieldDecorator(key, {
                    rules: this.Rules,
                    initialValue:value
                })(
                    <Cascader {...props} disabled={this.isDisabled} />
                )}
            </FormItem>
        );
    }
}
CascadeSelect.propTypes = cascadeSelectPropType;
export default connect(MapStateToProps)(CascadeSelect);