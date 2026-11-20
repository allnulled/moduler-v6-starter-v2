module.exports = async function(file, { rootFile, CompilerV7, DevBinaryV7 }) {
  Std.classes.AnsiProfiles.as("silent").print(`[*] DevBinaryV7 is being compiled...`);
  const compilation = await CompilerV7.compile("@/src/www/modules/DevBinaryV7/DevBinaryV7.entry.js");
  const outputation = await compilation.out.toDirectory("dist/www/external/DevBinaryV7", "dev-binary-v7.dist");
  Std.classes.AnsiProfiles.as("silent").print(`[*] DevBinaryV7 was compiled at: @/dist/www/external/DevBinaryV7/dev-binary-v7.dist.js`);
};