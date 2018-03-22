import React from 'react';
import {connect} from 'react-redux';
import {initFormData,initDynamicFormData,updateFormData,updateDynamicFormData} from '../../actions/formAction';
import {Form, Input} from 'antd';
import _ from 'lodash';

const FormItem = Form.Item;

function mapStateToProps(store) {
    return {
        form: store.formReducer.form,
        formData: store.formReducer.formData,
        isNewForm: store.formReducer.isNewForm,
        isSubmitting: store.formReducer.isSubmitting
    };
}

@connect(mapStateToProps)
export default class QHiddenTextField extends React.Component{
    constructor(props){
        super(props);
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
        //only render when value is changed or form is submitting


        const currentValue = this.getValue(this.props.formData);
        const nextValue = this.getValue(nextProps.formData);
        //only render when value is changed or form is submitting
        return currentValue !== nextValue || nextProps.isSubmitting ;
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

    handleOnChange = (event) => {
        const value = event.target.value;
        if(!this.props.isDynamic) {
            this.props.dispatch(updateFormData(this.objectPath, value));
        } else {
            const dataPosition = this.props.dataPosition;
            this.props.dispatch(updateDynamicFormData(this.objectPath, value, dataPosition));
        }
    };

    render(){
        const {getFieldDecorator} = this.props.form;
        const key = this.getDynamicKey();
        const value = this.getValue(this.props.formData);
        let view = null;
        
        view = <FormItem style={{display:'none'}}>
            {getFieldDecorator(key, {
                initialValue:value
            })(
                <Input
                    type={this.state.inputType}
                    onChange={this.handleOnChange}/>
            )}
        </FormItem>;
        return view;
    }
}