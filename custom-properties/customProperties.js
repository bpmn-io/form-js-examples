// (1) load form
const schema = JSON.parse(
  document.querySelector('[type="application/form-schema"]').textContent
);

const container = document.querySelector('#form');

const loadForm = FormViewer.createForm({
  container,
  schema
});

// (2) populate form fields with external data
loadForm.then(async (form) => {

  const {
    components
  } = schema;

  for (let i = 0; i < components.length; i++) {

    const field = components[i];
    const {
      properties,
      id,
      type
    } = field;

    if (type === "select" && hasExternalData(field)) {

      // (2.1) use custom property "externalData" to get external API endpoint
      const endpoint = properties.externalData;
      const res = await preloadData(endpoint, "GET");

      // (2.2) map request response to field values
      field.values = res.map(option => ({
        value: option.id,
        label: option.name
      }));
      
    }

  }

  // (3) re-render form with updated schema
  form.importSchema(schema);

  form.on('submit', (event) => {
    console.log(event.data, event.errors);
    alert("Form submitted!")
  });
})


// helpers 

function hasExternalData(field) {
  const {
    properties
  } = field;
  return properties && properties.externalData;
}

async function preloadData(url, method) {
  // mock api response
  return [{
      name: "John Smith",
      id: "johnSmith"
    },
    {
      name: "Jane Doe",
      id: "janeDoe"
    }
  ];
}