# Transrater Gemini

個人用ローカル環境で動作する Chrome 拡張機能です。Gemini API を利用して Web ページや選択テキストを翻訳します。現在は Gemini 2.0 Flash モデルを使用しています。

## ビルド方法

```bash
npm install
npm run build
```

`dist` フォルダに拡張機能一式が生成されます。

## インストール手順

1. `chrome://extensions` を開く
2. 右上の「Developer mode」を有効化
3. 「Load unpacked」で `dist` フォルダを指定

## 主要機能

- ページ全体の翻訳
- 選択テキストの翻訳
- X 投稿の翻訳
- オプション画面で API キーや言語設定を管理

## Discord RSS ボット

`discord_rss_bot.py` を実行すると、 `/addrss` スラッシュコマンドで RSS フィードを登録できるシンプルな Discord ボットが起動します。実行前に `DISCORD_BOT_TOKEN` 環境変数に Bot のトークンを設定してください。

```bash
export DISCORD_BOT_TOKEN=your_token_here
python3 discord_rss_bot.py
```
