class Printer {

  static describe(object) {
    const properties = {};
    for (const key of Reflect.ownKeys(object)) {
      const descriptor = Object.getOwnPropertyDescriptor(object, key);
      const item = {
        type: "property",
        enumerable: descriptor.enumerable,
        configurable: descriptor.configurable
      };
      if ("value" in descriptor) {
        const value = descriptor.value;
        if (typeof value === "function") {
          item.type = "method";
          item.name = value.name || null;
          item.source = Function.prototype.toString.call(value);
        } else {
          item.value = value;
          if (typeof value === "object" && value !== null) {
            item.value = Object.prototype.toString.call(value);
          }
        }
        item.writable = descriptor.writable;
      } else {
        item.type = "accessor";
        if (descriptor.get) {
          item.get = Function.prototype.toString.call(descriptor.get);
        }
        if (descriptor.set) {
          item.set = Function.prototype.toString.call(descriptor.set);
        }
      }
      properties[typeof key === "symbol" ? key.toString() : key] = item;
    }
    return properties;
  }

  static describeClass(target) {
    const result = {
      name: target.name || null,
      static: {},
      prototype: {},
      inheritance: []
    };
    // ------------------------------------------------------------
    // 1. Static properties
    // ------------------------------------------------------------
    result.static = this.describe(target);
    // ------------------------------------------------------------
    // 2. Prototype properties
    // ------------------------------------------------------------
    if (target.prototype) {
      result.prototype = this.describe(target.prototype);
    }
    // ------------------------------------------------------------
    // 3. Inheritance
    // ------------------------------------------------------------
    let current = Object.getPrototypeOf(target);
    while (current && current !== Function.prototype) {
      result.inheritance.push({
        name: current.name || null,
        static: this.describe(current),
        prototype: current.prototype
          ? this.describe(current.prototype)
          : null
      });
      current = Object.getPrototypeOf(current);
    }
    return result;
  }

  static debugClass(target) {
    return console.log(this.describeClass(target));
  }

  static debug(...args) {
    /**@:
     * 
     * # Std.all.Printer.debug
     * 
     * - Acepta cualquier parámetro
     * - Imprime normal el índice, el tipo y el valor
     * 
     */
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      console.log(index + ": " + typeof arg, arg);
    }
  }
  static json(...args) {
    /**@:
     * 
     * # Std.all.Printer.json
     * 
     * - Acepta cualquier parámetro
     * - Imprime por json si puede, si no como Printer.debug
     * 
     */
    for (let index = 0; index < args.length; index++) {
      const arg = args[index];
      try {
        console.log(index + ": " + typeof arg, Std.classes.JsonStringifier.stringify(arg, 2));
      } catch (error) {
        console.log(`[!] Could not stringify due to: ${error.name} ${error.message}`);
        console.log(index + ": " + typeof arg, arg);
      }
    }
  }

  static {
    Object.assign(this, {
      // Esto es una guarrada pero no sé si se puede hacer de otra manera mejor
      exiting: false,
      currentQuestion: null,
      questionsCloser() {
        this.exiting = true;
        if (this.currentQuestion) {
          this.currentQuestion.close();
          this.currentQuestion = null;
        }
      },
      async ask(question, options = {}, ...others) {
        /**@:
         * 
         * # Std.classes.Printer.ask(question=string,options={},...others=[])
         * 
         * - Async function
         * - Pregunta al usuario por consola, parando la ejecución con await hasta que responda o se interrumpa el proceso
         * - Tiene una historieta para que si se interrumpe el proceso, que pasa con refrescador todo el rato, salga de las llamadas que se van a acumular de golpe al soltar.
         *    - Quiero decir, que hay una casuística que justifica
         * 
         */
        if (this.exiting) {
          throw new Error("Process exiting");
        }
        this.debug(...others);
        const rl = require("readline").promises.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        this.currentQuestion = rl;
        try {
          if (this.exiting) {
            throw new Error("Process exiting");
          }
          return await rl.question(question);
        } catch (error) {
          if (error.code === "ABORT_ERR") {
            this.exiting = true;
            return;
          }
          throw error;
        } finally {
          if (this.currentQuestion === rl) {
            this.currentQuestion = null;
          }
          rl.close();
        }
      }
    });
    if (Std.classes.Environmenter.isNodejs) {
      process.once("SIGINT", this.questionsCloser);
      process.once("SIGTERM", this.questionsCloser);
    }
  }

  static log(out, ...args) {
    Printer.json(out, ...args);
    return args.length ? args[args.length - 1] : out;
  }

  static return = this.log;

  static die(...args) {
    Std.classes.Printer.json(args);
    process.exit(0);
  }

}