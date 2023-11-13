var TransportDisplay = /** @class */ (function () {
    function TransportDisplay(ui, grooveBox) {
        this.ui = ui;
        this.grooveBox = grooveBox;
        console.log("TransportDisplay constructor");
        this.element = document.querySelector("#transportdisplay");
    }
    TransportDisplay.prototype.update = function () {
        this.element.innerHTML = this.grooveBox.transport.loop.step.toString();
    };
    return TransportDisplay;
}());
export default TransportDisplay;
