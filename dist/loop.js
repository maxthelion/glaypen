var Loop = /** @class */ (function () {
    function Loop(grooveBox) {
        this.grooveBox = grooveBox;
        this.step = 0;
    }
    Loop.prototype.startWithInterval = function () {
        var _this = this;
        this.intervalNumber = setInterval(function () {
            _this.update();
        }, 120);
    };
    Loop.prototype.start = function () {
    };
    Loop.prototype.stop = function () {
        if (this.intervalNumber != undefined) {
            clearInterval(this.intervalNumber);
        }
    };
    Loop.prototype.update = function () {
        var _a;
        this.step += 1;
        // console.log("update", this.grooveBox.sequencer);
        (_a = this.grooveBox.currentSequencer()) === null || _a === void 0 ? void 0 : _a.step(this.step);
    };
    Loop.prototype.reset = function () {
        this.step = 0;
    };
    return Loop;
}());
export default Loop;
