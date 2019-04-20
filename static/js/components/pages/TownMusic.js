/**
 * @author sc323(Student Number :170023643)
 * @author jyc5(Student Number :170023185)
 * @link 'https://github.com/goldfire/howler.js/tree/master/examples'
 */
(function () {
    window.Components.Pages.TownMusic = {

        template: `
<div id="contact-page">
    <div class="padding"></div>
    <div id="station0" class="station">
        <div class="title">
            <div id="title0" class="subtitle"></div>
            <div id="live0" class="live">LIVE</div>
            <div id="playing0" class="playing">
                <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
                <div class="rect4"></div>
                <div class="rect5"></div>
            </div>
        </div>
    </div>
    <div id="station1" class="station">
        <div class="title">
            <div id="title1" class="subtitle"></div>
            <div id="live1" class="live">LIVE</div>
            <div id="playing1" class="playing">
                <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
                <div class="rect4"></div>
                <div class="rect5"></div>
            </div>
        </div>
    </div>
    <div id="station2" class="station">
        <div class="title">
            <div id="title2" class="subtitle"></div>
            <div id="live2" class="live">LIVE</div>
            <div id="playing2" class="playing">
                <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
                <div class="rect4"></div>
                <div class="rect5"></div>
            </div>
        </div>
    </div>
    <div id="station3" class="station">
        <div class="title">
            <div id="title3" class="subtitle"></div>
            <div id="live3" class="live">LIVE</div>
            <div id="playing3" class="playing">
                <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
                <div class="rect4"></div>
                <div class="rect5"></div>
            </div>
        </div>
    </div>
    <div id="station4" class="station">
        <div class="title">
            <div id="title4" class="subtitle"></div>
            <div id="live4" class="live">LIVE</div>
            <div id="playing4" class="playing">
                <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
                <div class="rect4"></div>
                <div class="rect5"></div>
            </div>
        </div>
    </div>
    <div class="padding"></div>


</div>`,

        mounted() {

            var elms = ['station0', 'title0', 'live0', 'playing0', 'station1', 'title1', 'live1', 'playing1', 'station2', 'title2', 'live2', 'playing2', 'station3', 'title3', 'live3', 'playing3', 'station4', 'title4', 'live4', 'playing4'];
            elms.forEach(function (elm) {
                window[elm] = document.getElementById(elm);
            });

            /**
             * Radio class containing the state of our stations.
             * Includes all methods for playing, stopping, etc.
             * @param {Array} stations Array of objects with station details ({title, src, howl, ...}).
             */

            var Radio = function (stations) {
                var self = this;

                self.stations = stations;
                self.index = 0;

                // Setup the display for each station.
                for (var i = 0; i < self.stations.length; i++) {
                    window['title' + i].innerHTML = '<b>' + self.stations[i].freq + '</b> ' + self.stations[i].title;
                    window['station' + i].addEventListener('click', function (index) {
                        var isNotPlaying = (self.stations[index].howl && !self.stations[index].howl.playing());

                        // Stop other sounds or the current one.
                        radio.stop();

                        // If the station isn't already playing or it doesn't exist, play it.
                        if (isNotPlaying || !self.stations[index].howl) {
                            radio.play(index);
                        }
                    }.bind(self, i));
                }
            };
            Radio.prototype = {
                /**
                 * Play a station with a specific index.
                 * @param  {Number} index Index in the array of stations.
                 */
                play: function (index) {
                    var self = this;
                    var sound;

                    index = typeof index === 'number' ? index : self.index;
                    var data = self.stations[index];

                    // If we already loaded this track, use the current one.
                    // Otherwise, setup and load a new Howl.
                    if (data.howl) {
                        sound = data.howl;
                    } else {
                        sound = data.howl = new Howl({
                            src: data.src,
                            html5: true, // A live stream can only be played through HTML5 Audio.
                            format: ['mp3', 'aac']
                        });
                    }

                    sound.play();

                    self.toggleStationDisplay(index, true);

                    self.index = index;
                },

                stop: function () {
                    var self = this;
                    var sound = self.stations[self.index].howl;
                    self.toggleStationDisplay(self.index, false);
                    if (sound) {
                        sound.stop();
                    }
                },


                toggleStationDisplay: function (index, state) {
                    var self = this;

                    window['station' + index].style.backgroundColor = state ? 'rgba(255, 255, 255, 0.33)' : '';
                    window['live' + index].style.opacity = state ? 1 : 0;
                    window['playing' + index].style.display = state ? 'block' : 'none';
                }
            };

            var radio = new Radio([{
                freq: '81.4',
                title: "Groove Salad",
                src: ['http://ice1.somafm.com/groovesalad-128-mp3', 'http://ice1.somafm.com/groovesalad-128-aac'],
                howl: null
            },
                {
                    freq: '89.9',
                    title: "Secret Agent",
                    src: ['http://ice1.somafm.com/secretagent-128-mp3', 'http://ice1.somafm.com/secretagent-128-aac'],
                    howl: null
                },
                {
                    freq: '98.9',
                    title: "Indie Pop",
                    src: ['http://ice1.somafm.com/indiepop-128-mp3', 'http://ice1.somafm.com/indiepop-128-aac'],
                    howl: null
                },
                {
                    freq: '103.3',
                    title: "Police Radio",
                    src: ['http://ice1.somafm.com/sf1033-128-mp3', 'http://ice2.somafm.com/sf1033-64-aac'],
                    howl: null
                },
                {
                    freq: '107.7',
                    title: "The Trip",
                    src: ['http://ice1.somafm.com/thetrip-128-mp3', 'http://ice2.somafm.com/thetrip-64-aac'],
                    howl: null
                }
            ]);
        }

    };
})();