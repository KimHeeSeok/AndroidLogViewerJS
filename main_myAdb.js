function init () {

    var adb = require('adbkit')
    var client = adb.createClient()

    const { ipcMain } = require('electron')

    ipcMain.on('getDevicesAsync', (event, arg) => {
    console.log('getDevicesAsync=' + arg)

    client.listDevices()
        .then(function(devices) {
        console.log('devices:', devices)
        event.reply('getDevicesAsync-reply', devices)
        })
        .catch(function(err) {
        console.error('Something went wrong:', err.stack)
        })
    })
}

module.exports.init = init;