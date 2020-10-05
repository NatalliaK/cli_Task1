const errorMessages = {
  shift: "Entered shift value is not a number",
  action: 'Action name should be "encode" or "decode"',
  input: 'Input name should be correct string filename ("filename.txt")',
  output: 'Output name should be correct string filename ("filename.txt")',
};

const handlerValues = {
  shift: (value) => (typeof +value === "number" && ~~+value) || false, // check the value of the number type and remove fractional part
  action: (value) =>
    value === "encode" ? "encode" : value === "decode" ? "decode" : false,
  input: (value) => (!!~value.lastIndexOf(".txt") ? value : undefined), // if file name exists .txt return filename
  output: (value) => (!!~value.lastIndexOf(".txt") ? value : undefined), // if file name exists .txt return filename
};

const validateUserValue = (data) => {
  let validateData = { isValidate: false, data: {} };
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      let value = handlerValues[key](data[key]);
      if (!value) {
        console.error(errorMessages[key]);
        return validateData;
      } else {
        validateData.data[key] = value;
      }
    }
  }
  validateData.isValidate = true;
  return validateData;
};

module.exports = { validateUserValue };
