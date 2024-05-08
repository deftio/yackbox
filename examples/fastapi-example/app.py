from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse, StreamingResponse
from fastapi.templating import Jinja2Templates
import requests
import json
import sys
import uvicorn

app = FastAPI()
templates = Jinja2Templates(directory="templates")

@app.get("/stream/{text}")
async def stream_output(text: str):
    model = "mistral"
    messages = [{"role": "user", "content": text}]
    try:
        r = requests.post(
            "http://localhost:11434/api/chat",
            json={"model": model, "messages": messages, "stream": True},
            stream=True,
        )
        r.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

    async def generate():
        output = ""
        for line in r.iter_lines():
            body = json.loads(line.decode("utf-8"))
            if "error" in body:
                print(f"Error: {body['error']}")
                raise Exception(body["error"])
            if body.get("done") is False:
                message = body.get("message", "")
                content = message.get("content", "")
                output += content
                for token in content:
                    yield f"data: {token}\n\n"
            if body.get("done", False):
                yield f"data: [DONE]\n\n"
                break

    return StreamingResponse(generate(), media_type="text/event-stream")

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

def main():
    uvicorn.run("app:app", host="0.0.0.0", port=8000, log_level="info", reload=True)

if __name__ == "__main__":
    main()
