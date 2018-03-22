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

export function getDynamicElement(componentDefinition , index, dataPosition) {
    const componentType = componentDefinition.type;
    switch (componentType) {
        case 'textfield':
            return <Textfield
                key={index}
                definition={componentDefinition}
                isDynamic="true"
                dataPosition={dataPosition}
                />;
        case 'container':
            return <Container
                key={index}
                definition={componentDefinition}
                isDynamic="true"
                dataPosition={dataPosition}
                />;
        case 'cascadeSelect':
            return <CascadeSelect
                key={index}
                definition={componentDefinition}
                isDynamic="true"
                dataPosition={dataPosition}
                />;
        case 'radioGroup':
            return <RadioGroup
                key={index}
                definition={componentDefinition}
                isDynamic="true"
                dataPosition={dataPosition}
                />;
        case 'select':
            return <Select
                key={index}
                definition={componentDefinition}
                isDynamic="true"
                dataPosition={dataPosition}
                />;
        default:
            return <div key={index}></div>;
    }
}

export function getElement (componentDefinition , index , value, props) {
    const componentType = componentDefinition.type;
    switch (componentType) {
        case 'textfield':
            return <Textfield key={index} definition={componentDefinition} />;
        case 'hiddenTextfield':
            return <HiddenTextfield key={index} definition={componentDefinition}/>;
        case 'select':
            return <Select key={index} definition={componentDefinition} />;
        case 'button':
            return <Button key={index} definition={componentDefinition} {...props}/>;
        case 'container':
            return <Container key={index} definition={componentDefinition} value={value}/>;
        case'cascadeSelect':
            return <CascadeSelect key={index} definition={componentDefinition}/>;
        case 'upload':
            return <Upload key={index} definition={componentDefinition}/>;
        case 'radioGroup':
            return <RadioGroup key={index} definition={componentDefinition}/>;
        case 'checkBoxGroup':
            return <CheckBoxGroup key={index} definition={componentDefinition}/>;
        case 'datepicker':
            return <DatePicker key={index} definition={componentDefinition}/>;
        case 'rangepicker':
            return <RangePicker key={index} definition={componentDefinition}/>;
        case 'inputNumber':
            return <InputNumber key={index} definition={componentDefinition}/>;
        case 'row':
            return <Row key={index} definition={componentDefinition} value={value}/>;
        case 'col':
            return <Col key={index} definition={componentDefinition} value={value}/>;
        case 'timepicker':
            return <TimePicker key={index} definition={componentDefinition}/>;
        case 'switch':
            return <Switch key={index} definition={componentDefinition}/>;
        case 'monthpicker':
            return <MonthPicker key={index} definition={componentDefinition} />;
        case 'vbutton':
            return <ValidationButton key={index} definition={componentDefinition} />;
        case 'DynamicControl':
            return <DynamicControl key={index} definition={componentDefinition} />;
        default:
            return <div key={index}></div>;
    }
}
