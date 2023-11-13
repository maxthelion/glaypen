export default class Step {
    pitches: number[] = [];
    velocity: number = 0;
    stepNumber: number;

    constructor(stepNumber: number, velocity: number, pitches: number[]) {
        this.stepNumber = stepNumber;
        this.velocity = velocity;
        this.pitches = pitches;
    }

}