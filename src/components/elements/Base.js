import React from 'react';
export default class Base extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            ...props.definition
        };
    }
    get objectKey() {
        return this.state.name;
    }

    get objectPath() {
        if(this.props.isDynamic){
          const dataPosition = this.props.dataPosition;
          const path = `${this.props.formConfig.path}[${dataPosition.index}].${this.objectKey}`;
          return path;
        }else{
          return this.props.definition.path;
        }
      }

    get DynamicKey() {
        if(this.props.isDynamic) {
            const dataPosition = this.props.dataPosition;
            const index = dataPosition.index;
            return `${this.objectKey}-${index}`;
        } else {
            return this.objectKey;
        }
      }

    getDynamicPath(whichControlName){
        if(this.props.isDynamic) {
          const dataPosition = this.props.dataPosition;
          const path = `${this.props.formConfig.path}[${dataPosition.index}].${whichControlName}`;
          return path;
        } else {
          let configPath=this.props.formConfig.path;
          return `${configPath.substring(0,configPath.lastIndexOf('.'))}.${whichControlName}`;
        }
      }
    getValue(formData){
      return _.get(formData, this.objectPath);
    }

    get Rules(){
        if(this.isHidden==='none'||this.isDisabled){
            return [];
        }else{
            return this.state.rules;
        }
    }

    get isHidden() {
        if (!this.state.conditionMap || this.state.conditionMap.length == 0) {
            return this.state.hidden ? 'none' : '';
        } else {
            let ElementAttribute = this.state.conditionMap.map((item, index)=> {
                let itemValue = _.get(this.props.formData, item.whichcontrol);
                switch (item.how) {
                    case 'equal': {
                        return item.value === itemValue && item.action === 'hidden' && item.actionValue ? 'none' : '';
                    }
                }
                return '';
            });
            return _.includes(ElementAttribute, 'none') ? 'none' : '';
        }
    }

    get isDisabled(){
        if(!this.state.conditionMap|| this.state.conditionMap.length == 0) {
            return this.state.disabled;
        }else {
            let ElementAttribute = this.state.conditionMap.map((item, index)=> {
                let itemValue = _.get(this.props.formData, item.whichcontrol);
                switch (item.how) {
                    case 'equal': {
                        return item.value === itemValue && item.action === 'disabled' && item.actionValue;
                    }
                    case 'greater': {
                        return '';
                    }
                    case 'less': {
                        return '';
                    }
                }
            });
            return _.includes(ElementAttribute, true);
        }
    }
}