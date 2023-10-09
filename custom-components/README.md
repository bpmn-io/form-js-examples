# form-js Custom Components Example

This example uses [form-js](https://github.com/bpmn-io/form-js) to implement custom form components.

![form-js custom components example screenshot](./docs/screenshot.png)

## About

In this example we extend form-js with a custom component that allows users to select a number from a range. To achieve that we will walk through the following steps:

* Add a custom form component renderer
* Add custom styles for the range component
* Add custom properties panel entries to specify the min, max and step of the range

An example schema of the range component looks like this:

```json
{
  "type": "range",
  "label": "Range",
  "min": 0,
  "max": 100,
  "step": 1
}
```

### Add a custom form component renderer

The first step is to add a custom form component renderer. 

The renderer is responsible for rendering the component in the form editor and the form preview. It also handles the interaction with the component, e.g. when the value changes or validation.

We create the [`RangeRenderer`](./app/extension/render/Range.js) which defines a couple of things

* a [preact](https://preactjs.com/) component that renders the component in the form editor and preview by re-using existing components like `Label`, `Errors` and `Description`

```js
import {
  Errors,
  FormContext,
  Description,
  Label
} from '@bpmn-io/form-js';

import {
  html,
  useContext
} from 'diagram-js/lib/ui';

export function RangeRenderer(props) {

  const {
    disabled,
    errors = [],
    field,
    readonly,
    value
  } = props;

  const {
    description,
    range = {},
    id,
    label
  } = field;

  const {
    min,
    max,
    step
  } = range;

  const { formId } = useContext(FormContext);

  const errorMessageId = errors.length === 0 ? undefined : `${prefixId(id, formId)}-error-message`;

  const onChange = ({ target }) => {
    props.onChange({
      field,
      value: Number(target.value)
    });
  };

  return html`<div class=${ formFieldClasses(rangeType) }>
    <${Label}
      id=${ prefixId(id, formId) }
      label=${ label } />
    <div class="range-group">
      <input
        type="range"
        disabled=${ disabled }
        id=${ prefixId(id, formId) }
        max=${ max }
        min=${ min }
        onInput=${ onChange }
        readonly=${ readonly }
        value=${ value }
        step=${ step } />
      <div class="range-value">${ value }</div>
    </div>
    <${Description} description=${ description } />
    <${Errors} errors=${ errors } id=${ errorMessageId } />
  </div>`;
}
```

* a component `config` that extends the base `Numberfield` configuration and adds customizations as the icon, a custom label and the default properties panel entries to show

```js
import { Numberfield } from '@bpmn-io/form-js';

RangeRenderer.config = {
  ...Numberfield.config,
  type: rangeType,
  label: 'Range',
  iconUrl: `data:image/svg+xml,${ encodeURIComponent(RangeIcon) }`,
  propertiesPanelEntries: [
    'key',
    'label',
    'description',
    'min',
    'max',
    'disabled',
    'readonly'
  ]
};
```

### Register the custom renderer

We use the `formFields` service to register our custom renderer for the `range` type.

```js
class CustomFormFields {
  constructor(formFields) {
    formFields.register('range', RangeRenderer);
  }
}


export default {
  __init__: [ 'rangeField' ],
  rangeField: [ 'type', CustomFormFields ]
};
```

### Add custom styles

We define custom styles for the range component by adding a simple CSS file [`styles.css`](./app/extension/render/styles.css). For the example we import the styles directly to the component as we have a bundler ([webpack](https://webpack.js.org/)) in place that adds the styles to the application.

```css
.range-group {
  width: 100%;
  display: flex;
  flex-direction: row;
}

.range-group input {
  width: 100%;
}
.range-group .range-value {
  margin-left: 4px;
}
```

### Add custom properties panel entries

With `config.propertiesPanelEntries` we define the default properties panel entries to show for the component. We can also add custom entries to the properties panel.

We add a [`CustomPropertiesProvider`](./app/extension/properties-panel/CustomPropertiesProvider.js) that allows users to specify the min, max and step of the range component. We place the group right after the general group.

```js
export class CustomPropertiesProvider {
  constructor(propertiesPanel) {
    propertiesPanel.registerProvider(this, 500);
  }

  getGroups(field, editField) {

    ...
    return (groups) => {

      if (field.type !== 'range') {
        return groups;
      }

      const generalIdx = findGroupIdx(groups, 'general');

      groups.splice(generalIdx + 1, 0, {
        id: 'range',
        label: 'Range',
        entries: RangeEntries(field, editField)
      });

      return groups;
    };
  }
}
```

The [`RangeEntries`](./app/extension/properties-panel/CustomPropertiesProvider.js) function returns the entries to show for the range component. Check out the full provider to gather more insights.

```js
function RangeEntries(field, editField) {

  const onChange = (key) => {
    return (value) => {
      const range = get(field, [ 'range' ], {});

      editField(field, [ 'range' ], set(range, [ key ], value));
    };
  };

  const getValue = (key) => {
    return () => {
      return get(field, [ 'range', key ]);
    };
  };

  return [

    {
      id: 'range-min',
      component: Min,
      getValue,
      field,
      isEdited: isNumberFieldEntryEdited,
      onChange
    },
    {
      id: 'range-max',
      component: Max,
      getValue,
      field,
      isEdited: isNumberFieldEntryEdited,
      onChange
    },
    {
      id: 'range-step',
      component: Step,
      getValue,
      field,
      isEdited: isNumberFieldEntryEdited,
      onChange
    }
  ];
}
```

### Plugging Everything together

To embed the customizations into the form-js we need to plug everything together. We do that by including the custom renderer into both editor and preview via `additionalModules` and registering the custom properties provider to the editor via `editorAdditionalModules`.

```js
import { FormPlayground } from '@bpmn-io/form-js';

import RenderExtension from './extension/render';
import PropertiesPanelExtension from './extension/propertiesPanel';

import '@bpmn-io/form-js/dist/assets/form-js.css';
import '@bpmn-io/form-js/dist/assets/form-js-editor.css';
import '@bpmn-io/form-js/dist/assets/form-js-playground.css';

new FormPlayground({
  container,
  schema,
  data,
  additionalModules: [
    RenderExtension
  ],
  editorAdditionalModules: [
    PropertiesPanelExtension
  ]
});
```

## Building

You need a [NodeJS](http://nodejs.org) development stack with [npm](https://npmjs.org) installed to build the project.

To install all project dependencies execute

```
npm install
```

Spin up a development setup by executing

```
npm run dev
```