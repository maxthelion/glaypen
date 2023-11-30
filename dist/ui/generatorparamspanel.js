import RotaryDial from "./rotarydial.js";
import PitchControl from "./generator/pitchcontrol.js";
import StepControl from "./generator/stepcontrol.js";
var GeneratorParamsPanel = /** @class */ (function () {
    function GeneratorParamsPanel(ui, grooveBox) {
        var _this = this;
        this.renderables = [];
        this.genPanels = [];
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.element = document.querySelector("#generatorparams");
        this.renderables = [];
        this.pitchPanel = new PitchControl(ui, grooveBox);
        this.genPanels.push(this.pitchPanel);
        this.stepPanel = new StepControl(ui, grooveBox);
        this.genPanels.push(this.stepPanel);
        // generator parts tabs
        var generatorPartsTabs = document.querySelector("#generatorpartstabs");
        var generatorPartsTabsButtons = generatorPartsTabs.querySelectorAll(".generatorpartstab");
        generatorPartsTabsButtons.forEach(function (button) {
            button.addEventListener("click", function (e) {
                var element = e.target;
                var partid = element.dataset.partid;
                _this.setGeneratorPart(partid);
            });
        });
        this.setGeneratorPart("0");
        this.paramElements = this.element.querySelectorAll(".genparam");
        this.paramElements.forEach(function (paramElement) {
            if (paramElement.id !== "scale") {
                var paramId_1 = paramElement.dataset.paramid;
                var value = _this.grooveBox.generatorParams[paramId_1];
                paramElement.value = value.toString();
            }
            var paramId = paramElement.dataset.paramid;
            paramElement.addEventListener("input", function (e) {
                var element = e.target;
                var value = element.value;
                _this.grooveBox.setGeneratorParam(paramId, parseInt(value));
            });
        });
        var rotaries = this.element.querySelectorAll(".rotary");
        var array = Array.from(rotaries);
        this.rotaryElements = array.map(function (element) {
            return new RotaryDial(ui, grooveBox, element);
        });
        this.renderables = this.renderables.concat(this.rotaryElements);
    }
    GeneratorParamsPanel.prototype.setGeneratorPart = function (partId) {
        var _a;
        var generatorPartsTabs = document.querySelector("#generatorpartstabs");
        var generatorPartsTabsButtons = generatorPartsTabs.querySelectorAll(".generatorpartstab");
        generatorPartsTabsButtons.forEach(function (button) {
            var buttonEl = button;
            if (buttonEl.dataset.partid !== partId) {
                buttonEl.classList.remove("selected");
            }
            else {
                buttonEl.classList.add("selected");
            }
        });
        switch (partId) {
            case "0":
                this.currentPart = this.pitchPanel;
                break;
            case "1":
                this.currentPart = this.stepPanel;
                break;
            default:
                break;
        }
        var panelIndex = parseInt(partId);
        this.element.innerHTML = "";
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.appendChild(this.genPanels[panelIndex].element);
    };
    GeneratorParamsPanel.prototype.update = function () {
        var _a;
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.style.setProperty("border-color", this.grooveBox.generatorManager.getColor());
        this.currentPart.update();
        this.renderables.forEach(function (renderable) {
            renderable.update();
        });
    };
    return GeneratorParamsPanel;
}());
export default GeneratorParamsPanel;
