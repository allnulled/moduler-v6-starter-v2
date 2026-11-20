module.exports = $moduler.import([
  "@/dist/www/external/CompilerV7/compiler-v7.dist.js",
], function() {
  return Std.all.DevBinaryV7 = Std.classes.DevBinaryV7 = $compiler.inject.source("./DevBinaryV7.class.js");
});