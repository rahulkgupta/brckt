var assert = require("assert");
var nock = require('nock');


describe('brckt', function () {

  var Brckt = require('../brckt');

  var brckt = Brckt('http://url.com/api', {
    'Accept': 'application/json',
    'Authorization': 'SSWS token',
    'Content-type': 'application/json'
  });

  beforeEach(function () {
    this.mockReq = nock('http://url.com', {
      reqHeaders: {
        'Accept': 'application/json',
        'Authorization': 'SSWS token',
        'Content-type': 'application/json'
      }
    })
    .matchHeader('Accept', 'application/json')
    .matchHeader('Authorization', 'SSWS token')
    .matchHeader('Content-type', 'application/json');

  });

  afterEach(function () {
    nock.cleanAll();
  });

  describe('generator functions', function () {

    describe('buildGetFn', function () {

      it('creates a function that makes a GET request to the expected url', function () {
        this.mockReq.get('/api/users/4/posts/5').reply(200, true);
        var getUserPost = brckt.buildGetFn('users', 'posts');
        return getUserPost('4', '5').then(function (res) {
          assert.equal(res, true);
        });
      });

    });

    describe('buildListFn', function () {

      it('creates a function that makes a GET request to the expected url', function () {
        this.mockReq.get('/api/users/4/posts').reply(200, true);
        var listUserPosts = brckt.buildListFn('users', 'posts');
        return listUserPosts('4').then(function (res) {
          assert.equal(res, true);
        });
      });

      it("creates a function that accepts a query parameter", function () {
        this.mockReq.get('/api/users/4/posts?read=true').reply(200, true);
        var listUserPosts = brckt.buildListFn('users', 'posts');
        return listUserPosts('4', 'read=true').then(function (res) {
          assert.equal(res, true);
        });
      });

    });

    describe('buildUpdateFn', function () {

      it('creates a function that makes a PUT request to the expected url', function () {
        var post = {};
        this.mockReq.put('/api/users/4/posts/5', post).reply(200, true);
        var updateUserPost = brckt.buildUpdateFn('users', 'posts');
        return updateUserPost('4', '5', post).then(function (res) {
          assert.equal(res, true);
        });
      });

    });

    describe('buildCreateFn', function () {

      it('creates a function that makes a POST request to the expected url', function () {
        var post = {};
        this.mockReq.post('/api/users/4/posts', post).reply(200, true);
        var createUserPost = brckt.buildCreateFn('users', 'posts');
        return createUserPost('4', post).then(function (res) {
          assert.equal(res, true);
        });
      });

    });

    describe('buildRemoveFn', function () {

      it('creates a function that makes a DELETE request to the expected url', function () {
        this.mockReq.delete('/api/users/4/posts/5').reply(200, true);
        var deleteUserPost = brckt.buildRemoveFn('users', 'posts');
        return deleteUserPost('4', '5').then(function (res) {
          assert.equal(res, true);
        });
      });

    });

  });

  describe('RESTful functions', function () {

    describe('getObject', function () {

      it('makes a GET request to the expected url', function () {
        this.mockReq.get('/api/users/4').reply(200, true);
        return brckt.getObject('users', '4').then(function (res) {
          assert.equal(res, true);
        });
      });

      it('makes a GET request to the expected nested url', function () {
        this.mockReq.get('/api/users/4/posts/5').reply(200, true);
        return brckt.getObject('users', 'posts', '4', '5').then(function (res) {
          assert.equal(res, true);
        });
      });

    });

    describe('listObjects', function () {

      it('makes a GET request to the expected url', function () {
        this.mockReq.get('/api/users').reply(200, true);
        return brckt.listObjects('users').then(function (res) {
          assert.equal(res, true);
        });
      });

      it('adds a query parameter to the url if present', function () {
        this.mockReq.get('/api/users?blah').reply(200, true);
        return brckt.listObjects('users', 'blah').then(function (res) {
          assert.equal(res, true);
        });
      });

      it('makes a GET request to the expected nested url', function () {
        this.mockReq.get('/api/users/4/posts').reply(200, true);
        return brckt.listObjects('users', 'posts', '4').then(function (res) {
          assert.equal(res, true);
        });
      });

      it('adds a query parameter to the nested url if present', function () {
        this.mockReq.get('/api/users/4/posts?read=true').reply(200, true);
        return brckt.listObjects('users', 'posts', '4', 'read=true').then(function (res) {
          assert.equal(res, true);
        });
      });

    });

    describe('updateObject', function () {

      it('makes a PUT request to the expected url with the expected data', function () {
        var user = {};
        this.mockReq.put('/api/users/4', user).reply(200, true);
        return brckt.updateObject('users', '4', user).then(function (res) {
          assert.equal(res, true);
        });
      });

      it('makes a PUT request to the expected nested url with the expected data', function () {
        var post = {};
        this.mockReq.put('/api/users/4/posts/5', post).reply(200, true);
        return brckt.updateObject('users', 'posts', '4', '5', post).then(function (res) {
          assert.equal(res, true);
        });
      });

    });

    describe('createObject', function () {

      it('makes a POST request to the expected url with the expected data', function () {
        var user = {};
        this.mockReq.post('/api/users', user).reply(200, true);
        return brckt.createObject('users', user).then(function (res) {
          assert.equal(res, true);
        });
      });

      it('makes a POST request to the expected nested url with the expected data', function () {
        var post = {};
        this.mockReq.post('/api/users/4/posts', post).reply(200, true);
        return brckt.createObject('users', 'posts', '4', post).then(function (res) {
          assert.equal(res, true);
        });
      });
    });

    describe('removeObject', function () {

      it('makes a DELETE request to the expected url', function () {
        this.mockReq.delete('/api/users/4').reply(200, true);
        return brckt.removeObject('users', '4').then(function (res) {
          assert.equal(res, true);
        });
      });

      it('makes a DELETE request to the expected nested url', function () {
        this.mockReq.delete('/api/users/4/posts/5').reply(200, true);
        return brckt.removeObject('users', 'posts', '4', '5').then(function (res) {
          assert.equal(res, true);
        });
      });
    });

  });

  describe('http functions', function () {

    describe('get', function () {

      it('makes a GET request', function () {
        this.mockReq.get('/api/users').reply(200, true);
        return brckt.get('users').then(function (res) {
          assert.equal(res, true);
        });
      });

    });

    describe('post', function () {
      it('makes a POST request', function () {
        this.mockReq.post('/api/users', {name: 'joe'}).reply(200, true);
        return brckt.post('users', {name: 'joe'}).then(function (res) {
          assert.equal(res, true);
        });
      });

    });

    describe('put', function () {
      it('makes a PUT request', function () {
        this.mockReq.put('/api/users/4', {name: 'joe'}).reply(200, true);
        return brckt.put('users/4', {name: 'joe'}).then(function (res) {
          assert.equal(res, true);
        });
      });

    });

    describe('delete', function () {
      it('makes a DELETE request', function () {
        this.mockReq.delete('/api/users/4').reply(200, true);
        return brckt.delete('users/4').then(function (res) {
          assert.equal(res, true);
        });
      });
    });

  });

});
