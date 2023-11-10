import Clip from "./clip.js";
var ClipSaver = /** @class */ (function () {
    function ClipSaver(grooveBox) {
        var _this = this;
        this.savedClips = new Array(16);
        this.grooveBox = grooveBox;
        var storedClips = this.grooveBox.storageBox.getAllClips();
        storedClips.forEach(function (ClipRawData, index) {
            console.log("clip ".concat(index), ClipRawData);
            if (ClipRawData !== undefined) {
                var clip = new Clip(_this.grooveBox, ClipRawData.clipData);
                clip.color = ClipRawData.color;
                _this.savedClips[index] = clip;
            }
        });
    }
    ClipSaver.prototype.saveClipToIndex = function (clip, index) {
        // throw new Error(`Index ${index} is out of bounds`);
        var clipRawData = clip.clipRawData();
        this.grooveBox.storageBox.setClipAtIndex(clipRawData, index);
        this.savedClips[index] = clip;
    };
    ClipSaver.prototype.clipIndexes = function () {
        return this.savedClips.map(function (clip, index) { return index; });
    };
    ClipSaver.prototype.clipAtIndex = function (index) {
        return this.savedClips[index];
    };
    return ClipSaver;
}());
export default ClipSaver;
