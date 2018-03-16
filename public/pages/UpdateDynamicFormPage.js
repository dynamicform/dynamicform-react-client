import React from 'react';
import {connect} from 'react-redux';

import DynamicForm from '../../src/components/DynamicForm';
@connect()
export default class UpdateDynamicFormPage extends React.Component{
    onSubmit(er){
        console.log('回调函数onSubmit');
    }
    onSuccess(){

    }
//${this.props.match && this.props.match.params.name}
    //${this.props.match && this.props.match.params.id}
    render(){
        return(
            <div>
                <DynamicForm
                    formDefinitionSrc={`http://localhost:3000/api/getdefinition/${this.props.match && this.props.match.params.name}`}
                    formDataSrc={`http://localhost:3000/api/loadformdataById/${this.props.match && this.props.match.params.id}`}
                    _id={this.props.match && this.props.match.params.id}
                    dataPath='data'
                    onSuccess={this.onSuccess}
                    />
            </div>
        );
    }
}