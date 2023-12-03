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
    PitchGenerator.prototype.availableIntervals = function () {
        var scaleKey = this.generatorManager.currentGeneratorParams.scaleKey;
        var intervals = [];
        var tonic = this.generatorManager.currentGeneratorParams.tonic;
        for (var i = 0; i < this.availablePitches().length; i++) {
            var interval = scaleKey + i;
            intervals.push(i + tonic);
        }
        return intervals;
    };
    PitchGenerator.prototype.availablePitches = function () {
        var tonic = this.generatorManager.currentGeneratorParams.tonic;
        var scaleOctaveRoot = this.generatorManager.currentGeneratorParams.scaleOctaveRoot;
        var scaleKey = this.generatorManager.currentGeneratorParams.scaleKey;
        var scaleStart = scaleKey + (scaleOctaveRoot * 12);
        var scaleIndex = this.generatorManager.currentGeneratorParams.scaleIndex;
        var scalePitches = this.grooveBox.scales[scaleIndex][1];
        var pitchRange = this.generatorManager.currentGeneratorParams.pitchRange;
        var pitches = [];
        for (var i = 0; i < pitchRange; i++) {
            var pitch = scaleStart + scalePitches[((i + tonic) % scalePitches.length)];
            pitches.push(pitch);
        }
        return pitches;
    };
    PitchGenerator.prototype.getNextPitch = function () {
        var scaleOctaveRoot = this.generatorManager.currentGeneratorParams.scaleOctaveRoot;
        var scaleKey = this.generatorManager.currentGeneratorParams.scaleKey;
        var scaleStart = scaleKey + (scaleOctaveRoot * 12);
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
        var intervalProbabilities = this.generatorManager.getIntervalProbabilities();
        intervalProbabilities = intervalProbabilities.slice(tonic, pitchRange);
        if (intervalProbabilities != undefined && intervalProbabilities.length > 0) {
            pitchInterval = this.randomPitchIntervalFromProbabilities(intervalProbabilities);
            console.log("pitchInterval", pitchInterval, intervalProbabilities);
        }
        else {
            pitchInterval = pitchInterval % scalePitches.length;
        }
        var pitch = scaleStart + scalePitches[((pitchInterval + tonic) % scalePitches.length)];
        if (Math.random() > (octaveProbability)) {
            var octaveChange = Math.floor(Math.random() * octaveRange) - Math.floor(octaveRange / 2);
            pitch += (octaveChange * 12);
        }
        return pitch;
    };
    PitchGenerator.prototype.randomPitchIntervalFromProbabilities = function (intervalProbabilities) {
        var random = Math.random();
        var total = intervalProbabilities.reduce(function (a, b) { return a + b; }, 0);
        var sum = 0;
        for (var i = 0; i < intervalProbabilities.length; i++) {
            sum += intervalProbabilities[i];
            if (random <= sum / total) {
                return i;
            }
        }
        return 0;
    };
    return PitchGenerator;
}());
export default PitchGenerator;
