import { RangeRenderer, rangeType } from './Range';

/*
 * This is the module definition of the custom field. This goes
 * into the Form instance via `additionalModules`.
 */
class CustomFormFields {
  constructor(formFields) {
    formFields.register(rangeType, RangeRenderer);
  }
}


export default {
  __init__: [ 'rangeField' ],
  rangeField: [ 'type', CustomFormFields ]
};