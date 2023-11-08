var HistoryCanvas = /** @class */ (function () {
    function HistoryCanvas(ui, groovebox) {
        this.htmlCanvas = document.querySelector("#historycanvas");
        this.ctx = this.htmlCanvas.getContext("2d");
        this.grooveBox = groovebox;
        this.ui = ui;
        this.canvasWidth = this.htmlCanvas.width;
        this.canvasHeight = this.htmlCanvas.height;
        this.htmlCanvas.addEventListener("wheel", this.ui.onWheel.bind(this.ui));
    }
    HistoryCanvas.prototype.update = function () {
        var _this = this;
        if (this.ctx !== null) {
            this.ctx.clearRect(0, 0, this.htmlCanvas.width, this.htmlCanvas.height);
            var maxStep = this.grooveBox.pitchHistory.maxStep;
            var stepWidth_1 = this.canvasWidth / maxStep;
            var stepHeight_1 = this.canvasHeight / 128;
            this.grooveBox.pitchHistory.pitches.forEach(function (pitchStepPair) {
                if (_this.ctx !== null) {
                    _this.ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
                    _this.ctx.fillRect((stepWidth_1 * pitchStepPair[0]), pitchStepPair[1] * stepHeight_1, stepWidth_1, stepHeight_1);
                }
            });
            this.drawWindow(maxStep);
        }
    };
    HistoryCanvas.prototype.drawWindow = function (maxStep) {
        var stepWidth = this.canvasWidth / maxStep;
        var stepHeight = this.canvasHeight / 128;
        if (this.ctx !== null) {
            this.ctx.strokeStyle = "rgba(0, 0, 0, 1)";
            if (this.grooveBox.windowStart) {
                var x = this.grooveBox.windowStart * stepWidth;
            }
            else {
                var x = (maxStep - 16) * stepWidth;
            }
            this.ctx.strokeRect(x, 0, 16 * stepWidth, this.canvasHeight);
        }
    };
    return HistoryCanvas;
}());
export default HistoryCanvas;
