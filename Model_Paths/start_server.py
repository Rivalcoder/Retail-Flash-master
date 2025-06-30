#!/usr/bin/env python3
"""
Script to start the local model server for Retail Flash AI flows.
This server provides endpoints for:
- /generate-tagline: Generate promotional taglines
- /chat: General chat/Q&A functionality
"""

import uvicorn
import sys
import os

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the FastAPI app from model.py
from model import app

if __name__ == "__main__":
    print("🚀 Starting Retail Flash Local Model Server...")
    print("📍 Server will be available at: http://localhost:8000")
    print("📋 Available endpoints:")
    print("   - POST /generate-tagline - Generate promotional taglines")
    print("   - POST /chat - General chat/Q&A")
    print("   - GET /docs - API documentation")
    print("\n⚠️  Make sure you have set the GOOGLE_GENERATIVE_AI_API_KEY environment variable")
    print("💡 To stop the server, press Ctrl+C\n")
    
    try:
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    except Exception as e:
        print(f"❌ Error starting server: {e}")
        print("💡 Make sure all dependencies are installed:")
        print("   pip install fastapi uvicorn google-generativeai pathway") 