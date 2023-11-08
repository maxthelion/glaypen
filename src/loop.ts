import Sequencer from "./sequencer.js";
import EventHandler from "./eventhandler.js";
import GrooveBox from "./groovebox.js";


export default class Loop {
    step: number;
    grooveBox: GrooveBox;
    intervalNumber?: number;

    constructor(grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        this.step = 0;
    }

    start() {
        this.intervalNumber = setInterval(() => {
            this.update();
        }, 120);
    }

    stop() {
        if (this.intervalNumber) {
            clearInterval(this.intervalNumber);
        }
    }

    update() {
        this.step += 1;
        this.grooveBox.sequencer.step(this.step)
    }
}
