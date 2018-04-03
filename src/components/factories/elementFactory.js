import React from 'react';

//components
import Textfield from '../elements/Textfield';
import HiddenTextfield from '../elements/HiddenTextfield';
import Select from '../elements/Select';
import Button from '../elements/Button';
import Container from '../elements/Container';
import CascadeSelect from '../elements/CascadeSelect';
import Upload from '../elements/Upload';
import RadioGroup from '../elements/RadioGroup';
import CheckBoxGroup from '../elements/CheckBoxGroup';
import DatePicker from '../elements/DatePicker';
import RangePicker from '../elements/RangePicker';
import InputNumber from '../elements/InputNumber';
import Row from '../elements/Row';
import Col from '../elements/Col';
import TimePicker from '../elements/TimePicker';
import Switch from '../elements/Switch';
import MonthPicker from '../elements/MonthPicker';
import ValidationButton from '../elements/ValidationButton';
import DynamicControl from '../elements/DynamicControl';

export function getDynamicElement(componentDefinition , index, dataPosition,formConfig) {
    const componentType = componentDefinition.type;
    let property={
        key:index,
        definition:componentDefinition,
        isDynamic:true,
        dataPosition:dataPosition,
        formConfig:formConfig,
    };
    switch (componentType) {
        case 'textfield':
            return <Textfield {...property} />;
        case 'hiddenTextfield':
            return <HiddenTextfield {...property}/>;
        case 'select':
            return <Select {...property} />;
        case 'button':
            return <Button {...property} />;
        case 'container':
            return <Container {...property} />;
        case'cascadeSelect':
            return <CascadeSelect {...property} />;
        case 'upload':
            return <Upload {...property} />;
        case 'radioGroup':
            return <RadioGroup {...property} />;
        case 'checkBoxGroup':
            return <CheckBoxGroup {...property} />;
        case 'datepicker':
            return <DatePicker {...property} />;
        case 'rangepicker':
            return <RangePicker {...property} />;
        case 'inputNumber':
            return <InputNumber {...property} />;
        case 'row':
            return <Row {...property} />;
        case 'col':
            return <Col {...property} />;
        case 'timepicker':
            return <TimePicker {...property} />;
        case 'switch':
            return <Switch {...property} />;
        case 'monthpicker':
            return <MonthPicker {...property} />;
        case 'vbutton':
            return <ValidationButton {...property} />;
        case 'DynamicControl':
            return <DynamicControl {...property} />;
        default:
            return <div  {...property} ></div>;
    }
}

export function getElement (componentDefinition , index ,formConfig, props) {
    const componentType = componentDefinition.type;
    let property={
        key:index,
        formConfig:formConfig,
        definition:componentDefinition
    };
    switch (componentType) {
        case 'textfield':
            return <Textfield{...property} />;
        case 'hiddenTextfield':
            return <HiddenTextfield {...property}/>;
        case 'select':
            return <Select {...property} />;
        case 'button':
            return <Button {...property} {...props} />;
        case 'container':
            return <Container {...property}  />;
        case'cascadeSelect':
            return <CascadeSelect {...property} />;
        case 'upload':
            return <Upload {...property} />;
        case 'radioGroup':
            return <RadioGroup {...property} />;
        case 'checkBoxGroup':
            return <CheckBoxGroup {...property} />;
        case 'datepicker':
            return <DatePicker {...property} />;
        case 'rangepicker':
            return <RangePicker {...property} />;
        case 'inputNumber':
            return <InputNumber {...property} />;
        case 'row':
            return <Row {...property} />;
        case 'col':
            return <Col {...property} />;
        case 'timepicker':
            return <TimePicker {...property} />;
        case 'switch':
            return <Switch {...property} />;
        case 'monthpicker':
            return <MonthPicker {...property} />;
        case 'vbutton':
            return <ValidationButton {...property} />;
        case 'DynamicControl':
            return <DynamicControl {...property} />;
        default:
            return <div key={index}></div>;
    }
}
