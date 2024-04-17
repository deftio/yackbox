export default class yackbox {
    /**
    *
    @param {(string|HTMLElement)} div - A string representing the CSS selector of the container element, or an HTMLElement object representing the container element itself.
    @param {Function} completionCallback - A callback function that will be invoked when the user submits a message. This function will receive an object containing the user's message and username, and two callback functions: one for adding a new message to the chat, and another for appending content to an existing message.
    @param {Function} streamCallback - A callback function that will be invoked when a streaming message is received. This function will receive an object containing the message content and the ID of the message to update.
    */
    constructor(div, completionCallback, streamCallback) {
        this.container = (typeof (div) == "string") ? document.querySelector(div) : (div instanceof HTMLElement) ? div : null;
        if (!this.container) {
            console.error("Invalid container element for yackbox, creating a new element.");
            this.container = document.createElement('div');
        }
        // title
        this.title = "Chat";
        this.titleAlignment = "center";

        // user add
        this.userName = "You";
        this.userAlignment = "left";

        // callback functions
        this.completionCallback = (completionCallback) ? completionCallback : () => { };
        this.streamCallback = (streamCallback) ? streamCallback : () => { };

        // history
        this.messages = [];
        this.echo = true; // echo user input
        this.users = {}
        // this.users = {}
        this.initUI();
    }
    /**
    *
    @param {Function} completionCallback - A callback function that will be invoked when the user submits a message. This function will receive an object containing the user's message and username, and two callback functions: one for adding a new message to the chat, and another for appending content to an existing message.
    */
    addCompletionCallback(completionCallback) {
        this.completionCallback = (completionCallback) ? completionCallback : () => { };
    }
    /**
    *
    @param {Function} streamCallback - A callback function that will be invoked when a streaming message is received. This function will receive an object containing the message content and the ID of the message to update.
    */
    addStreamCallback(streamCallback) {
        this.streamCallback = (streamCallback) ? streamCallback : () => { };
    }
    /**
    Adds a message from the current user to the chat.
    @param {string} content - The content of the message.
    */
    addUserMessage(content) {
        this.addMessage(content, this.userName, this.userAlignment);
    }
    /**
    Sets the default username and alignment for user messages.
    @param {string} user - The username to use for user messages. Defaults to "You".
    @param {string} alignment - The alignment of user messages. Can be "left", "right", or "center". Defaults to "right".
    */
    setDefaultUserName(user = "You", alignment = "right") {
        this.userName = user;
        this.userAlignement = alignment;
    }
    /**
    Sets whether or not to echo the user's input back to the chat.
    @param {boolean} echo - True to echo the user's input, false otherwise.
    @returns {boolean} The current echo setting.
    */
    setUserInputEcho(echo) {
        this.echo = (echo) ? true : false;
        return this.echo;
    }

    /**
     * Adjusts the height of the messages area to fit the chat widget.
     * This method should be called whenever the chat widget is resized.
     */
    adjustMessagesAreaHeight() {
        const chatWidget = this.container;
        const hiddenElements = [...chatWidget.children].filter(child => child.classList.contains('hidden'));
        const totalHiddenHeight = hiddenElements.reduce((sum, child) => sum + child.offsetHeight, 0);
        const containerHeight = chatWidget.offsetHeight;
        this.messagesContainer.style.height = `calc(100% - ${containerHeight - totalHiddenHeight}px)`;
    }
  
    handleContainerResize() {
        adjustMessagesAreaHeight();
        adjustSendButtonWidth();
    }

    adjustSendButtonWidth() {
        const submitButtonText = this.submitButton.textContent.trim();
        const fontSize = parseFloat(getComputedStyle(this.submitButton).fontSize);
        const minWidth = fontSize * submitButtonText.length + 16; // Adjust the multiplier as needed
        this.submitButton.style.minWidth = `${minWidth}px`;
    }




    /**
    Shows or hides the input area of the chat.
    @param {boolean} show - True to show the input area, false to hide it.
    */
    showInputArea(show) {
        if (show) {
            this.inputAreaBox.style.display = "flex";
            this.inputAreaBox.classList.remove('hidden');
        }
        else {
            this.inputAreaBox.style.display = "none";
            this.inputAreaBox.classList.add('hidden');
        }
        this.adjustMessagesAreaHeight();
    }

    showTitleArea(show) {
        if (show) {
            this.titleArea.style.display = "flex";
            this.titleArea.classList.remove('hidden');
        }
        else {
            this.titleArea.style.display = "none";
            this.titleArea.classList.add('hidden');
        }
        this.adjustMessagesAreaHeight();
    }

    /**
    Adds a new message to the chat.
    @param {string} content - The content of the message.
    @param {string} user - The username of the sender.
    @param {string} alignment - The alignment of the message. Can be "left", "right", or "center". Defaults to "left".
    @returns {number} The ID of the newly added message.
    */
    // add a new message to the chat
    addMessage(content, user, alignment = 'left') {
        const id = this.messages.length;
        const timestamp = (new Date()).toUTCString();
        const message = { id, user, content, alignment, timestamp };
        this.messages.push(message);
        const lcr = (alignment == "left") ? "yackbox-left" : (alignment == "right") ? "yackbox-right" : "yackbox-center";
        const userContent = `<div class="yackbox-username ${lcr}">${user}</div>`;
        const messageContent = `<div class="yackbox-content ${lcr}">${content}</div>`;
        const messageHTML = `<div id="yackbox-msg-${id}" class="yackbox-message ${lcr}">${userContent}${messageContent}</div>`;
        this.messagesContainer.innerHTML += messageHTML;
        this.messagesContainer.lastChild.scrollIntoView()
        return id;
    }
    /**
    Updates all the fields of an existing message.
    @param {number} id - The ID of the message to update.
    @param {string} content - The new content of the message.
    @param {string} user - The new username of the sender.
    @param {string} side - The new alignment of the message. Can be "left", "right", or "center".
    @returns {number} The ID of the updated message, or undefined if the message was not found.
    */
    // update all the fields of an existing message
    updateMessageFull(id, content, user = null, side = null) {
        const message = this.messages.find(msg => msg.id === id);
        if (!message) return;
        if (content) message.content = content;
        if (user) message.user = user;
        if (side) message.whichSide = side;
        message.lastUpdateTimestamp = (new Date()).toUTCString();
        const messageDiv = this.container.querySelector("#msg - ${id}");
        if (messageDiv) {
            const userContent = `<div class="yackbox-username">${message.user}</div>`;
            const messageContent = `<div class="yackbox-content">${message.content}</div>`;
            messageDiv.innerHTML = `${messageContent}${userContent}`;
        }
        return id;
    }
    /**
    Appends content to an existing message, useful for streaming.
    @param {number} id - The ID of the message to update.
    @param {string} content - The content to append to the message.
    @returns {number} The ID of the updated message, or undefined if the message was not found.
    */
    // append content to an existing message, useful for streaming
    appendMessageContent(id, content) {
        const message = this.messages.find(msg => msg.id === id);
        if (!message) return;
        if (content)
            message.content += content;
        message.lastUpdateTimestamp = (new Date()).toUTCString();
        const messageDiv = this.container.querySelector(`#yackbox-msg-${id} .yackbox-content`);
        if (messageDiv) {
            messageDiv.innerHTML = message.content;
            messageDiv.scrollIntoView(false);
        }
        return id;
    }
    /**
    Removes a single message.
    @param {number} id - The ID of the message to remove.
    @returns {boolean} True if the message was removed, false otherwise.
    */
    // remove a single message
    removeMessage(id) {
        const messageIndex = this.messages.findIndex(msg => msg.id === id);
        if (messageIndex > -1) {
            this.messages.splice(messageIndex, 1);
            const messageDiv = this.container.querySelector(".yackbox-msg${id}");
            if (messageDiv) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
            return true;
        }
        return false; // didn't do anything
    }
    /**
    Removes all messages from the chat.
    */
    //remove all messages
    removeMessageAll() {
        this.messages = [];
    }
    /**
    Initializes the UI elements of the chat.
    */
    initUI() {
        this.container.innerHTML = 
        `<div class="yackbox-base yackbox-theme-light"> 
            <div class="yackbox-title-area"></div>
            <div class="yackbox-messages-area"></div> 
            <div class="yackbox-input-area"> 
                <textarea class="yackbox-input-textbox" placeholder="Type here..."></textarea> 
                <button class="yackbox-input-send-btn">Send</button>
            </div>
        </div>`;

        // in-line styles : Note these settings are just for making the basic plumbing work and 
        // are not part of styling the chatbox.  The chatbox is styled using the yackbox.css file
        /*
        this.baseStyles = {
            "yackbox-base": {
                "display": "flex",
                "flex-direction": "column",
                "height": "100%",
                "width": "100%",
                "min-width": "200px",
                "min-height": "200px",
            },
            "yackbox-title-area": {
                "width": "100%",
                "padding-left": "8px",
                "padding-right": "8px",
            },

            "yackbox-messages-area": {
                "flex-grow": "1",
                "padding": "8px",
                "overflow-y": "auto",
                "width": "100%",
            },

            "yackbox-message": {
                "padding": "2px"
            },

            "yackbox-input-area": {
                "display": "flex",
                "align-items": "center",
                "padding": "8px",
                "min-height": "56px",
                "height": "4em",
                "width": "100%"
            },
            "yackbox-input-textbox": {
                "flex-grow": "1",
                "min-height": "40px",
                "resize": "none",
                "padding": "8px"
            },
            "yackbox-input-send-btn": {
                "margin-left": "8px",
                "padding": "8px 12px",
                "height": "100%",
                "cursor": "pointer",
                "white-space": "nowrap"
            }
        }
        */
        let setStyles = (el, styles) => {
            for (let s in styles) {
                el.style[s] = styles[s];
            }
        }
        this.yackboxContainer = this.container.querySelector('.yackbox-base');
        this.titleArea = this.container.querySelector('.yackbox-title-area');
        this.titleArea.innerHTML = "<h3>" +this.title+"</h3>";
       
        //setStyles (this.titleArea, this.baseStyles["yackbox-title-area"]);

        this.messagesContainer = this.container.querySelector('.yackbox-messages-area');
        //setStyles(this.messagesContainer, this.baseStyles["yackbox-messages-area"]);

        this.messagesContainer.scrollIntoView(false);
        this.inputAreaBox = this.container.querySelector('.yackbox-input-area');
        //setStyles(this.inputAreaBox, this.baseStyles["yackbox-input-area"]);

        this.inputTextArea = this.container.querySelector('.yackbox-input-textbox');
        //setStyles(this.inputTextArea, this.baseStyles["yackbox-input-textbox"]);

        this.submitButton = this.container.querySelector('.yackbox-input-send-btn');
        //setStyles(this.submitButton, this.baseStyles["yackbox-input-send-btn"]);

        // now we add the base styles for the chat container and sub elements
        // set base styles for the chat container.  NOTE this is done in js so that we can have 
        // multiple instances of the chatbox on the same page with different styles
        // see yaclbox.css for the default styles



        //===================================================================================
        // Add event listener to the chat input textarea
        const inputTextarea = this.inputTextArea;
        // memoize callback fn
        let admsg = this.addMessage.bind(this);
        let apndmsg = this.appendMessageContent.bind(this);
        var addMsgCB = function (c, u, a) { return admsg(c, u, a) };
        var apndMsgCB = function (id, c) { return apndmsg(id, c) }
        let handleUserSubmit = () => {
            // Submit the message
            const content = inputTextarea.value.trim(); // Remove leading/trailing whitespace
            if (content !== '') {
                // if echo, write the user's content to the chat area
                const user = this.userName;
                if (this.echo)
                    this.addMessage(content, user, this.userAlignment);
                inputTextarea.value = ''; // Clear input field after sending
                // Call the bot response completionCallback function, passing the user's input
                this.completionCallback({ content, user }, addMsgCB, apndMsgCB);
            }
        }
        inputTextarea.addEventListener('keydown', (event) => {
            // Check if Shift + Enter is pressed
            if (event.shiftKey && event.keyCode === 13) {
                // Prevent default behavior (adding new line)
                event.preventDefault();
                handleUserSubmit();
            }
        });
        this.submitButton.addEventListener('click', () => { handleUserSubmit() });

        this.container.addEventListener('resize', ()=> {handleContainerResize()});
        this.adjustMessagesAreaHeight();
        this.adjustSendButtonWidth();
        this.showTitleArea(false);
    }
    /**
    Returns a portion of the message history.
    @param {number} n - The starting index of the messages to retrieve. If negative, it will be counted from the end of the message history.
    @param {number} m - Optional. The ending index of the messages to retrieve. If omitted, only the message at index n will be returned.
    @returns {Array} An array of message objects, or an empty array if there are no messages or the indices are invalid.
    */
    getMessageHistory(n, m) {
        if (this.messages.length <= 0)
            return [];
        if (typeof (n) != "number")
            return [];
        if (typeof (m) == "number") {
            if (n < m)
                return this.messages.slice(n, m);
            else
                return this.messages.slice(m, n);
        }
        else {
            if (n < 0)
                n = this.messages.length + n;
            return [this.messages[n]]
        }
    }
    /**
    Returns statistics about the chat messages.
    @returns {Object} An object containing the following statistics:
    numMessages: The total number of messages in the chat.
    numUsers: The number of unique users who have sent messages.
    firstMsgTimestamp: The timestamp of the first message in the chat.
    lastMsgTimestamp: The timestamp of the last message in the chat.
    */
    getMessageStats() {
        let stats = {
            "numMessages": this.messages.length,
            // "numUsers": this.users.keys().length,
            "firstMsgTimestamp": this.messages.length > 0 ? this.messages[0].timestamp : "",
            "lastMsgTimestamp": this.messages.length > 0 ? this.messages[this.messages.length - 1].timestamp : "",
        }
        return stats;
    }
}