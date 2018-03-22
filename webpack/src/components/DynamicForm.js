import 'antd/dist/antd.min.css';
import React from 'react';

import DynamicFormRender from './DynamicFormRender';

class DynamicForm extends React.Component{
    constructor(){
        super();
    }

    render(){
        return(
            <DynamicFormRender {...this.props} />
        );
    }
}

export default DynamicForm;