import Clip from "./clip.js";
import GrooveBox from "./groovebox.js";

export default class ClipSaver {
    savedClips: Clip[] = new Array(16);
    grooveBox: GrooveBox;

    constructor(grooveBox: GrooveBox) {
        this.grooveBox = grooveBox;
    }

    saveClipToIndex(clip: Clip, index: number) {
        console.log("saveClipToIndex", clip, index);
        this.savedClips[index] = clip;
    }

    clipIndexes() {
        return this.savedClips.map((clip, index) => index);
    }
}