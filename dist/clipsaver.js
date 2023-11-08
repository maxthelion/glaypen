var ClipSaver = /** @class */ (function () {
    function ClipSaver(grooveBox) {
        this.savedClips = new Array(16);
        this.grooveBox = grooveBox;
    }
    ClipSaver.prototype.saveClipToIndex = function (clip, index) {
        console.log("saveClipToIndex", clip, index);
        this.savedClips[index] = clip;
    };
    ClipSaver.prototype.clipIndexes = function () {
        return this.savedClips.map(function (clip, index) { return index; });
    };
    return ClipSaver;
}());
export default ClipSaver;
