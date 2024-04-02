# misc notes

## ToDo

### support for "center" user
       <username>
  "user content is centered"

This is useful in refereed or adversarial chats like a courtroom or moderator.

make css for left / right / center classes clear for devs to style

### hide / show chat input area
Needs to be able to hide / show chat area

### get rid of css file 
the css should be inline with the api as js params.

### add listeners
add event lister subscriber:
```javascript
id = chat.addNewMsgListener(fn, newMsgOnly | msgUpdates)  //adds event listener
chat.removeListener(id)  //removes an event listener.  ?tbd: accept function as param?

### provide callback wit history
many chat apps need history of the conversation to be able to generate a response

```
### streaming message
make flag for "last" message received.  (also used for firing message listener events.)

### user mgmt

add / remove users from the chat, get stats on users, get message by users

addInfo ({})

## stats()
* total messages
* total users
* total chars written
* descStats : { min / max / avg chars per message}
* chatCreated time
* first message time
* last message (update) time

-- per user stats
* message stats per user
* total messages written by a single user.
* first message by user
* last message (update) by user




## Notes on completion and streaming callbacks

We can memoize this to make a single callback ..

let addmsg= this.addMessage.bind(this);
let appndmsg = this.appendMessage.bind(this);

# memoize callback to include both completion and append.

e.g.
fn = (content,userid,alignment) {
    if first_time:
     id = addmsg(content, user, alignment)
    else
        appendmsg (id, content)
}
```javascript
function createCombinedMessageCallback() {
  let messageId = null;

  return  function fn(content, userid, alignment) {
    if (messageId == null) {
      // This is the first call
      firstTime = false; // Update the flag so subsequent calls know it's no longer the first time
      messageId =  addmsg(content, userid, alignment); // Assuming addmsg returns an ID
      return messageId; // Return whatever addmsg returns (e.g., a message ID)
    } else {
      // Not the first call, use appendmsg
      return appendmsg(messageId, content);
    }
  };
}

// Usage:
const fn = createCombinedMessageCallback(); 
```