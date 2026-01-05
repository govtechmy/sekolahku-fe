export interface SiaranAcaraDocument {
  name: string;
  type: string;
  size: number;
  fileurl: string;
  isExistingFile: boolean;
  s3Url?: string;
  thumbnailUrl?: string;
}
