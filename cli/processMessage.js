const { pipeline } = require("stream");
const fs = require("fs");
const path = require("path");

const { validateUserValue } = require("./validateUserValue");
const { getTransformStream } = require("./transformStream");

const handlerErrorReadStream = () => {
  console.error(`Error: input file not exists`);
  process.exit(1);
};

const handleErrorStream = (err) => console.error(err);

const processMessage = (options) => {
  const {
    isValidate,
    data: { input, output, shift, action },
  } = validateUserValue(options);

  if (isValidate) {
    const inputPath = path.resolve(`${__dirname}/${input}`);
    const outputPath = path.resolve(`${__dirname}/${output}`);

    const getReadStream = (input) =>
      input
        ? fs.createReadStream(inputPath).on("error", handlerErrorReadStream)
        : process.stdin;

    const getOutputStream = (output) =>
      output
        ? fs.createWriteStream(outputPath, { flags: "a" })
        : process.stdout;

    pipeline(
      getReadStream(input),
      getTransformStream(shift, action),
      getOutputStream(output),
      (err) => handleErrorStream(err)
    );
  }
};

module.exports = {
  processMessage,
};
