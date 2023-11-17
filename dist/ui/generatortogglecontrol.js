var GeneratorToggleControl = /** @class */ (function () {
    function GeneratorToggleControl(ui, grooveBox) {
        this.toggleGenerateBtn = document.querySelector("#toggleGenerateBtn");
        this.toggleExtractBtn = document.querySelector("#toggleExtractBtn");
        this.lastMode = -1;
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.toggleGenerateBtn.addEventListener("click", function (e) {
            var element = e.target;
            grooveBox.setMode(0);
        });
        this.toggleExtractBtn.addEventListener("click", function (e) {
            var element = e.target;
            grooveBox.setMode(1);
        });
    }
    GeneratorToggleControl.prototype.update = function () {
        if (this.lastMode !== this.grooveBox.modeIndex) {
            if (this.grooveBox.modeIndex === 0) {
                this.toggleGenerateBtn.classList.add("active");
                this.toggleExtractBtn.classList.remove("active");
            }
            else {
                this.toggleGenerateBtn.classList.remove("active");
                this.toggleExtractBtn.classList.add("active");
            }
            this.lastMode = this.grooveBox.modeIndex;
        }
    };
    return GeneratorToggleControl;
}());
export default GeneratorToggleControl;
