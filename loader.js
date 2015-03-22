(function loaderInitIIFE() { // This is invisible to the global scope, even when named
    "use strict";
    
    // Promise polyfill, too lazy to doc, just a quick and dirty implementation
    var P;
    
    if (window.Promise) {
        P = window.Promise;
    } else {
        P = function Promise(func) {
            this.thens = [];
            this.catches = [];
            var self = this;
            setTimeout(function promiseImmediateTimeout() {
                func(self.resolve, self.reject);
            }, 0);
        };
        P.prototype.then = function then(func) {
            this.thens.push(func);
        };
        P.prototype["catch"] = function promiseCatch(func) {
            this.catches.push(func);
        };
        P.prototype.resolve = function resolve() {
            var args = arguments;
            this.thens.forEach(function thenCaller(tf) {
                tf.apply(null, args);
            });
        };
        P.prototype.reject = function reject() {
            if (this.catches.length === 0) {
                throw new Error("Uncaught error in promise!");
            }
            var args = arguments;
            this.catches.forEach(function catcherCaller(cf) {
                cf.apply(null, args);
            });
        };
    }
    
    var moduleIndex;
    
    /**
     * Parses a JSON string, removes C-style comments.
     * @param {!string} string String to be parsed as JSON
     * @returns {Object} Object represented by JSON string
     */
    function parseJson(string) {
        return JSON.parse(string.replace(/(\/\/[^\n]*|\/\*((?!\*\/)[\s\S])*\*\/)/g, ""));
    }
    
    /**
     * Makes an HTTP request.
     * @param {!string} url URL to make the request to
     * @param {Object} [options] Options object, tells the function more details about the request
     * @param {string} [options.method=GET] HTTP method used to make the request.
     * @returns {Promise} Promise resolving when the request is complete. Throws (status, request) on error, resolves (response, request) on success.
     */
    function request(url, options) {
        if (typeof options !== "object") {
            options = {};
        }
        if (typeof options.method !== "string") {
            options.method = "GET";
        }
        return new P(function requestPromise(resolve, reject) {
            var req = new XMLHttpRequest();
            req.onload = function requestLoad() {
                resolve(req.response, req);
            };
            req.onerror = function requestError() {
                reject(req.status, req);
            };
            req.open(options.method, url);
            req.send();
        });
    }
    
    /**
     * Loads the specified module.
     * @param {string} moduleName Module to be loaded, named as in index.json
     * @param {string} [relativePathOverride] Used internally, indicates relative path to be used
     * @returns {Promise} Promise resolved on successful module loading, rejects with an Error when fails to load module.
     */
    function loadModule(moduleName, relativePathOverride) {
        return new P(function moduleLoadingPromise(resolve, reject) {
            var moduleMeta = moduleIndex.modules[moduleName];
            if (!moduleMeta) {
                reject(new Error('Module "' + moduleName + '" is not present in modules/index.json'));
                return;
            }
            if (moduleMeta.pathOverride) {
                // TODO
            }
        });
    }
    
    request("modules/index.json").then(function moduleIndexLoaded(response) {
        moduleIndex = parseJson(response);
        
        loadModule(moduleIndex.defaultModule);
        
    }); // No catch, if we fail to load, we fail to load.
}());
