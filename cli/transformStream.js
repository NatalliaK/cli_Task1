const { Transform } = require("stream");

const MAX_UNICODE_UPPER_LETTER = 90;
const MIN_UNICODE_UPPER_LETTER = 65;
const MAX_UNICODE_LOWER_LETTER = 122;
const MIN_UNICODE_LOWER_LETTER = 97;
const LENGTH_ALPHABET = 26;

const makeCaesarCipher = (chunkData, shiftData, actionData) => {
  let remainderOfDivisionShift =
    Math.abs(shiftData) > 26 ? shiftData % LENGTH_ALPHABET : shiftData;

  let shift =
    actionData === "encode"
      ? remainderOfDivisionShift
      : remainderOfDivisionShift * -1;
  let newDataString = chunkData.toString();

  const handler = (match) => {
    let nextCodePoint = match.codePointAt(0) + shift;
    if (
      shift > 0 && // if new unicode value, where shift is greater than 0 doesn't include the meaning of English letters
      (nextCodePoint > MAX_UNICODE_LOWER_LETTER ||
        (nextCodePoint > MAX_UNICODE_UPPER_LETTER &&
          nextCodePoint < MIN_UNICODE_LOWER_LETTER))
    ) {
      nextCodePoint -= LENGTH_ALPHABET;
    }
    if (
      shift < 0 && // if new unicode value, where shift is less than 0 doesn't include the meaning of English letters
      (nextCodePoint < MIN_UNICODE_UPPER_LETTER ||
        (nextCodePoint > MAX_UNICODE_UPPER_LETTER &&
          nextCodePoint < MIN_UNICODE_LOWER_LETTER))
    ) {
      nextCodePoint += LENGTH_ALPHABET;
    }

    return String.fromCodePoint(nextCodePoint);
  };

  return newDataString.replace(/[a-zA-Z]{1}/g, handler); // find all matches of the English letters one letter at a time
};

const getTransformStream = (shift, action) => {
  return new Transform({
    transform(chunk, encoding, cb) {
      this.push(makeCaesarCipher(chunk, shift, action));
      cb();
    },
  });
};

module.exports = { getTransformStream };
