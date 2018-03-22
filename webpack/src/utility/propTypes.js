import PropTypes from 'prop-types';

const {any, bool, func, shape, string, object, number, array} = PropTypes;

export const textfieldPropTypes = {
    definition: shape({
        name: string.isRequired,
        path: string.isRequired,
        label: string.isRequired,
        rules: array.isRequired,
    })
};
export const buttonPropType={
    definition:shape({
        buttonType: string.isRequired,
        label: string.isRequired,
    })
};
export const cascadeSelectPropType={
    definition:shape({
        name: string.isRequired,
        path: string.isRequired,
        label: string.isRequired,
        optionDataKey: string.isRequired,
        rules: array.isRequired,
    })
};
export const checkBoxGroupPropType={
    definition:shape({
        name: string.isRequired,
        path: string.isRequired,
        label: string.isRequired,
        optionDataKey: string.isRequired,
        rules: array.isRequired,
    })
};
export const datePickerPropType={
    definition: shape({
        name: string.isRequired,
        path: string.isRequired,
        label: string.isRequired,
        rules: array.isRequired,
        format:string.isRequired,
    })
};
export const dynamicControlPropType={
    definition:shape({
        label:string.isRequired,
        defaultCount:number.isRequired,
        template:object.isRequired,
    })
};
export const inputNumberPropType={
    definition: shape({
        name: string.isRequired,
        path: string.isRequired,
        label: string.isRequired,
    })
};
export const monthPickerPropType={
    definition: shape({
        name: string.isRequired,
        path: string.isRequired,
        label: string.isRequired,
        rules: array.isRequired,
        format:string.isRequired,
    })
};
export const radioGroupPropType={
    definition: shape({
        name: string.isRequired,
        path: string.isRequired,
        label: string.isRequired,
        rules: array.isRequired,
    })
};
export const rangePickerPropType={
    definition: shape({
        name: string.isRequired,
        path: string.isRequired,
        label: string.isRequired,
        rules: array.isRequired,
        format:string.isRequired,
    })
};
export const selectPropType={
    definition: shape({
        name: string.isRequired,
        path: string.isRequired,
        label: string.isRequired,
        optionDataKey:string.isRequierd,
        rules: array.isRequired,
    })
};
export const timePickerProType={
    definition: shape({
        name: string.isRequired,
        path: string.isRequired,
        label: string.isRequired,
        rules: array.isRequired,
        format:string.isRequired,
    })
};
export const uploadPropType={
    definition: shape({
        name: string.isRequired,
        path: string.isRequired,
        label: string.isRequired,
        rules: array.isRequired,
        fileType:string.isRequired,
        action:string.isRequired,
        multiple:bool.isRequired,
        showUploadList:bool.isRequired,
    })
};
export const validationButtonProptype={
    definition: shape({
        name: string.isRequired,
        path: string.isRequired,
        value: string.isRequired,
        paths: array.isRequired,
        APIPath:string.isRequired,
    })
};

export const containerProptypes = {
    definition: shape({
        viewable: bool.isRequired,
        label: string.isRequired,
        components: array.isRequired
    })
};



