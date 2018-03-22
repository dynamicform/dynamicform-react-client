import React from 'react';
import {addDynamicElement, removeDynamicElement, initFormData} from '../../actions/formAction';
import _ from 'lodash';
import {connect} from 'react-redux';
import {getDynamicElement} from '../factories/elementFactory';
import {Button, Icon, Form} from 'antd';
import {dynamicControlPropType} from '../../utility/propTypes';
const FormItem = Form.Item;

function mapStateToProps(store) {
    return {
        form: store.formReducer.form,
        formData: store.formReducer.formData,
        isNewForm: store.formReducer.isNewForm
    };
}

export class DynamicControl extends React.Component {
    constructor() {
        super();
        this.addComponent = this.addComponent.bind(this);
        this.removeComponent = this.removeComponent.bind(this);
    }

    componentWillMount(){
        this.state = {
            definition:this.props.definition,
            uuid :0
        };
        const { getFieldDecorator } = this.props.form;
        if(this.props.isNewForm) {
            const value = [];
            const countArray=[];
            for(let i=1; i<=this.state.definition.defaultCount; i++){
                countArray.push(i);
            }
            getFieldDecorator(this.objectKey, { initialValue: countArray });
            this.props.dispatch(initFormData(this.objectKey, value));
        } else {
            let item=_.get(this.props.formData, this.objectKey);
            const uuid =_.isUndefined(item) ? 0 : item.length;
            this.setState({uuid:uuid});
            let dynamicElementNumber = [];
            for (let i = 1; i <= uuid; i++) {
                dynamicElementNumber = dynamicElementNumber.concat(i);
            }
            getFieldDecorator(this.objectKey, { initialValue: dynamicElementNumber });
        }
    }


    get objectKey() {
        return this.state.definition.name;
    }

    addComponent() {

        this.state.uuid++;
        // can use data-binding to get
        const dynamicElementNumber = this.props.form.getFieldValue(this.objectKey);
        const nextDynamicElementNumber = dynamicElementNumber.concat(this.state.uuid);
        // can use data-binding to set
        // important! notify form to detect changes
        this.props.form.setFieldsValue({
            [this.objectKey]: nextDynamicElementNumber,
        });
        this.props.dispatch(addDynamicElement());
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

    renderDynamicControls() {
        const { getFieldValue } = this.props.form;
        const dynamicElementNumber = getFieldValue(this.objectKey);
        return dynamicElementNumber.map((k, index) => {
            const template = _.cloneDeep(this.state.definition.template);
            let flag=this.state.definition.title.length>index;
            if(flag){
                template.label=this.state.definition.title[index];
            }else{
                template.label = template.label + k;
            }
            return getDynamicElement(template, index, {objectName: this.objectKey, index: index});
        });
    }

    render() {
        const dynamicControls = this.renderDynamicControls();
        return(
            <div>
                {dynamicControls}
                <FormItem style={{float: 'left',marginRight:'10px' }}>
                    <Button type="dashed" onClick={this.addComponent}>
                        <Icon type="plus" /> 添加{this.state.definition.label}
                    </Button>
                </FormItem>
                <FormItem style={{float:'left', display: this.state.uuid > 0 ? 'block' : 'none' }}>
                    <Button type="dashed" onClick={this.removeComponent}>
                        <Icon type="minus" /> 移除{this.state.definition.label}
                    </Button>
                </FormItem>
            </div>);
    }
}
DynamicControl.propTypes = dynamicControlPropType;
export default connect(mapStateToProps)(DynamicControl);
