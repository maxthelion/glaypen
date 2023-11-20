import GrooveBox from "./groovebox.js";
import Sequencer from "./sequencer.js";
import Step from "./step.js";

class Part {
    pitch: number;
    stepWeights: number[];
    occupiedSteps: number[] = []
    density: number;

    constructor(pitch: number, stepWeights: number[], density: number) {
        this.pitch = pitch;
        this.stepWeights = stepWeights;
        this.density = density;
    }

    generatePitchFor(stepNumber: number) {
        if(stepNumber % 16 == 0) {
            this.generateOccupiedSteps();
        }
        if (this.occupiedSteps.indexOf(stepNumber % 16) == -1) {
            return undefined;
        }
        return this.pitch;
    }

    generateOccupiedSteps() {
        let totalStepWeights = this.stepWeights.reduce((a, b) => a + b, 0);
        this.occupiedSteps = [];
        for (let index = 0; index < this.density; index++) {
            let randomWeight = Math.floor(Math.random() * totalStepWeights);
            let currentWeight = 0;
            for (let stepNumber = 0; stepNumber < this.stepWeights.length; stepNumber++) {
                currentWeight += this.stepWeights[stepNumber];
                if (randomWeight < currentWeight) {
                    this.occupiedSteps.push(stepNumber);
                    break;
                }
            }
        }
    }
}

export default class DrumSequencer extends Sequencer {
    parts : Part[] = [];

    constructor(grooveBox: GrooveBox) {
        super(grooveBox);
        this.parts = [];
        // this.parts.push(new Part(60, 
        //                             [10, 3, 5, 9, 10, 0, 5, 0, 10, 0, 3, 5, 10, 0, 0, 4],
        //                             5
        //                             ));
        // this.parts.push(new Part(62, [0, 0, 0, 0, 1, 0, 0, 0.3, 0, 0, 0, 0.5, 1, 0.3, 0.4, 0.2], 3));
        // this.parts.push(new Part(66, [0.3, 0.5, 1, 0.5, 1, 0.2, 1, 0.3, 1, 0.5, 1, 0, 1, 0.8, 1, 0], 12));
        // this.parts.push(new Part(68, [0.3, 0.5, 1, 0.5, 1, 0.2, 1, 0.3, 1, 0.5, 1, 0, 1, 0.8, 1, 0], 2));
        // this.parts.push(new Part(61, [0.3, 0.5, 1, 0.5, 1, 0.2, 1, 0.3, 1, 0.5, 1, 0, 1, 0.8, 1, 0], 1));
        
        this.parts.push(new Part(60, 
            [10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 4],
            4
            ));
this.parts.push(new Part(62, [0, 0, 0, 0, 1, 0, 0, 0.3, 0, 0, 0, 0.5, 1, 0, 0, 0], 5));
this.parts.push(new Part(66, [0.3, 0.5, 1, 0.5, 1, 0.2, 1, 0.3, 1, 0.5, 1, 0, 1, 0.8, 1, 0], 16));
this.parts.push(new Part(68, [0.3, 0.5, 1, 0.5, 1, 0.2, 1, 0.3, 1, 0.5, 1, 0, 1, 0.8, 1, 0], 5));
this.parts.push(new Part(61, [0.3, 0.5, 1, 0.5, 1, 0.2, 1, 0.3, 1, 0.5, 1, 0, 1, 0.8, 1, 0], 5));
    }

    step(loopStep: number) {
        this.absoluteStep += 1;
        this.currentStep = this.absoluteStep % 16;
        this.update(this.absoluteStep);
    }

    update(absoluteStep: number) {

        let pitches :number[] = []
        this.parts.forEach((part) => {
            let pitch = part.generatePitchFor(this.currentStep );
            if (pitch != undefined) {
                pitches.push(pitch - 24);
            }
        })
        // console.log("update", absoluteStep);
        let currentStep = absoluteStep % 16;
        let step = new Step(currentStep, 120 - Math.floor(Math.random() * 40), pitches);
                
        this.grooveBox.playStep(step);
        this.grooveBox.pitchHistory.addStep(absoluteStep, step);
        this.grooveBox.pitchHistory.incrementMaxStep();
    }
}