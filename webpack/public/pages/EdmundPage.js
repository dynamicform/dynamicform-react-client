import React from 'react';
import DynamicForm from '../../src/components/DynamicForm';

export default class EricPage extends React.Component{
    render(){
        return(
            <DynamicForm formDefinitionSrc="http://localhost:3000/api/getdefinition/Qyijie"
                         submitDataSrc="http://localhost:3000/api/UpdateFormData"/>

        );
    }
}