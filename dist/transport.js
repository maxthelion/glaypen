import Loop from "./loop.js";
var Transport = /** @class */ (function () {
    function Transport(groovebox) {
        this.playing = false;
        this.tickNumber = 0;
        this.lastTick = 0;
        this.midiSync = false;
        this.tempo = 120;
        this.grooveBox = groovebox;
        this.loop = new Loop(this.grooveBox);
    }
    Transport.prototype.togglePlay = function () {
        if (this.playing) {
            this.stop();
        }
        else {
            this.start();
        }
    };
    Transport.prototype.increaseTempo = function () {
        this.tempo += 1;
    };
    Transport.prototype.decreaseTempo = function () {
        this.tempo -= 1;
    };
    Transport.prototype.tick = function () {
        // console.log("tick");
        // if (!this.playing ) {
        //     this.playing = true;
        //     this.loop.reset();
        // }
        this.midiSync = true;
        this.tickNumber++;
        this.lastTick = Date.now();
        if (this.tickNumber % 6 === 0) {
            this.loop.update();
        }
    };
    Transport.prototype.stop = function () {
        if (this.midiSync == true || !this.playing) {
            return;
        }
        this.playing = false;
        this.loop.stop();
    };
    Transport.prototype.start = function () {
        if (this.midiSync == true || this.playing) {
            return;
        }
        this.playing = true;
        if (this.grooveBox.modeIndex === 2) {
            this.loop.reset();
        }
        this.loop.startWithInterval();
    };
    Transport.prototype.startByMidi = function () {
        this.playing = true;
        this.midiSync = true;
        this.loop.reset();
        this.loop.start();
    };
    Transport.prototype.stopByMidi = function () {
        this.midiSync = false;
        this.playing = false;
        this.loop.stop();
    };
    return Transport;
}());
export default Transport;
