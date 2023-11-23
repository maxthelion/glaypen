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
    PitchGenerator.prototype.getNextPitch = function () {
        var scaleIndex = this.grooveBox.generatorParams.scaleIndex;
        var scalePitches = this.grooveBox.scales[scaleIndex][1];
        var tonic = this.grooveBox.generatorParams.tonic;
        var pitchRange = this.grooveBox.generatorParams.pitchRange;
        var octaveRange = this.grooveBox.generatorParams.octaveRange;
        var octaveProbability = this.grooveBox.generatorParams.octaveProbability / 128;
        var pitchInterval = Math.floor(Math.random() * pitchRange);
        pitchInterval = pitchInterval % scalePitches.length;
        var pitch = tonic + scalePitches[pitchInterval];
        if (Math.random() > (octaveProbability)) {
            var octaveChange = Math.floor(Math.random() * octaveRange) - Math.floor(octaveRange / 2);
            pitch += (octaveChange * 12);
        }
        return pitch;
    };
    return PitchGenerator;
}());
export default PitchGenerator;
