/**
 * Created by KangYe on 2017/4/26.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Steps, Button, message } from 'antd';
const Step = Steps.Step;
import '../css/Steps.css';
import DynamicForm from '../../src/components/DynamicForm';

function mapStateToProps(store) {
    return {
        formData: store.formReducer.formData,
        isNewForm: store.formReducer.isNewForm,
        isValidating: store.formReducer.isValidating
    };
}
function IsNullorUndefined(str){
    if(str==null||str==undefined||str=='')
        return true;
    else
        return false;
}
const stepsobj=[
    {title: 'First','URL':'http://localhost:3000/api/getdefinition/yekang'},
    {title: 'Second','URL':''},
    {title: 'Last','URL':'http://localhost:3000/api/getdefinition/nickform'}
    ];


const steps =stepsobj.map((data,index)=>{
    return {
        title:data.title,
        content:data.URL==''?'':<DynamicForm formDefinitionSrc={data.URL} />
    };
});
const steps1 = [
    {
        title: 'First',
        content: <DynamicForm formDefinitionSrc='http://localhost:3000/api/getdefinition/yekang' />
    },
    {
        title: 'Second',
        content: 'Second-content'
    },
    {
        title: 'Last',
        content: <DynamicForm formDefinitionSrc='http://localhost:3000/api/getdefinition/nickform' />
    }
];




class StepsPage extends React.Component {
    constructor() {
        super();
        this.state = {
            current: 0,
        };
    }
    next() {
        const current = this.state.current + 1;
        this.setState({ current });
    }
    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }
    render() {
        const {current} = this.state;
        return (
            <div>
                <Steps current={current}>
                    {steps.map(item => <Step key={item.title} title={item.title}/>)}
                </Steps>
                <div className='steps-content'>
                    {steps[this.state.current].content}
                    {
                        /*
                         *"http://localhost:3000/api/getdefinition/yekang"
                         *
                         *
                         * */
                    }

                </div>
                <div className='steps-action'>
                    {
                        this.state.current < steps.length - 1
                        &&
                        <Button type='primary' onClick={() => this.next()}>Next</Button>
                    }
                    {
                        this.state.current === steps.length - 1
                        &&
                        <Button type='primary' onClick={() => message.success('Processing complete!')}>Done</Button>
                    }
                    {
                        this.state.current > 0
                        &&
                        <Button style={{ marginLeft: 8 }} onClick={() => this.prev()}>
                            Previous
                        </Button>
                    }
                </div>
            </div>
        );
    }
}
export default connect(mapStateToProps)(StepsPage);