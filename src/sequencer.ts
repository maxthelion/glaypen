import GrooveBox from "./groovebox.js";
import Clip from "./clip.js";
import Step from "./step.js";
import StepGenerator from "./generators/stepgenerator.js";
import PitchGenerator from "./generators/pitchgenerator.js";
import EuclidianStepGenerator from "./generators/euclidianstepgenerator.js";
import ChordGenerator from "./generators/chordgenerator.js";

export type SequencerInterface = {

}

export default class Sequencer implements SequencerInterface{
    minorScalePitches: number[];
    grooveBox: GrooveBox;
    currentStep: number;
    clip?: Clip;
    absoluteStep: number;
    lastPitch?: number;
    stepGenerators: StepGenerator[];
    stepGenerator: StepGenerator;
    pitchGenerator: PitchGenerator;
    pitchGenerators: PitchGenerator[];

    constructor(grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        this.minorScalePitches = [0, 2, 3, 5, 7, 8, 10];
        this.currentStep = 0;
        this.clip = undefined;
        this.absoluteStep = 0;
        this.stepGenerators = [
            new StepGenerator(this.grooveBox),
            new EuclidianStepGenerator(this.grooveBox),
            new StepGenerator(this.grooveBox),
        ];
        this.pitchGenerators = [
            new PitchGenerator(this.grooveBox),
            new ChordGenerator(this.grooveBox),
            new PitchGenerator(this.grooveBox),
        ];
        
        this.stepGenerator = this.grooveBox.generatorManager.buildCurrentStepGenerator();
        this.pitchGenerator = this.grooveBox.generatorManager.buildCurrentPitchGenerator();
    }

    step(loopStep: number) {
        this.absoluteStep += 1;
        this.currentStep = this.absoluteStep % 16;
        this.update(this.absoluteStep);
    }

    availablePitches() {
        return this.pitchGenerator.availablePitches();
    }

    update(absoluteStep: number) {

        // console.log("update", absoluteStep);
        let currentStep = absoluteStep % 16;
        let stepsInBar = this.grooveBox.generatorParams.stepsInBar;
        let stepProbability = this.stepGenerator.stepProbability(currentStep);
        
        var scalePitches
        if (this.grooveBox.manualPitchOptions.length > 0) {
            scalePitches = this.grooveBox.manualPitchOptions;
        }
        
        if (currentStep % (16 / stepsInBar) == 0) {
            if (Math.random() <= (stepProbability) ) {
                if (this.grooveBox.manualPitchOptions.length > 0 ) {
                    var pitchInterval = Math.floor( Math.random() * scalePitches.length);
                    var pitch = scalePitches[pitchInterval];
                }else {
                    var pitch = this.pitchGenerator.getNextPitch();
                }

                if (pitch < 0) {
                    pitch = 0;
                } else if (pitch > 127) {
                    pitch = 127;
                }
                let step = new Step(currentStep, 120, [pitch]);
                // this.grooveBox.playPitch(pitch);
                
                this.grooveBox.playStep(step);
                this.grooveBox.pitchHistory.addStep(absoluteStep, step);
            }
        }
        this.grooveBox.pitchHistory.incrementMaxStep();
    }

    setStepMode(stepMode: number) {
        this.stepGenerator = this.stepGenerators[stepMode];
    }

    setPitchMode(pitchMode: number) {
        this.pitchGenerator = this.pitchGenerators[pitchMode];
    }

    updatenew(absoluteStep: number) {

        // console.log("update", absoluteStep);
        let currentStep = absoluteStep % 16;
        let tonic = this.grooveBox.generatorParams.tonic;
        let scaleIndex = this.grooveBox.generatorParams.scaleIndex;
        let scalePitches = this.grooveBox.scales[scaleIndex][1];
        if (this.grooveBox.manualPitchOptions.length > 0) {
            scalePitches = this.grooveBox.manualPitchOptions;
        }
        let stepsInBar = this.grooveBox.generatorParams.stepsInBar;
        let stepProbability = this.grooveBox.generatorParams.stepProbability / 128;
        let pitchRange = this.grooveBox.generatorParams.pitchRange;
        let octaveRange = this.grooveBox.generatorParams.octaveRange;
        let octaveProbability = this.grooveBox.generatorParams.octaveProbability / 128;
         if (currentStep % (16 / stepsInBar) == 0) {
            if (Math.random() <= (stepProbability) ) {
                if (this.grooveBox.manualPitchOptions.length > 0) {
                    var pitchInterval = Math.floor( Math.random() * scalePitches.length);
                    var pitch = scalePitches[pitchInterval];
                }else {
                    var pitchInterval = Math.floor( Math.random() * pitchRange);
                    if (this.lastPitch != undefined) {
                        var pitch = this.lastPitch + scalePitches[pitchInterval];
                        if (Math.random() > (octaveProbability) ) {
                            let octaveChange = Math.floor( Math.random() * octaveRange) - Math.floor(octaveRange / 2);
                            pitch += (octaveChange * 12);
                        }
                    } else {
                        var pitch = tonic + scalePitches[pitchInterval];
                        if (Math.random() > (octaveProbability) ) {
                            let octaveChange = Math.floor( Math.random() * octaveRange) - Math.floor(octaveRange / 2);
                            pitch += (octaveChange * 12);
                        }  
                    }
                    this.lastPitch = pitch;
                }
                let step = new Step(currentStep, 120, [pitch]);
                // this.grooveBox.playPitch(pitch);
                this.grooveBox.playStep(step);
                this.grooveBox.pitchHistory.addStep(absoluteStep, step);
            }
        }
        this.grooveBox.pitchHistory.incrementMaxStep();
    }
}