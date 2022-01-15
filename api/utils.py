import json
from firebase import db

ENTRANCE_COLLECTION_KEY = "entrance"

# 全ての登録情報を取得


async def get_entrance():
    docs = db.collection(ENTRANCE_COLLECTION_KEY).stream()
    data = []
    for doc in docs:
        post = {"id": doc.id, **doc.to_dict()}
        data.append(post)
    return data


async def wait_at_entrance(name: str, socketId: str) -> str:
    doc_ref = db.collection(ENTRANCE_COLLECTION_KEY).document()
    doc_ref.set({
        "name": name,
        "socketId": socketId
    })
    return doc_ref.id


async def remove_entrance_member(socketId: str):
    docs = db.collection(ENTRANCE_COLLECTION_KEY).where(
        "socketId", "==", socketId).stream()
    data = []
    for doc in docs:
        post = {"id": doc.id, **doc.to_dict()}
        data.append(post)
    if len(data) == 0:
        print("エントランスの人、消したかったけど消せなかったよ。")
        return
    result = db.collection(ENTRANCE_COLLECTION_KEY).document(
        data[0]["id"]).delete()
    print(f"deleted {str(data[0])}.")
    return result


async def remove_entrance_member_by_uid(uid: str):
    result = db.collection(ENTRANCE_COLLECTION_KEY).document(
        uid).delete()
    print(f"deleted {uid}.")
    return result
