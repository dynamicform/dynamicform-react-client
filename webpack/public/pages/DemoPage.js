import React from 'react';
import {Table, Button, Select} from 'antd';
import {connect} from 'react-redux';
import {push} from 'react-router-redux';
import _ from 'lodash';
import {get} from '../../src/utility/HttpHelper'

import {GetAllDefinition,LoadAllFormData} from '../config';

const Option = Select.Option;

const columns = [
    {
        title: 'ID',
        dataIndex: '_id',
        key: '_id',
    }, {
        title: 'TemplateName',
        dataIndex: 'definitionName',
        key: 'definitionName'
    }, {
        title: 'ModifiedTime',
        dataIndex: 'modified',
        key: 'modified',
    }, {
        title: 'CreatedTime',
        dataIndex: 'created',
        key: 'created',
    }, {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <span>
              <a href={`#/demo/edit/yekang/${record._id}`}>Edit</a>
            </span>
        ),
    }];
function GetQueryString(name,search) {  
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");  
    var r = search.substr(1).match(reg);  //获取url中"?"符后的字符串并正则匹配
    var context = "";  
    if (r != null)  
         context = r[2];  
    reg = null;  
    r = null;  
    return context == null || context == "" || context == "undefined" ? "" : context;  
}
@connect()
export default class DemoPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectDataSource: [],
            selectItem: '',
            tableData: [],
        };
        var selectItem = GetQueryString('selectItem',props.location.search);
        if(selectItem){
            this.state.selectItem = selectItem;
        }
        this.getSelectData = this.getSelectData.bind(this);
        this.getTableData = this.getTableData.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
        this.getSelectData();
        this.getTableData();
    }

    render() {
        let {selectDataSource, tableData, selectItem} = this.state;
        let data = [];
        const Options = selectDataSource.map((item, index) =>
            <Option key={index} value={item.name}>{item.name}</Option>
        );

        if (tableData && tableData.length > 0) {
            if (selectItem && selectItem !== '') {
                data = _.filter(tableData, function (item) {
                    return item.definitionName && item.definitionName === selectItem
                });
            }
            else {
                data = tableData;
            }
        }

        return (
            <div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div>
                        <span>Template：</span>
                        <Select defaultValue={this.state.selectItem} style={{width: 120}}
                                onChange={this.handleSelectChange}>
                            {Options}
                        </Select>
                    </div>
                    <Button type="primary" onClick={this.handleClick}>Create Form</Button>
                </div>
                <Table columns={columns} dataSource={data}/>
            </div>
        );
    }

    handleClick() {
        if(this.state.selectItem){
            this.props.dispatch(push(`/demo/create/${this.state.selectItem}`));
        }
    }

    handleSelectChange(value) {
        if (value !== this.state.selectItem) {
            location.href = `#/?selectItem=${value}`;
            this.setState({selectItem: value});
        }
    }

    getSelectData() {
        get(GetAllDefinition()).then((response)=>{
            if(response && response.data && _.isArray(response.data)){
                this.setState({
                    selectDataSource: response.data
                });
            }else{
                console.warn('no data or data structure error');
            }
        }).catch((err)=>{
            console.error(err);
        });
    }

    getTableData() {
        get(LoadAllFormData()).then((response)=>{
            if(response && response.data && _.isArray(response.data)){
                this.setState({
                    tableData: response.data
                });
            }else{
                console.warn('no data or data structure error');
            }
        }).catch((err)=>{
            console.error(err);
        });
    }
}