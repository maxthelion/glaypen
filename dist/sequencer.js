var Sequencer = /** @class */ (function () {
    function Sequencer(grooveBox) {
        this.grooveBox = grooveBox;
        this.minorScalePitches = [0, 2, 3, 5, 7, 8, 10];
        this.currentStep = 0;
        this.clip = undefined;
    }
    Sequencer.prototype.step = function (step) {
        this.currentStep = step % 16;
        this.update(step, step);
    };
    Sequencer.prototype.update = function (absoluteStep) {
        var currentStep = absoluteStep % 16;
        var tonic = this.grooveBox.generatorParams.tonic;
        var scaleIndex = this.grooveBox.generatorParams.scaleIndex;
        var scalePitches = this.grooveBox.scales[scaleIndex][1];
        var stepsInBar = this.grooveBox.generatorParams.stepsInBar;
        var stepProbability = this.grooveBox.generatorParams.stepProbability / 128;
        var pitchRange = this.grooveBox.generatorParams.pitchRange;
        var octaveRange = this.grooveBox.generatorParams.octaveRange;
        var octaveProbability = this.grooveBox.generatorParams.octaveProbability;
        if (currentStep % (16 / stepsInBar) == 0) {
            if (Math.random() <= (stepProbability)) {
                console.log("Sequencer update", absoluteStep);
                var pitchInterval = Math.floor(Math.random() * pitchRange);
                var pitch = tonic + scalePitches[pitchInterval];
                if (Math.random() > (octaveProbability)) {
                    pitch += Math.floor(Math.random() * octaveRange) * 12;
                }
                this.grooveBox.playPitch(pitch);
                this.grooveBox.pitchHistory.addPitch(absoluteStep, pitch);
            }
        }
        this.grooveBox.pitchHistory.incrementMaxStep();
    };
    return Sequencer;
}());
export default Sequencer;
