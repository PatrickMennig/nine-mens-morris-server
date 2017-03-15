// ==== IMPORTS ====


// ==== CONSTRUCTOR ====
function Store() {
    this.store    = {};
    this.interval = null;
}

module.exports = Store;


// === PUBLIC FUNCTIONS ===
Store.prototype.get = function (id) {
    const value = this.store[id];
    return value != null ? value : null;
};


Store.prototype.getAll = function () {
    return Object.keys(this.store).map(k => this.store[k]);
};


Store.prototype.put = function (id, value) {
    if (this.store[id] != null) {
        return false;
    }
    this.store[id] = value;
    return true;
};


Store.prototype.delete = function (id) {
    const value = this.store[id];
    if (value == null) {
        return false;
    }
    delete this.store[id];
    return true;
};


Store.prototype.isSet = function (id) {
    return this.store[id] != null;
};


Store.prototype.initCleaning = function (ageProp, onMaxAgeExceeded, interval = 1000, maxAge = 60 * 1000) {
    this.interval = setInterval((function () {
        cleaning(this.store, ageProp, maxAge, onMaxAgeExceeded);
    }).bind(this), interval);
};


Store.prototype.stopCleaning = function () {
    clearInterval(this.interval);
};


// ==== STATIC FUNCTIONS ====


// ==== HELPER FUNCTIONS ====
const cleaning = (store, ageProp, maxAge, onMaxAgeExceeded) => {
    const now    = new Date().getTime();
    const values = Object.keys(store).map(k => store[k]);
    values.forEach(v => {
        if (now - v[ageProp] > maxAge) {
            onMaxAgeExceeded(v);
        }
    });
};