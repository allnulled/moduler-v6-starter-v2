module.exports = async function(file, { rootFile, DevBinaryV7, CompilerV7 }) {
  
  Std.classes.AnsiProfiles.as("silent").print(`[*] DevBinaryV7 reminds you that «@/dev2/reactors/live.js» is customizable in development-time.`);

  const picomatch = require("picomatch");
  const liveListeners = [{
    from: "@/dev/settings.js",
    do: function(file) {
      Std.classes.Printer.json(file);
    }
  }];
  
  Iterating_listeners:
  for(let index=0; index<liveListeners.length; index++) {
    const listener = liveListeners[index];
    
    if(picomatch.isMatch(file, listener.from)) {
      await listener.do(file, { listener, index, rootFile, DevBinaryV7, CompilerV7 });
    }
  }

  // @CUSTOMIZALO

};