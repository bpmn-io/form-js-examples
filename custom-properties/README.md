# form-js custom properties

An example that showcases how to use custom properties in [form-js](https://github.com/bpmn-io/form-js) to customize the Viewer.

## About

This example shows how to define and use custom properties to populate a select or radio field, by relying on an external API. 

## Usage summary

### Define custom property

When defining the schema, use a custom property (`externalData`) to define the API endpoint to be used in retrieving the data.

```json
{
  ...
  "components": [
    {
      "label": "Field label",
      "type": "select",
      "id": "Field_1",
      "key": "fielKey",
      "values": [],
      "properties": {
        "externalData": "https://..."
      }
    }
  ]
  ...
}
```

### Use custom property to populate field

After loading the form, you can check which fields require external data and use the API endpoint defined for each to retrieve it. Then, the field's options can be updated in the schema.

```javascript
if (type === "select" && properties && properties.externalData) {

  // use "externalData" to get API endpoint
  const endpoint = properties.externalData;
  const res = fetch(endpoint, "GET");

  // map API response to field values
  field.values = res.map(option => ({
    value: option.id,
    label: option.name
	}))
}
```

After the schema is updated accordingly, you may re-import the schema to re-render.

```javascript
form.importSchema(schema);
```

## Run this Example
Download the example and open it in a web browser.