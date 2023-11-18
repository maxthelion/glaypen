import GrooveBox from "./groovebox";
import Sequencer from "./sequencer.js";

export default class SongSequencer extends Sequencer{
    bar: number = 0;
    rowIndex: number = 0;

    constructor(grooveBox: GrooveBox) {
        super(grooveBox);
    }

    step(loopStep: number) {
        this.absoluteStep += 1;
        this.currentStep = this.absoluteStep % 16;
        this.bar = Math.floor(this.absoluteStep / 16) % 8;
        this.update(this.absoluteStep);
        this.grooveBox.clipIndex = this.bar + (this.rowIndex * 8);
        // console.log(this.rowIndex, this.bar, this.grooveBox.clipIndex)
    }

    update(absoluteStep: number) {
        let clip = this.getClipForBar(this.bar);
        this.clip = clip;
        // console.log("SongSequencer update", this.clip)
        if (clip != undefined && 
            clip!.getStepAtPosition(this.currentStep) != undefined &&
            clip!.getStepAtPosition(this.currentStep) != null) {
            let step = clip!.getStepAtPosition(this.currentStep)!

            var pitches = step.pitches;
            for(let i = 0; i < pitches.length; i++) {
                this.grooveBox.playPitch(pitches[i]);
            }

        }
    }

    getClipForBar(bar: number) {
        let clipIndex = (this.rowIndex * 8) + bar;
        console.log("getClipForBar", clipIndex, this.rowIndex, bar)
        for (let i = clipIndex; i >= this.rowIndex * 8; i--) {
            let clip = this.grooveBox.clipSaver.savedClips[i];
            if (clip != undefined) {
                this.grooveBox.clipIndex = i;
                return clip;
            }
        }
    }
}