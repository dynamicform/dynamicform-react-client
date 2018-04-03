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
    setFormStatus
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
        const dataSrc = this.props.formDataSrc;
        this.props.dispatch(loadFormDefinition(definitionSrc));
        this.props.dispatch(attachForm(this.props.form));
        if (dataSrc) {
            this.props.dispatch(loadFormData(dataSrc,this.props.dataPath));
        } else {
            this.props.dispatch(createNewForm());
        }
    }

    getComponent(componentDefinition, index) {
        let value = '';
        //if the formData is not null means it is old form
        if (this.props.formDataSrc && this.props.formData) {
            value = componentDefinition.hasOwnProperty('path') ?
                _.get(this.props.formData, componentDefinition.path) : componentDefinition.hasOwnProperty('name') ?
                    _.get(this.props.formData, componentDefinition.name) : '';
        }
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