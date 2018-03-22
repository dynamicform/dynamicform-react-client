import {Button,Form} from 'antd';
import {connect} from 'react-redux';
import React from 'react';
import {MapStateToProps,FormItemLayout} from '../../utility/common';
import _ from 'lodash';
const FormItem = Form.Item;
import {submittingForm,setFormStatus,updateInitFormData} from '../../actions/formAction';
import {buttonPropType} from '../../utility/propTypes';

export class QButton extends React.Component{
    constructor(){
        super();
        this.handleOnClick = this.handleOnClick.bind(this);
    }

    componentWillMount(){
        this.state = this.props.definition;
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
    handleOnClick() {
        switch (this.state.buttonType){
            case 'save':{
                this.props.form.validateFieldsAndScroll({force:true},(error, values) => {
                    if(!error){
                        const formData = this.props.formData;
                        this.props.dispatch(setFormStatus());
                        this.props.dispatch(submittingForm(formData,this.props,this.state.actionPath));

                    }else{
                        this.props.dispatch(setFormStatus());
                    }
                });
                break;
            }
            case 'submit':{
                this.props.form.validateFieldsAndScroll({force:true},(error, values) => {
                    if(!error){
                        const formData = this.props.formData;
                        this.props.dispatch(setFormStatus());
                        this.props.dispatch(submittingForm(formData,this.props,this.state.actionPath));

                    }else{
                        this.props.dispatch(setFormStatus());
                    }
                });
                break;
            }
            case 'custom':{
                if(this.state.onFunction) {
                    let testfun=function(parameter){  return new Function(`return ${parameter}`)();};
                    testfun(this.state.onFunction)();
                }
                break;
            }
            case 'validationButton':{
                break;
            }
            case 'reset':{
                this.props.dispatch(updateInitFormData());
                this.props.form.resetFields();
                break;
            }
        }
    }

    render() {
        return (
            <FormItem {...FormItemLayout()} style={{display:this.isHidden}} >
                <Button type='primary' htmlType={this.state.action} disabled={this.isDisabled}
                        onClick={this.handleOnClick}>{this.state.label}
                </Button>
            </FormItem>
        );
    }
}
QButton.propTypes = buttonPropType;
export default connect(MapStateToProps)(QButton);