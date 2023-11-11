import GrooveBox from "./groovebox.js";
import Loop from "./loop.js";

export default class Transport {
    grooveBox: GrooveBox;
    playing: boolean = false;
    loop: Loop
    tickNumber: number = 0;

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

    tick() {
        this.tickNumber++;
        if(this.tickNumber % 6 === 0) {
            this.loop.update();
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