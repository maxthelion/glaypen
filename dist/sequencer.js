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
        if (this.grooveBox.manualPitchOptions.length > 0) {
            scalePitches = this.grooveBox.manualPitchOptions;
        }
        var stepsInBar = this.grooveBox.generatorParams.stepsInBar;
        var stepProbability = this.grooveBox.generatorParams.stepProbability / 128;
        var pitchRange = this.grooveBox.generatorParams.pitchRange;
        var octaveRange = this.grooveBox.generatorParams.octaveRange;
        var octaveProbability = this.grooveBox.generatorParams.octaveProbability / 128;
        if (currentStep % (16 / stepsInBar) == 0) {
            if (Math.random() <= (stepProbability)) {
                if (this.grooveBox.manualPitchOptions.length > 0) {
                    var pitchInterval = Math.floor(Math.random() * scalePitches.length);
                    var pitch = scalePitches[pitchInterval];
                }
                else {
                    var pitchInterval = Math.floor(Math.random() * pitchRange);
                    var pitch = tonic + scalePitches[pitchInterval];
                    if (Math.random() > (octaveProbability)) {
                        var octaveChange = Math.floor(Math.random() * octaveRange) - Math.floor(octaveRange / 2);
                        pitch += (octaveChange * 12);
                    }
                }
                // let chords  = {
                //     "Major Triad": [0, 4, 7],
                //     "Minor Triad": [0, 3, 7],
                //     "Diminished Triad": [0, 3, 6],
                //     "Augmented Triad": [0, 4, 8],
                //     "Major Seventh": [0, 4, 7, 11],
                //     "Minor Seventh": [0, 3, 7, 10],
                //     "Dominant Seventh": [0, 4, 7, 10],
                //     "Suspended Second": [0, 2, 7],
                //     "Suspended Fourth": [0, 5, 7],
                // }
                // let randomChord = Math.floor(Math.random() * Object.keys(chords).length);
                // let chord = chords[Object.keys(chords)[randomChord]];
                // for (let i = 0; i < chord.length; i++) {
                //     let chordPitch = pitch + chord[i];
                //     this.grooveBox.playPitch(chordPitch);
                // }
                this.grooveBox.playPitch(pitch);
                this.grooveBox.pitchHistory.addPitch(absoluteStep, pitch);
            }
        }
        this.grooveBox.pitchHistory.incrementMaxStep();
    };
    return Sequencer;
}());
export default Sequencer;
