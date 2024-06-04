#!/bin/bash

cp ../comunications-micro/swagger.json swagger.json

docker run --rm -v ${PWD}:/local openapitools/openapi-generator-cli generate \
    -i /local/swagger.json \
    -g typescript-axios \
    -o /local/src/oas \
    --additional-properties=typescriptThreePlus=true 

