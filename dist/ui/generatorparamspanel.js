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
        var pitchControls = new PitchControl(ui, grooveBox);
        this.renderables.push(pitchControls);
        this.genPanels.push(pitchControls);
        var stepControls = new StepControl(ui, grooveBox);
        this.renderables.push(stepControls);
        this.genPanels.push(stepControls);
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
        var panelIndex = parseInt(partId);
        this.element.innerHTML = "";
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.appendChild(this.genPanels[panelIndex].element);
    };
    GeneratorParamsPanel.prototype.update = function () {
        var _a;
        (_a = this.element) === null || _a === void 0 ? void 0 : _a.style.setProperty("border-color", this.grooveBox.generatorParams.color);
        this.renderables.forEach(function (renderable) {
            renderable.update();
        });
    };
    return GeneratorParamsPanel;
}());
export default GeneratorParamsPanel;
