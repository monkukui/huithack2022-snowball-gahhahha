from fastapi import FastAPI
from fastapi_socketio import SocketManager, emit, join_room, leave_room, close_room, rooms, disconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import random

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


@app.sio.on("/join")
async def handle_join(sid, *args, **kwargs):
    await sio.emit('lobby', 'User joined')


@sio.on('test')
async def test(sid, *args, **kwargs):
    await sio.emit('hey', 'joe')

@sio.on('room')
def room(message):
    print('message arrived to room')
    if not message.get('roomName'):
        print('no raw data')
        emit('room', {'status': 'error',
                      'message': 'no room name was given'})
        return
    # 送られた roomname↓
    room_name = message["roomName"]
    room_name_key = f'room:{message["roomName"]}'

    # 部屋が無かったら登録して、部屋に参加
    if not cache.hlen(room_name_key):
        print(f'{room_name_key} を登録したよ！')
        color = "white" if int(random.random() * 2) else "black"
        cache.hset(room_name_key, color, str(request.sid))
        cache.expire(room_name_key, 1800)
        join_room(room_name_key)
        emit('room', {"status": "waiting",
                      "room": room_name_key}, room=room_name_key)
        return

    # 既に二人いたら、だめだよって返す
    if cache.hexists(room_name_key, 'white') and cache.hexists(room_name_key, 'black'):
        print('既に存在してるよ')
        emit('room', {"status": "fail", "room": room_name})
        return
    # 二人目だったら 登録しつつ部屋に入る
    print('２人目だよ')
    items = {key.decode(): val.decode()
             for key, val in cache.hgetall(room_name_key).items()}
    if not (items.get('white') or items.get('black')):
        print('変ですねえ')
        emit('room', {"status": "fail", "room": room_name, "message": "変ですねえ"})
        return
    yourColor = ''
    if items.get('black'):
        # print('おまえは白')
        yourColor = 'white'
    else:
        # print('お前は黒')
        yourColor = 'black'
    join_room(room_name_key)
    cache.hset(room_name_key, yourColor, str(request.sid))
    # ここでプレイヤーの登録Done、初期ボードを登録
    cache.hset(room_name_key, 'board', json.dumps(initial_board.initial_board))
    cache.hset(room_name_key, 'next', "white")
    # ready to begin game
    # 1番さんに知らせる
    enemyColor = "black" if yourColor == 'white' else "white"
    emit("room", {
        "room": room_name_key,
        "status": "play",
        "color": enemyColor
    }, room=items[enemyColor])
    # 2番さんに知らせる
    emit("room", {
        "room": room_name_key,
        "status": "play",
        "color": yourColor
    })
    cache.expire(room_name_key, 1800)
    # gameチャンネルに どーん する
    generated_board = board_manager.generate_board_to_send(
        initial_board.initial_board)
    emit('game', {"board": generated_board,
                  "turn": "black"}, room=room_name_key)
    return
 

if __name__ == '__main__':
    import logging
    import sys

    logging.basicConfig(level=logging.DEBUG,
                        stream=sys.stdout)

    import uvicorn

    uvicorn.run("main:app", host='0.0.0.0',
                port=8000, reload=True, debug=False)
