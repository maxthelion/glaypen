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
var ClipSequencer = /** @class */ (function (_super) {
    __extends(ClipSequencer, _super);
    function ClipSequencer(grooveBox, clip) {
        var _this = _super.call(this, grooveBox) || this;
        _this.clip = clip;
        return _this;
    }
    ClipSequencer.prototype.step = function (step) {
        this.currentStep = step % this.clip.getClipLength();
        this.update();
    };
    ClipSequencer.prototype.update = function () {
        // console.log("ClipSequencer update", this.clip)
        if (this.clip.steps[this.currentStep] != undefined) {
            var pitches = this.clip.steps[this.currentStep].pitches;
            for (var i = 0; i < pitches.length; i++) {
                this.grooveBox.playPitch(pitches[i]);
            }
        }
    };
    return ClipSequencer;
}(Sequencer));
export default ClipSequencer;
