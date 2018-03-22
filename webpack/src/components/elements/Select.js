import React from 'react';
import {connect} from 'react-redux';
import {initFormData,initDynamicFormData,updateDynamicFormData,updateFormData} from '../../actions/formAction';
import { Form,Select } from 'antd';
import {FormItemLayout,getIsCascadeElement} from '../../utility/common';
import _ from 'lodash';
import {selectPropType} from '../../utility/propTypes';
const Option = Select.Option;
const FormItem = Form.Item;

function mapStateToProps(store) {
    return {
        form: store.formReducer.form,
        formData: store.formReducer.formData,
        formDictionary: store.formReducer.formDictionary,
        isNewForm: store.formReducer.isNewForm,
        isSubmitting: store.formReducer.isSubmitting
    };
}

export class QSelect extends React.Component{
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
        this.setState({
            options: this.selectOptions
        });
    }
    get objectKey() {
        return this.state.name;
    }

    get objectPath() {
        return this.state.path || this.state.name;
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


    handleOnChange(event) {
        const value = event;
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
        } else {
            const dataPosition = this.props.dataPosition;
            this.props.dispatch(updateDynamicFormData(this.objectPath, value, dataPosition));
        }
    }

    render(){
        const {getFieldDecorator} = this.props.form;
        const key = this.getDynamicKey();
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
export default connect(mapStateToProps)(QSelect);