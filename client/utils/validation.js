import R from 'ramda';

export const validateUsername = username => {
  let valid = true;
  let message = 'Email Valid';

  if (!R.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, username).length) {
    message = 'Invalid character used';
    valid = false;
  }
  else if (username.length < 4) {
    message = 'Email must be at least four characters';
    valid = false;
  }
  return { valid, message };
};

export const validateFullName = name => {
  let message = 'Full name valid';
  let valid = true;
  let regex = /^\s*([a-zA-Z]+)\s+([a-zA-Z]+)\s*$/;
  let result = regex.exec(name);
  if (result === null) {
    message = 'Invalid name';
    valid = false;
  }
  return {valid , message};
}

export const validatePassword = (username, password) => {
  let valid = true;
  let message = 'Password valid';

  if (password.length < 6) {
    valid = false;
    message = 'Password must be at least six characters';
  } else if (password.length > 16) {
    valid = false;
    message = 'Password must be 16 characters or less';
  } else if (username === password) {
    valid = false;
    message = 'Username and password must be different';
  } else if (!R.match(/[0-9]/, password).length) {
    valid = false;
    message = 'Password must include at least one number';
  }

  return { valid, message };
};

export const validateName = name => {
  if (name === '') {
    return true;
  }
  if (!R.match(/^[a-zA-ZÀ-ÿ'.\s]+$/, name).length) {
    return false;
  }
  if (name.length > 20) {
    return false;
  }
  return true;
};
