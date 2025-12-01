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

export interface School {
  _id: string
  checksum: string
  createdAt: string
  data: SchoolData
  kodSekolah: string
  namaSekolah: string
  updatedAt: string
  status: string
}

export interface SchoolDetailResponse {
  status: string
  statusCode: number
  data: School[]
}


