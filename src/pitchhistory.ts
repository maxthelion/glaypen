import Clip, { ClipRawData } from "./clip";
import Step from "./step";

export default class PitchHistory {
    pitches: MidiStepPitchPair[] = [];
    maxStep = 0;
    windowStart: number | undefined;
    windowLength: number;
    steps: Step[] = [];

    constructor() {
        this.pitches = [];
        this.windowStart = undefined;
        this.windowLength = 16;
    }

    addPitch(step: number,pitch: number) {
        this.pitches.push([step, pitch]);
    }

    addStep(stepNumber: number,step: Step) {
        console.log("addStep", stepNumber, step);
        this.steps[stepNumber] = step;
    }

    moveWindow(direction: number) {
        if (this.windowStart != undefined){
            let newWindowStart = this.windowStart + direction;
            if (newWindowStart > 0 && newWindowStart <= this.maxStep - this.windowLength){
                this.windowStart = newWindowStart;
            }
        } else {
            let clipWindowLength = this.windowLength;
            let minStep = this.maxStep - clipWindowLength;
            if (minStep < 0) {
                minStep = 0;
            }
            this.windowStart = minStep;
        }
    }

    incrementMaxStep() {
        this.maxStep += 1;
    }

    stepsForWindow(windowStart:number): ClipRawData {
        let minStep = windowStart;
        let clipData: ClipRawData = {
            clipData: {},
            color: "#000000",
            clipLength: this.windowLength,
            rawSteps: new Array(this.windowLength)
        };
        for (let i = minStep; i < minStep + this.windowLength; i++) {
            if (this.steps[i] != undefined) {
                clipData.rawSteps[i - minStep] = this.steps[i];
            }
        }
        return clipData;
    }

    stepsForCurrentWindow(): ClipRawData {
        if (this.windowStart == undefined) {
            return this.stepsForWindow(this.maxStep - this.windowLength)
        } else {
            return this.stepsForWindow(this.windowStart);
        }
    }

    setLength(length: number) {
        this.windowLength = length;
    }
}

type MidiStepPitchPair = [number, number];