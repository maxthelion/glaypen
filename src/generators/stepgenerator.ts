import GrooveBox from "../groovebox";

export default class StepGenerator {
    grooveBox: GrooveBox;

    constructor(grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
    }

    // stepProbability(step: number) {
    //     return this.grooveBox.generatorParams.stepProbability / 128;
    // }

    stepProbability(step: number) {
        let probability = this.euclidianRhythm(9, 16)[step]
        console.log("stepProbability", step, probability)
        return probability;
    }   

    euclidianRhythm(pulses: number, totalSteps: number): number[] {
        var groups: number[][] = [];
        for (let i = 0; i < totalSteps; i++) {
            groups.push([Number(i < pulses)]);
        }

        let l: number;
        while (l = groups.length - 1) {
            let start = 0, first = groups[0];
            while (start < l && this.compareArrays(first, groups[start])) {
                start++;
            }
            if (start === l) {
                break;
            }
            let end = l, last = groups[l];
            while (end > 0 && this.compareArrays(last, groups[end])) {
                end--;
            }
            if (end === 0) {
                break;
            }

            const count = Math.min(start, l - end);
            groups = [
                ...groups.slice(0, count).map((group, i) => group.concat(groups[l - i])),
                ...groups.slice(count, -count)
            ];
        }
        return groups.flat();
    };

    compareArrays(a: number[], b: number[]): boolean {
        return a.map(a => a.toString()).join('') === b.map(a => a.toString()).join('');
    };



}