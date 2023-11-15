import GrooveBox from "./groovebox.js";
import Sequencer from "./sequencer.js";
import Clip from "./clip.js";

export default class ClipSequencer extends Sequencer {  
    constructor(grooveBox: GrooveBox, clip: Clip) {
        super(grooveBox);
        this.clip = clip;
    }

    step(step: number) {
        this.currentStep = step % this.clip!.getClipLength();
        this.update();
    }

    update() {
        // console.log("ClipSequencer update", this.clip)
        if (this.clip!.steps[this.currentStep] != undefined) {

            var pitches = this.clip!.steps[this.currentStep].pitches;
            for(let i = 0; i < pitches.length; i++) {
                this.grooveBox.playPitch(pitches[i]);
            }
        }
    }
}