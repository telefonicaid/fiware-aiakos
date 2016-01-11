/*
 * Copyright 2015 Telefónica I+D
 * All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */
'use strict';


var assert = require('assert'),
    app = require('../../lib/app'),
    sinon = require('sinon');


/* jshint multistr: true */
suite('app', function () {


    test('should_build_express_app', function () {

        var expressApp = sinon.stub();
        expressApp.use = sinon.spy();
        expressApp.set = sinon.spy();
        expressApp.get = sinon.spy();

        app.setup(expressApp);
        assert(expressApp.use.withArgs('/').called);
        assert(expressApp.use.withArgs('/v1').called);
        assert(expressApp.set.called);
        assert(expressApp.get.called);

    });
});
