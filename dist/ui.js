import PlayButton from "./ui/playbutton.js";
import HistoryCanvas from "./ui/historycanvas.js";
import LCD from "./ui/lcd.js";
import ClipMatrix from "./ui/clipmatrix.js";
import PrefsButton from "./ui/prefsbutton.js";
import PrefsModal from "./ui/prefsmodal.js";
import GeneratorParamsPanel from "./ui/generatorparamspanel.js";
import ModeSelector from "./ui/modeselector.js";
import ClipParamsPanel from "./ui/clipparamspanel.js";
import TransportDisplay from "./ui/transportdisplay.js";
import GeneratorToggleControl from "./ui/generatortogglecontrol.js";
import PhraseSelector from "./ui/phraseselector.js";
import GeneratorSavedStates from "./ui/generatorsavedstates.js";
import GenChangeCanvas from "./ui/genchangecanvas.js";
var UI = /** @class */ (function () {
    function UI(groovebox) {
        var _this = this;
        this.lastClipLength = -1;
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
        var modeSelector = new ModeSelector(this, groovebox);
        document.querySelectorAll(".windowlengthbtn").forEach(function (element) {
            if (element !== undefined) {
                element.addEventListener("click", function (e) {
                    var _a;
                    var element = e.target;
                    var windowlength = parseInt((_a = element.dataset.windowlength) === null || _a === void 0 ? void 0 : _a.toString());
                    groovebox.changeWindowLength(windowlength);
                });
            }
        });
        var genChangeCanvas = new GenChangeCanvas(this, groovebox);
        var generatorToggleControl = new GeneratorToggleControl(this, groovebox);
        var transportDisplay = new TransportDisplay(this, groovebox);
        var randomiseButton = document.querySelector("#randomiseBtn");
        randomiseButton.addEventListener("click", function (e) {
            groovebox.generateRandomSettings();
        });
        this.generatorParamsPanel = new GeneratorParamsPanel(this, groovebox);
        this.clipParamsPanel = new ClipParamsPanel(this, groovebox);
        this.currentPane = this.generatorParamsPanel;
        var phraseSelector = new PhraseSelector(this, groovebox);
        var generatorSavedStates = new GeneratorSavedStates(this, groovebox);
        this.renderables = [
            genChangeCanvas,
            generatorSavedStates,
            phraseSelector,
            generatorToggleControl,
            this.playButton,
            this.historyCanvas,
            this.lcd,
            this.clipMatrix,
            modeSelector,
            transportDisplay
        ];
        this.prefsButton = new PrefsButton(this, groovebox);
    }
    UI.prototype.update = function () {
        var _this = this;
        this.sequencerSteps.forEach(function (sequencerStep) {
            sequencerStep.classList.remove("active");
        });
        // if (this.grooveBox.transport.loop.currentStep) {
        //     let step = this.grooveBox.transport.loop.currentStep;
        //     this.sequencerSteps[step - 1].classList.add("active");
        // }
        if (this.lastClipLength !== this.grooveBox.pitchHistory.windowLength) {
            this.lastClipLength = this.grooveBox.pitchHistory.windowLength;
            document.querySelectorAll(".windowlengthbtn").forEach(function (element) {
                var _a;
                if (element !== undefined) {
                    element.classList.remove("active");
                    if (parseInt((_a = element.dataset.windowlength) === null || _a === void 0 ? void 0 : _a.toString()) === _this.lastClipLength) {
                        element.classList.add("active");
                    }
                }
            });
        }
        this.renderables.forEach(function (renderable) {
            renderable.update();
        });
        this.currentPane.update();
    };
    UI.prototype.setMode = function (modeIndex) {
        var modePanes = document.querySelectorAll(".modepane");
        modePanes.forEach(function (element) {
            element.classList.add("hidden");
        });
        if (modeIndex == 0 || modeIndex == 1) {
            this.currentPane = this.generatorParamsPanel;
            document.querySelector("#genpane").classList.remove("hidden");
        }
        console.log("modeIndex", modeIndex);
        if (modeIndex == 2) {
            document.querySelector("#clippane").classList.remove("hidden");
            this.currentPane = this.clipParamsPanel;
        }
    };
    UI.prototype.onWheel = function (event) {
        var direction = event.deltaY > 0 ? 1 : -1;
        this.grooveBox.moveWindow(direction);
        event.preventDefault();
    };
    UI.prototype.onHistoryClick = function (event) {
        var element = event.target;
        var width = element.clientWidth;
        var x = event.offsetX;
        var historyIndex = x / width;
        this.grooveBox.setHistoryIndex(historyIndex);
        event.preventDefault();
    };
    UI.prototype.showPrefsModal = function (message) {
        if (message === void 0) { message = ""; }
        this.prefsModal = new PrefsModal(this, this.grooveBox, message);
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
