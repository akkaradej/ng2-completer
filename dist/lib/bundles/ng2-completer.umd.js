(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs/operators'), require('@angular/common/http'), require('@angular/forms'), require('@angular/common')) :
    typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'rxjs/operators', '@angular/common/http', '@angular/forms', '@angular/common'], factory) :
    (factory((global.ng2 = global.ng2 || {}, global.ng2.completer = {}),global.ng.core,global.Rx.Observable.prototype,global.ng.common.http,global.ng.forms,global.ng.common));
}(this, (function (exports,core,operators,http,forms,common) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isFunction(x) {
        return typeof x === 'function';
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var _enable_super_gross_mode_that_will_cause_bad_things = false;
    var config = {
        Promise: undefined,
        set useDeprecatedSynchronousErrorHandling(value) {
            if (value) {
                var error = /*@__PURE__*/ new Error();
                /*@__PURE__*/ console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
            }
            else if (_enable_super_gross_mode_that_will_cause_bad_things) {
                /*@__PURE__*/ console.log('RxJS: Back to a better error behavior. Thank you. <3');
            }
            _enable_super_gross_mode_that_will_cause_bad_things = value;
        },
        get useDeprecatedSynchronousErrorHandling() {
            return _enable_super_gross_mode_that_will_cause_bad_things;
        },
    };

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function hostReportError(err) {
        setTimeout(function () { throw err; });
    }

    /** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */
    var empty = {
        closed: true,
        next: function (value) { },
        error: function (err) {
            if (config.useDeprecatedSynchronousErrorHandling) {
                throw err;
            }
            else {
                hostReportError(err);
            }
        },
        complete: function () { }
    };

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var isArray = Array.isArray || (function (x) { return x && typeof x.length === 'number'; });

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isObject(x) {
        return x != null && typeof x === 'object';
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var errorObject = { e: {} };

    /** PURE_IMPORTS_START _errorObject PURE_IMPORTS_END */
    var tryCatchTarget;
    function tryCatcher() {
        try {
            return tryCatchTarget.apply(this, arguments);
        }
        catch (e) {
            errorObject.e = e;
            return errorObject;
        }
    }
    function tryCatch(fn) {
        tryCatchTarget = fn;
        return tryCatcher;
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function UnsubscriptionErrorImpl(errors) {
        Error.call(this);
        this.message = errors ?
            errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '';
        this.name = 'UnsubscriptionError';
        this.errors = errors;
        return this;
    }
    UnsubscriptionErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
    var UnsubscriptionError = UnsubscriptionErrorImpl;

    /** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_tryCatch,_util_errorObject,_util_UnsubscriptionError PURE_IMPORTS_END */
    var Subscription = /*@__PURE__*/ (function () {
        function Subscription(unsubscribe) {
            this.closed = false;
            this._parent = null;
            this._parents = null;
            this._subscriptions = null;
            if (unsubscribe) {
                this._unsubscribe = unsubscribe;
            }
        }
        Subscription.prototype.unsubscribe = function () {
            var hasErrors = false;
            var errors;
            if (this.closed) {
                return;
            }
            var _a = this, _parent = _a._parent, _parents = _a._parents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
            this.closed = true;
            this._parent = null;
            this._parents = null;
            this._subscriptions = null;
            var index = -1;
            var len = _parents ? _parents.length : 0;
            while (_parent) {
                _parent.remove(this);
                _parent = ++index < len && _parents[index] || null;
            }
            if (isFunction(_unsubscribe)) {
                var trial = tryCatch(_unsubscribe).call(this);
                if (trial === errorObject) {
                    hasErrors = true;
                    errors = errors || (errorObject.e instanceof UnsubscriptionError ?
                        flattenUnsubscriptionErrors(errorObject.e.errors) : [errorObject.e]);
                }
            }
            if (isArray(_subscriptions)) {
                index = -1;
                len = _subscriptions.length;
                while (++index < len) {
                    var sub = _subscriptions[index];
                    if (isObject(sub)) {
                        var trial = tryCatch(sub.unsubscribe).call(sub);
                        if (trial === errorObject) {
                            hasErrors = true;
                            errors = errors || [];
                            var err = errorObject.e;
                            if (err instanceof UnsubscriptionError) {
                                errors = errors.concat(flattenUnsubscriptionErrors(err.errors));
                            }
                            else {
                                errors.push(err);
                            }
                        }
                    }
                }
            }
            if (hasErrors) {
                throw new UnsubscriptionError(errors);
            }
        };
        Subscription.prototype.add = function (teardown) {
            if (!teardown || (teardown === Subscription.EMPTY)) {
                return Subscription.EMPTY;
            }
            if (teardown === this) {
                return this;
            }
            var subscription = teardown;
            switch (typeof teardown) {
                case 'function':
                    subscription = new Subscription(teardown);
                case 'object':
                    if (subscription.closed || typeof subscription.unsubscribe !== 'function') {
                        return subscription;
                    }
                    else if (this.closed) {
                        subscription.unsubscribe();
                        return subscription;
                    }
                    else if (typeof subscription._addParent !== 'function') {
                        var tmp = subscription;
                        subscription = new Subscription();
                        subscription._subscriptions = [tmp];
                    }
                    break;
                default:
                    throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
            }
            var subscriptions = this._subscriptions || (this._subscriptions = []);
            subscriptions.push(subscription);
            subscription._addParent(this);
            return subscription;
        };
        Subscription.prototype.remove = function (subscription) {
            var subscriptions = this._subscriptions;
            if (subscriptions) {
                var subscriptionIndex = subscriptions.indexOf(subscription);
                if (subscriptionIndex !== -1) {
                    subscriptions.splice(subscriptionIndex, 1);
                }
            }
        };
        Subscription.prototype._addParent = function (parent) {
            var _a = this, _parent = _a._parent, _parents = _a._parents;
            if (!_parent || _parent === parent) {
                this._parent = parent;
            }
            else if (!_parents) {
                this._parents = [parent];
            }
            else if (_parents.indexOf(parent) === -1) {
                _parents.push(parent);
            }
        };
        Subscription.EMPTY = (function (empty) {
            empty.closed = true;
            return empty;
        }(new Subscription()));
        return Subscription;
    }());
    function flattenUnsubscriptionErrors(errors) {
        return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError) ? err.errors : err); }, []);
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var rxSubscriber = typeof Symbol === 'function'
        ? /*@__PURE__*/ Symbol('rxSubscriber')
        : '@@rxSubscriber_' + /*@__PURE__*/ Math.random();

    /** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */
    var Subscriber = /*@__PURE__*/ (function (_super) {
        __extends(Subscriber, _super);
        function Subscriber(destinationOrNext, error, complete) {
            var _this = _super.call(this) || this;
            _this.syncErrorValue = null;
            _this.syncErrorThrown = false;
            _this.syncErrorThrowable = false;
            _this.isStopped = false;
            _this._parentSubscription = null;
            switch (arguments.length) {
                case 0:
                    _this.destination = empty;
                    break;
                case 1:
                    if (!destinationOrNext) {
                        _this.destination = empty;
                        break;
                    }
                    if (typeof destinationOrNext === 'object') {
                        if (destinationOrNext instanceof Subscriber) {
                            _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                            _this.destination = destinationOrNext;
                            destinationOrNext.add(_this);
                        }
                        else {
                            _this.syncErrorThrowable = true;
                            _this.destination = new SafeSubscriber(_this, destinationOrNext);
                        }
                        break;
                    }
                default:
                    _this.syncErrorThrowable = true;
                    _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
                    break;
            }
            return _this;
        }
        Subscriber.prototype[rxSubscriber] = function () { return this; };
        Subscriber.create = function (next, error, complete) {
            var subscriber = new Subscriber(next, error, complete);
            subscriber.syncErrorThrowable = false;
            return subscriber;
        };
        Subscriber.prototype.next = function (value) {
            if (!this.isStopped) {
                this._next(value);
            }
        };
        Subscriber.prototype.error = function (err) {
            if (!this.isStopped) {
                this.isStopped = true;
                this._error(err);
            }
        };
        Subscriber.prototype.complete = function () {
            if (!this.isStopped) {
                this.isStopped = true;
                this._complete();
            }
        };
        Subscriber.prototype.unsubscribe = function () {
            if (this.closed) {
                return;
            }
            this.isStopped = true;
            _super.prototype.unsubscribe.call(this);
        };
        Subscriber.prototype._next = function (value) {
            this.destination.next(value);
        };
        Subscriber.prototype._error = function (err) {
            this.destination.error(err);
            this.unsubscribe();
        };
        Subscriber.prototype._complete = function () {
            this.destination.complete();
            this.unsubscribe();
        };
        Subscriber.prototype._unsubscribeAndRecycle = function () {
            var _a = this, _parent = _a._parent, _parents = _a._parents;
            this._parent = null;
            this._parents = null;
            this.unsubscribe();
            this.closed = false;
            this.isStopped = false;
            this._parent = _parent;
            this._parents = _parents;
            this._parentSubscription = null;
            return this;
        };
        return Subscriber;
    }(Subscription));
    var SafeSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(SafeSubscriber, _super);
        function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
            var _this = _super.call(this) || this;
            _this._parentSubscriber = _parentSubscriber;
            var next;
            var context = _this;
            if (isFunction(observerOrNext)) {
                next = observerOrNext;
            }
            else if (observerOrNext) {
                next = observerOrNext.next;
                error = observerOrNext.error;
                complete = observerOrNext.complete;
                if (observerOrNext !== empty) {
                    context = Object.create(observerOrNext);
                    if (isFunction(context.unsubscribe)) {
                        _this.add(context.unsubscribe.bind(context));
                    }
                    context.unsubscribe = _this.unsubscribe.bind(_this);
                }
            }
            _this._context = context;
            _this._next = next;
            _this._error = error;
            _this._complete = complete;
            return _this;
        }
        SafeSubscriber.prototype.next = function (value) {
            if (!this.isStopped && this._next) {
                var _parentSubscriber = this._parentSubscriber;
                if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._next, value);
                }
                else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.error = function (err) {
            if (!this.isStopped) {
                var _parentSubscriber = this._parentSubscriber;
                var useDeprecatedSynchronousErrorHandling = config.useDeprecatedSynchronousErrorHandling;
                if (this._error) {
                    if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                        this.__tryOrUnsub(this._error, err);
                        this.unsubscribe();
                    }
                    else {
                        this.__tryOrSetError(_parentSubscriber, this._error, err);
                        this.unsubscribe();
                    }
                }
                else if (!_parentSubscriber.syncErrorThrowable) {
                    this.unsubscribe();
                    if (useDeprecatedSynchronousErrorHandling) {
                        throw err;
                    }
                    hostReportError(err);
                }
                else {
                    if (useDeprecatedSynchronousErrorHandling) {
                        _parentSubscriber.syncErrorValue = err;
                        _parentSubscriber.syncErrorThrown = true;
                    }
                    else {
                        hostReportError(err);
                    }
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.complete = function () {
            var _this = this;
            if (!this.isStopped) {
                var _parentSubscriber = this._parentSubscriber;
                if (this._complete) {
                    var wrappedComplete = function () { return _this._complete.call(_this._context); };
                    if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                        this.__tryOrUnsub(wrappedComplete);
                        this.unsubscribe();
                    }
                    else {
                        this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                        this.unsubscribe();
                    }
                }
                else {
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
            try {
                fn.call(this._context, value);
            }
            catch (err) {
                this.unsubscribe();
                if (config.useDeprecatedSynchronousErrorHandling) {
                    throw err;
                }
                else {
                    hostReportError(err);
                }
            }
        };
        SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
            if (!config.useDeprecatedSynchronousErrorHandling) {
                throw new Error('bad call');
            }
            try {
                fn.call(this._context, value);
            }
            catch (err) {
                if (config.useDeprecatedSynchronousErrorHandling) {
                    parent.syncErrorValue = err;
                    parent.syncErrorThrown = true;
                    return true;
                }
                else {
                    hostReportError(err);
                    return true;
                }
            }
            return false;
        };
        SafeSubscriber.prototype._unsubscribe = function () {
            var _parentSubscriber = this._parentSubscriber;
            this._context = null;
            this._parentSubscriber = null;
            _parentSubscriber.unsubscribe();
        };
        return SafeSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START _Subscriber PURE_IMPORTS_END */
    function canReportError(observer) {
        while (observer) {
            var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
            if (closed_1 || isStopped) {
                return false;
            }
            else if (destination && destination instanceof Subscriber) {
                observer = destination;
            }
            else {
                observer = null;
            }
        }
        return true;
    }

    /** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */
    function toSubscriber(nextOrObserver, error, complete) {
        if (nextOrObserver) {
            if (nextOrObserver instanceof Subscriber) {
                return nextOrObserver;
            }
            if (nextOrObserver[rxSubscriber]) {
                return nextOrObserver[rxSubscriber]();
            }
        }
        if (!nextOrObserver && !error && !complete) {
            return new Subscriber(empty);
        }
        return new Subscriber(nextOrObserver, error, complete);
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var observable = typeof Symbol === 'function' && Symbol.observable || '@@observable';

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function noop() { }

    /** PURE_IMPORTS_START _noop PURE_IMPORTS_END */
    function pipeFromArray(fns) {
        if (!fns) {
            return noop;
        }
        if (fns.length === 1) {
            return fns[0];
        }
        return function piped(input) {
            return fns.reduce(function (prev, fn) { return fn(prev); }, input);
        };
    }

    /** PURE_IMPORTS_START _util_canReportError,_util_toSubscriber,_internal_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */
    var Observable = /*@__PURE__*/ (function () {
        function Observable(subscribe) {
            this._isScalar = false;
            if (subscribe) {
                this._subscribe = subscribe;
            }
        }
        Observable.prototype.lift = function (operator) {
            var observable$$1 = new Observable();
            observable$$1.source = this;
            observable$$1.operator = operator;
            return observable$$1;
        };
        Observable.prototype.subscribe = function (observerOrNext, error, complete) {
            var operator = this.operator;
            var sink = toSubscriber(observerOrNext, error, complete);
            if (operator) {
                operator.call(sink, this.source);
            }
            else {
                sink.add(this.source || (config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
                    this._subscribe(sink) :
                    this._trySubscribe(sink));
            }
            if (config.useDeprecatedSynchronousErrorHandling) {
                if (sink.syncErrorThrowable) {
                    sink.syncErrorThrowable = false;
                    if (sink.syncErrorThrown) {
                        throw sink.syncErrorValue;
                    }
                }
            }
            return sink;
        };
        Observable.prototype._trySubscribe = function (sink) {
            try {
                return this._subscribe(sink);
            }
            catch (err) {
                if (config.useDeprecatedSynchronousErrorHandling) {
                    sink.syncErrorThrown = true;
                    sink.syncErrorValue = err;
                }
                if (canReportError(sink)) {
                    sink.error(err);
                }
                else {
                    console.warn(err);
                }
            }
        };
        Observable.prototype.forEach = function (next, promiseCtor) {
            var _this = this;
            promiseCtor = getPromiseCtor(promiseCtor);
            return new promiseCtor(function (resolve, reject) {
                var subscription;
                subscription = _this.subscribe(function (value) {
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        if (subscription) {
                            subscription.unsubscribe();
                        }
                    }
                }, reject, resolve);
            });
        };
        Observable.prototype._subscribe = function (subscriber) {
            var source = this.source;
            return source && source.subscribe(subscriber);
        };
        Observable.prototype[observable] = function () {
            return this;
        };
        Observable.prototype.pipe = function () {
            var operations = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                operations[_i] = arguments[_i];
            }
            if (operations.length === 0) {
                return this;
            }
            return pipeFromArray(operations)(this);
        };
        Observable.prototype.toPromise = function (promiseCtor) {
            var _this = this;
            promiseCtor = getPromiseCtor(promiseCtor);
            return new promiseCtor(function (resolve, reject) {
                var value;
                _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
            });
        };
        Observable.create = function (subscribe) {
            return new Observable(subscribe);
        };
        return Observable;
    }());
    function getPromiseCtor(promiseCtor) {
        if (!promiseCtor) {
            promiseCtor = config.Promise || Promise;
        }
        if (!promiseCtor) {
            throw new Error('no Promise impl found');
        }
        return promiseCtor;
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function ObjectUnsubscribedErrorImpl() {
        Error.call(this);
        this.message = 'object unsubscribed';
        this.name = 'ObjectUnsubscribedError';
        return this;
    }
    ObjectUnsubscribedErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
    var ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;

    /** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
    var SubjectSubscription = /*@__PURE__*/ (function (_super) {
        __extends(SubjectSubscription, _super);
        function SubjectSubscription(subject, subscriber) {
            var _this = _super.call(this) || this;
            _this.subject = subject;
            _this.subscriber = subscriber;
            _this.closed = false;
            return _this;
        }
        SubjectSubscription.prototype.unsubscribe = function () {
            if (this.closed) {
                return;
            }
            this.closed = true;
            var subject = this.subject;
            var observers = subject.observers;
            this.subject = null;
            if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
                return;
            }
            var subscriberIndex = observers.indexOf(this.subscriber);
            if (subscriberIndex !== -1) {
                observers.splice(subscriberIndex, 1);
            }
        };
        return SubjectSubscription;
    }(Subscription));

    /** PURE_IMPORTS_START tslib,_Observable,_Subscriber,_Subscription,_util_ObjectUnsubscribedError,_SubjectSubscription,_internal_symbol_rxSubscriber PURE_IMPORTS_END */
    var SubjectSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(SubjectSubscriber, _super);
        function SubjectSubscriber(destination) {
            var _this = _super.call(this, destination) || this;
            _this.destination = destination;
            return _this;
        }
        return SubjectSubscriber;
    }(Subscriber));
    var Subject = /*@__PURE__*/ (function (_super) {
        __extends(Subject, _super);
        function Subject() {
            var _this = _super.call(this) || this;
            _this.observers = [];
            _this.closed = false;
            _this.isStopped = false;
            _this.hasError = false;
            _this.thrownError = null;
            return _this;
        }
        Subject.prototype[rxSubscriber] = function () {
            return new SubjectSubscriber(this);
        };
        Subject.prototype.lift = function (operator) {
            var subject = new AnonymousSubject(this, this);
            subject.operator = operator;
            return subject;
        };
        Subject.prototype.next = function (value) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            if (!this.isStopped) {
                var observers = this.observers;
                var len = observers.length;
                var copy = observers.slice();
                for (var i = 0; i < len; i++) {
                    copy[i].next(value);
                }
            }
        };
        Subject.prototype.error = function (err) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            this.hasError = true;
            this.thrownError = err;
            this.isStopped = true;
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].error(err);
            }
            this.observers.length = 0;
        };
        Subject.prototype.complete = function () {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            this.isStopped = true;
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].complete();
            }
            this.observers.length = 0;
        };
        Subject.prototype.unsubscribe = function () {
            this.isStopped = true;
            this.closed = true;
            this.observers = null;
        };
        Subject.prototype._trySubscribe = function (subscriber) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            else {
                return _super.prototype._trySubscribe.call(this, subscriber);
            }
        };
        Subject.prototype._subscribe = function (subscriber) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            else if (this.hasError) {
                subscriber.error(this.thrownError);
                return Subscription.EMPTY;
            }
            else if (this.isStopped) {
                subscriber.complete();
                return Subscription.EMPTY;
            }
            else {
                this.observers.push(subscriber);
                return new SubjectSubscription(this, subscriber);
            }
        };
        Subject.prototype.asObservable = function () {
            var observable = new Observable();
            observable.source = this;
            return observable;
        };
        Subject.create = function (destination, source) {
            return new AnonymousSubject(destination, source);
        };
        return Subject;
    }(Observable));
    var AnonymousSubject = /*@__PURE__*/ (function (_super) {
        __extends(AnonymousSubject, _super);
        function AnonymousSubject(destination, source) {
            var _this = _super.call(this) || this;
            _this.destination = destination;
            _this.source = source;
            return _this;
        }
        AnonymousSubject.prototype.next = function (value) {
            var destination = this.destination;
            if (destination && destination.next) {
                destination.next(value);
            }
        };
        AnonymousSubject.prototype.error = function (err) {
            var destination = this.destination;
            if (destination && destination.error) {
                this.destination.error(err);
            }
        };
        AnonymousSubject.prototype.complete = function () {
            var destination = this.destination;
            if (destination && destination.complete) {
                this.destination.complete();
            }
        };
        AnonymousSubject.prototype._subscribe = function (subscriber) {
            var source = this.source;
            if (source) {
                return this.source.subscribe(subscriber);
            }
            else {
                return Subscription.EMPTY;
            }
        };
        return AnonymousSubject;
    }(Subject));

    /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
    function refCount() {
        return function refCountOperatorFunction(source) {
            return source.lift(new RefCountOperator(source));
        };
    }
    var RefCountOperator = /*@__PURE__*/ (function () {
        function RefCountOperator(connectable) {
            this.connectable = connectable;
        }
        RefCountOperator.prototype.call = function (subscriber, source) {
            var connectable = this.connectable;
            connectable._refCount++;
            var refCounter = new RefCountSubscriber(subscriber, connectable);
            var subscription = source.subscribe(refCounter);
            if (!refCounter.closed) {
                refCounter.connection = connectable.connect();
            }
            return subscription;
        };
        return RefCountOperator;
    }());
    var RefCountSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(RefCountSubscriber, _super);
        function RefCountSubscriber(destination, connectable) {
            var _this = _super.call(this, destination) || this;
            _this.connectable = connectable;
            return _this;
        }
        RefCountSubscriber.prototype._unsubscribe = function () {
            var connectable = this.connectable;
            if (!connectable) {
                this.connection = null;
                return;
            }
            this.connectable = null;
            var refCount = connectable._refCount;
            if (refCount <= 0) {
                this.connection = null;
                return;
            }
            connectable._refCount = refCount - 1;
            if (refCount > 1) {
                this.connection = null;
                return;
            }
            var connection = this.connection;
            var sharedConnection = connectable._connection;
            this.connection = null;
            if (sharedConnection && (!connection || sharedConnection === connection)) {
                sharedConnection.unsubscribe();
            }
        };
        return RefCountSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START tslib,_Subject,_Observable,_Subscriber,_Subscription,_operators_refCount PURE_IMPORTS_END */
    var ConnectableObservable = /*@__PURE__*/ (function (_super) {
        __extends(ConnectableObservable, _super);
        function ConnectableObservable(source, subjectFactory) {
            var _this = _super.call(this) || this;
            _this.source = source;
            _this.subjectFactory = subjectFactory;
            _this._refCount = 0;
            _this._isComplete = false;
            return _this;
        }
        ConnectableObservable.prototype._subscribe = function (subscriber) {
            return this.getSubject().subscribe(subscriber);
        };
        ConnectableObservable.prototype.getSubject = function () {
            var subject = this._subject;
            if (!subject || subject.isStopped) {
                this._subject = this.subjectFactory();
            }
            return this._subject;
        };
        ConnectableObservable.prototype.connect = function () {
            var connection = this._connection;
            if (!connection) {
                this._isComplete = false;
                connection = this._connection = new Subscription();
                connection.add(this.source
                    .subscribe(new ConnectableSubscriber(this.getSubject(), this)));
                if (connection.closed) {
                    this._connection = null;
                    connection = Subscription.EMPTY;
                }
                else {
                    this._connection = connection;
                }
            }
            return connection;
        };
        ConnectableObservable.prototype.refCount = function () {
            return refCount()(this);
        };
        return ConnectableObservable;
    }(Observable));
    var ConnectableSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(ConnectableSubscriber, _super);
        function ConnectableSubscriber(destination, connectable) {
            var _this = _super.call(this, destination) || this;
            _this.connectable = connectable;
            return _this;
        }
        ConnectableSubscriber.prototype._error = function (err) {
            this._unsubscribe();
            _super.prototype._error.call(this, err);
        };
        ConnectableSubscriber.prototype._complete = function () {
            this.connectable._isComplete = true;
            this._unsubscribe();
            _super.prototype._complete.call(this);
        };
        ConnectableSubscriber.prototype._unsubscribe = function () {
            var connectable = this.connectable;
            if (connectable) {
                this.connectable = null;
                var connection = connectable._connection;
                connectable._refCount = 0;
                connectable._subject = null;
                connectable._connection = null;
                if (connection) {
                    connection.unsubscribe();
                }
            }
        };
        return ConnectableSubscriber;
    }(SubjectSubscriber));
    var RefCountSubscriber$1 = /*@__PURE__*/ (function (_super) {
        __extends(RefCountSubscriber, _super);
        function RefCountSubscriber(destination, connectable) {
            var _this = _super.call(this, destination) || this;
            _this.connectable = connectable;
            return _this;
        }
        RefCountSubscriber.prototype._unsubscribe = function () {
            var connectable = this.connectable;
            if (!connectable) {
                this.connection = null;
                return;
            }
            this.connectable = null;
            var refCount$$1 = connectable._refCount;
            if (refCount$$1 <= 0) {
                this.connection = null;
                return;
            }
            connectable._refCount = refCount$$1 - 1;
            if (refCount$$1 > 1) {
                this.connection = null;
                return;
            }
            var connection = this.connection;
            var sharedConnection = connectable._connection;
            this.connection = null;
            if (sharedConnection && (!connection || sharedConnection === connection)) {
                sharedConnection.unsubscribe();
            }
        };
        return RefCountSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START tslib,_Subscriber,_Subscription,_Observable,_Subject PURE_IMPORTS_END */
    var GroupBySubscriber = /*@__PURE__*/ (function (_super) {
        __extends(GroupBySubscriber, _super);
        function GroupBySubscriber(destination, keySelector, elementSelector, durationSelector, subjectSelector) {
            var _this = _super.call(this, destination) || this;
            _this.keySelector = keySelector;
            _this.elementSelector = elementSelector;
            _this.durationSelector = durationSelector;
            _this.subjectSelector = subjectSelector;
            _this.groups = null;
            _this.attemptedToUnsubscribe = false;
            _this.count = 0;
            return _this;
        }
        GroupBySubscriber.prototype._next = function (value) {
            var key;
            try {
                key = this.keySelector(value);
            }
            catch (err) {
                this.error(err);
                return;
            }
            this._group(value, key);
        };
        GroupBySubscriber.prototype._group = function (value, key) {
            var groups = this.groups;
            if (!groups) {
                groups = this.groups = new Map();
            }
            var group = groups.get(key);
            var element;
            if (this.elementSelector) {
                try {
                    element = this.elementSelector(value);
                }
                catch (err) {
                    this.error(err);
                }
            }
            else {
                element = value;
            }
            if (!group) {
                group = (this.subjectSelector ? this.subjectSelector() : new Subject());
                groups.set(key, group);
                var groupedObservable = new GroupedObservable(key, group, this);
                this.destination.next(groupedObservable);
                if (this.durationSelector) {
                    var duration = void 0;
                    try {
                        duration = this.durationSelector(new GroupedObservable(key, group));
                    }
                    catch (err) {
                        this.error(err);
                        return;
                    }
                    this.add(duration.subscribe(new GroupDurationSubscriber(key, group, this)));
                }
            }
            if (!group.closed) {
                group.next(element);
            }
        };
        GroupBySubscriber.prototype._error = function (err) {
            var groups = this.groups;
            if (groups) {
                groups.forEach(function (group, key) {
                    group.error(err);
                });
                groups.clear();
            }
            this.destination.error(err);
        };
        GroupBySubscriber.prototype._complete = function () {
            var groups = this.groups;
            if (groups) {
                groups.forEach(function (group, key) {
                    group.complete();
                });
                groups.clear();
            }
            this.destination.complete();
        };
        GroupBySubscriber.prototype.removeGroup = function (key) {
            this.groups.delete(key);
        };
        GroupBySubscriber.prototype.unsubscribe = function () {
            if (!this.closed) {
                this.attemptedToUnsubscribe = true;
                if (this.count === 0) {
                    _super.prototype.unsubscribe.call(this);
                }
            }
        };
        return GroupBySubscriber;
    }(Subscriber));
    var GroupDurationSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(GroupDurationSubscriber, _super);
        function GroupDurationSubscriber(key, group, parent) {
            var _this = _super.call(this, group) || this;
            _this.key = key;
            _this.group = group;
            _this.parent = parent;
            return _this;
        }
        GroupDurationSubscriber.prototype._next = function (value) {
            this.complete();
        };
        GroupDurationSubscriber.prototype._unsubscribe = function () {
            var _a = this, parent = _a.parent, key = _a.key;
            this.key = this.parent = null;
            if (parent) {
                parent.removeGroup(key);
            }
        };
        return GroupDurationSubscriber;
    }(Subscriber));
    var GroupedObservable = /*@__PURE__*/ (function (_super) {
        __extends(GroupedObservable, _super);
        function GroupedObservable(key, groupSubject, refCountSubscription) {
            var _this = _super.call(this) || this;
            _this.key = key;
            _this.groupSubject = groupSubject;
            _this.refCountSubscription = refCountSubscription;
            return _this;
        }
        GroupedObservable.prototype._subscribe = function (subscriber) {
            var subscription = new Subscription();
            var _a = this, refCountSubscription = _a.refCountSubscription, groupSubject = _a.groupSubject;
            if (refCountSubscription && !refCountSubscription.closed) {
                subscription.add(new InnerRefCountSubscription(refCountSubscription));
            }
            subscription.add(groupSubject.subscribe(subscriber));
            return subscription;
        };
        return GroupedObservable;
    }(Observable));
    var InnerRefCountSubscription = /*@__PURE__*/ (function (_super) {
        __extends(InnerRefCountSubscription, _super);
        function InnerRefCountSubscription(parent) {
            var _this = _super.call(this) || this;
            _this.parent = parent;
            parent.count++;
            return _this;
        }
        InnerRefCountSubscription.prototype.unsubscribe = function () {
            var parent = this.parent;
            if (!parent.closed && !this.closed) {
                _super.prototype.unsubscribe.call(this);
                parent.count -= 1;
                if (parent.count === 0 && parent.attemptedToUnsubscribe) {
                    parent.unsubscribe();
                }
            }
        };
        return InnerRefCountSubscription;
    }(Subscription));

    /** PURE_IMPORTS_START tslib,_Subject,_util_ObjectUnsubscribedError PURE_IMPORTS_END */
    var BehaviorSubject = /*@__PURE__*/ (function (_super) {
        __extends(BehaviorSubject, _super);
        function BehaviorSubject(_value) {
            var _this = _super.call(this) || this;
            _this._value = _value;
            return _this;
        }
        Object.defineProperty(BehaviorSubject.prototype, "value", {
            get: function () {
                return this.getValue();
            },
            enumerable: true,
            configurable: true
        });
        BehaviorSubject.prototype._subscribe = function (subscriber) {
            var subscription = _super.prototype._subscribe.call(this, subscriber);
            if (subscription && !subscription.closed) {
                subscriber.next(this._value);
            }
            return subscription;
        };
        BehaviorSubject.prototype.getValue = function () {
            if (this.hasError) {
                throw this.thrownError;
            }
            else if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            else {
                return this._value;
            }
        };
        BehaviorSubject.prototype.next = function (value) {
            _super.prototype.next.call(this, this._value = value);
        };
        return BehaviorSubject;
    }(Subject));

    /** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
    var Action = /*@__PURE__*/ (function (_super) {
        __extends(Action, _super);
        function Action(scheduler, work) {
            return _super.call(this) || this;
        }
        Action.prototype.schedule = function (state, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            return this;
        };
        return Action;
    }(Subscription));

    /** PURE_IMPORTS_START tslib,_Action PURE_IMPORTS_END */
    var AsyncAction = /*@__PURE__*/ (function (_super) {
        __extends(AsyncAction, _super);
        function AsyncAction(scheduler, work) {
            var _this = _super.call(this, scheduler, work) || this;
            _this.scheduler = scheduler;
            _this.work = work;
            _this.pending = false;
            return _this;
        }
        AsyncAction.prototype.schedule = function (state, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if (this.closed) {
                return this;
            }
            this.state = state;
            var id = this.id;
            var scheduler = this.scheduler;
            if (id != null) {
                this.id = this.recycleAsyncId(scheduler, id, delay);
            }
            this.pending = true;
            this.delay = delay;
            this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
            return this;
        };
        AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            return setInterval(scheduler.flush.bind(scheduler, this), delay);
        };
        AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if (delay !== null && this.delay === delay && this.pending === false) {
                return id;
            }
            clearInterval(id);
        };
        AsyncAction.prototype.execute = function (state, delay) {
            if (this.closed) {
                return new Error('executing a cancelled action');
            }
            this.pending = false;
            var error = this._execute(state, delay);
            if (error) {
                return error;
            }
            else if (this.pending === false && this.id != null) {
                this.id = this.recycleAsyncId(this.scheduler, this.id, null);
            }
        };
        AsyncAction.prototype._execute = function (state, delay) {
            var errored = false;
            var errorValue = undefined;
            try {
                this.work(state);
            }
            catch (e) {
                errored = true;
                errorValue = !!e && e || new Error(e);
            }
            if (errored) {
                this.unsubscribe();
                return errorValue;
            }
        };
        AsyncAction.prototype._unsubscribe = function () {
            var id = this.id;
            var scheduler = this.scheduler;
            var actions = scheduler.actions;
            var index = actions.indexOf(this);
            this.work = null;
            this.state = null;
            this.pending = false;
            this.scheduler = null;
            if (index !== -1) {
                actions.splice(index, 1);
            }
            if (id != null) {
                this.id = this.recycleAsyncId(scheduler, id, null);
            }
            this.delay = null;
        };
        return AsyncAction;
    }(Action));

    /** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */
    var QueueAction = /*@__PURE__*/ (function (_super) {
        __extends(QueueAction, _super);
        function QueueAction(scheduler, work) {
            var _this = _super.call(this, scheduler, work) || this;
            _this.scheduler = scheduler;
            _this.work = work;
            return _this;
        }
        QueueAction.prototype.schedule = function (state, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if (delay > 0) {
                return _super.prototype.schedule.call(this, state, delay);
            }
            this.delay = delay;
            this.state = state;
            this.scheduler.flush(this);
            return this;
        };
        QueueAction.prototype.execute = function (state, delay) {
            return (delay > 0 || this.closed) ?
                _super.prototype.execute.call(this, state, delay) :
                this._execute(state, delay);
        };
        QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
                return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
            }
            return scheduler.flush(this);
        };
        return QueueAction;
    }(AsyncAction));

    var Scheduler = /*@__PURE__*/ (function () {
        function Scheduler(SchedulerAction, now) {
            if (now === void 0) {
                now = Scheduler.now;
            }
            this.SchedulerAction = SchedulerAction;
            this.now = now;
        }
        Scheduler.prototype.schedule = function (work, delay, state) {
            if (delay === void 0) {
                delay = 0;
            }
            return new this.SchedulerAction(this, work).schedule(state, delay);
        };
        Scheduler.now = function () { return Date.now(); };
        return Scheduler;
    }());

    /** PURE_IMPORTS_START tslib,_Scheduler PURE_IMPORTS_END */
    var AsyncScheduler = /*@__PURE__*/ (function (_super) {
        __extends(AsyncScheduler, _super);
        function AsyncScheduler(SchedulerAction, now) {
            if (now === void 0) {
                now = Scheduler.now;
            }
            var _this = _super.call(this, SchedulerAction, function () {
                if (AsyncScheduler.delegate && AsyncScheduler.delegate !== _this) {
                    return AsyncScheduler.delegate.now();
                }
                else {
                    return now();
                }
            }) || this;
            _this.actions = [];
            _this.active = false;
            _this.scheduled = undefined;
            return _this;
        }
        AsyncScheduler.prototype.schedule = function (work, delay, state) {
            if (delay === void 0) {
                delay = 0;
            }
            if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
                return AsyncScheduler.delegate.schedule(work, delay, state);
            }
            else {
                return _super.prototype.schedule.call(this, work, delay, state);
            }
        };
        AsyncScheduler.prototype.flush = function (action) {
            var actions = this.actions;
            if (this.active) {
                actions.push(action);
                return;
            }
            var error;
            this.active = true;
            do {
                if (error = action.execute(action.state, action.delay)) {
                    break;
                }
            } while (action = actions.shift());
            this.active = false;
            if (error) {
                while (action = actions.shift()) {
                    action.unsubscribe();
                }
                throw error;
            }
        };
        return AsyncScheduler;
    }(Scheduler));

    /** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
    var QueueScheduler = /*@__PURE__*/ (function (_super) {
        __extends(QueueScheduler, _super);
        function QueueScheduler() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return QueueScheduler;
    }(AsyncScheduler));

    /** PURE_IMPORTS_START _QueueAction,_QueueScheduler PURE_IMPORTS_END */
    var queue = /*@__PURE__*/ new QueueScheduler(QueueAction);

    /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
    var EMPTY = /*@__PURE__*/ new Observable(function (subscriber) { return subscriber.complete(); });
    function empty$1(scheduler) {
        return scheduler ? emptyScheduled(scheduler) : EMPTY;
    }
    function emptyScheduled(scheduler) {
        return new Observable(function (subscriber) { return scheduler.schedule(function () { return subscriber.complete(); }); });
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isScheduler(value) {
        return value && typeof value.schedule === 'function';
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var subscribeToArray = function (array) {
        return function (subscriber) {
            for (var i = 0, len = array.length; i < len && !subscriber.closed; i++) {
                subscriber.next(array[i]);
            }
            if (!subscriber.closed) {
                subscriber.complete();
            }
        };
    };

    /** PURE_IMPORTS_START _Observable,_Subscription,_util_subscribeToArray PURE_IMPORTS_END */
    function fromArray(input, scheduler) {
        if (!scheduler) {
            return new Observable(subscribeToArray(input));
        }
        else {
            return new Observable(function (subscriber) {
                var sub = new Subscription();
                var i = 0;
                sub.add(scheduler.schedule(function () {
                    if (i === input.length) {
                        subscriber.complete();
                        return;
                    }
                    subscriber.next(input[i++]);
                    if (!subscriber.closed) {
                        sub.add(this.schedule());
                    }
                }));
                return sub;
            });
        }
    }

    /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
    function scalar(value) {
        var result = new Observable(function (subscriber) {
            subscriber.next(value);
            subscriber.complete();
        });
        result._isScalar = true;
        result.value = value;
        return result;
    }

    /** PURE_IMPORTS_START _util_isScheduler,_fromArray,_empty,_scalar PURE_IMPORTS_END */
    function of() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var scheduler = args[args.length - 1];
        if (isScheduler(scheduler)) {
            args.pop();
        }
        else {
            scheduler = undefined;
        }
        switch (args.length) {
            case 0:
                return empty$1(scheduler);
            case 1:
                return scheduler ? fromArray(args, scheduler) : scalar(args[0]);
            default:
                return fromArray(args, scheduler);
        }
    }

    /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */
    function throwError(error, scheduler) {
        if (!scheduler) {
            return new Observable(function (subscriber) { return subscriber.error(error); });
        }
        else {
            return new Observable(function (subscriber) { return scheduler.schedule(dispatch, 0, { error: error, subscriber: subscriber }); });
        }
    }
    function dispatch(_a) {
        var error = _a.error, subscriber = _a.subscriber;
        subscriber.error(error);
    }

    /** PURE_IMPORTS_START _observable_empty,_observable_of,_observable_throwError PURE_IMPORTS_END */
    var Notification = /*@__PURE__*/ (function () {
        function Notification(kind, value, error) {
            this.kind = kind;
            this.value = value;
            this.error = error;
            this.hasValue = kind === 'N';
        }
        Notification.prototype.observe = function (observer) {
            switch (this.kind) {
                case 'N':
                    return observer.next && observer.next(this.value);
                case 'E':
                    return observer.error && observer.error(this.error);
                case 'C':
                    return observer.complete && observer.complete();
            }
        };
        Notification.prototype.do = function (next, error, complete) {
            var kind = this.kind;
            switch (kind) {
                case 'N':
                    return next && next(this.value);
                case 'E':
                    return error && error(this.error);
                case 'C':
                    return complete && complete();
            }
        };
        Notification.prototype.accept = function (nextOrObserver, error, complete) {
            if (nextOrObserver && typeof nextOrObserver.next === 'function') {
                return this.observe(nextOrObserver);
            }
            else {
                return this.do(nextOrObserver, error, complete);
            }
        };
        Notification.prototype.toObservable = function () {
            var kind = this.kind;
            switch (kind) {
                case 'N':
                    return of(this.value);
                case 'E':
                    return throwError(this.error);
                case 'C':
                    return empty$1();
            }
            throw new Error('unexpected notification kind value');
        };
        Notification.createNext = function (value) {
            if (typeof value !== 'undefined') {
                return new Notification('N', value);
            }
            return Notification.undefinedValueNotification;
        };
        Notification.createError = function (err) {
            return new Notification('E', undefined, err);
        };
        Notification.createComplete = function () {
            return Notification.completeNotification;
        };
        Notification.completeNotification = new Notification('C');
        Notification.undefinedValueNotification = new Notification('N', undefined);
        return Notification;
    }());

    /** PURE_IMPORTS_START tslib,_Subscriber,_Notification PURE_IMPORTS_END */
    var ObserveOnSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(ObserveOnSubscriber, _super);
        function ObserveOnSubscriber(destination, scheduler, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            var _this = _super.call(this, destination) || this;
            _this.scheduler = scheduler;
            _this.delay = delay;
            return _this;
        }
        ObserveOnSubscriber.dispatch = function (arg) {
            var notification = arg.notification, destination = arg.destination;
            notification.observe(destination);
            this.unsubscribe();
        };
        ObserveOnSubscriber.prototype.scheduleMessage = function (notification) {
            var destination = this.destination;
            destination.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
        };
        ObserveOnSubscriber.prototype._next = function (value) {
            this.scheduleMessage(Notification.createNext(value));
        };
        ObserveOnSubscriber.prototype._error = function (err) {
            this.scheduleMessage(Notification.createError(err));
            this.unsubscribe();
        };
        ObserveOnSubscriber.prototype._complete = function () {
            this.scheduleMessage(Notification.createComplete());
            this.unsubscribe();
        };
        return ObserveOnSubscriber;
    }(Subscriber));
    var ObserveOnMessage = /*@__PURE__*/ (function () {
        function ObserveOnMessage(notification, destination) {
            this.notification = notification;
            this.destination = destination;
        }
        return ObserveOnMessage;
    }());

    /** PURE_IMPORTS_START tslib,_Subject,_scheduler_queue,_Subscription,_operators_observeOn,_util_ObjectUnsubscribedError,_SubjectSubscription PURE_IMPORTS_END */
    var ReplaySubject = /*@__PURE__*/ (function (_super) {
        __extends(ReplaySubject, _super);
        function ReplaySubject(bufferSize, windowTime, scheduler) {
            if (bufferSize === void 0) {
                bufferSize = Number.POSITIVE_INFINITY;
            }
            if (windowTime === void 0) {
                windowTime = Number.POSITIVE_INFINITY;
            }
            var _this = _super.call(this) || this;
            _this.scheduler = scheduler;
            _this._events = [];
            _this._infiniteTimeWindow = false;
            _this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
            _this._windowTime = windowTime < 1 ? 1 : windowTime;
            if (windowTime === Number.POSITIVE_INFINITY) {
                _this._infiniteTimeWindow = true;
                _this.next = _this.nextInfiniteTimeWindow;
            }
            else {
                _this.next = _this.nextTimeWindow;
            }
            return _this;
        }
        ReplaySubject.prototype.nextInfiniteTimeWindow = function (value) {
            var _events = this._events;
            _events.push(value);
            if (_events.length > this._bufferSize) {
                _events.shift();
            }
            _super.prototype.next.call(this, value);
        };
        ReplaySubject.prototype.nextTimeWindow = function (value) {
            this._events.push(new ReplayEvent(this._getNow(), value));
            this._trimBufferThenGetEvents();
            _super.prototype.next.call(this, value);
        };
        ReplaySubject.prototype._subscribe = function (subscriber) {
            var _infiniteTimeWindow = this._infiniteTimeWindow;
            var _events = _infiniteTimeWindow ? this._events : this._trimBufferThenGetEvents();
            var scheduler = this.scheduler;
            var len = _events.length;
            var subscription;
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            else if (this.isStopped || this.hasError) {
                subscription = Subscription.EMPTY;
            }
            else {
                this.observers.push(subscriber);
                subscription = new SubjectSubscription(this, subscriber);
            }
            if (scheduler) {
                subscriber.add(subscriber = new ObserveOnSubscriber(subscriber, scheduler));
            }
            if (_infiniteTimeWindow) {
                for (var i = 0; i < len && !subscriber.closed; i++) {
                    subscriber.next(_events[i]);
                }
            }
            else {
                for (var i = 0; i < len && !subscriber.closed; i++) {
                    subscriber.next(_events[i].value);
                }
            }
            if (this.hasError) {
                subscriber.error(this.thrownError);
            }
            else if (this.isStopped) {
                subscriber.complete();
            }
            return subscription;
        };
        ReplaySubject.prototype._getNow = function () {
            return (this.scheduler || queue).now();
        };
        ReplaySubject.prototype._trimBufferThenGetEvents = function () {
            var now = this._getNow();
            var _bufferSize = this._bufferSize;
            var _windowTime = this._windowTime;
            var _events = this._events;
            var eventsCount = _events.length;
            var spliceCount = 0;
            while (spliceCount < eventsCount) {
                if ((now - _events[spliceCount].time) < _windowTime) {
                    break;
                }
                spliceCount++;
            }
            if (eventsCount > _bufferSize) {
                spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
            }
            if (spliceCount > 0) {
                _events.splice(0, spliceCount);
            }
            return _events;
        };
        return ReplaySubject;
    }(Subject));
    var ReplayEvent = /*@__PURE__*/ (function () {
        function ReplayEvent(time, value) {
            this.time = time;
            this.value = value;
        }
        return ReplayEvent;
    }());

    /** PURE_IMPORTS_START tslib,_Subject,_Subscription PURE_IMPORTS_END */
    var AsyncSubject = /*@__PURE__*/ (function (_super) {
        __extends(AsyncSubject, _super);
        function AsyncSubject() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.value = null;
            _this.hasNext = false;
            _this.hasCompleted = false;
            return _this;
        }
        AsyncSubject.prototype._subscribe = function (subscriber) {
            if (this.hasError) {
                subscriber.error(this.thrownError);
                return Subscription.EMPTY;
            }
            else if (this.hasCompleted && this.hasNext) {
                subscriber.next(this.value);
                subscriber.complete();
                return Subscription.EMPTY;
            }
            return _super.prototype._subscribe.call(this, subscriber);
        };
        AsyncSubject.prototype.next = function (value) {
            if (!this.hasCompleted) {
                this.value = value;
                this.hasNext = true;
            }
        };
        AsyncSubject.prototype.error = function (error) {
            if (!this.hasCompleted) {
                _super.prototype.error.call(this, error);
            }
        };
        AsyncSubject.prototype.complete = function () {
            this.hasCompleted = true;
            if (this.hasNext) {
                _super.prototype.next.call(this, this.value);
            }
            _super.prototype.complete.call(this);
        };
        return AsyncSubject;
    }(Subject));

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var nextHandle = 1;
    var tasksByHandle = {};
    function runIfPresent(handle) {
        var cb = tasksByHandle[handle];
        if (cb) {
            cb();
        }
    }
    var Immediate = {
        setImmediate: function (cb) {
            var handle = nextHandle++;
            tasksByHandle[handle] = cb;
            Promise.resolve().then(function () { return runIfPresent(handle); });
            return handle;
        },
        clearImmediate: function (handle) {
            delete tasksByHandle[handle];
        },
    };

    /** PURE_IMPORTS_START tslib,_util_Immediate,_AsyncAction PURE_IMPORTS_END */
    var AsapAction = /*@__PURE__*/ (function (_super) {
        __extends(AsapAction, _super);
        function AsapAction(scheduler, work) {
            var _this = _super.call(this, scheduler, work) || this;
            _this.scheduler = scheduler;
            _this.work = work;
            return _this;
        }
        AsapAction.prototype.requestAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if (delay !== null && delay > 0) {
                return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
            }
            scheduler.actions.push(this);
            return scheduler.scheduled || (scheduler.scheduled = Immediate.setImmediate(scheduler.flush.bind(scheduler, null)));
        };
        AsapAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
                return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
            }
            if (scheduler.actions.length === 0) {
                Immediate.clearImmediate(id);
                scheduler.scheduled = undefined;
            }
            return undefined;
        };
        return AsapAction;
    }(AsyncAction));

    /** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
    var AsapScheduler = /*@__PURE__*/ (function (_super) {
        __extends(AsapScheduler, _super);
        function AsapScheduler() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AsapScheduler.prototype.flush = function (action) {
            this.active = true;
            this.scheduled = undefined;
            var actions = this.actions;
            var error;
            var index = -1;
            var count = actions.length;
            action = action || actions.shift();
            do {
                if (error = action.execute(action.state, action.delay)) {
                    break;
                }
            } while (++index < count && (action = actions.shift()));
            this.active = false;
            if (error) {
                while (++index < count && (action = actions.shift())) {
                    action.unsubscribe();
                }
                throw error;
            }
        };
        return AsapScheduler;
    }(AsyncScheduler));

    /** PURE_IMPORTS_START _AsapAction,_AsapScheduler PURE_IMPORTS_END */
    var asap = /*@__PURE__*/ new AsapScheduler(AsapAction);

    /** PURE_IMPORTS_START _AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
    var async = /*@__PURE__*/ new AsyncScheduler(AsyncAction);

    /** PURE_IMPORTS_START tslib,_AsyncAction PURE_IMPORTS_END */
    var AnimationFrameAction = /*@__PURE__*/ (function (_super) {
        __extends(AnimationFrameAction, _super);
        function AnimationFrameAction(scheduler, work) {
            var _this = _super.call(this, scheduler, work) || this;
            _this.scheduler = scheduler;
            _this.work = work;
            return _this;
        }
        AnimationFrameAction.prototype.requestAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if (delay !== null && delay > 0) {
                return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
            }
            scheduler.actions.push(this);
            return scheduler.scheduled || (scheduler.scheduled = requestAnimationFrame(function () { return scheduler.flush(null); }));
        };
        AnimationFrameAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
                return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
            }
            if (scheduler.actions.length === 0) {
                cancelAnimationFrame(id);
                scheduler.scheduled = undefined;
            }
            return undefined;
        };
        return AnimationFrameAction;
    }(AsyncAction));

    /** PURE_IMPORTS_START tslib,_AsyncScheduler PURE_IMPORTS_END */
    var AnimationFrameScheduler = /*@__PURE__*/ (function (_super) {
        __extends(AnimationFrameScheduler, _super);
        function AnimationFrameScheduler() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        AnimationFrameScheduler.prototype.flush = function (action) {
            this.active = true;
            this.scheduled = undefined;
            var actions = this.actions;
            var error;
            var index = -1;
            var count = actions.length;
            action = action || actions.shift();
            do {
                if (error = action.execute(action.state, action.delay)) {
                    break;
                }
            } while (++index < count && (action = actions.shift()));
            this.active = false;
            if (error) {
                while (++index < count && (action = actions.shift())) {
                    action.unsubscribe();
                }
                throw error;
            }
        };
        return AnimationFrameScheduler;
    }(AsyncScheduler));

    /** PURE_IMPORTS_START _AnimationFrameAction,_AnimationFrameScheduler PURE_IMPORTS_END */
    var animationFrame = /*@__PURE__*/ new AnimationFrameScheduler(AnimationFrameAction);

    /** PURE_IMPORTS_START tslib,_AsyncAction,_AsyncScheduler PURE_IMPORTS_END */
    var VirtualTimeScheduler = /*@__PURE__*/ (function (_super) {
        __extends(VirtualTimeScheduler, _super);
        function VirtualTimeScheduler(SchedulerAction, maxFrames) {
            if (SchedulerAction === void 0) {
                SchedulerAction = VirtualAction;
            }
            if (maxFrames === void 0) {
                maxFrames = Number.POSITIVE_INFINITY;
            }
            var _this = _super.call(this, SchedulerAction, function () { return _this.frame; }) || this;
            _this.maxFrames = maxFrames;
            _this.frame = 0;
            _this.index = -1;
            return _this;
        }
        VirtualTimeScheduler.prototype.flush = function () {
            var _a = this, actions = _a.actions, maxFrames = _a.maxFrames;
            var error, action;
            while ((action = actions.shift()) && (this.frame = action.delay) <= maxFrames) {
                if (error = action.execute(action.state, action.delay)) {
                    break;
                }
            }
            if (error) {
                while (action = actions.shift()) {
                    action.unsubscribe();
                }
                throw error;
            }
        };
        VirtualTimeScheduler.frameTimeFactor = 10;
        return VirtualTimeScheduler;
    }(AsyncScheduler));
    var VirtualAction = /*@__PURE__*/ (function (_super) {
        __extends(VirtualAction, _super);
        function VirtualAction(scheduler, work, index) {
            if (index === void 0) {
                index = scheduler.index += 1;
            }
            var _this = _super.call(this, scheduler, work) || this;
            _this.scheduler = scheduler;
            _this.work = work;
            _this.index = index;
            _this.active = true;
            _this.index = scheduler.index = index;
            return _this;
        }
        VirtualAction.prototype.schedule = function (state, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            if (!this.id) {
                return _super.prototype.schedule.call(this, state, delay);
            }
            this.active = false;
            var action = new VirtualAction(this.scheduler, this.work);
            this.add(action);
            return action.schedule(state, delay);
        };
        VirtualAction.prototype.requestAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            this.delay = scheduler.frame + delay;
            var actions = scheduler.actions;
            actions.push(this);
            actions.sort(VirtualAction.sortActions);
            return true;
        };
        VirtualAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
            if (delay === void 0) {
                delay = 0;
            }
            return undefined;
        };
        VirtualAction.prototype._execute = function (state, delay) {
            if (this.active === true) {
                return _super.prototype._execute.call(this, state, delay);
            }
        };
        VirtualAction.sortActions = function (a, b) {
            if (a.delay === b.delay) {
                if (a.index === b.index) {
                    return 0;
                }
                else if (a.index > b.index) {
                    return 1;
                }
                else {
                    return -1;
                }
            }
            else if (a.delay > b.delay) {
                return 1;
            }
            else {
                return -1;
            }
        };
        return VirtualAction;
    }(AsyncAction));

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */

    /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
    var MapSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(MapSubscriber, _super);
        function MapSubscriber(destination, project, thisArg) {
            var _this = _super.call(this, destination) || this;
            _this.project = project;
            _this.count = 0;
            _this.thisArg = thisArg || _this;
            return _this;
        }
        MapSubscriber.prototype._next = function (value) {
            var result;
            try {
                result = this.project.call(this.thisArg, value, this.count++);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.destination.next(result);
        };
        return MapSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START _Observable,_AsyncSubject,_operators_map,_util_canReportError,_util_isArray,_util_isScheduler PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_AsyncSubject,_operators_map,_util_canReportError,_util_isScheduler,_util_isArray PURE_IMPORTS_END */

    /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
    var OuterSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(OuterSubscriber, _super);
        function OuterSubscriber() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        OuterSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.destination.next(innerValue);
        };
        OuterSubscriber.prototype.notifyError = function (error, innerSub) {
            this.destination.error(error);
        };
        OuterSubscriber.prototype.notifyComplete = function (innerSub) {
            this.destination.complete();
        };
        return OuterSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
    var InnerSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(InnerSubscriber, _super);
        function InnerSubscriber(parent, outerValue, outerIndex) {
            var _this = _super.call(this) || this;
            _this.parent = parent;
            _this.outerValue = outerValue;
            _this.outerIndex = outerIndex;
            _this.index = 0;
            return _this;
        }
        InnerSubscriber.prototype._next = function (value) {
            this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
        };
        InnerSubscriber.prototype._error = function (error) {
            this.parent.notifyError(error, this);
            this.unsubscribe();
        };
        InnerSubscriber.prototype._complete = function () {
            this.parent.notifyComplete(this);
            this.unsubscribe();
        };
        return InnerSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START _hostReportError PURE_IMPORTS_END */
    var subscribeToPromise = function (promise) {
        return function (subscriber) {
            promise.then(function (value) {
                if (!subscriber.closed) {
                    subscriber.next(value);
                    subscriber.complete();
                }
            }, function (err) { return subscriber.error(err); })
                .then(null, hostReportError);
            return subscriber;
        };
    };

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function getSymbolIterator() {
        if (typeof Symbol !== 'function' || !Symbol.iterator) {
            return '@@iterator';
        }
        return Symbol.iterator;
    }
    var iterator = /*@__PURE__*/ getSymbolIterator();

    /** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */
    var subscribeToIterable = function (iterable) {
        return function (subscriber) {
            var iterator$$1 = iterable[iterator]();
            do {
                var item = iterator$$1.next();
                if (item.done) {
                    subscriber.complete();
                    break;
                }
                subscriber.next(item.value);
                if (subscriber.closed) {
                    break;
                }
            } while (true);
            if (typeof iterator$$1.return === 'function') {
                subscriber.add(function () {
                    if (iterator$$1.return) {
                        iterator$$1.return();
                    }
                });
            }
            return subscriber;
        };
    };

    /** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */
    var subscribeToObservable = function (obj) {
        return function (subscriber) {
            var obs = obj[observable]();
            if (typeof obs.subscribe !== 'function') {
                throw new TypeError('Provided object does not correctly implement Symbol.observable');
            }
            else {
                return obs.subscribe(subscriber);
            }
        };
    };

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var isArrayLike = (function (x) { return x && typeof x.length === 'number' && typeof x !== 'function'; });

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isPromise(value) {
        return value && typeof value.subscribe !== 'function' && typeof value.then === 'function';
    }

    /** PURE_IMPORTS_START _Observable,_subscribeToArray,_subscribeToPromise,_subscribeToIterable,_subscribeToObservable,_isArrayLike,_isPromise,_isObject,_symbol_iterator,_symbol_observable PURE_IMPORTS_END */
    var subscribeTo = function (result) {
        if (result instanceof Observable) {
            return function (subscriber) {
                if (result._isScalar) {
                    subscriber.next(result.value);
                    subscriber.complete();
                    return undefined;
                }
                else {
                    return result.subscribe(subscriber);
                }
            };
        }
        else if (result && typeof result[observable] === 'function') {
            return subscribeToObservable(result);
        }
        else if (isArrayLike(result)) {
            return subscribeToArray(result);
        }
        else if (isPromise(result)) {
            return subscribeToPromise(result);
        }
        else if (result && typeof result[iterator] === 'function') {
            return subscribeToIterable(result);
        }
        else {
            var value = isObject(result) ? 'an invalid object' : "'" + result + "'";
            var msg = "You provided " + value + " where a stream was expected."
                + ' You can provide an Observable, Promise, Array, or Iterable.';
            throw new TypeError(msg);
        }
    };

    /** PURE_IMPORTS_START _InnerSubscriber,_subscribeTo PURE_IMPORTS_END */
    function subscribeToResult(outerSubscriber, result, outerValue, outerIndex, destination) {
        if (destination === void 0) {
            destination = new InnerSubscriber(outerSubscriber, outerValue, outerIndex);
        }
        if (destination.closed) {
            return;
        }
        return subscribeTo(result)(destination);
    }

    /** PURE_IMPORTS_START tslib,_util_isScheduler,_util_isArray,_OuterSubscriber,_util_subscribeToResult,_fromArray PURE_IMPORTS_END */
    var NONE = {};
    var CombineLatestSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(CombineLatestSubscriber, _super);
        function CombineLatestSubscriber(destination, resultSelector) {
            var _this = _super.call(this, destination) || this;
            _this.resultSelector = resultSelector;
            _this.active = 0;
            _this.values = [];
            _this.observables = [];
            return _this;
        }
        CombineLatestSubscriber.prototype._next = function (observable) {
            this.values.push(NONE);
            this.observables.push(observable);
        };
        CombineLatestSubscriber.prototype._complete = function () {
            var observables = this.observables;
            var len = observables.length;
            if (len === 0) {
                this.destination.complete();
            }
            else {
                this.active = len;
                this.toRespond = len;
                for (var i = 0; i < len; i++) {
                    var observable = observables[i];
                    this.add(subscribeToResult(this, observable, observable, i));
                }
            }
        };
        CombineLatestSubscriber.prototype.notifyComplete = function (unused) {
            if ((this.active -= 1) === 0) {
                this.destination.complete();
            }
        };
        CombineLatestSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            var values = this.values;
            var oldVal = values[outerIndex];
            var toRespond = !this.toRespond
                ? 0
                : oldVal === NONE ? --this.toRespond : this.toRespond;
            values[outerIndex] = innerValue;
            if (toRespond === 0) {
                if (this.resultSelector) {
                    this._tryResultSelector(values);
                }
                else {
                    this.destination.next(values.slice());
                }
            }
        };
        CombineLatestSubscriber.prototype._tryResultSelector = function (values) {
            var result;
            try {
                result = this.resultSelector.apply(this, values);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.destination.next(result);
        };
        return CombineLatestSubscriber;
    }(OuterSubscriber));

    /** PURE_IMPORTS_START _symbol_observable PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _symbol_iterator PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_Subscription,_util_subscribeToPromise PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_Subscription,_symbol_iterator,_util_subscribeToIterable PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_Subscription,_symbol_observable,_util_subscribeToObservable PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_util_isPromise,_util_isArrayLike,_util_isInteropObservable,_util_isIterable,_fromArray,_fromPromise,_fromIterable,_fromObservable,_util_subscribeTo PURE_IMPORTS_END */

    /** PURE_IMPORTS_START tslib,_util_subscribeToResult,_OuterSubscriber,_InnerSubscriber,_map,_observable_from PURE_IMPORTS_END */
    var MergeMapSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(MergeMapSubscriber, _super);
        function MergeMapSubscriber(destination, project, concurrent) {
            if (concurrent === void 0) {
                concurrent = Number.POSITIVE_INFINITY;
            }
            var _this = _super.call(this, destination) || this;
            _this.project = project;
            _this.concurrent = concurrent;
            _this.hasCompleted = false;
            _this.buffer = [];
            _this.active = 0;
            _this.index = 0;
            return _this;
        }
        MergeMapSubscriber.prototype._next = function (value) {
            if (this.active < this.concurrent) {
                this._tryNext(value);
            }
            else {
                this.buffer.push(value);
            }
        };
        MergeMapSubscriber.prototype._tryNext = function (value) {
            var result;
            var index = this.index++;
            try {
                result = this.project(value, index);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.active++;
            this._innerSub(result, value, index);
        };
        MergeMapSubscriber.prototype._innerSub = function (ish, value, index) {
            var innerSubscriber = new InnerSubscriber(this, undefined, undefined);
            var destination = this.destination;
            destination.add(innerSubscriber);
            subscribeToResult(this, ish, value, index, innerSubscriber);
        };
        MergeMapSubscriber.prototype._complete = function () {
            this.hasCompleted = true;
            if (this.active === 0 && this.buffer.length === 0) {
                this.destination.complete();
            }
            this.unsubscribe();
        };
        MergeMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.destination.next(innerValue);
        };
        MergeMapSubscriber.prototype.notifyComplete = function (innerSub) {
            var buffer = this.buffer;
            this.remove(innerSub);
            this.active--;
            if (buffer.length > 0) {
                this._next(buffer.shift());
            }
            else if (this.active === 0 && this.hasCompleted) {
                this.destination.complete();
            }
        };
        return MergeMapSubscriber;
    }(OuterSubscriber));

    /** PURE_IMPORTS_START _mergeMap,_util_identity PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _mergeAll PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _util_isScheduler,_of,_from,_operators_concatAll PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_from,_empty PURE_IMPORTS_END */

    /** PURE_IMPORTS_START tslib,_Observable,_util_isArray,_empty,_util_subscribeToResult,_OuterSubscriber,_operators_map PURE_IMPORTS_END */
    var ForkJoinSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(ForkJoinSubscriber, _super);
        function ForkJoinSubscriber(destination, sources) {
            var _this = _super.call(this, destination) || this;
            _this.sources = sources;
            _this.completed = 0;
            _this.haveValues = 0;
            var len = sources.length;
            _this.values = new Array(len);
            for (var i = 0; i < len; i++) {
                var source = sources[i];
                var innerSubscription = subscribeToResult(_this, source, null, i);
                if (innerSubscription) {
                    _this.add(innerSubscription);
                }
            }
            return _this;
        }
        ForkJoinSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.values[outerIndex] = innerValue;
            if (!innerSub._hasValue) {
                innerSub._hasValue = true;
                this.haveValues++;
            }
        };
        ForkJoinSubscriber.prototype.notifyComplete = function (innerSub) {
            var _a = this, destination = _a.destination, haveValues = _a.haveValues, values = _a.values;
            var len = values.length;
            if (!innerSub._hasValue) {
                destination.complete();
                return;
            }
            this.completed++;
            if (this.completed !== len) {
                return;
            }
            if (haveValues === len) {
                destination.next(values);
            }
            destination.complete();
        };
        return ForkJoinSubscriber;
    }(OuterSubscriber));

    /** PURE_IMPORTS_START _Observable,_util_isArray,_util_isFunction,_operators_map PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_util_isArray,_util_isFunction,_operators_map PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_util_identity,_util_isScheduler PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _defer,_empty PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _isArray PURE_IMPORTS_END */
    function isNumeric(val) {
        return !isArray(val) && (val - parseFloat(val) + 1) >= 0;
    }

    /** PURE_IMPORTS_START _Observable,_scheduler_async,_util_isNumeric PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_util_isScheduler,_operators_mergeAll,_fromArray PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_util_noop PURE_IMPORTS_END */
    var NEVER = /*@__PURE__*/ new Observable(noop);

    /** PURE_IMPORTS_START _Observable,_from,_util_isArray,_empty PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_Subscription PURE_IMPORTS_END */

    /** PURE_IMPORTS_START tslib,_util_isArray,_fromArray,_OuterSubscriber,_util_subscribeToResult PURE_IMPORTS_END */
    var RaceSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(RaceSubscriber, _super);
        function RaceSubscriber(destination) {
            var _this = _super.call(this, destination) || this;
            _this.hasFirst = false;
            _this.observables = [];
            _this.subscriptions = [];
            return _this;
        }
        RaceSubscriber.prototype._next = function (observable) {
            this.observables.push(observable);
        };
        RaceSubscriber.prototype._complete = function () {
            var observables = this.observables;
            var len = observables.length;
            if (len === 0) {
                this.destination.complete();
            }
            else {
                for (var i = 0; i < len && !this.hasFirst; i++) {
                    var observable = observables[i];
                    var subscription = subscribeToResult(this, observable, observable, i);
                    if (this.subscriptions) {
                        this.subscriptions.push(subscription);
                    }
                    this.add(subscription);
                }
                this.observables = null;
            }
        };
        RaceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            if (!this.hasFirst) {
                this.hasFirst = true;
                for (var i = 0; i < this.subscriptions.length; i++) {
                    if (i !== outerIndex) {
                        var subscription = this.subscriptions[i];
                        subscription.unsubscribe();
                        this.remove(subscription);
                    }
                }
                this.subscriptions = null;
            }
            this.destination.next(innerValue);
        };
        return RaceSubscriber;
    }(OuterSubscriber));

    /** PURE_IMPORTS_START _Observable PURE_IMPORTS_END */

    /** PURE_IMPORTS_START _Observable,_scheduler_async,_util_isNumeric,_util_isScheduler PURE_IMPORTS_END */
    function timer(dueTime, periodOrScheduler, scheduler) {
        if (dueTime === void 0) {
            dueTime = 0;
        }
        var period = -1;
        if (isNumeric(periodOrScheduler)) {
            period = Number(periodOrScheduler) < 1 && 1 || Number(periodOrScheduler);
        }
        else if (isScheduler(periodOrScheduler)) {
            scheduler = periodOrScheduler;
        }
        if (!isScheduler(scheduler)) {
            scheduler = async;
        }
        return new Observable(function (subscriber) {
            var due = isNumeric(dueTime)
                ? dueTime
                : (+dueTime - scheduler.now());
            return scheduler.schedule(dispatch$7, due, {
                index: 0, period: period, subscriber: subscriber
            });
        });
    }
    function dispatch$7(state) {
        var index = state.index, period = state.period, subscriber = state.subscriber;
        subscriber.next(index);
        if (subscriber.closed) {
            return;
        }
        else if (period === -1) {
            return subscriber.complete();
        }
        state.index = index + 1;
        this.schedule(state, period);
    }

    /** PURE_IMPORTS_START _Observable,_from,_empty PURE_IMPORTS_END */

    /** PURE_IMPORTS_START tslib,_fromArray,_util_isArray,_Subscriber,_OuterSubscriber,_util_subscribeToResult,_.._internal_symbol_iterator PURE_IMPORTS_END */
    var ZipSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(ZipSubscriber, _super);
        function ZipSubscriber(destination, resultSelector, values) {
            if (values === void 0) {
                values = Object.create(null);
            }
            var _this = _super.call(this, destination) || this;
            _this.iterators = [];
            _this.active = 0;
            _this.resultSelector = (typeof resultSelector === 'function') ? resultSelector : null;
            _this.values = values;
            return _this;
        }
        ZipSubscriber.prototype._next = function (value) {
            var iterators = this.iterators;
            if (isArray(value)) {
                iterators.push(new StaticArrayIterator(value));
            }
            else if (typeof value[iterator] === 'function') {
                iterators.push(new StaticIterator(value[iterator]()));
            }
            else {
                iterators.push(new ZipBufferIterator(this.destination, this, value));
            }
        };
        ZipSubscriber.prototype._complete = function () {
            var iterators = this.iterators;
            var len = iterators.length;
            this.unsubscribe();
            if (len === 0) {
                this.destination.complete();
                return;
            }
            this.active = len;
            for (var i = 0; i < len; i++) {
                var iterator$$1 = iterators[i];
                if (iterator$$1.stillUnsubscribed) {
                    var destination = this.destination;
                    destination.add(iterator$$1.subscribe(iterator$$1, i));
                }
                else {
                    this.active--;
                }
            }
        };
        ZipSubscriber.prototype.notifyInactive = function () {
            this.active--;
            if (this.active === 0) {
                this.destination.complete();
            }
        };
        ZipSubscriber.prototype.checkIterators = function () {
            var iterators = this.iterators;
            var len = iterators.length;
            var destination = this.destination;
            for (var i = 0; i < len; i++) {
                var iterator$$1 = iterators[i];
                if (typeof iterator$$1.hasValue === 'function' && !iterator$$1.hasValue()) {
                    return;
                }
            }
            var shouldComplete = false;
            var args = [];
            for (var i = 0; i < len; i++) {
                var iterator$$1 = iterators[i];
                var result = iterator$$1.next();
                if (iterator$$1.hasCompleted()) {
                    shouldComplete = true;
                }
                if (result.done) {
                    destination.complete();
                    return;
                }
                args.push(result.value);
            }
            if (this.resultSelector) {
                this._tryresultSelector(args);
            }
            else {
                destination.next(args);
            }
            if (shouldComplete) {
                destination.complete();
            }
        };
        ZipSubscriber.prototype._tryresultSelector = function (args) {
            var result;
            try {
                result = this.resultSelector.apply(this, args);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.destination.next(result);
        };
        return ZipSubscriber;
    }(Subscriber));
    var StaticIterator = /*@__PURE__*/ (function () {
        function StaticIterator(iterator$$1) {
            this.iterator = iterator$$1;
            this.nextResult = iterator$$1.next();
        }
        StaticIterator.prototype.hasValue = function () {
            return true;
        };
        StaticIterator.prototype.next = function () {
            var result = this.nextResult;
            this.nextResult = this.iterator.next();
            return result;
        };
        StaticIterator.prototype.hasCompleted = function () {
            var nextResult = this.nextResult;
            return nextResult && nextResult.done;
        };
        return StaticIterator;
    }());
    var StaticArrayIterator = /*@__PURE__*/ (function () {
        function StaticArrayIterator(array) {
            this.array = array;
            this.index = 0;
            this.length = 0;
            this.length = array.length;
        }
        StaticArrayIterator.prototype[iterator] = function () {
            return this;
        };
        StaticArrayIterator.prototype.next = function (value) {
            var i = this.index++;
            var array = this.array;
            return i < this.length ? { value: array[i], done: false } : { value: null, done: true };
        };
        StaticArrayIterator.prototype.hasValue = function () {
            return this.array.length > this.index;
        };
        StaticArrayIterator.prototype.hasCompleted = function () {
            return this.array.length === this.index;
        };
        return StaticArrayIterator;
    }());
    var ZipBufferIterator = /*@__PURE__*/ (function (_super) {
        __extends(ZipBufferIterator, _super);
        function ZipBufferIterator(destination, parent, observable) {
            var _this = _super.call(this, destination) || this;
            _this.parent = parent;
            _this.observable = observable;
            _this.stillUnsubscribed = true;
            _this.buffer = [];
            _this.isComplete = false;
            return _this;
        }
        ZipBufferIterator.prototype[iterator] = function () {
            return this;
        };
        ZipBufferIterator.prototype.next = function () {
            var buffer = this.buffer;
            if (buffer.length === 0 && this.isComplete) {
                return { value: null, done: true };
            }
            else {
                return { value: buffer.shift(), done: false };
            }
        };
        ZipBufferIterator.prototype.hasValue = function () {
            return this.buffer.length > 0;
        };
        ZipBufferIterator.prototype.hasCompleted = function () {
            return this.buffer.length === 0 && this.isComplete;
        };
        ZipBufferIterator.prototype.notifyComplete = function () {
            if (this.buffer.length > 0) {
                this.isComplete = true;
                this.parent.notifyInactive();
            }
            else {
                this.destination.complete();
            }
        };
        ZipBufferIterator.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
            this.buffer.push(innerValue);
            this.parent.checkIterators();
        };
        ZipBufferIterator.prototype.subscribe = function (value, index) {
            return subscribeToResult(this, this.observable, this, index);
        };
        return ZipBufferIterator;
    }(OuterSubscriber));

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */

    /**
     * @license ng2-completer
     * MIT license
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var MAX_CHARS = 524288;
    /** @type {?} */
    var MIN_SEARCH_LENGTH = 3;
    /** @type {?} */
    var PAUSE = 10;
    /** @type {?} */
    var TEXT_SEARCHING = "Searching...";
    /** @type {?} */
    var TEXT_NO_RESULTS = "No results found";
    /** @type {?} */
    var CLEAR_TIMEOUT = 50;
    /**
     * @param {?} value
     * @return {?}
     */
    function isNil(value) {
        return typeof value === "undefined" || value === null;
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /**
     * @abstract
     */
    var   /**
     * @abstract
     */
    CompleterBaseData = /** @class */ (function (_super) {
        __extends(CompleterBaseData, _super);
        function CompleterBaseData() {
            var _this = _super.call(this) || this;
            _this._searchFields = null;
            _this._titleField = null;
            _this._descriptionField = undefined;
            _this._imageField = undefined;
            return _this;
        }
        /**
         * @return {?}
         */
        CompleterBaseData.prototype.cancel = /**
         * @return {?}
         */
        function () {
            return;
        };
        /**
         * @param {?} searchFields
         * @return {?}
         */
        CompleterBaseData.prototype.searchFields = /**
         * @param {?} searchFields
         * @return {?}
         */
        function (searchFields) {
            this._searchFields = searchFields;
            return this;
        };
        /**
         * @param {?} titleField
         * @return {?}
         */
        CompleterBaseData.prototype.titleField = /**
         * @param {?} titleField
         * @return {?}
         */
        function (titleField) {
            this._titleField = titleField;
            return this;
        };
        /**
         * @param {?} descriptionField
         * @return {?}
         */
        CompleterBaseData.prototype.descriptionField = /**
         * @param {?} descriptionField
         * @return {?}
         */
        function (descriptionField) {
            this._descriptionField = descriptionField;
            return this;
        };
        /**
         * @param {?} imageField
         * @return {?}
         */
        CompleterBaseData.prototype.imageField = /**
         * @param {?} imageField
         * @return {?}
         */
        function (imageField) {
            this._imageField = imageField;
            return this;
        };
        /**
         * @param {?} data
         * @return {?}
         */
        CompleterBaseData.prototype.convertToItem = /**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            /** @type {?} */
            var image = null;
            /** @type {?} */
            var formattedText;
            /** @type {?} */
            var formattedDesc = null;
            if (this._titleField) {
                formattedText = this.extractTitle(data);
            }
            else {
                formattedText = data;
            }
            if (typeof formattedText !== "string") {
                formattedText = JSON.stringify(formattedText);
            }
            if (this._descriptionField) {
                formattedDesc = this.extractValue(data, this._descriptionField);
            }
            if (this._imageField) {
                image = this.extractValue(data, this._imageField);
            }
            if (isNil(formattedText)) {
                return null;
            }
            return /** @type {?} */ ({
                description: formattedDesc,
                image: image,
                originalObject: data,
                title: formattedText
            });
        };
        /**
         * @param {?} data
         * @param {?} term
         * @return {?}
         */
        CompleterBaseData.prototype.extractMatches = /**
         * @param {?} data
         * @param {?} term
         * @return {?}
         */
        function (data, term) {
            var _this = this;
            /** @type {?} */
            var matches = [];
            /** @type {?} */
            var searchFields = this._searchFields ? this._searchFields.split(",") : null;
            if (this._searchFields !== null && this._searchFields !== undefined && term !== "") {
                matches = data.filter(function (item) {
                    /** @type {?} */
                    var values = searchFields ? _this.extractBySearchFields(searchFields, item) : [item];
                    return values.some(function (value) { return value
                        .toString()
                        .toLowerCase()
                        .indexOf(term.toString().toLowerCase()) >= 0; });
                });
            }
            else {
                matches = data;
            }
            return matches;
        };
        /**
         * @param {?} item
         * @return {?}
         */
        CompleterBaseData.prototype.extractTitle = /**
         * @param {?} item
         * @return {?}
         */
        function (item) {
            var _this = this;
            // split title fields and run extractValue for each and join with ' '
            if (!this._titleField) {
                return "";
            }
            return this._titleField.split(",")
                .map(function (field) {
                return _this.extractValue(item, field);
            })
                .reduce(function (acc, titlePart) { return acc ? acc + " " + titlePart : titlePart; });
        };
        /**
         * @param {?} obj
         * @param {?} key
         * @return {?}
         */
        CompleterBaseData.prototype.extractValue = /**
         * @param {?} obj
         * @param {?} key
         * @return {?}
         */
        function (obj, key) {
            /** @type {?} */
            var keys;
            /** @type {?} */
            var result;
            if (key) {
                keys = key.split(".");
                result = obj;
                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                    key = keys_1[_i];
                    if (result) {
                        result = result[key];
                    }
                }
            }
            else {
                result = obj;
            }
            return result;
        };
        /**
         * @param {?} matches
         * @return {?}
         */
        CompleterBaseData.prototype.processResults = /**
         * @param {?} matches
         * @return {?}
         */
        function (matches) {
            /** @type {?} */
            var i;
            /** @type {?} */
            var results = [];
            if (matches && matches.length > 0) {
                for (i = 0; i < matches.length; i++) {
                    /** @type {?} */
                    var item = this.convertToItem(matches[i]);
                    if (item) {
                        results.push(item);
                    }
                }
            }
            return results;
        };
        /**
         * @param {?} searchFields
         * @param {?} item
         * @return {?}
         */
        CompleterBaseData.prototype.extractBySearchFields = /**
         * @param {?} searchFields
         * @param {?} item
         * @return {?}
         */
        function (searchFields, item) {
            var _this = this;
            return searchFields
                .map(function (searchField) { return _this.extractValue(item, searchField); }).filter(function (value) { return !!value; });
        };
        return CompleterBaseData;
    }(Subject));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var LocalData = /** @class */ (function (_super) {
        __extends(LocalData, _super);
        function LocalData() {
            var _this = _super.call(this) || this;
            _this.dataSourceChange = new core.EventEmitter();
            _this._data = [];
            _this.savedTerm = null;
            return _this;
        }
        /**
         * @param {?} data
         * @return {?}
         */
        LocalData.prototype.data = /**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            var _this = this;
            if (data instanceof Observable) {
                /** @type {?} */
                var data$ = /** @type {?} */ (data);
                data$
                    .pipe(operators.catchError(function () { return []; }))
                    .subscribe(function (res) {
                    _this._data = res;
                    if (_this.savedTerm) {
                        _this.search(_this.savedTerm);
                    }
                    _this.dataSourceChange.emit();
                });
            }
            else {
                this._data = data;
            }
            this.dataSourceChange.emit();
            return this;
        };
        /**
         * @param {?} term
         * @return {?}
         */
        LocalData.prototype.search = /**
         * @param {?} term
         * @return {?}
         */
        function (term) {
            if (!this._data) {
                this.savedTerm = term;
            }
            else {
                this.savedTerm = null;
                /** @type {?} */
                var matches = this.extractMatches(this._data, term);
                this.next(this.processResults(matches));
            }
        };
        /**
         * @param {?} data
         * @return {?}
         */
        LocalData.prototype.convertToItem = /**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            return _super.prototype.convertToItem.call(this, data);
        };
        return LocalData;
    }(CompleterBaseData));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var RemoteData = /** @class */ (function (_super) {
        __extends(RemoteData, _super);
        function RemoteData(http$$1) {
            var _this = _super.call(this) || this;
            _this.http = http$$1;
            _this.dataSourceChange = new core.EventEmitter();
            _this._remoteUrl = null;
            _this.remoteSearch = null;
            _this._urlFormater = null;
            _this._dataField = null;
            return _this;
        }
        /**
         * @param {?} remoteUrl
         * @return {?}
         */
        RemoteData.prototype.remoteUrl = /**
         * @param {?} remoteUrl
         * @return {?}
         */
        function (remoteUrl) {
            this._remoteUrl = remoteUrl;
            this.dataSourceChange.emit();
            return this;
        };
        /**
         * @param {?} urlFormater
         * @return {?}
         */
        RemoteData.prototype.urlFormater = /**
         * @param {?} urlFormater
         * @return {?}
         */
        function (urlFormater) {
            this._urlFormater = urlFormater;
        };
        /**
         * @param {?} dataField
         * @return {?}
         */
        RemoteData.prototype.dataField = /**
         * @param {?} dataField
         * @return {?}
         */
        function (dataField) {
            this._dataField = dataField;
        };
        /**
         * @param {?} requestOptions
         * @return {?}
         */
        RemoteData.prototype.requestOptions = /**
         * @param {?} requestOptions
         * @return {?}
         */
        function (requestOptions) {
            this._requestOptions = requestOptions;
        };
        /**
         * @param {?} term
         * @return {?}
         */
        RemoteData.prototype.search = /**
         * @param {?} term
         * @return {?}
         */
        function (term) {
            var _this = this;
            this.cancel();
            /** @type {?} */
            var url = "";
            if (this._urlFormater) {
                url = this._urlFormater(term);
            }
            else {
                url = this._remoteUrl + encodeURIComponent(term);
            }
            this.remoteSearch = this.http
                .get(url, Object.assign({}, this._requestOptions))
                .pipe(operators.map(function (data) {
                /** @type {?} */
                var matches = _this.extractValue(data, _this._dataField);
                return _this.extractMatches(matches, term);
            }), operators.catchError(function () { return []; }))
                .subscribe(function (matches) {
                /** @type {?} */
                var results = _this.processResults(matches);
                _this.next(results);
            });
        };
        /**
         * @return {?}
         */
        RemoteData.prototype.cancel = /**
         * @return {?}
         */
        function () {
            if (this.remoteSearch) {
                this.remoteSearch.unsubscribe();
            }
        };
        /**
         * @param {?} data
         * @return {?}
         */
        RemoteData.prototype.convertToItem = /**
         * @param {?} data
         * @return {?}
         */
        function (data) {
            return _super.prototype.convertToItem.call(this, data);
        };
        return RemoteData;
    }(CompleterBaseData));

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var LocalDataFactory = /** @class */ (function () {
        function LocalDataFactory() {
        }
        /**
         * @return {?}
         */
        LocalDataFactory.prototype.create = /**
         * @return {?}
         */
        function () {
            return new LocalData();
        };
        LocalDataFactory.decorators = [
            { type: core.Injectable },
        ];
        return LocalDataFactory;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var RemoteDataFactory = /** @class */ (function () {
        function RemoteDataFactory(http$$1) {
            this.http = http$$1;
        }
        /**
         * @return {?}
         */
        RemoteDataFactory.prototype.create = /**
         * @return {?}
         */
        function () {
            return new RemoteData(this.http);
        };
        RemoteDataFactory.decorators = [
            { type: core.Injectable },
        ];
        /** @nocollapse */
        RemoteDataFactory.ctorParameters = function () { return [
            { type: http.HttpClient }
        ]; };
        return RemoteDataFactory;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CompleterService = /** @class */ (function () {
        function CompleterService(localDataFactory, remoteDataFactory // Using any instead of () => LocalData because of AoT errors
        ) {
            this.localDataFactory = localDataFactory;
            this.remoteDataFactory = remoteDataFactory;
        }
        /**
         * @param {?} data
         * @param {?=} searchFields
         * @param {?=} titleField
         * @return {?}
         */
        CompleterService.prototype.local = /**
         * @param {?} data
         * @param {?=} searchFields
         * @param {?=} titleField
         * @return {?}
         */
        function (data, searchFields, titleField) {
            if (searchFields === void 0) { searchFields = ""; }
            if (titleField === void 0) { titleField = ""; }
            /** @type {?} */
            var localData = this.localDataFactory.create();
            return localData
                .data(data)
                .searchFields(searchFields)
                .titleField(titleField);
        };
        /**
         * @param {?} url
         * @param {?=} searchFields
         * @param {?=} titleField
         * @return {?}
         */
        CompleterService.prototype.remote = /**
         * @param {?} url
         * @param {?=} searchFields
         * @param {?=} titleField
         * @return {?}
         */
        function (url, searchFields, titleField) {
            if (searchFields === void 0) { searchFields = ""; }
            if (titleField === void 0) { titleField = ""; }
            /** @type {?} */
            var remoteData = this.remoteDataFactory.create();
            return remoteData
                .remoteUrl(url)
                .searchFields(searchFields)
                .titleField(titleField);
        };
        CompleterService.decorators = [
            { type: core.Injectable },
        ];
        /** @nocollapse */
        CompleterService.ctorParameters = function () { return [
            { type: LocalDataFactory },
            { type: RemoteDataFactory }
        ]; };
        return CompleterService;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CtrCompleter = /** @class */ (function () {
        function CtrCompleter() {
            this.selected = new core.EventEmitter();
            this.highlighted = new core.EventEmitter();
            this.opened = new core.EventEmitter();
            this.dataSourceChange = new core.EventEmitter();
            this.list = null;
            this.dropdown = null;
            this._hasHighlighted = false;
            this._hasSelected = false;
            this._cancelBlur = false;
            this._isOpen = false;
            this._autoHighlightIndex = null;
        }
        /**
         * @param {?} list
         * @return {?}
         */
        CtrCompleter.prototype.registerList = /**
         * @param {?} list
         * @return {?}
         */
        function (list) {
            this.list = list;
        };
        /**
         * @param {?} dropdown
         * @return {?}
         */
        CtrCompleter.prototype.registerDropdown = /**
         * @param {?} dropdown
         * @return {?}
         */
        function (dropdown) {
            this.dropdown = dropdown;
        };
        /**
         * @param {?} item
         * @return {?}
         */
        CtrCompleter.prototype.onHighlighted = /**
         * @param {?} item
         * @return {?}
         */
        function (item) {
            this.highlighted.emit(item);
            this._hasHighlighted = !!item;
        };
        /**
         * @param {?} item
         * @param {?=} clearList
         * @return {?}
         */
        CtrCompleter.prototype.onSelected = /**
         * @param {?} item
         * @param {?=} clearList
         * @return {?}
         */
        function (item, clearList) {
            if (clearList === void 0) { clearList = true; }
            this.selected.emit(item);
            if (item) {
                this._hasSelected = true;
            }
            if (clearList) {
                this.clear();
            }
        };
        /**
         * @return {?}
         */
        CtrCompleter.prototype.onDataSourceChange = /**
         * @return {?}
         */
        function () {
            if (this.hasSelected) {
                this.selected.emit(null);
                this._hasSelected = false;
            }
            this.dataSourceChange.emit();
        };
        /**
         * @param {?} term
         * @return {?}
         */
        CtrCompleter.prototype.search = /**
         * @param {?} term
         * @return {?}
         */
        function (term) {
            if (this._hasSelected) {
                this.selected.emit(null);
                this._hasSelected = false;
            }
            if (this.list) {
                this.list.search(term);
            }
        };
        /**
         * @return {?}
         */
        CtrCompleter.prototype.clear = /**
         * @return {?}
         */
        function () {
            this._hasHighlighted = false;
            this.isOpen = false;
            if (this.dropdown) {
                this.dropdown.clear();
            }
            if (this.list) {
                this.list.clear();
            }
        };
        /**
         * @return {?}
         */
        CtrCompleter.prototype.selectCurrent = /**
         * @return {?}
         */
        function () {
            if (this.dropdown) {
                this.dropdown.selectCurrent();
            }
        };
        /**
         * @return {?}
         */
        CtrCompleter.prototype.nextRow = /**
         * @return {?}
         */
        function () {
            if (this.dropdown) {
                this.dropdown.nextRow();
            }
        };
        /**
         * @return {?}
         */
        CtrCompleter.prototype.prevRow = /**
         * @return {?}
         */
        function () {
            if (this.dropdown) {
                this.dropdown.prevRow();
            }
        };
        /**
         * @return {?}
         */
        CtrCompleter.prototype.hasHighlighted = /**
         * @return {?}
         */
        function () {
            return this._hasHighlighted;
        };
        /**
         * @param {?} cancel
         * @return {?}
         */
        CtrCompleter.prototype.cancelBlur = /**
         * @param {?} cancel
         * @return {?}
         */
        function (cancel) {
            this._cancelBlur = cancel;
        };
        /**
         * @return {?}
         */
        CtrCompleter.prototype.isCancelBlur = /**
         * @return {?}
         */
        function () {
            return this._cancelBlur;
        };
        /**
         * @return {?}
         */
        CtrCompleter.prototype.open = /**
         * @return {?}
         */
        function () {
            if (!this._isOpen && !!this.list) {
                this.isOpen = true;
                this.list.open();
            }
        };
        Object.defineProperty(CtrCompleter.prototype, "isOpen", {
            get: /**
             * @return {?}
             */
            function () {
                return this._isOpen;
            },
            set: /**
             * @param {?} open
             * @return {?}
             */
            function (open) {
                this._isOpen = open;
                this.opened.emit(this._isOpen);
                if (this.list) {
                    this.list.isOpen(open);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CtrCompleter.prototype, "autoHighlightIndex", {
            get: /**
             * @return {?}
             */
            function () {
                return this._autoHighlightIndex;
            },
            set: /**
             * @param {?} index
             * @return {?}
             */
            function (index) {
                this._autoHighlightIndex = index;
                if (this.dropdown) {
                    this.dropdown.highlightRow(this._autoHighlightIndex);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CtrCompleter.prototype, "hasSelected", {
            get: /**
             * @return {?}
             */
            function () {
                return this._hasSelected;
            },
            enumerable: true,
            configurable: true
        });
        CtrCompleter.decorators = [
            { type: core.Directive, args: [{
                        selector: "[ctrCompleter]",
                    },] },
        ];
        CtrCompleter.propDecorators = {
            selected: [{ type: core.Output }],
            highlighted: [{ type: core.Output }],
            opened: [{ type: core.Output }],
            dataSourceChange: [{ type: core.Output }]
        };
        return CtrCompleter;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CtrRowItem = /** @class */ (function () {
        function CtrRowItem(row, index) {
            this.row = row;
            this.index = index;
        }
        return CtrRowItem;
    }());
    var CtrDropdown = /** @class */ (function () {
        function CtrDropdown(completer, el, zone) {
            this.completer = completer;
            this.el = el;
            this.zone = zone;
            this.rows = [];
            this.isScrollOn = false;
            this._rowMouseDown = false;
            this.completer.registerDropdown(this);
        }
        /**
         * @return {?}
         */
        CtrDropdown.prototype.ngOnDestroy = /**
         * @return {?}
         */
        function () {
            this.completer.registerDropdown(null);
        };
        /**
         * @return {?}
         */
        CtrDropdown.prototype.ngAfterViewInit = /**
         * @return {?}
         */
        function () {
            var _this = this;
            /** @type {?} */
            var css = getComputedStyle(this.el.nativeElement);
            /** @type {?} */
            var autoHighlightIndex = this.completer.autoHighlightIndex;
            this.isScrollOn = !!css.maxHeight && css.overflowY === "auto";
            if (autoHighlightIndex) {
                this.zone.run(function () {
                    _this.highlightRow(autoHighlightIndex);
                });
            }
        };
        /**
         * @param {?} event
         * @return {?}
         */
        CtrDropdown.prototype.onMouseDown = /**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            var _this = this;
            // Support for canceling blur on IE (issue #158)
            if (!this._rowMouseDown) {
                this.completer.cancelBlur(true);
                this.zone.run(function () {
                    _this.completer.cancelBlur(false);
                });
            }
            else {
                this._rowMouseDown = false;
            }
        };
        /**
         * @param {?} row
         * @return {?}
         */
        CtrDropdown.prototype.registerRow = /**
         * @param {?} row
         * @return {?}
         */
        function (row) {
            /** @type {?} */
            var arrIndex = this.rows.findIndex(function (_row) { return _row.index === row.index; });
            if (arrIndex >= 0) {
                this.rows[arrIndex] = row;
            }
            else {
                this.rows.push(row);
            }
        };
        /**
         * @param {?} rowIndex
         * @return {?}
         */
        CtrDropdown.prototype.unregisterRow = /**
         * @param {?} rowIndex
         * @return {?}
         */
        function (rowIndex) {
            /** @type {?} */
            var arrIndex = this.rows.findIndex(function (_row) { return _row.index === rowIndex; });
            this.rows.splice(arrIndex, 1);
            if (this.currHighlighted && rowIndex === this.currHighlighted.index) {
                this.highlightRow(null);
            }
        };
        /**
         * @param {?} index
         * @return {?}
         */
        CtrDropdown.prototype.highlightRow = /**
         * @param {?} index
         * @return {?}
         */
        function (index) {
            /** @type {?} */
            var highlighted = this.rows.find(function (row) { return row.index === index; });
            if (isNil(index) || /** @type {?} */ ((index)) < 0) {
                if (this.currHighlighted) {
                    this.currHighlighted.row.setHighlighted(false);
                }
                this.currHighlighted = undefined;
                this.completer.onHighlighted(null);
                return;
            }
            if (!highlighted) {
                return;
            }
            if (this.currHighlighted) {
                this.currHighlighted.row.setHighlighted(false);
            }
            this.currHighlighted = highlighted;
            this.currHighlighted.row.setHighlighted(true);
            this.completer.onHighlighted(this.currHighlighted.row.getDataItem());
            if (this.isScrollOn && this.currHighlighted) {
                /** @type {?} */
                var rowTop = this.dropdownRowTop();
                if (!rowTop) {
                    return;
                }
                if (rowTop < 0) {
                    this.dropdownScrollTopTo(rowTop - 1);
                }
                else {
                    /** @type {?} */
                    var row = this.currHighlighted.row.getNativeElement();
                    if (this.dropdownHeight() < row.getBoundingClientRect().bottom) {
                        this.dropdownScrollTopTo(this.dropdownRowOffsetHeight(row));
                        if (this.el.nativeElement.getBoundingClientRect().bottom - this.dropdownRowOffsetHeight(row) < row.getBoundingClientRect().top) {
                            this.dropdownScrollTopTo(row.getBoundingClientRect().top - (this.el.nativeElement.getBoundingClientRect().top + parseInt(/** @type {?} */ (getComputedStyle(this.el.nativeElement).paddingTop), 10)));
                        }
                    }
                }
            }
        };
        /**
         * @return {?}
         */
        CtrDropdown.prototype.clear = /**
         * @return {?}
         */
        function () {
            this.rows = [];
        };
        /**
         * @param {?} item
         * @return {?}
         */
        CtrDropdown.prototype.onSelected = /**
         * @param {?} item
         * @return {?}
         */
        function (item) {
            this.completer.onSelected(item);
        };
        /**
         * @return {?}
         */
        CtrDropdown.prototype.rowMouseDown = /**
         * @return {?}
         */
        function () {
            this._rowMouseDown = true;
        };
        /**
         * @return {?}
         */
        CtrDropdown.prototype.selectCurrent = /**
         * @return {?}
         */
        function () {
            if (!!this.currHighlighted && !!this.currHighlighted.row) {
                this.onSelected(this.currHighlighted.row.getDataItem());
            }
            else if (this.rows.length > 0) {
                this.onSelected(this.rows[0].row.getDataItem());
            }
        };
        /**
         * @return {?}
         */
        CtrDropdown.prototype.nextRow = /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var nextRowIndex = 0;
            if (this.currHighlighted) {
                nextRowIndex = this.currHighlighted.index + 1;
            }
            this.highlightRow(nextRowIndex);
        };
        /**
         * @return {?}
         */
        CtrDropdown.prototype.prevRow = /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var nextRowIndex = -1;
            if (this.currHighlighted) {
                nextRowIndex = this.currHighlighted.index - 1;
            }
            this.highlightRow(nextRowIndex);
        };
        /**
         * @param {?} offset
         * @return {?}
         */
        CtrDropdown.prototype.dropdownScrollTopTo = /**
         * @param {?} offset
         * @return {?}
         */
        function (offset) {
            this.el.nativeElement.scrollTop = this.el.nativeElement.scrollTop + offset;
        };
        /**
         * @return {?}
         */
        CtrDropdown.prototype.dropdownRowTop = /**
         * @return {?}
         */
        function () {
            if (!this.currHighlighted) {
                return;
            }
            return this.currHighlighted.row.getNativeElement().getBoundingClientRect().top -
                (this.el.nativeElement.getBoundingClientRect().top +
                    parseInt(/** @type {?} */ (getComputedStyle(this.el.nativeElement).paddingTop), 10));
        };
        /**
         * @return {?}
         */
        CtrDropdown.prototype.dropdownHeight = /**
         * @return {?}
         */
        function () {
            return this.el.nativeElement.getBoundingClientRect().top +
                parseInt(/** @type {?} */ (getComputedStyle(this.el.nativeElement).maxHeight), 10);
        };
        /**
         * @param {?} row
         * @return {?}
         */
        CtrDropdown.prototype.dropdownRowOffsetHeight = /**
         * @param {?} row
         * @return {?}
         */
        function (row) {
            /** @type {?} */
            var css = getComputedStyle(row.parentElement);
            return row.parentElement.offsetHeight +
                parseInt(/** @type {?} */ (css.marginTop), 10) + parseInt(/** @type {?} */ (css.marginBottom), 10);
        };
        CtrDropdown.decorators = [
            { type: core.Directive, args: [{
                        selector: "[ctrDropdown]",
                    },] },
        ];
        /** @nocollapse */
        CtrDropdown.ctorParameters = function () { return [
            { type: CtrCompleter, decorators: [{ type: core.Host }] },
            { type: core.ElementRef },
            { type: core.NgZone }
        ]; };
        CtrDropdown.propDecorators = {
            onMouseDown: [{ type: core.HostListener, args: ["mousedown", ["$event"],] }]
        };
        return CtrDropdown;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var KEY_DW = 40;
    /** @type {?} */
    var KEY_RT = 39;
    /** @type {?} */
    var KEY_UP = 38;
    /** @type {?} */
    var KEY_LF = 37;
    /** @type {?} */
    var KEY_ES = 27;
    /** @type {?} */
    var KEY_EN = 13;
    /** @type {?} */
    var KEY_TAB = 9;
    /** @type {?} */
    var KEY_BK = 8;
    /** @type {?} */
    var KEY_SH = 16;
    /** @type {?} */
    var KEY_CL = 20;
    /** @type {?} */
    var KEY_F1 = 112;
    /** @type {?} */
    var KEY_F12 = 123;
    var CtrInput = /** @class */ (function () {
        function CtrInput(completer, ngModel, el) {
            var _this = this;
            this.completer = completer;
            this.ngModel = ngModel;
            this.el = el;
            this.clearSelected = false;
            this.clearUnselected = false;
            this.overrideSuggested = false;
            this.fillHighlighted = true;
            this.openOnFocus = false;
            this.openOnClick = false;
            this.selectOnClick = false;
            this.selectOnFocus = false;
            this.ngModelChange = new core.EventEmitter();
            this._searchStr = "";
            this._displayStr = "";
            this.blurTimer = null;
            this.completer.selected.subscribe(function (item) {
                if (!item) {
                    return;
                }
                if (_this.clearSelected) {
                    _this.searchStr = "";
                }
                else {
                    _this.searchStr = item.title;
                }
                _this.ngModelChange.emit(_this.searchStr);
            });
            this.completer.highlighted.subscribe(function (item) {
                if (_this.fillHighlighted) {
                    if (item) {
                        _this._displayStr = item.title;
                        _this.ngModelChange.emit(item.title);
                    }
                    else {
                        _this._displayStr = _this.searchStr;
                        _this.ngModelChange.emit(_this.searchStr);
                    }
                }
            });
            this.completer.dataSourceChange.subscribe(function () {
                _this.completer.search(_this.searchStr);
            });
            if (this.ngModel.valueChanges) {
                this.ngModel.valueChanges.subscribe(function (value) {
                    if (!isNil(value) && _this._displayStr !== value) {
                        if (_this.searchStr !== value) {
                            _this.completer.search(value);
                        }
                        _this.searchStr = value;
                    }
                });
            }
        }
        /**
         * @param {?} event
         * @return {?}
         */
        CtrInput.prototype.keyupHandler = /**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            if (event.keyCode === KEY_LF || event.keyCode === KEY_RT || event.keyCode === KEY_TAB) {
                // do nothing
                return;
            }
            if (event.keyCode === KEY_UP || event.keyCode === KEY_EN) {
                event.preventDefault();
            }
            else if (event.keyCode === KEY_DW) {
                event.preventDefault();
                this.completer.search(this.searchStr);
            }
            else if (event.keyCode === KEY_ES) {
                if (this.completer.isOpen) {
                    this.restoreSearchValue();
                    this.completer.clear();
                    event.stopPropagation();
                    event.preventDefault();
                }
            }
        };
        /**
         * @param {?} event
         * @return {?}
         */
        CtrInput.prototype.pasteHandler = /**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            this.completer.open();
        };
        /**
         * @param {?} event
         * @return {?}
         */
        CtrInput.prototype.keydownHandler = /**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            /** @type {?} */
            var keyCode = event.keyCode || event.which;
            if (keyCode === KEY_EN) {
                if (this.completer.hasHighlighted()) {
                    event.preventDefault();
                }
                this.handleSelection();
            }
            else if (keyCode === KEY_DW) {
                event.preventDefault();
                this.completer.open();
                this.completer.nextRow();
            }
            else if (keyCode === KEY_UP) {
                event.preventDefault();
                this.completer.prevRow();
            }
            else if (keyCode === KEY_TAB) {
                this.handleSelection();
            }
            else if (keyCode === KEY_BK) {
                this.completer.open();
            }
            else if (keyCode === KEY_ES) {
                // This is very specific to IE10/11 #272
                // without this, IE clears the input text
                event.preventDefault();
                if (this.completer.isOpen) {
                    event.stopPropagation();
                }
            }
            else {
                if (keyCode !== 0 && keyCode !== KEY_SH && keyCode !== KEY_CL &&
                    (keyCode <= KEY_F1 || keyCode >= KEY_F12) &&
                    !event.ctrlKey && !event.metaKey && !event.altKey) {
                    this.completer.open();
                }
            }
        };
        /**
         * @param {?} event
         * @return {?}
         */
        CtrInput.prototype.onBlur = /**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            var _this = this;
            // Check if we need to cancel Blur for IE
            if (this.completer.isCancelBlur()) {
                setTimeout(function () {
                    // get the focus back
                    // get the focus back
                    _this.el.nativeElement.focus();
                }, 0);
                return;
            }
            if (this.completer.isOpen) {
                this.blurTimer = timer(200).pipe(operators.take(1)).subscribe(function () { return _this.doBlur(); });
            }
        };
        /**
         * @return {?}
         */
        CtrInput.prototype.onfocus = /**
         * @return {?}
         */
        function () {
            if (this.blurTimer) {
                this.blurTimer.unsubscribe();
                this.blurTimer = null;
            }
            if (this.selectOnFocus) {
                this.el.nativeElement.select();
            }
            if (this.openOnFocus) {
                this.completer.open();
            }
        };
        /**
         * @param {?} event
         * @return {?}
         */
        CtrInput.prototype.onClick = /**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            if (this.selectOnClick) {
                this.el.nativeElement.select();
            }
            if (this.openOnClick) {
                if (this.completer.isOpen) {
                    this.completer.clear();
                }
                else {
                    this.completer.open();
                }
            }
        };
        Object.defineProperty(CtrInput.prototype, "searchStr", {
            get: /**
             * @return {?}
             */
            function () {
                return this._searchStr;
            },
            set: /**
             * @param {?} term
             * @return {?}
             */
            function (term) {
                this._searchStr = term;
                this._displayStr = term;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        CtrInput.prototype.handleSelection = /**
         * @return {?}
         */
        function () {
            if (this.completer.hasHighlighted()) {
                this._searchStr = "";
                this.completer.selectCurrent();
            }
            else if (this.overrideSuggested) {
                this.completer.onSelected({ title: this.searchStr, originalObject: null });
            }
            else {
                if (this.clearUnselected && !this.completer.hasSelected) {
                    this.searchStr = "";
                    this.ngModelChange.emit(this.searchStr);
                }
                this.completer.clear();
            }
        };
        /**
         * @return {?}
         */
        CtrInput.prototype.restoreSearchValue = /**
         * @return {?}
         */
        function () {
            if (this.fillHighlighted) {
                if (this._displayStr != this.searchStr) {
                    this._displayStr = this.searchStr;
                    this.ngModelChange.emit(this.searchStr);
                }
            }
        };
        /**
         * @return {?}
         */
        CtrInput.prototype.doBlur = /**
         * @return {?}
         */
        function () {
            if (this.blurTimer) {
                this.blurTimer.unsubscribe();
                this.blurTimer = null;
            }
            if (this.overrideSuggested) {
                this.completer.onSelected({ title: this.searchStr, originalObject: null });
            }
            else {
                if (this.clearUnselected && !this.completer.hasSelected) {
                    this.searchStr = "";
                    this.ngModelChange.emit(this.searchStr);
                }
                else {
                    this.restoreSearchValue();
                }
            }
            this.completer.clear();
        };
        CtrInput.decorators = [
            { type: core.Directive, args: [{
                        selector: "[ctrInput]",
                    },] },
        ];
        /** @nocollapse */
        CtrInput.ctorParameters = function () { return [
            { type: CtrCompleter, decorators: [{ type: core.Host }] },
            { type: forms.NgModel },
            { type: core.ElementRef }
        ]; };
        CtrInput.propDecorators = {
            clearSelected: [{ type: core.Input, args: ["clearSelected",] }],
            clearUnselected: [{ type: core.Input, args: ["clearUnselected",] }],
            overrideSuggested: [{ type: core.Input, args: ["overrideSuggested",] }],
            fillHighlighted: [{ type: core.Input, args: ["fillHighlighted",] }],
            openOnFocus: [{ type: core.Input, args: ["openOnFocus",] }],
            openOnClick: [{ type: core.Input, args: ["openOnClick",] }],
            selectOnClick: [{ type: core.Input, args: ["selectOnClick",] }],
            selectOnFocus: [{ type: core.Input, args: ["selectOnFocus",] }],
            ngModelChange: [{ type: core.Output }],
            keyupHandler: [{ type: core.HostListener, args: ["keyup", ["$event"],] }],
            pasteHandler: [{ type: core.HostListener, args: ["paste", ["$event"],] }],
            keydownHandler: [{ type: core.HostListener, args: ["keydown", ["$event"],] }],
            onBlur: [{ type: core.HostListener, args: ["blur", ["$event"],] }],
            onfocus: [{ type: core.HostListener, args: ["focus", [],] }],
            onClick: [{ type: core.HostListener, args: ["click", ["$event"],] }]
        };
        return CtrInput;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CtrListContext = /** @class */ (function () {
        function CtrListContext(results, searching, searchInitialized, isOpen) {
            this.results = results;
            this.searching = searching;
            this.searchInitialized = searchInitialized;
            this.isOpen = isOpen;
        }
        return CtrListContext;
    }());
    var CtrList = /** @class */ (function () {
        function CtrList(completer, templateRef, viewContainer, cd, zone) {
            this.completer = completer;
            this.templateRef = templateRef;
            this.viewContainer = viewContainer;
            this.cd = cd;
            this.zone = zone;
            this.ctrListMinSearchLength = MIN_SEARCH_LENGTH;
            this.ctrListPause = PAUSE;
            this.ctrListAutoMatch = false;
            this.ctrListAutoHighlight = false;
            this.ctrListDisplaySearching = true;
            this._dataService = null;
            this.term = null;
            this.searchTimer = null;
            this.clearTimer = null;
            this.ctx = new CtrListContext([], false, false, false);
            this._initialValue = null;
            this.viewRef = null;
        }
        /**
         * @return {?}
         */
        CtrList.prototype.ngOnInit = /**
         * @return {?}
         */
        function () {
            this.completer.registerList(this);
            this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef, new CtrListContext([], false, false, false));
        };
        Object.defineProperty(CtrList.prototype, "dataService", {
            set: /**
             * @param {?} newService
             * @return {?}
             */
            function (newService) {
                this._dataService = newService;
                this.dataServiceSubscribe();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CtrList.prototype, "initialValue", {
            set: /**
             * @param {?} value
             * @return {?}
             */
            function (value) {
                var _this = this;
                if (this._dataService && typeof this._dataService.convertToItem === "function") {
                    this.zone.run(function () {
                        /** @type {?} */
                        var initialItem = _this._dataService && /** @type {?} */ ((_this._dataService.convertToItem))(value);
                        if (initialItem) {
                            _this.completer.onSelected(initialItem, false);
                        }
                    });
                }
                else if (!this._dataService) {
                    this._initialValue = value;
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {?} term
         * @return {?}
         */
        CtrList.prototype.search = /**
         * @param {?} term
         * @return {?}
         */
        function (term) {
            var _this = this;
            if (!isNil(term) && term.length >= this.ctrListMinSearchLength && this.term !== term) {
                if (this.searchTimer) {
                    this.searchTimer.unsubscribe();
                    this.searchTimer = null;
                }
                if (!this.ctx.searching) {
                    if (this.ctrListDisplaySearching) {
                        this.ctx.results = [];
                    }
                    this.ctx.searching = true;
                    this.ctx.searchInitialized = true;
                    this.refreshTemplate();
                }
                if (this.clearTimer) {
                    this.clearTimer.unsubscribe();
                }
                this.searchTimer = timer(this.ctrListPause).pipe(operators.take(1)).subscribe(function () {
                    _this.searchTimerComplete(term);
                });
            }
            else if (!isNil(term) && term.length < this.ctrListMinSearchLength) {
                this.clear();
                this.term = "";
            }
        };
        /**
         * @return {?}
         */
        CtrList.prototype.clear = /**
         * @return {?}
         */
        function () {
            var _this = this;
            if (this.searchTimer) {
                this.searchTimer.unsubscribe();
            }
            this.clearTimer = timer(CLEAR_TIMEOUT).pipe(operators.take(1)).subscribe(function () {
                _this._clear();
            });
        };
        /**
         * @return {?}
         */
        CtrList.prototype.open = /**
         * @return {?}
         */
        function () {
            if (!this.ctx.searchInitialized) {
                this.search("");
            }
            this.refreshTemplate();
        };
        /**
         * @param {?} open
         * @return {?}
         */
        CtrList.prototype.isOpen = /**
         * @param {?} open
         * @return {?}
         */
        function (open) {
            this.ctx.isOpen = open;
        };
        /**
         * @return {?}
         */
        CtrList.prototype._clear = /**
         * @return {?}
         */
        function () {
            if (this.searchTimer) {
                this.searchTimer.unsubscribe();
                this.searchTimer = null;
            }
            if (this.dataService) {
                this.dataService.cancel();
            }
            this.viewContainer.clear();
            this.viewRef = null;
        };
        /**
         * @param {?} term
         * @return {?}
         */
        CtrList.prototype.searchTimerComplete = /**
         * @param {?} term
         * @return {?}
         */
        function (term) {
            // Begin the search
            if (isNil(term) || term.length < this.ctrListMinSearchLength) {
                this.ctx.searching = false;
                return;
            }
            this.term = term;
            if (this._dataService) {
                this._dataService.search(term);
            }
        };
        /**
         * @return {?}
         */
        CtrList.prototype.refreshTemplate = /**
         * @return {?}
         */
        function () {
            // create the template if it doesn't exist
            if (!this.viewRef) {
                this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef, this.ctx);
            }
            else if (!this.viewRef.destroyed) {
                /** @type {?} */ ((
                // refresh the template
                this.viewRef)).context.isOpen = this.ctx.isOpen; /** @type {?} */
                ((this.viewRef)).context.results = this.ctx.results; /** @type {?} */
                ((this.viewRef)).context.searching = this.ctx.searching; /** @type {?} */
                ((this.viewRef)).context.searchInitialized = this.ctx.searchInitialized;
                this.viewRef.detectChanges();
            }
            this.cd.markForCheck();
        };
        /**
         * @return {?}
         */
        CtrList.prototype.getBestMatchIndex = /**
         * @return {?}
         */
        function () {
            var _this = this;
            if (!this.ctx.results || !this.term) {
                return null;
            }
            /** @type {?} */
            var bestMatch = this.ctx.results.findIndex(function (item) { return item.title.toLowerCase() === /** @type {?} */ ((_this.term)).toLocaleLowerCase(); });
            // If not try to find the first item that starts with the term
            if (bestMatch < 0) {
                bestMatch = this.ctx.results.findIndex(function (item) { return item.title.toLowerCase().startsWith(/** @type {?} */ ((_this.term)).toLocaleLowerCase()); });
            }
            // If not try to find the first item that includes the term
            if (bestMatch < 0) {
                bestMatch = this.ctx.results.findIndex(function (item) { return item.title.toLowerCase().includes(/** @type {?} */ ((_this.term)).toLocaleLowerCase()); });
            }
            return bestMatch < 0 ? null : bestMatch;
        };
        /**
         * @return {?}
         */
        CtrList.prototype.dataServiceSubscribe = /**
         * @return {?}
         */
        function () {
            var _this = this;
            if (this._dataService) {
                this._dataService
                    .subscribe(function (results) {
                    _this.ctx.searchInitialized = true;
                    _this.ctx.searching = false;
                    _this.ctx.results = results;
                    if (_this.ctrListAutoMatch && results &&
                        results.length === 1 && results[0].title &&
                        !isNil(_this.term) &&
                        results[0].title.toLocaleLowerCase() === /** @type {?} */ ((_this.term)).toLocaleLowerCase()) {
                        // Do automatch
                        // Do automatch
                        _this.completer.onSelected(results[0]);
                        return;
                    }
                    _this.refreshTemplate();
                    if (_this.ctrListAutoHighlight) {
                        _this.completer.autoHighlightIndex = _this.getBestMatchIndex();
                    }
                }, function (error) {
                    console.error(error);
                    console.error("Unexpected error in dataService: errors should be handled by the dataService Observable");
                    return [];
                });
                if (this._dataService.dataSourceChange) {
                    this._dataService.dataSourceChange.subscribe(function () {
                        _this.term = null;
                        _this.ctx.searchInitialized = false;
                        _this.ctx.searching = false;
                        _this.ctx.results = [];
                        _this.refreshTemplate();
                        _this.completer.onDataSourceChange();
                    });
                }
            }
        };
        CtrList.decorators = [
            { type: core.Directive, args: [{
                        selector: "[ctrList]",
                    },] },
        ];
        /** @nocollapse */
        CtrList.ctorParameters = function () { return [
            { type: CtrCompleter, decorators: [{ type: core.Host }] },
            { type: core.TemplateRef },
            { type: core.ViewContainerRef },
            { type: core.ChangeDetectorRef },
            { type: core.NgZone }
        ]; };
        CtrList.propDecorators = {
            ctrListMinSearchLength: [{ type: core.Input }],
            ctrListPause: [{ type: core.Input }],
            ctrListAutoMatch: [{ type: core.Input }],
            ctrListAutoHighlight: [{ type: core.Input }],
            ctrListDisplaySearching: [{ type: core.Input }],
            dataService: [{ type: core.Input, args: ["ctrList",] }],
            initialValue: [{ type: core.Input, args: ["ctrListInitialValue",] }]
        };
        return CtrList;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CtrRow = /** @class */ (function () {
        function CtrRow(el, renderer, dropdown) {
            this.el = el;
            this.renderer = renderer;
            this.dropdown = dropdown;
            this.selected = false;
            this._rowIndex = 0;
            this._item = null;
        }
        /**
         * @return {?}
         */
        CtrRow.prototype.ngOnDestroy = /**
         * @return {?}
         */
        function () {
            if (this._rowIndex) {
                this.dropdown.unregisterRow(this._rowIndex);
            }
        };
        Object.defineProperty(CtrRow.prototype, "ctrRow", {
            set: /**
             * @param {?} index
             * @return {?}
             */
            function (index) {
                this._rowIndex = index;
                this.dropdown.registerRow(new CtrRowItem(this, this._rowIndex));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CtrRow.prototype, "dataItem", {
            set: /**
             * @param {?} item
             * @return {?}
             */
            function (item) {
                this._item = item;
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {?} event
         * @return {?}
         */
        CtrRow.prototype.onClick = /**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            this.dropdown.onSelected(this._item);
        };
        /**
         * @param {?} event
         * @return {?}
         */
        CtrRow.prototype.onMouseEnter = /**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            this.dropdown.highlightRow(this._rowIndex);
        };
        /**
         * @param {?} event
         * @return {?}
         */
        CtrRow.prototype.onMouseDown = /**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            this.dropdown.rowMouseDown();
        };
        /**
         * @param {?} selected
         * @return {?}
         */
        CtrRow.prototype.setHighlighted = /**
         * @param {?} selected
         * @return {?}
         */
        function (selected) {
            this.selected = selected;
            this.renderer.setElementClass(this.el.nativeElement, "completer-selected-row", this.selected);
        };
        /**
         * @return {?}
         */
        CtrRow.prototype.getNativeElement = /**
         * @return {?}
         */
        function () {
            return this.el.nativeElement;
        };
        /**
         * @return {?}
         */
        CtrRow.prototype.getDataItem = /**
         * @return {?}
         */
        function () {
            return this._item;
        };
        CtrRow.decorators = [
            { type: core.Directive, args: [{
                        selector: "[ctrRow]",
                    },] },
        ];
        /** @nocollapse */
        CtrRow.ctorParameters = function () { return [
            { type: core.ElementRef },
            { type: core.Renderer },
            { type: CtrDropdown, decorators: [{ type: core.Host }] }
        ]; };
        CtrRow.propDecorators = {
            ctrRow: [{ type: core.Input }],
            dataItem: [{ type: core.Input }],
            onClick: [{ type: core.HostListener, args: ["click", ["$event"],] }],
            onMouseEnter: [{ type: core.HostListener, args: ["mouseenter", ["$event"],] }],
            onMouseDown: [{ type: core.HostListener, args: ["mousedown", ["$event"],] }]
        };
        return CtrRow;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var CompleterListItemCmp = /** @class */ (function () {
        function CompleterListItemCmp() {
            this.text = "";
            this.searchStr = "";
            this.matchClass = "";
            this.type = "";
            this.parts = [];
        }
        /**
         * @return {?}
         */
        CompleterListItemCmp.prototype.ngOnInit = /**
         * @return {?}
         */
        function () {
            if (!this.searchStr) {
                this.parts.push({ isMatch: false, text: this.text });
                return;
            }
            /** @type {?} */
            var matchStr = this.text.toLowerCase();
            /** @type {?} */
            var matchPos = matchStr.indexOf(this.searchStr.toLowerCase());
            /** @type {?} */
            var startIndex = 0;
            while (matchPos >= 0) {
                /** @type {?} */
                var matchText = this.text.slice(matchPos, matchPos + this.searchStr.length);
                if (matchPos === 0) {
                    this.parts.push({ isMatch: true, text: matchText });
                    startIndex += this.searchStr.length;
                }
                else if (matchPos > 0) {
                    /** @type {?} */
                    var matchPart = this.text.slice(startIndex, matchPos);
                    this.parts.push({ isMatch: false, text: matchPart });
                    this.parts.push({ isMatch: true, text: matchText });
                    startIndex += this.searchStr.length + matchPart.length;
                }
                matchPos = matchStr.indexOf(this.searchStr.toLowerCase(), startIndex);
            }
            if (startIndex < this.text.length) {
                this.parts.push({ isMatch: false, text: this.text.slice(startIndex, this.text.length) });
            }
        };
        CompleterListItemCmp.decorators = [
            { type: core.Component, args: [{
                        selector: "completer-list-item",
                        template: "<span class=\"completer-list-item-holder\" [ngClass]= \"{'completer-title': type === 'title', 'completer-description': type === 'description'}\" >\n        <span class=\"completer-list-item\" *ngFor=\"let part of parts\" [ngClass]= \"part.isMatch ? matchClass : null\">{{part.text}}</span>\n    </span>"
                    },] },
        ];
        CompleterListItemCmp.propDecorators = {
            text: [{ type: core.Input }],
            searchStr: [{ type: core.Input }],
            matchClass: [{ type: core.Input }],
            type: [{ type: core.Input }]
        };
        return CompleterListItemCmp;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var noop$1 = function () {
        return;
    };
    /** @type {?} */
    var COMPLETER_CONTROL_VALUE_ACCESSOR = {
        multi: true,
        provide: forms.NG_VALUE_ACCESSOR,
        useExisting: core.forwardRef(function () { return CompleterCmp; }),
    };
    var CompleterCmp = /** @class */ (function () {
        function CompleterCmp(completerService, cdr) {
            this.completerService = completerService;
            this.cdr = cdr;
            this.inputName = "";
            this.inputId = "";
            this.pause = PAUSE;
            this.minSearchLength = MIN_SEARCH_LENGTH;
            this.maxChars = MAX_CHARS;
            this.overrideSuggested = false;
            this.clearSelected = false;
            this.clearUnselected = false;
            this.fillHighlighted = true;
            this.placeholder = "";
            this.autoMatch = false;
            this.disableInput = false;
            this.autofocus = false;
            this.openOnFocus = false;
            this.openOnClick = false;
            this.selectOnClick = false;
            this.selectOnFocus = false;
            this.autoHighlight = false;
            this.selected = new core.EventEmitter();
            this.highlighted = new core.EventEmitter();
            this.blurEvent = new core.EventEmitter();
            this.click = new core.EventEmitter();
            this.focusEvent = new core.EventEmitter();
            this.opened = new core.EventEmitter();
            this.keyup = new core.EventEmitter();
            this.keydown = new core.EventEmitter();
            this.control = new forms.FormControl("");
            this.displaySearching = true;
            this.displayNoResults = true;
            this._textNoResults = TEXT_NO_RESULTS;
            this._textSearching = TEXT_SEARCHING;
            this._onTouchedCallback = noop$1;
            this._onChangeCallback = noop$1;
            this._focus = false;
            this._open = false;
            this._searchStr = "";
        }
        Object.defineProperty(CompleterCmp.prototype, "value", {
            get: /**
             * @return {?}
             */
            function () { return this.searchStr; },
            set: /**
             * @param {?} v
             * @return {?}
             */
            function (v) {
                if (v !== this.searchStr) {
                    this.searchStr = v;
                }
                // Propagate the change in any case
                this._onChangeCallback(v);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompleterCmp.prototype, "searchStr", {
            get: /**
             * @return {?}
             */
            function () {
                return this._searchStr;
            },
            set: /**
             * @param {?} value
             * @return {?}
             */
            function (value) {
                if (typeof value === "string" || isNil(value)) {
                    this._searchStr = value;
                }
                else {
                    this._searchStr = JSON.stringify(value);
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        CompleterCmp.prototype.ngAfterViewInit = /**
         * @return {?}
         */
        function () {
            if (this.autofocus) {
                this._focus = true;
            }
        };
        /**
         * @return {?}
         */
        CompleterCmp.prototype.ngAfterViewChecked = /**
         * @return {?}
         */
        function () {
            var _this = this;
            if (this._focus) {
                setTimeout(function () {
                    if (!!_this.ctrInput) {
                        _this.ctrInput.nativeElement.focus();
                        _this._focus = false;
                    }
                }, 0);
            }
        };
        /**
         * @return {?}
         */
        CompleterCmp.prototype.onTouched = /**
         * @return {?}
         */
        function () {
            this._onTouchedCallback();
        };
        /**
         * @param {?} value
         * @return {?}
         */
        CompleterCmp.prototype.writeValue = /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.searchStr = value;
        };
        /**
         * @param {?} fn
         * @return {?}
         */
        CompleterCmp.prototype.registerOnChange = /**
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            this._onChangeCallback = fn;
        };
        /**
         * @param {?} fn
         * @return {?}
         */
        CompleterCmp.prototype.registerOnTouched = /**
         * @param {?} fn
         * @return {?}
         */
        function (fn) {
            this._onTouchedCallback = fn;
        };
        /**
         * @param {?} isDisabled
         * @return {?}
         */
        CompleterCmp.prototype.setDisabledState = /**
         * @param {?} isDisabled
         * @return {?}
         */
        function (isDisabled) {
            this.disableInput = isDisabled;
        };
        Object.defineProperty(CompleterCmp.prototype, "datasource", {
            set: /**
             * @param {?} source
             * @return {?}
             */
            function (source) {
                if (source) {
                    if (source instanceof Array) {
                        this.dataService = this.completerService.local(source);
                    }
                    else if (typeof (source) === "string") {
                        this.dataService = this.completerService.remote(source);
                    }
                    else {
                        this.dataService = /** @type {?} */ (source);
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompleterCmp.prototype, "textNoResults", {
            set: /**
             * @param {?} text
             * @return {?}
             */
            function (text) {
                if (this._textNoResults !== text) {
                    this._textNoResults = text;
                    this.displayNoResults = !!this._textNoResults && this._textNoResults !== "false";
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompleterCmp.prototype, "textSearching", {
            set: /**
             * @param {?} text
             * @return {?}
             */
            function (text) {
                if (this._textSearching !== text) {
                    this._textSearching = text;
                    this.displaySearching = !!this._textSearching && this._textSearching !== "false";
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        CompleterCmp.prototype.ngOnInit = /**
         * @return {?}
         */
        function () {
            var _this = this;
            if (!this.completer) {
                return;
            }
            this.completer.selected.subscribe(function (item) {
                _this.selected.emit(item);
            });
            this.completer.highlighted.subscribe(function (item) {
                _this.highlighted.emit(item);
            });
            this.completer.opened.subscribe(function (isOpen) {
                _this._open = isOpen;
                _this.opened.emit(isOpen);
            });
        };
        /**
         * @return {?}
         */
        CompleterCmp.prototype.onBlur = /**
         * @return {?}
         */
        function () {
            this.blurEvent.emit();
            this.onTouched();
            this.cdr.detectChanges();
        };
        /**
         * @return {?}
         */
        CompleterCmp.prototype.onFocus = /**
         * @return {?}
         */
        function () {
            this.focusEvent.emit();
            this.onTouched();
        };
        /**
         * @param {?} event
         * @return {?}
         */
        CompleterCmp.prototype.onClick = /**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            this.click.emit(event);
            this.onTouched();
        };
        /**
         * @param {?} event
         * @return {?}
         */
        CompleterCmp.prototype.onKeyup = /**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            this.keyup.emit(event);
            event.stopPropagation();
        };
        /**
         * @param {?} event
         * @return {?}
         */
        CompleterCmp.prototype.onKeydown = /**
         * @param {?} event
         * @return {?}
         */
        function (event) {
            this.keydown.emit(event);
            event.stopPropagation();
        };
        /**
         * @param {?} value
         * @return {?}
         */
        CompleterCmp.prototype.onChange = /**
         * @param {?} value
         * @return {?}
         */
        function (value) {
            this.value = value;
        };
        /**
         * @return {?}
         */
        CompleterCmp.prototype.open = /**
         * @return {?}
         */
        function () {
            if (!this.completer) {
                return;
            }
            this.completer.open();
        };
        /**
         * @return {?}
         */
        CompleterCmp.prototype.close = /**
         * @return {?}
         */
        function () {
            if (!this.completer) {
                return;
            }
            this.completer.clear();
        };
        /**
         * @return {?}
         */
        CompleterCmp.prototype.focus = /**
         * @return {?}
         */
        function () {
            if (this.ctrInput) {
                this.ctrInput.nativeElement.focus();
            }
            else {
                this._focus = true;
            }
        };
        /**
         * @return {?}
         */
        CompleterCmp.prototype.blur = /**
         * @return {?}
         */
        function () {
            if (this.ctrInput) {
                this.ctrInput.nativeElement.blur();
            }
            else {
                this._focus = false;
            }
        };
        /**
         * @return {?}
         */
        CompleterCmp.prototype.isOpen = /**
         * @return {?}
         */
        function () {
            return this._open;
        };
        CompleterCmp.decorators = [
            { type: core.Component, args: [{
                        selector: "ng2-completer",
                        template: "\n        <div class=\"completer-holder\" ctrCompleter>\n            <input #ctrInput [attr.id]=\"inputId.length > 0 ? inputId : null\" type=\"search\"\n                class=\"completer-input\" ctrInput [ngClass]=\"inputClass\"\n                [(ngModel)]=\"searchStr\" (ngModelChange)=\"onChange($event)\"\n                [attr.name]=\"inputName\" [placeholder]=\"placeholder\"\n                [attr.maxlength]=\"maxChars\" [tabindex]=\"fieldTabindex\" [disabled]=\"disableInput\"\n                [clearSelected]=\"clearSelected\" [clearUnselected]=\"clearUnselected\"\n                [overrideSuggested]=\"overrideSuggested\" [openOnFocus]=\"openOnFocus\" [fillHighlighted]=\"fillHighlighted\"\n                [openOnClick]=\"openOnClick\" [selectOnClick]=\"selectOnClick\" [selectOnFocus]=\"selectOnFocus\"\n                (blur)=\"onBlur()\" (focus)=\"onFocus()\" (keyup)=\"onKeyup($event)\"\n                (keydown)=\"onKeydown($event)\" (click)=\"onClick($event)\"\n                autocomplete=\"off\" autocorrect=\"off\" autocapitalize=\"off\" />\n\n            <div class=\"completer-dropdown-holder\"\n                *ctrList=\"dataService;\n                    minSearchLength: minSearchLength;\n                    pause: pause;\n                    autoMatch: autoMatch;\n                    initialValue: initialValue;\n                    autoHighlight: autoHighlight;\n                    displaySearching: displaySearching;\n                    let items = results;\n                    let searchActive = searching;\n                    let isInitialized = searchInitialized;\n                    let isOpen = isOpen;\">\n                <div class=\"completer-dropdown\" ctrDropdown \n                    *ngIf=\"isInitialized && isOpen && (( items?.length > 0|| (displayNoResults && !searchActive)) || (searchActive && displaySearching))\">\n                    <div *ngIf=\"searchActive && displaySearching\" class=\"completer-searching\">{{ _textSearching }}</div>\n                    <div *ngIf=\"!searchActive && (!items || items?.length === 0)\"\n                    class=\"completer-no-results\">{{ _textNoResults }}</div>\n                    <div class=\"completer-row-wrapper\" *ngFor=\"let item of items; let rowIndex=index\">\n                        <div class=\"completer-row\" [ctrRow]=\"rowIndex\" [dataItem]=\"item\">\n                            <div *ngIf=\"item.image || item.image === ''\" class=\"completer-image-holder\">\n                                <img *ngIf=\"item.image != ''\" src=\"{{item.image}}\" class=\"completer-image\" />\n                                <div *ngIf=\"item.image === ''\" class=\"completer-image-default\"></div>\n                            </div>\n                            <div class=\"completer-item-text\"\n                            [ngClass]=\"{'completer-item-text-image': item.image || item.image === '' }\">\n                                <completer-list-item\n                                class=\"completer-title\" [text]=\"item.title\" [matchClass]=\"matchClass\"\n                                [searchStr]=\"searchStr\" [type]=\"'title'\"></completer-list-item>\n                                <completer-list-item *ngIf=\"item.description && item.description != ''\"\n                                class=\"completer-description\" [text]=\"item.description\"\n                                    [matchClass]=\"matchClass\" [searchStr]=\"searchStr\" [type]=\"'description'\">\n                                </completer-list-item>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    ",
                        styles: ["\n    .completer-dropdown {\n        border-color: #ececec;\n        border-width: 1px;\n        border-style: solid;\n        border-radius: 2px;\n        width: 250px;\n        padding: 6px;\n        cursor: pointer;\n        z-index: 9999;\n        position: absolute;\n        margin-top: -6px;\n        background-color: #ffffff;\n    }\n\n    .completer-row {\n        padding: 5px;\n        color: #000000;\n        margin-bottom: 4px;\n        clear: both;\n        display: inline-block;\n        width: 103%;\n    }\n\n    .completer-selected-row {\n        background-color: lightblue;\n        color: #ffffff;\n    }\n\n    .completer-description {\n        font-size: 14px;\n    }\n\n    .completer-image-default {\n        width: 16px;\n        height: 16px;\n        background-image: url(\"demo/res/img/default.png\");\n    }\n\n    .completer-image-holder {\n        float: left;\n        width: 10%;\n    }\n    .completer-item-text-image {\n        float: right;\n        width: 90%;\n    }\n    "],
                        providers: [COMPLETER_CONTROL_VALUE_ACCESSOR]
                    },] },
        ];
        /** @nocollapse */
        CompleterCmp.ctorParameters = function () { return [
            { type: CompleterService },
            { type: core.ChangeDetectorRef }
        ]; };
        CompleterCmp.propDecorators = {
            dataService: [{ type: core.Input }],
            inputName: [{ type: core.Input }],
            inputId: [{ type: core.Input }],
            pause: [{ type: core.Input }],
            minSearchLength: [{ type: core.Input }],
            maxChars: [{ type: core.Input }],
            overrideSuggested: [{ type: core.Input }],
            clearSelected: [{ type: core.Input }],
            clearUnselected: [{ type: core.Input }],
            fillHighlighted: [{ type: core.Input }],
            placeholder: [{ type: core.Input }],
            matchClass: [{ type: core.Input }],
            fieldTabindex: [{ type: core.Input }],
            autoMatch: [{ type: core.Input }],
            disableInput: [{ type: core.Input }],
            inputClass: [{ type: core.Input }],
            autofocus: [{ type: core.Input }],
            openOnFocus: [{ type: core.Input }],
            openOnClick: [{ type: core.Input }],
            selectOnClick: [{ type: core.Input }],
            selectOnFocus: [{ type: core.Input }],
            initialValue: [{ type: core.Input }],
            autoHighlight: [{ type: core.Input }],
            selected: [{ type: core.Output }],
            highlighted: [{ type: core.Output }],
            blurEvent: [{ type: core.Output, args: ["blur",] }],
            click: [{ type: core.Output }],
            focusEvent: [{ type: core.Output, args: ["focus",] }],
            opened: [{ type: core.Output }],
            keyup: [{ type: core.Output }],
            keydown: [{ type: core.Output }],
            completer: [{ type: core.ViewChild, args: [CtrCompleter,] }],
            ctrInput: [{ type: core.ViewChild, args: ["ctrInput",] }],
            datasource: [{ type: core.Input }],
            textNoResults: [{ type: core.Input }],
            textSearching: [{ type: core.Input }]
        };
        return CompleterCmp;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    /** @type {?} */
    var providers = [
        CompleterService,
        LocalDataFactory,
        RemoteDataFactory
    ];
    var Ng2CompleterModule = /** @class */ (function () {
        function Ng2CompleterModule() {
        }
        /**
         * @return {?}
         */
        Ng2CompleterModule.forRoot = /**
         * @return {?}
         */
        function () {
            return {
                ngModule: Ng2CompleterModule,
                providers: providers
            };
        };
        /**
         * @return {?}
         */
        Ng2CompleterModule.forChild = /**
         * @return {?}
         */
        function () {
            return {
                ngModule: Ng2CompleterModule,
                providers: providers
            };
        };
        Ng2CompleterModule.decorators = [
            { type: core.NgModule, args: [{
                        declarations: [
                            CompleterListItemCmp,
                            CtrCompleter,
                            CtrDropdown,
                            CtrInput,
                            CtrList,
                            CtrRow,
                            CompleterCmp
                        ],
                        exports: [
                            CompleterListItemCmp,
                            CtrCompleter,
                            CtrDropdown,
                            CtrInput,
                            CtrList,
                            CtrRow,
                            CompleterCmp
                        ],
                        imports: [
                            common.CommonModule,
                            forms.FormsModule
                        ],
                        providers: providers
                    },] },
        ];
        return Ng2CompleterModule;
    }());

    exports.LocalData = LocalData;
    exports.RemoteData = RemoteData;
    exports.LocalDataFactory = LocalDataFactory;
    exports.RemoteDataFactory = RemoteDataFactory;
    exports.CompleterService = CompleterService;
    exports.CtrCompleter = CtrCompleter;
    exports.CtrDropdown = CtrDropdown;
    exports.CtrInput = CtrInput;
    exports.CtrList = CtrList;
    exports.CtrRow = CtrRow;
    exports.CompleterListItemCmp = CompleterListItemCmp;
    exports.CompleterCmp = CompleterCmp;
    exports.Ng2CompleterModule = Ng2CompleterModule;
    exports.ɵa = CtrListContext;
    exports.ɵb = CompleterBaseData;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ng2-completer.umd.js.map
