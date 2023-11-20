var ClipMatrix = /** @class */ (function () {
    function ClipMatrix(ui, grooveBox) {
        var _this = this;
        this.lastClipIndex = -1;
        this.lastClipIndexes = [];
        this.grooveBox = grooveBox;
        this.clipMatrix = document.querySelector("#clipMatrix");
        var cellNumber = 64;
        for (var i = 0; i < cellNumber; i++) {
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
                _this.grooveBox.saveOrLoadClipAtIndex(parseInt(index));
            });
            step.addEventListener("contextmenu", function (e) {
                console.log("rightclick");
                var element = e.target;
                var index = element.dataset.step;
                _this.grooveBox.clearClipAtIndex(parseInt(index));
                e.preventDefault();
                return false;
            });
        }
    }
    ClipMatrix.prototype.update = function () {
        if (this.clipMatrix !== null) {
            if (this.grooveBox.clipIndex !== null && this.grooveBox.clipIndex !== undefined
                && this.grooveBox.clipIndex !== this.lastClipIndex) {
                this.clipMatrix.querySelectorAll("a").forEach(function (step) {
                    step.classList.remove("active");
                });
                var cell = this.clipMatrix.querySelector(".step" + this.grooveBox.clipIndex);
                cell.classList.add("active");
                this.lastClipIndex = this.grooveBox.clipIndex;
            }
            if (this.grooveBox.clipSaver.clipIndexes() !== this.lastClipIndexes) {
                var clipIndexes = this.grooveBox.clipSaver.clipIndexes();
                this.lastClipIndexes = clipIndexes;
                for (var i = 0; i < this.grooveBox.maxClips; i++) {
                    var cell = this.clipMatrix.querySelector(".step" + i);
                    if (clipIndexes.includes(i) === true) {
                        cell.style.backgroundColor = this.grooveBox.clipSaver.clipAtIndex(i).color;
                    }
                    else {
                        cell.style.backgroundColor = "transparent";
                    }
                }
            }
        }
    };
    return ClipMatrix;
}());
export default ClipMatrix;
