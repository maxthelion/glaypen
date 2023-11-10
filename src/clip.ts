import GrooveBox from "./groovebox";

export type ClipRawData = {
    clipData: any;
    color: string;
}
export default class Clip {
    steps: number[] = [];
    color: string = "#000000";
    clipData: any;
    
    constructor(groooveBox: GrooveBox, clipData: any) {
        this.clipData = clipData;
        this.steps = new Array(16);
        for (let i = 0; i < clipData.length; i++) {
            this.steps[clipData[i][0]] = clipData[i];
        }
    }

    clipRawData(): ClipRawData {
        return {
            clipData: this.clipData,
            color: this.color
        }
    }
}