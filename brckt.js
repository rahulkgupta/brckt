var Q = require('q'),
    _ = require('lodash'),
    request = require('request');


//private variables

var config = {};

//private functions

function genQuery(query) {
  return query ? '?'+ query : '';
}

function requestP(method, uri, data) {

  return Q.Promise(function (resolve, reject) {
    var reqOptions = {
      method: method,
      uri: config.baseUrl + uri,
      headers: config.headers,
      json: true
    };

    if (data) {
      reqOptions['body'] = data;
    }
    request(reqOptions, function (err, res, body) {
      if (err) {
        return reject(err);
      }
      var statusCode = res.toJSON().statusCode;
      if (statusCode >= 200 && statusCode <= 299) {
        resolve(body);
      } else {
        reject({ statusCode: statusCode, err: body });
      }
    });
  });
}

function restify(fn, arg) {
  return function () {
    return fn(genResourceIdPath(_.toArray(arguments)));
  };
}

function restifyWithData(fn) {
  return function () {
    var args = _.toArray(arguments),
        resourcesAndIds = _.initial(args),
        obj = _.last(args);

    return fn(genResourceIdPath(resourcesAndIds), obj);
  };
}

function generate(fn) {
  return function () {
    var args = _.toArray(arguments);
    args.unshift(fn);
    return _.partial.apply(null, args);
  };
}

//Public Functions

var get = _.partial(requestP, 'GET'),
    post = _.partial(requestP, 'POST'),
    put = _.partial(requestP, 'PUT'),
    del = _.partial(requestP, 'DELETE');

function genResourceIdPath (resourcesAndIds) {
  var half = Math.ceil(resourcesAndIds.length/2),
  resources = resourcesAndIds.slice(0, half),
  ids = resourcesAndIds.slice(half, resourcesAndIds.length),
  concatArray = [];

  for (var i = 0; i < ids.length; i++) {
    concatArray.push(resources[i]);
    concatArray.push(ids[i]);
  }
  if (resources.length > ids.length) {
    concatArray.push(resources[resources.length-1]);
  }

  return concatArray.join('/');
}

function listObjects (/*resources, ids, query*/) {
  var args = _.toArray(arguments);
  //one resource, query
  if (args.length == 2) {
    return get(args[0] + genQuery(args[1]));
  }
  //multiple resources and ids, no query
  if (args.length % 2 == 1) {
    return get(genResourceIdPath(args));
  }

  //multiple resources and ids, query
  var query = genQuery(args[args.length - 1]),
  pathArgs = args.slice(0, args.length-1);

  return get(genResourceIdPath(pathArgs) + query);
}

//brckt definition

module.exports = brckt = function (baseUrl, headers) {
  config.baseUrl = baseUrl.slice(-1) == '/' ? baseUrl : baseUrl + '/';
  config.headers = headers;

  return {

    buildGetFn:     generate(restify(get)),
    buildListFn:    generate(listObjects),
    buildCreateFn:  generate(restifyWithData(post)),
    buildUpdateFn:  generate(restifyWithData(put)),
    buildRemoveFn:  generate(restify(del)),

    getObject:      restify(get),
    listObjects:    listObjects,
    createObject:   restifyWithData(post),
    updateObject:   restifyWithData(put),
    removeObject:   restify(del),

    get:    get,
    post:   post,
    put:    put,
    delete: del,

  };
};
