module.exports = class SecureCompiler {

  static async resolveInjections(originalFile) {
    const source = await require("fs").promises.readFile($moduler.normalizationOf(originalFile), "utf8");
    const submoduler = $moduler.cloneForFile(originalFile);
    let out = source;
    Compile_sources: {
      const regex = /\$compiler\.inject\.source\("([^"]+)"\)/g;
      const matches = [...source.matchAll(regex)];
      for (const match of matches.reverse()) {
        const target = match[1];
        const targetFile = submoduler.normalizationOf(target);
        const result = await this.resolveInjections(targetFile);
        out = out.slice(0, match.index) + result + out.slice(match.index + match[0].length);
      }
    }
    Remove_templates_and_modules: {
      out = out.replace(/\$compiler\.inject\.(modules|module|template)\(([^)]+)\)/g, "");
    }
    return out;
  }

}