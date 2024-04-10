# yackbox.js 
yackbox is a simple vanilla (no dependancies) JavaScript chat control that can be easily integrated into web applications. It provides a customizable chat interface with support for adding, updating, and removing messages, along with multi-user support and message history controls.

## Features
Add messages with customizable user and alignment options.
Update existing messages with new content.
Remove messages from the chat interface.
Retrieve the chat log.  Log contains timestamps for all messages.
Callback function for message events.
Responsive design for various screen sizes.

## Installation
To use yackbox in your project, follow these steps:

Include the yackbox.js JavaScript file in your project.
Link the yackbox.css stylesheet to style the chat interface.
html

```html
<script src="./path/to/yackbox.js"></script>
<link rel="stylesheet" href="yackbox.css">
```

Create a container element in your HTML where you want the chat interface to appear:
```html
<div id="chat-container"></div>
```

Initialize XLite Chat in your JavaScript code by providing the container element and a callback function for message events:
```javascript
const chat = new yackbox('#chat-container', messageCallback);
//Use the provided methods to interact with the chat control:

// Add a message
chat.addMessage('Hello!', 'User', 'left');  // user should appear left or right justified

// Update a message
chat.updateMessage(1, 'New content');

// Remove a message
chat.removeMessage(1);

// Get the chat log
const log = chat.getLog();
console.log(log);
```

## Usage
Yackbox is highly customizable and can be integrated into various web applications. You can modify the appearance and behavior of the chat interface by adjusting the CSS styles and JavaScript code according to your requirements.


## Examples
Included are several examples including:
* UMD and ESM usage in browser
* Multiuser and multiple instance setups
* Using message history and stats
* Streaming and completions based LLM use

## Building from Source
Make sure to run npm install.  Then run npm run build.
Note that at run time yackbox has no dependancies, but at build time several tools are used for packing and minifying code.

## Contributors

## License
yackbox is licensed under the BSD-2 License.

