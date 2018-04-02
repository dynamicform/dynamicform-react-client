/**
 * Created by ZhipingShan on 2017/4/20.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Radio, Input, Form}  from 'antd';
import _ from 'lodash';
import {initFormData,initDynamicFormData, updateFormData,updateDynamicFormData, changeFormDefinition} from '../../actions/formAction';
import {FormItemLayout,getIsCascadeElement} from '../../utility/common';
import {radioGroupPropType} from '../../utility/propTypes';
import Base from './Base';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

function mapStateToProps(store) {
    return {
        form: store.formReducer.form,
        formData: store.formReducer.formData,
        isNewForm: store.formReducer.isNewForm,
        isValidating: store.formReducer.isValidating,
        isSubmitting: store.formReducer.isSubmitting,
        formDictionary: store.formReducer.formDictionary,
    };
}

export class QRadioGroup extends Base {
    constructor(props) {
        super(props);
        this.state = {
            othervalue:'',
            ...props.definition
        };
    }

    componentWillMount() {
        const result = _.find(this.props.formDictionary.data, {'value': this.state.optionDataKey});
        if (!_.isUndefined(result)) {
            this.setState({
                options: result.children
            });
        }
        //this.state.options=getDictionaryData(this.props.formDictionary, this.state.dictname);
        //init formdata if there is no prop
        if (this.props.isNewForm) {
            const value = this.getValue(this.props.formData);
            this.state.selected = value;
            if(this.props.isDynamic) {
                const dataPosition = this.props.dataPosition;
                this.props.dispatch(initDynamicFormData(this.objectPath, value, dataPosition));
            } else {
                this.props.dispatch(initFormData(this.objectPath, value));
            }
        }
        else {
            //控制联动组件的属性
            // this.props.dispatch(changeFormDefinition(this.getValue(this.props.formData), this.state.target));//发起联动
        }
        if(this.props.isDynamic) {
            const dataPosition = this.props.dataPosition;
            this.props.dispatch(initDynamicFormData(this.objectPath, null, dataPosition));
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        let data = _.filter(this.state.components, (item) => {
            return item.radioValue && item.radioValue === this.getValue(this.props.formData);
        });
        if (data && _.isArray(data) && data.length > 0) {
            const item = data[0];
            return _.get(this.props.formData, item.path) !== _.get(nextProps.formData, item.path)||this.getValue(this.props.formData) !== nextProps.value || nextProps.isSubmitting;
        }
        const currentValue = this.getValue(this.props.formData);
        const nextValue = this.getValue(nextProps.formData);
        let isCascadElement=getIsCascadeElement(nextProps.formData,this.props.formData,this.state.conditionMap);
        //only render when value is changed or form is submitting
        return currentValue !== nextValue || nextProps.isSubmitting  || isCascadElement ;
    }
    handleOnChange = (event) => {
        const value = event.target.value;
        if(!this.props.isDynamic) {
            this.props.dispatch(updateFormData(this.objectPath, value));
            if( this.state.valueMap ){
                for( let item of this.state.options ){
                    if( item.value === value ){
                        for( let sourceKey in this.state.valueMap ){
                            this.props.dispatch(updateFormData(this.state.valueMap[sourceKey],item[sourceKey]));
                        }
                        break;
                    }
                }
            }
            // this.props.dispatch(changeFormDefinition(value, this.state.target));//发起联动
        } else {
            const dataPosition = this.props.dataPosition;

            this.props.dispatch(updateDynamicFormData(this.objectPath, value, dataPosition));
        }
    }

    other_handleOnChange(event, radioValue) {
        const value = event.target.value;
        if (this.state.components && _.isArray(this.state.components)) {
            let obj = _.filter(this.state.components, function (item) {
                return item.radioValue && item.radioValue === radioValue;
            });
            const key = obj[0].path || obj[0].name;
            this.props.dispatch(updateFormData(key, value));
        }
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const key = this.DynamicKey;
        const radiovalue = this.getValue(this.props.formData);
        const input = (option) => {
            if (this.state.components != null) {
                let other = this.state.components.map((data, index) => {
                    if ((data.radioValue === this.state.selected && data.radioValue === option.value) ||
                        (data.radioValue === radiovalue && data.radioValue === option.value)) {
                        let value = data.hasOwnProperty('path') ?
                            _.get(this.props.formData, data.path) : data.hasOwnProperty('name') ?
                            _.get(this.props.formData, data.name) : '';

                        {/*if (_.isArray(data.rules)) {*/
                        }
                        {/*data.rulesdata.rules.map((data, index) => {*/
                        }
                        {/*if (data.pattern != null) {*/
                        }
                        {/*data.pattern = eval(data.pattern);*/
                        }

                        //         }
                        //     });
                        // }
                        return getFieldDecorator(data.name, {
                            rules: data.rules,initialValue:_.get(this.props.formData, data.path)
                        })(<Input key={index} type={data.inputType}
                                  addonBefore={data.addonBefore}
                                  addonAfter={data.addonAfter}
                                  style={data.inputStyle}
                                  onChange={(event) => this.other_handleOnChange(event, data.radioValue)}
                                  placeholder={data.placeholder}/>);

                    }
                });
                return other;
            } else {
                return null;
            }

        };
        const options = this.state.options.map((option, index) => {
            return <Radio key={index} style={this.state.radioStyle} value={option[this.state.valueField]}>
                {option[this.state.textField]}
                {input(option)}
            </Radio>;
        });

        return (
            <FormItem {...FormItemLayout()}  style={{display:this.isHidden}}  label={this.state.label}>
                {getFieldDecorator(key, {rules: this.Rules, initialValue: radiovalue})(
                    <RadioGroup
                        onChange={this.handleOnChange}
                        style={this.state.style}
                        disabled={this.isDisabled}
                    >
                        {options}
                    </RadioGroup>
                )}
                <label>{this.state.textAfter}</label>
            </FormItem>
        );
    }
}
QRadioGroup.propTypes = radioGroupPropType;
export default connect(mapStateToProps)(QRadioGroup);