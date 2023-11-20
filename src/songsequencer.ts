import Clip from "./clip";
import GrooveBox from "./groovebox";
import Sequencer from "./sequencer.js";

export default class SongSequencer extends Sequencer{
    bar: number = 0;
    rowIndex: number = 0;
    phraseStartIndex: number = 0;
    lastRowIndex: number = 0;
    clips: Clip[] = [];
    stepsInPhrase: number = 0;
    clipStep: number = 0;

    constructor(grooveBox: GrooveBox) {
        super(grooveBox);
        
    }

    step(loopStep: number) {
        this.updateClipData();

        this.absoluteStep += 1;
        let phraseStep = this.absoluteStep % this.stepsInPhrase;
        let allSteps = 0;
        for(let i = 0; i < this.clips.length; i++) {
            if (phraseStep < (this.clips[i].clipLength + allSteps)) {
                this.clip = this.clips[i];
                this.grooveBox.clipIndex = i + (this.rowIndex * 8);
                this.clipStep = phraseStep - allSteps;
                this.currentStep = this.clipStep;
                this.clip = this.clips[i];
                break;
            } else {
                allSteps += this.clips[i].clipLength;
            }
        }
        this.phraseStartIndex = this.rowIndex * 8;
        this.bar = Math.floor(this.absoluteStep / 16) % 8;
        this.update(this.absoluteStep);
        
        // console.log(this.rowIndex, this.bar, this.grooveBox.clipIndex)
    }

    update(clipStep: number) {
        let clip = this.clip;
        // console.log("SongSequencer update", this.clip)
        if (clip != undefined && 
            clip!.getStepAtPosition(this.clipStep) != undefined &&
            clip!.getStepAtPosition(this.clipStep) != null) {
            let step = clip!.getStepAtPosition(this.clipStep)!

            var pitches = step.pitches;
            for(let i = 0; i < pitches.length; i++) {
                this.grooveBox.playPitch(pitches[i]);
            }

        }
    }

    updateClipData() {
        console.log("updateClipData", this.rowIndex)
        this.lastRowIndex = this.rowIndex;
        this.clips = [];
        this.stepsInPhrase = 0
        for(let i = 0; i < 8; i++) {
            
            let clip = this.grooveBox.clipSaver.savedClips[i + (this.rowIndex * 8)];
            if (clip != undefined) {
                this.clips[i] = clip;
                this.stepsInPhrase += clip.clipLength;
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