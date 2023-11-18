var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Sequencer from "./sequencer.js";
var SongSequencer = /** @class */ (function (_super) {
    __extends(SongSequencer, _super);
    function SongSequencer(grooveBox) {
        var _this = _super.call(this, grooveBox) || this;
        _this.bar = 0;
        _this.rowIndex = 0;
        return _this;
    }
    SongSequencer.prototype.step = function (loopStep) {
        this.absoluteStep += 1;
        this.currentStep = this.absoluteStep % 16;
        this.bar = Math.floor(this.absoluteStep / 16) % 8;
        this.update(this.absoluteStep);
        this.grooveBox.clipIndex = this.bar + (this.rowIndex * 8);
        // console.log(this.rowIndex, this.bar, this.grooveBox.clipIndex)
    };
    SongSequencer.prototype.update = function (absoluteStep) {
        var clip = this.getClipForBar(this.bar);
        this.clip = clip;
        // console.log("SongSequencer update", this.clip)
        if (clip != undefined &&
            clip.getStepAtPosition(this.currentStep) != undefined &&
            clip.getStepAtPosition(this.currentStep) != null) {
            var step = clip.getStepAtPosition(this.currentStep);
            var pitches = step.pitches;
            for (var i = 0; i < pitches.length; i++) {
                this.grooveBox.playPitch(pitches[i]);
            }
        }
    };
    SongSequencer.prototype.getClipForBar = function (bar) {
        var clipIndex = (this.rowIndex * 8) + bar;
        console.log("getClipForBar", clipIndex, this.rowIndex, bar);
        for (var i = clipIndex; i >= this.rowIndex * 8; i--) {
            var clip = this.grooveBox.clipSaver.savedClips[i];
            if (clip != undefined) {
                this.grooveBox.clipIndex = i;
                return clip;
            }
        }
    };
    return SongSequencer;
}(Sequencer));
export default SongSequencer;
