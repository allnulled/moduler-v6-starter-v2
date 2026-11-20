module.exports = async function compileCommand({ parameters, CompilerV7, SecureCompiler }) {
  
  const {
    Printer,
    AnsiProfiles,
    ModuleLoader,
  } = Std.all;

  const [error,success,info,silent] = AnsiProfiles.asList(["error","success","info","silent"]);

  const targets = require($moduler.normalizationOf("@/dev/run/compile/targets.js"));

  const targetIds = Object.keys(targets).sort((a, b) => {
    return b > a ? 1 : 0;
  });
  if(!targetIds.length) return AnsiProfiles.as("silent").print(`[*] Dev command «compile» did not find any target.`);

  AnsiProfiles.as("silent").print(`[*] Dev command «compile» found ${targetIds.length} targets:\n  - ${targetIds.join("\n  - ")}`);

  for(let index=0; index<targetIds.length; index++) {
    const id = targetIds[index];
    const target = targets[id];
    AnsiProfiles.as("silent").print(`[*] Compiling target ${index+1} out of ${targetIds.length}: ${target.name}`);
    $moduler.assert(typeof target.name === "string", "Target requires name as string");
    $moduler.assert(typeof target.input === "string", "Target requires input as string");
    $moduler.assert(typeof target.output === "string", "Target requires output as string");
    if(target.isCompilationTool) {
      const content1 = await require("fs").promises.readFile($moduler.normalizationOf(target.input));
      const content2 = await SecureCompiler.resolveInjections(target.input, $moduler.rootdir);
      await require("fs").promises.writeFile($moduler._joinPaths([target.output, target.name + ".js"]), content2, "utf8");
    } else {
      const CompilerV7 = await $moduler.import("@/dist/www/external/CompilerV7/compiler-v7.dist.js");
      const compilation = await CompilerV7.compile(target.input);
      AnsiProfiles.as("silent").print(`[*] Writing compiled output at: ${target.output}/${target.name}.js`);
      await compilation.out.toDirectory(target.output, target.name);
    }
  }

  //console.log(output);

};