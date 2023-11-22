import { FeedbackButtonRenderer, type } from './FeedbackButton';

class CustomFormFields {
  constructor(formFields) {
    formFields.register(type, FeedbackButtonRenderer);
  }
}


export default {
  __init__: [ 'feedbackButton' ],
  feedbackButton: [ 'type', CustomFormFields ]
};