class CmdFormatter {

  static fromArgumentsListToProperties(list = process.argv.slice(2)) {
    const out = {};
    let key = "_";
    for (const arg of list) {
      if (/^--?[^-]/.test(arg)) {
        out[arg] = true;
      } else if (/^-?[^-]/.test(arg)) {
        out[arg] = true;
      } else {
        (out[key] = out[key] === true ? arg : [].concat(out[key] || [], arg));
      }
    }
    return out;
  }

  static fromPropertiesToArgumentsText(list = process.argv) {
    return list.map(argument => {
      const value = String(argument);

      if (value === "") return '""';

      if (!/[\s"'\\]/.test(value)) {
        return value;
      }

      return `"${value.replace(/(["\\])/g, "\\$1")}"`;
    }).join(" ");
  }

  static fromArgumentsTextToProperties(text = "") {
    const args = [];
    let value = "";
    let quote = null;
    let escaped = false;
    let started = false;

    for (let index = 0; index < text.length; index++) {
      const char = text[index];

      if (escaped) {
        value += char;
        escaped = false;
        started = true;
        continue;
      }

      if (char === "\\" && quote !== "'") {
        escaped = true;
        started = true;
        continue;
      }

      if (quote) {
        if (char === quote) {
          quote = null;
        } else {
          value += char;
        }

        continue;
      }

      if (char === '"' || char === "'") {
        quote = char;
        started = true;
        continue;
      }

      if (/\s/.test(char)) {
        if (started) {
          args.push(value);
          value = "";
          started = false;
        }

        continue;
      }

      value += char;
      started = true;
    }

    if (escaped) {
      value += "\\";
    }

    if (quote) {
      throw new SyntaxError(`Unclosed quote: ${quote}`);
    }

    if (started) {
      args.push(value);
    }

    return args;
  }

}