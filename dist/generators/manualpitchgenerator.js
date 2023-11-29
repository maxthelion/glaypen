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
import PitchGenerator from "./pitchgenerator.js";
var ManualPitchGenerator = /** @class */ (function (_super) {
    __extends(ManualPitchGenerator, _super);
    function ManualPitchGenerator(grooveBox) {
        return _super.call(this, grooveBox) || this;
    }
    ManualPitchGenerator.prototype.availablePitches = function () {
        var pitches = this.grooveBox.manualPitchOptions;
        return pitches;
    };
    ManualPitchGenerator.prototype.getNextPitch = function () {
        var chordIndex = this.grooveBox.generatorParams.chordIndex;
        var scalePitches = this.grooveBox.chords[chordIndex][1];
        var root = this.grooveBox.generatorParams.chordRoot;
        var pitchRange = scalePitches.length;
        // let octaveRange = this.grooveBox.generatorParams.octaveRange;
        // let octaveProbability = this.grooveBox.generatorParams.octaveProbability / 128;
        var pitchInterval = Math.floor(Math.random() * pitchRange);
        pitchInterval = pitchInterval % scalePitches.length;
        var pitch = root + scalePitches[pitchInterval];
        return pitch;
    };
    return ManualPitchGenerator;
}(PitchGenerator));
export default ManualPitchGenerator;
