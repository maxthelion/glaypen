var HistoryCanvas = /** @class */ (function () {
    function HistoryCanvas(ui, groovebox) {
        this.htmlCanvas = document.querySelector("#historycanvas");
        this.ctx = this.htmlCanvas.getContext("2d");
        this.grooveBox = groovebox;
        this.ui = ui;
        this.canvasWidth = this.htmlCanvas.width;
        this.canvasHeight = this.htmlCanvas.height;
        this.htmlCanvas.addEventListener("wheel", this.ui.onWheel.bind(this.ui));
        this.htmlCanvas.addEventListener("click", this.ui.onHistoryClick.bind(this.ui));
    }
    HistoryCanvas.prototype.update = function () {
        if (this.ctx !== null) {
            // console.log(this.grooveBox.pitchHistory.steps.length)
            this.ctx.clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
            var maxStep = this.grooveBox.pitchHistory.maxStep;
            var stepWidth = this.canvasWidth / maxStep;
            var stepHeight = this.canvasHeight / 128;
            for (var i = 0; i < maxStep; i++) {
                var step = this.grooveBox.pitchHistory.steps[i];
                if (step !== undefined) {
                    this.ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
                    this.ctx.fillRect((stepWidth * i), (128 - step.pitches[0]) * stepHeight, stepWidth, stepHeight);
                }
            }
            this.drawWindow(maxStep);
        }
    };
    HistoryCanvas.prototype.drawWindow = function (maxStep) {
        var stepWidth = this.canvasWidth / maxStep;
        var stepHeight = this.canvasHeight / 128;
        if (this.ctx !== null) {
            this.ctx.strokeStyle = "rgba(255, 255, 255, 1)";
            if (this.grooveBox.pitchHistory.windowStart !== undefined) {
                var x = this.grooveBox.pitchHistory.windowStart * stepWidth;
            }
            else {
                var x = (maxStep - this.grooveBox.pitchHistory.windowLength) * stepWidth;
            }
            this.ctx.strokeRect(x, 0, this.grooveBox.pitchHistory.windowLength * stepWidth, this.canvasHeight);
        }
    };
    return HistoryCanvas;
}());
export default HistoryCanvas;
