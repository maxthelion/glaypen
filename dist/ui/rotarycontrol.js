var RotaryControl = /** @class */ (function () {
    function RotaryControl(ui, grooveBox) {
        this.cachedValue = 0;
        this.lastReadTime = 0;
        this.grooveBox = grooveBox;
        this.ui = ui;
        this.element = document.createElement("div");
        this.element.classList.add("rotarycontrol");
        this.rotaryCanvas = document.createElement("canvas");
        this.element.appendChild(this.rotaryCanvas);
        this.valueLabel = document.createElement("div");
        this.valueLabel.classList.add("rotaryvaluelabel");
        this.element.appendChild(this.valueLabel);
        this.rotaryCanvas.width = 60;
        this.rotaryCanvas.height = 60;
        // this.renderCircle();
        this.labelElement = document.createElement("div");
        this.labelElement.textContent = "label";
        this.labelElement.classList.add("rotarynamelabel");
        this.element.appendChild(this.labelElement);
        this.renderWithValue(0.2);
        this.update();
        this.element.addEventListener("wheel", this.onWheel.bind(this));
    }
    RotaryControl.prototype.update = function () {
        if (this.cachedValue !== this.readValue()) {
            this.valueLabel.textContent = this.displayValue();
            this.renderWithValue(this.readValue());
            this.cachedValue = this.readValue();
        }
    };
    RotaryControl.prototype.setLabel = function (label) {
        this.labelElement.textContent = label;
    };
    RotaryControl.prototype.onWheel = function (e) {
        console.log("onWheel", this);
        if (Date.now() - this.lastReadTime < 20) {
            e.preventDefault();
            return false;
        }
        var increment = this.getIncrement();
        var value = this.readValue();
        if (e.deltaY > 0) {
            if (value < 1 - increment)
                value += increment;
        }
        else {
            if (value > increment)
                value -= increment;
        }
        this.setValue(value);
        this.lastReadTime = Date.now();
        e.preventDefault();
        return false;
    };
    RotaryControl.prototype.readValue = function () {
        return this.cachedValue;
    };
    RotaryControl.prototype.setValue = function (value) {
        this.cachedValue = value;
        this.update();
    };
    RotaryControl.prototype.getIncrement = function () {
        return 1 / 128;
    };
    RotaryControl.prototype.displayValue = function () {
        return this.readValue().toPrecision(3).toString();
    };
    RotaryControl.prototype.renderCircle = function () {
        if (this.rotaryCanvas) {
            var ctx = this.rotaryCanvas.getContext("2d");
            ctx.beginPath();
            ctx.strokeStyle = "white";
            ctx.lineWidth = 5;
            ctx.fillStyle = "grey";
            var radius = 30;
            var holderWidth = this.element.clientWidth;
            var holderHeight = this.element.clientHeight;
            var left = (holderWidth / 2);
            var top = (holderHeight / 2);
            ctx.beginPath();
            ctx.arc(left, top, 30, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
            ctx.fill();
        }
    };
    RotaryControl.prototype.renderWithValue = function (value) {
        // this.textLabel.innerHTML = value.toString();
        if (value != undefined) {
            var ctx = this.rotaryCanvas.getContext('2d');
            ctx.lineWidth = this.rotaryCanvas.height * 0.1;
            ctx.strokeStyle = "black";
            var min = 0 + 0.25;
            var max = 2 - 0.25;
            var range = max - min;
            min = (min + 0.5);
            max = (max + 0.5);
            var displayedValue = min + (value * range);
            var x = this.rotaryCanvas.width * .5;
            var y = this.rotaryCanvas.height * .5;
            // console.log("displayedValue", value, displayedValue, min,max)
            ctx.clearRect(0, 0, this.rotaryCanvas.width, this.rotaryCanvas.height);
            ctx.beginPath();
            var radius = this.rotaryCanvas.width * .4;
            ctx.arc(x, y, radius, min * Math.PI, max * Math.PI);
            ctx.stroke();
            ctx.strokeStyle = "yellow";
            ctx.beginPath();
            ctx.arc(x, y, radius, min * Math.PI, displayedValue * Math.PI);
            ctx.stroke();
        }
    };
    return RotaryControl;
}());
export default RotaryControl;
