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
            element.addEventListener("contextmenu", function (e) {
                var element = e.target;
                var index = element.dataset.index;
                grooveBox.generatorManager.clearPresetAtIndex(parseInt(index));
                e.preventDefault();
                return false;
            });
        });
    }
    GeneratorSavedStates.prototype.update = function () {
        var genManager = this.grooveBox.generatorManager;
        this.elements.forEach(function (element, index) {
            var storedPreset = genManager.presetAtIndex(index);
            if (storedPreset !== null) {
                element.style.backgroundColor = storedPreset.color;
            }
            else {
                element.style.backgroundColor = "transparent";
            }
            if (genManager.loadedPresetIndex() === index) {
                element.classList.add("active");
            }
            else {
                element.classList.remove("active");
            }
        });
    };
    return GeneratorSavedStates;
}());
export default GeneratorSavedStates;
