var irc = require('irc'),
    Promise = require('bluebird'),
    request = Promise.promisifyAll(require('request')),
    EventEmitter = require('events').EventEmitter;

function getAlbumArtUrl(id) {
    return request.getAsync('https://api.spotify.com/v1/tracks/' + id)
        .then(function(params) {
            var response = params[0];
            var json = JSON.parse(response.body);
            return json.album.images[0].url;
        });
}

function getSpotifyIdFromShortlink(shortlink) {
    return request.getAsync(shortlink, {
        followRedirect: false
    }).then(function (params) {
        var response = params[0];
        return /track\/(.*)\?/.exec(response.headers.location)[1];
    });
}

function getAlbumArt(spotify) {
    return getSpotifyIdFromShortlink(spotify)
        .then(getAlbumArtUrl)
}



function MonstercatStream(opts) {
    var self = this;

    var client = new irc.Client('irc.twitch.tv', opts.user, {
        password: opts.oauth,
        channels: ['#monstercat']
    });

    client.on('message', function (nick, to, text, message) {
        if (nick == 'monstercat') {
            var res = /Now Playing: (.*) by (.*) - Listen now: (.*)/.exec(text);
            if (res) {
                var song = res[1];
                var artist = res[2];
                var spotify = res[3];

                if (opts.spotifyAlbumArt) {
                    getAlbumArt(spotify).then(function(albumArt) {
                        self.emit('song', {
                            song: song,
                            artist: artist,
                            spotify: spotify,
                            art: albumArt
                        });
                    }).catch(function(error) {
                        console.log('Could not donwload album art:', error);
                    });
                } else {
                    self.emit('song', {
                        song: song,
                        artist: artist,
                        spotify: spotify
                    })
                }

            }
        }
    });

    if (opts.verbose) {
        client.on('raw', function(message) {
            console.log('[verbose]', message)
        });
    }

    client.on('quit', function(message) {
        console.log('Quit', message);
    });

    client.on('error', function(message) {
        console.log('Error', message);
    });

    client.on('notice', function(nick, to, text, message) {
        if (message.args[1] === 'Login unsuccessful' || message.args[1] === 'Error logging in') {
            console.log('Login unsuccessful');
            console.log(message);
            process.exit(1);
        }
    });

    client.on('registered', function() {
        console.log('Successfully connected');
    });
}
MonstercatStream.prototype = new EventEmitter;

module.exports = MonstercatStream;
