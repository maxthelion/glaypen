var ModeSelector = /** @class */ (function () {
    function ModeSelector(ui, grooveBox) {
        this.modeTabs = [];
        this.lastModeIndex = -1;
        this.modeTabs[0] = document.getElementById("generatormodebtn");
        this.modeTabs[2] = document.getElementById("clipmodebtn");
        this.modeTabs[0].dataset.modeid = "0";
        this.modeTabs[0].addEventListener("click", function (e) {
            var clickedElement = e.target;
            var modeId = clickedElement.dataset.modeid;
            grooveBox.setMode(parseInt(modeId));
        });
        this.grooveBox = grooveBox;
        this.ui = ui;
    }
    ModeSelector.prototype.update = function () {
        if (this.grooveBox.modeIndex !== this.lastModeIndex) {
            document.querySelectorAll(".modebtn").forEach(function (modeTab) {
                modeTab.classList.remove("active");
            });
            if (this.modeTabs[this.grooveBox.modeIndex] !== undefined) {
                this.modeTabs[this.grooveBox.modeIndex].classList.add("active");
            }
            this.lastModeIndex = this.grooveBox.modeIndex;
        }
    };
    return ModeSelector;
}());
export default ModeSelector;
