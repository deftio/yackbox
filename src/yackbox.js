export default class yackbox {
    constructor(div, completionCallback, streamCallback) {

        this.container = (typeof(div) == "string") ? document.querySelector(div) : (div instanceof HTMLElement) ? div : null;
        if (!this.container) {
            console.error("Invalid container element for yackbox, creating a new one.");
            this.container = document.createElement('div');
        }
        this.userName = "You";
        this.userAlignment = "left";
        this.completionCallback = (completionCallback) ? completionCallback : () => {};
        this.streamCallback = (streamCallback) ? streamCallback : () => {};
        this.messages = [];
        this.echo = true; // echo user input
        this.users = {}
       // this.users = {}
        this.initUI();
    }

    addCompletionCallback (completionCallback) {
        this.completionCallback = (completionCallback) ? completionCallback : () => {};
    }
    addStreamCallback (streamCallback) {
        this.streamCallback = (streamCallback) ? streamCallback : () => {};
    }
    
    addUserMessage(content) {
        this.addMessage(content, this.userName, this.userAlignment);
    }
    setDefaultUserName(user = "You", alignment = "right") {
        this.userName = user;
        this.userAlignement = alignment;
    }
    setUserInputEcho(echo) {
        this.echo = (echo) ? true: false;
        return this.echo;
    }
    showInputArea(show) {
        if (show) {
            this.inputAreaBox.style.display = "";
             this.messagesContainer.style.height = "88%;"
        }
        else {
            this.inputAreaBox.style.display = "none";
            this.messagesContainer.style.height = "98%"
        }
    }
    
    // add a new message to the chat
    addMessage(content, user, alignment = 'left') {
        const id = this.messages.length;
        const timestamp  = (new Date()).toUTCString();
        const message = { id, user, content, alignment , timestamp};
        this.messages.push(message);
        const lcr = (alignment == "left" )? "yackbox-left" : (alignment == "right")? "yackbox-right" :  "yackbox-center";
        const userContent = `<div class="yackbox-username ${lcr}">${user}</div>`;
        const messageContent = `<div class="yackbox-content ${lcr}">${content}</div>`;
        const messageHTML = 
            `<div id="yackbox-msg${id}" class="yackbox-message ${lcr}">${userContent}${messageContent}</div>` ;

        
        this.messagesContainer.innerHTML += messageHTML;
        this.messagesContainer.lastChild.scrollIntoView()
        return id;
    }
    // update all the fields of an existing message
    updateMessageFull(id, content, user = null, side = null) {
        const message = this.messages.find(msg => msg.id === id);
        if (!message) return;
        if (content) message.content = content;
        if (user) message.user = user;
        if (side) message.whichSide = side;
        message.lastUpdateTimestamp = (new Date()).toUTCString();
        const messageDiv = this.container.querySelector(`#msg-${id}`);
        if (messageDiv) {
            const userContent = `<div class="yackbox-username">${message.user}</div>`;
            const messageContent = `<div class="yackbox-content">${message.content}</div>`;
            messageDiv.innerHTML = 
                `${messageContent}${userContent}`;
        }
        return id;
    }
    
    // append content to an existing message, useful for streaming
    appendMessageContent(id, content) {
        const message = this.messages.find(msg => msg.id === id);
        if (!message) return;

        if (content) 
            message.content += content;
        
        message.lastUpdateTimestamp = (new Date()).toUTCString();

        const messageDiv = this.container.querySelector(`#yackbox-msg${id} .yackbox-content`);
        if (messageDiv) {
            messageDiv.innerHTML = message.content;
            messageDiv.scrollIntoView(false);

        }
        return id;
    }

    // remove a single message
    removeMessage(id) {
        const messageIndex = this.messages.findIndex(msg => msg.id === id);
        if (messageIndex > -1) {
            this.messages.splice(messageIndex, 1);
            const messageDiv = this.container.querySelector(`.yackbox-msg${id}`);
            if (messageDiv) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
            return true;
        }
        return false; // didn't do anything
    }

    //remove all messages
    removeMessageAll() {
        this.messages=[]; 
    }
    initUI() {
        this.container.innerHTML = `
            <div class="yackbox-container">
                <div class="yackbox-messages"></div>
                <div class="yackbox-input-area">
                    <textarea class="yackbox-input-textbox" placeholder="Type here..."></textarea>
                    <div class="yackbox-sep"></div>
                    <button class="yackbox-submit">Send</button>
                </div>
            </div>
        `;

        this.messagesContainer = this.container.querySelector('.yackbox-messages');
        this.messagesContainer.scrollIntoView(false);

        this.inputAreaBox = this.container.querySelector('.yackbox-input-area');
        this.inputTextArea = this.container.querySelector('.yackbox-input-textbox');
        this.submitButton = this.container.querySelector('.yackbox-submit');

        // Add event listener to the chat input textarea
        const inputTextarea = this.inputTextArea;

        // memoize callback fn
        let admsg   = this.addMessage.bind(this);
        let apndmsg = this.appendMessageContent.bind(this);
        var addMsgCB  = function (c,u,a){return admsg(c,u,a)};
        var apndMsgCB = function (id,c){return apndmsg(id,c)}

        let handleUserSubmit= () => {
            // Submit the message
            const content = inputTextarea.value.trim(); // Remove leading/trailing whitespace
            if (content !== '') {
                // if echo, write the user's content to the chat area
                const user = this.userName;
                if (this.echo)
                    this.addMessage(content, user, this.userAlignment); 
                inputTextarea.value = ''; // Clear input field after sending

                // Call the bot response completionCallback function, passing the user's input
                this.completionCallback({content,user}, addMsgCB, apndMsgCB);
        }}
        inputTextarea.addEventListener('keydown',  (event) => {
            // Check if Shift + Enter is pressed
            if (event.shiftKey && event.keyCode === 13) {
                // Prevent default behavior (adding new line)
                event.preventDefault();
                handleUserSubmit();
            }
        });

        this.submitButton.addEventListener('click',  () => {handleUserSubmit() });
    }
    getMessageHistory(n,m) {
        if (this.messages.length <=0)
            return [];

        if (typeof(n) != "number")
            return [];

        if (typeof(m) == "number" ) {
            if (n < m)
                return this.messages.slice(n,m);
            else
                return this.messages.slice(m,n);
        }
        else {
            if (n<0)
                n = this.messages.length+n;
            return [this.messages[n]]
        }
    }
    getMessageStats() {
        let stats = {
            "numMessages" : this.messages.length,
            "numUsers" : this.user.keys().length,
            "firstMsgTimestamp" : this.messages.length >0 ? this.messages[0].timestamp : "",
            "lastMsgTimestamp"  : this.messages.length >0 ? this.messages[this.messages.length-1].timestamp : "",

        }
        
        return stats;
    }
}
