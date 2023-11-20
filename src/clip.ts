import GrooveBox from "./groovebox";
import Step from "./step.js";

export type StepRawData = {
    pitches: number[];
    velocity: number;
    stepNumber: number;
}
export type ClipRawData = {
    color: string;
    clipLength: number;
    rawSteps: StepRawData[];
}
export default class Clip {
    index: number = 0;
    steps: (Step | null | undefined)[] = [];
    color: string = "#000000";
    clipData: any;
    originalSteps: (Step | null | undefined)[] = [];
    clipLength: number;
    grooveBox: GrooveBox;
    
    constructor(groooveBox: GrooveBox, clipData: ClipRawData) {
        this.grooveBox = groooveBox;
        this.clipData = clipData;
        this.color = clipData.color || "#000000";
        this.clipLength = clipData.clipLength || 16;
        this.steps = new Array(this.clipLength);
        for (let i = 0; i < this.clipLength; i++) {
            let rawStep = clipData.rawSteps[i];
            if (rawStep !== undefined && rawStep !== null) {
                this.steps[rawStep.stepNumber] = new Step(i, rawStep.velocity, rawStep.pitches);
            }
        }
        this.originalSteps = this.steps.slice();
    }

    clipRawData(): ClipRawData {
        this.clipData.clipLength = this.clipLength;
        this.clipData.rawSteps = this.generateRawSteps();
        return this.clipData
    }

    generateRawSteps(): StepRawData[] {
        let steps: StepRawData[] = [];
        for(let i = 0; i < this.steps.length; i++) {
            if (this.steps[i] != undefined && this.steps[i] != null) {
                let step = this.steps[i]!;
                step.stepNumber = i;
                steps.push(step!.stepRawData());
            } 
        }
        return steps;
    }

    shiftLeft() {
        console.log("shiftLeft", this.steps)
        this.steps.push(this.steps.shift()!);
        this.save();
    }

    shiftRight() {
        this.steps.unshift(this.steps.pop()!);
        this.save();
    }

    shufflePitches() {
        console.log("shufflePitches", this.steps)
        let pitches = this.availablePitches();
        this.steps.forEach((step) => {
            console.log("step", pitches)
            if (step != undefined) {
                let randomPitch = pitches[Math.floor(Math.random() * pitches.length)];
                step.pitches = [randomPitch];
            }
        });
        this.save();
    }

    availablePitches(): number[] {
        let pitches : number[]= []
        this.originalSteps.forEach((step) => {
            if (step !== undefined && step !== null) {
                step.pitches.forEach((pitch) => {
                    pitches.push(pitch);
                })
            }
        })
        return pitches;
    }

    randomUsedPitch(): number {
        let pitches = this.availablePitches();
        return pitches[Math.floor(Math.random() * pitches.length)];
    }

    shuffleSteps() {
        console.log("shuffleSteps", this.steps)
        let occupiedSteps = this.getOccupiedSteps();
        let availableStepsNumbers : number[] = new Array(this.getClipLength());
        for(let i = 0; i < availableStepsNumbers.length; i++) {
            availableStepsNumbers[i] = i;
        }
        // make a new steps array
        this.steps = new Array(this.getClipLength());
        occupiedSteps.forEach((step) => {
            let randomStepIndex = Math.floor(Math.random() * availableStepsNumbers.length);
            let newStepIndex: number = availableStepsNumbers.splice(randomStepIndex, 1)[0];
            this.steps[newStepIndex] = step;
        });
        this.save();
    }

    getOccupiedSteps(): Step[] {
        return this.steps.filter((step) => {
            return step != undefined && step != null;
        })
    }

    getOccupiedStepIndexes(): number[] {
        let occupiedStepIndexes: number[] = [];
        this.steps.forEach((step, index) => {
            if (step != undefined && step != null) {
                occupiedStepIndexes.push(index);
            }
        })
        return occupiedStepIndexes;
    }

    getDensity(): number {
        let density = 0;
        this.steps.forEach((step) => {
            if (step != undefined && step != null) {
                density++;
            }
        });
        return density;
    }

    densityPercentage(): number {
        return this.getDensity() / this.getClipLength();
    }

    getClipLength(): number {
        return this.steps.length;
    }

    // this.grooveBox.setClipEnd(parseInt(value));

    setClipDensity(density: number) {
        console.log("setClipDensity", density)
        let currentDensity = this.getDensity();
        let requiredDensity = Math.round(density * this.getClipLength());
        let densityDifferenceInSteps = requiredDensity - currentDensity;
        console.log("densityDifferenceInSteps", densityDifferenceInSteps)
        if (densityDifferenceInSteps > 0) {
            this.addSteps(densityDifferenceInSteps);
        } else if (densityDifferenceInSteps < 0) {
            let occupiedStepIndexes = this.getOccupiedStepIndexes()
            for (let i = 0; i < Math.abs(densityDifferenceInSteps); i++) {
                let randomStep = Math.floor(Math.random() * occupiedStepIndexes.length);
                let indexForDeletion = occupiedStepIndexes.splice(randomStep, 1)[0];
                this.steps[indexForDeletion] = undefined;
            }
        }
        this.save();
    }

    setClipLength(length: number) {
        console.log("setClipLength", length)
        this.clipLength = length;
        if (this.steps.length < length) {
            let newSteps = new Array(length);
            newSteps.splice(0, this.originalSteps.length, ...this.originalSteps);
            this.steps = newSteps;
            console.log("this.steps", this.steps)
        } else if (this.steps.length > length) {
            this.steps = this.steps.slice(0, length);
        }
        this.save();
    }

    getStepAtPosition(position: number): Step | null | undefined {
        return this.steps[position % this.steps.length];
    }

    addSteps(stepsToAdd: number) {
        let unnocupiedSteps = [];
        for (let i = 0; i < this.steps.length; i++) {
            if (this.steps[i] == undefined || this.steps[i] == null) {
                unnocupiedSteps.push(i);
            }
        }
        for (let i = 0; i < stepsToAdd; i++) {
            let unnocupiedStepIndex = unnocupiedSteps.splice(Math.floor(Math.random() * unnocupiedSteps.length), 1)[0];
            console.log("unnocupiedStepIndex", unnocupiedStepIndex)
            this.steps[unnocupiedStepIndex] = new Step(unnocupiedStepIndex, 100, [this.randomUsedPitch()]);
        }
    }

    setLength(length: number){


    }

    getParam(param: string): number {
        return this.clipData[param];
    }
    
    save() {
        this.grooveBox.saveClip(this)
    }
}