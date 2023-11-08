var Sequencer = /** @class */ (function () {
    function Sequencer(grooveBox) {
        this.grooveBox = grooveBox;
        this.tonic = 48;
        this.minorScalePitches = [0, 2, 3, 5, 7, 8, 10];
        this.currentStep = 0;
        this.clip = undefined;
    }
    Sequencer.prototype.step = function (step) {
        this.currentStep = step % 16;
        this.update(step, step);
    };
    Sequencer.prototype.update = function (currentStep, absoluteStep) {
        if (Math.random() > 0.2) {
            console.log("Sequencer update", absoluteStep);
            var pitchInterval = Math.floor(Math.random() * 4);
            var octave = Math.floor(Math.random() * 3);
            var pitch = this.tonic + this.minorScalePitches[pitchInterval] + (octave * 12);
            this.grooveBox.playPitch(pitch);
            this.grooveBox.pitchHistory.addPitch(absoluteStep, pitch);
        }
        else {
            this.grooveBox.pitchHistory.incrementMaxStep();
        }
    };
    return Sequencer;
}());
export default Sequencer;
