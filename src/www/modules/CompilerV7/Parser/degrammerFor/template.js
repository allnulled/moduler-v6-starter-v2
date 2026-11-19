{
  async detokenize({ token, state, index, compiler}) {
    const innerCode = state.input.source.slice(...token.innerLocation);
    const innerParameters = state.constructor.evaluateJs(`return [${innerCode}];`);
    const targetFileBrute = innerParameters[0];
    let replacement = "";
    let templateSource = null;
    Step_1_renderizar_plantilla: {
      const subcompiler = compiler.cloneForFile(state.input.file.path);
      Compilar_plantilla: {
        const templateCompilation = await subcompiler._compileTemplateFile(targetFileBrute, innerParameters[1]);
        // @ATENCION: solo se transmite el canal activo original:
        templateSource = templateCompilation.out.channel[state.memory.fileChannel].content;
      }
      Compilar_fuente_resultante: {
        const compilation = await subcompiler._compileSource(templateSource, state.input.file.path);
        replacement = compilation.out.channel[state.memory.fileChannel].content;
      }
    }
    return { token, replacedBy: replacement };
  }
}