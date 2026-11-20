class DateFormatter {

  static symbols = {
    throwError: error => { throw error },
    defaultFormat: "YYYY/MM/dd hh:mm:ss.xxx",
  };

  static padLeft(data, spaces = 2, filler = "0") {
    const text = "" + data;
    return text.padStart(spaces, filler);
  }

  static formatDate(date = new Date(), options = {}) {
    const {
      onError = this.symbols.throwError,
      format = this.symbols.defaultFormat,
    } = options;
    if(!(date instanceof Date)) {
      return onError("Parameter «date» must be instance of Date on «DateFormatter.formatDate»");
    }
    let out = format;
    out = out.replace("YYYY", this.padLeft(date.getFullYear(), 4));
    out = out.replace("MM", this.padLeft(date.getMonth(), 2));
    out = out.replace("dd", this.padLeft(date.getDate(), 2));
    out = out.replace("hh", this.padLeft(date.getHours(), 2));
    out = out.replace("mm", this.padLeft(date.getMinutes(), 2));
    out = out.replace("ss", this.padLeft(date.getSeconds(), 2));
    out = out.replace("xxx", this.padLeft(date.getMilliseconds(), 3));
    return out;
  }

}