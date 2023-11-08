import GrooveBox from "./groovebox.js";
import Clip from "./clip.js";

export default class Sequencer {
    tonic: number;
    minorScalePitches: number[];
    grooveBox: GrooveBox;
    currentStep: number;
    clip?: Clip;
    
    constructor(grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        this.tonic = 48;
        this.minorScalePitches = [0, 2, 3, 5, 7, 8, 10];
        this.currentStep = 0;
        this.clip = undefined;
    }

    step(step: number) {
        this.currentStep = step % 16;
        this.update(step, step);
    }

    update(currentStep: number, absoluteStep: number) {
        if (Math.random() > 0.2) {
            console.log("Sequencer update", absoluteStep)
            var pitchInterval = Math.floor( Math.random() * 4);
            var octave = Math.floor( Math.random() * 3);
            var pitch = this.tonic + this.minorScalePitches[pitchInterval] + (octave * 12);
            this.grooveBox.playPitch(pitch);
            this.grooveBox.pitchHistory.addPitch(absoluteStep, pitch);
        } else {
            this.grooveBox.pitchHistory.incrementMaxStep();
        }
    }
}