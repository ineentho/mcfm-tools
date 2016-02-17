var MonstercatStream = require('./monstercatStream'),
    nomnom = require('nomnom'),
    fs = require('fs'),
    format = require('string-format'),
    request = require('request');

var opts = nomnom
    .option('user', {
        abbr: 'u',
        metavar: 'USERNAME',
        help: 'Twitch username for the bot',
        required: true
    })
    .option('oauth', {
        abbr: 'o',
        metavar: 'OAUTH_KEY',
        help: 'Twitch irc oauth key',
        required: true
    })
    .option('arts', {
        abbr: 'a',
        flag: true,
        help: 'Get Spotify album art links. This will use the Spotify API, so expect a short delay'
    })
    .option('file', {
        abbr: 'f',
        metavar: 'FILE',
        help: 'File to store the current playing song in'
    })
    .option('format', {
        abbr: 'F',
        metavar: 'FORMAT',
        default: '{song} - {artist}',
        help: 'The format to store the current song in. Allowed parameters: ' + '' +
        'Song: {song}, Artist: {artist}, Spotify url: {spotify}, Album art url: {art} (if --arts is specified)'
    })
    .option('saveArts', {
        full: 'save-arts',
        abbr: 'A',
        metavar: 'FILE',
        help: 'Download album arts to FILE. This will automatically enable --arts'
    })
    .option('verbose', {
        abbr: 'v',
        flag: true,
        help: 'Print more debugging info'
    })
    .parse();

if (opts.saveArts) {
    opts.arts = true;
}

var monstercat = new MonstercatStream({
    user: opts.user,
    oauth: opts.oauth,
    spotifyAlbumArt: opts.arts,
    verbose: opts.verbose
});

function getData(song) {
    return format(opts.format, song);
}

function saveFile(file, song) {
    var data = getData(song);
    fs.writeFile(file, data, function(err) {
        if (err) {
            console.log('Could not save file: ', err);
        }
    })
}

monstercat.on('song', function (song) {
    console.log(getData(song));
    if (opts.file) {
        saveFile(opts.file, song);
    }

    if (opts.saveArts) {
        request
            .get(song.art)
            .on('error', function (err) {
                console.log('Could not download album art', err)
            })
            .pipe(fs.createWriteStream(opts.saveArts));
    }
});

if (opts.file) {
    // Store placeholder info

    saveFile(opts.file, {
        song: 'Unknown',
        artist: 'Unknown',
        spotify: 'Unknown',
        art: 'Unknown'
    });
}
