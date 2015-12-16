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
    v1 = require('../../lib/routes/v1'),
    sinon = require('sinon'),
    openstack = require('../../lib/routes/openstack'),
    fs = require('fs');

/* jshint multistr: true */
suite('v1', function () {

    suiteSetup(function() {
        v1.setKeysPath('./test/unit/');
    });

    test('should_have_a_validate_region_method', function () {
        assert.equal(v1.validateRegion.name, 'validateRegion');

    });

    test('should_return_error_with_invalid_region', function () {

        var result = v1.validateRegion('invalidName');
        assert(result === false);

    });

    test('should_return_true_with_valid_region', function () {

        var result = v1.validateRegion('region1');

        assert(result === true);

    });

    test('should_return_true_with_gpgkey', function () {

        var result = v1.validateKey('gpgkey');

        assert(result === true);

    });

    test('should_return_true_with_sshkey', function () {

        var result = v1.validateKey('sshkey');

        assert(result === true);

    });


    test('should_return_true_with_invalid_keyname', function () {

        var result = v1.validateKey('ddd');

        assert(result === false);

    });


    test('should_return_a_valid_ssh_key_for_valid_region', function() {
        var req = sinon.stub(),
            res = sinon.stub();

        req.params = sinon.stub();
        req.params.region = 'region1';
        req.params.key = 'sshkey';
        res.write = sinon.spy();
        res.setHeader = sinon.spy();
        res.type = sinon.spy();
        res.end = sinon.spy();

        v1.getKey(req, res);

        assert(res.write.calledOnce);
        assert(res.setHeader.calledOnce);
        assert(res.type.calledOnce);
        assert(res.end.calledOnce);

    });

    test('should_discover_ssh_key', function() {
        //given
        var content = 'ssh-rsa fBIqA5CALsR/gF6ITbjnSSc5pYTDZ/T0JwIb5Z admin@domain.com';

        //when

        var key = v1.discoverKey(content);


        //then
        assert(key === 'ssh');
    });

    test('should_discover_gpg_key', function() {
        //given
        var content = '-----BEGIN PGP PUBLIC KEY BLOCK-----';

        //when

        var key = v1.discoverKey(content);

        //then
        assert(key === 'gpg');
    });


    test('should_return_null_in_discover_key_with_invalid_content', function() {
        //given
        var content = 'abcdefghijklmnopqrstuvwxyz';

        //when

        var key = v1.discoverKey(content);

        //then
        assert(key === null);
    });

    test('should_post_a_key', function() {
        //given
        var body = 'ssh-rsa fBIqA5CALsR/gF6ITbjnSSc5pYTDZ/T0JwIb5Z admin@domain.com';
        var req = sinon.stub(),
            res = sinon.stub();

        var openstackStub = sinon.stub(openstack, 'validateTokenAndGetRegion', function (token) {
            console.log('fake openstack.validateTokenAndGetRegion');
            openstack.validateTokenAndGetRegion.restore();
            assert(token === '12345678');
        });


        req.body = body;
        req.header = sinon.stub();
        req.header.withArgs('X-Auth-Token').returns('12345678');
        req.is = sinon.stub();
        req.is.withArgs('text').returns(true);

        //when
        v1.postKey(req, res);

        //then
        assert(req.header.calledOnce);
        assert(openstackStub.calledOnce);


    });

    test('should_save_key_to_disk_when_post_a_key', function() {
        //given
        var body = 'ssh-rsa fBIqA5CALsR/gF6ITbjnSSc5pYTDZ/T0JwIb5Z admin@domain.com';
        var req = sinon.stub(),
            res = sinon.stub();

        var fsStub = sinon.stub(fs, 'writeFile', function (path, content, callbackWriteFile) {
            console.log('fake fs.writeFile');
            callbackWriteFile();
            fs.writeFile.restore();
        });
        res.status = sinon.stub();
        res.write = sinon.stub();
        res.type = sinon.stub();
        res.setHeader = sinon.stub();
        res.end = sinon.spy();

        req.body = body;
        req.header = sinon.stub();
        req.header.withArgs('region').returns('region1');
        req.is = sinon.stub();
        req.is.withArgs('text').returns(true);

        //when
        v1.saveKeyToFile('region1', body, res);

        //then
        assert(fsStub.calledOnce);
        assert(res.status.withArgs(201).calledOnce);
        assert(res.setHeader.withArgs().calledOnce);
        assert(res.type.calledOnce);
        assert(res.write.withArgs(body, 'utf8').calledOnce);
        assert(res.end.calledOnce);


    });

    test('should_return_error_when_post_an_invalid_key', function() {
        //given
        var body = 'kkkkk fBIqA5CALsR/gF6ITbjnSSc5pYTDZ/T0JwIb5Z admin@domain.com';
        var req = sinon.stub(),
            res = sinon.stub();

        res.status = sinon.stub();
        res.end = sinon.spy();

        req.body = body;
        req.header = sinon.stub();
        req.header.withArgs('region').returns('region1');
        req.is = sinon.stub();
        req.is.withArgs('text').returns(true);


        //when
        try {
            v1.saveKeyToFile('region1', body, res);
            assert(false);

        } catch (Error) {
            //then
            assert(true);

        }


    });

    test('should_return_error_415_when_post_has_invalid_content_type', function() {
        //given
        var req = sinon.stub(),
            res = sinon.stub();

        res.status = sinon.stub();
        res.end = sinon.spy();
        req.is = sinon.stub();
        req.is.withArgs('text').returns(false);

        //when
        v1.postKey(req, res);

        //then
        assert(res.status.withArgs(415).calledOnce);
        assert(res.end.calledOnce);


    });


});
