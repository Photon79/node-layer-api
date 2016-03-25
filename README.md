# Layer API for node.js
[![Build Status](http://img.shields.io/travis/layerhq/node-layer-api.svg)](https://travis-ci.org/layerhq/node-layer-api)
[![npm version](http://img.shields.io/npm/v/layer-api.svg)](https://npmjs.org/package/layer-api)

A Node.js library, which provides a wrapper for the [Layer](https://layer.com) Platform API.

The Layer Platform API is designed to empower developers to automate, extend, and integrate functionality provided by the Layer platform with other services and applications. For more on this see our [blog post](http://blog.layer.com/introducing-layer-platform-api/).

This library supports requests from your **servers** only.

## Documentation

You can find full documentation on Platform API at [developer.layer.com/docs/platform](https://developer.layer.com/docs/platform).

## Installation

    npm install layer-api

## Simple example

```javascript
var LayerAPI = require('layer-api');

// Initialize by providing your Layer credentials
var layer = new LayerAPI({
  token: API_TOKEN,
  appId: APP_ID
});

// Create a Conversation
layer.conversations.create({participants: ['abcd']}, function(err, res) {
  var cid = res.body.id;

  // Send a Message
  layer.messages.sendTextFromUser(cid, 'abcd', 'Hello, World!', function(err, res) {
    console.log(err || res.body);
  });
});
```

## Initialization

To use this library you need to create a new instance of the `layer-api` module by passing `config` object to a constructor.

### new LayerAPI(config)

Layer API constructor is initialized with the following configuration values:

 - `token` - Layer Platform API token which can be obtained from [Developer Dashboard](https://developer.layer.com/projects/keys)
 - `appId` - Layer application ID

*Optional values:*

 - `version` - API version to use (default: `1.0`)
 - `timeout` - Request timeout in milliseconds (default: `10000` milliseconds)
 - `agent` - Instance of [https.Agent](https://nodejs.org/api/https.html#https_class_https_agent) to use HTTPS KeepAlive
 - `agentOptions` - Or use [Agent options](https://nodejs.org/api/http.html#http_new_agent_options) hash directly
 - `debug` - Enable debugging (default: `false`)

## Conversations

Conversations coordinate messaging within Layer and can contain up to 25 participants. All Messages sent are sent within the context of a conversation.

### conversations.create(payload, [callback])

[Create](https://developer.layer.com/docs/platform#create-a-conversation) a new Conversation by providing paylod. Payload should contain at least `participants` array. Optional properties are `metadata` object and `distinct` boolean.

##### Arguments

 - `payload` - Payload object
 - `callback(err, res)` - *Optional* Callback function returns an error and response objects

##### Examples

```javascript
layer.conversations.create({participants: ['abcd']}, function(err, res) {
  if (err) return console.error(err);

  // conversation ID
  var cid = res.body.id;
});
```

### conversations.createDedupe(uuid, payload, [callback])

Same as create conversation above but including [de-duplicating](https://developer.layer.com/docs/platform#de-duplicating-requests) UUID value.

---------------------------------------

### conversations.get(cid, callback)

[Retrieve](https://developer.layer.com/docs/platform#retrieve-a-conversation) an existing Conversation by providing conversation ID. Response `body` will result in conversation object representation.

##### Arguments

 - `cid` - Conversation ID
 - `callback(err, res)` - Callback function returns an error and response objects

##### Examples

```javascript
layer.conversations.get(cid, function(err, res) {
  if (err) return console.error(err);

  // conversation data
  var conversation = res.body;
});
```

---------------------------------------

### conversations.getFromUser(uid, cid, callback)

[Retrieve](https://developer.layer.com/docs/platform#retrieve-a-conversation) an existing Conversation by providing user ID and conversation ID. Response `body` will result in conversation object representation.

##### Arguments

 - `uid` - User ID
 - `cid` - Conversation ID
 - `callback(err, res)` - Callback function returns an error and response objects

##### Examples

```javascript
layer.conversations.getFromUser(uid, cid, function(err, res) {
  if (err) return console.error(err);

  // conversation data
  var conversation = res.body;
});
```

---------------------------------------

### conversations.getAllFromUser(uid, [params], callback)

[Retrieve](https://developer.layer.com/docs/platform#retrieve-a-conversation) all Conversations by providing user ID. Response `body` will result in an array of conversation objects.

##### Arguments

 - `uid` - User ID
 - `params` - *Optional* Query parameters can contain `page_size`, `from_id` and `sort_by`
 - `callback(err, res)` - Callback function returns an error and response objects

##### Examples

```javascript
var params = {
  page_size: 50,
  from_id: cid,
  sort_by: 'last_message' // `created_at` or `last_message`
};
layer.conversations.getAllFromUser(uid, params, function(err, res) {
  if (err) return console.error(err);

  // conversation data
  var conversation = res.body;
});
```

---------------------------------------

### conversations.setMetadataProperties(cid, properties, [callback])

[Set metadata](https://developer.layer.com/docs/platform#set-amp-delete-metadata) on an existing Conversation by providing conversation ID and `properties` object.

##### Arguments

 - `cid` - Conversation ID
 - `properties` - Metadata properties object
 - `callback(err, res)` - *Optional* Callback function returns an error and response objects

##### Examples

```javascript
var properties = {
  foo: 'bar'
};
layer.conversations.setMetadataProperties(cid, properties, function(err, res) {
  if (err) return console.error(err);
});
```

---------------------------------------

### conversations.deleteMetadataProperties(cid, properties, [callback])

[Delete metadata]((https://developer.layer.com/docs/platform#set-amp-delete-metadata) on an existing Conversation by providing conversation ID and `properties` object.

##### Arguments

 - `cid` - Conversation ID
 - `properties` - Properties object
 - `callback(err, res)` - *Optional* Callback function returns an error and response objects

---------------------------------------

### conversations.edit(cid, operations, [callback])

[Edit](https://developer.layer.com/docs/platform#edit-a-conversation) an existing Conversation by providing conversation ID and one or more `operations` as described by the [Layer Patch](https://github.com/layerhq/layer-patch) format.

##### Arguments

 - `cid` - Conversation ID
 - `operations` - Layer Patch operations array
 - `callback(err, res)` - *Optional* Callback function returns an error and response objects

---------------------------------------

### conversations.addParticipants(cid, participants, [callback])

[Add participants](https://developer.layer.com/docs/platform#editing-conversations) to an existing Conversation by providing conversation ID and array of `participants`.

##### Arguments

 - `cid` - Conversation ID
 - `participants` - Array of participants
 - `callback(err, res)` - *Optional* Callback function returns an error and response objects

##### Examples

```javascript
var participants = ['user1'];
layer.conversations.addParticipants(cid, participants, function(err, res) {
  if (err) return console.error(err);
});
```

---------------------------------------

### conversations.removeParticipants(cid, participants, [callback])

[Remove participants](https://developer.layer.com/docs/platform#editing-conversations) of an existing Conversation by providing conversation ID and array of `participants`.

##### Arguments

 - `cid` - Conversation ID
 - `participants` - Array of participants
 - `callback(err, res)` - *Optional* Callback function returns an error and response objects

---------------------------------------

### conversations.replaceParticipants(cid, participants, [callback])

[Replace all participants](https://developer.layer.com/docs/platform#editing-conversations) of an existing Conversation by providing conversation ID and array of `participants`.

##### Arguments

- `cid` - Conversation ID
- `participants` - Array of participants
- `callback(err, res)` - *Optional* Callback function returns an error and response objects

---------------------------------------

### conversations.delete(cid, [callback])

[Delete](https://developer.layer.com/docs/platform#delete-a-conversation) an existing Conversation by providing conversation ID.

##### Arguments

 - `cid` - Conversation ID
 - `callback(err, res)` - *Optional* Callback function returns an error and response objects

##### Examples

```javascript
layer.conversations.delete(cid, function(err, res) {
  if (err) return console.error(err);
});
```

----------------------------------------

### conversations.upload(cid, file, origin, [callback])

[Upload Rich content](https://developer.layer.com/docs/platform/messages#rich-content) for use as message part in existing Conversation by providing conversation ID.

##### Arguments

 - `cid` - Conversation ID
 - `file` - file resource (eg. `req.files` in Express.Js)
 - `origin` - current URL (usually `reg.headers.origin`)
 - `callback(err, res)` - *Optional* Callback function returns an error and response objects

##### Examples

```javascript
layer.conversations.upload(cid, req.files[0], req.headers.origin, function(err, res) {
  if (err) return console.error(err);

  var rich_content_part = res;
});
```


## Messages

Messages can be made up of one or many individual pieces of content.

 - Message `sender` can be specified by `user_id` or `name`, but **not** both.
 - Message `parts` are the atomic object in the Layer universe. They represent the individual pieces of content embedded within a message.
 - Message `notification` object represents [push notification](https://developer.layer.com/docs/platform#push-notifications) payload.

### messages.send(cid, payload, [callback])

[Send](https://developer.layer.com/docs/platform#send-a-message) a Message by providing conversation ID and payload.

##### Arguments

 - `cid` - Conversation ID
 - `payload` - Message payload containing `sender` and `parts` data
 - `callback(err, res)` - *Optional* Callback function returns an error and response objects

##### Examples

```javascript
var payload = {
  sender: {
    user_id: 'abcd'
  },
  parts: [
    {
      body: 'Hello, World!',
      mime_type: 'text/plain'
    }
  ]
};
layer.messages.send(cid, payload, function(err, res) {
  if (err) return console.error(err);

  // message ID
  var messageId = res.body.id;
});
```

---------------------------------------

### messages.sendDedupe(uuid, cid, payload, [callback])

Same as send a message above but including [de-duplicating](https://developer.layer.com/docs/platform#de-duplicating-requests) UUID value.

---------------------------------------

### messages.sendTextFromUser(cid, userId, text, [callback])

Shorthand method for sending a plain text Message by providing `userId` and `text`.

##### Arguments

 - `cid` - Conversation ID
 - `userId` - User ID of the participant that this message will appear to be from
 - `text` - Text or base64 encoded data for your message
 - `callback(err, res)` - *Optional* Callback function returns an error and response objects

---------------------------------------

### messages.sendTextFromName(cid, name, text, [callback])

Shorthand method for sending a plain text Message by providing `name` and `text`.

##### Arguments

 - `cid` - Conversation ID
 - `name` - Arbitrary string naming the service that this message will appear to be from
 - `text` - Text or base64 encoded data for your message
 - `callback(err, res)` - *Optional* Callback function returns an error and response objects

### messages.getAll(cid, [params], callback)

[Retrieve](https://developer.layer.com/docs/platform#retrieving-messages) all messages in a conversation by providing `cid`. Response `body` will result in array of messages.

##### Arguments

- `cid` - Conversation ID
- `params` - *Optional* Query parameters can contain `page_size`, `from_id` and `sort_by`
- `callback(err, res)` - Callback function returns an error and response objects

##### Examples

```javascript
var params = {
  page_size: 50,
  from_id: messageId,
  sort_by: 'last_message' // `created_at` or `last_message`
};
layer.messages.getAll(cid, params, function(err, res) {
  if (err) return console.error(err);

  var messages = res.body;
});
```

### messages.getAllFromUser(userId, cid, [params], callback)

Retrieve all messages in a conversation from a specific user by providing `userId` and `cid`. Response `body` will result in array of messages.

##### Arguments

- `userId` - User ID
- `cid` - Conversation ID
- `params` - *Optional* Query parameters can contain `page_size`, `from_id` and `sort_by`
- `callback(err, res)` - Callback function returns an error and response objects

### messages.getFromUser(userId, messageId, [callback])

Retrieve a single message in a conversation from a specific user by providing `userId` and `messageId`. Response `body` will result in a single message representation.

##### Arguments

- `userId` - User ID
- `messageId` - Message ID
- `callback(err, res)` - Callback function returns an error and response objects

## Announcements

Announcements are messages sent to all users of the application or to a list of users.

Payload property `recipients` can contain one or more user IDs or the literal string "everyone" in order to message the entire userbase.

### announcements.send(payload, [callback])

Send an [Announcement](https://developer.layer.com/docs/platform#send-an-announcement) by providing a payload.

##### Arguments

 - `payload` - Message payload containing `recipients`, `sender` and `parts` data
 - `callback(err, res)` - *Optional* Callback function returns an error and response objects

##### Examples

```javascript
var payload = {
  recipients: ['abcd', '12345'],
  sender: {
    name: 'The System'
  },
  parts: [
    {
      body: 'Hello, World!',
      mime_type: 'text/plain'
    }
  ]
};
layer.announcements.send(payload, function(err, res) {
  if (err) return console.error(err);

  // announcement data
  var announcement = res.body;
});
```

---------------------------------------

### announcements.sendDedupe(uuid, payload, [callback])

Same as send an announcement above but including [de-duplicating](https://developer.layer.com/docs/platform#de-duplicating-requests) UUID value.

## Block list

Layer Platform API allows you to manage a [block list](https://developer.layer.com/docs/platform#managing-user-block-lists) in order to align with your own application level blocking. A block list is maintained for each user, enabling users to manage a list of members they don't want to communicate with.

  - `ownerId` The owner of the block list
  - `userId` A user that is being blocked from communicating with the `ownerId`

### blocklist.get(ownerId, callback)

Retrieve an array of all blocked users for the specified owner.

##### Arguments

 - `ownerId` - The owner of the block list
 - `callback(err, res)` - Callback function returns an error and response objects

##### Examples

```javascript
layer.blocklist.get(ownerId, function(err, res) {
  if (err) return console.error(err);

  // block list array
  var blocklist = res.body;
});
```

---------------------------------------


### blocklist.block(ownerId, userId, [callback])

Add a new blocked user to the block list for the specified owner.

##### Arguments

 - `ownerId` - The owner of the block list
 - `userId` - A user that is being blocked by the owner
 - `callback(err, res)` - *Optional* Callback function returns an error and response objects

##### Examples

```javascript
layer.blocklist.block(ownerId, userId, function(err, res) {
  if (err) return console.error(err);

  // user blocked
});
```

---------------------------------------

### blocklist.unblock(ownerId, userId, [callback])

Remove a user from the block list for the specified owner.

##### Arguments

 - `ownerId` - The owner of the block list
 - `userId` - A user that is being blocked by the owner
 - `callback(err, res)` - *Optional* Callback function returns an error and response objects

##### Examples

```javascript
layer.blocklist.unblock(ownerId, userId, function(err, res) {
  if (err) return console.error(err);

  // user unblocked
});
```

---------------------------------------

## Identities

Layer Platform API allows you to manage  [Identities](https://developer.layer.com/docs/platform/misc#identity) in order to associate data about your users with the user.  Helpful for quickly rendering information about a user when showing a Message from them.

An Identity consists of the following properties:

  - `display_name`: **Required** Display name
  - `avatar_url`: *Optional* Avatar URL
  - `first_name`: *Optional* First name
  - `last_name`: *Optional* Last name
  - `phone_number`: *Optional* Phone number
  - `email_address`: *Optional* Email address
  - `public_key`: *Optional* Encryption key
  - `metadata`: *Optional* Hash of custom keys

### identities.create(userId, properties, [callback])

Creates an Identity on the Identities server.


##### Arguments

 - `userId` - User ID of the user we are creating
 - `properties` - Properties of the user to be created. (`display_name` is a required property)
 - `callback(err)` - *Optional* Callback function returns an error or status 201

##### Examples

```javascript
layer.identities.create('frodo', {
  display_name: 'Frodo the Dodo',
  first_name: 'Frodo',
  last_name: 'Baggins'
}, function(err, res) {
  if (err) return console.error(err);

  // Identity created
});
```

---------------------------------------

### identities.get(userId, callback)

Retrieves an Identity from the Identities server.

##### Arguments

 - `userId` - User ID of the user we are updating
 - `callback(err)` - Callback function returns an error or identity object

##### Examples

```javascript
layer.identities.get('frodo', function(err, res) {
  if (err) return console.error(err);

  // Identity retrieved:
  console.log('User: ' + res.body.display_name);
});
```

---------------------------------------

### identities.edit(userId, properties, [callback])

Updates an Identity on the Identities server.

##### Arguments

 - `userId` - User ID of the user we are updating
 - `properties` - Properties of the user that should be updated.
 - `callback(err)` - *Optional* Callback function returns an error or status 204

##### Examples

```javascript
layer.identities.edit('frodo', {
  first_name: 'Frodo 2'
}, function(err, res) {
  if (err) return console.error(err);

  // Identity updated
});
```

---------------------------------------

### identities.replace(userId, properties, [callback])

Replace all properties on Identity.

##### Arguments

 - `userId` - User ID of the user we are updating
 - `properties` - Properties of the user that should be updated. (`display_name` is a required property)
 - `callback(err)` - *Optional* Callback function returns an error or status 204

##### Examples

```javascript
layer.identities.replace('frodo', {
  display_name: 'Frodo the Dodo 3',
  first_name: 'Frodo 3'
}, function(err, res) {
  if (err) return console.error(err);

  // Identity updated
});
```

---------------------------------------

### identities.delete(userId, [callback])

Deletes an Identity from the Identities server.


##### Arguments

 - `userId` - User ID of the user we are deleting
 - `callback(err)` - *Optional* Callback function returns an error or status 204

##### Examples

```javascript
layer.identities.delete("frodo", function(err, res) {
  if (err) return console.error(err);

  // Identity deleted
});
```

---------------------------------------

## Promises

All the above functions can be used to return a [promise](https://www.promisejs.org/) by appending the `Async` suffix to the function name e.g.:

```javascript
conversations.createAsync({participants: ['abcd']}).then(function(res) {
  // conversation ID
  var cid = res.body.id;
}).catch(function(err) {
  console.error(err);
});
```

## Testing

The unit tests are based on the [mocha](https://github.com/mochajs/mocha) module, which may be installed via npm. To run the tests make sure that the npm dependencies are installed by running `npm install` from the project directory.

    npm test

## Contributing

Layer API is an Open Source project maintained by Layer. Feedback and contributions are always welcome and the maintainers try to process patches as quickly as possible. Feel free to open up a Pull Request or Issue on Github.

## Changelog

For a list of version changes please refer to [Github releases](https://github.com/layerhq/node-layer-api/releases) page.

## Author

[Nil Gradisnik](https://github.com/nilgradisnik)
