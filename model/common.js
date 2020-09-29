const Struct = (...keys) => ((...v) => keys.reduce((o, k, i) => {o[k] = v[i]; return o} , {}))

const AdbDevice = Struct('id', 'type')

const LogcatLog = Struct('line', 'date', 'time', 'log_lv', 'process', 'pid', 'thread', 'tag', 'text')

module.exports = { AdbDevice, LogcatLog }