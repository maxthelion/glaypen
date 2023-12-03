var StorageBox = /** @class */ (function () {
    function StorageBox() {
        this.storage = window.localStorage;
    }
    StorageBox.prototype.get = function (key) {
        return this.storage.getItem(key);
    };
    StorageBox.prototype.set = function (key, value) {
        this.storage.setItem(key, value);
    };
    StorageBox.prototype.setGeneratorParams = function (generatorParams) {
        this.storage.setItem("generatorParams", JSON.stringify(generatorParams));
    };
    StorageBox.prototype.getGeneratorParams = function () {
        if (this.storage.getItem("generatorParams") != null && this.storage.getItem("generatorParams") != undefined) {
            return JSON.parse(this.storage.getItem("generatorParams"));
        }
        else {
            return undefined;
        }
    };
    StorageBox.prototype.setClipAtIndex = function (clipRawData, index) {
        console.log("set clip ".concat(index));
        this.storage.setItem("clip".concat(index), JSON.stringify(clipRawData));
    };
    StorageBox.prototype.getClipAtIndex = function (index) {
        var clipJSON = this.storage.getItem("clip".concat(index));
        if (clipJSON != null) {
            return JSON.parse(clipJSON);
        }
        else {
            return undefined;
        }
    };
    StorageBox.prototype.getAllClips = function () {
        var _this = this;
        return Array(16).fill(0).map(function (_, index) { return _this.getClipAtIndex(index); });
    };
    StorageBox.prototype.clearClipAtIndex = function (index) {
        this.storage.removeItem("clip".concat(index));
    };
    StorageBox.prototype.clear = function (key) {
        this.storage.removeItem(key);
    };
    return StorageBox;
}());
export default StorageBox;
