import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import matter from "gray-matter";
import { BlogMeta } from "../types/blog";

/** 設定：ブログルートと出力パス */
const BLOG_ROOT = path.join(process.cwd(), "content", "blog");
const OUTPUT_FILE = path.join(BLOG_ROOT, "blogMetaIndex.json");

/** 簡易抜粋生成：本文先頭の非空行を返す */
function extractSummary(markdown: string, maxLen = 140): string | undefined {
  const lines = markdown
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.startsWith("#")); // 見出し除外（必要に応じ調整）
  if (lines.length === 0) return undefined;
  const first = lines[0];
  return first.length <= maxLen ? first : first.slice(0, maxLen) + "…";
}

/** コンテンツのSHA256 */
function sha256(text: string): string {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

/** blogMetaIndex.json を生成する */
function generateBlogMetaIndex(): void {
  const directories = fs
    .readdirSync(BLOG_ROOT)
    .filter((file) => fs.statSync(path.join(BLOG_ROOT, file)).isDirectory());

  const metas: BlogMeta[] = [];

  for (const dirName of directories) {
    const dirPath = path.join(BLOG_ROOT, dirName);
    const mdPath = path.join(dirPath, "index.md");

    if (!fs.existsSync(mdPath)) {
      console.warn(`⚠ index.md が ${dirName} にありません`);
      continue;
    }

    const source = fs.readFileSync(mdPath, "utf-8");
    const parsed = matter(source);
    const data = parsed.data as Record<string, unknown>;
    const content = parsed.content;

    // ディレクトリ名から日付・フォールバックタイトル生成
    const [dateFromDir, ...titleParts] = dirName.split("-");
    const fallbackTitle = titleParts.join("_") || dirName;

    // IDがなければ生成してfront matterを書き戻し
    if (data.id === undefined) {
      data.id = Math.random().toString(36).slice(2);
      const newMd = matter.stringify(content, data);
      fs.writeFileSync(mdPath, newMd);
    }

    // summary（front matter優先，なければ本文から抽出）
    const summary =
      typeof data.summary === "string" && data.summary.trim().length > 0
        ? String(data.summary)
        : extractSummary(content);

    // tags（配列保証）
    const tags =
      Array.isArray(data.tags) && data.tags.every((t) => typeof t === "string")
        ? (data.tags as string[])
        : [];

    const meta: BlogMeta = {
      id: String(data.id),
      slug: String(data.slug || fallbackTitle),
      title: String(data.title || fallbackTitle),
      date: String(data.date || dateFromDir || "date missing"),
      updated: String(data.updateDate || data.updated || data.date || dateFromDir || "date missing" ),
      summary,
      tags,
      thumbnail: data.thumbnail ? String(data.thumbnail) : undefined,
      description: data.description ? String(data.description) : undefined,
      version: data.version ? String(data.version) : undefined,
      contentPath: path.relative(process.cwd(), mdPath).replace(/\\/g, "/"),
      contentSha256: sha256(source),
      dirName,
    };

    metas.push(meta);
  }

  // 公開日で降順ソート
  metas.sort((a , b) => (a.date < b.date ? 1 : -1));

  const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    count: metas.length,
    posts: metas,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2));
  console.log(`✅ blogMetaIndex.json (${metas.length} 件) を生成しました`);
}

generateBlogMetaIndex();
