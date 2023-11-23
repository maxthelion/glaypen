var GeneratorSavedStates = /** @class */ (function () {
    function GeneratorSavedStates(ui, grooveBox) {
        this.ui = ui;
        this.grooveBox = grooveBox;
        this.elements = [];
        var parentElement = document.querySelector("#generatorSavedStates");
        for (var i = 0; i < 16; i++) {
            // console.log("GeneratorSavedStates constructor", parentElement);
            var div = document.createElement("div");
            var element = document.createElement("a");
            div.appendChild(element);
            element.dataset.index = i.toString();
            element.textContent = i.toString();
            this.elements.push(element);
            parentElement.appendChild(div);
        }
        this.elements.forEach(function (element) {
            element.addEventListener("click", function (e) {
                var element = e.target;
                var index = element.dataset.index;
                grooveBox.generatorButtonPressed(parseInt(index));
            });
        });
    }
    GeneratorSavedStates.prototype.update = function () {
        var _this = this;
        this.elements.forEach(function (element) {
            if (_this.grooveBox.generatorParamsIndex !== null && _this.grooveBox.generatorParamsIndex !== undefined) {
                if (element.dataset.index === _this.grooveBox.generatorParamsIndex.toString()) {
                    element.style.backgroundColor = "red";
                }
            }
        });
    };
    return GeneratorSavedStates;
}());
export default GeneratorSavedStates;
