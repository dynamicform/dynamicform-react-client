import React from 'react';
import {Card} from 'antd';
import _ from 'lodash';
import {connect} from 'react-redux';
import {getElement, getDynamicElement} from '../factories/elementFactory';
import {MapStateToProps} from '../../utility/common';
import {containerProptypes} from '../../utility/propTypes';

export class QContainer extends React.Component {
    constructor() {
        super();
    }

    shouldComponentUpdate() {
        return false;
    }
    //maybe need remove this method
    getComponent(componentDefinition, index) {
        const value = componentDefinition.hasOwnProperty('path') ?
            _.get(this.props.formData, componentDefinition.path) : componentDefinition.hasOwnProperty('name') ?
                _.get(this.props.formData, componentDefinition.name) : '';
        return getElement(componentDefinition, index, value);
    }

    render() {

        const containerDefinition = this.props.definition;
        const title = containerDefinition.label;
        const componentDefinitions = containerDefinition.components;
        const renderContainer = componentDefinitions.map((componentDefinition, index) => {
            //check is the control is dynamic added
            if(this.props.isDynamic) {
                return getDynamicElement(componentDefinition, index , this.props.dataPosition);
            } else {
                return this.getComponent(componentDefinition, index);
            }

        });
        return (
            <Card title={title} style={{ margin: '0 0 15px',display:containerDefinition.viewable?'none':''}}>
                {renderContainer}
            </Card>
        );
    }
}
QContainer.propTypes = containerProptypes;
export default connect(MapStateToProps)(QContainer);