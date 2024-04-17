(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.yackbox = factory());
})(this, (function () { 'use strict';

  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r || "default");
      if ("object" != typeof i) return i;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r ? String : Number)(t);
  }
  function _toPropertyKey(t) {
    var i = _toPrimitive(t, "string");
    return "symbol" == typeof i ? i : i + "";
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var yackbox = /*#__PURE__*/function () {
    /**
    *
    @param {(string|HTMLElement)} div - A string representing the CSS selector of the container element, or an HTMLElement object representing the container element itself.
    @param {Function} completionCallback - A callback function that will be invoked when the user submits a message. This function will receive an object containing the user's message and username, and two callback functions: one for adding a new message to the chat, and another for appending content to an existing message.
    @param {Function} streamCallback - A callback function that will be invoked when a streaming message is received. This function will receive an object containing the message content and the ID of the message to update.
    */
    function yackbox(div, completionCallback, streamCallback) {
      _classCallCheck(this, yackbox);
      this.container = typeof div == "string" ? document.querySelector(div) : div instanceof HTMLElement ? div : null;
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
      this.completionCallback = completionCallback ? completionCallback : function () {};
      this.streamCallback = streamCallback ? streamCallback : function () {};

      // history
      this.messages = [];
      this.echo = true; // echo user input
      this.users = {};
      // this.users = {}
      this.initUI();
    }
    /**
    *
    @param {Function} completionCallback - A callback function that will be invoked when the user submits a message. This function will receive an object containing the user's message and username, and two callback functions: one for adding a new message to the chat, and another for appending content to an existing message.
    */
    return _createClass(yackbox, [{
      key: "addCompletionCallback",
      value: function addCompletionCallback(completionCallback) {
        this.completionCallback = completionCallback ? completionCallback : function () {};
      }
      /**
      *
      @param {Function} streamCallback - A callback function that will be invoked when a streaming message is received. This function will receive an object containing the message content and the ID of the message to update.
      */
    }, {
      key: "addStreamCallback",
      value: function addStreamCallback(streamCallback) {
        this.streamCallback = streamCallback ? streamCallback : function () {};
      }
      /**
      Adds a message from the current user to the chat.
      @param {string} content - The content of the message.
      */
    }, {
      key: "addUserMessage",
      value: function addUserMessage(content) {
        this.addMessage(content, this.userName, this.userAlignment);
      }
      /**
      Sets the default username and alignment for user messages.
      @param {string} user - The username to use for user messages. Defaults to "You".
      @param {string} alignment - The alignment of user messages. Can be "left", "right", or "center". Defaults to "right".
      */
    }, {
      key: "setDefaultUserName",
      value: function setDefaultUserName() {
        var user = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "You";
        var alignment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "right";
        this.userName = user;
        this.userAlignement = alignment;
      }
      /**
      Sets whether or not to echo the user's input back to the chat.
      @param {boolean} echo - True to echo the user's input, false otherwise.
      @returns {boolean} The current echo setting.
      */
    }, {
      key: "setUserInputEcho",
      value: function setUserInputEcho(echo) {
        this.echo = echo ? true : false;
        return this.echo;
      }

      /**
       * Adjusts the height of the messages area to fit the chat widget.
       * This method should be called whenever the chat widget is resized.
       */
    }, {
      key: "adjustMessagesAreaHeight",
      value: function adjustMessagesAreaHeight() {
        var chatWidget = this.container;
        var hiddenElements = _toConsumableArray(chatWidget.children).filter(function (child) {
          return child.classList.contains('hidden');
        });
        var totalHiddenHeight = hiddenElements.reduce(function (sum, child) {
          return sum + child.offsetHeight;
        }, 0);
        var containerHeight = chatWidget.offsetHeight;
        this.messagesContainer.style.height = "calc(100% - ".concat(containerHeight - totalHiddenHeight, "px)");
      }
    }, {
      key: "handleContainerResize",
      value: function handleContainerResize() {
        adjustMessagesAreaHeight();
        adjustSendButtonWidth();
      }
    }, {
      key: "adjustSendButtonWidth",
      value: function adjustSendButtonWidth() {
        var submitButtonText = this.submitButton.textContent.trim();
        var fontSize = parseFloat(getComputedStyle(this.submitButton).fontSize);
        var minWidth = fontSize * submitButtonText.length + 16; // Adjust the multiplier as needed
        this.submitButton.style.minWidth = "".concat(minWidth, "px");
      }

      /**
      Shows or hides the input area of the chat.
      @param {boolean} show - True to show the input area, false to hide it.
      */
    }, {
      key: "showInputArea",
      value: function showInputArea(show) {
        if (show) {
          this.inputAreaBox.style.display = "flex";
          this.inputAreaBox.classList.remove('hidden');
        } else {
          this.inputAreaBox.style.display = "none";
          this.inputAreaBox.classList.add('hidden');
        }
        this.adjustMessagesAreaHeight();
      }
    }, {
      key: "showTitleArea",
      value: function showTitleArea(show) {
        if (show) {
          this.titleArea.style.display = "flex";
          this.titleArea.classList.remove('hidden');
        } else {
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
    }, {
      key: "addMessage",
      value: function addMessage(content, user) {
        var alignment = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'left';
        var id = this.messages.length;
        var timestamp = new Date().toUTCString();
        var message = {
          id: id,
          user: user,
          content: content,
          alignment: alignment,
          timestamp: timestamp
        };
        this.messages.push(message);
        var lcr = alignment == "left" ? "yackbox-left" : alignment == "right" ? "yackbox-right" : "yackbox-center";
        var userContent = "<div class=\"yackbox-username ".concat(lcr, "\">").concat(user, "</div>");
        var messageContent = "<div class=\"yackbox-content ".concat(lcr, "\">").concat(content, "</div>");
        var messageHTML = "<div id=\"yackbox-msg-".concat(id, "\" class=\"yackbox-message ").concat(lcr, "\">").concat(userContent).concat(messageContent, "</div>");
        this.messagesContainer.innerHTML += messageHTML;
        this.messagesContainer.lastChild.scrollIntoView();
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
    }, {
      key: "updateMessageFull",
      value: function updateMessageFull(id, content) {
        var user = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
        var side = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
        var message = this.messages.find(function (msg) {
          return msg.id === id;
        });
        if (!message) return;
        if (content) message.content = content;
        if (user) message.user = user;
        if (side) message.whichSide = side;
        message.lastUpdateTimestamp = new Date().toUTCString();
        var messageDiv = this.container.querySelector("#msg - ${id}");
        if (messageDiv) {
          var userContent = "<div class=\"yackbox-username\">".concat(message.user, "</div>");
          var messageContent = "<div class=\"yackbox-content\">".concat(message.content, "</div>");
          messageDiv.innerHTML = "".concat(messageContent).concat(userContent);
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
    }, {
      key: "appendMessageContent",
      value: function appendMessageContent(id, content) {
        var message = this.messages.find(function (msg) {
          return msg.id === id;
        });
        if (!message) return;
        if (content) message.content += content;
        message.lastUpdateTimestamp = new Date().toUTCString();
        var messageDiv = this.container.querySelector("#yackbox-msg-".concat(id, " .yackbox-content"));
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
    }, {
      key: "removeMessage",
      value: function removeMessage(id) {
        var messageIndex = this.messages.findIndex(function (msg) {
          return msg.id === id;
        });
        if (messageIndex > -1) {
          this.messages.splice(messageIndex, 1);
          var messageDiv = this.container.querySelector(".yackbox-msg${id}");
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
    }, {
      key: "removeMessageAll",
      value: function removeMessageAll() {
        this.messages = [];
      }
      /**
      Initializes the UI elements of the chat.
      */
    }, {
      key: "initUI",
      value: function initUI() {
        var _this = this;
        this.container.innerHTML = "<div class=\"yackbox-base yackbox-theme-light\"> \n            <div class=\"yackbox-title-area\"></div>\n            <div class=\"yackbox-messages-area\"></div> \n            <div class=\"yackbox-input-area\"> \n                <textarea class=\"yackbox-input-textbox\" placeholder=\"Type here...\"></textarea> \n                <button class=\"yackbox-input-send-btn\">Send</button>\n            </div>\n        </div>";
        this.yackboxContainer = this.container.querySelector('.yackbox-base');
        this.titleArea = this.container.querySelector('.yackbox-title-area');
        this.titleArea.innerHTML = "<h3>" + this.title + "</h3>";

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
        var inputTextarea = this.inputTextArea;
        // memoize callback fn
        var admsg = this.addMessage.bind(this);
        var apndmsg = this.appendMessageContent.bind(this);
        var addMsgCB = function addMsgCB(c, u, a) {
          return admsg(c, u, a);
        };
        var apndMsgCB = function apndMsgCB(id, c) {
          return apndmsg(id, c);
        };
        var handleUserSubmit = function handleUserSubmit() {
          // Submit the message
          var content = inputTextarea.value.trim(); // Remove leading/trailing whitespace
          if (content !== '') {
            // if echo, write the user's content to the chat area
            var user = _this.userName;
            if (_this.echo) _this.addMessage(content, user, _this.userAlignment);
            inputTextarea.value = ''; // Clear input field after sending
            // Call the bot response completionCallback function, passing the user's input
            _this.completionCallback({
              content: content,
              user: user
            }, addMsgCB, apndMsgCB);
          }
        };
        inputTextarea.addEventListener('keydown', function (event) {
          // Check if Shift + Enter is pressed
          if (event.shiftKey && event.keyCode === 13) {
            // Prevent default behavior (adding new line)
            event.preventDefault();
            handleUserSubmit();
          }
        });
        this.submitButton.addEventListener('click', function () {
          handleUserSubmit();
        });
        this.container.addEventListener('resize', function () {
          handleContainerResize();
        });
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
    }, {
      key: "getMessageHistory",
      value: function getMessageHistory(n, m) {
        if (this.messages.length <= 0) return [];
        if (typeof n != "number") return [];
        if (typeof m == "number") {
          if (n < m) return this.messages.slice(n, m);else return this.messages.slice(m, n);
        } else {
          if (n < 0) n = this.messages.length + n;
          return [this.messages[n]];
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
    }, {
      key: "getMessageStats",
      value: function getMessageStats() {
        var stats = {
          "numMessages": this.messages.length,
          // "numUsers": this.users.keys().length,
          "firstMsgTimestamp": this.messages.length > 0 ? this.messages[0].timestamp : "",
          "lastMsgTimestamp": this.messages.length > 0 ? this.messages[this.messages.length - 1].timestamp : ""
        };
        return stats;
      }
    }]);
  }();

  return yackbox;

}));
//# sourceMappingURL=yackbox.umd.js.map
