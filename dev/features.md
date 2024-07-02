# yackbox.js

# yackbox.js is a pure js chat control
Useful for:
chat apps
monitoring / debugging chat  and llm apps
used as a log viewer (hide entry area)

## workflow

## stand alone js
can be used in any "div", is responsive



## multi user
Supports multiple users participating
user management 

## multi instance
Can have multiple instance running in same page

## message control
addMeessage, removeMessage, appendMessage (useful for streaming), replaceMessage (useful for edit)

## history
provides detailed message history buf
getAllMessages
getLastNMessages
Filter messages 
? add view where only messages passing a specific filter are viewed.
    ? add class view / not view to each message in div
    ? filter is iterable f over messages.
        ? provide examples like regex on content
SetViewOn/Off (array of message IDs[])

exportAllMessagesAs() // json, jsonl, csv

## persistence / session load/save
sessionSave()    // save the full session (includes messages + users + stats)
sessionLoad()    // reload the full session (includes messages + users + stats)
## style control
left / center / right user alignment
show / hide message entry area (useful for just using as debugging tool where you don't need entry)

TODO: add a (hideable) title area


## stats message


# Building
npm install  etc
rollup, terser, etc

Note while rollup and other tools are used for bundling / packaging yackbox doesn't have any dependacies.

## 

config {
    styles : {
        title
        messageContainer
        message
        entryContainer
        textEntry
        submitBtn
    }
    features : {
        onSubmitCallback : fn (text, this)
        onMessageCallback : fn (text, this)
    }
}
chat = new yackbox({DOMEl, config})
chat.addMessageRaw ({userString, content, alignment}) : msgID   # pure HTML inputs

chat.updateMessage ({messageID, messageContent }) 
chat.addMessage ({userID, messageContent})

chat.showTimestamps (true/false)
chat.userAdd({displayName,  metadata, role, displayHTML, cssClass }) : id
chat.userGet(id) : {displayName,  metadata, role, displayHTML, cssClass }
chat.userUpdate (userID, {}) : {result success|fail}
chat.userRemove (userID) : {result success|fail, msg []}
chat.userList() : [{userID, role, cssClass}]

chat.getMessageHistoryRange(n,m) # messages only
chat.getMessageHistoryFull() # messages only (copy)
chat.getFullLog()  # includes system messages such as "user X entered the chat"