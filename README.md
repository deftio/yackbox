# XLiteChat
XLiteChat is a simple vanilla (no dependancy) JavaScript chat control that can be easily integrated into web applications. It provides a customizable chat interface with support for adding, updating, and removing messages.

## Features
Add messages with customizable user and alignment options.
Update existing messages with new content.
Remove messages from the chat interface.
Retrieve the chat log.
Callback function for message events.
Responsive design for various screen sizes.
Installation
To use XLite Chat in your project, follow these steps:

Include the yackbox.js JavaScript file in your project.
Link the yackbox.css stylesheet to style the chat interface.
html

```html
<script src="yackbox.js"></script>
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

### Usage
XLite Chat is highly customizable and can be integrated into various web applications. You can modify the appearance and behavior of the chat interface by adjusting the CSS styles and JavaScript code according to your requirements.

## Contributors

# License
XLite Chat is licensed under the MIT License.

