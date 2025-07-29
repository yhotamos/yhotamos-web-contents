Node.js 製の CLI ツールを公開するための基本的な流れ

### 1. パッケージの準備

- `package.json`を正しく設定する（`name`，`version`，`description`，`bin`，`main`など）
- CLI のエントリーポイントに実行権限を付ける（Unix 系なら`chmod +x`）
- スクリプトの先頭にシバン（`#!/usr/bin/env node`）を入れる

例：`package.json`の bin 設定

```json
{
  "name": "your-cli-tool",
  "version": "1.0.0",
  "bin": {
    "your-cli": "./bin/index.js"
  },
  ...
}
```

`bin/index.js`の先頭

```js
#!/usr/bin/env node
// ここからCLIの処理
```

### 2. npm に公開する準備

- npm アカウントを作成（[https://www.npmjs.com/signup）](https://www.npmjs.com/signup）)
- ローカルで npm にログイン

```bash
npm login
```

### 3. パブリッシュ

```bash
npm publish
```

- 初めて公開する場合は，`package.json`の`name`が npm で他と被っていないか注意
- `public`なパッケージの場合はこのままで OK
- プライベートパッケージの場合は`npm publish --access=restricted`

### 4. インストールと実行確認

```bash
npm install -g your-cli-tool
your-cli --help
```

### 5. GitHub などでソース公開（任意）

- GitHub にリポジトリを作成し，コードをアップロード
- README.md に使い方やインストール方法を書くと親切

### まとめ

1. CLI ツールの`package.json`とファイル構成を整える
2. npm にログインし，`npm publish`
3. グローバルインストールして動作確認
4. GitHub などに公開してドキュメント整備