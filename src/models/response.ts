export interface schoolSearchModel {
  negeri?: string
  jenis?: string
  namaSekolah?: string
}

export interface SchoolData {
  _id: string
  kodSekolah: string
  namaSekolah: string
  status: string
  createdAt: string
  updatedAt: string
  data: {
    infoSekolah: {
      jenisLabel: string
      jumlahPelajar: number
      jumlahGuru: number
    }
    infoKomunikasi: {
      noTelefon?: string
      noFax?: string
      email?: string
      alamatSurat?: string
      poskodSurat?: string
      bandarSurat?: string
    }
    infoPentadbiran: {
      negeri: string
      ppd: string
      parlimen: string
      bantuan: string
      bilSesi: string
      sesi: string
      prasekolah: boolean
      integrasi: boolean
    }
    infoLokasi: {
      koordinatXX: number
      koordinatYY: number
      location: {
        type: string
        coordinates: [number, number]
      }
    }
  }
}

