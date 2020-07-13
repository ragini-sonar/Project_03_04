const valid_name = (fname, lname) => {
  var x = /^[A-Za-z]+$/;
  if (fname.match(x) && lname.match(x) && lname != "" && lname != "") {
    return true;
  } else {
    console.log(" Failed Valid name");
    return false;
  }
};

const valid_email = (email) => {
  if (
    email != "" &&
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
  ) {
    return true;
  } else {
    console.log(" Failed Valid email");
    return false;
  }
};

const valid_pwd = (password, c_password) => {
  if (password != "" && c_password != "" && password == c_password) {
    return true;
  } else {
    console.log(" Failed Valid password");
    return false;
  }
};

module.exports.valid_signup = {
  signup_info(fname, lname, email, password, c_password) {
    if (
      valid_name(fname, lname) &&
      valid_email(email) &&
      valid_pwd(password, c_password)
    ) {
      return true;
    } else {
      console.log(" Failed Valid signup info");
      return false;
    }
  },
};
