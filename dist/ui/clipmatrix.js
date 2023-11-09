var ClipMatrix = /** @class */ (function () {
    function ClipMatrix(ui, grooveBox) {
        var _this = this;
        this.grooveBox = grooveBox;
        this.clipMatrix = document.querySelector("#clipMatrix");
        for (var i = 0; i < 16; i++) {
            var div = document.createElement("div");
            var step = document.createElement("a");
            step.href = "#";
            div.classList.add("clipButtonCell");
            step.classList.add("step" + i);
            step.textContent = (i + 1).toString();
            step.setAttribute("data-step", i.toString());
            div.appendChild(step);
            this.clipMatrix.appendChild(div);
            step.addEventListener("click", function (e) {
                var element = e.target;
                var index = element.dataset.step;
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
                        cell.style.backgroundColor = _this.grooveBox.clipSaver.clipAtIndex(clipIndex).color;
                    }
                });
            }
        }
    };
    return ClipMatrix;
}());
export default ClipMatrix;
