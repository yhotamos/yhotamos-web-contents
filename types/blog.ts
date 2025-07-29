/** 新規記事作成のオプション */
export interface BlogMetaInput {
  title: string;
  date: string;
  updated?: string;
  summary?: string;
  slug?: string;
  tags?: string[];
  description?: string;
  type?: string;
  version?: string;
  thumbnail?: string;
}

/** ブログ記事のメタ情報（外部配信用） */
export interface BlogMeta extends BlogMetaInput {
  id: string;
  contentPath: string;
  contentSha256: string;
  dirName: string;
}
