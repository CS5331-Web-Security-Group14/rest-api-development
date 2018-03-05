const ConvertFormToJSON = form => $(form).serializeArray()
  .reduce((a, x) => { a[x.name] = x.value; return a; }, {});

const registerUser = () => {
  const dataObj = ConvertFormToJSON('#register-form');

  $.ajax({
    url: 'http://localhost:8080/users/register',
    type: 'POST',
    data: JSON.stringify(dataObj),
    contentType: 'application/json',
    success: (response) => {
      if (response.status === true) {
        // user created succesfully
        console.log('User registered successfully, login to continue');
        window.location.href = 'login.html';
      } else {
        // user already exists
        console.error('There was a problem signing up: ', response.error);
      }
    },
  });
};

const loginUser = () => {
  const dataObj = ConvertFormToJSON('#login-form');

  $.ajax({
    url: 'http://localhost:8080/users/authenticate',
    type: 'POST',
    data: JSON.stringify(dataObj),
    contentType: 'application/json',
    success: (response) => {
      if (response.status === true) {
        // user login succesfully
        sessionStorage.setItem('authToken', response.result.token);
        window.location.href = 'home.html';
      } else {
        // user login failed
        console.error('There was a problem logging in: ', response.error);
      }
    },
  });
};

$(document).ready(() => {
  $('#register-button').click((event) => {
    event.preventDefault();
    registerUser();
  });

  $('#login-button').click((event) => {
    event.preventDefault();
    loginUser();
  });

  $('#switch-to-register').click(() => {
    $('#register-form').show();
    $('#login-form').hide();
  });

  $('#switch-to-login').click(() => {
    $('#register-form').hide();
    $('#login-form').show();
  });
});
