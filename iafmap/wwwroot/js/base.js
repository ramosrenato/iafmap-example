var _basejs = {};

_basejs.Object = {

    /**
    * Estende uma classe em javascript
    *
    * Ex: var newObj = extend(obj1, obj2);
    */
    extend: function (dest, src) {
        dest = dest || {};
        if (src) {
            for (var prop in src) {
                var val = src[prop];
                if (val !== undefined) dest[prop] = val;
            }

            var srcIsEvt = typeof window.Event == 'function' && src instanceof window.Event;
            if (!srcIsEvt && src.hasOwnProperty && src.hasOwnProperty('toString')) {
                dest.toString = src.toString;
            }
        }
        return dest;
    },

    /**
    * Cria uma instancia de uma classe
    *
    * Ex: var newObj = create(objbase, { newProp: 1 });
    *
    */
    create: function () {
        var cl = function () {
            if (arguments && arguments[0] != function () { }) {
                this.initialize.apply(this, arguments);
            }
        };
        var pnt, init, ext = {};
        for (var i = 0, l = arguments.length; i < l; ++i) {
            if (typeof arguments[i] == "function") {
                if (i == 0 && l > 1) {
                    init = arguments[i].prototype.initialize;
                    arguments[i].prototype.initialize = function () { };
                    ext = new arguments[i];
                    if (init === undefined) {
                        delete arguments[i].prototype.initialize;
                    } else {
                        arguments[i].prototype.initialize = init;
                    }
                }
                pnt = arguments[i].prototype;
            } else {
                pnt = arguments[i];
            }
            _basejs.Object.extend(ext, pnt);
        }
        cl.prototype = ext;
        return cl;
    }
};

_basejs.Function = {

    bind: function (func, object) {
    
        var args = Array.prototype.slice.apply(arguments, [2]);
        
        return function () {
            var newArgs = args.concat(
                Array.prototype.slice.apply(arguments, [0])
            );

            return func.apply(object, newArgs);
        };
    },

    bindAsEventListener: function (func, object) {
        return function (event) {
            return func.call(object, event || window.event);
        };
    }
};
