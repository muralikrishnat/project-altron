(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === "object" && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.lighdator = factory();
    }
})(typeof self !== "undefined" ? self : this, function() {
    var allowedrules = [
            "data-validate-required",
            "data-validate-minlength",
            "data-validate-maxlength",
            "data-validate-regex",
            "data-validate-email",
            "data-validate-alpha",
            "data-validate-alphanumeric"
        ],
        validationFunctions = {
            required: function(val, istrue) {
                return val && val.length > 0;
            },
            minlength: function(val, len) {
                if (val && val.length > 0) {
                    return val.length >= len;
                }
                return true;
            },
            maxlength: function(val, len) {
                if (val && val.length > 0) {
                    return val.length <= len;
                }
                return true;
            },
            regex: function(val, regex) {
                if (val && val.length > 0) {
                    return new RegExp(regex, "ig").test(val);
                }
                return true;
            },
            alpha: function(val) {
                if (val && val.length > 0) {
                    return new RegExp(/^[a-zA-Z]+$/, "ig").test(val);
                }
                return true;
            },
            alphanumeric: function(val) {
                if (val && val.length > 0) {
                    return new RegExp(/^[a-zA-Z0-9]+$/, "ig").test(val);
                }
                return true;
            },
            email: function(val) {
                if (val && val.length > 0) {
                    return new RegExp(
                        /(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/,
                        "ig"
                    ).test(val);
                }
                return true;
            }
        },
        getValidations = function(elem) {
            let validations = {};
            if (elem) {
                allowedrules.forEach(function(item) {
                    let validationStr = elem.getAttribute(item);
                    if (validationStr) {
                        validations[
                            item.replace("data-validate-", "")
                        ] = validationStr;
                    }
                });
            }
            return validations;
        };
    return {
        validateField: function(elem) {
            let validations = getValidations(elem);
            let errors = [];
            if (Object.keys(validations).length > 0) {
                Object.keys(validations).forEach(validation => {
                    var validationHandler = validationFunctions[validation];
                    if (validationHandler) {
                        if (!validationHandler(elem.value, validations[validation])) {
                            if (errors.length === 0) {
                                elem.parentNode.classList.add(validation);
                            }
                            errors.push(validation);
                        } else {
                            elem.parentNode.classList.remove(validation);
                        }
                    }
                });
            }
            if (errors.length > 0) {
                elem.parentNode.classList.add("invalid");
            } else {
                elem.parentNode.classList.remove("invalid");
            }
            return {
                valid: errors.length === 0,
                errors: errors
            };
        },
        bindValidation: function() {
            Array.from(
                document.querySelectorAll('[data-validate-reactive]')
            ).forEach(elem => {
                elem.addEventListener('keyup', (event) => {
                    this.validateField(event.target);
                });
                elem.addEventListener('change', (event) => {
                    this.validateField(event.target);
                });
            });
        },
        validateForm: function(elemContainer) {
            let errors = [];
            if (elemContainer.querySelectorAll) {
                Array.from(
                    elemContainer.querySelectorAll("input, select, textarea")
                ).forEach(elem => {
                    var validationResult = this.validateField(elem);
                    if (!validationResult.valid) {
                        errors.push({
                            elem: elem,
                            errors: validationResult.errors
                        });
                    }
                });
            }
            return {
                valid: errors.length === 0,
                errors: errors
            };
        }
    };
});