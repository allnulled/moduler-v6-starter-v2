static async touch (file, options) {
  let out = [];
  const picomatch = require("picomatch");
  const reactors = options.reactors;
  const rootFile = $moduler.rootdirOf(file);
  Std.classes.AnsiProfiles.as("silent:1").print(`[*] DevBinaryV7 touches «${rootFile}»`);
  Iterating_reactors:
  for(let index=0; index<reactors.length; index++) {
    const reactor = reactors[index];
    if(!picomatch.isMatch(rootFile, reactor.from)) {
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