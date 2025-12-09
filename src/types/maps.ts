export type SearchBarMapProps = {
  lat: number;
  lng: number;
  namaSekolah: string;
  kodSekolah?: string;
  noTelefon?: string;
  email?: string;
  alamatSurat?: string;
  poskodSurat?: string;
  bandarSurat?: string;
  negeri?: string;
  jenisLabel?: string;
  kluster?: string;
  lokasi?: string;
  skm_150?: boolean;
  ppd?: string;
  gred?: string;
  sesi?: string;
  bantuan?: string;
  tarikhTubuh?: string;
  distance?: number;
  jumlahPelajar?: number;
  jumlahGuru?: number;
};


export type MarkerType = "INDIVIDUAL" | "GROUP";

export type SchoolMarkerInfo= {
  markerType: MarkerType;
  radiusInMeter: number;
  koordinatXX: number;
  koordinatYY: number;
  id?: string;
  name?: string;
};