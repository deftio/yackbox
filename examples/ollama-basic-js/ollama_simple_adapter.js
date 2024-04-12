/* 
contains some small wrappers for calling ollama 
*/

// this calls the Ollama Completion API without token by token streaming
function getOllamaCompletionCallback (userInput, addMsg) {
    console.log(userInput.content);
    return fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "mistral",
            prompt: userInput.content,
            stream: false
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.response);
        addMsg(data.response.trim(), "Bot", 'left'); // Use the chat instance to display the bot's response
    })
    .catch(error => console.error('Error:', error));
}



// this calls the Ollama Streaming API with token streaming
function getOllamaStreamingCallback (userInput, addMsg, appendMsg) {
    var fetchedData = [];

    let start = true;
    let id = 0;
    return fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "mistral",
            prompt: userInput.content,
            stream: true
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.body.getReader();
    })
    .then(reader => {
        let partialData = '';
    
        // Read and process the NDJSON response
        return reader.read().then(function processResult(result) {
            if (result.done) {
                return;
            }
    
            partialData += new TextDecoder().decode(result.value, { stream: true });
            const lines = partialData.split('\n');
    
            for (let i = 0; i < lines.length - 1; i++) {
                const json = JSON.parse(lines[i]);
                const content = json.response;
                
                if (start) {
                    id = addMsg(content,"bot","left");
                    start=false;
                }
                else
                    appendMsg(id,content);
                //fetchedData.push(json); // Store the parsed JSON object in the array
            }
            partialData = lines[lines.length - 1];
    
            return reader.read().then(processResult);
        });
    })
    .then(() => {
        // At this point, fetchedData contains all the parsed JSON objects
        //console.log(fetchedData);
    })
    .catch(error => {
        console.error('Fetch error:', error);
    });
}
