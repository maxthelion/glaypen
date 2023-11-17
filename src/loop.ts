import Sequencer from "./sequencer.js";
import GrooveBox from "./groovebox.js";


export default class Loop {
    step: number;
    grooveBox: GrooveBox;
    intervalNumber?: TimeOut;

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
        if (this.intervalNumber != undefined) {
            clearInterval(this.intervalNumber);
        }
    }

    update() {
        this.step += 1;
        // console.log("update", this.grooveBox.sequencer);
        this.grooveBox.currentSequencer()?.step(this.step)
    }
}
