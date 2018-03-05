const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const pathToEndpointFile = path.join(__dirname, 'endpoints.txt');
const pathToTeamFile = path.join(__dirname, '..', 'team_members.txt');

const userController = require('../controllers/users');
const diaryController = require('../controllers/diaries');

let endpointList = [];
let teamMembers = [];


fs.readFile(pathToEndpointFile, 'utf8', (error, data) => {
  if (error) console.error('There was a problem retrieving implemented endpoints');
  else endpointList = data.trim().split('\n');
});

fs.readFile(pathToTeamFile, 'utf8', (error, data) => {
  if (error) console.error('There was a problem retrieving team members', error);
  else teamMembers = data.trim().split('\n');
});

router.get('/', (req, res) => {
  // Return list of implemented endpoints
  res.status(200).send({
    status: true,
    result: endpointList,
  });
});

router.get('/meta/heartbeat', (req, res) => {
  res.status(200).send({
    status: true,
  });
});

router.get('/meta/members', (req, res) => {
  res.status(200).send({
    status: true,
    result: teamMembers,
  });
});

router.post('/users/register', userController.registerUser);
router.post('/users/authenticate', userController.authenticateUser);
router.post('/users/expire', userController.expireUserToken);
router.post('/users', userController.getUserByToken);

router.get('/diary', diaryController.getAllPublicDiaries);

router.post('/diary', diaryController.getEntriesByUsername);
router.post('/diary/create', diaryController.createDiaryEntry);
router.post('/diary/delete', diaryController.deleteEntry);
router.post('/diary/permission', diaryController.editPermission);

module.exports = router;
