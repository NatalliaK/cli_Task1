#!/usr/bin/env node
const { program } = require("commander");
const { processMessage } = require("./processMessage");

program
  .storeOptionsAsProperties(false)
  .passCommandToAction(false)
  .version("0.0.1", "-v, --version")
  .description("Caesar cipher for the English alphabet");

program
  .requiredOption("-s, --shift <shift>", "a shift")
  .option("-i, --input <input>", "an input file")
  .option("-o, --output <output>", "an output file")
  .requiredOption("-a, --action <action>", "an action encode / decode")
  .action((args) => processMessage(args));

program.parse(process.argv);
