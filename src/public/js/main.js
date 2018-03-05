const ConvertFormToJSON = form => $(form).serializeArray()
  .reduce((a, x) => { a[x.name] = x.value; return a; }, {});

const getPublicEntries = () => {
  $.ajax({
    url: 'http://localhost:8080/diary/',
    type: 'GET',
    contentType: 'application/json',
    success: (response) => {
      if (response.status === true) {
        if (response.result.length > 0) {
          response.result.forEach((entry) => {
            const entryPublic = entry.public ? 'public' : 'private';
            $('.list-group').append(`<div class="list-group-item list-group-item-action flex-column align-items-start"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">${entry.title}</h5><small class="text-muted public-status"> ${entryPublic}</small><div class="inner-div" data-entry-id="${entry.id}" data-entry-permission=" ${entryPublic}"><button class="btn btn-sm btn-outline-warning change-entry-permission">Change Permission</button><button class="btn btn-sm btn-outline-danger delete-entry">Delete</button></div></div><p class="mb-1">${entry.text}</p><small class="text-muted">${entry.author}</small><br><small class="text-muted"> ${entry.publish_date}</small></div>`);
          });
        } else {
          alert('No public entries!');
        }
      }
    },
  });
};

const getUserEntries = () => {
  $.ajax({
    url: 'http://localhost:8080/diary/',
    type: 'POST',
    data: JSON.stringify({ token: sessionStorage.getItem('authToken') }),
    contentType: 'application/json',
    success: (response) => {
      if (response.status === true) {
        if (response.result.length > 0) {
          response.result.forEach((entry) => {
            const entryPublic = entry.public ? 'public' : 'private';
            $('.list-group').append(`<div class="list-group-item list-group-item-action flex-column align-items-start"><div class="d-flex w-100 justify-content-between"><h5 class="mb-1">${entry.title}</h5><small class="text-muted public-status"> ${entryPublic}</small><div class="inner-div" data-entry-id="${entry.id}" data-entry-permission=" ${entryPublic}"><button class="btn btn-sm btn-outline-warning change-entry-permission">Change Permission</button><button class="btn btn-sm btn-outline-danger delete-entry">Delete</button></div></div><p class="mb-1">${entry.text}</p><small class="text-muted">${entry.author}</small><br><small class="text-muted"> ${entry.publish_date}</small></div>`);
          });
        } else {
          alert('No entries!');
        }
      } else if (response.status === false && response.error === 'Invalid authentication token.') {
        console.error('Invalid authentication token.');
      }
    },
  });
};

const createNewEntry = () => {
  const dataObj = ConvertFormToJSON('#new-entry-form');
  dataObj.public = $('#public').is(':checked');
  dataObj.token = sessionStorage.getItem('authToken');

  console.log(dataObj);

  $.ajax({
    url: 'http://localhost:8080/diary/create',
    type: 'POST',
    data: JSON.stringify(dataObj),
    contentType: 'application/json',
    success: (response) => {
      console.log(response);
      if (response.status === true) {
        console.log('Diary entry created successfully with id: ', response.result.id);
        window.location.reload();
      } else if (response.error && response.error === 'Invalid authentication token.') {
        console.error('Invalid authentication token supplied');
      } else {
        console.error('There was a problem creating the diary entry!');
      }
      window.location.reload();
    },
  });
};

const getUserProfile = () => {
  $.ajax({
    url: 'http://localhost:8080/users',
    type: 'POST',
    data: JSON.stringify({ token: sessionStorage.getItem('authToken') }),
    contentType: 'application/json',
    success: (response) => {
      if (response.status === true) {
        $('.list-group').append(`<div class="card" style="width: 18rem;"><img class="card-img-top" src="../img/avatar.png" alt="Card image cap"><div class="card-body"><h5 class="card-title">${response.result.username}</h5><p class="card-text">Fullname: ${response.result.fullname}<br>Age: ${response.result.age}</p></div></div>`);
      } else if (response.error && response.error === 'Invalid authentication token.') {
        console.error('Invalid authentication token supplied');
      } else {
        console.error('There was a problem getting the user profile');
        window.location.reload();
      }
    },
  });
};

const changePermission = (entryId, entryPermission) => {
  const dataObj = {
    token: sessionStorage.getItem('authToken'),
    id: entryId,
    public: !(entryPermission === 'public'),
  };

  $.ajax({
    url: 'http://localhost:8080/diary/permission',
    type: 'POST',
    data: JSON.stringify(dataObj),
    contentType: 'application/json',
    success: (response) => {
      if (response.status === true) {
        window.location.reload();
      } else if (response.error && response.error === 'Invalid authentication token.') {
        console.error('Invalid authentication token supplied');
      } else {
        console.error('There was a problem changing the permissions');
        window.location.reload();
      }
    },
  });
};

const deleteEntry = (entryId) => {
  const dataObj = {
    token: sessionStorage.getItem('authToken'),
    id: entryId,
  };

  $.ajax({
    url: 'http://localhost:8080/diary/delete',
    type: 'POST',
    data: JSON.stringify(dataObj),
    contentType: 'application/json',
    success: (response) => {
      if (response.status === true) {
        console.log('Diary entry deleted successfully');
        window.location.reload();
      } else if (response.error && response.error === 'Invalid authentication token.') {
        console.error('Invalid authentication token supplied');
      } else {
        console.error('There was a problem deleting the diary entry');
        window.location.reload();
      }
    },
  });
};

const logout = () => {
  $.ajax({
    url: 'http://localhost:8080/users/expire',
    type: 'POST',
    data: JSON.stringify({ token: sessionStorage.getItem('authToken') }),
    contentType: 'application/json',
    success: (response) => {
      if (response.status === true) {
        sessionStorage.removeItem('authToken');
        window.location.href = 'login.html';
      } else if (response.error && response.error === 'Invalid authentication token.') {
        console.error('Invalid authentication token supplied');
      } else {
        console.error('There was a problem logging out');
        window.location.href = 'home.html';
      }
    },
  });
};

$(document).ready(() => {
  getPublicEntries();

  $('#public').click(() => {
    $('#public').parent().addClass('active');
    $('#my-entries').parent().removeClass('active');
    $('#profile').parent().removeClass('active');
    $('.list-group').html('');
    getPublicEntries();
  });

  $('#my-entries').click(() => {
    $('#my-entries').parent().addClass('active');
    $('#public').parent().removeClass('active');
    $('#profile').parent().removeClass('active');
    $('.list-group').html('');
    getUserEntries();
  });

  $('#create-entry').click((event) => {
    event.preventDefault();
    createNewEntry();
  });

  $('#profile').click(() => {
    $('#profile').parent().addClass('active');
    $('#my-entries').parent().removeClass('active');
    $('#public').parent().removeClass('active');
    $('.list-group').html('');
    getUserProfile();
  });

  $('.list-group').click((event) => {
    const entryId = $(event.target).parent().attr('data-entry-id');
    const entryPermission = $(event.target).parent().attr('data-entry-permission');

    if ($(event.target).hasClass('change-entry-permission')) {
      changePermission(entryId, entryPermission);
    } else if ($(event.target).hasClass('delete-entry')) {
      deleteEntry(entryId);
    }
  });

  $('#logout').click(() => logout());
});
