const { LogcatLog } = require('../model/common.js')

const fs = require('fs');
const moment = require('moment')
const logcat = require('adbkit-logcat')
const { Priority } = require('adbkit-logcat')
const GrowingFile = require('growing-file')
const NodeCache = require( "node-cache" )

function init () {

    const adb = require('adbkit')

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

        client.openLogcat(deviceId, callback=(err, logcatReader) => {

            // // write to a file
            // var nowText = moment(new Date()).format('YYYYMMDD hhmmss')
            // var writeStream = fs.createWriteStream(`${nowText}.txt`);

            // logcatReader.stream.pipe(writeStream)

            // read from the file
            // setTimeout(function() {
            //     readFromFile(event, nowText)
            // }, 100)

            // write to cache
            const myCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })

            var parser = logcatReader.parser

            var line = 0
            parser.on('entry', (entry) => {

                var _mo = moment(entry.date)
                // Priority.toLetter(3) = 'D'
                // Priority.toName(3) = 'DEBUG'
        
                var log = LogcatLog(line++, _mo.format('YYYY-MM-DD'), _mo.format('hh-mm-ss'), Priority.toLetter(entry.priority),
                    'com.adc.def.myApp', entry.pid, entry.tid, entry.tag, entry.message)

                myCache.set(`line_${line}`, log)
            })

            parser.on('error', (err)=> {
                console.log(err)
            })

            setTimeout(function() {
                readFromCache(event, myCache)
            }, 100)
        })
    })
}

function readFromCache(event, myCache) {
    // myCache.on( "set", function( key, value ){
    //     event.reply('openLogcatAsync-reply', value)
    // });
    
    var currentLine = 1
    function send() {
        var entries = []

        for(var i=0; i<50; i++) {
            var log = myCache.get(`line_${currentLine}`)

            // console.log(log)
            if(log != undefined) {
                entries.push(log)
                currentLine++
            } else {
                break
            }
        }

        var time = 10
        if(entries.length != 0) {
            event.reply('openLogcatAsync-reply', entries)
        } else {
            time = 1000
        }

        setTimeout(send, time)
    }

    send()
}

function readFromFile(event, nowText) {
    var path = `${nowText}.txt`

    var file = GrowingFile.open(path, option={timeout: 10000, interval:100, startFromEnd:false })

    var readStream = file //fs.createReadStream(path, options={autoClose:false})  
    
    readStream.on('end', (e) => {
        console.log('end: ' + e)
    })

    readStream.on('close', (e) => {
        console.log('close: ' + e)
    })


    fs.stat(path, (err, stats) => {

        console.log('stats: ' + JSON.stringify(stats));
    })
    
    var reader = logcat.readStream(readStream, options={'fixLineFeeds':false})
    var parser = reader.parser

    var i = 1
    var handler = entry => {
        console.log(entry.message)

        var _mo = moment(entry.date)
        // Priority.toLetter(3) = 'D'
        // Priority.toName(3) = 'DEBUG'

        var line = LogcatLog(i++, _mo.format('YYYY-MM-DD'), _mo.format('hh-mm-ss'), Priority.toLetter(entry.priority),
            'com.adc.def.myApp', entry.pid, entry.tid, entry.tag, entry.message)

        event.reply('openLogcatAsync-reply', line)
        // if(i > 300) {
        //     parser.off('entry', handler)
        //     readStream.close()
        // }
    }

    parser.on('entry', handler)

    parser.on('error', (err)=> {
        console.log(err)
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
