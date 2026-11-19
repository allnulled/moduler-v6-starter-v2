class CompilerV7 {

  static {
    $moduler.toolkit.makeClass([
      {
        static: {

          //////////////////////////////////
          // COMPILERV7 PUBLIC STATIC API //
          //////////////////////////////////
          
          get globalInstance() { return this._globalInstance = this._globalInstance || new this({ moduler: $moduler }); },
          compile(...args) { return this.globalInstance.compile(...args); },
          cloneForFile(...args) { return this.globalInstance.cloneForFile(...args); },
          cloneForDirectory(...args) { return this.globalInstance.cloneForDirectory(...args); },
          parse(...args) { return this.globalInstance.parse(...args); },
          parseTemplate(...args) { return this.globalInstance.parseTemplate(...args); },
          parseForm(...args) { return this.globalInstance.parseForm(...args); },
          compile(...args) { return this.globalInstance.compile(...args); },
          compileSource(...args) { return this.globalInstance.compileSource(...args); },
          compileTemplate(...args) { return this.globalInstance.compileTemplate(...args); },
          compileTemplateSource(...args) { return this.globalInstance.compileTemplateSource(...args); },

        },
        prototype: {

          ////////////////////////////
          // COMPILERV7 PRIVATE API //
          ////////////////////////////

          _parser: $compiler.inject.source("@/src/www/modules/CompilerV7/Parser/CompilerV7Parser.object.js"),
          _classes: {
            CompilationOutput: $compiler.inject.source("@/src/www/modules/CompilerV7/classes/CompilationOutput/CompilationOutput.class.js"),
            CompilationState: $compiler.inject.source("@/src/www/modules/CompilerV7/classes/CompilationState/CompilationState.class.js"),
          },
          _degrammerFor: {
            "inject": {
              source: $compiler.inject.source("@/src/www/modules/CompilerV7/Parser/degrammerFor/source.js"),
              string: $compiler.inject.source("@/src/www/modules/CompilerV7/Parser/degrammerFor/string.js"),
              plain: $compiler.inject.source("@/src/www/modules/CompilerV7/Parser/degrammerFor/plain.js"),
              template: $compiler.inject.source("@/src/www/modules/CompilerV7/Parser/degrammerFor/template.js"),
              action: $compiler.inject.source("@/src/www/modules/CompilerV7/Parser/degrammerFor/action.js"),
              module: $compiler.inject.source("@/src/www/modules/CompilerV7/Parser/degrammerFor/module.js"),
              modules: $compiler.inject.source("@/src/www/modules/CompilerV7/Parser/degrammerFor/modules.js"),
            },
            "template": {
              value: $compiler.inject.source("@/src/www/modules/CompilerV7/Parser/degrammerFor/template.value.js"),
              block: $compiler.inject.source("@/src/www/modules/CompilerV7/Parser/degrammerFor/template.block.js"),
            },
            "form": {
              control: $compiler.inject.source("@/src/www/modules/CompilerV7/Parser/degrammerFor/form.control.js"),
            },
            "plain": {
              undefined: {
                detokenize({ token }) {
                  return { token };
                }
              }
            }
          },
          _compileTokens: async function (tokens, { options, source, file }, rootState = null) {
            let fileExtension, state;
            Initialize_state: {
              fileExtension = require("path").extname(file);
              state = this._classes.CompilationState.create({
                input: {
                  file: {
                    path: file,
                    rootpath: this.moduler.rootdirOf(file),
                  },
                  source: source,
                  tokens: tokens,
                  options: options,
                },
                memory: {
                  textIndex: 0,
                  tokenization: [],
                  fileExtension: fileExtension,
                  fileChannel: `~${fileExtension}`,
                  detokenization: [],
                },
                output: this._classes.CompilationOutput.create({
                  channel: {},
                }, { from: "compileTokens" }),
              }, { from: "compileTokens" });
              state.memory.currentChannel = state.memory.fileChannel;
              state.output.channel[state.memory.currentChannel] = { content: "" };
            }
            Degramme_tokens:
            for (let index = 0; index < tokens.length; index++) {
              const token = tokens[index];
              $moduler.assert(token.grammar in this._degrammerFor, `Missing degrammer for «${token.grammar}» grammar on «CompilerV7.prototype._compileTokens»`);
              const degrammer = this._degrammerFor[token.grammar][token.operation];
              const detoken = await degrammer.detokenize({ token, state, index, compiler: this, });
              state.addDetoken({ ...detoken, token });
            }
            Formalize_output: {
              for (let index = 0; index < state.memory.detokenization.length; index++) {
                const detoken = state.memory.detokenization[index];
                state.appendToChannel(null, detoken.replacedBy || source.slice(...detoken.token.outerLocation));
              }
            }
            return { in: state.input, out: state.output, memory: state.memory, };
          },
          _compileSource: async function (source, file, options = {}, rootState = null) {
            $moduler.assert(typeof source === "string", "Parameter «source» must be string on «CompilerV7.prototype._compileSource»");
            $moduler.assert(typeof file === "string", "Parameter «file» must be string on «CompilerV7.prototype._compileSource»");
            const tokens = this._parser.parse(source);
            return await this._compileTokens(tokens, { options, source, file }, rootState);
          },
          _compileFile: async function (fileBrute, options = {}, rootState = null) {
            $moduler.assert(typeof fileBrute === "string", "Parameter «file» must be string on «CompilerV7.prototype._compileFile»");
            const file = this.moduler.normalizationOf(fileBrute);
            const source = await require("fs").promises.readFile(file, "utf8");
            return await this._compileSource(source, file, options, rootState);
          },

          // TEMA TEMPLATES:
          _compileTemplateSource: async function (templateSource, file, parameters = {}, options = {}, rootState = null) {
            $moduler.assert(typeof templateSource === "string", "Parameter «templateSource» must be string on «CompilerV7.prototype._compileTemplate»");
            $moduler.assert(typeof file === "string", "Parameter «file» must be string on «CompilerV7.prototype._compileTemplate»");
            let newSource = "";
            Digest_template: {
              const tokens = this.parseTemplate(templateSource);
              const sourceFactorySource = this._generateTemplateFunctionSourceFromTokens(tokens, templateSource);
              const sourceFactory = new (async function() {}.constructor)(...Object.keys(parameters), sourceFactorySource);
              newSource = await sourceFactory(...Object.values(parameters));
            }
            return await this._compileSource(newSource, file, options, rootState);
          },
          _compileTemplateFile: async function (fileBrute, parameters = {}, options = {}, rootState = null) {
            $moduler.assert(typeof fileBrute === "string", "Parameter «file» must be string on «CompilerV7.prototype._compileTemplateFile»");
            $moduler.assert(typeof options === "object", "Parameter «options» must be object on «CompilerV7.prototype._compileTemplateFile»");
            $moduler.assert(typeof rootState === "object", "Parameter «file» must be string on «CompilerV7.prototype._compileTemplateFile»");
            const file = this.moduler.normalizationOf(fileBrute);
            const source = await require("fs").promises.readFile(file, "utf8");
            return await this._compileTemplateSource(source, file, parameters, options, rootState);
          },
          _generateTemplateFunctionSourceFromTokens(tokens, templateSource) {
            let out = "";
            out += "  const __output = [];\n";
            for (const token of tokens) {
              const [start, end] = token.innerLocation || token.outerLocation;
              switch (token.operation) {
                case "block": {
                  out += templateSource.slice(start, end) + "\n";
                  break;
                }
                case "value": {
                  out += `__output.push(String(${templateSource.slice(start, end)} ?? ""));\n`;
                  break;
                }
                default: {
                  out += `__output.push(${JSON.stringify(templateSource.slice(start, end))});\n`;
                  break;
                }
              }
            }
            out += "  return __output.join('');\n";
            return out;
          },
          _wrapAsModule(source, rootpath, modulerVarname = "$moduler") {
            return [
              `(function({ module, exports, $localModuler }) {`,
              `  return ${modulerVarname}.releaseFile("${rootpath}", arguments[0], (function() {`,
              `    ${source}`,
              `  }).call(this));`,
              `}).call(this, ${modulerVarname}.reserveFile("${rootpath}"))`,
            ].join("\n");
          },
          async _wrapAsModulesCollection(collection, rootpath, context, modulerVarname = "$moduler") {
            const { compiler, state } = context;
            const submoduler = compiler.moduler.cloneForFile(state.input.file.path);
            let out = "";
            if(Array.isArray(collection)) {
              for(let index=0; index<collection.length; index++) {
                const file = collection[index];
                if(index !== 0) out += ",\n";
                const content = await submoduler._readPath(file);
                out += this._wrapAsModule(content, rootpath, context, modulerVarname);
              }
              out = `Promise.all([\n${out}\n])`;
            } else if(typeof collection === "object") {
              for(let prop in collection) {
                const file = collection[index];
                if(index !== 0) out += ",\n";
                const content = await submoduler._readPath(file);
                out += `  ${prop}: ${this._wrapAsModule(content, rootpath, context, modulerVarname)}`;
              }
              out = `Promise.fromObject({ \n${out}\n })`;
            } else throw new Error("Parameter «collection» must be array or object on syntax «$compiler.inject.modules»");
            return out;
          },
          _stringifyAsReadableJs(text) {
            let out = "";
            const lines = text.split("\n");
            for(let index=0; index<lines.length; index++) {
              const line = lines[index];
              if(index !== 0) out += "\n  + ";
              out += JSON.stringify(line + "\n");
            }
            return out;
          },

          ///////////////////////////
          // COMPILERV7 PUBLIC API //
          ///////////////////////////

          cloneForFile(targetFile) {
            return new this.constructor({ moduler: $moduler.cloneForFile(targetFile), });
          },
          cloneForDirectory(targetFile) {
            return new this.constructor({ moduler: $moduler.cloneForFile(require("path").dirname(targetFile)), });
          },
          parse(text, options = {}) {
            return this._parser.parse(text, { ...options, startRule: "cv7_main_language", });
          },
          parseTemplate(text, options = {}) {
            return this._parser.parse(text, { ...options, startRule: "cv7_templates_language", });
          },
          parseForm(text, options = {}) {
            return this._parser.parse(text, { ...options, startRule: "cv7_forms_language", });
          },
          compile(...args) {
            return this._compileFile(...args);
          },
          compileSource(...args) {
            return this._compileSource(...args);
          },
          compileTemplate(...args) {
            return this._compileTemplateFile(...args);
          },
          compileTemplateSource(...args) {
            return this._compileTemplateSource(...args);
          },

        },
      }
    ], this);
  }

  constructor(defaultOptions = {}) {
    Object.assign(this, {}, this.constructor.defaultInstance, defaultOptions);
  }

}