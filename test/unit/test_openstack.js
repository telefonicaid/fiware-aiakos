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
    openstack = require('../../lib/routes/openstack'),
    config = require('../../lib/config').data,
    sinon = require('sinon'),
    http = require('http'),
    EventEmitter = require('events').EventEmitter;

/* jshint multistr: true */
suite('openstack', function () {


    test('should_return_region_name', function() {

        //given
        //when

        var region = openstack.parseRegionNameFromUserName('admin-spain');
        //then
        assert(region === 'spain');

    });

    test('should_return_error_with_invalid_username_region_name', function() {

        //given
        //when
        try {
            openstack.parseRegionNameFromUserName('username');

        } catch (Error) {
            //then
            assert(true);
        }


    });

    test('should_parse_username_from_config_for_PiraeusN', function() {
        //given
        config.regions.names = [{'admin-athens-neurorepublic': 'PiraeusN'}];
        //when
        var region = openstack.parseRegionNameFromUserName('admin-athens-neurorepublic');
        //then

        assert('PiraeusN' === region);

    });

    test('should_return_error_with_username_like_email_address', function() {

        //given
        //when
        try {
            openstack.parseRegionNameFromUserName('username@domain.com');

        } catch (Error) {
            //then
            assert(true);
        }


    });

    test('should_get_validate_token', function(done) {
        //given
        var request = new EventEmitter();
        request.end = sinon.spy();
        request.write = sinon.spy();
        request.setTimeout = sinon.spy();

        var requestStub = sinon.stub(http, 'request', function (options, callback) {
            var response = new EventEmitter();
            response.setEncoding = sinon.stub();
            callback(response);

            var json = {'token': {'user': {'name': 'admin-region'},'project': {}, 'roles': {}, 'catalog': {}}};
            response.emit('data', JSON.stringify(json));
            response.emit('end');
            return request;
        });
        //when
        openstack.getValidateToken('1234admintoken', '1234usertoken', function() {
            http.request.restore();
            done();
        });
        //then
        assert(request.end.calledOnce);
        assert(request.setTimeout.calledOnce);
        assert.equal('GET', requestStub.getCall(0).args[0].method);

    });

    test('should_post_admin_token', function(done) {
        //given
        var request = new EventEmitter();
        var response = new EventEmitter();
        request.end = sinon.spy();
        request.write = sinon.spy();
        request.setTimeout = sinon.spy();

        var requestStub = sinon.stub(http, 'request', function (options, callback) {
            response.setEncoding = sinon.stub();
            response.headers = sinon.stub();
            response.headers['x-subject-token'] = '123123';
            response.statusCode = 201;
            callback(response);
            response.emit('end');
            return request;
        });
        //when
        openstack.postAdminToken( function() {
            http.request.restore();
            done();
        });
        //then
        assert(request.write.calledOnce);
        assert(request.end.calledOnce);
        assert(request.setTimeout.calledOnce);
        assert(201 === response.statusCode);
        assert.equal('POST', requestStub.getCall(0).args[0].method);

    });

    test('should_return_401_with_invalid_admin_token', function(done) {
        //given
        var request = new EventEmitter();
        var response = new EventEmitter();
        request.end = sinon.spy();
        request.write = sinon.spy();
        request.setTimeout = sinon.spy();

        var requestStub = sinon.stub(http, 'request', function (options, callback) {
            response.setEncoding = sinon.stub();
            response.statusCode = 401;
            callback(response);
            response.emit('end');
            return request;
        });
        //when
        openstack.postAdminToken( function() {
            http.request.restore();
            done();
        });
        //then
        assert(request.write.calledOnce);
        assert(request.end.calledOnce);
        assert(request.setTimeout.calledOnce);
        assert.equal('POST', requestStub.getCall(0).args[0].method);

    });

    test('should_validate_token_and_get_region', function(done) {
         //given
        var request = new EventEmitter();
        request.end = sinon.spy();
        request.write = sinon.spy();
        request.setTimeout = sinon.spy();

        var requestStub = sinon.stub(http, 'request', function (options, callback) {
            if (options.method === 'GET') {
                var response = new EventEmitter();
                response.setEncoding = sinon.stub();
                callback(response);

                var json = {'token': {'user': {'name': 'admin-region'}, 'project': {}, 'roles': {}, 'catalog': {}}};
                response.emit('data', JSON.stringify(json));
                response.emit('end');
                return request;
            } else {
                var response2 = new EventEmitter();
                response2.setEncoding = sinon.stub();
                response2.headers = sinon.stub();
                response2.headers['x-subject-token'] = '123123';
                callback(response2);
                response2.emit('end');
                return request;
            }
        });
        //when
        openstack.validateTokenAndGetRegion('123usertoken', function(result) {
            console.log('test result: ' + result);
            http.request.restore();
            done();
        });

        //then

        sinon.assert.callCount(requestStub, 2);
    });

});
