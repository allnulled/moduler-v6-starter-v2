
(async function main() {
  
  require(`${__dirname}/../dist/www/external/ModulerV6/moduler-v6.dist.js`);
  const path = require("path");
  //const Std = await require(`${__dirname}/../dist/src/Std/std-dev2.dist.js`);
  const Std = await require(`${__dirname}/../dist/www/external/Std/std-v2.dist.backup-19-11-2026.js`);
  const {
    Printer,
    AnsiProfiles,
    ModuleLoader,
  } = Std.all;

  const [error,success,info,silent] = AnsiProfiles.asList(["error","success","info","silent"]);

  const CompilerV7 = await ModuleLoader.load("CompilerV7");
  const DevBinaryV7 = await ModuleLoader.load("DevBinaryV7");

  success.print("[*] Process started.");
  success.print("[*] Process finished.");

  DevBinaryV7.loop({
    target: require("path").resolve(__dirname, ".."),
    reactors: [{
      from: "**/*",
      do: function(file) {
        const toucherFile = `${__dirname}/reactors/all.js`;
        const toucher = Std.functions.requireNewly(toucherFile);
        const rootFile = $moduler.rootdirOf(file);
        toucher(file, { rootFile, DevBinaryV7, CompilerV7 });
      }
    }, {
      from: "@/src/Std/**/*.{js,css,html}",
      do: (file) => {
        return Std.functions.requireNewly(`${__dirname}/reactors/compileStd.js`)(file, {
          rootFile: $moduler.rootdirOf(file),
          DevBinaryV7,
          CompilerV7
        });
      },
    }]
  });

})();