import Clip, { ClipRawData } from "./clip.js";
import GrooveBox from "./groovebox.js";

export default class ClipSaver {
    savedClips: Clip[] = new Array(16);
    grooveBox: GrooveBox;

    constructor(grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        let storedClips = this.grooveBox.storageBox.getAllClips();
        storedClips.forEach((ClipRawData, index) => {
            console.log(`clip ${index}`, ClipRawData);
            if (ClipRawData !== undefined) {
                let clip = new Clip(this.grooveBox, ClipRawData.clipData);
                clip.color = ClipRawData.color;
                this.savedClips[index] = clip;
            }
        });
    }

    saveClipToIndex(clip: Clip, index: number) {
        // throw new Error(`Index ${index} is out of bounds`);
        let clipRawData : ClipRawData = clip.clipRawData();
        this.grooveBox.storageBox.setClipAtIndex(clipRawData, index);
        this.savedClips[index] = clip;
    }

    clipIndexes() {
        return this.savedClips.map((clip, index) => index);
    }

    clipAtIndex(index: number) {
        return this.savedClips[index];
    }
}