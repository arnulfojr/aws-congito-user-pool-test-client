#!/usr/bin/env node
const AWS = require("aws-sdk");

if (process.env.DEBUG || process.env.NODE_ENV === "develop") {
  AWS.config.logger = console;
}

const cloudformation = new AWS.CloudFormation();

async function queryStack(stackName) {
  const stacks = await cloudformation
    .describeStacks({ StackName: stackName })
    .promise();

  if (!stacks.Stacks || !stacks.Stacks[0].Outputs) {
    throw new Error(`Stack ${stackName} does not have outputs`);
  }

  return stacks.Stacks[0].Outputs.map((output) => {
    return { [output.OutputKey]: output.OutputValue };
  });
}

async function queryAll(stackNames = []) {
  const stackOutputs = await Promise.all(
    stackNames.map((stackName) => queryStack(stackName))
  );

  const listOfOutputs = stackOutputs.flatMap((stackOutput) => [...stackOutput]);

  let allOutputs = {};
  for (const output of listOfOutputs) {
    allOutputs = {
      ...allOutputs,
      ...output,
    };
  }

  console.log(JSON.stringify(allOutputs));
}

queryAll([
  process.env.CDK_STACK_NAME
]).catch((err) => console.error(JSON.stringify(err)));
