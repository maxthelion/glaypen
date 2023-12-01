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
var ChordGenerator = /** @class */ (function (_super) {
    __extends(ChordGenerator, _super);
    function ChordGenerator(grooveBox) {
        return _super.call(this, grooveBox) || this;
    }
    ChordGenerator.prototype.availablePitches = function () {
        var chords = this.grooveBox.chords;
        var chordKey = this.grooveBox.generatorManager.getNumberAttribute("chordKey");
        var chordOctaveRoot = this.grooveBox.generatorManager.getNumberAttribute("chordOctaveRoot");
        var chordScaleIndex = this.grooveBox.generatorManager.getNumberAttribute("chordScaleIndex");
        var chordRoot = this.grooveBox.generatorManager.getNumberAttribute("chordRoot");
        var chordIndex = this.grooveBox.generatorManager.getNumberAttribute("chordIndex");
        var scaleStart = chordKey + (chordOctaveRoot * 12);
        var scalePitches = this.grooveBox.scales[chordScaleIndex][1];
        var chordPitches = chords[chordIndex][1];
        var pitches = [];
        for (var i = 0; i < chordPitches.length; i++) {
            var pitch = scaleStart + chordPitches[i] + chordRoot;
            pitches.push(pitch);
        }
        return pitches;
    };
    ChordGenerator.prototype.getNextPitch = function () {
        var pitches = this.availablePitches();
        var pitchRange = pitches.length;
        var pitchInterval = Math.floor(Math.random() * pitchRange);
        var pitch = pitches[pitchInterval];
        return pitch;
    };
    return ChordGenerator;
}(PitchGenerator));
export default ChordGenerator;
