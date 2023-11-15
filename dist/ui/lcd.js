var LCD = /** @class */ (function () {
    function LCD(ui, grooveBox) {
        this.htmlCanvas = document.querySelector("#lcd");
        this.ctx = this.htmlCanvas.getContext("2d");
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.canvasWidth = this.htmlCanvas.width;
        this.canvasHeight = this.htmlCanvas.height;
        // this.htmlCanvas.addEventListener("wheel", this.ui.onWheel.bind(this.ui));
    }
    LCD.prototype.update = function () {
        var _this = this;
        if (this.ctx !== null) {
            this.ctx.clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
            var stepHeight = this.canvasHeight / 128;
            if (this.grooveBox.modeIndex !== 0) {
                var clip = this.grooveBox.sequencer.clip;
                this.htmlCanvas.style.backgroundColor = clip.color;
                var stepWidth = this.canvasWidth / clip.clipLength;
                clip.steps.forEach(function (step, index) {
                    if (step !== undefined && step !== null) {
                        if (index === _this.grooveBox.sequencer.currentStep) {
                            _this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
                        }
                        else {
                            _this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                        }
                        _this.renderStepPitches(step, index, stepWidth, stepHeight);
                    }
                });
            }
            else {
                var maxStep = this.grooveBox.pitchHistory.maxStep;
                var windowLength = this.grooveBox.pitchHistory.windowLength;
                var stepWidth = this.canvasWidth / windowLength;
                this.grooveBox.pitchHistory.stepsForCurrentWindow().rawSteps.forEach(function (step, index) {
                    // console.log("step", step);
                    _this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
                    _this.renderStepPitches(step, index, stepWidth, stepHeight);
                });
            }
        }
    };
    LCD.prototype.renderStepPitches = function (step, index, stepWidth, stepHeight) {
        var _this = this;
        step.pitches.forEach(function (pitch) {
            if (pitch !== null) {
                _this.ctx.fillRect(index * stepWidth, (128 - step.pitches[0]) * stepHeight, stepWidth, stepHeight);
            }
        });
    };
    return LCD;
}());
export default LCD;
