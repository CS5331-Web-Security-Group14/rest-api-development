const mongoose = require('mongoose');
const assert = require('assert');

// Making mongoose use the default promise and not a third-party promise
mongoose.Promise = global.Promise;

const env = 'dev'; // change to dev for development

let url = 'mongodb://mongo:27017/cs5331';
if (env === 'dev') url = 'mongodb://localhost:27017/cs5331';

mongoose.connect(url, (error) => {
  assert.equal(null, error);
  console.log('Connected correctly to server');
})
  .catch(error => console.log(error));
