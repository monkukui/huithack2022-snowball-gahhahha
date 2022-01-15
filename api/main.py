from socket import socket
from fastapi import FastAPI, HTTPException, status
from fastapi_socketio import SocketManager
# //, emit, join_room, leave_room, close_room, rooms, disconnect
from fastapi.middleware.cors import CORSMiddleware
import json
import random
from utils import get_entrance, register_room, wait_at_entrance, remove_entrance_member, remove_entrance_member_by_uid

app = FastAPI()
sio = SocketManager(app=app, cors_allowed_origins=[])
# sio = SocketManager(app=app, cors_allowed_origins=["*"], mount_location='/')

origins = [
    # TODO: フロントエンドデプロイしたらそのURLも入れる
    "http://localhost:8000",
    "http://localhost:5500",
    "http://localhost:8080",
    "http://localhost",
    "http://127.0.0.1:5500",
    "https://snowball-gahhahha.herokuapp.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@sio.on('echo')
async def echo(sid, *args, **kwargs):
    data = json.loads(args[0])
    print("echo", data)
    await sio.emit('echo', json.dumps(data))


@app.get("/")
async def root():
    return {"message": "this is root root root"}


@sio.on('test')
async def test2(sid, *args, **kwargs):
    print("hi2")
    await sio.emit('hey', 'joe')


@sio.on('join')
async def join(sid, *args, **kwargs):
    # firestoreに、人がいるか見に行く。
    data = json.loads(args[0])
    if(not (data.get("name") and data.get("socketId"))):
        print("nono")  # "name, and socketId is required"
        return
    entrance = await get_entrance()
    print("entrance", entrance)
    if(not len(entrance)):  # だれもいなかったから登録。
        await wait_at_entrance(data["name"], data["socketId"])
        print("エントランス登録done")
    elif len(entrance) >= 2:  # なんか変
        print('3人以上待ってるね、がっはっは')
    else:  # マッチング成立！
        print('ひとり待ってました。')
        me = {"name": data["name"], "socketId": data["socketId"]}
        you = entrance[0]
        await remove_entrance_member_by_uid(you["id"])
        # あとから来たのがmeで、meがguest.さきにいたyouがhost.
        print(f'マッチング・{me["name"]} vs {you["name"]}')
        await sio.emit("matched", {"host": {
            "name": you["name"], "socketId": you["socketId"]}, "guest": {"name": me["name"], "socketId": me["socketId"]}}, to=me["socketId"])
        await sio.emit("matched", {"host": {
            "name": you["name"], "socketId": you["socketId"]}, "guest": {"name": me["name"], "socketId": me["socketId"]}}, to=you["socketId"])
        await register_room(you["socketId"], me["socketId"])
        # そのひとりを消して、そいつと、登録されてたあいつでマッチング。
        # firestore, 部屋に登録。
    # いたら、そいつと部屋マッチングできましたよ。と登録する。
    # マッチしましたよと。
    # sio.emit("mathed", {
    # enemyName: "a",
    # enemySocketId: "fmalsdf"
    # })
    # ちょっとまってから、開始の合図を送る。
    # sio.emit("start", ...)

    # いなかったら、そいつを部屋にいれて、待ってもらう。


@app.sio.on('startGameRequest')
async def gameRequested(socket, req):
    print(socket, req)
    # {'host': {'name': 'あああ', 'socketId': 'F9GWXPwIg99fFogDAAAB'}, 'guest': {'name': 'あああ', 'socketId': 'am0i2xgq1Tyb8RctAAAD'}}
    await sio.emit('start', to=req["host"]["socketId"])
    await sio.emit('start', to=req["guest"]["socketId"])

opponentType = {
    "host": "guest",
    "guest": "host"
}


def getPlayerType(socket, req):
    # print(socket, req)
    playerType = ""
    if(socket == req["room"]["host"]["socketId"]):
        playerType = "host"
    else:
        playerType = "guest"
    return playerType


@app.sio.on('position')
async def syncPos(socket, req):
    # print(socket, req)
    playerType = getPlayerType(socket, req)
    to = req["room"][opponentType[playerType]]["socketId"]
    await sio.emit("enemyPosition", {"data": req["position"]}, to=to)



def generate_snowballs_from_count(count):
    c = 8
    res = []
    for i in range(c):
        res.append({
            "x": int(random.random() * (200 - 30) - 85),
            "y": int(random.random() * (200 - 30) - 85)
        })
    return res


@app.sio.on('requestFall')
async def requestFall(socket, req):  # roomくる前提
    playerType = getPlayerType(socket, req)
    to1 = req["room"][opponentType[playerType]]["socketId"]
    to2 = req["room"][playerType]["socketId"]
    res = generate_snowballs_from_count(req["count"])
    await sio.emit("fall", {"data": res}, to=to1)
    await sio.emit("fall", {"data": res}, to=to2)


@app.sio.on('connect')
async def connect(socket, *args, **kwargs):
    print("connected!")


@app.sio.on('disconnect')
async def disconnect(reason):
    print(f'disconnected!: {reason}')
    # room にいるか探す
    # いたら、もう一人の方に、相手が切断したよと送る。ルームを消す。おわり
    # いなかったら以下
    await remove_entrance_member(reason)

    # 壊れたのが待ってる人だったら、firestoreから消す。
    # 壊れたのがプレイ中の人だったら、おわりー！って流す。
    # そして、そのfirestoreも消す。


if __name__ == '__main__':
    import logging
    import sys

    logging.basicConfig(level=logging.DEBUG,
                        stream=sys.stdout)

    import uvicorn

    uvicorn.run("main:app", host='0.0.0.0',
                port=8000, reload=True, debug=False)
