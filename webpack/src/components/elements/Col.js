import React from 'react';
import {Col} from 'antd';
import _ from 'lodash';
import {connect} from 'react-redux';

import {getElement} from '../factories/elementFactory';

function mapStateToProps(store) {
    return {
        router: store.router,
        formDefinitionLoaded: store.formReducer.formDefinitionLoaded,
        formDataLoaded: store.formReducer.formDataLoaded,
        formDefinition: store.formReducer.formDefinition,
        formData: store.formReducer.formData,
        formLoadedComplete: store.formReducer.formLoadedComplete,
        formIsValid: store.formReducer.formIsValid,
    };
}

@connect(mapStateToProps)
export default class QCol extends React.Component {
    constructor() {
        super();
    }

    getComponent(componentDefinition, index) {
        let value = undefined;
        value = componentDefinition.hasOwnProperty('path') ?
            _.get(this.props.formData, componentDefinition.path) : componentDefinition.hasOwnProperty('name') ?
                _.get(this.props.formData, componentDefinition.name) : undefined;
        return getElement(componentDefinition, index, value);
    }

    render() {
        let {definition} = this.props;

        let props = {
            span: definition.span || 0,//栅格占位格数，为 0 时相当于 display: none
            order: definition.order || 0,//栅格顺序，flex 布局模式下有效
            offset: definition.offset || 0,//栅格左侧的间隔格数，间隔内不可以有栅格
            push: definition.push || 0,//栅格向右移动格数
            pull: definition.pull || 0,//栅格向左移动格数
        };

        if (definition.xs) {
            props.xs = definition.xs;//   <768px 响应式栅格，可为栅格数或一个包含其他属性的对象
        }
        if (definition.sm) {
            props.sm = definition.sm;//	  ≥768px
        }
        if (definition.md) {
            props.md = definition.md;//	  ≥992px
        }
        if (definition.lg) {
            props.lg = definition.lg;//   ≥1200px
        }
        if (definition.xl) {
            props.xl = definition.xl;//   ≥1600px
        }

        let componentDefinitions = definition.components;
        let renderCol = componentDefinitions.map((componentDefinition, index) => {
            return this.getComponent(componentDefinition, index);
        });
        return (
            <Col {...props}>
                {renderCol}
            </Col>
        );
    }
}