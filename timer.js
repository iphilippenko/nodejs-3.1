// full version (with functions for cluster) can be found here:
// https://github.com/kikill95/profiler-demo/blob/master/timer.js

/*
** Example of usage (more samples there - https://github.com/kikill95/profiler-demo)
...
timer.time('metrics', 'wrapper')
...
timer.timeEnd('metrics', 'wrapper')
timer.time('metrics', 'before-filter')
...
timer.timeEnd('metrics', 'before-filter')
...
timer.logAll()
*/

const log = console // or other module

let starts = {}
let totals = {}
let counters = {}

function time (group, name) {
    starts[group] = starts[group] || {}

    starts[group][name] = process.hrtime()
}

function timeEnd (group, name) {
    let start = starts[group][name]
    let diff = process.hrtime(start)

    totals[group] = totals[group] || {}

    let total = totals[group][name] || [0, 0]
    total[0] += diff[0]
    total[1] += diff[1]
    totals[group][name] = total

    count(group, name)
}

function count (group, name) {
    counters[group] = counters[group] || {}

    let count = counters[group][name] || 0
    count += 1
    counters[group][name] = count
}

let formatLog = (group) => (name) => {
    let count = counters[group][name]
    counters[group][name] = 0

    let totalS
    let operationMs
    if (totals[group] && totals[group][name]) {
        let nano = (totals[group][name][0] * 1e9) + totals[group][name][1]
        let avg = (nano / count)

        totalS = nano * 1e-9
        operationMs = avg * 1e-6
        totals[group][name] = [0, 0]
    } else {
        totalS = '-'
        operationMs = '-'
    }

    return `${name} | ${totalS} | ${count} | ${operationMs}`
}

function logGroup (group) {
    if (counters[group]) {
        log.info(`
${group}
What | Total s | Count | Operation ms
-----+----------+-------+-------------
${Object.keys(counters[group]).map(formatLog(group)).join('\n')}
    `)

        totals[group] = undefined
        counters[group] = undefined
    }
}

function logAll () {
    Object.keys(counters).map(logGroup)
}

module.exports.time = time
module.exports.timeEnd = timeEnd
module.exports.count = count
module.exports.formatLog = (group, name) => log.info(formatLog(group)(name))
module.exports.logGroup = logGroup
module.exports.logAll = logAll
