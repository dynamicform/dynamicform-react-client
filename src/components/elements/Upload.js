/**
 * Created by KangYe on 2017/7/28.
 */
import React from 'react';
import {connect} from 'react-redux';
import {Form, Upload, Button, Icon, Modal} from 'antd';
import _ from 'lodash';
import {getIsCascadeElement,MapStateToProps} from '../../utility/common';
import {initFormData, updateFormData,initDynamicFormData} from '../../actions/formAction';
import {uploadPropType} from '../../utility/propTypes';
import Base from './Base';
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

export class QUpload extends Base{
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
        const key = this.DynamicKey;
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
export default connect(MapStateToProps)(QUpload);

