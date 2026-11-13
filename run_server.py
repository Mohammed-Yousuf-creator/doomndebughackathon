import uvicorn

if __name__ == "__main__":
    print("================================================================")
    print("  AEGIS OS — Forge Innovation Network (FastAPI + React)")
    print("  Server launching on: http://localhost:8000")
    print("  Portals: /ops, /war-room, /judge, /sponsor")
    print("  WebSocket Telemetry: ws://localhost:8000/ws/telemetry")
    print("================================================================")
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)

