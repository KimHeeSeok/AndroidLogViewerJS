const Struct = (...keys) => ((...v) => keys.reduce((o, k, i) => {o[k] = v[i]; return o} , {}))
const AdbDevice = Struct('id', 'type')

const { ipcRenderer } = require('electron')
console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

// get device list
async function getDevices() {

    return new Promise(function(resolve, reject) {

        ipcRenderer.once('getDevicesAsync-reply', (event, arg) => {
            resolve(arg);
        })
        ipcRenderer.send('getDevicesAsync', 'param_abcd')
    })
}

module.exports.getDevices = getDevices;
