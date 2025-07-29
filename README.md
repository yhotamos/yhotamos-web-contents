# Markdown Web Contents

## 目的・概要

このリポジトリは，ウェブサイトのコンテンツを Markdown 形式で管理するためのものです．
ブログ記事や変更履歴を Markdown 形式で管理し，TypeScript 製のスクリプトで処理を行います．
ブログ記事のメタ情報を集約し，`content/blog/blogMetaIndex.json`に出力します．これにより，ウェブサイト側でブログ記事の一覧表示や検索機能，API 等を実装することができます．

このリポジトリを使うためには，下記の手順を実行する必要があります：

## セットアップ

まず，このリポジトリをクローンします．

```bash
git clone https://github.com/yhotamos/markdown-web-contents
cd　markdown-web-contents
```

次に，プロジェクトの依存関係をインストールします．

```bash
npm install
```

### 主な依存関係

- `gray-matter`: Markdown ファイルの frontmatter を解析します．
- `tsx`: TypeScript ファイルを実行します．
- `typescript`: TypeScript のコンパイラです．

## 使い方

### 新しいブログ記事を作成する

記事のタイトルを引数に指定して，新しいブログ記事を作成します．

```bash
npm run new:blog "新しいブログ記事のタイトル"
```

#### 生成されるファイル

上記のコマンドを実行すると，`content/blog/`ディレクトリに新しいフォルダと Markdown ファイルが生成されます．

例えば，2025 年 7 月 25 日に `"新しいブログ記事のタイトル"` というタイトルでコマンドを実行した場合，以下のようになります．

1.  **フォルダが作成される**

    - `content/blog/20250725_新しいブログ記事のタイトル/`

2.  **Markdown ファイルが生成される**

    - `content/blog/20250725_新しいブログ記事のタイトル/index.md`

    `index.md`には，以下のような Frontmatter と本文のテンプレートが書き込まれます．

    ```markdown
    ---
    id: (ランダムなID)
    title: 新しいブログ記事のタイトル
    slug: 新しいブログ記事のタイトル
    date: "2025-07-25"
    updateDate: "2025-07-25"
    description: ""
    tags: []
    type: user
    version: 1.0.0
    thumbnail: ""
    ---

    ここに本文を書きます．
    ```

### ブログのメタ情報を更新する

ブログ記事の追加や更新をした際に，以下のコマンドを実行します．
このコマンドは，`content/blog`内のすべての`index.md`ファイルを読み込み，各記事のメタデータを集約した`blogMetaIndex.json`を生成・更新します．

```bash
npm run build:blog
```

#### `blogMetaIndex.json`の役割

`blogMetaIndex.json`は，ウェブサイト側でブログ記事の一覧表示や検索機能を実現するために使用されるインデックスファイルです．
このファイルには，各記事のタイトル，日付，タグ，概要などのメタ情報がまとめられています．

#### 主な処理内容

- 各ブログ記事（`index.md`）の Frontmatter を解析します．
- Frontmatter に`id`が存在しない場合は，自動的に付与して`index.md`を更新します．
- Frontmatter に`summary`が存在しない場合は，本文の先頭から自動的に概要を生成します．
- すべての記事のメタ情報を集約し，`content/blog/blogMetaIndex.json`に出力します．

## ディレクトリ構成

```
markdown-web-contents/
├───content/
│   └───blog/
│       ├───20250723_サンプル/
│       │   ├───index.md
│       │   └───thumbnail.png
│       └───blogMetaIndex.json
├───scripts/
│   ├───createBlogPost.ts
│   └───generateBlogMetaIndex.ts
└───types/
    └───blog.ts
```

- `content/blog`: ブログ記事を Markdown 形式で格納します．
- `types`: TypeScript の型定義が格納されています．
- `scripts`: コンテンツを管理するためのスクリプトが格納されています．
