export default function secondsToTime(e) {
    var h = Math.floor(e / 3600)
        .toString()
        .padStart(1, '0'),
        m = Math.floor((e % 3600) / 60)
            .toString()
            .padStart(1, '0'),
        s = Math.floor(e % 60)
            .toString()
            .padStart(2, '0')

    return h + 'h ' + m + 'm'
}