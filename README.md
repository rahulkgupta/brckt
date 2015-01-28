# brckt (bracket)

brckt is a node module that makes writing node SDKs very easy, especially if they follow the RESTful conventions.

## Setup

Install using npm: `npm install brckt`

Require brckt and initialize a new instance of brckt

```js
var Brckt = require('brckt');
var brckt = Brckt(baseUrl, headers)
```
`baseUrl` is the base url of the api and `headers` are [request's HTTP headers ](https://github.com/request/request#custom-http-headers).

## API

__Note__: All the non-util functions that make http requests return Q promises.
If the requests causes an error, then Q rejects with the error.
If the response returns with a non 2xx status code, then the function rejects with the following object.

```
{
  statusCode: statusCode
  err: body
}
```

For 80% of the use cases, you will only need to use the generator functions. All the generator functions can take a variable number of arguments, which allows one to build a rich SDK for APIs with nested resources.

### Generator Functions

These functions take a variable number of arguments, depending on your API, and return functions that consumers of your SDK can call with the appropriate ids and objects.

#### brkct.buildGetFn

```js

//create the SDK function
mySDK.getUserPost = brckt.buildGetFn('users', 'posts');

//send a GET request to "baseUrl/users/4/posts/5"
mySDK.getUserPost('4', '5')
.then(function (userPost) {
  //server has responded with a user's post
});
```

#### brckt.buildListFn

```js
//create the SDK function
mySDK.listUserPosts = brckt.buildListFn('users', 'posts');

//send a GET request to "baseUrl/users/4/posts"
mySDK.listUserPosts('4')
.then(function (userPosts) {
  //server has responded with a user's posts
});

//send a GET request to "baseUrl/users/4/posts?read=true"
mySDK.listUserPosts('4', 'read=true')
.then(function (userPosts) {
  //server has responded with a user's posts
});
```

#### brckt.buildCreateFn

```js
//create the SDK function
mySDK.createUserPost = brckt.buildCreateFn('users', 'posts');

var post = {
  message: 'My new post.'
};

//send a POST request to "baseUrl/users/4/posts"
//with post as the request body
mySDK.createUserPost('4', post)
.then(function (createdPost) {
  //server has created your post
});
```

#### brckt.buildUpdateFn

```js
//create the SDK function
mySDK.updateUserPost = brckt.buildUpdateFn('users', 'posts');

var post = {
  message: 'Updating my post.'
};

//send a PUT request to "baseUrl/users/4/posts/5"
//with post as the request body
mySDK.updateUserPost('4', '5', post)
.then(function (updatedPost) {
  //server has updated your post
});
```
#### brckt.buildRemoveFn

```js
//create the SDK function
mySDK.removeUserPost = brckt.buildRemoveFn('users', 'posts');

//send a DELETE request to "baseUrl/users/4/posts/5"
mySDK.removeUserPost('4', '5')
.then(function (acknowledgedDelete) {
  //server has deleted your post
});
```

### RESTful Functions

If you don't want to use the generator functions and instead create your SDK with partials (see [lodash's partial](https://lodash.com/docs#partial), use the following functions.

#### brckt.getObject

```js
//create the SDK function
mySDK.getUserPost = _.partial(brckt.getObject, 'users', 'posts');

//send a GET request to "baseUrl/users/4/posts/5"
mySDK.getUserPost('4', '5')
.then(function (userPost) {
  //server has responded with a user's post
});

//another way to send a GET request to "baseUrl/users/4/posts/5"
brckt.getObject('users', 'posts', '4', '5')
.then(function (userPost) {
  //server has responded with a user's post
});
```

#### brckt.listObjects

```js
//create the SDK function
mySDK.listUserPosts = _.partial(brckt.listObjects, 'users', 'posts');

//send a GET request to "baseUrl/users/4/posts/5"
mySDK.listUserPosts('4')
.then(function (userPossts) {
  //server has responded with user's posts
});

//another way to send a GET request to "baseUrl/users/4/posts/5"
brckt.listObjects('users', 'posts', '4')
.then(function (userPosts) {
  //server has responded with user's posts
});

//send a GET request to "baseUrl/users/4/posts/5?read=true"
mySDK.listUserPosts('4', 'read=true')
.then(function (userPosts) {
  //server has responded with user's posts
});

//another way to send a GET request to "baseUrl/users/4/posts/5?read=true"
brckt.listObjects('users', 'posts', '4', 'read=true')
.then(function (userPosts) {
  //server has responded with user's posts
});

```

#### brckt.createObject

```js
//create the SDK function
mySDK.createUserPost = _.partial(brckt.createObject, 'users', 'posts');

var post = {
  message: 'My new post.'
};

//send a POST request to "baseUrl/users/4/posts"
//with post as the request body
mySDK.createUserPost('4', post)
.then(function (createdPost) {
  //server has created your post
});

//send a POST request to "baseUrl/users/4/posts"
//with post as the request body
mySDK.createObject('users', 'posts', '4', post)
.then(function (createdPost) {
  //server has created your post
});

```

#### brckt.updateObject

```js
//create the SDK function
mySDK.updateUserPost = _.partial(brckt.updateObject, 'users', 'posts');

var post = {
  message: 'Updating my post.'
};

//send a PUT request to "baseUrl/users/4/posts/5"
//with post as the request body
mySDK.updateUserPost('4', '5', post)
.then(function (updatedPost) {
  //server has updated your post
});

//another way to send a PUT request to "baseUrl/users/4/posts/5"
//with post as the request body
mySDK.udpateObject('users', 'posts', '4', '5', post)
.then(function (updatedPost) {
  //server has updated your post
});

```

#### brckt.removeObject

```js
//create the SDK function
mySDK.removeUserPost = _.partial(brckt.removeObject, 'users', 'posts');

//send a DELETE request to "baseUrl/users/4/posts/5"
mySDK.removeUserPost('4', '5')
.then(function (acknowledgedDelete) {
  //server has deleted your post
});

//another way to send a DELETE request to "baseUrl/users/4/posts/5"
mySDK.removeObject('users', 'posts', '4', '5')
.then(function (acknowledgedDelete) {
  //server has deleted your post
});
```

### Generic Functions

If you need to perform a custom request, you can use the following generic functions.

#### brckt.get

```js
//send a GET request to baseUrl/users/4/posts/5
brckt.get('users/4/posts/5')
.then(function (userPost) {
  //server has responded with a user's post
});
```

#### brckt.post

```js
var post = {
  message: 'My new post.'
};

//send a POST request to "baseUrl/users/4/posts"
//with post as the request body
brctk.post('users/4/posts', post)
.then(function (createdPost) {
  //server has created your post
});
```

#### brckt.put

```js
var post = {
  message: 'Updating my post.'
};

//send a POST request to "baseUrl/users/4/posts"
//with post as the request body
brctk.put('users/4/posts', post)
.then(function (updatedPost) {
  //server has updated your post
});
```

#### brckt.delete

```js

//send a DELETE request to "baseUrl/users/4/posts/5"
brckt.delete('users/4/posts/5')
.then(function (acknowledgedDelete) {
  //server has deleted your post
});
```

## Contributing

Feel free to contribute. You need mocha to be installed globally in order to run tests which can be run either with `mocha` or `npm test`.
