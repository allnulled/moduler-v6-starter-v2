function requireNewly(file) {
  const normalized = require("path").resolve(file);
  delete require.cache[normalized];
  return require(normalized);
}