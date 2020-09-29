const { LogcatLog } = require('../model/common.js')

function init () {

    var adb = require('adbkit')
    var client = adb.createClient()

    const { ipcMain } = require('electron')

    ipcMain.on('getDevicesAsync', (event, arg) => {
        console.log('getDevicesAsync called. arg=' + arg)

        client.listDevices()
            .then(function(devices) {
            console.log('devices:', devices)
            event.reply('getDevicesAsync-reply', devices)
            })
            .catch(function(err) {
            console.error('Something went wrong:', err.stack)
            })
    })

    ipcMain.on('openLogcatAsync', (event, arg) => {
        var deviceId = arg
        console.log('openLogcatAsync called. deviceId=' + deviceId)

        var i = 1
        function myLoop() {
            setTimeout(function() {
                var line = LogcatLog(1234, '2020-09-29', '13:58:22', 'ERROR', 'com.adc.def.myApp', 7890, 54321, 'MY_IMPORTANT_TAG',
                    `this text come from main process ${i}`)
                event.reply('openLogcatAsync-reply', line)
                i++
                if(i < 9999999) {
                    myLoop()
                }
            }, 1000)
        }

        myLoop()
    })
}

module.exports.init = init;

/*
readLine test code
const readLine = require('readline')

var reader  = readline.createInterface({
    input: logcat.stream,
    crlfDelay: Infinity
})

reader.on('line', line => {
    console.log(`line= ${line}`)
})

reader.on('end', () => {
    writable.end()
})
*/
