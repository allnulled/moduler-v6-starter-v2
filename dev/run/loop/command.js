module.exports = async function main({ DevBinaryV7 }) {
  
  const {
    Printer,
    AnsiProfiles,
    ModuleLoader,
  } = Std.all;

  const [error,success,info,silent] = AnsiProfiles.asList(["error","success","info","silent"]);

  success.print("[*] Process started.");
  success.print("[*] Process finished.");

  console.log(DevBinaryV7);

  DevBinaryV7.loop({
    target: $moduler.rootdir,
    reactors: "@/dev/reactors/all.js",
  });

};