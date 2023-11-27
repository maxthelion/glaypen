var TempoDisplay = /** @class */ (function () {
    function TempoDisplay(ui, grooveBox) {
        var _this = this;
        this.lastTempo = -1;
        this.ui = ui;
        this.grooveBox = grooveBox;
        this.element = document.querySelector("#tempocontrols");
        this.element.innerHTML = "";
        this.tempoLCD = document.createElement("div");
        this.tempoLCD.classList.add("tempolcd");
        this.element.appendChild(this.tempoLCD);
        var tempoButtons = document.createElement("div");
        tempoButtons.classList.add("tempobuttons");
        var upButton = document.createElement("a");
        upButton.href = "#";
        upButton.textContent = "+";
        tempoButtons.appendChild(upButton);
        upButton.addEventListener("click", function (e) {
            _this.grooveBox.transport.increaseTempo();
        });
        var downButton = document.createElement("a");
        downButton.href = "#";
        downButton.textContent = "-";
        tempoButtons.appendChild(downButton);
        downButton.addEventListener("click", function (e) {
            _this.grooveBox.transport.decreaseTempo();
        });
        this.element.appendChild(tempoButtons);
    }
    TempoDisplay.prototype.update = function () {
        if (this.grooveBox.transport.loop.step !== this.lastTempo) {
            var displayOutput = this.grooveBox.transport.tempo.toString();
            this.tempoLCD.innerHTML = displayOutput;
            this.lastTempo = this.grooveBox.transport.tempo;
        }
    };
    return TempoDisplay;
}());
export default TempoDisplay;
