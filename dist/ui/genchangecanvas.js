var GenChangeCanvas = /** @class */ (function () {
    function GenChangeCanvas(ui, grooveBox) {
        this.htmlCanvas = document.querySelector("#genchangecanvas");
        this.ctx = this.htmlCanvas.getContext("2d");
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.canvasWidth = this.htmlCanvas.width;
        this.canvasHeight = this.htmlCanvas.height;
    }
    GenChangeCanvas.prototype.update = function () {
        var index = 0;
        for (var i = 0; i < this.grooveBox.genChanges.length; i++) {
            var genParams = this.grooveBox.genChanges[i][0];
            var stepNumber = this.grooveBox.genChanges[i][1];
            this.ctx.fillStyle = genParams.color;
            var stepWidth = this.canvasWidth / this.grooveBox.pitchHistory.maxStep;
            var nextItem = this.grooveBox.genChanges[i + 1];
            var nextStepIndex = void 0;
            if (nextItem === undefined) {
                nextStepIndex = this.grooveBox.pitchHistory.maxStep;
            }
            else {
                nextStepIndex = nextItem[1];
            }
            this.ctx.fillRect(stepNumber * stepWidth, 0, stepWidth * nextStepIndex, this.canvasHeight);
        }
    };
    return GenChangeCanvas;
}());
export default GenChangeCanvas;
