'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('./hooks/index.js');
var persistent = require('./hooks/persistent/persistent.js');
var persistentBool = require('./hooks/persistentBool/persistentBool.js');
var persistentJSON = require('./hooks/persistentJSON/persistentJSON.js');
var persistentNum = require('./hooks/persistentNum/persistentNum.js');
var persistentRune = require('./hooks/persistentRune/persistentRune.js');



exports.persistent = persistent.persistent;
exports.persistentBool = persistentBool.persistentBool;
exports.persistentJSON = persistentJSON.persistentJSON;
exports.persistentNum = persistentNum.persistentNum;
exports.persistentRune = persistentRune.persistentRune;
exports.persistentStorageMap = persistentRune.persistentStorageMap;
