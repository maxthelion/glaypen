import GrooveBox from "./groovebox";

export default class Clip {
    steps: number[] = [];

    constructor(groooveBox: GrooveBox, clipData: any) {
        this.steps = new Array(16);
        for (let i = 0; i < clipData.length; i++) {
            this.steps[clipData[i][0]] = clipData[i];
        }
    }
}