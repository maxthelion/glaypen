var PitchGenerator = /** @class */ (function () {
    function PitchGenerator(grooveBox) {
        this.grooveBox = grooveBox;
    }
    PitchGenerator.prototype.generateRandomPitch = function () {
        var pitch = 1;
        return pitch;
    };
    PitchGenerator.prototype.availablePitches = function () {
        var tonic = this.grooveBox.generatorParams.tonic;
        var scaleIndex = this.grooveBox.generatorParams.scaleIndex;
        var scalePitches = this.grooveBox.scales[scaleIndex][1];
        var pitchRange = this.grooveBox.generatorParams.pitchRange;
        var pitches = [];
        for (var i = 0; i < pitchRange; i++) {
            var pitch = tonic + scalePitches[i];
            pitches.push(pitch);
        }
        return pitches;
    };
    return PitchGenerator;
}());
export default PitchGenerator;
