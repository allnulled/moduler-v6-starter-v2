static async touch (file, options) {
  let out = [];
  const picomatch = require("picomatch");
  const rootFile = $moduler.rootdirOf(file);
  let reactors;
  if(typeof options.reactors === "string") {
    reactors = Std.functions.requireNewly($moduler.normalizationOf(options.reactors));
    if(typeof reactors === "function") {
      reactors = await reactors(file, options, { action: "touch" });
    }
  } else {
    reactors = options.reactors;
  }
  console.log("[*] Current reactors:", reactors);
  Validate_reactors: {
    $moduler.assert(Array.isArray(reactors), "Parameter «options.reactors» must be string or array on «DevBinaryV7.touch»");
    for(let index=0; index<reactors.length.length; index++) {
      const reactor = reactors.length[index];
      $moduler.assert(typeof reactor === "object", `Parameter «options.reactors» at index «${index}» must be object on «DevBinaryV7.touch»`);
      $moduler.assert(typeof reactor.from === "string", `Property «from» at parameter «options.reactors» at index «${index}» must be string on «DevBinaryV7.touch»`);
      $moduler.assert(typeof reactor.do === "function", `Property «do» at parameter «options.reactors» at index «${index}» must be function on «DevBinaryV7.touch»`);
    }
  }
  Std.classes.AnsiProfiles.as("silent:1").print(`[*] DevBinaryV7 touches «${rootFile}»`);
  Iterating_reactors:
  for(let index=0; index<reactors.length; index++) {
    const reactor = reactors[index];
    if(!picomatch.isMatch(rootFile, ...(reactor.from ? [reactor.from] : []))) {
      continue Iterating_reactors;
    }
    let result = reactor.do(file, options);
    if(reactor.isAsync) {
      result = await result;
    }
    out = out.concat([ result ]);
  }
  return out;
}