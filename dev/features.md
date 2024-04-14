# yackbox.js

# yackbox.js is a pure js chat control
Useful for:
chat apps
monitoring / debugging chat  and llm apps
used as a log viewer (hide entry area)

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
