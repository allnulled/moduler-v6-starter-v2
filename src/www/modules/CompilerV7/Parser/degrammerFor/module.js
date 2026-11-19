{
  async detokenize(context) {
    const { token, state, index, compiler} = context;
    const innerCode = state.input.source.slice(...token.innerLocation);
    const innerParameters = state.constructor.evaluateJs(`return [${innerCode}];`);
    const targetFileBrute = innerParameters[0];
    $moduler.assert(!targetFileBrute.startsWith("."), `Instruction «$compiler.inject.modules» does not accept relative paths due to historically demonstrated unnecessary misunderstandings`);
    const submoduler = compiler.moduler.cloneForFile(state.input.file.path);
    const replacement = await submoduler._readPath(targetFileBrute);
    return { token, replacedBy: compiler._wrapAsModule(replacement, targetFileBrute) };
  }
}