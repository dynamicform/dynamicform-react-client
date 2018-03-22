/**
 * Created by KangYe on 2017/4/25.
 */
import React from 'react';
import {connect} from 'react-redux';
import DynamicForm from '../../src/components/DynamicForm';

@connect()
export default class YekangPage extends React.Component{

    onSuccess(){

    }

    render(){
        return(
            <DynamicForm
                formDefinitionSrc={`http://172.16.6.52:3000/api/getdefinition/Qyijie`}
                formDataSrc={`http://172.16.36.10:8081/rest/loadloanapply/BR20170615151402176627`}
                onSuccess={this.onSuccess}
                dataPath='data'
            />

        );
    }
}