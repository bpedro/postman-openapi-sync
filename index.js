const SwaggerParser = require('@apidevtools/swagger-parser');
const Postman = require('./lib/postman-sdk');

const postman = new Postman(process.env.POSTMAN_API_KEY, process.env.POSTMAN_WORKSPACE_ID);

(async() => {
  const localAPI = await SwaggerParser.parse('example_oas.yaml');

  let remoteAPI = await postman.apis(api => api.name == localAPI.info.title);  
  if (!remoteAPI.length) {
    remoteAPI = await postman.createAPI({
      name: localAPI.info.title,
      description: localAPI.info.description
    });
  } else {
    remoteAPI = remoteAPI[0];
    remoteAPI = await postman.updateAPI(remoteAPI.id, {
      name: localAPI.info.title,
      description: localAPI.info.description
    });
  }

  let remoteAPIVersion = await postman.apiVersions(remoteAPI.id, version => version.name == localAPI.info.version);
  if (!remoteAPIVersion.length) {
    remoteAPIVersion = await postman.createAPIVersion(remoteAPI.id, localAPI.info.version); 
  } else {
    remoteAPIVersion = remoteAPIVersion[0];
  }

  await postman.createAPISchema(remoteAPI.id, remoteAPIVersion.id, localAPI);
})();
