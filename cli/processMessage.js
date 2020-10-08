const { pipeline } = require("stream");
const fs = require("fs");
const path = require("path");

const { validateUserValue } = require("./validateUserValue");
const { getTransformStream } = require("./transformStream");

const handleErrorStream = (err) => process.exit(1);

const processMessage = (options) => {
  const {
    isValidate,
    data: { input, output, shift, action },
  } = validateUserValue(options);

  if (isValidate) {
    const getReadStream = (input) => {
      const inputPath = path.resolve(`${__dirname}/${input}`);

      return new Promise((res, rej) => {
        if (input) {
          fs.access(inputPath, fs.constants.R_OK, (err) => {
            if (err) {
              console.error(
                `You can't read this input file: ${inputPath} or this file isn't exist`
              );
              process.exit(1);
              rej(err);
            }
            res(fs.createReadStream(inputPath));
          });
        } else res(process.stdin);
      });
    };

    const getOutputStream = (output) => {
      const outputPath = path.resolve(`${__dirname}/${output}`);

      return new Promise((res, rej) => {
        if (output) {
          fs.access(outputPath, fs.constants.W_OK, (err) => {
            if (err) {
              console.error(
                `You can't write this output file: ${outputPath} or this file isn't exist`
              );
              process.exit(1);
              rej(err);
            }
            res(fs.createWriteStream(outputPath, { flags: "a" }));
          });
        } else res(process.stdout);
      });
    };

    Promise.all([getReadStream(input), getOutputStream(output)])
      .then((streamObjects) => {
        const [readStream, writeStream] = streamObjects;
        pipeline(
          readStream,
          getTransformStream(shift, action),
          writeStream,
          (err) => handleErrorStream(err)
        );
      })
      .catch((err) => handleErrorStream(err));
  }
};

module.exports = {
  processMessage,
};
