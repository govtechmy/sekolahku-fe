import {
  Masthead,
  MastheadHeader,
  MastheadContent,
  MastheadTitle,
  MastheadTrigger,
  MastheadSection,
} from "@govtechmy/myds-react/masthead";
import {
  PutrajayaIcon,
  Lock2Icon,
  LockFillIcon,
} from "@govtechmy/myds-react/icon";

export default function MastheadMyds() {
  return (
    <Masthead>
      <MastheadHeader>
        <MastheadTitle>Laman Web Rasmi Kerajaan Malaysia</MastheadTitle>
        <MastheadTrigger>Cara untuk mengenal pasti</MastheadTrigger>
      </MastheadHeader>
      <MastheadContent>
        <MastheadSection
          icon={<PutrajayaIcon />}
          title="Laman web rasmi kerajaan berakhir dengan .gov.my"
        >
          Jika pautan tidak berakhir dengan <b>.gov.my</b>, keluar dari laman
          web tersebut dengan segera walaupun ia kelihatan serupa.
        </MastheadSection>
        <MastheadSection
          icon={<Lock2Icon className="inline-block size-3.5" />}
          title="Laman web yang selamat menggunakan HTTPS"
        >
          Cari ikon mangga (<LockFillIcon className="inline-block size-3.5" />)
          atau https:// sebagai langkah berjaga-jaga tambahan. Jika tiada,
          jangan kongsi sebarang maklumat sensitif.
        </MastheadSection>
      </MastheadContent>
    </Masthead>
  );
}
