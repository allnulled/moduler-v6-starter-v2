#!/usr/bin/env node

const args = [...process.argv];

args.splice(0,2);

const command = [];
const parameters = [];

Extract_command_name:
for(let index=0; index<args.length; index++) {
  const arg = args[index];
  if(!arg.startsWith("-")) {
    command.push(arg);
  } else {
    parameters.push(...args.splice(index));
    break Extract_command_name;
  }
}

Find_global_parameters: {

}

const commandPath = `${__dirname}/run/${command.join("/")}/command.js`;

module.exports = (async function dev_run() {

  let utils, SecureCompiler;
  
  Preloads: {
    require(`${__dirname}/../dist/www/external/ModulerV6/moduler-v6.dist.js`);
    await require(`${__dirname}/../dist/www/external/Std/std-v2.dist.js`);
    utils = await require(`${__dirname}/utils/all.js`);
    SecureCompiler = utils.SecureCompiler;
  }

  console.log("[*] Running command: " + commandPath);
  
  const commandModule = require(commandPath);
  
  return typeof commandModule === "function" ? commandModule({
    command: command,
    parameters: parameters,
    utils: utils,
    SecureCompiler: SecureCompiler,
  }) : commandModule;

})();