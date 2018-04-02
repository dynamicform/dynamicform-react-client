import React from 'react';
import {connect} from 'react-redux';
import {Form, Input} from 'antd';
import {initFormData,initDynamicFormData,updateFormData,updateDynamicFormData} from '../../actions/formAction';
import _ from 'lodash';
import Base from './Base';
import {MapStateToProps} from '../../utility/common';

const FormItem = Form.Item;

export class QHiddenTextField extends Base{
    constructor(props){
        super(props);
        this.state = {
            ...props.definition
        };
    }
    componentWillMount(){
        //init formdata if there is no prop
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
        //only render when value is changed or form is submitting
        const currentValue = this.getValue(this.props.formData);
        const nextValue = this.getValue(nextProps.formData);
        //only render when value is changed or form is submitting
        return currentValue !== nextValue || nextProps.isSubmitting ;
    }

    render(){
        const {getFieldDecorator} = this.props.form;
        const key = this.DynamicKey;
        const value = this.getValue(this.props.formData);
        let view = null;
        
        view = <FormItem style={{display:'none'}}>
            {getFieldDecorator(key, {
                initialValue:value
            })(
                <Input type={this.state.inputType}/>
            )}
        </FormItem>;
        return view;
    }
}
//QHiddenTextField.propTypes = textfieldPropTypes;
export default connect(MapStateToProps)(QHiddenTextField);