var RotaryDial = /** @class */ (function () {
    function RotaryDial(ui, grooveBox, rotary) {
        // console.log("RotaryDial constructor")
        this.element = rotary;
        this.valueLabel = this.element.querySelector(".rotaryvalue");
        this.paramId = this.element.dataset.paramid;
        // this.element.addEventListener("click", (e) => {
        //     let element = e.target as HTMLElement;
        //     let value = element.dataset.value;
        //     grooveBox.setParam("rotary", parseInt(value!));
        // })
        this.grooveBox = grooveBox;
        this.ui = ui;
    }
    RotaryDial.prototype.update = function () {
        this.valueLabel.textContent = this.getParamValue().toString();
    };
    RotaryDial.prototype.getParamValue = function () {
        return this.grooveBox.generatorParams[this.paramId];
    };
    return RotaryDial;
}());
export default RotaryDial;
