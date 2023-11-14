import GrooveBox from "./groovebox";
import Step from "./step";

export type ClipRawData = {
    clipData: any;
    color: string;
    clipLength: number;
    rawSteps: Step[];
}
export default class Clip {
    steps: Step[] = [];
    color: string = "#000000";
    clipData: any;
    originalSteps: Step[] = [];
    clipLength: number;
    
    constructor(groooveBox: GrooveBox, clipData: ClipRawData) {
        this.clipData = clipData;
        this.color = clipData.color || "#000000";
        this.clipLength = clipData.clipLength || 16;
        this.steps = new Array(this.clipLength);
        for (let i = 0; i < this.clipLength; i++) {
            this.steps[i] = clipData.rawSteps[i];
        }
        this.originalSteps = this.steps.slice();
    }

    clipRawData(): ClipRawData {
        return this.clipData
    }

    shiftLeft() {
        this.steps.push(this.steps.shift()!);
    }

    shiftRight() {
        this.steps.unshift(this.steps.pop()!);
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
    }

    availablePitches(): number[] {
        let pitches : number[]= []
        this.originalSteps.forEach((step) => {
            if (step != undefined) {
                pitches.concat(step.pitches);
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
        let steps = this.steps.filter((step) => {
            return step != undefined
        })
        let availableStepsNumbers = new Array(16);
        for(let i = 0; i < availableStepsNumbers.length; i++) {
            availableStepsNumbers[i] = i;
        }
        this.steps = new Array(16);
        steps.forEach((step) => {
            let randomStepIndex = Math.floor(Math.random() * availableStepsNumbers.length);
            let randomStep = availableStepsNumbers.splice(randomStepIndex, 1);
            this.steps[randomStep] = step;
        });
    }

    density(): number {
        let density = 0;
        this.steps.forEach((step) => {
            if (step != undefined) {
                density++;
            }
        });
        return density;
    }

    getClipLength(): number {
        return this.steps.length;
    }

    // this.grooveBox.setClipEnd(parseInt(value));

    setClipDensity(density: number) {
        let currentDensity = this.density();
        let densityDifference = density - currentDensity;
        if (densityDifference > 0) {
            this.addSteps(densityDifference);
        } else if (densityDifference < 0) {
            for (let i = 0; i < Math.abs(densityDifference); i++) {
                let randomStep = Math.floor(Math.random() * this.steps.length);
                this.steps[randomStep] = undefined;
            }
        }
    }

    addSteps(stepsToAdd: number) {
        let unnocupiedSteps = [];
        for (let i = 0; i < this.steps.length; i++) {
            if (this.steps[i] == undefined) {
                unnocupiedSteps.push(i);
            }
        }
        for (let i = 0; i < stepsToAdd; i++) {
            let unnocupiedStepIndex = unnocupiedSteps.splice(Math.floor(Math.random() * unnocupiedSteps.length), 1);
            console.log("unnocupiedStepIndex", unnocupiedStepIndex)
            this.steps[unnocupiedStepIndex] = [unnocupiedStepIndex, this.randomUsedPitch()];
        }
    }

    setLength(length: number){


    }

}