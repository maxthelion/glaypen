import Loop from "./loop.js";
var Transport = /** @class */ (function () {
    function Transport(groovebox) {
        this.playing = false;
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
    Transport.prototype.stop = function () {
        this.playing = false;
        this.loop.stop();
    };
    Transport.prototype.start = function () {
        this.playing = true;
        this.loop.start();
    };
    return Transport;
}());
export default Transport;
