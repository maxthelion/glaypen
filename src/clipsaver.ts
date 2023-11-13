import Clip, { ClipRawData } from "./clip.js";
import GrooveBox from "./groovebox.js";

export default class ClipSaver {
    savedClips: Clip[] = [];
    grooveBox: GrooveBox;

    constructor(grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        this.savedClips = new Array(grooveBox.maxClips);
        let storedClips = this.grooveBox.storageBox.getAllClips();
        storedClips.forEach((clipRawData, index) => {
            if (clipRawData !== undefined) {
                let clip = new Clip(this.grooveBox, clipRawData);
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

    clearClipAtIndex(index: number) {
        this.savedClips[index] = undefined;
        this.grooveBox.storageBox.clearClipAtIndex(index);
    }
}