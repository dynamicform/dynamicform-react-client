import _ from 'lodash';
import 'whatwg-fetch';
export function FormItemLayout() {
    return  {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 }
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 }
        },
    };
}
export function FormItemZeroLayout() {
    return  {
        labelCol: {
            xs: { span: 0 },
            sm: { span: 0 }
        },
        wrapperCol: {
            xs: { span: 0 },
            sm: { span: 0 }
        },
    };
}
export function IsNullorUndefined(str) {
    return str == null || str == undefined || str == '';

}
export function MapStateToProps(store) {
    return {
        form: store.formReducer.form,
        formData: store.formReducer.formData,
        isNewForm: store.formReducer.isNewForm,
        isValidating: store.formReducer.isValidating,
        isSubmitting: store.formReducer.isSubmitting,
        formDictionary: store.formReducer.formDictionary,
        initFormData:store.formReducer.initFormData,
    };
}

export function ExtensionFun(value,defaultvalue) {
    return value ? defaultvalue : value;
}

//This need to discuss further
export function getDictionaryData(dictionary, key) {
    const data = _.find(dictionary.data, (dict)=> {
        return dict.value == key;
    });
    return data.children;
}

export function getIsCascadeElement(nextPropsFormData,currentFormData,conditionMap) {
    if (conditionMap) {
        let ElementAttribute = conditionMap.map((item, index)=> {
            let itemValue = _.get(nextPropsFormData, item.whichcontrol);
            let currentValue = _.get(currentFormData, item.whichcontrol);
            return itemValue != currentValue;
        });
        return _.includes(ElementAttribute, true);
    }else{
        return false;
    }
}
/**
 * 重构方法，
 * 
 * @export
 * @param {any} whichcontrolValue 
 * @param {any} condition 
 * @returns 成立 true，则返回 false
 */
export function conditionResult(whichcontrolValue,condition){
    switch(condition.comparison){
      case 'EQ':{
          return whichcontrolValue === condition.value;
      }
      case 'IN':{
        return condition.value.indexOf(whichcontrolValue)>=0;
      }
    }
    return false;
  }

