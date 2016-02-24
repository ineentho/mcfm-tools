# Monstercat FM Tools
Monstercat FM Tools is a command line utility for getting informationfrom the
Monstercat stream at http://twitch.tv/monstercat.

Availiable on npm: [`mcfm`](https://www.npmjs.com/package/mcfm)

By parsing `monstercat`'s messages on the stream, it can recover some information about the currently playing song.

It currently can
- Save current artist and song name to a file (great for using together with OBS or other streaming programs)
- Download the current songs album art from Spotify

## Getting started
mcfm-tools is built with node / iojs, so a working installation of node or iojs is required. Nodejs can easily be
installed from [nodejs.org](https://nodejs.org/). When nodejs is installed, make sure you can use it from the command
line and you are ready to install mcfm

1. Open a terminal and type `npm install -g mcfm` to install mcfm globally on your system
2. type `mcfm` to make sure mcfm was installed properly
3. Get an API key for using the Twitch chat through IRC, the easiest way is to use http://twitchapps.com/tmi/.
4. type `mcfm -u Ineentho -o oauth:7j8vge4o0l1js2m1z6gb936cpwhmm1`, replacing `Ineentho` with your Twitch username
and `oauth:7j...` with the key you got from twitchapps.
5. Now, each time the song is changed it should be printed to your terminal. If that's working, you can continue to
examples section to see how to save this information to a file

## Examples
Keep in mind the oauth key you generated earlier will be required with all of these commands.

### Save current song name to a file called `current-song.txt`
This is probably the easiest way to display the current song in most streaming programs (including OBS)
```
mcfm -u user -o oauthkey -f current-song.txt
```

You will now have a file called current-song.txt containging the current song like "Breakdown - Noisestorm" for example.

### Customize the output format
If you aren't happy with default "Song - Artist", you can easily change it with the `-F` parameter.
```
mcfm -u user -o oauthkey -f current-song.txt -F "{song} by {artist}"
```
Allowed parameters: Song: {song}, Artist: {artist}, Spotify url: {spotify}, Album art url: {art} (if --arts is specified)

### Save the album art to a file
You can store the album art from spotify into a png file. This can be combined with any of the previous examples, or
used as in this example.
```
mcfm -u user -o oauthkey -A albumart.png
```

## Usage
`mcfm -h` will print all availiable options.
