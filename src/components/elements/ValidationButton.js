/**
 * Created by KangYe on 2017/5/25.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Button,message,Form} from 'antd';
import {MapStateToProps,FormItemLayout} from '../../utility/common';
import {post} from '../../utility/HttpHelper';
import _ from 'lodash';
import {validationButtonProptype} from '../../utility/propTypes';
const FormItem = Form.Item;

export class QVButton extends React.Component {
    constructor() {
        super();
    }
    componentWillMount() {
        this.state = this.props.definition;
    }
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }
    get isHidden() {
        let cascadeElement = this.state.conditionMap && Array.isArray(this.state.conditionMap);
        if (_.isUndefined(cascadeElement)  || this.state.conditionMap.length == 0) {
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
    async handleOnClick(event) {
        let obj={};
        this.state.paths.map((item,index)=>{
            _.set(obj,item.name.toString(),_.get(this.props.formData, item.path));
        });
        let res =await post(this.state.APIPath,obj);
        message.info(res.data.result);
    }

    render() {
        return (
            <FormItem {...FormItemLayout()} style={{display: this.isHidden}}>
                <Button size="default" onClick={(event) => this.handleOnClick(event)}
                        disabled={this.isDisabled}>{this.state.value}</Button>
            </FormItem>

        );
    }
}
QVButton.propTypes = validationButtonProptype;
export default connect(MapStateToProps)(QVButton);