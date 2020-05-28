class StackOutputDescriber {
  constructor(cloudformation) {
    this.cloudformation = cloudformation;
  }

  async queryAll(stackNames = []) {
    const stackOutputs = await Promise.all(
      stackNames.map((stackName) => this.queryStack(stackName))
    );

    const listOfOutputs = stackOutputs.flatMap((stackOutput) => [
      ...stackOutput,
    ]);

    let allOutputs = {};
    for (const output of listOfOutputs) {
      allOutputs = {
        ...allOutputs,
        ...output,
      };
    }

    return allOutputs;
  }

  async queryStack(stackName) {
    const stacks = await this.cloudformation
      .describeStacks({ StackName: stackName })
      .promise();

    if (!stacks.Stacks || !stacks.Stacks[0].Outputs) {
      throw new Error(`Stack ${stackName} does not have outputs`);
    }

    return stacks.Stacks[0].Outputs.map((output) => {
      return { [output.OutputKey]: output.OutputValue };
    });
  }
}

module.exports = StackOutputDescriber;
