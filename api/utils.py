import json
from firebase import db
from uuid import uuid4

ENTRANCE_COLLECTION_KEY = "entrance"
ROOM_COLLECTION_KEY = "room"

# 待機所にいる人を取得
async def get_entrance():
    docs = db.collection(ENTRANCE_COLLECTION_KEY).stream()
    data = []
    for doc in docs:
        post = {"id": doc.id, **doc.to_dict()}
        data.append(post)
    return data

# 待機所に人を登録させる
async def wait_at_entrance(name: str, socketId: str) -> str:
    doc_ref = db.collection(ENTRANCE_COLLECTION_KEY).document()
    doc_ref.set({
        "name": name,
        "socketId": socketId
    })
    return doc_ref.id

# socketIdでエントランスから消す
async def remove_entrance_member(socketId: str):
    docs = db.collection(ENTRANCE_COLLECTION_KEY).where("socketId", "==", socketId).stream()
    data = []
    for doc in docs:
        post = {"id": doc.id, **doc.to_dict()}
        data.append(post)
    if len(data) == 0:
        print("エントランスの人、消したかったけど消せなかったよ。")
        return
    result = db.collection(ENTRANCE_COLLECTION_KEY).document(data[0]["id"]).delete()
    print(f"deleted {str(data[0])}.")
    return result

# uidでエントランスから消す
async def remove_entrance_member_by_uid(uid: str):
    result = db.collection(ENTRANCE_COLLECTION_KEY).document(uid).delete()
    print(f"deleted {uid}.")
    return result

# この部屋を登録する関数
async def register_room(socketId_host: str, socketId_guest: str):
    doc_ref = db.collection(ROOM_COLLECTION_KEY).document()
    doc_ref.set({
        "socketId_host": socketId_host,
        "socketId_guest": socketId_guest
    })
    print(doc_ref.id, "sss")
    return doc_ref.id

# socketIdで検索してその部屋を探す
async def search_room(socketId: str):
    docs = db.collection(ROOM_COLLECTION_KEY).where("socketId_host", "==", socketId).stream()
    docs2 = db.collection(ROOM_COLLECTION_KEY).where("socketId_guest", "==", socketId).stream()
    data = []
    for doc in docs:
        post = {"uid": doc.id, **doc.to_dict()}
        data.append(post)
    for doc in docs2:
        post = {"uid": doc.id, **doc.to_dict()}
        data.append(post)
    return data

#  部屋をぶっこわす関数