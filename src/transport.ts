import GrooveBox from "./groovebox.js";
import Loop from "./loop.js";

export default class Transport {
    grooveBox: GrooveBox;
    playing: boolean = false;
    loop: Loop

    constructor(groovebox: GrooveBox) {
        this.grooveBox = groovebox;
        this.loop = new Loop(this.grooveBox);
    }

    togglePlay() {
        if (this.playing) {
            this.stop();
        } else  {
            this.start();
        }
    }

    stop() {
        this.playing = false;
        this.loop.stop();
    }

    start() {
        this.playing = true;
        this.loop.start();
    }
}