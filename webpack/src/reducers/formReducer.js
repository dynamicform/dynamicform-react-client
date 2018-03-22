import _ from 'lodash';
import {
    CREATE_NEW_FORM,
    LOAD_FORM_DATA_SUCCESSFUL,
    LOAD_FORM_DEFINITION_SUCCESSFUL,
    LOAD_FORM_DICTIONARY_SUCCESSFUL,
    RESET_FORM,
    ATTACH_FORM,
    UPDATE_FORM_DATA,
    INIT_FORM_DATA,
    SET_FORM_STATUS,
    SUBMITTING_FORM,
    // CHANGE_FORM_DEFINITION,
    ADD_DYNAMIC_ELEMENT,
    REMOVE_DYNAMIC_ELEMENT,
    INIT_DYNAMIC_FORM_DATA,
    UPDATE_DYNAMIC_FORM_DATA,
    UPDATE_INIT_FORM_DATA,
} from '../actions/formActionTypes';

const initialState = {
    form: {},
    formDefinitionLoaded: false,
    formDataLoaded: false,
    formLoadedComplete: false,
    formDictionaryLoaded: false,
    formDefinition: [],
    formIsValid: false,
    initFormData:{},
    formData: {},
    formDictionary:{},
    isNewForm: false,
    isSubmitting: false
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case CREATE_NEW_FORM: {
            return {...state,
                formDataLoaded: true,
                formData: {},
                initFormData: {},
                formLoadedComplete: (state.formDefinitionLoaded || state.formDataLoaded),
                isNewForm: true
            };
        }
        case LOAD_FORM_DEFINITION_SUCCESSFUL: {
            return  {
                ...state,
                formDefinitionLoaded: true,
                formLoadedComplete: (state.formDefinitionLoaded || state.formDataLoaded),
                formDefinition: action.payload
            };
        }
        case LOAD_FORM_DICTIONARY_SUCCESSFUL:{
            return {
                ...state,
                formDictionaryLoaded: true ,
                formDictionary: action.payload
            };
        }
        case LOAD_FORM_DATA_SUCCESSFUL: {
            return {
                ...state,
                formDataLoaded: true,
                formLoadedComplete: (state.formDefinitionLoaded || state.formDataLoaded),
                formData: action.payload,
            };
        }
        case UPDATE_FORM_DATA: {
            const key = action.payload.key;
            const value = action.payload.value;
            const newFormData = _.cloneDeep(state.formData);
            return {
                ...state,
                formData: _.set(newFormData, key, value)
            };
        }
        case UPDATE_DYNAMIC_FORM_DATA: {
            const key = action.payload.key;
            const value = action.payload.value;
            const dataPosition = action.payload.dataPosition;
            const newFormData = _.cloneDeep(state.formData);
            const path = `${dataPosition.objectName}[${dataPosition.index}].${key}`;
            return {
                ...state,
                formData: _.set(newFormData, path, value)
            };
        }
        case INIT_FORM_DATA: {
            const key = action.payload.key;
            const value = action.payload.value;
            const newFormData = _.cloneDeep(state.formData);
            return {
                ...state,
                formData: _.set(newFormData, key, value),
                initFormData: _.set(newFormData, key, value)
            };
        }
        case INIT_DYNAMIC_FORM_DATA: {
            const key = action.payload.key;
            const value = action.payload.value;
            const dataPosition = action.payload.dataPosition;
            const newFormData = _.cloneDeep(state.formData);
            const path = `${dataPosition.objectName}[${dataPosition.index}].${key}`;
            return {
                ...state,
                formData: _.set(newFormData, path, value),
                initFormData:_.set(newFormData, path, value)
            };
        }
        case SUBMITTING_FORM: {
            return {
                ...state,
                isSubmitting: true,
                formIsValid: action.payload
            };
        }
        case UPDATE_INIT_FORM_DATA:{
            return {
                ...state,
                formData: state.initFormData
            };
        }
        case RESET_FORM: {
            return {
                ...state,
                ...{
                    formDefinitionLoaded: false,
                    formDataLoaded: false,
                    formLoadedComplete: false,
                    formDictionaryLoaded: false,
                    formIsValid: false,
                    isNewForm: false,
                    isSubmitting: false,
                }
            };
        }
        case ATTACH_FORM: {
            return {
                ...state,
                form: action.payload
            };
        }
        case SET_FORM_STATUS: {
            const newFormData = _.cloneDeep(state.formData);
            return {
                ...state,
                isSubmitting: true,
                formData: newFormData
            };
        }
        case ADD_DYNAMIC_ELEMENT:{
            const newFormData = _.cloneDeep(state.formData);
            return {
                ...state,
                formData: newFormData
            };
        }
        case REMOVE_DYNAMIC_ELEMENT:{
            //current only can remove last element
            const newFormData = _.cloneDeep(state.formData);
            const key = action.payload.key;
            newFormData[key].pop();
            return {
                ...state,
                formData: newFormData
            };
        }
    }
    return state;
}
