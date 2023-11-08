export default class PitchHistory {
    pitches: MidiStepPitchPair[] = [];
    maxStep = 0;

    constructor() {
        this.pitches = [];
    }
    addPitch(step: number,pitch: number) {
        this.pitches.push([step, pitch]);
        this.incrementMaxStep();
    }

    incrementMaxStep() {
        this.maxStep += 1;
    }

    stepsForWindow(windowStart:number) {
        let minStep = windowStart;
        let selectedSteps = this.pitches.filter((midiStepPitchPair) => {
            return midiStepPitchPair[0] > minStep && midiStepPitchPair[0] <= minStep + 16;
        });
        selectedSteps = selectedSteps.map((midiStepPitchPair) => {
            return [midiStepPitchPair[0] - minStep, midiStepPitchPair[1]];
        })
        return selectedSteps;
    }
}

type MidiStepPitchPair = [number, number];