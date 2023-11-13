import PlayButton from "./ui/playbutton.js";
import HistoryCanvas from "./ui/historycanvas.js";
import LCD from "./ui/lcd.js";
import ClipMatrix from "./ui/clipmatrix.js";
import PrefsButton from "./ui/prefsbutton.js";
import PrefsModal from "./ui/prefsmodal.js";
import GeneratorParamsPanel from "./ui/generatorparamspanel.js";
import ModeSelector from "./ui/modeselector.js";
import ClipParamsPanel from "./ui/clipparamspanel.js";
import ExtractParamsPanel from "./ui/extractparamspanel.js";
var UI = /** @class */ (function () {
    function UI(groovebox) {
        var _this = this;
        var sequencerSteps = document.querySelectorAll(".step");
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
        var generaterParamsPanel = new GeneratorParamsPanel(this, groovebox);
        var modeSelector = new ModeSelector(this, groovebox);
        this.renderables = [this.historyCanvas, this.lcd, this.clipMatrix, generaterParamsPanel, modeSelector];
        this.prefsButton = new PrefsButton(this, groovebox);
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
    UI.prototype.setMode = function (modeIndex) {
        var modePanes = document.querySelectorAll(".modepane");
        modePanes.forEach(function (element) {
            element.classList.add("hidden");
        });
        if (modeIndex == 0) {
            document.querySelector("#genpane").classList.remove("hidden");
        }
        if (modeIndex == 1) {
            document.querySelector("#extractpane").classList.remove("hidden");
            // this.clipParamsPanel = new ClipParamsPanel(this, this.grooveBox);
            this.extractParamsPanel = new ExtractParamsPanel(this, this.grooveBox);
        }
        if (modeIndex == 2) {
            document.querySelector("#clippane").classList.remove("hidden");
            this.clipParamsPanel = new ClipParamsPanel(this, this.grooveBox);
        }
    };
    UI.prototype.onWheel = function (event) {
        var direction = event.deltaY > 0 ? 1 : -1;
        this.grooveBox.moveWindow(direction);
        event.preventDefault();
    };
    UI.prototype.showPrefsModal = function () {
        this.prefsModal = new PrefsModal(this, this.grooveBox);
        document.getElementById("app").classList.add("blurred");
    };
    UI.prototype.closePrefsModal = function () {
        var _a;
        if (this.prefsModal !== undefined) {
            (_a = this.prefsModal.element) === null || _a === void 0 ? void 0 : _a.remove();
            document.getElementById("app").classList.remove("blurred");
        }
    };
    return UI;
}());
export default UI;
