# misc notes



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