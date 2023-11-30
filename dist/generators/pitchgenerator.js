var PitchGenerator = /** @class */ (function () {
    function PitchGenerator(grooveBox) {
        this.direction = 1;
        this.lastPitch = -1;
        this.grooveBox = grooveBox;
        this.generatorManager = this.grooveBox.generatorManager;
    }
    PitchGenerator.prototype.generateRandomPitch = function () {
        var pitch = 1;
        return pitch;
    };
    PitchGenerator.prototype.availablePitches = function () {
        var tonic = this.generatorManager.currentGeneratorParams.tonic;
        var scaleIndex = this.generatorManager.currentGeneratorParams.scaleIndex;
        var scalePitches = this.grooveBox.scales[scaleIndex][1];
        var pitchRange = this.generatorManager.currentGeneratorParams.pitchRange;
        var pitches = [];
        for (var i = 0; i < pitchRange; i++) {
            var pitch = tonic + scalePitches[i];
            pitches.push(pitch);
        }
        return pitches;
    };
    PitchGenerator.prototype.getNextPitch = function () {
        var scaleIndex = this.generatorManager.currentGeneratorParams.scaleIndex;
        var scalePitches = this.grooveBox.scales[scaleIndex][1];
        var tonic = this.generatorManager.currentGeneratorParams.tonic;
        var pitchRange = this.generatorManager.currentGeneratorParams.pitchRange;
        var octaveRange = this.generatorManager.currentGeneratorParams.octaveRange;
        var octaveProbability = this.generatorManager.currentGeneratorParams.octaveProbability / 128;
        if (this.lastPitch == -1) {
            this.lastPitch = tonic;
        }
        var pitchInterval = Math.floor(Math.random() * pitchRange);
        // var pitchInterval = this.lastPitch + this.direction;
        // if (pitchInterval < 0) {
        //     pitchInterval = 0;
        //     this.direction = 1;
        // } else if (pitchInterval > pitchRange - 1) {
        //     pitchInterval = pitchRange - 1;
        //     this.direction = -1;
        // }
        // this.lastPitch = pitchInterval;
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
