const secureBoot = 1;

if (secureBoot) {
  module.exports = async function (file, { rootFile, CompilerV7, DevBinaryV7 }) {
    const { AnsiProfiles, Performancer2 } = Std.all;
    let compilation, outputation;
    AnsiProfiles.as("silent").print(`[*] Std is being compiled...`);
    Compilation: {
      compilation = await CompilerV7.compile("@/src/Std/Std.entry.js");
    }
    Output: {
      outputation = await compilation.out.toDirectory("dist/www/external/Std", "std-v2.dist");
    }
    AnsiProfiles.as("silent").print(`[*] Std was compiled at: @/dist/www/external/Std/std-v2.dist.js`);
  };
} else {
  module.exports = async function (file, { rootFile, CompilerV7, DevBinaryV7 }) {
    const { AnsiProfiles, Performancer2 } = Std.all;
    const performancer = Performancer2.create("@/dev/reactors/compileStd.js");
    let compilation, outputation;
    performancer.start("Started Std compilation process");
    AnsiProfiles.as("silent").print(`[*] Std is being compiled...`);
    Compilation: {
      const subperformancer = performancer.subcreate("compilation").start("Started compilation of Std.entry");
      compilation = await CompilerV7.compile("@/src/Std/Std.entry.js", { performancer: subperformancer });
      subperformancer.stop("Finished compilation of Std.entry");
    }
    Output: {
      const subperformancer = performancer.subcreate("output").start("Started writing output of compilation");
      outputation = await compilation.out.toDirectory("dist/www/external/Std", "std-v2.dist");
      subperformancer.stop("Finished writing output of compilation");
    }
    AnsiProfiles.as("silent").print(`[*] Std was compiled at: @/dist/www/external/Std/std-v2.dist.js`);
    performancer.stop("Finished Std compilation process").report.printSummary1();
  };
}