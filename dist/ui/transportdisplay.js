var TransportDisplay = /** @class */ (function () {
    function TransportDisplay(ui, grooveBox) {
        this.lastStep = -1;
        this.ui = ui;
        this.grooveBox = grooveBox;
        console.log("TransportDisplay constructor");
        this.element = document.querySelector("#transportdisplay");
    }
    TransportDisplay.prototype.update = function () {
        if (this.grooveBox.transport.loop.step !== this.lastStep) {
            var displayOutput = "";
            displayOutput += Math.floor(this.grooveBox.transport.loop.step / 16);
            displayOutput += ":";
            var stepOutput = ("0" + this.grooveBox.transport.loop.step % 16).slice(-2);
            displayOutput += stepOutput;
            this.element.innerHTML = displayOutput;
            this.lastStep = this.grooveBox.transport.loop.step;
        }
    };
    return TransportDisplay;
}());
export default TransportDisplay;
