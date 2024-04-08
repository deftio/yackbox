// Import the XLite Chat class
const XLiteChat = require('../xlite_chat');

describe('XLiteChat', () => {
    let chat;

    // Before each test, initialize a new XLite Chat instance
    beforeEach(() => {
        chat = new XLiteChat('#chat-container', jest.fn());
    });

    // Test cases for the addMessage method
    describe('addMessage', () => {
        it('should add a message to the chat', () => {
            chat.addMessage('Hello!', 'User', 'left');
            expect(chat.getLog()).toHaveLength(1);
        });

        it('should fire the callback function', () => {
            const callback = jest.fn();
            chat = new XLiteChat('#chat-container', callback);
            chat.addMessage('Hello!', 'User', 'left');
            expect(callback).toHaveBeenCalled();
        });

        // Add more test cases for different scenarios
    });

    // Test cases for the updateMessage method
    describe('updateMessage', () => {
        it('should update a message in the chat', () => {
            chat.addMessage('Hello!', 'User', 'left');
            chat.updateMessage(0, 'Updated message');
            expect(chat.getLog()[0].content).toBe('Updated message');
        });

        // Add more test cases for different scenarios
    });

    // Test cases for the removeMessage method
    describe('removeMessage', () => {
        it('should remove a message from the chat', () => {
            chat.addMessage('Hello!', 'User', 'left');
            chat.removeMessage(0);
            expect(chat.getLog()).toHaveLength(0);
        });

        // Add more test cases for different scenarios
    });

    // Test cases for the getMessage method
    describe('getMessage', () => {
        it('should return the message with the given id', () => {
            chat.addMessage('Hello!', 'User', 'left');
            const message = chat.getMessage(0);
            expect(message).toBeDefined();
            expect(message.content).toBe('Hello!');
        });

        // Add more test cases for different scenarios
    });

    // Test cases for the getLog method
    describe('getLog', () => {
        it('should return the chat log', () => {
            chat.addMessage('Hello!', 'User', 'left');
            chat.addMessage('Hi!', 'User', 'left');
            const log = chat.getLog();
            expect(log).toHaveLength(2);
            expect(log[0].content).toBe('Hello!');
            expect(log[1].content).toBe('Hi!');
        });

        // Add more test cases for different scenarios
    });

    // Add more test cases for other methods and functionalities

});
