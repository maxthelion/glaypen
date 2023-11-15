import Clip, { ClipRawData } from "./clip.js";
import GrooveBox from "./groovebox.js";
import StorageBox from "./storagebox.js";

export default class ClipSaver {
    savedClips: Clip[] = [];
    grooveBox: GrooveBox;

    constructor(grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
        console.log("ClipSaver constructor", grooveBox.maxClips);
        this.savedClips = new Array(grooveBox.maxClips);
        let storedClips = this.getAllClipsFromStorage();
        storedClips.forEach((clipRawData, index) => {
            console.log(index)
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
        this.savedClips.splice(index, 1);
        this.grooveBox.storageBox.clearClipAtIndex(index);
    }

    getAllClipsFromStorage(): (ClipRawData| undefined)[] {
        let array = new Array(this.grooveBox.maxClips);
        for(let i = 0; i < this.grooveBox.maxClips; i++) {
            array[i] = this.grooveBox.storageBox.getClipAtIndex(i);
        }
        return array;
    }
}