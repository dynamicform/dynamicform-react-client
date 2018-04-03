import React from 'react';
import {connect} from 'react-redux';
import {Form, Cascader } from 'antd';
import _ from 'lodash';

import {initFormData,initDynamicFormData,updateDynamicFormData,updateFormData} from '../../actions/formAction';
import {FormItemLayout,MapStateToProps,getIsCascadeElement} from '../../utility/common';
import {cascadeSelectPropType} from '../../utility/propTypes';
import Base from './Base';
const FormItem = Form.Item;


export class CascadeSelect extends Base {
    constructor(props) {
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.state= {
            ...props.definition
        };
    }

    componentWillMount() {
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


        this.state = this.props.definition;
        if(!_.isUndefined(_.find(this.props.formDictionary.data,{'value':this.state.optionDataKey}))){
            this.state.options=_.find(this.props.formDictionary.data,{'value':this.state.optionDataKey}).children;
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        const currentValue = this.getValue(this.props.formData);
        const nextValue = this.getValue(nextProps.formData);
        let isCascadElement=getIsCascadeElement(nextProps.formData,this.props.formData,this.state.conditionMap);
        return currentValue !== nextValue || nextProps.isSubmitting || isCascadElement;
    }
    handleOnChange(value) {
        this.props.dispatch(updateFormData(this.objectPath, value));
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
        const key = this.DynamicKey;
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