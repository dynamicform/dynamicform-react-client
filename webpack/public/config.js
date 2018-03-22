//const ApiAddress = 'http://172.16.5.173:3000';
const ApiAddress = 'http://localhost:3000';
export const GetAllDefinition = () => `${ApiAddress}/api/getalldefinition`;
export const GetDefinitionByName = (name) => `${ApiAddress}/api/getdefinition/${name}`;
export const CreateFormData = () => `${ApiAddress}/api/createformdata`;
export const LoadFormDataById = (id) => `${ApiAddress}/api/loadformdataById/${id}`;
export const LoadFormDataByName = (name) => `${ApiAddress}/api/loadformdataByName/${name}`;
export const LoadAllFormData = () => `${ApiAddress}/api/loadAllformdata`;
export const UpdateFormData = () => `${ApiAddress}/api/UpdateFormData`;