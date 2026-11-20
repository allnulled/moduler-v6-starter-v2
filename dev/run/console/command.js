module.exports = function() {
  const PATH_OF = {
    CONSOLE_FILE: $moduler.normalizationOf("@/dev/console.js"),
    ON_OPEN_FILE: $moduler.normalizationOf("@/dev/run/console/onOpen.js"),
    ON_CLOSE_FILE: $moduler.normalizationOf("@/dev/run/console/onClose.js"),
    ON_EXECUTE_FILE: $moduler.normalizationOf("@/dev/run/console/onExecute.js"),
    ON_EXECUTED_FILE: $moduler.normalizationOf("@/dev/run/console/onExecuted.js"),
  };
  const requireFresh = (file) => {
    delete require.cache[file];
    return require(file);
  };
  const requireFreshFromSource = async (file, locals = {}) => {
    const source = await require("fs").promises.readFile(file, "utf8");
    const callback = new ((async function() {}).constructor)(...Object.keys(locals), source);
    return await callback(...Object.values(locals));
  };
  requireFresh(PATH_OF.ON_OPEN_FILE);
  require("chokidar").watch(PATH_OF.CONSOLE_FILE).on("change", async function(event, file) {
    console.log("[*] Running console command from: @/dev/console.js");
    try {
      await requireFresh(PATH_OF.ON_EXECUTE_FILE);
      await requireFresh(PATH_OF.CONSOLE_FILE, {
        require: require,
        __dirname: $moduler.normalizationOf("@/dev"),
        __filename: $moduler.normalizationOf("@/dev/console.js"),
      });
      await requireFresh(PATH_OF.ON_EXECUTED_FILE);
    } catch (error) {
      console.log(`[!] Errors running console command:`, error);
    }
  });
  process.on("exit", () => requireFresh(PATH_OF.ON_CLOSE_FILE));
}