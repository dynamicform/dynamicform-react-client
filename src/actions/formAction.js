import 'whatwg-fetch';
import {get,post} from '../utility/HttpHelper';
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
    ADD_DYNAMIC_ELEMENT,
    REMOVE_DYNAMIC_ELEMENT,
    INIT_DYNAMIC_FORM_DATA,
    UPDATE_DYNAMIC_FORM_DATA,
    UPDATE_INIT_FORM_DATA,
} from './formActionTypes';
import _ from 'lodash';

export function createNewForm() {
    return (dispatch) => {
        dispatch({
            type: CREATE_NEW_FORM
        });
    };
}

export function addDynamicElement() {
    return (dispatch) => {
        dispatch({
            type: ADD_DYNAMIC_ELEMENT
        });
    };
}
export function updateInitFormData(){
    return (dispatch)=>{
        dispatch({
            type:UPDATE_INIT_FORM_DATA
        });
    };
}

export function removeDynamicElement(key,index) {
    return (dispatch) => {
        dispatch({
            type: REMOVE_DYNAMIC_ELEMENT,
            payload: {
                key: key,
                index:index
            }
        });
    };
}

export function loadFormDefinition(definitionSrc) {
    return function (dispatch) {
        get(definitionSrc).then(function (response) {
            const formDefinition = response.data;
            const formDictionaryPath=response.data.formDictionaryPath;
            if(formDictionaryPath) {
                get(formDictionaryPath).then(function (resp) {
                    const formDictionary = resp.data;
                    dispatch({type: LOAD_FORM_DICTIONARY_SUCCESSFUL, payload: formDictionary});
                    dispatch({type: LOAD_FORM_DEFINITION_SUCCESSFUL, payload: formDefinition});
                });
            }else{
                dispatch({type: LOAD_FORM_DEFINITION_SUCCESSFUL, payload: formDefinition});
            }
        }).catch((error)=>{
            console.log(error);
        });
    };
}
export function loadFormData(dataSrc,dataPath) {
    return function (dispatch) {
        get(dataSrc).then((response)=>{
            let data=_.get(response.data,dataPath);
            dispatch({type: LOAD_FORM_DATA_SUCCESSFUL, payload: data});
        }).catch((error)=>{
            console.log(error);
        });
    };
}
export function loadFormDataJson(data){
    return function (dispatch){
        dispatch({type: LOAD_FORM_DATA_SUCCESSFUL, payload: data})
    }
}

export function updateFormData(key, value) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_FORM_DATA,
            payload: {
                key: key,
                value: value
            }
        });
    };
}

export function updateDynamicFormData(key, value, dataPosition) {
    return (dispatch) => {
        dispatch({
            type: UPDATE_DYNAMIC_FORM_DATA,
            payload: {
                key: key,
                value: value,
                dataPosition: dataPosition
            }
        });
    };
}

export function initFormData(key, value) {
    return (dispatch) => {
        dispatch({
            type: INIT_FORM_DATA,
            payload: {
                key: key,
                value: value
            }
        });
    };
}

export function initDynamicFormData(key, value, dataPosition) {
    return (dispatch) => {
        dispatch({
            type: INIT_DYNAMIC_FORM_DATA,
            payload: {
                key: key,
                value: value,
                dataPosition: dataPosition
            }
        });
    };
}


export function resetForm() {
    return (dispatch) => {
        dispatch({
            type: RESET_FORM
        });
    };
}

export function attachForm(form) {
    return (dispatch) => {
        dispatch({
            type: ATTACH_FORM,
            payload: form
        });
    };
}

export function setFormStatus() {
    return (dispatch) => {
        dispatch({
            type: SET_FORM_STATUS,
        });
    };
}

//more logic will be put here
export function submittingForm(formData,props,url) {
        if(props.beforeSubmit){
            props.beforeSubmit();
        }
        //如果没有自定义Submit，则用默认处理
        if(props.onSubmit){
            props.onSubmit(formData);
        }else {
            post(url, formData).then((response)=> {
                props.onSuccess(response);
            }).catch((error) => {
                if (props.onError) {
                    props.onError(error);
                } else {
                    console.log(error);
                }
            });
    }
}
