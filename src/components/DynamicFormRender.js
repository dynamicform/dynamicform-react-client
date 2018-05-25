import React from 'react';
import {connect} from 'react-redux';
import {Form,Spin } from 'antd';
import _ from 'lodash';

import {
    loadFormDefinition,
    loadFormData,
    createNewForm,
    resetForm,
    submittingForm,
    attachForm,
    setFormStatus,
    loadFormDataJson
} from '../actions/formAction';

import {getElement} from './factories/elementFactory';

function mapStateToProps(store) {
    return {
        formDefinitionLoaded: store.formReducer.formDefinitionLoaded,
        formDataLoaded: store.formReducer.formDataLoaded,
        formDefinition: store.formReducer.formDefinition,
        formData: store.formReducer.formData,
        formLoadedComplete: store.formReducer.formLoadedComplete,
        formIsValid: store.formReducer.formIsValid,
        isNewForm: store.formReducer.isNewForm,
    };
}

@Form.create()
@connect(mapStateToProps)
export default class DynamicFormRender extends React.Component {
    constructor() {
        super();
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
    }

    componentWillMount() {
        //make sure the state is always new
        this.props.dispatch(resetForm());
        const definitionSrc = this.props.formDefinitionSrc;
        const formDataSetting = this.props.formDataSetting;
        this.props.dispatch(loadFormDefinition(definitionSrc));
        this.props.dispatch(attachForm(this.props.form));
        if(formDataSetting.isNewForm){
            this.props.dispatch(createNewForm());
        }else{
            if(formDataSetting.isFormDataJson){
                this.props.dispatch(loadFormDataJson(formDataSetting.formData));
            }else{
                this.props.dispatch(loadFormData(formDataSetting.dataSrc,formDataSetting.dataPath));
            }
        }
    }

    getComponent(componentDefinition, index) {
        let formConfig={};
        formConfig.path = `${componentDefinition.name}`;
        return getElement(componentDefinition, index,formConfig,this.props);
    }

    handleOnSubmit(event) {
        event.preventDefault();
        this.props.form.validateFieldsAndScroll({force:true},(error, values) => {
            //submit data if no error
            if (!error) {
                const formData = this.props.formData;
                this.props.dispatch(setFormStatus());
                //this.props.dispatch(submittingForm(formData,this.props));
                //this is for action that may trigger after submit the form
                this.props.dispatch(submittingForm(formData,this.props));

            } else {
                this.props.dispatch(setFormStatus());
            }
        });
    }

    render() {
        let renderForm;
        if (this.props.formLoadedComplete) {
            const componentDefinitions = this.props.formDefinition.components;
            renderForm = componentDefinitions.map((componentDefinition, index) => {
                return this.getComponent(componentDefinition, index);
            });
        } else {
            renderForm = <Spin className="loading" size="large" />;
        }

        return (
            // onSubmit={this.handleOnSubmit}
            <Form>{renderForm}</Form>
        );
    }
}