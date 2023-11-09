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
            if (this.grooveBox.sequencer.clip !== undefined) {
                var clip = this.grooveBox.sequencer.clip;
                this.htmlCanvas.style.backgroundColor = clip.color;
                var stepWidth = this.canvasWidth / 16;
                var stepHeight = this.canvasHeight / 128;
                this.grooveBox.sequencer.clip.steps.forEach(function (step, index) {
                    if (step !== undefined) {
                        if (index === _this.grooveBox.sequencer.currentStep) {
                            _this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
                        }
                        else {
                            _this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                        }
                        _this.ctx.fillRect(index * stepWidth, step[1] * stepHeight, stepWidth, stepHeight);
                    }
                });
            }
            else {
                var maxStep = this.grooveBox.pitchHistory.maxStep;
                var stepWidth = this.canvasWidth / 16;
                var stepHeight_1 = this.canvasHeight / 128;
                this.grooveBox.pitchHistory.stepsForWindow(maxStep - 16).forEach(function (pitchStepPair) {
                    if (_this.ctx !== null) {
                        _this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
                        _this.ctx.fillRect((stepWidth * pitchStepPair[0]), pitchStepPair[1] * stepHeight_1, stepWidth, stepHeight_1);
                    }
                });
            }
        }
    };
    return LCD;
}());
export default LCD;
