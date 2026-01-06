export interface AcaraItem {
  _id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  image: string;
  imageHero: ImageHero;
  readTime: number;
  //event date is article date
  articleDate: string;
  attachments: Attachment[];
  content: ArticleContent;
  category: string;
  __v: number;
}

export interface ImageHero {
  createdAt: string;
  updatedAt: string;
  alt: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width: number;
  height: number;
  focalX: number;
  focalY: number;
  url: string;
}

export interface Attachment {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  filesize: number;
}

export interface ArticleContent {
  root: RootNode;
}

export interface RootNode {
  children: ParagraphNode[];
  direction: string | null;
  format: string;
  indent: number;
  type: "root";
  version: number;
}

export interface ParagraphNode {
  children: TextNode[];
  direction: string | null;
  format: string;
  indent: number;
  type: "paragraph";
  version: number;
  textFormat: number;
  textStyle: string;
}

export interface TextNode {
  detail: number;
  format: number;
  mode: "normal";
  style: string;
  text: string;
  type: "text";
  version: number;
}
