interface BaseListModel {
  totalRecords: number
  pageNumber: number
  pageSize: number
}

export interface ItemSekolahModel {
  _id: string
  checksum: string
  createdAt: string
  data: SchoolData
  kodSekolah: string
  namaSekolah: string
  updatedAt: string
  status: string
}

export interface ListSekolahModel extends BaseListModel {
  items: ItemSekolahModel[]
}

export interface schoolSearchModel {
  negeri?: string
  jenis?: string
  namaSekolah?: string
}

export interface SchoolLocation {
  type: string
  coordinates: [number, number]
}

export interface SchoolInfoLokasi {
  koordinatXX: number
  koordinatYY: number
  location: SchoolLocation
}

export interface SchoolInfoPentadbiran {
  parlimen: string
  negeri: string
  ppd: string
  bantuan: string
  bilSesi: string
  sesi: string
  prasekolah: boolean
  integrasi: boolean
}

export interface SchoolInfoKomunikasi {
  noTelefon: string
  noFax: string
  email: string
  alamatSurat: string
  poskodSurat: string
  bandarSurat: string
}

export interface SchoolInfoSekolah {
  jenisLabel: string
  jumlahPelajar: number
  jumlahGuru: number
}

export interface SchoolData {
  infoSekolah: SchoolInfoSekolah
  infoKomunikasi: SchoolInfoKomunikasi
  infoPentadbiran: SchoolInfoPentadbiran
  infoLokasi: SchoolInfoLokasi
}

export interface APIResponse<T> {
  status: string
  statusCode: number
  data: T
}

export interface ViewInfoLokasi {
  koordinatXX: number
  koordinatYY: number
  zoom: number
}

export interface MarkerItem {
  kodSekolah: string
  infoLokasi: {
    koordinatXX: number
    koordinatYY: number
  }
  dataUrl: string
}

export interface MarkerGroup {
  markerType: string
  radiusInMeter: number
  items: MarkerItem[]
}

export interface NearbySchoolsModel {
  viewInfoLokasi: ViewInfoLokasi
  markerGroups: MarkerGroup[]
}

export interface NearbySchoolsParams {
  latitude?: number
  longitude?: number
  radiusInMeter?: number
}

export interface schoolSearchModel {
  negeri?: string
  jenis?: string
  namaSekolah?: string
}

export interface S3JsonModel {
  dataUrl?: string
  negeri?: string
  parlimen?: string
  kodSekolah?: string
}
