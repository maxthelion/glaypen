import RotaryDial from "./rotarydial.js";
var GeneratorParamsPanel = /** @class */ (function () {
    function GeneratorParamsPanel(ui, grooveBox) {
        var _this = this;
        this.renderables = [];
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.element = document.querySelector("#generatorparams");
        this.paramElements = this.element.querySelectorAll(".genparam");
        this.renderables = [];
        var scaleSelect = this.element.querySelector("#scale");
        var scales = this.grooveBox.scales;
        for (var i = 0; i < scales.length; i++) {
            var option = document.createElement("option");
            option.value = i.toString();
            option.text = scales[i][0];
            if (this.grooveBox.generatorParams.scaleIndex == i) {
                option.selected = true;
            }
            scaleSelect.add(option);
        }
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
