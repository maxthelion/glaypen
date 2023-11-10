var GeneratorParamsPanel = /** @class */ (function () {
    function GeneratorParamsPanel(ui, grooveBox) {
        var _this = this;
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.element = document.querySelector("#generatorparams");
        this.paramElements = this.element.querySelectorAll(".genparam");
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
    }
    GeneratorParamsPanel.prototype.update = function () {
    };
    return GeneratorParamsPanel;
}());
export default GeneratorParamsPanel;
