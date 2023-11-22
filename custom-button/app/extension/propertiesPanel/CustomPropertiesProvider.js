import { get } from 'min-dash';

import { useVariables } from '@bpmn-io/form-js';

import {
  FeelTemplatingEntry,
  isFeelEntryEdited,
  isTextFieldEntryEdited,
  TextFieldEntry
} from '@bpmn-io/properties-panel';


export class CustomPropertiesProvider {
  constructor(propertiesPanel) {
    propertiesPanel.registerProvider(this, 500);
  }

  /**
   * @param {any} field
   * @param {function} editField
   *
   * @return {(Object[]) => (Object[])} groups middleware
   */
  getGroups(field, editField) {

    /**
     * @param {Object[]} groups
     *
     * @return {Object[]} modified groups
     */
    return (groups) => {

      if (field.type !== 'feedbackButton') {
        return groups;
      }

      const generalIdx = findGroupIdx(groups, 'general');

      /* insert group after general */
      groups.splice(generalIdx + 1, 0, {
        id: 'feedback',
        label: 'Feedback',
        entries: Entries(field, editField)
      });

      return groups;
    };
  }
}

CustomPropertiesProvider.$inject = [ 'propertiesPanel' ];

function Entries(field, editField) {

  const onChange = (key) => {
    return (value) => {
      editField(field, [ key ], value);
    };
  };

  const getValue = (key) => {
    return () => {
      return get(field, [ key ]);
    };
  };

  return [

    {
      id: 'endpoint',
      component: Endpoint,
      getValue,
      field,
      isEdited: isTextFieldEntryEdited,
      onChange
    },
    {
      id: 'message',
      component: Message,
      getValue,
      field,
      isEdited: isFeelEntryEdited,
      onChange
    }
  ];

}

function Endpoint(props) {
  const {
    field,
    getValue,
    id,
    onChange
  } = props;

  const debounce = (fn) => fn;

  return TextFieldEntry({
    debounce,
    element: field,
    getValue: getValue('endpoint'),
    id,
    label: 'Endpoint',
    setValue: onChange('endpoint')
  });
}

function Message(props) {
  const {
    field,
    getValue,
    id,
    onChange
  } = props;

  const debounce = (fn) => fn;

  const variables = useVariables().map(name => ({ name }));

  return FeelTemplatingEntry({
    debounce,
    element: field,
    getValue: getValue('message'),
    id,
    label: 'Message',
    setValue: onChange('message'),
    variables
  });
}

// helper //////////////////////

function findGroupIdx(groups, id) {
  return groups.findIndex(g => g.id === id);
}