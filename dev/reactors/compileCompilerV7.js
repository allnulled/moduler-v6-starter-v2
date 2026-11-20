module.exports = async function(file, { rootFile, CompilerV7, DevBinaryV7 }) {
  Std.classes.AnsiProfiles.as("silent").print(`[*] CompilerV7 is being compiled...`);
  const compilation = await CompilerV7.compile("@/src/www/modules/CompilerV7/CompilerV7.entry.js");
  const outputation = await compilation.out.toDirectory("@/dist/www/external/CompilerV7", "compiler-v7.dist");
  Std.classes.AnsiProfiles.as("silent").print(`[*] CompilerV7 was compiled at: @/dist/www/external/CompilerV7/compiler-v7.dist.js`);
};