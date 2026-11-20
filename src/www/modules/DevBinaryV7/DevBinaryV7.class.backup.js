class DevBinaryV7 {
  static utils = {
    findRootDirectoryFrom: $compiler.inject.source("./static.utils.findRootDirectoryFrom.js"),
  };
  static loop (optionsBrute = {}) {
  let options;
  const [info, silent] = Std.classes.AnsiProfiles.as(["info","silent"]);
  Define_options: {
    options = Object.assign({}, {
      target: null,
      reactors: [{
        from: "**/*",
        do: function(file) {
          console.log("[!] You should be setting manually the reactors for the DevBinaryV7.loop: [{from:string|[],do:function(file:string) => any");
        }
      }],
      // Server options:
      port: 4004,
      staticDirectory: "dist/www",
      staticUrlPrefix: "/",
      socketEvent: "filetouch",
      socketPayload: false,
    }, optionsBrute);
  }
  Validate_options: {
    $moduler.assert(typeof options.target === "string", `Required «options.target» to be string on «DevBinaryV7.loop»`);
    $moduler.assert(typeof options.target === "string", `Required «options.target» to be string on «DevBinaryV7.loop»`);
  }
  Start_watcher: {
    info.print("[*] DevBinaryV7 looping on: " + options.target);
    const watcher = require("chokidar").watch(options.target);
    watcher.on("change", (file) => this.touch(file, options));
    return { watcher };
    /*
    Std.externals.Refrescador.run({
      watch: [options.target],
      port: 4004,
      // Todas estas de selectores|reactores se eliminan:
      extensions: ["html", "css", "js"].concat(options.extensions),
      ignore: ["**node_modules**"],
      ignoreCallback: __dirname + "/ignorer.js",
      howeverListen: [],
      message: "El tiempo de refrescar ha llegado",
      messageFile: "TODO.md",
      execute: ["echo 'hello from the trigger'", "node program.js @{refrescador.file}"],
      executeCallback: ["file/from/cwd/target.js", ],
      basedir: __dirname,
      ////////////////////////////////////////////////////////
      // Y las de server se mantienen:
      payload: 'console.log("📟 Evento de refrescar activado");',
      payloadFile: 'browser-payload.js',
      serve: 'some/static/www',
      urlPrefix: 'subpath/on/server',
      staticPath: 'static/content',
      bulletproof: false,
      controllers: [__dirname + "/controller1.js"],
      debounce: 50,
      ...options,
    })
      //*/
  }
}
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
}