function classicStringFormat(text, params = {}) {
  return text.replace(/\$\{([^}]+)\}/g, (match, expression) => {
    try {
      return (new Function(...Object.keys(params), "return " + expression))(...Object.values(params));
    } catch (error) {
      return match;
    }
  });
}