# Postman OpenAPI sync

Postman OpenAPI sync makes sure that your local OpenAPI spec is in sync with Postman. It does that by using your local OpenAPI spec as the source of truth and synchronizing its contents with Postman.

## Running

To run `postman-api-sync` you must first create two environment variables:

- `POSTMAN_API_KEY`: your Postman API key.
- `POSTMAN_WORKSPACE_ID`: the ID of the workspace where you want to synchronize your API.

Then, you can simply run:

```
node ./index.js <openapi_file>
```

Where `openapi_file` is your local OpenAPI specification file.

## Flow

1. Read a local OpenAPI specification file.
2. Obtain the local API name and version from the specification file.
3. Check if there is an API with the same name on Postman.
4. If not, create an API with the same name and description as the local OpenAPI specification.
5. Create an API version with the same value as the local OpenAPI specification, if one doesn't already exist.
6. Update the API schema with the value from the local OpenAPI specification.