module.exports = (async function () {
  Load_Std: {
    // $moduler.import("@/dist/www/external/Std/std-v2.dist.js")
    await $moduler.import("@/dist/www/external/Std/std-v2.dist.backup-19-002.js");
  }
  Load_CompilerV7: {
    globalThis.CompilerV7 = await $moduler.import("@/dist/www/external/CompilerV7/compiler-v7.dist.js");
  }
  Load_DevBinaryV7: {
    globalThis.DevBinaryV7 = await $moduler.import("@/dist/www/external/DevBinaryV7/dev-binary-v7.dist.js");
  }
})();