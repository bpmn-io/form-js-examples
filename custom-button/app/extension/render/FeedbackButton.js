import {
  Button,
  useTemplateEvaluation
} from '@bpmn-io/form-js';

import {
  html,
  useCallback
} from 'diagram-js/lib/ui';

import './styles.css';

import FeedbackIcon from './feedback.svg';

export const type = 'feedbackButton';

export function FeedbackButtonRenderer(props) {

  const {
    disabled,
    readonly,
    field
  } = props;

  const {
    endpoint,
    message
  } = field;

  const evaluatedMessage = useTemplateEvaluation(message, { debug: true, strict: true });

  const onClick = useCallback(() => {

    if (disabled || readonly) {
      return;
    }

    // send the message to the configured endpoint
    alert(`Send message to ${ endpoint }:\n\n${ evaluatedMessage }`);
  }, [ disabled, readonly, endpoint, evaluatedMessage ]);

  return html`<div class="feedback-button-container" onClick=${onClick}>
    <${Button}
      {...props}
      field=${{
    ...field,
    acton: 'feedback'
  }}></${Button}>
    </div>`;
}

FeedbackButtonRenderer.config = {
  ...Button.config,
  type: type,
  label: 'Feedback',
  iconUrl: `data:image/svg+xml,${ encodeURIComponent(FeedbackIcon) }`,
  propertiesPanelEntries: [
    'label'
  ]
};