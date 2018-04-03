import React from 'react';
import {connect} from 'react-redux';
import {initFormData,initDynamicFormData,updateDynamicFormData,updateFormData} from '../../actions/formAction';
import { Form,Select } from 'antd';
import {FormItemLayout,getIsCascadeElement,MapStateToProps} from '../../utility/common';
import _ from 'lodash';
import {selectPropType} from '../../utility/propTypes';
const Option = Select.Option;
const FormItem = Form.Item;
import Base from './Base';

export class QSelect extends Base{
    constructor(props){
        super(props);
        this.handleOnChange = this.handleOnChange.bind(this);
        this.state = {
            ...props.definition
        };
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
        this.setState({
            options: this.selectOptions
        });
    }

    get selectOptions() {
        if(this.props.formDictionary.data && this.state.optionDataKey){
            const result = _.find(this.props.formDictionary.data, {'value': this.state.optionDataKey});
            return result.children;
        }
        return this.state.options;
    }

    shouldComponentUpdate(nextProps, nextState) {
        const currentValue = this.getValue(this.props.formData);
        const nextValue = this.getValue(nextProps.formData);
        const isCascadElement = getIsCascadeElement(nextProps.formData,this.props.formData,this.state.conditionMap);
        return currentValue !== nextValue || nextProps.isSubmitting || isCascadElement;
    }

    handleOnChange(event) {
        const value = event;
        this.props.dispatch(updateFormData(this.objectPath, value));
        // if(!this.props.isDynamic) {
        //     this.props.dispatch(updateFormData(this.objectPath, value));
        //     if( this.state.valueMap ){
        //         for( let item of this.state.options ){
        //             if( item.value === value ){
        //                 for( let sourceKey in this.state.valueMap ){
        //                     this.props.dispatch(updateFormData(this.state.valueMap[sourceKey],item[sourceKey]));
        //                 }
        //                 break;
        //             }
        //         }
        //     }
        // } else {
        //     const dataPosition = this.props.dataPosition;
        //     this.props.dispatch(updateDynamicFormData(this.objectPath, value, dataPosition));
        // }
    }

    render(){
        const {getFieldDecorator} = this.props.form;
        const key = this.DynamicKey;
        const value = this.getValue(this.props.formData);
        return(
            <FormItem {...FormItemLayout()} style={{display:this.isHidden}} label={this.state.label} >
                {getFieldDecorator(key, {
                    rules: this.Rules,
                    initialValue:value
                })(
                    <Select
                        disabled={this.isDisabled}
                        onChange={(event) => this.handleOnChange(event)}
                    >
                        {this.state.options.map((option,index) => <Option key={index} value={option.value}>{option.label}</Option>)}
                    </Select>
                )}

            </FormItem>
        );
    }
}
QSelect.propTypes = selectPropType;
export default connect(MapStateToProps)(QSelect);