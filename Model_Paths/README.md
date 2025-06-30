# Local Model Server for Retail Flash

This folder contains a local FastAPI server that provides AI model endpoints for the Retail Flash application. The server acts as a pathway to Gemini models and provides fallback functionality.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pip install fastapi uvicorn google-generativeai pathway
```

### 2. Set Environment Variable

Make sure you have your Google Generative AI API key set:

```bash
export GOOGLE_GENERATIVE_AI_API_KEY="your-api-key-here"
```

### 3. Start the Server

```bash
python start_server.py
```

The server will start at `http://localhost:8000`

## 📋 Available Endpoints

### POST /generate-tagline
Generate promotional taglines for products.

**Request Body:**
```json
{
  "api_key": "your-google-api-key",
  "name": "Product Name",
  "price": 99.99,
  "old_price": 129.99,
  "description": "Product description",
  "request_id": "unique-request-id"
}
```

**Response:**
```json
{
  "tagline": "Generated promotional tagline"
}
```

### POST /chat
General chat/Q&A functionality.

**Request Body:**
```json
{
  "api_key": "your-google-api-key",
  "message": "Your question or prompt"
}
```

**Response:**
```json
{
  "response": "AI generated response"
}
```

### GET /docs
Interactive API documentation (Swagger UI)

## 🔄 How It Works

1. **Primary Flow**: The Retail Flash app first tries to call the local server
2. **Fallback**: If the local server is unavailable or returns an error, it falls back to direct Gemini API calls
3. **Caching**: The server includes basic caching to reduce API calls

## 🛠️ Architecture

- **FastAPI**: Web framework for the API server
- **Pathway**: Data processing framework for handling requests
- **Google Generative AI**: Underlying AI model provider
- **Uvicorn**: ASGI server for running the FastAPI app

## 🔧 Configuration

### Environment Variables
- `GOOGLE_GENERATIVE_AI_API_KEY`: Your Google AI API key

### Server Settings
- **Host**: 0.0.0.0 (accessible from any IP)
- **Port**: 8000
- **Reload**: Enabled for development
- **Log Level**: Info

## 🚨 Troubleshooting

### Common Issues

1. **Port 8000 already in use**
   ```bash
   # Find and kill the process using port 8000
   lsof -ti:8000 | xargs kill -9
   ```

2. **Missing dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **API key not set**
   ```bash
   export GOOGLE_GENERATIVE_AI_API_KEY="your-key"
   ```

4. **Server not responding**
   - Check if the server is running: `curl http://localhost:8000/docs`
   - Check logs for errors
   - Restart the server

### Logs
The server provides detailed logs including:
- Request/response information
- Error details
- API call status

## 📝 Development

### Adding New Endpoints

1. Add the endpoint function in `model.py`
2. Update the FastAPI app routes
3. Test with the `/docs` interface

### Modifying Prompts

Edit the prompt templates in the respective functions:
- `generate_tagline()` for promotional copy
- `chat()` for general Q&A

## 🔒 Security Notes

- The server runs on localhost only
- API keys are passed through requests
- No persistent storage of sensitive data
- Consider adding authentication for production use

## 📊 Performance

- **Response Time**: Typically 1-3 seconds
- **Concurrent Requests**: Limited by Google AI API quotas
- **Caching**: Basic in-memory caching implemented
- **Error Handling**: Graceful fallback to direct API calls 