import GrooveBox from "./groovebox.js";
import Sequencer from "./sequencer.js";
import Clip from "./clip.js";

export default class ClipSequencer extends Sequencer {  
    constructor(grooveBox: GrooveBox, clip: Clip) {
        super(grooveBox);
        this.clip = clip;
    }

    step(step: number) {
        this.currentStep = step % 16;
        this.update();
    }

    update() {
        // console.log("ClipSequencer update", this.clip)
        if (this.clip.steps[this.currentStep] != undefined) {
            var pitch = this.clip.steps[this.currentStep][1];
            this.grooveBox.playPitch(pitch);
        }
    }
}