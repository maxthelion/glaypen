var GenChangeCanvas = /** @class */ (function () {
    function GenChangeCanvas(ui, grooveBox) {
        this.generatorManager = grooveBox.generatorManager;
        this.htmlCanvas = document.querySelector("#genchangecanvas");
        this.ctx = this.htmlCanvas.getContext("2d");
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.canvasWidth = this.htmlCanvas.width;
        this.canvasHeight = this.htmlCanvas.height;
        this.htmlCanvas.addEventListener("wheel", this.onWheel.bind(this.ui));
        this.htmlCanvas.addEventListener("click", this.onHistoryClick.bind(this));
    }
    GenChangeCanvas.prototype.onWheel = function (e) {
    };
    GenChangeCanvas.prototype.onHistoryClick = function (e) {
        var x = e.offsetX;
        var stepWidth = this.canvasWidth / this.grooveBox.pitchHistory.maxStep;
        var stepNumber = Math.floor(x / stepWidth);
        this.generatorManager.setGenParamsFromIndex(stepNumber);
    };
    GenChangeCanvas.prototype.update = function () {
        var index = 0;
        for (var i = 0; i < this.generatorManager.genChanges.length; i++) {
            var genParamsIndex = this.generatorManager.genChanges[i][0];
            var genParams = this.generatorManager.getGenParamsByIndex(genParamsIndex);
            var stepNumber = this.generatorManager.genChanges[i][1];
            this.ctx.fillStyle = genParams.color;
            var stepWidth = this.canvasWidth / this.grooveBox.pitchHistory.maxStep;
            var nextItem = this.generatorManager.genChanges[i + 1];
            var nextStepIndex = void 0;
            if (nextItem === undefined) {
                nextStepIndex = this.grooveBox.pitchHistory.maxStep;
            }
            else {
                nextStepIndex = nextItem[1];
            }
            this.ctx.fillRect(stepNumber * stepWidth, 0, stepWidth * nextStepIndex, this.canvasHeight);
            if (genParamsIndex == this.generatorManager.currentGenParamIndex) {
                this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
                this.ctx.fillRect(stepNumber * stepWidth, 0, stepWidth * nextStepIndex, 2);
            }
        }
    };
    return GenChangeCanvas;
}());
export default GenChangeCanvas;
