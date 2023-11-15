var ModeSelector = /** @class */ (function () {
    function ModeSelector(ui, grooveBox) {
        this.modeTabs = [];
        this.modeTabs[0] = document.getElementById("generatormodebtn");
        this.modeTabs[1] = document.getElementById("extractmodebtn");
        this.modeTabs[2] = document.getElementById("clipmodebtn");
        for (var i = 0; i < this.modeTabs.length; i++) {
            this.modeTabs[i].dataset.modeid = i.toString();
            this.modeTabs[i].addEventListener("click", function (e) {
                var clickedElement = e.target;
                var modeId = clickedElement.dataset.modeid;
                grooveBox.setMode(parseInt(modeId));
            });
        }
        this.grooveBox = grooveBox;
        this.ui = ui;
    }
    ModeSelector.prototype.update = function () {
        document.querySelectorAll(".modebtn").forEach(function (modeTab) {
            modeTab.classList.remove("active");
        });
        this.modeTabs[this.grooveBox.modeIndex].classList.add("active");
    };
    return ModeSelector;
}());
export default ModeSelector;
