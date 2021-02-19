const SwaggerParser = require('@apidevtools/swagger-parser');
const Postman = require('./lib/postman-sdk');

const args = process.argv.slice(2);
if (!args.length) {
  console.error('usage: postman-openapi-sync openapi_file');
  process.exit(0);
}

const postman = new Postman(
  process.env.POSTMAN_API_KEY,
  process.env.POSTMAN_WORKSPACE_ID
);

(async() => {
  try {
    const localAPI = await SwaggerParser.parse('example_oas.yaml');

    // Obtain a remote representation of the API
    // defined by the local OpenAPI specification.
    let remoteAPI = await postman.apis(api => api.name == localAPI.info.title);  
    if (!remoteAPI.length) {
      remoteAPI = await postman.createAPI({
        name: localAPI.info.title,
        description: localAPI.info.description
      });
    } else {
      remoteAPI = remoteAPI[0];
      if (remoteAPI.name != localAPI.info.title ||
          remoteAPI.description != localAPI.info.description) {
        remoteAPI = await postman.updateAPI(remoteAPI.id, {
          name: localAPI.info.title,
          description: localAPI.info.description
        });
      }
    }

    // Obtain a remote representation of the API version
    // defined by the local OpenAPI specification.
    let remoteAPIVersion = await postman.apiVersions(remoteAPI.id, version => version.name == localAPI.info.version);
    if (!remoteAPIVersion.length) {
      remoteAPIVersion = await postman.createAPIVersion(remoteAPI.id, localAPI.info.version); 
    } else {
      remoteAPIVersion = await postman.apiVersion(remoteAPI.id, remoteAPIVersion[0].id);
    }

    // Synchronize the remote API schema with the one
    // defined by the local OpenAPI specification.
    if (!remoteAPIVersion.schema.length) {
      await postman.createAPISchema(remoteAPI.id, remoteAPIVersion.id, localAPI);
    } else {
      await postman.updateAPISchema(remoteAPI.id, remoteAPIVersion.id, remoteAPIVersion.schema[0], localAPI);
    }
  } catch(err) {
    console.error(err);
  }
})();
