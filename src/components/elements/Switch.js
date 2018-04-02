/**
 * Created by KangYe on 2017/4/28.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Switch, Form, Icon} from 'antd';
import _ from 'lodash';
import {initFormData,initDynamicFormData, updateFormData,updateDynamicFormData} from '../../actions/formAction';
import {FormItemLayout, MapStateToProps,getIsCascadeElement} from '../../utility/common';
import Base from './Base';

const FormItem = Form.Item;

export class QSwitch extends Base {
    constructor(props) {
        super(props);
        this.state = {
            ...props.definition
        };
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
        if(this.props.isDynamic) {
            const dataPosition = this.props.dataPosition;
            this.props.dispatch(initDynamicFormData(this.objectPath, null, dataPosition));
        }
    }

    handleOnChange(sw) {
        const value = sw;
        this.props.dispatch(updateFormData(this.objectPath, value));
    }
    shouldComponentUpdate(nextProps, nextState) {
        //only render when value is changed or form is submitting
        const currentValue = this.getValue(this.props.formData);
        const nextValue = this.getValue(nextProps.formData);
        let isCascadElement=getIsCascadeElement(nextProps.formData,this.props.formData,this.state.conditionMap);
        //only render when value is changed or form is submitting
        return currentValue !== nextValue || nextProps.isSubmitting || isCascadElement ;
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        const key = this.DynamicKey;
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