var Loop = /** @class */ (function () {
    function Loop(grooveBox) {
        this.grooveBox = grooveBox;
        this.step = 0;
    }
    Loop.prototype.start = function () {
        var _this = this;
        this.intervalNumber = setInterval(function () {
            _this.update();
        }, 120);
    };
    Loop.prototype.stop = function () {
        if (this.intervalNumber != undefined) {
            clearInterval(this.intervalNumber);
        }
    };
    Loop.prototype.update = function () {
        this.step += 1;
        // console.log("update", this.grooveBox.sequencer);
        this.grooveBox.sequencer.step(this.step);
    };
    return Loop;
}());
export default Loop;
