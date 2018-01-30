import FormControl from './Control';
import ControlLabel from './Label';
import FormGroup from './Group';
import Form from './Form';

const validate = formId => {
  // const form = document.getElementsByName(formName);
  const fields = document.getElementById(formId).getElementsByTagName('input');
  console.log(fields);

  return formId;
};

const validateField = (value, validators) => {
  let errMsg = '';
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;

  for (let validator in validators) {
    if (validators.hasOwnProperty(validator)) {
      switch (validator) {
        case 'email':
          if (emailRegex.test(value)) {
            errMsg = '';
          } else {
            errMsg = 'Please enter valid email address';
          }
          break;
        case 'password':
          if (value.length > 5) {
            errMsg = 'Password length must be more than 5';
          } else if (value === '') {
            errMsg = 'Password must not be blank';
          } else {
            errMsg = '';
          }
          break;
        case 'required':
          if (value === '') {
            errMsg = 'Please fill out this field';
          } else {
            errMsg = '';
          }
          break;
        case 'minLength':
          if (value.length > validators[validator]) {
            errMsg = '';
          } else {
            errMsg = `Min length must be more than ${validators[validator]}`;
          }
          break;
        case 'maxLength':
          if (value.length < validators[validator]) {
            errMsg = '';
          } else {
            errMsg = `Max length must be less than ${validators[validator]}`;
          }
          break;
        case 'minValue':
          if (value > validators[validator]) {
            errMsg = '';
          } else {
            errMsg = `Min value is ${validators[validator]}`;
          }
          break;
        case 'maxValue':
          if (value < validators[validator]) {
            errMsg = '';
          } else {
            errMsg = `Max value is  ${validators[validator]}`;
          }
          break;
        default:
          break;
      }
    }
  }

  if (errMsg !== '') {
    return errMsg;
  } else {
    return false;
  }
};

export { FormControl, ControlLabel, FormGroup, validate, Form, validateField };
