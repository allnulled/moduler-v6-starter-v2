function triggerFileCallbackIfExists(file, args = [], scope = false) {
  /**@:
   * 
   * # Std.functions.triggerFileCallbackIfExists
   * 
   * - Útil para unilinear hooks de clase.
   * - Recibe:
   *    - base:object|function|any - objeto del método a triggear
   *    - method:string - nombre del método a usar
   *    - args?:array - parámetros que pasarle
   *    - scope?:any - scope al que bindear
   * 
   */
  $compiler.inject.template("@/src/Std/snippets/methodLog.js", {name:"Std.functions.triggerFileCallbackIfExists"});
  let output = undefined;
  Running_file: {
    try {
      const moduleData = require($moduler.normalizationOf(file));
      if(typeof moduleData === "function") {
        if(scope) {
          return moduleData.call(scope, ...args);
        } else {
          return moduleData(...args);
        }
      }
    } catch (error) {
      if(error.code === "MODULE_NOT_FOUND") break Running_file;
      throw error;
    }
  }
  return output;
}