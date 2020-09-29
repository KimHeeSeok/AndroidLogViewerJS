// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

// In renderer process (web page).

// need to set nodeIntegration true

const { AdbDevice, LogcatLog } = require('../model/common.js')

const myAdb = require('./renderer_myAdb.js')
