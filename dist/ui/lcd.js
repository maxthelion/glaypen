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
        var _a, _b;
        if (this.ctx !== null) {
            this.ctx.clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
            this.drawOctaves();
            var stepHeight = this.canvasHeight / 128;
            if (this.grooveBox.modeIndex === 1 || this.grooveBox.modeIndex === 2) {
                var clip = (_a = this.grooveBox.clipSequencer) === null || _a === void 0 ? void 0 : _a.clip;
                this.htmlCanvas.style.backgroundColor = clip.color;
                var stepWidth = this.canvasWidth / clip.clipLength;
                clip.steps.forEach(function (step, index) {
                    var _a;
                    if (step !== undefined && step !== null) {
                        if (index === ((_a = _this.grooveBox.clipSequencer) === null || _a === void 0 ? void 0 : _a.currentStep)) {
                            _this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
                        }
                        else {
                            _this.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
                        }
                        _this.renderStepPitches(step, step.stepNumber, stepWidth, stepHeight);
                    }
                });
            }
            else if (this.grooveBox.modeIndex === 0) {
                this.htmlCanvas.style.backgroundColor = "#000000";
                var maxStep = this.grooveBox.pitchHistory.maxStep;
                var windowLength = this.grooveBox.pitchHistory.windowLength;
                var stepWidth = this.canvasWidth / windowLength;
                this.grooveBox.pitchHistory.stepsForCurrentWindow().rawSteps.forEach(function (step, index) {
                    // console.log("step", step);
                    _this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
                    _this.renderStepPitches(step, index, stepWidth, stepHeight);
                });
            }
            else if (this.grooveBox.modeIndex === 3) {
                var clip = (_b = this.grooveBox.songSequencer) === null || _b === void 0 ? void 0 : _b.clip;
                if (clip !== undefined) {
                    this.htmlCanvas.style.backgroundColor = clip.color;
                    var stepWidth = this.canvasWidth / clip.clipLength;
                    clip.steps.forEach(function (step, index) {
                        if (step !== undefined && step !== null) {
                            if (index === _this.grooveBox.currentSequencer().currentStep) {
                                _this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
                            }
                            else {
                                _this.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
                            }
                            _this.renderStepPitches(step, step.stepNumber, stepWidth, stepHeight);
                        }
                    });
                }
            }
        }
    };
    LCD.prototype.drawOctaves = function () {
        for (var i = 0; i < 11; i++) {
            this.ctx.fillStyle = "rgba(255, 255, 255, " + (0.5 - ((i * 0.1) / 2)) + ")";
            this.ctx.fillRect(0, i * 12 * this.cellHeight(), this.canvasWidth, this.cellHeight() * 12);
        }
    };
    LCD.prototype.cellHeight = function () {
        return this.canvasHeight / 128;
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
