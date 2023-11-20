import Clip from "./clip.js";
var ClipSaver = /** @class */ (function () {
    function ClipSaver(grooveBox) {
        this.savedClips = [];
        this.grooveBox = grooveBox;
        console.log("ClipSaver constructor", grooveBox.maxClips);
        this.loadClipsArray();
        console.log("ClipSaver constructor", this.savedClips);
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
    ClipSaver.prototype.clearClipAtIndex = function (index) {
        //this.savedClips.splice(index, 1)
        this.grooveBox.storageBox.clearClipAtIndex(index);
        this.loadClipsArray();
    };
    ClipSaver.prototype.loadClipsArray = function () {
        var _this = this;
        this.savedClips = new Array(this.grooveBox.maxClips);
        var storedClips = this.getAllClipsFromStorage();
        storedClips.forEach(function (clipRawData, index) {
            // console.log(index)
            if (clipRawData !== undefined) {
                var clip = new Clip(_this.grooveBox, clipRawData);
                _this.savedClips[index] = clip;
            }
        });
    };
    ClipSaver.prototype.getAllClipsFromStorage = function () {
        var array = new Array(this.grooveBox.maxClips);
        for (var i = 0; i < this.grooveBox.maxClips; i++) {
            array[i] = this.grooveBox.storageBox.getClipAtIndex(i);
        }
        return array;
    };
    return ClipSaver;
}());
export default ClipSaver;
