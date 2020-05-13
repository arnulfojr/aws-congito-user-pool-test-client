#!/bin/bash


set -e

# install stuff
if [ ! -d node_modules ]; then
  npm install
fi

# run CDK
export AWS_REGION=us-east-1

npx cdk deploy

export STACK_NAME="UserPoolTestStack"
outputs="$(./bin/get-outputs.js)"

userPoolClient="$(echo ${outputs} | jq -rc '.UserPoolClientId')"
userPoolId="$(echo ${outputs} | jq -rc '.UserPoolId')"

export VUE_APP_AWS_USER_POOL_CLIENT_ID="${userPoolClient}"
export VUE_APP_AWS_USER_POOL_ID="${userPoolId}"
export VUE_APP_AWS_REGION="${AWS_DEFAULT_REGION}"

echo '--- Remember to create a user :)'
npm run serve
