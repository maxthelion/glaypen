import PlayButton from "./ui/playbutton.js";
import HistoryCanvas from "./ui/historycanvas.js";
import LCD from "./ui/lcd.js";
import ClipMatrix from "./ui/clipmatrix.js";
var UI = /** @class */ (function () {
    function UI(groovebox) {
        var _this = this;
        var sequencerSteps = document.querySelectorAll(".step");
        console.log("sequencerSteps", sequencerSteps);
        this.sequencerSteps = [];
        sequencerSteps.forEach(function (sequencerStep) {
            console.log("sequencerStep", sequencerStep.textContent);
            _this.sequencerSteps.push(sequencerStep);
        });
        this.playButton = new PlayButton(groovebox);
        this.historyCanvas = new HistoryCanvas(this, groovebox);
        this.lcd = new LCD(this, groovebox);
        this.grooveBox = groovebox;
        this.clipMatrix = new ClipMatrix(this, groovebox);
        this.renderables = [this.historyCanvas, this.lcd, this.clipMatrix];
    }
    UI.prototype.update = function () {
        this.sequencerSteps.forEach(function (sequencerStep) {
            sequencerStep.classList.remove("active");
        });
        // if (this.grooveBox.transport.loop.currentStep) {
        //     let step = this.grooveBox.transport.loop.currentStep;
        //     this.sequencerSteps[step - 1].classList.add("active");
        // }
        this.renderables.forEach(function (renderable) {
            renderable.update();
        });
    };
    UI.prototype.onWheel = function (event) {
        var direction = event.deltaY > 0 ? 1 : -1;
        this.grooveBox.moveWindow(direction);
        event.preventDefault();
    };
    return UI;
}());
export default UI;
