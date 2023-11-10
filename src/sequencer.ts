import GrooveBox from "./groovebox.js";
import Clip from "./clip.js";

export default class Sequencer {
    minorScalePitches: number[];
    grooveBox: GrooveBox;
    currentStep: number;
    clip?: Clip;
    
    constructor(grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        this.minorScalePitches = [0, 2, 3, 5, 7, 8, 10];
        this.currentStep = 0;
        this.clip = undefined;
    }

    step(step: number) {
        this.currentStep = step % 16;
        this.update(step, step);
    }

    update(absoluteStep: number) {
        let currentStep = absoluteStep % 16;
        let tonic = this.grooveBox.generatorParams.tonic;
        let scaleIndex = this.grooveBox.generatorParams.scaleIndex;
        let scalePitches = this.grooveBox.scales[scaleIndex][1];
        let stepsInBar = this.grooveBox.generatorParams.stepsInBar;
        let stepProbability = this.grooveBox.generatorParams.stepProbability / 128;
        let pitchRange = this.grooveBox.generatorParams.pitchRange;
        let octaveRange = this.grooveBox.generatorParams.octaveRange;
        let octaveProbability = this.grooveBox.generatorParams.octaveProbability;
         if (currentStep % (16 / stepsInBar) == 0) {
            if (Math.random() <= (stepProbability) ) {
                console.log("Sequencer update", absoluteStep)
                var pitchInterval = Math.floor( Math.random() * pitchRange);
                
                var pitch = tonic + scalePitches[pitchInterval];
                if (Math.random() > (octaveProbability) ) {
                    pitch += Math.floor( Math.random() * octaveRange) * 12;
                }   
                this.grooveBox.playPitch(pitch);
                this.grooveBox.pitchHistory.addPitch(absoluteStep, pitch);
            }
        }
        this.grooveBox.pitchHistory.incrementMaxStep();
    }
}