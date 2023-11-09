import GrooveBox from "./groovebox";

export default class Clip {
    steps: number[] = [];
    color: string = "#000000";
    
    constructor(groooveBox: GrooveBox, clipData: any) {
        this.steps = new Array(16);
        for (let i = 0; i < clipData.length; i++) {
            this.steps[clipData[i][0]] = clipData[i];
        }
    }
}