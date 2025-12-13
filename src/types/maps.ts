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
  parlimen?: string;
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

export interface Coordinates {
  koordinatXX: number;
  koordinatYY: number;
}

export interface ViewInfoLokasi extends Coordinates {
  zoom: number;
}

export interface BaseMarkerGroup {
  markerType: "INDIVIDUAL";
  radiusInMeter: number;
  infoLokasi: Coordinates;
}

export interface IndividualMarkerGroup extends BaseMarkerGroup {
  kodSekolah: string;
}

export interface FindNearbyUpdatedEndpoint {
  viewInfoLokasi: ViewInfoLokasi;
  markerGroups: IndividualMarkerGroup[];
}