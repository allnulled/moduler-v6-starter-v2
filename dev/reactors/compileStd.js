module.exports = async function(file, { rootFile, CompilerV7, DevBinaryV7 }) {
  Std.classes.AnsiProfiles.as("silent").print(`[*] CompilerV7 compiles «Std» due to changes on «${rootFile}»`);
  const compilation = await CompilerV7.compile("@/src/Std/Std.entry.js");
  console.log(compilation.out.toDirectory("dist/www/external/Std", "std-v2.dist"));
};