import React from 'react';
import {Row} from 'antd';
import _ from 'lodash';

import {getElement} from '../factories/elementFactory';

export default class QRow extends React.Component {
    constructor() {
        super();
    }

    getComponent(componentDefinition, index) {
        return getElement(componentDefinition, index);
    }

    render() {
        let {definition} = this.props;

        let props = {
            gutter: definition.gutter || 0
        };

        if (definition.type && definition.type === 'flex') {
            props.type = definition.type;
            if (definition.align && _.indexOf(['top', 'middle', 'bottom'], definition.align) > -1) {
                props.align = definition.align;
            }
            if (definition.justify && _.indexOf(['start', 'end', 'space-around', 'space-between'], definition.justify) > -1) {
                props.justify = definition.justify;
            }
        }

        let componentDefinitions = definition.components;
        let renderRow = componentDefinitions.map((componentDefinition, index) => {
            return this.getComponent(componentDefinition, index);
        });
        return (
            <Row {...props}>
                {renderRow}
            </Row>
        );
    }
}
