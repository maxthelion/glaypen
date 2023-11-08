var ClipMatrix = /** @class */ (function () {
    function ClipMatrix(ui, grooveBox) {
        var _this = this;
        this.grooveBox = grooveBox;
        this.clipMatrix = document.querySelector("#clipMatrix");
        for (var i = 0; i < 16; i++) {
            var step = document.createElement("a");
            step.href = "#";
            step.classList.add("clipButtonCell");
            step.classList.add("step" + i);
            step.textContent = (i + 1).toString();
            step.setAttribute("data-step", i.toString());
            this.clipMatrix.appendChild(step);
            step.addEventListener("click", function (e) {
                var index = e.target.dataset.step;
                _this.grooveBox.saveOrLoadClipAtIndex(index);
            });
        }
    }
    ClipMatrix.prototype.update = function () {
        var _this = this;
        if (this.clipMatrix !== null) {
            this.clipMatrix.querySelectorAll("a").forEach(function (step) {
                step.classList.remove("active");
            });
            if (this.grooveBox.clipSaver.clipIndexes() != []) {
                // console.log("this.grooveBox.clipSaver.clipIndexes()", this.grooveBox.clipSaver.clipIndexes())
                this.grooveBox.clipSaver.clipIndexes().forEach(function (clipIndex) {
                    var cell = _this.clipMatrix.querySelector(".step" + clipIndex);
                    if (cell !== null) {
                        cell.classList.add("active");
                    }
                });
            }
        }
    };
    return ClipMatrix;
}());
export default ClipMatrix;
