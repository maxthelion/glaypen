var IntervalProbabilityControl = /** @class */ (function () {
    function IntervalProbabilityControl(ui, grooveBox, index) {
        var _this = this;
        this.dragging = false;
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.element = document.createElement("div");
        this.element.classList.add("intervalholder");
        var button = document.createElement("a");
        this.intervalNumber = index;
        button.href = "#";
        button.classList.add("chordbutton");
        button.classList.add("intervalbutton");
        button.textContent = (index + 1).toString();
        this.probabilityControl = document.createElement("div");
        this.probabilityControl.classList.add("intervalprobabilitycontrol");
        this.probabilityControl.dataset.intervalNumber = index.toString();
        this.amountBar = document.createElement("div");
        this.amountBar.classList.add("intervalamountbar");
        this.probabilityControl.appendChild(this.amountBar);
        this.element.appendChild(this.probabilityControl);
        this.element.appendChild(button);
        this.probabilityControl.addEventListener("click", function (e) {
            var element = e.target;
            var intervalNumber = element.dataset.intervalNumber;
            var y = e.offsetY;
            var height = element.clientHeight;
            var probability = 1 - (y / height);
            console.log("intervalNumber", intervalNumber, y, probability);
            _this.probability = probability;
        });
        this.probabilityControl.style.cursor = "pointer";
        this.probabilityControl.addEventListener("mousedown", function (e) {
            var element = e.target;
            var intervalNumber = element.dataset.intervalNumber;
            _this.ui.mouseHandler.startIntervalDrag(e, intervalNumber);
            e.preventDefault();
            return false;
        });
        this.probabilityControl.addEventListener("mouseup", function (e) {
            _this.dragging = false;
        });
        this.probabilityControl.addEventListener("mousemove", function (e) {
            if (_this.ui.mouseHandler.intervalDragging == true) {
                var element = e.target;
                var intervalNumber = _this.intervalNumber; // parseInt(element.dataset.intervalNumber!);
                if (!isNaN(intervalNumber)) {
                    var y = e.offsetY;
                    var clientHeight = _this.probabilityControl.clientHeight;
                    var probability = 1 - (y / clientHeight);
                    _this.grooveBox.generatorManager.setIntervalProbability(intervalNumber, probability);
                }
            }
        });
    }
    IntervalProbabilityControl.prototype.getProbability = function () {
        return this.grooveBox.generatorManager.getIntervalProbability(this.intervalNumber);
    };
    IntervalProbabilityControl.prototype.update = function () {
        var _a;
        var button = this.probabilityControl;
        var intervals = (_a = this.grooveBox.currentSequencer()) === null || _a === void 0 ? void 0 : _a.pitchGenerator.availableIntervals();
        // if (this.probability < 1){
        var probability = this.getProbability();
        this.amountBar.style.height = (100 - (probability * 100)).toString() + "%";
        // }
        if (intervals.includes(parseInt(button.dataset.intervalNumber))) {
            this.probabilityControl.classList.add("active");
        }
        else {
            this.probabilityControl.classList.remove("active");
        }
    };
    return IntervalProbabilityControl;
}());
export default IntervalProbabilityControl;
