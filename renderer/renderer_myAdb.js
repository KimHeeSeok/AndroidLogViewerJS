
const { ipcRenderer } = require('electron')
console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

// get device list
async function getDevices() {

    return new Promise(function(resolve, reject) {

        ipcRenderer.once('getDevicesAsync-reply', (event, arg) => {
            resolve(arg)
        })
        ipcRenderer.send('getDevicesAsync', 'param_abcd')
    })
}
module.exports.getDevices = getDevices

function openLogcat(deviceId, callback) {

    ipcRenderer.on('openLogcatAsync-reply', (event, arg) => {
        callback(arg)
    })
    ipcRenderer.send('openLogcatAsync', deviceId)
}
module.exports.openLogcat = openLogcat