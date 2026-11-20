module.exports = function (file, { DevBinaryV7, CompilerV7, Std }) {
  const pathOf = {
    target: $moduler.rootdir,
    liveReactor: $moduler.normalizationOf("@/dev/reactors/live.js"),
    compileStdReactor: $moduler.normalizationOf("@/dev/reactors/compileStd.js"),
    compileCompilerV7: $moduler.normalizationOf("@/dev/reactors/compileCompilerV7.js"),
    compileDevBinaryV7: $moduler.normalizationOf("@/dev/reactors/compileDevBinaryV7.js"),
  };
  const requireFresh = Std?.functions.requireNewly || function (file) {
    delete require.cache[file];
    return require(file);
  };
  return [{
    from: "**/*",
    do: function (file) {
      const toucherFile = pathOf.liveReactor;
      const toucher = requireFresh(toucherFile);
      const rootFile = $moduler.rootdirOf(file);
      toucher(file, { rootFile, DevBinaryV7, CompilerV7 });
    }
  }, {
    from: "@/src/Std/**/*.{js,css,html}",
    do: (file) => {
      return requireFresh(pathOf.compileStdReactor)(file, {
        rootFile: $moduler.rootdirOf(file),
        DevBinaryV7,
        CompilerV7
      });
    },
  }, {
    from: "@/src/www/modules/CompilerV7/**/*.js",
    do: (file) => {
      return requireFresh(pathOf.compileCompilerV7)(file, {
        rootFile: $moduler.rootdirOf(file),
        DevBinaryV7,
        CompilerV7
      });
    },
  }, {
    from: "@/src/www/modules/DevBinaryV7/**/*.js",
    do: (file) => {
      return requireFresh(pathOf.compileDevBinaryV7)(file, {
        rootFile: $moduler.rootdirOf(file),
        DevBinaryV7,
        CompilerV7
      });
    },
  }];
};