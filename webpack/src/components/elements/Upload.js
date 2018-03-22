/**
 * Created by KangYe on 2017/7/28.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Form, Upload, Button, Icon, Modal} from 'antd';
import _ from 'lodash';
import {getIsCascadeElement} from '../../utility/common';
import {initFormData, updateFormData,initDynamicFormData} from '../../actions/formAction';
import {uploadPropType} from '../../utility/propTypes';
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
    },
};

function mapStateToProps(store) {
    return {
        form: store.formReducer.form,
        formData: store.formReducer.formData,
        isNewForm: store.formReducer.isNewForm,
        isSubmitting: store.formReducer.isSubmitting
    };
}

export class QUpload extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            ...props.definition,
            previewVisible: false,
            previewImage: '',
            fileList: [],
        };
    }
    componentWillMount() {
        if (this.props.isNewForm) {
            const value = this.getValue(this.props.formData);
            if (this.props.isDynamic) {
                const dataPosition = this.props.dataPosition;
                this.props.dispatch(initDynamicFormData(this.objectPath, value, dataPosition));
            } else {
                this.props.dispatch(initFormData(this.objectPath, value));
            }
        }
    }
    get objectKey() {
        return this.state.name;
    }

    get objectPath() {
        return this.state.path || this.state.name;
    }
    getValue(formData){
        if(this.props.isDynamic) {
            const dataPosition = this.props.dataPosition;
            const path = `${dataPosition.objectName}[${dataPosition.index}].${this.objectPath}`;
            return _.get(formData, path);
        } else {
            return _.get(formData, this.objectPath);
        }
    }
    getDynamicKey() {
        if(this.props.isDynamic) {
            const dataPosition = this.props.dataPosition;
            const index = dataPosition.index;
            return `${this.objectKey}-${index}`;
        } else {
            return this.objectKey;
        }
    }
    get Rules(){
        if(this.isHidden==='none'||this.isDisabled){
            return [];
        }else{
            return this.state.rules;
        }
    }
    get isHidden() {
        if (!this.state.conditionMap  || this.state.conditionMap.length == 0) {
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
    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url,
            previewVisible: true,
        });
    }
    shouldComponentUpdate(nextProps, nextState) {
        const currentValue = this.getValue(this.props.formData);
        const nextValue = this.getValue(nextProps.formData);
        const isCascadElement = getIsCascadeElement(nextProps.formData,this.props.formData,this.state.conditionMap);
        return currentValue !== nextValue || nextProps.isSubmitting || isCascadElement || !this.state!=nextState;
    }
    handleChange = ({ file,fileList,event}) => {
        let value = [];
        if (fileList && _.isArray(fileList)) {
            fileList.forEach((item, index) => {
                let obj = {
                    ...item,
                    uid: item.uid || index,
                    name: item.name,
                    status: item.status,
                };
                if(item.response){
                    obj = {
                        ...obj,
                        url:item.response.path
                    };
                    obj.thumbUrl='';
                    obj.url = obj.url;
                    delete obj.response;
                }
                value.push(obj);
            });
            this.props.dispatch(updateFormData(this.objectPath, value));
        }
    };

    render() {
        const key = this.getDynamicKey();
        const {getFieldDecorator} = this.props.form;
        const value = this.getValue(this.props.formData);
        const {previewVisible, previewImage, fileList} = this.state;
        let props = {
            action: this.state.action,// '//jsonplaceholder.typicode.com/posts/',
            onPreview: this.handlePreview,
            onChange: this.handleChange,

            listType: this.state.fileType == 'picture' ? 'picture-card' : 'text',
            fileList: value,//this.state.fileList,
            multiple: this.state.multiple,
            showUploadList: this.state.showUploadList,
            /*
             For Excel Files 2007+ (.xlsx), use:
             accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

             For Text Files (.txt) use:
             accept="text/plain"

             For Image Files (.png/.jpg/etc), use:
             accept="image/*"

             For HTML Files (.htm,.html), use:
             accept="text/html"

             For Video Files (.avi, .mpg, .mpeg, .mp4), use:
             accept="video/*"

             For Audio Files (.mp3, .wav, etc), use:
             accept="audio/*"

             For PDF Files, use:
             accept=".pdf"
             */
            accept: this.state.accept,
            withCredentials:this.state.withCredentials,
        };
        const uploadButton=()=> {
            if (this.state.fileType == 'picture') {
                return (
                    <div>
                        <Icon type='plus'/>
                        <div className='ant-upload-text'>Upload</div>
                    </div>
                );
            } else {
                return (
                    <Button>
                        <Icon type='upload'/> Select File
                    </Button>
                );
            }
        };
        return (
            <FormItem {...formItemLayout} style={{display: this.isHidden}} label={this.state.label}>
                {getFieldDecorator(key, {
                    rules: this.Rules
                })(
                    <div className='clearfix'>
                        <Upload {...props} disabled={this.isDisabled}>
                            {/*{value && value.length >= 3 ? null : uploadButton}*/}
                            {uploadButton()}
                        </Upload>
                        <Modal
                            visible={previewVisible}
                            footer={null}
                            onCancel={this.handleCancel}
                        >
                            <img alt="example" style={{width: '100%'}} src={previewImage}/>
                        </Modal>
                    </div>
                )}
            </FormItem>
        );
    }
}
QUpload.propTypes = uploadPropType;
export default connect(mapStateToProps)(QUpload);

