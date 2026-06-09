# mizukara-retreat

ミズカラ関連の**リトリートイベント**を扱うプロジェクト。
過去イベントのLPと、新規企画の計画ドキュメント・LPをまとめて管理する。

## 構成

```
mizukara-retreat/
├── README.md                      ← このファイル
├── CLAUDE.md                      ← プロジェクトの作業ルール（文章ルール・表記など）
├── docs/
│   └── kanazawa-retreat-context.md  金沢リトリートの状況・登場人物まとめ（SoT）
├── events/
│   ├── yudai-hesaka/              前回イベント「Yudai Hesaka リトリート」のLP一式
│   │   ├── index.html / main.css / styles.css / fire.js / tweaks-panel.jsx
│   │   ├── assets/                LP内で使う画像
│   │   └── uploads/               アップロード画像
│   └── kanazawa/                 今度の金沢リトリート（これから中身を作る）
└── chats/
    └── chat1.md                  LP設計時のデザインアシスタントとのやりとり
```

## イベント

| イベント | ステータス | 場所 |
|---|---|---|
| Yudai Hesaka リトリート | 開催済み（LPあり） | `events/yudai-hesaka/` |
| 金沢リトリート | 企画中 | `events/kanazawa/`・`docs/kanazawa-retreat-context.md` |

## メモ

- 過去イベントのLPは Claude Design（claude.ai/design）からのハンドオフ資産。`chats/chat1.md` に設計時のやりとりが残っている。
- 新規イベントの作業ルール（文体・固有名詞の表記ゆれ防止など）は `CLAUDE.md` を参照。
