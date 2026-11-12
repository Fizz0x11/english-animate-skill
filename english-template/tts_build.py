# -*- coding: utf-8 -*-
"""tts_build.py — 系列旁白逐段合成（晓晓 zh-CN-XiaoxiaoNeural，370 同款音色）
输入 narration.json: {"voice_rate": "+25%", "pages": {"P1": "文本", ...}}
输出 audio/nar/P01.mp3... + audio/nar/durations.json（各段时长，秒）
缓存键 = voice|rate|text；改一段只重合成该段。"""
import asyncio, hashlib, json, subprocess, sys
from pathlib import Path

JOB = Path(__file__).resolve().parent
NAR = JOB / "audio" / "nar"
NAR.mkdir(parents=True, exist_ok=True)
cfg = json.loads((JOB / "narration.json").read_text(encoding="utf-8"))
VOICE = cfg.get("voice", "zh-CN-XiaoxiaoNeural")
RATE = cfg.get("voice_rate", "+25%")


def ffprobe_dur(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                        "-print_format", "json", str(p)], capture_output=True, text=True)
    return round(float(json.loads(r.stdout)["format"]["duration"]), 3)


async def synth(seg_id, text):
    key = hashlib.md5(f"{VOICE}|{RATE}|{text}".encode()).hexdigest()[:16]
    mp3 = NAR / f"{seg_id}_{key}.mp3"
    if not mp3.exists():
        import edge_tts
        comm = edge_tts.Communicate(text, VOICE, rate=RATE)
        audio, pts = b"", []
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                audio += chunk["data"]
            elif chunk["type"] == "WordBoundary":
                pts.append({"w": chunk["text"], "t": chunk["offset"] / 1e7, "d": chunk["duration"] / 1e7})
        mp3.write_bytes(audio)
        (NAR / f"{seg_id}_{key}.words.json").write_text(json.dumps(pts, ensure_ascii=False), encoding="utf-8")
    return mp3


async def main():
    durs = {}
    for seg_id, text in cfg["pages"].items():
        mp3 = await synth(seg_id, text)
        durs[seg_id] = ffprobe_dur(mp3)
        print(f"{seg_id}: {durs[seg_id]:6.2f}s | {text[:26]}")
    total = sum(durs.values())
    durs["_total_speak"] = round(total, 2)
    (NAR / "durations.json").write_text(json.dumps(durs, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"---- total speak {total:.1f}s （页间留白另计）")


asyncio.run(main())
