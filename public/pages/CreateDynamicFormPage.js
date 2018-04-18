import React from 'react';
import {connect} from 'react-redux';

import DynamicForm from '../../src/components/DynamicForm';

@connect()
export default class CreateDynamicFormPage extends React.Component{
    beforeSubmit(){
        console.log('回调函数beforeSubmit');
    }
    onSuccess(response){
        console.log('回调函数onSuccess');
    }
    onError(error){
        console.log('回调函数onError')
    }
    onSubmit(){
        console.log('自定义onSubmit')
    }
    render(){
        let formDataSetting={
            isFormDataJson:true,
            formDataSrc:'',
            dataPath:'data',
            formData:{},
            isNewForm:true
        }
        return(
            <DynamicForm
                isUpdate={false}
                formDefinitionSrc={`http://localhost:3000/api/getdefinition/${this.props.match && this.props.match.params.name}`}
                submitDataSrc={`http://localhost:3000/api/createformdata`}
                beforeSubmit={this.beforeSubmit}
                formDataSetting={formDataSetting}
                onSuccess={this.onSuccess}
                onError={this.onError}
                />
        );
    }
}