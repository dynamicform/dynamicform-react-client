import React from 'react';
import {Card} from 'antd';
import _ from 'lodash';
import {connect} from 'react-redux';
import {getElement, getDynamicElement} from '../factories/elementFactory';
import {MapStateToProps} from '../../utility/common';
import {containerProptypes} from '../../utility/propTypes';

export class QContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    // shouldComponentUpdate() {
    //     return false;
    // }
    //maybe need remove this method
    getComponent(componentDefinition, index) {
        const value = componentDefinition.hasOwnProperty('path') ?
            _.get(this.props.formData, componentDefinition.path) : componentDefinition.hasOwnProperty('name') ?
                _.get(this.props.formData, componentDefinition.name) : '';
        return getElement(componentDefinition, index,this.props.formConfig, value);
    }

    render() {
        const containerDefinition = this.props.definition;
        const title = containerDefinition.label;
        const componentDefinitions = containerDefinition.components;
        
        const renderContainer = componentDefinitions.map((componentDefinition, index) => {
            let formConfig={};
            //check is the control is dynamic added
            if(this.props.isDynamic) {
                formConfig.path = this.props.formConfig.path;
                return getDynamicElement(componentDefinition, index , this.props.dataPosition,this.props.formConfig);
            } else {
                //针对FORM=>FORM的Path的处理
                let path=this.props.formConfig.path;
                formConfig.path =`${path}.${componentDefinition.name}`;
                return this.getComponent(componentDefinition, index);
            }

        });
        let deleteButton;
        if(this.props.formConfig.onClickDeleteButton){
            deleteButton=this.props.formConfig.onClickDeleteButton;
        }else{
            deleteButton=<div></div>
        }
        return (
            <Card 
                title={title} 
                style={{ margin: '0 0 15px',display:containerDefinition.viewable?'none':''}}
                key={containerDefinition.name} 
                extra={deleteButton}
            >
                {renderContainer}
            </Card>
        );
    }
}
QContainer.propTypes = containerProptypes;
export default connect(MapStateToProps)(QContainer);