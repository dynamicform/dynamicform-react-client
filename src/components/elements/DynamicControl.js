import React from 'react';
import {addDynamicElement, removeDynamicElement, initFormData} from '../../actions/formAction';
import _ from 'lodash';
import {connect} from 'react-redux';
import {getDynamicElement} from '../factories/elementFactory';
import {Button, Icon, Form,message} from 'antd';
import {dynamicControlPropType} from '../../utility/propTypes';
const FormItem = Form.Item;

function mapStateToProps(store) {
    return {
        form: store.formReducer.form,
        formData: store.formReducer.formData,
        isNewForm: store.formReducer.isNewForm,
    };
}

export class DynamicControl extends React.Component {
    constructor(props) {
        super(props);
        this.addComponent = this.addComponent.bind(this);
        this.removeComponent = this.removeComponent.bind(this);
        this.state = {
            definition:props.definition,
            form: props.form,
            uuid: 0
        };
    }

    componentDidMount(){
        const { getFieldDecorator,getFieldValue } = this.currentForm;
        if(this.props.isNewForm) {
            //先判断默认显示多个
            let minCount=this.state.definition.minCount;
            let defaultCount=this.state.definition.defaultCount;
            let count=defaultCount ? defaultCount: minCount;
            let dynamicElementNumber = [];
            for (let i = 1; i <= count; i++) {
                dynamicElementNumber = dynamicElementNumber.concat(i);
            }
            getFieldDecorator(this.objectKey, { initialValue: dynamicElementNumber });
            const value = [];
            // const countArray=[];
            // for(let i=1; i<=this.state.definition.defaultCount; i++){
            //     countArray.push(i);
            // }
            // getFieldDecorator(this.objectKey, { initialValue: countArray });
            //this.props.dispatch(initFormData(this.DynamicPath, value));
        } else {
            // //先判断默认显示多个
             let defaultCount=this.state.definition.minCount;
            // //判断目前的formdData
             let item=_.get(this.props.formData, this.DynamicPath);
             let count=item ? item.length : defaultCount;
            // this.setState({uuid:count});
            if(defaultCount<item.length){
                count=item.length;
            }else{
                count=defaultCount;
            }

            let dynamicElementNumber = [];
            for (let i = 1; i <= count; i++) {
                dynamicElementNumber = dynamicElementNumber.concat(i);
            }
            getFieldDecorator(this.objectKey, { initialValue: dynamicElementNumber });
        }
    }

    get DynamicPath(){
        /**
         * 判断是一起判断即是数组组件同时又是在Container中
         * 存在的问题在于。一个form下面可能存在多个数组组件
         */
        if(this.state.definition.multiple){
            return this.props.formConfig.path;
        }else{
            return this.state.definition.path;
        }
    }
    
    get objectKey() {
        return this.state.definition.name;
    }

    get currentForm(){
        return this.state.form;
    }

    addComponent() {
        this.state.uuid++;
        // can use data-binding to get
        let dynamicElementNumber = this.currentForm.getFieldValue(this.objectKey);
        let nextDynamicElementNumber= dynamicElementNumber.concat((dynamicElementNumber.length+1));
        // can use data-binding to set
        // important! notify form to detect changes
        this.currentForm.setFieldsValue({
            [this.objectKey]: nextDynamicElementNumber,
        });
        this.props.dispatch(addDynamicElement());
    }

    

    renderDynamicControls() {
        

        //先判断默认显示多个
        let count=this.state.definition.minCount?this.state.definition.minCount:0;
        //判断目前的formdData
        let item=_.get(this.props.formData, this.DynamicPath);
        let dynamicElementNumber = this.currentForm.getFieldValue(this.objectKey);
        
        if(dynamicElementNumber && count<dynamicElementNumber.length){
            count=dynamicElementNumber.length;
        }
        let dynamicElementNumberOther = [];
        for (let i = 1; i <= count; i++) {
            dynamicElementNumberOther = dynamicElementNumberOther.concat(i);
        }
        return dynamicElementNumberOther.map((item,index)=>{
            const template = _.cloneDeep(this.state.definition).template;
            template.label = template.label + (index+1);
            let formConfig={
                //initData : template.initData,
                //multiple : this.state.definition.multiple,
                path : this.DynamicPath,
                //readOnly : this.props.formConfig.readOnly,
                onClickDeleteButton:<Button type="dashed" 
                                    onClick={this.onClickDelete.bind(this,index)}>
                                <Icon type="minus" /> 移除{this.state.definition.label}
                        </Button>
            };
            //disabled={!this.props.businessData.canOperate}
            return getDynamicElement(template, index, {objectName: this.objectKey, index: index},formConfig);
        });
    }

    onClickDelete(index){
        this.state.uuid--;
        let dynamicElementNumber = this.currentForm.getFieldValue(this.objectKey);
        //判断是不是比默认最小的还小
        if(this.state.definition.minCount>=dynamicElementNumber.length){
            let msg=`${this.state.definition.label} 默认最小必填 ${this.state.definition.minCount} 个`;
            message.error(msg);
        }else{
            dynamicElementNumber.splice(index,1);
            //dynamicElementNumber.pop();
            this.currentForm.setFieldsValue({
                [this.objectKey]:dynamicElementNumber
            });
            this.props.dispatch(removeDynamicElement(this.DynamicPath,index));
         }
    }

    get addIsDisabled(){
        let item = _.get(this.props.formData, this.DynamicPath);
        let dynamicElementNumber = this.currentForm.getFieldValue(this.objectKey);
        let maxCount=this.state.definition.maxCount;
        //maxCount
        //if(!this.props.businessData.canOperate){
        //    return true;
        //}else{
            if(item && maxCount<=item.length){
                return true;
            }
            if(dynamicElementNumber && maxCount<=dynamicElementNumber){
                return true;
            }
            return false;
        //}
    }
    removeComponent(){
        this.state.uuid--;
        //remove last number;
        const dynamicElementNumber = this.props.form.getFieldValue(this.objectKey);
        dynamicElementNumber.pop();

        const nextDynamicElementNumber = dynamicElementNumber;
        // can use data-binding to set
        // important! notify form to detect changes
        this.props.form.setFieldsValue({
            [this.objectKey]: nextDynamicElementNumber,
        });
        this.props.dispatch(removeDynamicElement(this.objectKey));
    }

    render() {
        return(
            <div style={{clear:'left'}}>
                {this.renderDynamicControls()}
                <FormItem style={{float: 'left',marginRight:'10px' }}>
                    <Button type="dashed" disabled={this.addIsDisabled} onClick={this.addComponent}>
                        <Icon type="plus" /> 添加{this.state.definition.label}
                    </Button>
                    <Button type="dashed" 
                                    onClick={this.removeComponent}>
                                <Icon type="minus" /> 移除{this.state.definition.label}
                        </Button>
                </FormItem>
            </div>);
    }
}
DynamicControl.propTypes = dynamicControlPropType;
export default connect(mapStateToProps)(DynamicControl);
