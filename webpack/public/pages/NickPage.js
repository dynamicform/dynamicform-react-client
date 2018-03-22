import React from 'react';
import { Form, Input, Icon, Button } from 'antd';

const FormItem = Form.Item;
let uuid = 0;

@Form.create()
export default class NickPage extends React.Component{
    componentWillMount() {

    }
    remove = (k) => {
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        // We need at least one passenger
        if (keys.length === 1) {
            return;
        }

        // can use data-binding to set
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };

    add = () => {
        uuid++;
        const { form } = this.props;
        // can use data-binding to get
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(uuid);
        // can use data-binding to set
        // important! notify form to detect changes
        form.setFieldsValue({
            keys: nextKeys,
        });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };

    render(){
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');
        const formItems = keys.map((k, index) => {
            return (
                <FormItem label='Fucker' required={false} key={k}>
                    {getFieldDecorator(`names-${k}`, {
                        validateTrigger: ['onChange', 'onBlur'],
                        rules: [{
                            required: true,
                            whitespace: true,
                            message: "Fuck you.",
                        }],
                    })(
                        <Input placeholder="Fucker name"/>
                    )}
                    <Icon
                        className="dynamic-delete-button"
                        type="minus-circle-o"
                        disabled={keys.length === 1}
                        onClick={() => this.remove(k)}
                    />
                </FormItem>
            );
        });
        return(
            <Form onSubmit={this.handleSubmit}>
                {formItems}
                <FormItem>
                    <Button type="dashed" onClick={this.add}>
                        <Icon type="plus" /> Add Fucker
                    </Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" size="large">Submit</Button>
                </FormItem>
            </Form>
        );
    }
}

