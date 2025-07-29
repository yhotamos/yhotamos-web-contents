import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { BlogMetaInput } from "../types/blog";

/** スラッグ化（ファイル名に使えるよう変換） */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\wぁ-んァ-ン一-龥ー]/g, "_") // 記号などを _
    .replace(/_+/g, "_") // _ の連続を1つに
    .replace(/^_|_$/g, ""); // 先頭・末尾の _ を除去
}

function getToday(): string {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;
}

/** 新規記事を作成 */
function createBlogPost({ title, date, ...meta }: BlogMetaInput): void {
  if (!date) date = getToday();

  const dirName = `${date.replace(/-/g, "")}_${slugify(title)}`;
  const blogDir = path.join(process.cwd(), "content", "blog", dirName);

  if (fs.existsSync(blogDir)) {
    console.error(`⚠ ブログディレクトリ ${blogDir} はすでに存在します`);
    process.exit(1);
  }

  fs.mkdirSync(blogDir, { recursive: true });

  const data = {
    id: Math.random().toString(36).slice(2),
    title: title,
    slug: meta.slug ?? slugify(title),
    date,
    updateDate: date,
    description: meta.description ?? "",
    tags: meta.tags ?? [],
    type: meta.type ?? "user",
    version: meta.version ?? "1.0.0",
    thumbnail: meta.thumbnail ?? "",
  };

  const content = `ここに本文を書きます．`;

  const md = matter.stringify(content, data);
  const mdPath = path.join(blogDir, "index.md");
  fs.writeFileSync(mdPath, md, "utf-8");

  console.log(`✅ 新規記事を作成しました: ${mdPath}`);
}

/**
 * CLI 実行用
 * 例: npx tsx scripts/createBlogPost.ts "サイトをリリースしたのでお知らせします"
 */
if (process.argv[1] && process.argv[1].includes("createBlogPost")) {
  console.log("⚠ 新規記事を作成します");
  const title = process.argv[2];
  if (!title) {
    console.error("⚠ タイトルを指定してください: npx tsx scripts/createBlogPost.ts \"記事タイトル\"");
    process.exit(1);
  }
  createBlogPost({ title, date: getToday() });
}

export { createBlogPost };
