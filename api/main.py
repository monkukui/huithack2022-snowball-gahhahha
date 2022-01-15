from fastapi import FastAPI
from fastapi_socketio import SocketManager
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
sio = SocketManager(app=app, cors_allowed_origins=[])
# sio = SocketManager(app=app, cors_allowed_origins=["*"], mount_location='/')

origins = [
    # TODO: フロントエンドデプロイしたらそのURLも入れる
    "http://localhost:8000",
    "http://localhost:5500",
    "http://localhost",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return "aa"


@app.sio.on('join')
async def handle_join(sid, *args, **kwargs):
    await sio.emit('lobby', 'User joined')


@sio.on('test')
async def test(sid, *args, **kwargs):
    await sio.emit('hey', 'joe')


if __name__ == '__main__':
    import logging
    import sys

    logging.basicConfig(level=logging.DEBUG,
                        stream=sys.stdout)

    import uvicorn

    uvicorn.run("main:app", host='0.0.0.0',
                port=8000, reload=True, debug=False)

# aaa