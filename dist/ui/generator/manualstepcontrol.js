var ManualStepControl = /** @class */ (function () {
    function ManualStepControl(ui, grooveBox) {
        var _this = this;
        this.maxSteps = 16;
        this.ui = ui;
        this.grooveBox = grooveBox;
        this.stepSelector = document.createElement("div");
        this.stepSelector.classList.add("stepselector");
        this.stepSelector.innerHTML = "stepselector";
        this.element = document.createElement("div");
        this.probabilityCanvas = document.createElement("canvas");
        this.probabilityCanvas.width = 300;
        this.probabilityCanvas.height = 160;
        this.element.appendChild(this.probabilityCanvas);
        this.element.appendChild(this.stepSelector);
        this.ctx = this.probabilityCanvas.getContext("2d");
        this.probabilityCanvas.addEventListener("click", function (e) {
            var stepWidth = _this.probabilityCanvas.width / _this.maxSteps;
            var ydivisions = _this.probabilityCanvas.height / 128;
            var x = e.offsetX;
            var y = e.offsetY;
            var step = Math.floor(x / stepWidth);
            var probability = 128 - Math.floor((y / ydivisions));
            _this.grooveBox.generatorManager.setManualStepProbability(step, probability);
        });
        this.probabilityCanvas.style.cursor = "pointer";
        this.probabilityCanvas.style.border = "1px solid #ffffff";
    }
    ManualStepControl.prototype.update = function () {
        var _this = this;
        if (this.grooveBox.generatorManager.currentGeneratorParams.manualSteps !== undefined) {
            this.ctx.clearRect(0, 0, this.probabilityCanvas.width, this.probabilityCanvas.height);
            this.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
            // console.log(this.grooveBox.generatorManager.currentGeneratorParams.manualSteps)
            this.grooveBox.generatorManager.currentGeneratorParams.manualSteps.forEach(function (step, index) {
                var stepWidth = _this.probabilityCanvas.width / _this.maxSteps;
                var ydivisions = _this.probabilityCanvas.height / 128;
                // console.log("step", step, "index", index);
                _this.ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
                _this.ctx.fillRect(index * stepWidth, Math.floor(128 - step) * ydivisions, stepWidth - 1, step * ydivisions);
            });
        }
    };
    return ManualStepControl;
}());
export default ManualStepControl;
