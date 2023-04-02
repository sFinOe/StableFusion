const express = require('express');
const path = require('path');

const auth         = require('./auth');
const user         = require('./user');
const users        = require('./users');
const todos        = require('./todos');
const upload       = require('./upload');
const studio       = require('./studio');
const training     = require('./training');
const prompt       = require('./prompt');
const inference   = require('./inference');
const test        = require('./test');
const gallery     = require('./gallery');
const images     = require('./images');
const selfies    = require('./selfies');
const verify    = require('./verify');

const router = express.Router();

router.use('/api/auth', auth);
router.use('/api/user', user);
router.use('/api/users', users);
router.use('/api/todos', todos);
router.use('/api/v1', upload);
router.use('/api/v1', studio);
router.use('/api/v1', training);
router.use('/api/v1', prompt);
router.use('/api/v1', inference);
router.use('/api/v1', test);
router.use('/api/v1', gallery);
router.use('/api/v1', selfies);
router.use('/images', images);
router.use('/', verify);



router.get('/api/tags', (req, res) => {
  res.send([
    'MERN', 'Node', 'Express', 'Webpack', 'React', 'Redux', 'Mongoose',
    'Bulma', 'Fontawesome', 'Ramda', 'ESLint', 'Jest',
  ]);
});

router.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../dist', 'index.html'));
});

module.exports = router;
