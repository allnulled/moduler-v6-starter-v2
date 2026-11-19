{
  async detokenize(context) {
    const { token, state, index, compiler} = context;
    const innerCode = state.input.source.slice(...token.innerLocation);
    const innerParameters = state.constructor.evaluateJs(`return [${innerCode}];`);
    const targetsCollection = innerParameters[0];
    return { token, replacedBy: await compiler._wrapAsModulesCollection(targetsCollection, state.input.file.rootpath, context) };
  }
}