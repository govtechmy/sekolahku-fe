import type { SerializedEditorState, SerializedLexicalNode } from "lexical";
import type { MarkerType } from "../types/maps";
import type { Attachment } from "../types/takwim";

interface BaseListModel {
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}

export interface ItemSekolahModel {
  _id: string;
  checksum: string;
  createdAt: string;
  data: SchoolData;
  kodSekolah: string;
  namaSekolah: string;
  updatedAt: string;
  status: string;
}

export interface ListSekolahModel extends BaseListModel {
  items: ItemSekolahModel[];
}

export interface schoolSearchModel {
  negeri?: string;
  jenis?: string;
  namaSekolah?: string;
}

export interface SchoolLocation {
  type: string;
  coordinates: [number, number];
}

export interface SchoolInfoLokasi {
  koordinatXX: number;
  koordinatYY: number;
  location: SchoolLocation;
}

export interface SchoolInfoPentadbiran {
  parlimen: string;
  negeri: string;
  ppd: string;
  bantuan: string;
  bilSesi: string;
  sesi: string;
  prasekolah: boolean;
  integrasi: boolean;
}

export interface SchoolInfoKomunikasi {
  noTelefon: string;
  noFax: string;
  email: string;
  alamatSurat: string;
  poskodSurat: string;
  bandarSurat: string;
}

export interface SchoolInfoSekolah {
  jenisLabel: string;
  jumlahPelajar: number;
  jumlahGuru: number;
}

export interface SchoolData {
  infoSekolah: SchoolInfoSekolah;
  infoKomunikasi: SchoolInfoKomunikasi;
  infoPentadbiran: SchoolInfoPentadbiran;
  infoLokasi: SchoolInfoLokasi;
}

export interface APIResponse<T> {
  status: string;
  statusCode: number;
  data: T;
}

export interface ViewInfoLokasi {
  koordinatXX: number;
  koordinatYY: number;
  zoom: number;
}

export interface MarkerItem {
  markerType: MarkerType;
  kodSekolah: string;
  infoLokasi: {
    koordinatXX: number;
    koordinatYY: number;
  };
  dataUrl: string;
  total?: number;
}

export interface MarkerGroup extends MarkerItem {
  markerType:
    | "USER"
    | "GROUP"
    | "INDIVIDUAL"
    | "NEGERI"
    | "PARLIMEN"
    | "WEST_EAST_MALAYSIA";
  negeri?: string;
  parlimen?: string;
  total?: number;
  radiusInMeter: number;
  items: MarkerItem[];
  region?: string; // Added to support WEST_EAST_MALAYSIA markers
}

export interface NearbySchoolsModel {
  viewInfoLokasi: ViewInfoLokasi;
  markerGroups: MarkerGroup[];
}

export interface NearbySchoolsParams {
  latitude?: number;
  longitude?: number;
  radiusInMeter?: number;
  zoom?: number;
  name?: string;
}

export interface schoolSearchModel {
  negeri?: string;
  jenis?: string;
  namaSekolah?: string;
}

export interface S3JsonModel {
  dataUrl?: string;
  negeri?: string;
  parlimen?: string;
  kodSekolah?: string;
}

export interface CategoryItem {
  jenis: string;
  peratus: number;
  total: number;
}

export interface AnalyticsData {
  jenisLabel: CategoryItem[];
  bantuan: CategoryItem[];
}

export interface AnalyticsModel {
  jumlahSekolah: number;
  jumlahGuru: number;
  jumlahPelajar: number;
  data: AnalyticsData;
}

export interface SiaranContentNode {
  detail?: number;
  format?: number | string;
  mode?: string;
  style?: string;
  text?: string;
  type: string;
  version: number;
  children?: SiaranContentNode[];
  direction?: string | null;
  indent?: number;
  textFormat?: number;
  textStyle?: string;
}

// export interface SiaranContent {
//   root: SiaranContentNode;
// }

export type SiaranContent = SerializedEditorState<SerializedLexicalNode>;

export interface SiaranImageHero {
  _id: string;
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
  __v: number;
  url: string;
}

export interface SiaranCategory {
  _id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  value: string;
  __v: number;
  colors: string;
}

export interface SiaranItem {
  _id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  image: string;
  readTime: number;
  articleDate: string;
  attachments: Attachment[];
  content: SiaranContent;
  category: string;
  __v: number;
  imageHero: SiaranImageHero;
  categoryInfo: SiaranCategory;
}

export interface SiaranList extends BaseListModel {
  items: SiaranItem[];
}
