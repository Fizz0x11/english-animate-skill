# -*- coding: utf-8 -*-
"""build_voice.py — 旁白轨拼接（通用：narration.json 页顺序 + durations.json + PAGE_STARTS）
输出 audio/voice.wav：每段旁白按 页起点+NAR_IN 毫秒铺进全片音轨。"""
import json, subprocess, sys
from pathlib import Path

JOB = Path(__file__).resolve().parent
NAR = JOB / "audio" / "nar"
cfg = json.loads((JOB / "narration.json").read_text(encoding="utf-8"))
durs = json.loads((NAR / "durations.json").read_text(encoding="utf-8"))

NAR_IN = 700          # 每页起说延迟（毫秒）
PAGE_STARTS = json.loads((JOB / "page_starts.json").read_text(encoding="utf-8"))   # {"P1": 0.0, ...} 秒

pages = [k for k in cfg["pages"] if not k.startswith("_")]
starts = {k: v for k, v in PAGE_STARTS.items() if k.startswith("P")}
assert set(pages) == set(starts), f"页号不齐: {pages} vs {list(starts)}"

import hashlib
def seg_mp3(seg_id, text):
    key = hashlib.md5(f"{cfg['voice']}|{cfg.get('voice_rate','+25%')}|{text}".encode()).hexdigest()[:16]
    return NAR / f"{seg_id}_{key}.mp3"

inputs, filters, labels = [], [], []
for i, seg in enumerate(pages):
    mp3 = seg_mp3(seg, cfg["pages"][seg])
    if not mp3.exists():
        raise SystemExit(f"缺音频段: {mp3.name}（先跑 tts_build.py）")
    inputs += ["-i", str(mp3)]
    delay_ms = int((starts[seg] * 1000) + NAR_IN)
    filters.append(f"[{i}]adelay={delay_ms}|{delay_ms}[a{i}]")
    labels.append(f"[a{i}]")
fc = ";".join(filters) + ";" + "".join(labels) + f"amix=inputs={len(pages)}:normalize=0,apad=whole_dur={cfg.get('total', 80)}[v]"
out = JOB / "audio" / "voice.wav"
subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *inputs,
                "-filter_complex", fc, "-map", "[v]", "-ac", "1", "-ar", "44100", str(out)], check=True)
total = durs.get("_total_speak", 0)
print(f"voice.wav ok: {out.stat().st_size} bytes（旁白总说 {total}s，片长 {cfg.get('total', '?')}s）")
