---
name: english-animate
description: 英语教学动画产线 skill——把英语知识点（词根词缀/语法/词汇主题）做成 Q 版小人讲解动画片，带晓晓 TTS 旁白、拟音、字幕。canvas 逐帧零积分，出 1080p30 成片。含可跑 demo（英语词根速成 76s）。适合任何 AI 助手安装后一句话产片。
---

# english-animate · 英语教学动画 skill

把你给的英语知识点，做成一支 Q 版小人讲解动画：彩色字母积木、词海、黑板、剪刀线拆词，配微软晓晓旁白 + 卡通拟音 + 逐字字幕，1080p30 成片。全代码画帧，不用 AI 生图、不用视频平台积分。

> 引擎层（engine.js/props.js/common.js/render.mjs/audio/mix.py）来自开源 [chibi-history-explainer](https://github.com/)（MIT, (c) 2026 yiyu5331）；英语教学层（字母积木/词海/黑板/拆词道具、TTS 旁白链、demo 文案）为本包自制，MIT 同权分发。

## 环境四件套（先自查）

| 依赖 | 检查 | 缺了装 |
|---|---|---|
| Node 18+ | `node --version` | nodejs.org |
| ffmpeg 7.x | `ffmpeg -version` | gyan.dev（essentials 即可） |
| Chrome | 默认路径有 chrome.exe | google.com/chrome |
| Python 3.10+ + edge-tts + numpy/scipy | `python -c "import edge_tts, numpy, scipy"` | `pip install edge-tts numpy scipy` |

中文字幕要衬线粗宋：Windows 装思源宋体 Noto Serif SC（或 NotoSerifSC-VF）；macOS 自带 Songti SC。

## 五步产线

```bash
cd english-template
npm install                                  # ① 只需一次（playwright-core）
python -X utf8 tts_build.py                  # ② 旁白逐段合成 + 打印每页实测时长
#    ③ 按实测时长改 page_starts.json 与 scenes.js 的 SCENES/PAGES 对齐
node render.mjs stills 1,5,9,15              # ④ 出截图自查（造型/字幕/道具）
node render.mjs video --out=demo --crf=22    # ⑤ 渲无声片 → 混音 → 合成
python -X utf8 audio/mix.py out/cues.json out/mix.wav
python -X utf8 build_voice.py
ffmpeg -y -i out/demo.mp4 -i audio/voice.wav -i out/mix.wav \
  -filter_complex "[2:a]volume=0.38[sfx];[1:a][sfx]amix=inputs=2:normalize=0,loudnorm=I=-15:TP=-1.5:LRA=11[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 160k -shortest out/成片.mp4
```

## 换内容出一集新的

1. 改 `narration.json`：每页一段旁白（中文口语，英文单词直接写，晓晓能读）
2. 跑 `tts_build.py` 拿每页实测时长 → 定 `page_starts.json` 页起点（页长=旁白+1~2s 演完余量）
3. 改 `scenes.js`：复用自制道具 `block()`（三色字母积木）/`wordSea()`（词海）/`blackboard()`（黑板）/`cutFlash()`（剪刀线拆词）/`flashcard()`（知识卡），字幕进 `PAGES`（【】浅蓝信息词、〔〕红结论词、句中全角空格、句末无标点）
4. 跑 ④⑤

动画铁律（出片质量的底线，详见 kit 同族产线规则）：人占画面高一半、动作「蓄力→动作→过冲→回稳」、字幕左上粗宋 68px 不压弹字、小人从不静止、每页镜头慢推。

## 验收三步（装完就跑）

1. `node render.mjs stills 1,5,9` 出 3 张截图——能看到 Q 版小人+彩色积木+中文粗宋字幕 = 引擎装好
2. `node render.mjs video 0,15 --out=t15` 渲前 15 秒 + `python -X utf8 audio/mix.py out/cues.json out/mix.wav`——有声有画 = 渲染链通
3. 改 `narration.json` 里任意一句重跑 `tts_build.py`——时长表变了 = 你已经能自己产片

## 目录

- `english-template/` 可跑 demo 工程（英语词根速成 76 秒，7 页：词海压顶/三积木/拼装/拆词/脸熟/收尾）
- `kit/` 引擎原件（MIT）+ 空白模板
- `demo-成果/` 四段 GIF 效果样片
