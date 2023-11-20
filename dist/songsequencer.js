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
        _this.phraseStartIndex = 0;
        _this.lastRowIndex = 0;
        _this.clips = [];
        _this.stepsInPhrase = 0;
        _this.clipStep = 0;
        return _this;
    }
    SongSequencer.prototype.step = function (loopStep) {
        this.updateClipData();
        this.absoluteStep += 1;
        var phraseStep = this.absoluteStep % this.stepsInPhrase;
        var allSteps = 0;
        for (var i = 0; i < this.clips.length; i++) {
            if (phraseStep < (this.clips[i].clipLength + allSteps)) {
                this.clip = this.clips[i];
                this.grooveBox.clipIndex = i + (this.rowIndex * 8);
                this.clipStep = phraseStep - allSteps;
                this.currentStep = this.clipStep;
                this.clip = this.clips[i];
                break;
            }
            else {
                allSteps += this.clips[i].clipLength;
            }
        }
        this.phraseStartIndex = this.rowIndex * 8;
        this.bar = Math.floor(this.absoluteStep / 16) % 8;
        this.update(this.absoluteStep);
        // console.log(this.rowIndex, this.bar, this.grooveBox.clipIndex)
    };
    SongSequencer.prototype.update = function (clipStep) {
        var clip = this.clip;
        // console.log("SongSequencer update", this.clip)
        if (clip != undefined &&
            clip.getStepAtPosition(this.clipStep) != undefined &&
            clip.getStepAtPosition(this.clipStep) != null) {
            var step = clip.getStepAtPosition(this.clipStep);
            var pitches = step.pitches;
            for (var i = 0; i < pitches.length; i++) {
                this.grooveBox.playPitch(pitches[i]);
            }
        }
    };
    SongSequencer.prototype.updateClipData = function () {
        console.log("updateClipData", this.rowIndex);
        this.lastRowIndex = this.rowIndex;
        this.clips = [];
        this.stepsInPhrase = 0;
        for (var i = 0; i < 8; i++) {
            var clip = this.grooveBox.clipSaver.savedClips[i + (this.rowIndex * 8)];
            if (clip != undefined) {
                this.clips[i] = clip;
                this.stepsInPhrase += clip.clipLength;
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
