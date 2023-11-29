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
        // console.log("addStep", stepNumber, step);
        step.stepNumber = stepNumber;
        this.steps[stepNumber] = step;
    }

    moveWindow(direction: number) {
        if (this.windowStart != undefined){
            let newWindowStart = this.windowStart + direction;
            if (newWindowStart >= 0 && newWindowStart <= this.maxStep - this.windowLength){
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

    moveWindowToPosition(position: number) {
        let midIndex = Math.floor(position * this.maxStep)
        let startIndex = midIndex - Math.floor(this.windowLength / 2);
        let endIndex = startIndex + this.windowLength;
        if (startIndex < 0) {
            startIndex = 0;
        } else if (endIndex > this.maxStep) {
            startIndex = this.maxStep - this.windowLength;
        }
        // console.log(startIndex)
        this.windowStart = startIndex;
    }

    clearWindow() {
        this.windowStart = undefined;
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
                let step = this.steps[i];
                step.stepNumber = i - minStep;
                clipData.rawSteps[i - minStep] = step;

            }
        }
        return clipData;
    }

    stepsForCurrentWindow(): ClipRawData {
        if (this.windowStart === undefined) {
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