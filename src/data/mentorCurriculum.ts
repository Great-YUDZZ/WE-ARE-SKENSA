import { FieldGroup } from "./fields";

export interface TargetCourse {
  id: string;
  code: string;
  name: string;
  sks: number;
  minScore: number;
  coreCompetency: string;
  certificationAlignment: string;
  description: string;
}

export interface RemedialStep {
  stepNumber: string;
  phase: string;
  title: string;
  action: string;
  targetOutcome: string;
}

export interface ReferenceResource {
  title: string;
  provider: string;
  url: string;
}

export interface LearningModule {
  id: string;
  courseId: string;
  courseName: string;
  moduleCode?: string;
  semesterStage?: string;
  title: string;
  duration: string;
  level: "Dasar" | "Menengah" | "Terapan" | "Sertifikasi";
  summary: string;
  keyConcepts: string[];
  studyMaterial: string;
  baliCaseStudy: string;
  practiceTask: string;
  scoreBoost: number;
  referenceResources?: ReferenceResource[];
}

export interface CertificationQuestion {
  id: string;
  courseId?: string;
  certTrack?: string;
  certName: string;
  competencyCode: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  scoreBoost: number;
}

export interface FieldCurriculum {
  fieldId: string;
  fieldName: string;
  group: FieldGroup;
  certificationBody: string;
  mainCertificationTitle: string;
  availableCertTracks?: string[];
  targetCourses: TargetCourse[];
  remedialActionPlan: RemedialStep[];
  mismatchBridgeAdvice: string;
  learningModules: LearningModule[];
  certificationDrills: CertificationQuestion[];
}

export interface InterestQuestion {
  id: string;
  step: number;
  category: "minat" | "akademik" | "matkul";
  question: string;
  subtitle: string;
  options: {
    label: string;
    groupAffinity: FieldGroup;
    readinessWeight: number;
    feedbackHint: string;
  }[];
}

export const INTEREST_TEST_QUESTIONS: InterestQuestion[] = [
  {
    id: "q1-situasi",
    step: 1,
    category: "minat",
    question: "Saat mengerjakan proyek kelompok di sekolah, peran apa yang paling membuat Anda bersemangat?",
    subtitle: "Pilih aktivitas yang paling menggambarkan kecenderungan kerja alami Anda.",
    options: [
      {
        label: "Merancang sistem aplikasi, mengonfigurasi jaringan router/server, atau membuat desain teknis",
        groupAffinity: "teknologi",
        readinessWeight: 90,
        feedbackHint: "Afinitas kuat pada pemecahan masalah terstruktur dan rekayasa digital.",
      },
      {
        label: "Membimbing teman, memberikan edukasi kesehatan, atau melestarikan seni budaya",
        groupAffinity: "manusia",
        readinessWeight: 88,
        feedbackHint: "Afinitas kuat pada empati sosial, komunikasi manusia, dan pelestarian nilai.",
      },
      {
        label: "Meneliti kualitas tanaman, konservasi lingkungan pesisir, atau sistem irigasi lapangan",
        groupAffinity: "alam",
        readinessWeight: 88,
        feedbackHint: "Afinitas kuat pada observasi ekosistem alam dan keberlanjutan pangan.",
      },
      {
        label: "Mengatur strategi promosi, melayani tamu wisata, dan mengelola keuangan kas proyek",
        groupAffinity: "usaha",
        readinessWeight: 90,
        feedbackHint: "Afinitas kuat pada manajemen bisnis, kewirausahaan, dan layanan prima.",
      },
    ],
  },
  {
    id: "q2-fondasi-nilai",
    step: 2,
    category: "akademik",
    question: "Bagaimana rata-rata penguasaan nilai rapor dan pemahaman Anda pada mata pelajaran dasar jurusan tujuan?",
    subtitle: "Jawab secara jujur agar Agen Pembimbing dapat menyusun strategi peningkatan yang tepat.",
    options: [
      {
        label: "Sudah sangat baik (rata-rata nilai di atas 85) dan sering membuat proyek mandiri di luar jam sekolah",
        groupAffinity: "teknologi",
        readinessWeight: 92,
        feedbackHint: "Fondasi akademik sudah melampaui batas minimum program studi.",
      },
      {
        label: "Cukup baik pada teori dasar (nilai 75 - 84), tetapi masih kurang latihan praktik dan studi kasus",
        groupAffinity: "usaha",
        readinessWeight: 74,
        feedbackHint: "Memerlukan penguatan jam terbang praktik dan pendalaman mata kuliah inti.",
      },
      {
        label: "Masih agak kecil (nilai 60 - 74) dan sering kesulitan memahami konsep teknis di kelas",
        groupAffinity: "manusia",
        readinessWeight: 56,
        feedbackHint: "Terdeteksi kesenjangan nilai dasar. Memerlukan bimbingan modul fondasi bertahap.",
      },
      {
        label: "Belum sesuai karena saya berasal dari lintas minat/jurusan dan baru mulai belajar dari nol",
        groupAffinity: "alam",
        readinessWeight: 48,
        feedbackHint: "Status lintas minat. Agen akan mengaktifkan kurikulum jembatan (matriculation bridge).",
      },
    ],
  },
  {
    id: "q3-kesiapan-matkul",
    step: 3,
    category: "matkul",
    question: "Seberapa siap Anda menghadapi mata kuliah atau kompetensi inti di jurusan yang Anda tuju?",
    subtitle: "Evaluasi kesiapan terhadap silabus perkuliahan dan standar uji kompetensi keahlian.",
    options: [
      {
        label: "Sudah mengenal silabus mata kuliah inti dan pernah mencoba latihan soal sertifikasi dasar",
        groupAffinity: "teknologi",
        readinessWeight: 90,
        feedbackHint: "Kesiapan materi perkuliahan dan sertifikasi berada pada kategori matang.",
      },
      {
        label: "Hanya tahu gambaran umum jurusannya saja, belum paham detail mata kuliah yang akan dihadapi",
        groupAffinity: "usaha",
        readinessWeight: 65,
        feedbackHint: "Perlu orientasi struktur mata kuliah inti agar tidak mengalami kendala di semester awal.",
      },
      {
        label: "Merasa nilai prasyarat mata kuliah (seperti logika, jaringan, analisis, atau bahasa) masih di bawah standar",
        groupAffinity: "manusia",
        readinessWeight: 52,
        feedbackHint: "Perlu intervensi materi prasyarat mata kuliah dan latihan uji kompetensi terarah.",
      },
      {
        label: "Masih ragu apakah kemampuan saat ini sanggup mengikuti standar kelulusan kompetensi jurusan tersebut",
        groupAffinity: "alam",
        readinessWeight: 45,
        feedbackHint: "Agen Pembimbing akan mendampingi dari materi pengantar hingga simulasi sertifikasi.",
      },
    ],
  },
  {
    id: "q4-portofolio",
    step: 4,
    category: "akademik",
    question: "Bagaimana pengalaman Anda dalam mengikuti ujian sertifikasi atau menyusun portofolio keahlian?",
    subtitle: "Sertifikasi kompetensi menjadi bukti objektif untuk menutup kekurangan nilai akademik.",
    options: [
      {
        label: "Sudah memiliki sertifikat kompetensi (CCNA/MTCNA/BNSP/Adobe) dan portofolio proyek terdokumentasi",
        groupAffinity: "teknologi",
        readinessWeight: 94,
        feedbackHint: "Portofolio dan sertifikasi sudah siap mendukung seleksi masuk.",
      },
      {
        label: "Pernah mengerjakan tugas praktik sekolah, namun belum terstandar uji sertifikasi industri",
        groupAffinity: "usaha",
        readinessWeight: 68,
        feedbackHint: "Perlu penyelarasan tugas sekolah ke standar unit kompetensi sertifikasi.",
      },
      {
        label: "Belum pernah mengikuti simulasi sertifikasi dan nilai praktik masih perlu banyak perbaikan",
        groupAffinity: "manusia",
        readinessWeight: 50,
        feedbackHint: "Prioritas utama adalah menyelesaikan modul terapan dan latihan soal sertifikasi.",
      },
      {
        label: "Butuh panduan langkah demi langkah dari materi paling dasar sampai siap ujian sertifikasi",
        groupAffinity: "alam",
        readinessWeight: 42,
        feedbackHint: "Mode bimbingan intensif diaktifkan untuk membangun kompetensi dari dasar.",
      },
    ],
  },
];

export const MENTOR_CURRICULUM_BY_FIELD: Record<string, FieldCurriculum> = {
  // 1. TKJ / TJKT (Cisco CCNA, MikroTik MTCNA, Administrasi Server Linux & Cloud)
  tkj: {
    fieldId: "tkj",
    fieldName: "Teknik Jaringan Komputer, Telekomunikasi & Cloud (TKJ / TJKT)",
    group: "teknologi",
    certificationBody: "Cisco Networking Academy, MikroTik Academy & BNSP LSP TKJ",
    mainCertificationTitle: "Sertifikasi Internasional Cisco CCNA (200-301), MikroTik MTCNA & BNSP Teknisi Jaringan",
    availableCertTracks: [
      "MikroTik MTCNA",
      "Cisco CCNA 200-301",
      "BNSP Teknisi Jaringan & Linux Server",
    ],
    targetCourses: [
      {
        id: "tkj-mtcna",
        code: "TKJ101",
        name: "Manajemen RouterOS, Firewall & QoS (Kurikulum MikroTik MTCNA)",
        sks: 4,
        minScore: 78,
        coreCompetency: "RouterOS CLI/WinBox, NAT Masquerade, Firewall Filter, Simple Queue & PCQ",
        certificationAlignment: "MikroTik MTCNA",
        description: "Penguasaan 9 modul resmi MikroTik Certified Network Associate mulai dari konfigurasi dasar, DHCP, Bridging, Static Routing, Wireless, Firewall NAT, hingga manajemen bandwidth QoS.",
      },
      {
        id: "tkj-ccna",
        code: "TKJ202",
        name: "Enterprise Switching, VLAN & OSPF Routing (Kurikulum Cisco CCNA 200-301)",
        sks: 4,
        minScore: 80,
        coreCompetency: "IPv4/IPv6 Subnetting VLSM, VLAN Trunking 802.1Q, STP, Single-Area OSPFv2 & ACL",
        certificationAlignment: "Cisco CCNA 200-301",
        description: "Perancangan jaringan skala enterprise berstandar Cisco IOS mencakup segmentasi VLAN, protokol routing dinamis OSPF, redundansi jaringan, dan pengamanan port.",
      },
      {
        id: "tkj-sysadmin",
        code: "TKJ304",
        name: "Administrasi Server Linux, Fiber Optik & Cloud Infrastructure",
        sks: 4,
        minScore: 77,
        coreCompetency: "Debian/Ubuntu Server, DNS BIND9, Nginx Reverse Proxy, Splicing FTTH & Keamanan SSH",
        certificationAlignment: "BNSP Teknisi Jaringan & Linux Server",
        description: "Instalasi layanan server produksi, terminasi jaringan fiber optik GPON/FTTH, kontainerisasi aplikasi, serta mitigasi serangan siber.",
      },
    ],
    remedialActionPlan: [
      {
        stepNumber: "01",
        phase: "Bulan 1: Fondasi Pengalamatan IP & Subnetting CIDR",
        title: "Kuasai Konversi Biner, Subnet Mask, dan Perhitungan VLSM",
        action: "Pelajari Modul 1 dan Modul 2 di bawah untuk memahami pembagian blok IP Address (/24 hingga /30), penentuan Network ID, Broadcast ID, dan rentang Host valid tanpa kalkulator.",
        targetOutcome: "Mampu menghitung subnetting IPv4 untuk multi-divisi dalam waktu kurang dari 2 menit per soal.",
      },
      {
        stepNumber: "02",
        phase: "Bulan 2: Laboratorium Virtual MikroTik MTCNA (RouterOS)",
        title: "Praktik Konfigurasi Dasar, Firewall NAT, dan Bandwidth Management PCQ",
        action: "Selesaikan Modul 3, 4, dan 5 berfokus pada silabus resmi MikroTik MTCNA (DHCP, Bridging, Firewall Input/Forward, DstNAT Port Forwarding, dan Simple Queue PCQ).",
        targetOutcome: "Lulus simulasi ujian MikroTik MTCNA dengan skor minimal 80% (melampaui batas lulus resmi 60%).",
      },
      {
        stepNumber: "03",
        phase: "Bulan 3: Simulasi Enterprise Cisco CCNA (Switching & OSPF)",
        title: "Implementasi VLAN 802.1Q, Inter-VLAN Routing, dan OSPFv2",
        action: "Pelajari Modul 6 dan 7 untuk mempraktikkan perintah Cisco IOS (switchport mode trunk, router ospf, standard/extended ACL) dan kerjakan soal ujian CCNA 200-301.",
        targetOutcome: "Menguasai topologi jaringan bertingkat (Core, Distribution, Access) berstandar industri.",
      },
      {
        stepNumber: "04",
        phase: "Bulan 4: Administrasi Server Linux, FTTH & Uji Kompetensi BNSP",
        title: "Deploy Web/DNS Server Linux dan Portofolio Topologi Jaringan",
        action: "Tuntaskan Modul 8 untuk membangun server Debian/Ubuntu terproteksi firewall dan dokumentasikan topologi jaringan hotel/sekolah sebagai portofolio UKK.",
        targetOutcome: "Siap menghadapi UKK TKJ, sertifikasi CCNA/MTCNA, dan seleksi PNB/SKENSA/Undiksha.",
      },
    ],
    mismatchBridgeAdvice:
      "Jika nilai awal Anda pada jaringan komputer masih kecil atau Anda baru beralih ke bidang TKJ/TJKT, jangan langsung menghafal ratusan perintah terminal. Mulailah dari memahami bagaimana paket data berjalan dari ponsel ke internet (OSI 7 Layer & analogi alamat surat IP Address), lalu praktikkan bertahap menggunakan simulator GNS3, EVE-NG, atau Cisco Packet Tracer.",
    learningModules: [
      {
        id: "mod-tkj-1",
        courseId: "tkj-ccna",
        courseName: "Enterprise Switching & OSPF (TKJ202 - CCNA)",
        moduleCode: "CCNA-MOD-01",
        semesterStage: "Semester 1 / Fondasi Jaringan",
        title: "Modul 1: Arsitektur OSI 7 Layer, TCP/IP, dan Subnetting IPv4 (VLSM)",
        duration: "60 Menit",
        level: "Dasar",
        summary: "Memahami enkapsulasi paket data dari lapisan fisik hingga aplikasi serta teknik pembagian subnet efisien menggunakan Variable Length Subnet Mask.",
        keyConcepts: [
          "Enkapsulasi Data: Data -> Segment (Layer 4 TCP/UDP) -> Packet (Layer 3 IP) -> Frame (Layer 2 MAC) -> Bits (Layer 1 Fisik)",
          "Perbedaan TCP (Connection-oriented, Three-Way Handshake SYN, SYN-ACK, ACK) vs UDP (Connectionless, latensi rendah untuk VoIP/Streaming)",
          "Rumus Jumlah Host Valid per Subnet: (2 pangkat n) - 2, di mana n adalah jumlah bit host (angka 0 pada subnet mask biner)",
          "Prefix CIDR Populer: /24 (254 host), /25 (126 host), /26 (62 host), /27 (30 host), /28 (14 host), /30 (2 host khusus link point-to-point antar router)",
        ],
        studyMaterial:
          "Dalam silabus Cisco CCNA 200-301 (Domain 1: Network Fundamentals), kemampuan memetakan masalah ke lapisan OSI yang tepat adalah kunci troubleshooting. Jika lampu indikator port mati atau terjadi CRC error, masalah berada di Layer 1 (Physical). Jika terjadi kegagalan VLAN atau MAC flapping, masalah berada di Layer 2 (Data Link). Jika IP Address salah subnet atau gateway tidak terjangkau, masalah berada di Layer 3 (Network). Dalam merancang jaringan dengan VLSM, selalu urutkan kebutuhan ruangan dari jumlah host terbesar ke terkecil agar tidak terjadi tumpang tindih blok alamat IP (overlapping subnet).",
        baliCaseStudy:
          "Studi Kasus Bali: Perancangan skema pengalamatan VLSM pada resort di Nusa Dua yang memisahkan subnet Tamu VIP (120 host -> /25), Staf Operasional (50 host -> /26), CCTV Keamanan (25 host -> /27), dan Link Antar-Router Gedung (2 host -> /30).",
        practiceTask:
          "Hitung Network Address, Host Pertama, Host Terakhir, dan Broadcast Address untuk IP 192.168.10.65/26!",
        scoreBoost: 6,
        referenceResources: [
          {
            title: "Cisco Networking Basics & IP Addressing",
            provider: "Cisco Skills for All (NetAcad)",
            url: "https://skillsforall.com/",
          },
          {
            title: "CCNA 200-301 Official Exam Topics",
            provider: "Cisco Learning Network",
            url: "https://learningnetwork.cisco.com/s/ccna-exam-topics",
          },
        ],
      },
      {
        id: "mod-tkj-2",
        courseId: "tkj-mtcna",
        courseName: "Manajemen RouterOS & Firewall (TKJ101 - MTCNA)",
        moduleCode: "MTCNA-MOD-01",
        semesterStage: "Semester 1 / Kurikulum MTCNA",
        title: "Modul 2: Pengenalan MikroTik RouterOS, CLI, Backup vs Export, dan DHCP/ARP",
        duration: "55 Menit",
        level: "Dasar",
        summary: "Menguasai akses pertama RouterBOARD melalui WinBox MAC-Address, struktur perintah CLI, pengelolaan DHCP Lease, serta mode keamanan ARP.",
        keyConcepts: [
          "Akses Pertama RouterOS: Menggunakan MAC-WinBox (Layer 2) saat router belum memiliki IP Address atau setelah di-reset tanpa konfigurasi default",
          "Perbedaan File Backup (.backup) vs Export (.rsc): File .backup bersifat biner untuk router yang identik, sedangkan `/export file=konfig` menghasilkan skrip teks (.rsc) yang bisa dibaca dan diedit sebagian",
          "Tahapan Kerja DHCP (DORA): Discover -> Offer -> Request -> Acknowledge untuk pembagian IP otomatis ke klien",
          "Pengamanan Static ARP (`arp=reply-only` pada interface LAN dikombinasikan dengan opsi `Add ARP For Leases` di DHCP Server) untuk mencegah pengguna mengganti IP secara manual",
        ],
        studyMaterial:
          "Sesuai Modul 1 dan Modul 2 silabus resmi MikroTik MTCNA, langkah awal konfigurasi router untuk terhubung ke internet meliputi: (1) Mengatur IP WAN atau mengaktifkan `/ip dhcp-client` pada interface ether1, (2) Menambahkan IP Address LAN pada interface ether2/bridge (`/ip address add address=192.168.88.1/24 interface=bridge1`), (3) Mengatur `/ip dns set servers=8.8.8.8 allow-remote-requests=yes`, dan (4) Menjalankan `/ip dhcp-server setup` untuk mendistribusikan IP ke perangkat lokal.",
        baliCaseStudy:
          "Studi Kasus Bali: Standarisasi skrip konfigurasi (.rsc) pada 30 unit router MikroTik di jaringan sekolah menengah dan balai banjar pintar se-Kota Denpasar.",
        practiceTask:
          "Tuliskan urutan perintah CLI RouterOS untuk memberi nama identitas router menjadi 'R1-SKENSA' dan menambahkan IP 10.10.1.1/24 pada interface ether2.",
        scoreBoost: 6,
        referenceResources: [
          {
            title: "MikroTik RouterOS Official Documentation",
            provider: "MikroTik Docs",
            url: "https://help.mikrotik.com/docs/display/ROS/RouterOS",
          },
          {
            title: "MTCNA Training Outline & Objectives",
            provider: "MikroTik Academy",
            url: "https://mikrotik.com/training/about",
          },
        ],
      },
      {
        id: "mod-tkj-3",
        courseId: "tkj-mtcna",
        courseName: "Manajemen RouterOS & Firewall (TKJ101 - MTCNA)",
        moduleCode: "MTCNA-MOD-06",
        semesterStage: "Semester 2 / Kurikulum MTCNA",
        title: "Modul 3: MikroTik Firewall Filter Chains (Input, Forward, Output) & NAT (Masquerade / DstNAT)",
        duration: "65 Menit",
        level: "Menengah",
        summary: "Mengamankan trafik jaringan menggunakan Stateful Packet Inspection pada 3 chain utama serta menerjemahkan IP privat ke publik dengan SrcNAT dan DstNAT.",
        keyConcepts: [
          "Chain INPUT: Memproses paket yang tujuan akhirnya adalah IP milik Router itu sendiri (misalnya proteksi akses login WinBox/SSH dari publik)",
          "Chain FORWARD: Memproses paket yang sekadar melewati router dari satu jaringan ke jaringan lain (misalnya trafik dari klien LAN menuju internet)",
          "Chain OUTPUT: Memproses paket yang berasal dari dalam router menuju keluar",
          "SrcNAT Masquerade: Mengubah alamat IP pengirim privat (LAN) menjadi IP publik router saat keluar ke internet (`/ip firewall nat add chain=srcnat out-interface=ether1 action=masquerade`)",
          "DstNAT (Port Forwarding): Membelokkan trafik dari luar yang menuju IP publik router ke server internal di dalam LAN (`action=dst-nat to-addresses=192.168.1.10 to-ports=80`)",
        ],
        studyMaterial:
          "Pada ujian sertifikasi MTCNA (Modul 6: Firewall), pembedaan antara chain `input` dan `forward` adalah materi yang paling sering diujikan. Aturan firewall dieksekusi secara berurutan dari baris paling atas ke bawah (top-to-bottom) sampai ditemukan kecocokan. Untuk mengamankan router tanpa memutus koneksi yang sedang berjalan, aturan pertama yang wajib dipasang adalah menerima (accept) paket berstatus `connection-state=established,related`, kemudian menjatuhkan (drop) paket `connection-state=invalid`.",
        baliCaseStudy:
          "Studi Kasus Bali: Konfigurasi DstNAT Port Forwarding pada router MikroTik rumah sakit di Denpasar agar server sistem antrean lokal dapat diakses aman oleh klinik cabang, sekaligus memblokir akses login WinBox dari internet menggunakan chain Input.",
        practiceTask:
          "Buat aturan CLI `/ip firewall filter` untuk memblokir (drop) komputer klien ber-IP 192.168.10.25 agar tidak bisa melakukan ping (protocol icmp) ke internet tanpa memblokir akses ke router!",
        scoreBoost: 7,
        referenceResources: [
          {
            title: "Packet Flow & Firewall Filter in RouterOS",
            provider: "MikroTik Documentation",
            url: "https://help.mikrotik.com/docs/display/ROS/Filter",
          },
          {
            title: "Network Address Translation (NAT) Guide",
            provider: "MikroTik Documentation",
            url: "https://help.mikrotik.com/docs/display/ROS/NAT",
          },
        ],
      },
      {
        id: "mod-tkj-4",
        courseId: "tkj-mtcna",
        courseName: "Manajemen RouterOS & Firewall (TKJ101 - MTCNA)",
        moduleCode: "MTCNA-MOD-07",
        semesterStage: "Semester 2 / Kurikulum MTCNA",
        title: "Modul 4: Manajemen Bandwidth QoS (Simple Queue, CIR/MIR, Burst & PCQ)",
        duration: "60 Menit",
        level: "Menengah",
        summary: "Mengatur pembagian kecepatan internet secara adil bagi ratusan pengguna menggunakan Simple Queue, garansi bandwidth (limit-at), dan Per Connection Queue (PCQ).",
        keyConcepts: [
          "MIR (Maximum Information Rate / `max-limit`): Batas kecepatan tertinggi yang boleh dicapai klien saat bandwidth sedang senggang",
          "CIR (Committed Information Rate / `limit-at`): Jaminan kecepatan minimum yang pasti didapatkan klien meskipun jaringan sedang padat",
          "Mekanisme PCQ (Per Connection Queue): Membagi rata kapasitas bandwidth ke seluruh IP aktif secara otomatis tanpa membuat ribuan baris Simple Queue manual",
          "PCQ Classifier: `pcq-upload-default` mengelompokkan berdasarkan `src-address`, sedangkan `pcq-download-default` mengelompokkan berdasarkan `dst-address`",
        ],
        studyMaterial:
          "Dalam Modul 7 MTCNA (Quality of Service), penggunaan Simple Queue murni menjadi tidak efisien apabila jumlah pengguna WiFi mencapai ratusan siswa atau tamu hotel. Solusinya adalah menggabungkan Simple Queue dengan antrean berjenis PCQ. Jika parameter `pcq-rate=0` diatur pada Queue Type PCQ, maka router akan membagi total `max-limit` secara merata ke seluruh perangkat yang sedang mengunduh saat itu. Jika `pcq-rate=2M`, maka setiap perangkat dibatasi maksimal 2 Mbps.",
        baliCaseStudy:
          "Studi Kasus Bali: Implementasi manajemen bandwidth PCQ pada jaringan co-working space di Canggu dan Ubud agar panggilan video konferensi pekerja remote tidak terganggu oleh aktivitas unduhan file besar.",
        practiceTask:
          "Jelaskan perbedaan perilaku pembagian bandwidth pada PCQ apabila nilai `pcq-rate` diisi 0 dibanding diisi 5M pada pipa internet berkapasitas total 100 Mbps!",
        scoreBoost: 7,
        referenceResources: [
          {
            title: "Queues & PCQ Configuration in RouterOS",
            provider: "MikroTik Help",
            url: "https://help.mikrotik.com/docs/display/ROS/Queues",
          },
        ],
      },
      {
        id: "mod-tkj-5",
        courseId: "tkj-ccna",
        courseName: "Enterprise Switching & OSPF (TKJ202 - CCNA)",
        moduleCode: "CCNA-MOD-02",
        semesterStage: "Semester 3 / Kurikulum CCNA",
        title: "Modul 5: VLAN Segmentation, 802.1Q Trunking, Native VLAN & Inter-VLAN Routing (Router-on-a-Stick)",
        duration: "65 Menit",
        level: "Terapan",
        summary: "Memecah broadcast domain pada switch Layer 2 menggunakan Virtual LAN (VLAN) dan menghubungkan komunikasi antar-VLAN melalui sub-interface router.",
        keyConcepts: [
          "Access Port (`switchport mode access`): Port switch yang terhubung ke perangkat akhir (PC/Printer) dan hanya membawa trafik untuk 1 VLAN",
          "Trunk Port (`switchport mode trunk`): Jalur penghubung antar-switch atau switch-ke-router yang membawa trafik banyak VLAN sekaligus menggunakan penandaan tag IEEE 802.1Q",
          "Native VLAN: Lalu lintas frame yang melewati jalur Trunk tanpa diberi label tag VLAN (default VLAN 1; praktik keamanan CCNA mewajibkan memindahkan Native VLAN ke ID khusus yang tidak terpakai)",
          "Router-on-a-Stick (ROAS): Konfigurasi sub-interface pada satu port fisik router (misal `GigabitEthernet0/0.10`) dengan perintah `encapsulation dot1Q 10` sebagai default gateway masing-masing VLAN",
        ],
        studyMaterial:
          "Pada ujian Cisco CCNA 200-301 (Domain 2: Network Access), pemisahan VLAN bertujuan meningkatkan keamanan, menekan lalu lintas broadcast yang tidak perlu, dan mempermudah manajemen kebijakan per divisi. Perangkat di VLAN 10 (Akademik) tidak dapat berkomunikasi langsung dengan VLAN 20 (Keuangan) meskipun tercolok pada switch fisik yang sama, kecuali difasilitasi oleh perangkat Layer 3 (Router atau Multilayer Switch melalui Switched Virtual Interface / SVI).",
        baliCaseStudy:
          "Studi Kasus Bali: Segmentasi VLAN pada gedung kampus Politeknik Negeri Bali dan SMKN 1 Denpasar yang memisahkan jaringan Laboratorium Ujian, Server Akademik, dan WiFi Tamu.",
        practiceTask:
          "Tuliskan rangkaian perintah Cisco IOS untuk membuat VLAN 20 bernama 'LAB_RPL' dan mengatur port FastEthernet0/5 menjadi mode access untuk VLAN 20!",
        scoreBoost: 7,
        referenceResources: [
          {
            title: "Switching, Routing, and Wireless Essentials (SRWE)",
            provider: "Cisco Networking Academy",
            url: "https://www.netacad.com/",
          },
        ],
      },
      {
        id: "mod-tkj-6",
        courseId: "tkj-ccna",
        courseName: "Enterprise Switching & OSPF (TKJ202 - CCNA)",
        moduleCode: "CCNA-MOD-03",
        semesterStage: "Semester 3 / Kurikulum CCNA",
        title: "Modul 6: Dynamic Routing Single-Area OSPFv2, Administrative Distance & Access Control List (ACL)",
        duration: "70 Menit",
        level: "Sertifikasi",
        summary: "Mengonfigurasi protokol routing link-state OSPF untuk pertukaran tabel rute otomatis serta menyaring paket menggunakan Standard dan Extended ACL.",
        keyConcepts: [
          "Urutan Prioritas Administrative Distance (AD): Connected (0), Static Route (1), eBGP (20), EIGRP Internal (90), OSPF (110), RIP (120)",
          "Mekanisme OSPF (Open Shortest Path First): Menggunakan algoritma Dijkstra (SPF), metrik Cost berdasarkan kapasitas Bandwidth referensi (`10^8 / bandwidth`), dan pertukaran paket Hello setiap 10 detik pada jaringan Broadcast",
          " Pemilihan Router ID OSPF: (1) Dikonfigurasi manual dengan perintah `router-id`, (2) IP tertinggi pada interface Loopback aktif, (3) IP tertinggi pada interface fisik aktif",
          "Penempatan ACL (Access Control List): Standard ACL (hanya memeriksa IP pengirim) dipasang sedekat mungkin dengan tujuan (destination), sedangkan Extended ACL (memeriksa IP pengirim, tujuan, protokol, dan port) dipasang sedekat mungkin dengan sumber (source)",
        ],
        studyMaterial:
          "Dalam Domain 3 (IP Connectivity) dan Domain 5 (Security Fundamentals) CCNA 200-301, ketika sebuah router menerima beberapa jalur menuju subnet yang sama dari protokol berbeda, router memilih protokol dengan Administrative Distance (AD) terkecil. Однако saat meneruskan paket data (packet forwarding), router selalu mengutamakan aturan Longest Prefix Match (misalnya rute `/28` akan selalu dipilih mengalahkan rute `/24` maupun `/16` meskipun nilai AD-nya lebih besar).",
        baliCaseStudy:
          "Studi Kasus Bali: Interkoneksi jaringan antar-cabang rumah sakit daerah dan kantor pemerintahan kabupaten di Bali menggunakan protokol routing OSPF Area 0 dengan redundansi jalur fiber optik.",
        practiceTask:
          "Jika sebuah router memiliki rute menuju 10.1.1.0/24 via OSPF (AD 110) dan rute menuju 10.1.1.0/26 via RIP (AD 120), jalur manakah yang akan dipilih router untuk mengirim paket ke IP 10.1.1.15? Jelaskan alasannya!",
        scoreBoost: 7,
        referenceResources: [
          {
            title: "IP Routing & OSPF Configuration Guide",
            provider: "Cisco Documentation",
            url: "https://www.cisco.com/c/en/us/support/docs/ip/open-shortest-path-first-ospf/7039-1.html",
          },
        ],
      },
      {
        id: "mod-tkj-7",
        courseId: "tkj-sysadmin",
        courseName: "Administrasi Server Linux & Cloud (TKJ304)",
        moduleCode: "SYS-MOD-01",
        semesterStage: "Semester 4 / Infrastruktur Server",
        title: "Modul 7: Administrasi Server Linux Debian/Ubuntu, DNS BIND9, Nginx Reverse Proxy & Keamanan SSH",
        duration: "65 Menit",
        level: "Terapan",
        summary: "Membangun server layanan web dan penamaan domain mandiri berbasis Linux serta mengamankan akses administrasi jarak jauh.",
        keyConcepts: [
          "Struktur Hak Akses File Linux (chmod & chown): Read (4), Write (2), Execute (1) untuk Owner, Group, dan Others (contoh: `chmod 600` untuk file kunci privat SSH)",
          "Konfigurasi DNS Server BIND9: Forward Zone (menerjemahkan nama domain ke IP Address melalui A Record / CNAME) dan Reverse Zone (menerjemahkan IP ke nama domain melalui PTR Record)",
          "Nginx Web Server & Reverse Proxy: Meneruskan permintaan HTTP/HTTPS publik ke aplikasi backend internal serta pengelolaan sertifikat SSL/TLS Let's Encrypt",
          "SSH Hardening (`/etc/ssh/sshd_config`): Mengubah port default, menonaktifkan `PermitRootLogin no`, dan mewajibkan autentikasi berbasis SSH Key-Pair dibanding kata sandi biasa",
        ],
        studyMaterial:
          "Seorang teknisi jaringan dan sistem (System Administrator) wajib menguasai sistem operasi Linux karena lebih dari 80% server cloud dunia berjalan di atas kernel Linux. Saat menyiapkan server produksi, pastikan firewall sisi host (`ufw` atau `iptables/nftables`) hanya membuka port layanan yang benar-benar dibutuhkan (misalnya port 80/HTTP, 443/HTTPS, dan port khusus SSH).",
        baliCaseStudy:
          "Studi Kasus Bali: Deployment server portal akademik dan ujian berbasis komputer (CBT) mandiri menggunakan Ubuntu Server dan Nginx pada SMK di Bali.",
        practiceTask:
          "Tuliskan konfigurasi singkat blok `server` pada Nginx untuk meneruskan akses domain `ujian.sekolah.sch.id` ke aplikasi lokal yang berjalan di `http://127.0.0.1:3000`!",
        scoreBoost: 6,
        referenceResources: [
          {
            title: "Ubuntu Server Official Documentation",
            provider: "Canonical Ubuntu",
            url: "https://ubuntu.com/server/docs",
          },
          {
            title: "Debian Administrator's Handbook",
            provider: "Debian Project",
            url: "https://debian-handbook.info/",
          },
        ],
      },
      {
        id: "mod-tkj-8",
        courseId: "tkj-sysadmin",
        courseName: "Administrasi Server Linux & Cloud (TKJ304)",
        moduleCode: "FTTH-MOD-02",
        semesterStage: "Semester 4 / Telekomunikasi Fiber Optik",
        title: "Modul 8: Arsitektur Jaringan Fiber Optik GPON/FTTH, Fusion Splicing & Perhitungan Link Power Budget",
        duration: "60 Menit",
        level: "Sertifikasi",
        summary: "Memahami topologi jaringan optik pasif dari OLT hingga ONT serta menghitung redaman daya cahaya menggunakan OPM dan OTDR.",
        keyConcepts: [
          "Komponen Utama FTTH GPON: OLT (Optical Line Terminal di pusat/provider) -> ODC -> ODP (Optical Distribution Point dengan Passive Splitter 1:8 / 1:16) -> ONT/ONU di rumah pelanggan",
          "Perbedaan Single-Mode Fiber (SMF, inti 9 mikron, cahaya laser 1310nm/1550nm untuk jarak puluhan km) vs Multi-Mode Fiber (MMF, inti 50/62.5 mikron untuk jarak pendek dalam gedung)",
          "Standar Redaman (Attenuation Loss): Kabel optik (~0.35 dB/km pada 1310nm), Konektor (~0.25 dB/titik), Fusion Splice (~0.1 dB/sambungan), Splitter 1:8 (~10.5 dB)",
          "Rentang Daya Terima Ideal (Rx Power) pada ONT Pelanggan: antara -8 dBm hingga -25 dBm (jika mencapai -30 dBm, sinyal kritis/putus)",
        ],
        studyMaterial:
          "Dalam skema sertifikasi BNSP Teknisi Jaringan dan Telekomunikasi, penyambungan serat kaca menggunakan alat Fusion Splicer menuntut ketelitian tinggi saat pengupasan coating (stripper), pembersihan dengan alkohol isopropil 99%, dan pemotongan rata presisi menggunakan Fiber Cleaver. Setelah tersambung, teknisi wajib mengukur daya terima menggunakan Optical Power Meter (OPM) dan melacak titik putus kabel menggunakan Optical Time Domain Reflectometer (OTDR).",
        baliCaseStudy:
          "Studi Kasus Bali: Perluasan jaringan internet fiber optik desa (FTTH) untuk mendukung kawasan homestay dan UMKM di Kabupaten Gianyar dan Karangasem.",
        practiceTask:
          "Jika daya pancar SFP OLT adalah +3 dBm dan total redaman sepanjang jalur (splitter, konektor, dan kabel) sebesar 21 dB, berapakah nilai Rx Power yang terukur di ONT pelanggan? Apakah masih memenuhi standar?",
        scoreBoost: 6,
      },
    ],
    certificationDrills: [
      {
        id: "cert-tkj-mtcna-1",
        courseId: "tkj-mtcna",
        certTrack: "MikroTik MTCNA",
        certName: "Ujian Sertifikasi MikroTik MTCNA (Module 6: Firewall & NAT)",
        competencyCode: "MTCNA-FW-01",
        question: "Seorang teknisi jaringan di SMK ingin memblokir akses login WinBox (TCP port 8291) yang berasal dari jaringan publik (interface ether1-WAN) menuju ke Router MikroTik itu sendiri, tetapi tetap mengizinkan akses dari jaringan lokal (LAN). Chain manakah yang wajib digunakan pada `/ip firewall filter`?",
        options: [
          "chain=forward in-interface=ether1-WAN protocol=tcp dst-port=8291 action=drop",
          "chain=input in-interface=ether1-WAN protocol=tcp dst-port=8291 action=drop",
          "chain=output out-interface=ether1-WAN protocol=tcp dst-port=8291 action=accept",
          "chain=srcnat out-interface=ether1-WAN action=masquerade",
        ],
        correctIndex: 1,
        explanation:
          "Benar! Dalam silabus MikroTik MTCNA Modul 6, seluruh trafik yang tujuan akhirnya adalah layanan milik Router MikroTik itu sendiri (seperti WinBox port 8291, SSH, WebFig, atau ICMP ping ke IP router) diproses di dalam `chain=input`. Chain `forward` hanya untuk trafik yang melintasi router menuju perangkat lain.",
        scoreBoost: 7,
      },
      {
        id: "cert-tkj-mtcna-2",
        courseId: "tkj-mtcna",
        certTrack: "MikroTik MTCNA",
        certName: "Ujian Sertifikasi MikroTik MTCNA (Module 7: QoS & PCQ)",
        competencyCode: "MTCNA-QOS-02",
        question: "Saat mengonfigurasi pembagian bandwidth adil menggunakan metode PCQ (Per Connection Queue) pada MikroTik RouterOS, parameter Classifier manakah yang tepat dipilih untuk antrean trafik DOWNLOAD menuju komputer klien di LAN?",
        options: [
          "dst-address (Alamat IP tujuan paket unduhan, yaitu IP masing-masing klien LAN)",
          "src-address (Alamat IP server web di internet)",
          "src-mac-address milik modem ISP",
          "in-interface milik port serial console",
        ],
        correctIndex: 0,
        explanation:
          "Tepat! Untuk trafik Download (dari internet menuju klien LAN), alamat yang membedakan satu komputer klien dengan klien lainnya adalah alamat tujuan paket (`dst-address`). Sebaliknya, untuk trafik Upload digunakan `src-address`.",
        scoreBoost: 7,
      },
      {
        id: "cert-tkj-mtcna-3",
        courseId: "tkj-mtcna",
        certTrack: "MikroTik MTCNA",
        certName: "Ujian Sertifikasi MikroTik MTCNA (Module 1 & 2: System & ARP)",
        competencyCode: "MTCNA-SYS-03",
        question: "Apakah perbedaan mendasar antara hasil perintah `/system backup save` (.backup) dengan perintah `/export file=konfigurasi` (.rsc) pada MikroTik RouterOS?",
        options: [
          "File .backup berupa teks biasa yang bisa diedit di Notepad, sedangkan .rsc berupa file terenkripsi biner",
          "File .rsc berupa skrip perintah CLI berbasis teks yang dapat dibaca, diedit sebagian, dan diterapkan lintas tipe RouterBOARD, sedangkan .backup adalah file biner utuh untuk pemulihan perangkat identik",
          "Perintah /export otomatis menghapus seluruh lisensi RouterOS menjadi Level 0",
          "Kedua perintah menghasilkan file gambar berformat PNG",
        ],
        correctIndex: 1,
        explanation:
          "Benar! Sesuai Modul 1 MTCNA, `/export` menghasilkan file teks `.rsc` berisi perintah CLI yang mudah diaudit dan dipindahkan antar model router yang berbeda, sementara `.backup` bersifat biner.",
        scoreBoost: 6,
      },
      {
        id: "cert-tkj-ccna-1",
        courseId: "tkj-ccna",
        certTrack: "Cisco CCNA 200-301",
        certName: "Ujian Sertifikasi Cisco CCNA 200-301 (IP Connectivity)",
        competencyCode: "CCNA-3.1-ROUTE",
        question: "Sebuah router Cisco memiliki tiga entri di dalam tabel routingnya:\n1) O 10.10.0.0/16 [110/20] via 192.168.1.2\n2) D 10.10.4.0/22 [90/28160] via 192.168.1.6\n3) R 10.10.4.0/26 [120/2] via 192.168.1.10\nJika terdapat paket dengan IP tujuan 10.10.4.35, ke next-hop manakah paket tersebut akan diteruskan oleh router?",
        options: [
          "192.168.1.2 karena OSPF adalah protokol standar terbuka",
          "192.168.1.6 karena EIGRP memiliki Administrative Distance terkecil (90)",
          "192.168.1.10 karena rute 10.10.4.0/26 memiliki kecocokan prefix terpanjang (Longest Prefix Match) yang mencakup IP 10.10.4.35",
          "Paket langsung dibuang (dropped) karena terdapat tiga protokol berbeda",
        ],
        correctIndex: 2,
        explanation:
          "Benar sekali! Dalam Cisco CCNA (Domain 3.1), saat meneruskan paket data, aturan pertama yang dievaluasi router di dalam tabel routing adalah Longest Prefix Match (prefix paling spesifik). Subnet 10.10.4.0/26 mencakup rentang 10.10.4.0 hingga 10.10.4.63, sehingga lebih spesifik (/26) dibandingkan /22 maupun /16.",
        scoreBoost: 7,
      },
      {
        id: "cert-tkj-ccna-2",
        courseId: "tkj-ccna",
        certTrack: "Cisco CCNA 200-301",
        certName: "Ujian Sertifikasi Cisco CCNA 200-301 (Network Access & VLAN)",
        competencyCode: "CCNA-2.2-VLAN",
        question: "Ketika menghubungkan dua buah switch Cisco agar dapat melewatkan trafik dari VLAN 10, VLAN 20, dan VLAN 30 secara bersamaan melalui satu kabel UTP yang sama, konfigurasi mode port dan protokol tagging apakah yang wajib diterapkan?",
        options: [
          "switchport mode access dengan protokol ARP",
          "switchport mode trunk dengan enkapsulasi standar IEEE 802.1Q",
          "shutdown interface pada kedua ujung kabel",
          "ip dhcp snooping trust tanpa VLAN",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Jalur antar-switch yang membawa banyak VLAN sekaligus wajib dikonfigurasi sebagai Trunk Port (`switchport mode trunk`) yang menyisipkan header tag 4-byte IEEE 802.1Q pada setiap frame Ethernet.",
        scoreBoost: 7,
      },
      {
        id: "cert-tkj-sys-1",
        courseId: "tkj-sysadmin",
        certTrack: "BNSP Teknisi Jaringan & Linux Server",
        certName: "Uji Kompetensi BNSP TKJ & Administrasi Server Linux",
        competencyCode: "J.611000.014.02",
        question: "Pada server Linux Debian/Ubuntu, Anda ingin mengamankan file kunci privat `/home/admin/.ssh/id_rsa` agar HANYA pemilik file (owner) yang dapat membaca dan menulisnya, sedangkan grup maupun pengguna lain tidak memiliki izin sama sekali. Perintah manakah yang tepat?",
        options: [
          "chmod 777 /home/admin/.ssh/id_rsa",
          "chmod 600 /home/admin/.ssh/id_rsa",
          "chmod 000 /home/admin/.ssh/id_rsa",
          "chown nobody /home/admin/.ssh/id_rsa",
        ],
        correctIndex: 1,
        explanation:
          "Benar! Nilai oktal 600 memberikan izin Read (4) + Write (2) = 6 kepada Owner, serta 0 (tanpa izin) kepada Group dan Others. Klien OpenSSH bahkan akan menolak menggunakan kunci privat jika izinnya terlalu terbuka seperti 777 atau 644.",
        scoreBoost: 6,
      },
    ],
  },

  // 2. INFORMATIKA & REKAYASA PERANGKAT LUNAK (RPL / PPLG)
  informatika: {
    fieldId: "informatika",
    fieldName: "Informatika & Rekayasa Perangkat Lunak",
    group: "teknologi",
    certificationBody: "BNSP / LSP Teknologi Digital, AWS & Oracle Academy",
    mainCertificationTitle: "Sertifikasi BNSP Junior Web Developer, Oracle SQL & AWS Cloud Practitioner",
    availableCertTracks: [
      "BNSP Junior Web Developer",
      "Oracle Database SQL & Data Structure",
      "AWS Cloud & Modern Software Engineering",
    ],
    targetCourses: [
      {
        id: "if-algoritma",
        code: "IF101",
        name: "Algoritma, Struktur Data & Pemrograman Berorientasi Objek",
        sks: 4,
        minScore: 78,
        coreCompetency: "Kompleksitas Big-O, Array/Hash Map/Tree, dan Prinsip OOP",
        certificationAlignment: "Oracle Database SQL & Data Structure",
        description: "Fondasi penyusunan logika penyelesaian masalah, struktur data efisien, serta enkapsulasi dan polimorfisme objek.",
      },
      {
        id: "if-web",
        code: "IF204",
        name: "Rekayasa Perangkat Lunak, Web Full-Stack & Cloud Deployment",
        sks: 4,
        minScore: 80,
        coreCompetency: "React/Next.js Component, REST API, Git CI/CD & AWS Cloud",
        certificationAlignment: "BNSP Junior Web Developer",
        description: "Pengembangan aplikasi web modern berbasis komponen, autentikasi JWT, pengujian otomatis, dan deployment cloud.",
      },
      {
        id: "if-database",
        code: "IF208",
        name: "Sistem Basis Data Relasional, Normalisasi & Optimasi SQL",
        sks: 3,
        minScore: 76,
        coreCompetency: "ERD, Normalisasi 1NF-3NF, Indexing, ACID Transaction & SQL JOIN",
        certificationAlignment: "Oracle Database SQL & Data Structure",
        description: "Perancangan skema tabel relasional bebas redundansi, query analitik kompleks, dan keamanan terhadap SQL Injection.",
      },
    ],
    remedialActionPlan: [
      {
        stepNumber: "01",
        phase: "Minggu 1 - 2: Perbaikan Fondasi Logika & Algoritma",
        title: "Penguatan Logika Matematika Diskrit, Pseudocode & Flowchart",
        action: "Pelajari Modul 1 dan Modul 2 di bawah untuk memahami variabel, percabangan bersyarat, perulangan, serta struktur data Array dan Hash Map.",
        targetOutcome: "Mampu memecah masalah cerita menjadi langkah algoritma runtut dengan skor diagnostik minimal 75.",
      },
      {
        stepNumber: "02",
        phase: "Minggu 3 - 4: Jembatan Praktik Basis Data & Pemodelan SQL",
        title: "Eksplorasi Modul Normalisasi ERD & Query Relasional",
        action: "Selesaikan Modul 3 dan Modul 4 mengenai pembuatan Entity Relationship Diagram (ERD), kunci relasi PK/FK, dan query JOIN.",
        targetOutcome: "Menutup kesenjangan nilai pada prasyarat mata kuliah Algoritma (IF101) dan Basis Data (IF208).",
      },
      {
        stepNumber: "03",
        phase: "Minggu 5 - 6: Arsitektur Web Full-Stack & Simulasi BNSP",
        title: "Latihan Unit Kompetensi Junior Web Developer & Cloud Dasar",
        action: "Pelajari Modul 5 dan Modul 6 lalu kerjakan latihan uji sertifikasi berstandar SKKNI, Oracle SQL, dan AWS Cloud.",
        targetOutcome: "Lulus simulasi sertifikasi dengan akurasi minimal 80% sebagai bukti kesiapan masuk prodi.",
      },
      {
        stepNumber: "04",
        phase: "Minggu 7 - 8: Proyek Portofolio Penyeimbang Nilai",
        title: "Bangun Aplikasi Web Layanan Lokal Bali di GitHub",
        action: "Susun 1 proyek web terhubung database (misalnya Sistem Kasir Koperasi atau Pencatatan Panen Subak) lengkap dengan dokumentasi README.",
        targetOutcome: "Kesiapan akhir mencapai 85%+ dan selaras penuh dengan tuntutan akademik PNB, Unud, maupun SKENSA.",
      },
    ],
    mismatchBridgeAdvice:
      "Jika latar belakang atau minat awal Anda berasal dari non-teknologi (seperti Seni, Sosial, atau Pariwisata), masuk ke Informatika tetap sangat memungkinkan melalui jalur UI/UX Engineering, Sistem Informasi Pariwisata, atau Digitalisasi Budaya Bali. Fokuskan 2 minggu pertama pada logika algoritma dasar sebelum masuk ke kode teknis.",
    learningModules: [
      {
        id: "mod-if-1",
        courseId: "if-algoritma",
        courseName: "Algoritma & Struktur Data (IF101)",
        moduleCode: "SKKNI-J620100.004",
        semesterStage: "Semester 1 / Fondasi Pemrograman",
        title: "Modul 1: Pola Pikir Algoritmik, Variabel, Tipe Data, dan Struktur Kontrol",
        duration: "45 Menit",
        level: "Dasar",
        summary: "Memahami cara kerja komputer mengeksekusi instruksi langkah demi langkah untuk menyelesaikan masalah nyata.",
        keyConcepts: [
          "Deklarasi Variabel & Tipe Data Primitif (String, Number, Boolean, Null/Undefined)",
          "Percabangan Kondisional (If-Else & Switch) untuk memodelkan aturan keputusan bisnis",
          "Iterasi / Perulangan (For, While, ForEach) untuk memproses koleksi data berurutan",
          "Penyusunan Pseudocode & Flowchart sebelum menulis sintaks bahasa pemrograman",
        ],
        studyMaterial:
          "Algoritma bukanlah bahasa pemrograman itu sendiri, melainkan urutan langkah logis yang terukur untuk mengubah input menjadi output. Dalam mata kuliah IF101, kesalahan paling umum bagi siswa yang nilainya masih kecil adalah langsung menulis kode tanpa menggambar alur logika terlebih dahulu. Gunakan prinsip Input -> Proses -> Output. Contohnya, saat menghitung diskon koperasi siswa: (1) Baca total belanja, (2) Jika total >= 100.000 maka kurangi 10%, selain itu 0%, (3) Tampilkan harga akhir.",
        baliCaseStudy:
          "Studi Kasus Bali: Otomatisasi perhitungan distribusi air irigasi Subak berdasarkan luas petak sawah anggota (krama subak) menggunakan fungsi perulangan dan proporsi.",
        practiceTask:
          "Buat alur logika 5 langkah untuk menentukan apakah seorang siswa berhak menerima beasiswa prestasi berdasarkan rata-rata rapor >= 82 dan kehadiran >= 90%.",
        scoreBoost: 6,
        referenceResources: [
          {
            title: "JavaScript Algorithms and Data Structures",
            provider: "freeCodeCamp",
            url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/",
          },
        ],
      },
      {
        id: "mod-if-2",
        courseId: "if-algoritma",
        courseName: "Algoritma & Struktur Data (IF101)",
        moduleCode: "SKKNI-J620100.017",
        semesterStage: "Semester 2 / Struktur Data & OOP",
        title: "Modul 2: Struktur Data (Array, Stack, Queue, Hash Map) & Kompleksitas Big-O",
        duration: "55 Menit",
        level: "Menengah",
        summary: "Memilih struktur penyimpanan di memori yang tepat agar program tetap cepat saat memproses puluhan ribu data.",
        keyConcepts: [
          "Kompleksitas Waktu Big-O: O(1) Konstan, O(log n) Binary Search, O(n) Linear Search, dan O(n^2) Nested Loop",
          "Stack (LIFO - Last In First Out, contoh: fitur Undo/Redo) vs Queue (FIFO - First In First Out, contoh: antrean cetak dokumen)",
          "Hash Map / Dictionary (Key-Value Pair): Pencarian data instan O(1) berdasarkan kunci unik seperti NISN atau Kode Produk",
          "Empat Pilar OOP: Encapsulation, Abstraction, Inheritance, dan Polymorphism",
        ],
        studyMaterial:
          "Memilih struktur data yang salah akan membuat aplikasi melambat drastis saat jumlah pengguna bertambah. Jika Anda mencari satu siswa dari 50.000 data menggunakan pencarian berurutan (Linear Search pada Array tidak terurut), komputer harus memeriksa hingga 50.000 kali (O(n)). Dengan menyimpan data di dalam Hash Map menggunakan NISN sebagai key, pencarian selesai dalam 1 langkah langsung (O(1)).",
        baliCaseStudy:
          "Studi Kasus Bali: Implementasi struktur data Queue (FIFO) pada sistem pemesanan tiket antrean kendaraan pelabuhan Gilimanuk dan Padangbai.",
        practiceTask:
          "Jelaskan struktur data apa (Stack atau Queue) yang paling tepat digunakan untuk memproses antrean pesanan makanan di dapur restoran, beserta alasannya!",
        scoreBoost: 7,
      },
      {
        id: "mod-if-3",
        courseId: "if-database",
        courseName: "Sistem Basis Data & Pemodelan SQL (IF208)",
        moduleCode: "ORACLE-SQL-01",
        semesterStage: "Semester 2 / Basis Data Relasional",
        title: "Modul 3: Perancangan ERD, Kunci Relasi (PK/FK), dan Normalisasi 1NF - 3NF",
        duration: "50 Menit",
        level: "Menengah",
        summary: "Merancang struktur tabel basis data yang bebas duplikasi (redundansi) dan menjaga konsistensi data.",
        keyConcepts: [
          "Primary Key (PK) sebagai penanda unik baris dan Foreign Key (FK) sebagai pengikat relasi antar tabel",
          "1NF (First Normal Form): Setiap kolom hanya boleh berisi satu nilai atomik (tidak boleh ada beberapa nilai dipisah koma dalam satu sel)",
          "2NF (Second Normal Form): Memenuhi 1NF dan seluruh atribut non-kunci bergantung penuh pada Primary Key",
          "3NF (Third Normal Form): Bebas ketergantungan transitif (atribut non-kunci tidak boleh bergantung pada atribut non-kunci lainnya)",
        ],
        studyMaterial:
          "Basis data relasional mencegah anomali saat penyisipan, pembaruan, maupun penghapusan data. Jangan menyimpan nama sekolah dan alamat sekolah berulang kali di setiap baris tabel nilai siswa. Pisahkan menjadi tabel `Sekolah`, tabel `Siswa`, dan tabel `Nilai` yang dihubungkan menggunakan Foreign Key.",
        baliCaseStudy:
          "Studi Kasus Bali: Skema basis data terpadu untuk pencatatan kunjungan wisatawan dan retribusi di 9 kabupaten/kota Bali.",
        practiceTask:
          "Susun struktur kolom untuk 2 tabel saling berelasi: Tabel 'Jurusan' dan Tabel 'Mata_Kuliah' beserta penentuan Primary Key dan Foreign Key.",
        scoreBoost: 6,
      },
      {
        id: "mod-if-4",
        courseId: "if-database",
        courseName: "Sistem Basis Data & Pemodelan SQL (IF208)",
        moduleCode: "ORACLE-SQL-02",
        semesterStage: "Semester 3 / Optimasi Query & Keamanan",
        title: "Modul 4: Query SQL Lanjut (JOIN, GROUP BY, Indexing) & Pencegahan SQL Injection",
        duration: "55 Menit",
        level: "Terapan",
        summary: "Menggabungkan data lintas tabel secara cepat dan melindungi basis data dari serangan injeksi kueri.",
        keyConcepts: [
          "Jenis Operasi JOIN: INNER JOIN (irisan data yang cocok di kedua tabel) vs LEFT JOIN (semua data tabel kiri beserta pasangannya bila ada)",
          "Agregasi Data: COUNT(), SUM(), AVG() yang dikombinasikan dengan GROUP BY dan penyaringan HAVING",
          "Database Indexing (B-Tree Index) pada kolom yang sering dicari pada klausa WHERE dan JOIN",
          "Prepared Statements / Parameterized Queries sebagai pertahanan mutlak mencegah celah keamanan SQL Injection",
        ],
        studyMaterial:
          "Kerentanan paling berbahaya pada aplikasi web pemula adalah menggabungkan input pengguna secara langsung ke dalam string SQL (`\"SELECT * FROM users WHERE username = '\" + input + \"'\"`). Penyerang dapat menyisipkan `' OR '1'='1` untuk membobol login. Gunakan selalu Parameterized Query (`WHERE username = ?`) agar input diperlakukan murni sebagai data literal, bukan perintah eksekusi.",
        baliCaseStudy:
          "Studi Kasus Bali: Query laporan bulanan transaksi penjualan produk kerajinan per kabupaten di Bali menggunakan `INNER JOIN` dan `GROUP BY`.",
        practiceTask:
          "Tuliskan perintah SQL untuk menampilkan nama jurusan dan jumlah mata kuliah di dalamnya menggunakan `GROUP BY`!",
        scoreBoost: 7,
      },
      {
        id: "mod-if-5",
        courseId: "if-web",
        courseName: "Rekayasa Perangkat Lunak & Web Modern (IF204)",
        moduleCode: "SKKNI-J620100.005",
        semesterStage: "Semester 3 / Web Full-Stack",
        title: "Modul 5: Arsitektur Komponen Web Modern, State Management & Integrasi REST API",
        duration: "60 Menit",
        level: "Terapan",
        summary: "Mempelajari pemisahan antarmuka pengguna (Frontend) dan layanan pengolah data (Backend) secara modular.",
        keyConcepts: [
          "Semantic HTML5 & Sistem Layout Responsif (Flexbox dan CSS Grid)",
          "State Management & Alur Data Satu Arah pada Komponen React/Next.js",
          "Komunikasi Asinkron HTTP (GET, POST, PUT, DELETE) dengan format JSON dan kode status (200, 201, 400, 401, 404, 500)",
          "Penanganan 4 Boundary States wajib: Loading Skeleton, Empty State, Error Fallback, dan Success Feedback",
        ],
        studyMaterial:
          "Pada mata kuliah Rekayasa Perangkat Lunak, kualitas aplikasi dinilai dari kemudahan pemeliharaan kode (maintainability) dan ketahanan terhadap input yang salah. Antarmuka web modern dibagi menjadi komponen-komponen kecil yang memiliki tanggung jawab tunggal (Single Responsibility Principle).",
        baliCaseStudy:
          "Studi Kasus Bali: Perancangan sistem katalog digital kerajinan perak Celuk Gianyar yang tetap cepat diakses oleh pembeli meskipun koneksi seluler tidak stabil.",
        practiceTask:
          "Identifikasi 3 state antarmuka wajib (Loading, Sukses, Gagal) saat halaman web mengambil data daftar koperasi di Kabupaten Badung.",
        scoreBoost: 7,
        referenceResources: [
          {
            title: "MDN Web Docs: Front-end Web Developer Curriculum",
            provider: "Mozilla Developer Network",
            url: "https://developer.mozilla.org/en-US/curriculum/",
          },
        ],
      },
      {
        id: "mod-if-6",
        courseId: "if-web",
        courseName: "Rekayasa Perangkat Lunak & Web Modern (IF204)",
        moduleCode: "AWS-CLF-C02",
        semesterStage: "Semester 4 / Cloud & DevOps",
        title: "Modul 6: Git Version Control, Pengujian Otomatis (Unit Testing) & AWS Cloud Deployment",
        duration: "60 Menit",
        level: "Sertifikasi",
        summary: "Kolaborasi tim menggunakan cabang Git serta arsitektur komputasi awan berstandar AWS Cloud Practitioner.",
        keyConcepts: [
          "Alur Kerja Git: `git branch`, `git checkout`, `git commit`, Pull Request, dan penyelesaian Merge Conflict",
          "Konsep Komputasi Awan (IaaS, PaaS, SaaS) serta Model Tanggung Jawab Bersama (AWS Shared Responsibility Model)",
          "Layanan Inti Cloud: Compute (EC2 / Lambda Serverless), Object Storage (S3), dan Managed Database (RDS)",
          "Continuous Integration & Deployment (CI/CD): Otomatisasi build dan lint setiap kali kode di-push ke repositori",
        ],
        studyMaterial:
          "Dalam sertifikasi AWS Cloud Practitioner dan standar industri perangkat lunak, pengembang tidak lagi mengunggah file kode secara manual via FTP. Setiap perubahan kode diuji melalui pipeline CI/CD untuk memastikan tidak ada error TypeScript atau regresi fitur sebelum tayang ke pengguna.",
        baliCaseStudy:
          "Studi Kasus Bali: Arsitektur aplikasi tiket festival budaya Bali yang mampu menahan lonjakan pengunjung serentak menggunakan Auto Scaling di cloud.",
        practiceTask:
          "Jelaskan manfaat membuat branch baru (`git checkout -b fitur-pembayaran`) dibanding langsung mengubah kode di branch `main` saat bekerja dalam tim!",
        scoreBoost: 7,
        referenceResources: [
          {
            title: "AWS Cloud Practitioner Essentials",
            provider: "AWS Skill Builder",
            url: "https://explore.skillbuilder.aws/",
          },
        ],
      },
    ],
    certificationDrills: [
      {
        id: "cert-if-1",
        courseId: "if-algoritma",
        certTrack: "Oracle Database SQL & Data Structure",
        certName: "BNSP Junior Web Developer & Struktur Data",
        competencyCode: "J.620100.009.01",
        question: "Seorang pengembang ingin menyimpan daftar 10.000 produk UMKM Bali di memori agar dapat dicari berdasarkan kode unik SKU dengan waktu akses paling cepat O(1). Struktur data mana yang paling efisien digunakan?",
        options: [
          "Hash Map / Dictionary dengan kunci (key) berupa kode unik SKU produk",
          "Variabel tunggal bertipe String yang digabung dengan tanda koma",
          "Perulangan bersarang (Nested Loop) tiga tingkat setiap kali mencari",
          "Menyimpan seluruh data di dalam komentar HTML halaman utama",
        ],
        correctIndex: 0,
        explanation:
          "Benar! Dalam mata kuliah Algoritma & Struktur Data serta unit kompetensi J.620100.009.01, Hash Map / Dictionary memungkinkan pencarian berdasarkan kunci unik dengan kompleksitas waktu rata-rata O(1) atau konstan.",
        scoreBoost: 7,
      },
      {
        id: "cert-if-2",
        courseId: "if-algoritma",
        certTrack: "Oracle Database SQL & Data Structure",
        certName: "Uji Kompetensi Algoritma & Struktur Data",
        competencyCode: "J.620100.017.02",
        question: "Jika sebuah algoritma pengurutan memiliki dua perulangan `for` bersarang (nested loop) yang masing-masing berjalan sebanyak `n` elemen data, berapakah kompleksitas waktu Big-O pada skenario terburuknya?",
        options: [
          "O(1) - Waktu konstan",
          "O(log n) - Waktu logaritmik",
          "O(n^2) - Waktu kuadratik",
          "O(0) - Tanpa eksekusi CPU",
        ],
        correctIndex: 2,
        explanation:
          "Tepat! Dua perulangan bersarang di mana perulangan luar berjalan `n` kali dan perulangan dalam berjalan `n` kali untuk setiap iterasi menghasilkan `n * n = n^2` operasi atau O(n^2).",
        scoreBoost: 7,
      },
      {
        id: "cert-if-3",
        courseId: "if-web",
        certTrack: "BNSP Junior Web Developer",
        certName: "BNSP Junior Web Developer (Implementasi UI)",
        competencyCode: "J.620100.005.02",
        question: "Dalam pembuatan antarmuka web berstandar aksesibilitas (WCAG) dan responsif, mengapa penggunaan elemen semantik seperti `<nav>`, `<main>`, dan `<article>` diwajibkan dibanding hanya menggunakan `<div>`?",
        options: [
          "Agar ukuran file CSS otomatis menjadi nol byte tanpa perlu kompilasi",
          "Memudahkan pembaca layar (screen reader), mesin pencari, dan struktur DOM memahami hierarki serta makna konten",
          "Karena browser modern memblokir seluruh halaman yang menggunakan tag <div>",
          "Untuk menggantikan fungsi database relasional di sisi server",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Unit kompetensi Implementasi User Interface (J.620100.005.02) menekankan HTML semantik agar struktur dokumen jelas bagi teknologi bantu (WCAG) dan mempermudah pemeliharaan kode tim.",
        scoreBoost: 7,
      },
      {
        id: "cert-if-4",
        courseId: "if-database",
        certTrack: "Oracle Database SQL & Data Structure",
        certName: "Oracle Database SQL Certified Associate & BNSP",
        competencyCode: "J.620100.021.02",
        question: "Ketika merancang basis data akademik, tabel 'Nilai_Siswa' menyimpan kolom 'nisn' yang merujuk pada Primary Key di tabel 'Siswa'. Disebut apakah peran kolom 'nisn' di dalam tabel 'Nilai_Siswa', dan teknik apa yang wajib digunakan saat mengeksekusi query login agar terhindar dari SQL Injection?",
        options: [
          "Disebut Primary Key ganda; diamankan dengan menghapus seluruh password",
          "Disebut Foreign Key (Kunci Tamu); diamankan dengan Prepared Statements / Parameterized Queries",
          "Disebut Variabel CSS lokal; diamankan dengan mengganti font halaman",
          "Disebut Komentar HTML; diamankan dengan menampilkan query di URL browser",
        ],
        correctIndex: 1,
        explanation:
          "Benar! Kolom perujuk disebut Foreign Key untuk menjaga integritas referensial, sedangkan Prepared Statements memisahkan struktur perintah SQL dari parameter input pengguna sehingga mencegah SQL Injection.",
        scoreBoost: 7,
      },
      {
        id: "cert-if-5",
        courseId: "if-web",
        certTrack: "AWS Cloud & Modern Software Engineering",
        certName: "AWS Certified Cloud Practitioner (CLF-C02)",
        competencyCode: "AWS-CLF-2.1",
        question: "Berdasarkan AWS Shared Responsibility Model (Model Tanggung Jawab Bersama di Cloud), manakah di bawah ini yang merupakan tanggung jawab dari PELANGGAN (Pengembang Aplikasi), bukan penyedia layanan cloud?",
        options: [
          "Keamanan fisik gedung pusat data (data center) dan penjagaan satpam server",
          "Pengelolaan kata sandi pengguna aplikasi, enkripsi data pelanggan, dan konfigurasi aturan firewall grup keamanan (Security Group)",
          "Pemeliharaan kabel fiber optik bawah laut antar benua",
          "Penggantian perangkat keras hardisk fisik yang rusak di rak server AWS",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Penyedia cloud bertanggung jawab atas 'Security OF the Cloud' (fisik, hardware, jaringan global), sedangkan pelanggan bertanggung jawab atas 'Security IN the Cloud' (data aplikasi, manajemen akses akun, dan konfigurasi firewall aplikasi).",
        scoreBoost: 6,
      },
    ],
  },

  // 3. DESAIN KOMUNIKASI VISUAL & MULTIMEDIA (DKV)
  dkv: {
    fieldId: "dkv",
    fieldName: "Desain Komunikasi Visual & Multimedia",
    group: "teknologi",
    certificationBody: "Adobe Certified Professional (ACP), Google UX & BNSP",
    mainCertificationTitle: "Sertifikasi Adobe Certified Professional (ACP), Google UX Design & BNSP Desainer Grafis",
    availableCertTracks: [
      "Adobe Certified Professional (ACP)",
      "Google UX Design & Figma System",
      "BNSP Desainer Grafis Muda",
    ],
    targetCourses: [
      {
        id: "dkv-tipografi",
        code: "DKV102",
        name: "Nirmana, Tipografi & Grafika Produksi (Standar BNSP & Print)",
        sks: 4,
        minScore: 78,
        coreCompetency: "Hierarki Visual, Keterbacaan Huruf, Mode Warna CMYK/RGB & Pre-Press",
        certificationAlignment: "BNSP Desainer Grafis Muda",
        description: "Penguasaan elemen dasar desain dwimatra, kontras warna, sistem grid, dan persiapan file cetak produksi industri.",
      },
      {
        id: "dkv-uiux",
        code: "DKV205",
        name: "Desain Antarmuka (UI) & Pengalaman Pengguna (Kurikulum Google UX)",
        sks: 4,
        minScore: 80,
        coreCompetency: "User Research, Wireframing, Auto-Layout Figma, Design Token & WCAG",
        certificationAlignment: "Google UX Design & Figma System",
        description: "Perancangan produk digital interaktif berdasarkan peta perjalanan pengguna (user journey), usability testing, dan standar aksesibilitas.",
      },
      {
        id: "dkv-branding",
        code: "DKV210",
        name: "Ilustrasi Vektor, Manipulasi Citra & Identitas Brand (Kurikulum Adobe ACP)",
        sks: 3,
        minScore: 76,
        coreCompetency: "Bezier Path Vektor, Non-Destructive Masking, GSM & Hak Kekayaan Intelektual",
        certificationAlignment: "Adobe Certified Professional (ACP)",
        description: "Menerjemahkan nilai kearifan lokal Bali menjadi identitas visual vektor, kemasan, dan aset kampanye berstandar Adobe ACP.",
      },
    ],
    remedialActionPlan: [
      {
        stepNumber: "01",
        phase: "Minggu 1 - 2: Kalibrasi Kepekaan Visual & Nirmana",
        title: "Latihan Prinsip Kontras, Keseimbangan, dan Hierarki Tipografi",
        action: "Pelajari Modul 1 dan Modul 2 untuk memperbaiki tata letak desain serta memahami standar persiapan cetak (CMYK, 300 DPI, Bleed).",
        targetOutcome: "Memahami perbedaan ukuran, bobot huruf, dan ruang kosong (whitespace) secara terukur.",
      },
      {
        stepNumber: "02",
        phase: "Minggu 3 - 4: Metode Riset UX & Sistem Desain Figma",
        title: "Berlatih Design Thinking dan Penyusunan Komponen UI",
        action: "Pelajari Modul 3 dan Modul 4 (Kurikulum Google UX Design) untuk merancang wireframe, user flow, dan rasio kontras WCAG.",
        targetOutcome: "Mampu menyusun alasan rasional di balik setiap pemilihan warna, tata letak, dan alur tombol.",
      },
      {
        stepNumber: "03",
        phase: "Minggu 5 - 6: Simulasi Uji Sertifikasi Adobe ACP & BNSP",
        title: "Penguasaan Vektor, Non-Destructive Editing & Lisensi Karya",
        action: "Pelajari Modul 5 dan kerjakan soal latihan sertifikasi Adobe Certified Professional (ACP), Google UX, dan BNSP Desainer Grafis.",
        targetOutcome: "Lulus seluruh soal uji kompetensi teknis dengan skor di atas 80%.",
      },
      {
        stepNumber: "04",
        phase: "Minggu 7 - 8: Penyusunan Portofolio Rebranding UMKM",
        title: "Studi Kasus Identitas Produk Lokal Bali & Prototype UI",
        action: "Buat 1 karya redesain kemasan atau prototipe aplikasi wisata lengkap dengan penjelasan masalah dan solusi visualnya.",
        targetOutcome: "Portofolio siap diuji pada seleksi ISI Denpasar, INSTIKI, atau SMK DKV.",
      },
    ],
    mismatchBridgeAdvice:
      "Jika Anda merasa belum pandai menggambar tangan bebas (ilustrasi manual), jangan berkecil hati. Cabang DKV modern seperti UI/UX Product Design, Brand Strategy, dan Layout System lebih mengutamakan logika tata letak, empati pengguna, dan penguasaan sistem grid.",
    learningModules: [
      {
        id: "mod-dkv-1",
        courseId: "dkv-tipografi",
        courseName: "Nirmana, Tipografi & Grafika Produksi (DKV102)",
        moduleCode: "BNSP-M74100.001",
        semesterStage: "Semester 1 / Fondasi Visual",
        title: "Modul 1: Hukum Hierarki Visual, Grid System, dan Psikologi Tipografi",
        duration: "45 Menit",
        level: "Dasar",
        summary: "Mengatur urutan pandang mata pembaca menggunakan skala ukuran, kontras warna, dan ruang kosong.",
        keyConcepts: [
          "Focal Point (Titik Fokus Utama) agar pesan inti langsung tertangkap dalam 3 detik pertama",
          "Anatomi & Pengelompokan Huruf: Serif, Sans-Serif, Slab Serif, Script, dan Monospace beserta aturan Kerning, Tracking, dan Leading",
          "Rasio Kontras WCAG (Minimal 4.5:1 untuk teks body standar agar nyaman dibaca)",
          "Negative Space (Ruang Kosong) sebagai elemen aktif penjaga keterbacaan tata letak",
        ],
        studyMaterial:
          "Desain komunikasi visual gagal apabila semua elemen dibuat besar dan mencolok secara bersamaan. Gunakan aturan skala 3 tingkat: Judul Utama (Display) untuk menarik perhatian, Subjudul untuk mengelompokkan topik, dan Teks Isi (Body) dengan lebar baris ideal 60-70 karakter. Hindari menaruh teks putih di atas latar kuning terang karena menurunkan rasio kontras keterbacaan secara drastis.",
        baliCaseStudy:
          "Studi Kasus Bali: Penerapan palet warna Tridatu dan aksen emas prada secara proporsional pada poster festival budaya agar tetap modern dan terbaca jelas.",
        practiceTask:
          "Susun hierarki informasi untuk poster pameran kriya SMK yang memuat: Judul Acara, Tanggal/Lokasi, Daftar Pembicara, dan Tombol Pendaftaran.",
        scoreBoost: 7,
      },
      {
        id: "mod-dkv-2",
        courseId: "dkv-tipografi",
        courseName: "Nirmana, Tipografi & Grafika Produksi (DKV102)",
        moduleCode: "BNSP-M74100.009",
        semesterStage: "Semester 2 / Produksi Pre-Press",
        title: "Modul 2: Manajemen Warna (CMYK vs RGB), Resolusi DPI, Bleed & Dieline Kemasan",
        duration: "50 Menit",
        level: "Menengah",
        summary: "Menyiapkan file siap cetak (print-ready) bebas kesalahan warna maupun terpotong saat proses produksi mesin offset.",
        keyConcepts: [
          "Additive Color (RGB: Red, Green, Blue berbasis cahaya layar) vs Subtractive Color (CMYK: Cyan, Magenta, Yellow, Key/Black berbasis tinta cetak)",
          "Standar Resolusi: 72-150 PPI untuk tampilan layar web vs 300 DPI untuk cetakan jarak dekat (brosur, majalah, kemasan)",
          "Area Bleed (3 mm - 5 mm di luar garis potong), Trim Line (garis potong aktual), dan Safe Zone (batas aman teks di bagian dalam)",
          "Garis Dieline Kemasan: Garis sambung (solid line) untuk pemotongan pisau (cut) dan garis putus-putus (dashed line) untuk lipatan (crease/fold)",
        ],
        studyMaterial:
          "Dalam uji kompetensi BNSP Desainer Grafis Muda, kesalahan paling fatal saat menyerahkan file ke percetakan adalah lupa mengubah mode warna gambar ke CMYK, tidak melakukan 'Create Outlines / Convert to Curves' pada font, serta tidak menyertakan area Bleed sehingga muncul garis putih tipis di pinggir cetakan saat kertas dipotong.",
        baliCaseStudy:
          "Studi Kasus Bali: Pembuatan pola jaring-jaring kemasan (packaging dieline) kotak teh herbal dan kopi arabika Kintamani berstandar ritel ekspor.",
        practiceTask:
          "Jelaskan apa yang akan terjadi pada warna hijau neon terang (#00FF66 di layar RGB) apabila langsung dicetak dengan tinta CMYK tanpa penyesuaian profil warna!",
        scoreBoost: 7,
      },
      {
        id: "mod-dkv-3",
        courseId: "dkv-uiux",
        courseName: "Desain Antarmuka & Pengalaman Pengguna (DKV205)",
        moduleCode: "GUX-MOD-01",
        semesterStage: "Semester 2 / Kurikulum Google UX",
        title: "Modul 3: Design Thinking, User Persona, User Flow & Wireframing",
        duration: "55 Menit",
        level: "Menengah",
        summary: "Merancang solusi produk digital berbasis riset kebutuhan pengguna nyata sebelum membuka perangkat lunak desain.",
        keyConcepts: [
          "Lima Tahap Design Thinking: Empathize, Define, Ideate, Prototype, dan Test",
          "Penyusunan User Persona, Empathy Map, dan Problem Statement yang terukur",
          "Hukum UX Esensial: Hukum Hick (waktu memilih berbanding lurus dengan jumlah opsi), Hukum Fitts (target tombol harus cukup besar dan dekat), dan Hukum Jakob",
          "Low-Fidelity Wireframe vs High-Fidelity Interactive Prototype di Figma",
        ],
        studyMaterial:
          "UX (User Experience) berfokus pada seberapa mudah dan efektif pengguna menyelesaikan tujuannya, sedangkan UI (User Interface) berfokus pada kejelasan visual dan konsistensi komponen. Jangan langsung mewarnai halaman aplikasi sebelum alur navigasi (User Flow) dan struktur informasi (Information Architecture) teruji jelas melalui wireframe.",
        baliCaseStudy:
          "Studi Kasus Bali: Merancang alur pemesanan tiket pementasan tari tradisional di Ubud dan informasi jadwal bus Trans Metro Dewata yang ramah bagi wisatawan maupun pelajar.",
        practiceTask:
          "Buat urutan 4 langkah layar (User Flow) untuk fitur pencarian produk tenun Endek asli beserta penanda verifikasi pengrajinnya.",
        scoreBoost: 7,
        referenceResources: [
          {
            title: "Learn Design & Auto Layout Fundamentals",
            provider: "Figma Learn Official",
            url: "https://help.figma.com/hc/en-us/categories/360002051613",
          },
        ],
      },
      {
        id: "mod-dkv-4",
        courseId: "dkv-uiux",
        courseName: "Desain Antarmuka & Pengalaman Pengguna (DKV205)",
        moduleCode: "GUX-MOD-02",
        semesterStage: "Semester 3 / Sistem Desain & Aksesibilitas",
        title: "Modul 4: Sistem Token Desain (8px Grid), Auto-Layout Figma & Audit Usability",
        duration: "55 Menit",
        level: "Terapan",
        summary: "Membangun pustaka komponen (Design System) yang rapi dan mudah diterjemahkan menjadi kode CSS oleh programmer.",
        keyConcepts: [
          "Sistem Spasi 8-Point Grid (4px, 8px, 12px, 16px, 24px, 32px, 48px) untuk menjaga ritme tata letak",
          "Semantic Color Tokens: Memisahkan warna dasar (primitive) dari peran fungsinya (surface, border, text-primary, status-error)",
          "Auto-Layout & Component Variants di Figma (Default, Hover, Focused, Disabled, Loading)",
          "Usability Testing dengan 5 Pengguna untuk menemukan 85% kendala navigasi utama",
        ],
        studyMaterial:
          "Seorang desainer UI/UX profesional bekerja berdampingan dengan programmer front-end. Dengan menyusun komponen menggunakan Auto-Layout (sejajar dengan CSS Flexbox) dan memberikan nama token warna yang konsisten, proses serah terima desain (design handoff) menjadi dua kali lebih cepat dan akurat.",
        baliCaseStudy:
          "Studi Kasus Bali: Pembuatan Design System terpadu untuk aplikasi layanan publik pemerintah daerah dan direktori UMKM Bali.",
        practiceTask:
          "Sebutkan 4 state interaksi wajib yang harus dirancang saat membuat komponen tombol utama (Primary Button) di dalam Design System!",
        scoreBoost: 6,
      },
      {
        id: "mod-dkv-5",
        courseId: "dkv-branding",
        courseName: "Ilustrasi Vektor & Identitas Brand (DKV210)",
        moduleCode: "ACP-MOD-01",
        semesterStage: "Semester 3 / Kurikulum Adobe ACP",
        title: "Modul 5: Grafik Vektor vs Bitmap, Non-Destructive Editing & Hak Kekayaan Intelektual",
        duration: "55 Menit",
        level: "Sertifikasi",
        summary: "Menguasai teknik pengeditan tanpa merusak piksel asli serta aturan lisensi hak cipta sesuai ujian Adobe Certified Professional.",
        keyConcepts: [
          "Grafik Vektor (berbasis rumus kurva Bezier, bebas pecah di segala ukuran) vs Bitmap/Raster (berbasis grid piksel yang bergantung resolusi)",
          "Non-Destructive Editing: Menggunakan Layer Mask, Adjustment Layers, dan Smart Objects agar gambar asli tetap utuh setiap saat",
          "Graphic Standard Manual (GSM): Pedoman batas ruang aman logo (clear space), ukuran minimum, dan larangan distorsi logo",
          "Lisensi & Hak Cipta ( sesuai Domain 1 Ujian Adobe ACP): Public Domain, Creative Commons (CC-BY, CC-NC, CC-ND), Royalty-Free, dan Model/Property Release",
        ],
        studyMaterial:
          "Dalam ujian sertifikasi internasional Adobe Certified Professional (ACP), bagian pertama selalu menguji pemahaman hukum hak cipta dan manajemen proyek klien (Project Scope Creep). Secara teknis, penguji menilai apakah peserta menggunakan Layer Mask (bukan Eraser Tool permanen) saat menghapus latar belakang foto, serta penggunaan Pathfinder dan Shape Builder yang bersih saat menyusun konstruksi logo vektor.",
        baliCaseStudy:
          "Studi Kasus Bali: Penyusunan buku pedoman identitas visual (Brand Guideline) untuk desa wisata dan produk kriya perak Gianyar.",
        practiceTask:
          "Jelaskan mengapa penggunaan 'Layer Mask' jauh lebih direkomendasikan dibandingkan 'Eraser Tool' saat menyeleksi objek foto produk di Adobe Photoshop!",
        scoreBoost: 6,
        referenceResources: [
          {
            title: "Adobe Certified Professional Exam Objectives",
            provider: "Certiport / Adobe",
            url: "https://certiport.pearsonvue.com/Certifications/Adobe/ACP/Certify",
          },
        ],
      },
      {
        id: "mod-dkv-6",
        courseId: "dkv-branding",
        courseName: "Ilustrasi Vektor & Identitas Brand (DKV210)",
        moduleCode: "ACP-VID-02",
        semesterStage: "Semester 4 / Motion Graphics & Storyboard",
        title: "Modul 6: Storyboarding, 12 Prinsip Animasi & Produksi Konten Motion Graphics",
        duration: "55 Menit",
        level: "Sertifikasi",
        summary: "Menghidupkan aset identitas visual menjadi animasi pendek dan video kampanye digital berstandar industri kreatif.",
        keyConcepts: [
          "12 Prinsip Dasar Animasi (Squash & Stretch, Anticipation, Staging, Ease In / Ease Out, Follow Through)",
          "Penyusunan Storyboard & Animatic: Mengatur sudut kamera (Wide Shot, Medium Shot, Close Up), durasi adegan, dan naskah narasi",
          "Keyframing & Graph Editor di Adobe After Effects / Premiere Pro untuk pergerakan transisi yang halus",
          "Standar Ekspor Video Digital: Codec H.264/MP4, Frame Rate (24/30/60 fps), dan Aspect Ratio (16:9 Landscape vs 9:16 Vertical Reels)",
        ],
        studyMaterial:
          "Desainer komunikasi visual masa kini dituntut mampu menggerakkan karya statis menjadi motion graphics. Gerakan yang kaku pada animasi pemula biasanya disebabkan oleh penggunaan keyframe Linear. Dengan mengaktifkan Easy Ease (kurva Bezier pada Graph Editor), objek bergerak dengan percepatan dan perlambatan alami seperti di dunia nyata.",
        baliCaseStudy:
          "Studi Kasus Bali: Pembuatan bumper animasi cerita rakyat Bali dan video promosi festival seni budaya di ISI Denpasar serta studio animasi lokal.",
        practiceTask:
          "Susun 4 panel storyboard tertulis (Visual + Audio + Durasi detik) untuk iklan layanan masyarakat berdurasi 15 detik tentang pengurangan sampah plastik di Bali!",
        scoreBoost: 6,
        referenceResources: [
          {
            title: "Adobe After Effects & Video Production Guides",
            provider: "Adobe HelpX",
            url: "https://helpx.adobe.com/after-effects/user-guide.html",
          },
        ],
      },
    ],
    certificationDrills: [
      {
        id: "cert-dkv-1",
        courseId: "dkv-tipografi",
        certTrack: "BNSP Desainer Grafis Muda",
        certName: "BNSP Desainer Grafis Muda (Grafika Produksi)",
        competencyCode: "M.74100.001.02",
        question: "Saat menyiapkan berkas desain kemasan kotak kopi untuk dicetak menggunakan mesin offset skala industri, pengaturan warna, resolusi, dan batas potong manakah yang wajib digunakan?",
        options: [
          "Mode warna RGB dengan resolusi 72 PPI tanpa garis bleed",
          "Mode warna CMYK dengan resolusi 300 DPI dan area bleed minimal 3 mm di luar garis potong",
          "Mode warna Hexadecimal Web dengan format gambar GIF terkompresi",
          "Mode warna Grayscale 16-bit dengan ukuran kanvas bebas",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Sesuai unit kompetensi M.74100.001.02, percetakan fisik menggunakan tinta Cyan, Magenta, Yellow, dan Key/Black (CMYK) pada 300 DPI, serta wajib menyertakan bleed agar tidak ada tepi putih saat pemotongan kertas.",
        scoreBoost: 6,
      },
      {
        id: "cert-dkv-2",
        courseId: "dkv-tipografi",
        certTrack: "BNSP Desainer Grafis Muda",
        certName: "BNSP Desainer Grafis Muda (Dieline Kemasan & Pre-Press)",
        competencyCode: "M.74100.009.02",
        question: "Pada pola jaring-jaring kemasan cetak (Packaging Dieline), apakah perbedaan fungsi antara garis sambung tegas (solid line) dan garis putus-putus (dashed line)?",
        options: [
          "Garis sambung adalah batas potong pisau (cut line), sedangkan garis putus-putus adalah jalur lipatan kertas (crease/fold line)",
          "Garis sambung untuk dihapus mesin, sedangkan garis putus-putus untuk diwarnai hitam",
          "Keduanya harus ikut tercetak tebal di bagian depan foto produk",
          "Garis putus-putus menandakan area yang tidak boleh diberi lem",
        ],
        correctIndex: 0,
        explanation:
          "Benar! Dalam standar grafika produksi (M.74100.009.02), mesin die-cut membaca garis solid sebagai jalur potong (cut) dan garis putus-putus sebagai jalur tekuk/lipat (crease).",
        scoreBoost: 6,
      },
      {
        id: "cert-dkv-3",
        courseId: "dkv-branding",
        certTrack: "Adobe Certified Professional (ACP)",
        certName: "Adobe Certified Professional (Illustrator & Visual Design)",
        competencyCode: "ACP-AI-2.3",
        question: "Mengapa logo utama sebuah institusi wajib dirancang dalam format grafik vektor (.SVG / .AI / .EPS) dibanding format bitmap (.JPG / .PNG)?",
        options: [
          "Format vektor berbasis rumus matematis titik dan kurva Bezier sehingga dapat diperbesar ke ukuran baliho tanpa pecah (lossless scalability)",
          "Format vektor hanya bisa dibuka di ponsel pintar dan tidak bisa diedit",
          "Format bitmap tidak mampu menampilkan lebih dari dua warna",
          "Karena grafik vektor otomatis menerjemahkan bahasa di dalam logo",
        ],
        correctIndex: 0,
        explanation:
          "Benar! Grafik vektor dirender menggunakan koordinat geometris sehingga ketajamannya tetap terjaga pada ukuran kartu nama hingga papan reklame besar.",
        scoreBoost: 6,
      },
      {
        id: "cert-dkv-4",
        courseId: "dkv-branding",
        certTrack: "Adobe Certified Professional (ACP)",
        certName: "Adobe Certified Professional (Photoshop Non-Destructive Editing)",
        competencyCode: "ACP-PS-3.2",
        question: "Dalam standar kerja Adobe Photoshop berstandar sertifikasi ACP, metode manakah yang termasuk teknik 'Non-Destructive Editing' saat menyembunyikan sebagian latar belakang foto produk?",
        options: [
          "Menghapus piksel secara permanen dengan Eraser Tool lalu langsung melakukan Flatten Image",
          "Menggunakan Layer Mask (hitam untuk menyembunyikan, putih untuk menampilkan) pada Smart Object sehingga piksel asli tetap utuh",
          "Memotong bagian gambar dengan Crop Tool dan menimpa file asli tanpa salinan",
          "Mengubah ukuran gambar menjadi 10x10 piksel lalu memperbesarnya kembali",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Layer Mask dan Smart Object adalah inti dari Non-Destructive Editing karena memungkinkan desainer merevisi area seleksi kapan saja tanpa kehilangan data piksel asli.",
        scoreBoost: 6,
      },
      {
        id: "cert-dkv-5",
        courseId: "dkv-uiux",
        certTrack: "Google UX Design & Figma System",
        certName: "Sertifikasi Google UX Design & Aksesibilitas WCAG",
        competencyCode: "GUX-WCAG-1.4",
        question: "Pada antarmuka aplikasi, sebuah tombol bertuliskan 'Simpan Pendaftaran' memiliki teks putih (#FFFFFF) di atas latar kuning pucat (#FFF59D). Masalah utama apa yang terjadi pada desain tersebut?",
        options: [
          "Ukuran tombol terlalu cepat dimuat oleh peramban",
          "Rasio kontras warna terlalu rendah (< 1.5:1) sehingga gagal memenuhi standar keterbacaan WCAG AA/AAA bagi pengguna",
          "Warna kuning tidak didukung oleh layar monitor modern",
          "Font yang digunakan otomatis berubah menjadi miring",
        ],
        correctIndex: 1,
        explanation:
          "Benar sekali! Teks putih di atas latar kuning terang memiliki rasio kontras yang sangat rendah, sehingga sulit dibaca. Di atas latar kuning hangat, gunakan warna teks gelap pekat.",
        scoreBoost: 6,
      },
      {
        id: "cert-dkv-6",
        courseId: "dkv-uiux",
        certTrack: "Google UX Design & Figma System",
        certName: "Google UX Design (Auto-Layout & Wireframing)",
        competencyCode: "GUX-FIG-2.1",
        question: "Dalam perancangan sistem komponen antarmuka di Figma, apakah fungsi utama fitur 'Auto Layout' saat membuat komponen kartu produk atau tombol?",
        options: [
          "Menghapus seluruh teks apabila panjang kalimat berubah",
          "Membuat ukuran wadah komponen, jarak antar elemen (gap), dan padding menyesuaikan secara otomatis (responsif) ketika isi teks atau ikon bertambah",
          "Mengubah file vektor menjadi gambar buram beresolusi rendah",
          "Mengunci warna layar agar tidak bisa dilihat oleh programmer",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Auto Layout bekerja selaras dengan prinsip CSS Flexbox sehingga komponen otomatis beradaptasi terhadap perubahan panjang konten maupun ukuran layar.",
        scoreBoost: 6,
      },
    ],
  },

  // 4. ARSITEKTUR & DESAIN PEMODELAN INFORMASI BANGUNAN (DPIB)
  arsitektur: {
    fieldId: "arsitektur",
    fieldName: "Arsitektur & Desain Ruang Berkelanjutan",
    group: "teknologi",
    certificationBody: "Autodesk Certified User (ACU), GBCI Greenship & BNSP",
    mainCertificationTitle: "Sertifikasi Autodesk AutoCAD/Revit (ACU), Greenship Tropis & BNSP Juru Gambar Bangunan",
    availableCertTracks: [
      "Autodesk Certified User (AutoCAD & BIM)",
      "Greenship Arsitektur Tropis & Iklim",
      "Asta Kosala Kosali & BNSP Juru Gambar",
    ],
    targetCourses: [
      {
        id: "ars-tradisional",
        code: "ARS104",
        name: "Arsitektur Tradisional Bali (Asta Kosala Kosali)",
        sks: 3,
        minScore: 76,
        coreCompetency: "Tata Ruang Sanga Mandala, Natah & Proporsi Antropometri Bali",
        certificationAlignment: "Asta Kosala Kosali & BNSP Juru Gambar",
        description: "Prinsip zonasi ruang tradisional Bali, orientasi kosmologis Kaja-Kelod, serta penggunaan material alami lokal.",
      },
      {
        id: "ars-cad",
        code: "ARS202",
        name: "Pemodelan Informasi Bangunan (Kurikulum Autodesk AutoCAD & Revit BIM)",
        sks: 4,
        minScore: 78,
        coreCompetency: "Layering CAD, Annotative Scale, Potongan Konstruksi & BIM 3D Families",
        certificationAlignment: "Autodesk Certified User (AutoCAD & BIM)",
        description: "Penyusunan dokumen gambar kerja presisi dan pemodelan informasi bangunan terintegrasi berstandar ujian Autodesk Certified User.",
      },
      {
        id: "ars-ekologis",
        code: "ARS209",
        name: "Fisika Bangunan & Desain Iklim Tropis (Standar Greenship GBCI)",
        sks: 3,
        minScore: 77,
        coreCompetency: "Cross Ventilation, OTTV Selubung Bangunan, Pencahayaan Alami & Konservasi Air",
        certificationAlignment: "Greenship Arsitektur Tropis & Iklim",
        description: "Rekayasa bukaan bangunan, orientasi matahari, dan efisiensi energi pasif pada pulau tropis.",
      },
    ],
    remedialActionPlan: [
      {
        stepNumber: "01",
        phase: "Minggu 1 - 2: Penguatan Geometri Ruang & Skala Gambar Kerja",
        title: "Latihan Membaca Denah, Tampak, dan Potongan dengan Skala Presisi",
        action: "Pelajari kembali konversi skala gambar teknik (1:100, 1:50, 1:20) dan hierarki ketebalan garis CAD pada Modul 1 dan 2.",
        targetOutcome: "Mampu membaca dan menggambar denah ruang sederhana dengan ukuran proporsional.",
      },
      {
        stepNumber: "02",
        phase: "Minggu 3 - 4: Pemahaman Zonasi Asta Kosala Kosali & BIM",
        title: "Integrasi Kearifan Ruang Bali dengan Pemodelan 3D BIM",
        action: "Selesaikan modul tata ruang Sanga Mandala, AutoCAD/Revit BIM, dan Fisika Bangunan Tropis.",
        targetOutcome: "Memenuhi kompetensi mata kuliah Arsitektur Tradisional dan Pemodelan Bangunan.",
      },
      {
        stepNumber: "03",
        phase: "Minggu 5 - 6: Simulasi Sertifikasi Autodesk ACU & BNSP",
        title: "Uji Standar Notasi Gambar Kerja, Layering CAD & Desain Pasif",
        action: "Ikuti latihan sertifikasi Autodesk AutoCAD/Revit dan BNSP Juru Gambar Bangunan Gedung pada panel simulasi.",
        targetOutcome: "Skor latihan sertifikasi mencapai minimal 80%.",
      },
      {
        stepNumber: "04",
        phase: "Minggu 7 - 8: Mini Proyek Desain Bale / Ruang Komunitas",
        title: "Susun Lembar Presentasi Konsep Arsitektur Hijau",
        action: "Buat sketsa denah ruang belajar terbuka berventilasi silang untuk portofolio masuk Unud, Warmadewa, atau SMKN 3 Denpasar.",
        targetOutcome: "Skor kesiapan jurusan mencapai target kelulusan.",
      },
    ],
    mismatchBridgeAdvice:
      "Arsitektur adalah titik temu antara seni visual dan keteknikan. Jika nilai fisika/matematika Anda masih sedang, perkuat pemahaman konsep struktur dasar dan tata ruang tropis melalui visualisasi diagram.",
    learningModules: [
      {
        id: "mod-ars-1",
        courseId: "ars-tradisional",
        courseName: "Arsitektur Tradisional Bali (ARS104)",
        moduleCode: "AKK-MOD-01",
        semesterStage: "Semester 1 / Kearifan Lokal",
        title: "Modul 1: Zonasi Sanga Mandala & Harmoni Tri Hita Karana dalam Ruang",
        duration: "45 Menit",
        level: "Dasar",
        summary: "Memahami pembagian 9 zona tapak berdasarkan sumbu gunung-laut (Kaja-Kelod) dan terbit-terbenam matahari (Kangin-Kauh).",
        keyConcepts: [
          "Sumbu Kaja-Kelod (Utama - Madya - Nista) berdasarkan topografi Bali Utara vs Bali Selatan",
          "Sanga Mandala: Pembagian halaman menjadi 9 zona fungsional dari Utama ning Utama (Pemerajan) hingga Nista ning Nista (Teba)",
          "Konsep Natah (Ruang terbuka tengah) sebagai pengatur sirkulasi udara dan pusat interaksi sosial",
          "Material Lokal Berkelanjutan: Bata merah gosok, batu padas, kayu, dan bambu",
        ],
        studyMaterial:
          "Dalam arsitektur tradisional Bali, bangunan tidak dirancang sebagai satu massa tertutup raksasa, melainkan gugus paviliun (bale) yang mengelilingi ruang terbuka hijau (natah). Secara ilmiah, natah berfungsi menciptakan tekanan udara mikro sehingga angin segar selalu mengalir melewati bale-bale di sekelilingnya.",
        baliCaseStudy:
          "Studi Kasus Bali: Adaptasi konsep Natah dan Sanga Mandala pada perancangan sekolah kejuruan ramah lingkungan di Denpasar.",
        practiceTask:
          "Petakan fungsi 3 zona utama (Utama, Madya, Nista) jika Anda merancang pusat pelatihan pemuda desa di Kabupaten Gianyar.",
        scoreBoost: 6,
      },
      {
        id: "mod-ars-2",
        courseId: "ars-tradisional",
        courseName: "Arsitektur Tradisional Bali (ARS104)",
        moduleCode: "AKK-MOD-02",
        semesterStage: "Semester 1 / Antropometri & Struktur Kayu/Bambu",
        title: "Modul 2: Satuan Dimensi Antropometri (Asta Musti) & Konstruksi Tahan Gempa",
        duration: "50 Menit",
        level: "Dasar",
        summary: "Mempelajari sistem ukuran proporsi tubuh pemilik rumah serta sambungan pasak kayu tradisional yang lentur terhadap guncangan gempa.",
        keyConcepts: [
          "Satuan Ukuran Tradisional Bali: Rai (lebar kepalan tangan), Musti, Hasta, dan Depa dari proporsi tubuh pengguna",
          "Sistem Struktur Rangka Bale (Saka/Tiang, Lambang, Sineb, Sunduk) dengan sambungan pasak (cathok/lait) tanpa paku besi",
          "Struktur Bambu Bentang Lebar Modern: Pengawetan bambu dengan larutan boraks-borik agar tahan kumbang bubuk hingga puluhan tahun",
          "Peraturan Daerah Bali tentang ketinggian bangunan maksimal 15 meter (setara pohon kelapa) dan pelestarian identitas lokal",
        ],
        studyMaterial:
          "Bangunan tradisional Bali terbukti tahan terhadap gempa bumi karena menggunakan sistem sambungan pasak kayu (knock-down) yang mampu bergoyang menyerap energi seismik tanpa patah. Saat ini, arsitek kontemporer Bali juga mengembangkan konstruksi bambu laminasi bentang lebar untuk aula sekolah, resort ekowisata, dan paviliun publik.",
        baliCaseStudy:
          "Studi Kasus Bali: Rekayasa struktur bambu bentang lebar pada arsitektur sekolah hijau di kawasan Sibang Badung dan Ubud.",
        practiceTask:
          "Jelaskan mengapa sambungan pasak kayu (sunduk-tiang) pada bale tradisional Bali lebih lentur menghadapi getaran gempa dibanding struktur beton kaku tanpa tulangan yang memadai!",
        scoreBoost: 6,
      },
      {
        id: "mod-ars-3",
        courseId: "ars-cad",
        courseName: "Pemodelan Informasi Bangunan (ARS202)",
        moduleCode: "ACU-CAD-01",
        semesterStage: "Semester 2 / Standar Autodesk AutoCAD",
        title: "Modul 3: Standar Gambar Kerja, Manajemen Layer CAD, Block & Paper Space Layout",
        duration: "55 Menit",
        level: "Menengah",
        summary: "Menguasai manajemen objek gambar teknik di AutoCAD sesuai kisi-kisi ujian Autodesk Certified User (ACU).",
        keyConcepts: [
          "Hierarki Ketebalan Garis (Lineweight): Garis potong struktural tebal (0.50mm), garis tampak sedang (0.25-0.30mm), dan garis arsir/dimensi tipis (0.10-0.15mm)",
          "Manajemen Layer & Properti `ByLayer` (Dinding, Kolom, Kusen, Atap, Dimensi, Utilitas MEP)",
          "Penggunaan `Block` dan `Xref` (External Reference) untuk elemen berulang seperti pintu, jendela, dan grid kolom",
          "Model Space (menggambar dengan ukuran sebenarnya 1:1) vs Paper Space / Layout Viewport (mengatur skala cetak 1:100 atau 1:50)",
        ],
        studyMaterial:
          "Dalam sertifikasi Autodesk AutoCAD (ACU) dan BNSP Juru Gambar Bangunan, Anda selalu menggambar objek dengan ukuran nyata (1:1) di dalam Model Space, lalu mengatur skala tampilan menggunakan Viewport di dalam tab Layout (Paper Space). Hindari menggambar semua garis di Layer 0; pisahkan setiap elemen konstruksi ke layer tersendiri dengan warna dan ketebalan `ByLayer`.",
        baliCaseStudy:
          "Studi Kasus Bali: Penyusunan dokumen gambar kerja (DED) bale kulkul dan gedung serbaguna tahan gempa di Kabupaten Badung.",
        practiceTask:
          "Hitung berapa sentimeter panjang garis yang tercetak pada kertas berskala Viewport 1:50 untuk mewakili bentang balok sepanjang 6 meter!",
        scoreBoost: 6,
        referenceResources: [
          {
            title: "Autodesk Certified User (ACU) AutoCAD & Revit Objectives",
            provider: "Autodesk / Certiport",
            url: "https://certiport.pearsonvue.com/Certifications/Autodesk/Certifications/Certify",
          },
        ],
      },
      {
        id: "mod-ars-4",
        courseId: "ars-cad",
        courseName: "Pemodelan Informasi Bangunan (ARS202)",
        moduleCode: "ACU-BIM-02",
        semesterStage: "Semester 3 / Building Information Modeling",
        title: "Modul 4: Pengantar BIM (Building Information Modeling) & Parametrik 3D Revit",
        duration: "55 Menit",
        level: "Terapan",
        summary: "Memahami perbedaan gambar garis 2D biasa dengan pemodelan parametrik cerdas yang otomatis menghitung volume material.",
        keyConcepts: [
          "Konsep BIM (Revit / ArchiCAD): Menggambar 1 elemen dinding 3D otomatis memperbarui Denah, Tampak, Potongan, dan Tabel Volume (Schedule/BoQ)",
          "Hierarki Elemen BIM: Category -> Family -> Type -> Instance",
          "Clash Detection: Mendeteksi tabrakan antara jalur pipa air/AC dengan balok struktur sebelum konstruksi dimulai di lapangan",
          "Penyusunan Rencana Anggaran Biaya (RAB) akurat berbasis ekstraksi kuantitas model BIM",
        ],
        studyMaterial:
          "Pada metode CAD 2D konvensional, jika posisi sebuah jendela digeser pada gambar Denah, juru gambar harus mengedit ulang gambar Tampak dan Potongan secara manual satu per satu. Dengan sistem BIM, seluruh gambar saling terhubung ke satu basis data terpusat sehingga meminimalkan kesalahan konstruksi di proyek.",
        baliCaseStudy:
          "Studi Kasus Bali: Pemodelan BIM 3D untuk koordinasi struktur dan utilitas mekanikal-elektrikal pada pembangunan gedung rumah sakit dan hotel ramah lingkungan di Bali.",
        practiceTask:
          "Jelaskan keuntungan utama fitur 'Schedule / Material Takeoff' pada perangkat lunak BIM saat menyusun Rencana Anggaran Biaya (RAB)!",
        scoreBoost: 6,
      },
      {
        id: "mod-ars-5",
        courseId: "ars-ekologis",
        courseName: "Fisika Bangunan & Desain Iklim Tropis (ARS209)",
        moduleCode: "GBCI-TR-01",
        semesterStage: "Semester 3 / Arsitektur Hijau",
        title: "Modul 5: Ventilasi Silang, Pembayangan Matahari (Shading) & Standar Greenship",
        duration: "50 Menit",
        level: "Terapan",
        summary: "Merancang bangunan yang sejuk secara alami dan hemat listrik di iklim tropis lembap Bali.",
        keyConcepts: [
          "Cross Ventilation: Bukaan jendela masuk (inlet) dan keluar udara (outlet) pada sisi dinding yang berhadapan",
          "Tritisan Atap Lebar (Overstek) & Secondary Skin untuk menahan tampias hujan deras dan radiasi panas matahari Barat",
          "Pengendalian OTTV (Overall Thermal Transfer Value) pada selubung bangunan gedung maksimal 35 Watt/m2 sesuai SNI 6389",
          "Pencahayaan Alami Siang Hari (Daylighting) dengan pantulan plafon terang tanpa menyilaukan mata",
        ],
        studyMaterial:
          "Iklim Bali memiliki suhu hangat dan kelembapan udara tinggi sepanjang tahun. Jika sebuah ruangan hanya memiliki jendela di satu sisi tanpa lubang keluar udara di sisi seberangnya, udara panas akan terperangkap di dalam ruang. Desain tropis wajib menyediakan jalur masuk angin dan jalur keluar udara panas di bagian atas (stack effect).",
        baliCaseStudy:
          "Studi Kasus Bali: Desain ruang kelas vokasi bebas AC di Badung yang menurunkan suhu ruang hingga 4 derajat Celsius melalui ventilasi silang dan roster terakota.",
        practiceTask:
          "Jelaskan solusi desain arsitektur jika sebuah lahan bangunan menghadap tepat ke arah matahari sore (Barat).",
        scoreBoost: 6,
        referenceResources: [
          {
            title: "Panduan Perangkat Penilaian Greenship Building",
            provider: "Green Building Council Indonesia (GBCI)",
            url: "https://www.gbcindonesia.org/",
          },
        ],
      },
      {
        id: "mod-ars-6",
        courseId: "ars-ekologis",
        courseName: "Fisika Bangunan & Desain Iklim Tropis (ARS209)",
        moduleCode: "GBCI-WTR-02",
        semesterStage: "Semester 4 / Konservasi Air & Tapak",
        title: "Modul 6: Konservasi Air Tanah, Pemanenan Air Hujan (Rainwater Harvesting) & Drainase Zero Run-Off",
        duration: "50 Menit",
        level: "Sertifikasi",
        summary: "Mengelola tata air tapak bangunan agar tidak menimbulkan banjir limpasan dan menjaga cadangan air tawar pulau Bali.",
        keyConcepts: [
          "Koefisien Dasar Bangunan (KDB) vs Koefisien Daerah Hijau (KDH) untuk menjamin area resapan air hujan",
          "Sistem Rainwater Harvesting: Talang atap -> Filter penyaring daun/pasir -> Tangki tampung -> Pemanfaatan flushing toilet & penyiraman taman",
          "Sumur Resapan Dalam dan Lubang Resapan Biopori untuk mengembalikan air hujan ke akuifer tanah (Zero Run-Off)",
          "Penggunaan Paving Berpori (Grass Block) pada area parkir menggantikan perkerasan beton kedap air",
        ],
        studyMaterial:
          "Pembangunan yang menutup seluruh permukaan tanah dengan beton kedap air menyebabkan air hujan langsung melimpas ke jalan raya sambil menguras cadangan air tanah. Dalam sertifikasi Greenship GBCI kategori Konservasi Air (Water Conservation), arsitek merancang tangki pemanenan air hujan dan sumur resapan agar air hujan meresap kembali ke bumi.",
        baliCaseStudy:
          "Studi Kasus Bali: Penerapan sistem pemanenan air hujan dan sumur resapan wajib pada bangunan villa, sekolah, dan perkantoran di Denpasar dan Kuta.",
        practiceTask:
          "Jika luas atap sebuah gedung sekolah adalah 500 m2 dan curah hujan harian 40 mm (0.04 m), hitung berapa meter kubik (m3) potensi air hujan yang jatuh di atas atap tersebut!",
        scoreBoost: 6,
      },
    ],
    certificationDrills: [
      {
        id: "cert-ars-1",
        courseId: "ars-cad",
        certTrack: "Autodesk Certified User (AutoCAD & BIM)",
        certName: "BNSP Juru Gambar Bangunan & Autodesk AutoCAD",
        competencyCode: "F.410000.002.02",
        question: "Pada gambar kerja berstandar skala 1:100, sebidang dinding ruang kelas memiliki panjang aktual 8 meter di lapangan. Berapakah panjang garis dinding tersebut saat dicetak pada lembar gambar, dan di ruang kerja manakah objek digambar dengan ukuran sebenarnya (1:1) di AutoCAD?",
        options: [
          "0.8 cm pada kertas; digambar di Paper Space",
          "8 cm pada kertas; digambar 1:1 di dalam Model Space lalu diatur skalanya melalui Viewport Layout",
          "80 cm pada kertas; digambar tanpa layer",
          "18 cm pada kertas; digambar di menu Help",
        ],
        correctIndex: 1,
        explanation:
          "Benar! 8 meter = 800 cm; dibagi skala 100 menghasilkan 8 cm pada kertas cetak. Dalam standar Autodesk AutoCAD, objek selalu digambar dengan ukuran asli 1:1 di Model Space.",
        scoreBoost: 6,
      },
      {
        id: "cert-ars-2",
        courseId: "ars-cad",
        certTrack: "Autodesk Certified User (AutoCAD & BIM)",
        certName: "Autodesk Certified User (Revit BIM Architecture)",
        competencyCode: "ACU-REV-3.1",
        question: "Apakah keunggulan utama penggunaan teknologi BIM (Building Information Modeling) seperti Autodesk Revit dibandingkan penggambaran garis CAD 2D biasa saat terjadi perubahan dimensi jendela pada denah?",
        options: [
          "Gambar tampak, potongan, model 3D, serta tabel perhitungan volume material (Schedule/BoQ) otomatis ikut diperbarui secara sinkron",
          "Juru gambar tetap harus menghapus dan menggambar ulang seluruh gambar potongan secara manual",
          "Perangkat lunak BIM hanya bisa membuat garis hitam putih tanpa ukuran",
          "Model BIM tidak dapat menampilkan potongan bangunan",
        ],
        correctIndex: 0,
        explanation:
          "Tepat! Inti dari BIM adalah pemodelan parametrik terpusat di mana setiap perubahan pada satu elemen langsung memperbarui seluruh dokumen gambar dan perhitungan volume.",
        scoreBoost: 6,
      },
      {
        id: "cert-ars-3",
        courseId: "ars-ekologis",
        certTrack: "Greenship Arsitektur Tropis & Iklim",
        certName: "Sertifikasi Arsitektur Hijau & Tropis (Greenship GBCI)",
        competencyCode: "GBCI.TR.01",
        question: "Strategi desain pasif manakah yang paling efektif menurunkan beban panas matahari sore (OTTV) pada fasad bangunan yang menghadap ke arah Barat di Bali?",
        options: [
          "Memasang dinding kaca bening penuh tanpa atap pelindung",
          "Menerapkan tritisan lebar (overhang), kisi-kisi peneduh (secondary skin/roster), dan vegetasi peneduh",
          "Mengecat seluruh dinding luar dengan warna hitam pekat penyerap kalor",
          "Menutup seluruh ventilasi udara agar angin tidak masuk",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Tritisan lebar, secondary skin (seperti kisi bambu atau roster bata), serta pohon peneduh menghalangi radiasi matahari langsung sebelum mencapai dinding dalam ruangan.",
        scoreBoost: 6,
      },
      {
        id: "cert-ars-4",
        courseId: "ars-ekologis",
        certTrack: "Greenship Arsitektur Tropis & Iklim",
        certName: "Greenship GBCI (Konservasi Air & Drainase Tapak)",
        competencyCode: "GBCI.WAC.02",
        question: "Untuk mencegah banjir limpasan air hujan dan menjaga cadangan air tanah di Bali, kombinasi perancangan tapak manakah yang sesuai dengan prinsip 'Zero Run-Off'?",
        options: [
          "Mengecor 100% halaman dengan beton kedap air dan membuang semua air hujan ke jalan raya",
          "Menyediakan Koefisien Daerah Hijau (KDH) yang memadai, menerapkan perkerasan berpori (grass block), memanen air hujan (rainwater harvesting), dan membuat sumur resapan biopori",
          "Menebang seluruh pohon peneduh di area parkir",
          "Menutup seluruh saluran resapan tanah dengan plastik",
        ],
        correctIndex: 1,
        explanation:
          "Benar! Pemanenan air hujan dan sumur resapan biopori menahan air hujan di dalam tapak untuk meresap kembali ke akuifer tanah serta menghemat pemakaian air bersih.",
        scoreBoost: 6,
      },
      {
        id: "cert-ars-5",
        courseId: "ars-tradisional",
        certTrack: "Asta Kosala Kosali & BNSP Juru Gambar",
        certName: "Kompetensi Tata Ruang Tradisional Bali",
        competencyCode: "AKK.104.02",
        question: "Dalam tata ruang Sanga Mandala, apakah fungsi klimatologis dan sosial dari ruang terbuka 'Natah' di tengah pekarangan?",
        options: [
          "Sebagai area tertutup khusus penyimpanan bahan kimia",
          "Sebagai ruang sirkulasi udara alami (mikroklimat), pencahayaan, dan pusat interaksi kegiatan keluarga/upacara",
          "Untuk menghilangkan seluruh tanaman hijau dari pekarangan",
          "Sebagai pembatas agar antar anggota keluarga tidak pernah bertemu",
        ],
        correctIndex: 1,
        explanation:
          "Benar! Natah merupakan inti ruang terbuka yang menyatukan fungsi sosial-budaya sekaligus menjaga aliran udara segar antar bale.",
        scoreBoost: 6,
      },
      {
        id: "cert-ars-6",
        courseId: "ars-tradisional",
        certTrack: "Asta Kosala Kosali & BNSP Juru Gambar",
        certName: "Konstruksi Tradisional Bali & Mitigasi Gempa",
        competencyCode: "AKK.104.05",
        question: "Mengapa sistem struktur rangka kayu pada Bale Bali tradisional (menggunakan tiang Saka, Sunduk, dan pasak kayu tanpa paku kaku) memiliki ketahanan tinggi terhadap guncangan gempa bumi?",
        options: [
          "Karena sambungan pasak kayu bersifat fleksibel (semi-rigid) yang mampu bergoyang meredam energi getaran gempa tanpa meruntuhkan struktur utama",
          "Karena kayu tidak memiliki massa sama sekali",
          "Karena bangunan tradisional tidak memiliki atap",
          "Karena pondasinya digantung di udara",
        ],
        correctIndex: 0,
        explanation:
          "Tepat! Sambungan pasak dan sunduk bekerja mendisipasi (meredam) gaya lateral gempa melalui gesekan elastis antar elemen kayu.",
        scoreBoost: 6,
      },
    ],
  },

  // 5. KESEHATAN KOMUNITAS & KEPERAWATAN
  kesehatan: {
    fieldId: "kesehatan",
    fieldName: "Kesehatan Komunitas & Keperawatan",
    group: "manusia",
    certificationBody: "UKOM Nasional Ners/Vokasi, BTCLS & BNSP Kesehatan (SKKNI)",
    mainCertificationTitle: "Sertifikasi Uji Kompetensi Keperawatan (KES.PG), BTCLS Gawat Darurat & BNSP Caregiver/Farmasi",
    availableCertTracks: [
      "UKOM Nasional & Patient Safety (KES.PG)",
      "BTCLS (Triase & Gawat Darurat Dasar)",
      "BNSP Caregiver (Q.86.CGL) & Farmasi Klinis",
    ],
    targetCourses: [
      {
        id: "kes-anatomi",
        code: "KEP101",
        name: "Ilmu Biomedik Dasar, Tanda Vital & Kegawatdaruratan BTCLS",
        sks: 4,
        minScore: 80,
        coreCompetency: "Sistem Kardiovaskular-Respirasi, Tanda Vital (TTV), RJP/CPR & Triase START",
        certificationAlignment: "BTCLS (Triase & Gawat Darurat Dasar)",
        description: "Pemahaman struktur anatomi dan mekanisme fisiologis tubuh manusia sebagai dasar pemeriksaan klinis dan bantuan hidup dasar.",
      },
      {
        id: "kes-dasar",
        code: "KEP203",
        name: "Keperawatan Dasar, PPI & Enam Sasaran Keselamatan Pasien (UKOM)",
        sks: 4,
        minScore: 80,
        coreCompetency: "Pencegahan Infeksi (PPI), Prinsip 6 Benar Obat, SBAR & Patient Safety",
        certificationAlignment: "UKOM Nasional & Patient Safety (KES.PG)",
        description: "Prosedur klinis standar, sterilisasi alat, komunikasi terapeutik SBAR, dan enam sasaran keselamatan pasien rumah sakit.",
      },
      {
        id: "kes-komunitas",
        code: "KEP305",
        name: "Keperawatan Gerontik (Caregiver), Farmasi Dasar & Wisata Medis Bali",
        sks: 3,
        minScore: 76,
        coreCompetency: "Asuhan Lansia (Q.86.CGL), Pengelolaan Obat High-Alert/LASA & Travel Medicine",
        certificationAlignment: "BNSP Caregiver (Q.86.CGL) & Farmasi Klinis",
        description: "Pendampingan kesehatan lansia berstandar SKKNI Caregiver, keamanan perbekalan farmasi, serta layanan wisata medis di Bali.",
      },
    ],
    remedialActionPlan: [
      {
        stepNumber: "01",
        phase: "Minggu 1 - 2: Penguatan Biologi Manusia & Tanda Vital",
        title: "Kuasai Konsep Anatomi Fisiologi & Pemeriksaan Dasar",
        action: "Pelajari Modul 1 dan Modul 2 tentang sistem kardiovaskular-respirasi, rentang normal tanda vital (TTV), dan algoritma Bantuan Hidup Dasar (BTCLS).",
        targetOutcome: "Menutup kekurangan nilai Biologi/IPA pada prasyarat mata kuliah Ilmu Biomedik Dasar.",
      },
      {
        stepNumber: "02",
        phase: "Minggu 3 - 4: Standar Keselamatan Pasien & Pencegahan Infeksi",
        title: "Latihan Prosedur PPI, SBAR & Keamanan Obat Farmasi",
        action: "Pelajari Modul 3 dan Modul 4 mengenai 6 Sasaran Keselamatan Pasien, Prinsip 6 Benar Pemberian Obat, dan pengelolaan obat LASA/High-Alert.",
        targetOutcome: "Siap mengikuti praktikum laboratorium Keperawatan Dasar dan Farmasi.",
      },
      {
        stepNumber: "03",
        phase: "Minggu 5 - 6: Simulasi Uji Kompetensi (UKOM), BTCLS & Caregiver BNSP",
        title: "Latihan Kasus Klinis, Triase & Asuhan Lansia (Q.86.CGL)",
        action: "Pelajari Modul 5 dan Modul 6 lalu kerjakan 6 soal simulasi uji kompetensi keperawatan, BTCLS, dan BNSP Caregiver.",
        targetOutcome: "Mencapai skor minimal 80% pada simulasi sertifikasi.",
      },
      {
        stepNumber: "04",
        phase: "Minggu 7 - 8: Proyek Edukasi Kesehatan Banjar/Sekolah",
        title: "Susun Media Promosi Kesehatan Komunitas",
        action: "Buat rencana penyuluhan singkat (misalnya pencegahan demam berdarah atau perawatan hipertensi lansia) sebagai bukti kepedulian kesehatan masyarakat.",
        targetOutcome: "Kesiapan penuh untuk Poltekkes Kemenkes Denpasar, Unud, atau SMK Kesehatan.",
      },
    ],
    mismatchBridgeAdvice:
      "Jika nilai IPA/Biologi Anda saat ini belum tinggi namun Anda memiliki kepedulian sosial yang kuat, fokuslah terlebih dahulu pada mekanisme logis tubuh manusia (Tanda Vital & Pencegahan Infeksi) serta Keperawatan Komunitas/Caregiver.",
    learningModules: [
      {
        id: "mod-kes-1",
        courseId: "kes-anatomi",
        courseName: "Ilmu Biomedik Dasar & Kegawatdaruratan (KEP101)",
        moduleCode: "KES.PG01.001",
        semesterStage: "Semester 1 / Fondasi Klinis",
        title: "Modul 1: Pemeriksaan Tanda-Tanda Vital (TTV), Homeostasis & Pengkajian ABCDE",
        duration: "50 Menit",
        level: "Dasar",
        summary: "Mengenal 4 indikator utama fungsi fisiologis tubuh manusia serta penilaian cepat pasien klinis.",
        keyConcepts: [
          "Tekanan Darah Normal Dewasa: Sistolik 90-120 mmHg dan Diastolik 60-80 mmHg",
          "Frekuensi Denyut Nadi Normal Dewasa: 60-100 kali/menit; Pernapasan (Respirasi): 12-20 kali/menit; Suhu: 36.5 - 37.5 C",
          "Primary Survey (ABCDE): Airway (Jalan Napas), Breathing (Pernapasan), Circulation (Sirkulasi), Disability (Kesadaran GCS), Exposure",
          "Keseimbangan Cairan & Elektrolit: Tanda klinis dehidrasi ringan, sedang, hingga syok hipovolemik",
        ],
        studyMaterial:
          "Tanda-Tanda Vital (TTV) adalah pengukuran objektif paling mendasar yang wajib dikuasai setiap mahasiswa kesehatan. Perubahan mendadak pada frekuensi napas atau penurunan tekanan darah disertai nadi cepat dan lemah merupakan sinyal peringatan dini (Early Warning Score) bahwa tubuh pasien sedang mengalami gangguan perfusi oksigen.",
        baliCaseStudy:
          "Studi Kasus Bali: Protokol pemeriksaan cepat tanda vital dan rehidrasi bagi wisatawan yang mengalami kelelahan panas saat mendaki Gunung Batur.",
        practiceTask:
          "Tuliskan langkah pengkajian awal jika seorang pasien datang dengan keluhan lemas berat, bibir kering, nadi 115 kali/menit, dan tekanan darah 85/55 mmHg!",
        scoreBoost: 6,
        referenceResources: [
          {
            title: "WHO Patient Safety Curriculum Guide",
            provider: "World Health Organization",
            url: "https://www.who.int/publications/i/item/9789241501958",
          },
        ],
      },
      {
        id: "mod-kes-2",
        courseId: "kes-anatomi",
        courseName: "Ilmu Biomedik Dasar & Kegawatdaruratan (KEP101)",
        moduleCode: "BTCLS-MOD-02",
        semesterStage: "Semester 1 / Sertifikasi BTCLS",
        title: "Modul 2: Bantuan Hidup Dasar (BHD/CPR), Triase Bencana START & Penanganan Trauma",
        duration: "55 Menit",
        level: "Menengah",
        summary: "Menguasai prosedur penyelamatan henti jantung-napas dan klasifikasi prioritas korban gawat darurat.",
        keyConcepts: [
          "Prinsip 3A Sebelum Menolong: Aman Diri (APD), Aman Lingkungan, dan Aman Pasien",
          "Urutan Bantuan Hidup Dasar (CAB): Compressions (Kompresi dada 30 kali dengan kecepatan 100-120x/menit kedalaman 5-6 cm) -> Airway -> Breathing (2 napas bantuan)",
          "Sistem Triase Warna IGD/Lapangan (START): Merah (Immediate/Mengancam nyawa segera), Kuning (Delayed), Hijau (Minor), Hitam (Meninggal)",
          "Penanganan Awal Perdarahan Ekstremitas (Direct Pressure) dan Pembidaian Fraktur (meliputi 2 sendi)",
        ],
        studyMaterial:
          "Dalam kurikulum Basic Trauma Cardiac Life Support (BTCLS), setiap menit keterlambatan kompresi dada (RJP/CPR) pada pasien henti jantung menurunkan peluang hidup sebesar 7-10%. Saat menghadapi banyak korban sekaligus, perawat menggunakan metode START (Simple Triage and Rapid Treatment) yang menilai kemampuan berjalan, frekuensi napas, perfusi kapiler (CRT < 2 detik), dan kesadaran mengikuti perintah.",
        baliCaseStudy:
          "Studi Kasus Bali: Kesiapsiagaan tim medis darurat pesisir (Balawista & Klinik Pantai Kuta/Nusa Dua) dalam menangani kasus nyaris tenggelam (near-drowning).",
        practiceTask:
          "Sebutkan rasio kompresi dada berbanding pemberian napas buatan pada RJP dewasa 1 penolong beserta kecepatan kompresi per menitnya!",
        scoreBoost: 6,
      },
      {
        id: "mod-kes-3",
        courseId: "kes-dasar",
        courseName: "Keperawatan Dasar & Keselamatan Pasien (KEP203)",
        moduleCode: "KES.VK01.003",
        semesterStage: "Semester 2 / Standar UKOM & Akreditasi RS",
        title: "Modul 3: Enam Sasaran Keselamatan Pasien (SKP) & Komunikasi Efektif SBAR",
        duration: "55 Menit",
        level: "Menengah",
        summary: "Memahami prosedur wajib rumah sakit dan klinik agar pasien terhindar dari insiden keselamatan medis.",
        keyConcepts: [
          "SKP 1 - Ketepatan Identifikasi Pasien: Minimal 2 identitas resmi (Nama Lengkap & Tanggal Lahir/No. Rekam Medis, dilarang menggunakan nomor kamar)",
          "SKP 2 - Komunikasi Efektif SBAR (Situation, Background, Assessment, Recommendation) dan metode TBAK (Tulis, Baca, Konfirmasi Ulang) via telepon",
          "SKP 3 s.d. 6: Keamanan Obat High-Alert, Kepastian Tepat-Lokasi/Tepat-Prosedur Operasi (Site Marking), Pengurangan Risiko Infeksi, dan Pencegahan Pasien Jatuh (Gelang Kuning)",
          "Dokumentasi Asuhan Keperawatan: Pengkajian, Diagnosis (SDKI), Intervensi (SIKI), Implementasi, dan Evaluasi SOAP (SLKI)",
        ],
        studyMaterial:
          "Uji Kompetensi Nasional (UKOM) Keperawatan sangat menekankan keselamatan pasien dan penggunaan standar SDKI-SLKI-SIKI PPNI. Sebelum melakukan tindakan invasif atau pemberian obat, perawat wajib mencocokkan gelang identitas pasien (Biru untuk laki-laki, Merah Muda untuk perempuan, Merah untuk alergi, Kuning untuk risiko jatuh).",
        baliCaseStudy:
          "Studi Kasus Bali: Penerapan komunikasi SBAR dwibahasa (Indonesia-Inggris) pada rumah sakit rujukan wisata medis internasional di Denpasar dan Sanur.",
        practiceTask:
          "Susun kalimat laporan singkat menggunakan format SBAR untuk melaporkan pasien dengan suhu tubuh 39.1 C dan tekanan darah 90/60 mmHg kepada dokter jaga.",
        scoreBoost: 6,
      },
      {
        id: "mod-kes-4",
        courseId: "kes-dasar",
        courseName: "Keperawatan Dasar & Keselamatan Pasien (KEP203)",
        moduleCode: "KES.PG02.012",
        semesterStage: "Semester 2 / Pencegahan Infeksi (PPI)",
        title: "Modul 4: Pencegahan dan Pengendalian Infeksi (PPI), Sterilisasi & Manajemen Limbah Medis",
        duration: "50 Menit",
        level: "Terapan",
        summary: "Memutus rantai penularan infeksi nosokomial (HAIs) di fasilitas pelayanan kesehatan.",
        keyConcepts: [
          "5 Momen Cuci Tangan WHO: Sebelum kontak pasien, sebelum tindakan aseptik, setelah terkena cairan tubuh, setelah kontak pasien, setelah kontak lingkungan pasien",
          "Dekontaminasi Alat Medis: Pre-cleaning (enzimatik) -> Pencucian -> Desinfeksi Tingkat Tinggi (DTT) / Sterilisasi Autoklaf uap bertekanan",
          "Pemilahan Limbah Medis: Kantong Kuning (Infeksius/Kasa darah), Kantong Hitam (Domestik non-medis), Kantong Cokelat (Farmasi/Kedaluwarsa), dan Safety Box (Jarum suntik/Benda tajam)",
          "Prinsip Aseptik & Larangan Recapping (tidak menutup ulang jarum suntik bekas dengan dua tangan)",
        ],
        studyMaterial:
          "Infeksi terkait pelayanan kesehatan (Healthcare-Associated Infections / HAIs) dapat dicegah dengan kepatuhan kebersihan tangan (6 langkah cuci tangan: 20-30 detik dengan handrub berbasis alkohol atau 40-60 detik dengan air mengalir dan sabun) serta pembuangan benda tajam langsung ke dalam Safety Box.",
        baliCaseStudy:
          "Studi Kasus Bali: Standar pengelolaan limbah medis ramah lingkungan dan audit PPI pada jaringan klinik pratama serta rumah sakit daerah di Bali.",
        practiceTask:
          "Jelaskan ke dalam wadah warna apa masing-masing limbah berikut harus dibuang: (1) Jarum infus bekas, (2) Kapas bekas darah pasien, dan (3) Bungkus makanan pembesuk!",
        scoreBoost: 6,
      },
      {
        id: "mod-kes-5",
        courseId: "kes-komunitas",
        courseName: "Keperawatan Gerontik, Farmasi Dasar & Wisata Medis (KEP305)",
        moduleCode: "FARM-K3-05",
        semesterStage: "Semester 3 / Kefarmasian & K3 Obat",
        title: "Modul 5: Prinsip 6 Benar Pemberian Obat, Manajemen Obat LASA/High-Alert & Kalkulasi Dosis",
        duration: "50 Menit",
        level: "Terapan",
        summary: "Menjamin keamanan pemberian terapi obat, penyimpanan perbekalan farmasi, dan perhitungan tetesan infus.",
        keyConcepts: [
          "Prinsip 6 Benar Obat: Benar Pasien, Benar Obat, Benar Dosis, Benar Rute Pemberian (Oral/IV/IM/SC), Benar Waktu, dan Benar Dokumentasi",
          "Obat LASA (Look Alike Sound Alike / NORUM - Nama Obat Rupa Ucapan Mirip): Disimpan terpisah dengan penulisan Tall Man Lettering dan stiker LASA",
          "Sistem Penyimpanan Farmasi FEFO (First Expired First Out) & FIFO (First In First Out) serta pemantauan suhu kulkas vaksin/insulin (2-8 C)",
          "Rumus Tetesan Infus Makro (Faktor tetes 20 tetes/mL): `(Volume Cairan mL x Faktor Tetes) / (Lama Pemberian Jam x 60 menit)`",
        ],
        studyMaterial:
          "Dalam kompetensi Asisten Tenaga Kefarmasian dan Keperawatan Klinis, obat High-Alert (seperti elektrolit konsentrat KCl 7.46% dan Insulin) wajib diberi stiker merah 'High Alert' dan melewati pengecekan ganda (Independent Double Check) oleh dua petugas sebelum diberikan kepada pasien.",
        baliCaseStudy:
          "Studi Kasus Bali: Manajemen rantai dingin (Cold Chain) vaksin dan kesiapan perbekalan farmasi pada klinik wisata internasional di Badung.",
        practiceTask:
          "Seorang pasien dewasa membutuhkan cairan infus RL sebanyak 500 mL yang harus habis dalam waktu 5 jam menggunakan set infus makro (faktor tetes = 20 tetes/mL). Hitung berapa tetes per menit (tpm) kecepatan infus tersebut!",
        scoreBoost: 6,
      },
      {
        id: "mod-kes-6",
        courseId: "kes-komunitas",
        courseName: "Keperawatan Gerontik, Farmasi Dasar & Wisata Medis (KEP305)",
        moduleCode: "Q.86.CGL.01",
        semesterStage: "Semester 4 / SKKNI Caregiver & Komunitas",
        title: "Modul 6: Asuhan Keperawatan Gerontik (SKKNI Caregiver Q.86.CGL) & Promosi Kesehatan Banjar",
        duration: "45 Menit",
        level: "Sertifikasi",
        summary: "Pendampingan aktivitas harian lansia (ADL), pencegahan luka tekan (dekubitus), dan manajemen kesehatan komunitas.",
        keyConcepts: [
          "Standar Kompetensi Caregiver Lansia (Permenaker No. 28 Tahun 2021 - Q.86.CGL): Bantuan Activity of Daily Living (ADL), mobilisasi aman, dan komunikasi empatik",
          "Pencegahan Ulkus Dekubitus (Luka Tekan) pada pasien tirah baring lama: Alih baring miring kanan-kiri setiap 2 jam dan menjaga kulit tetap bersih-kering",
          "Lima Tingkat Pencegahan Penyakit (Leavell & Clark) di komunitas banjar/desa",
          "Layanan Senior Living & Wellness Tourism di Bali yang membutuhkan tenaga Caregiver tersertifikasi BNSP",
        ],
        studyMaterial:
          "Bali tengah berkembang menjadi pusat Wellness & Senior Living Tourism di Asia Tenggara. Tenaga kesehatan dan Caregiver yang menguasai unit kompetensi `Q.86.CGL` memiliki peluang karier luas baik di rumah sakit internasional, klinik homecare di Bali, maupun penempatan kerja profesional luar negeri.",
        baliCaseStudy:
          "Studi Kasus Bali: Program Posyandu Lansia terpadu di tingkat banjar serta layanan homecare gerontik di Sanur dan Ubud.",
        practiceTask:
          "Jelaskan 3 langkah pencegahan jatuh dan luka tekan (dekubitus) saat merawat pasien lansia dengan keterbatasan gerak di tempat tidur!",
        scoreBoost: 6,
      },
    ],
    certificationDrills: [
      {
        id: "cert-kes-1",
        courseId: "kes-dasar",
        certTrack: "UKOM Nasional & Patient Safety (KES.PG)",
        certName: "Uji Kompetensi Keperawatan & BNSP Kesehatan",
        competencyCode: "KES.PG01.004.01",
        question: "Sebelum memberikan obat injeksi kepada pasien rawat inap, prosedur identifikasi pasien manakah yang paling tepat sesuai standar Sasaran Keselamatan Pasien?",
        options: [
          "Menanyakan nomor kamar dan menebak nama panggilan pasien",
          "Memeriksa minimal dua penanda identitas resmi pada gelang pasien (Nama Lengkap dan Tanggal Lahir/Nomor Rekam Medis)",
          "Langsung memberikan obat karena pasien berada di tempat tidur yang sama sejak kemarin",
          "Bertanya kepada pengunjung di ruang tunggu",
        ],
        correctIndex: 1,
        explanation:
          "Benar! Standar keselamatan pasien mewajibkan verifikasi minimal 2 identitas unik (Nama Lengkap dan Tanggal Lahir/No. RM) dan dilarang menggunakan nomor kamar atau nomor tempat tidur.",
        scoreBoost: 6,
      },
      {
        id: "cert-kes-2",
        courseId: "kes-dasar",
        certTrack: "UKOM Nasional & Patient Safety (KES.PG)",
        certName: "UKOM Keperawatan (Manajemen Limbah Medis & PPI)",
        competencyCode: "KES.VK01.008.01",
        question: "Setelah selesai melakukan tindakan pemasangan infus pada pasien, ke manakah jarum introducer (benda tajam) dan kasa yang terkontaminasi darah harus dibuang sesuai standar PPI?",
        options: [
          "Keduanya dibuang ke tempat sampah plastik hitam biasa",
          "Jarum langsung dimasukkan ke dalam Safety Box tanpa ditutup ulang (no recapping), sedangkan kasa berdarah dibuang ke kantong plastik Kuning infeksius",
          "Jarum dibuang ke kantong cokelat, kasa dibuang ke wastafel cuci tangan",
          "Dicuci dengan air keran lalu disimpan di meja pasien",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Benda tajam medis wajib langsung masuk ke Safety Box tahan tusuk tanpa recapping untuk mencegah needle-stick injury, sedangkan limbah infeksius non-tajam masuk ke kantong Kuning.",
        scoreBoost: 6,
      },
      {
        id: "cert-kes-3",
        courseId: "kes-anatomi",
        certTrack: "BTCLS (Triase & Gawat Darurat Dasar)",
        certName: "Sertifikasi Kegawatdaruratan Dasar (BTCLS) & UKOM",
        competencyCode: "BTCLS-TRI-01",
        question: "Pada sistem Triase IGD (START), seorang pasien kecelakaan datang dengan kondisi sumbatan jalan napas parsial dan frekuensi pernapasan 35 kali/menit (mengancam nyawa jika tidak ditangani segera). Label warna triase apakah yang wajib diberikan?",
        options: [
          "Hijau (Tidak gawat, bisa menunggu beberapa jam)",
          "Merah (Immediate / Prioritas Utama Gawat Darurat)",
          "Putih (Dipulangkan langsung tanpa pemeriksaan)",
          "Biru Muda (Khusus pemeriksaan administrasi)",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Gangguan pada Airway (jalan napas) dan Breathing (laju napas > 30x/menit) dikategorikan sebagai label Merah (Immediate) yang harus mendapatkan pertolongan medis seketika.",
        scoreBoost: 6,
      },
      {
        id: "cert-kes-4",
        courseId: "kes-anatomi",
        certTrack: "BTCLS (Triase & Gawat Darurat Dasar)",
        certName: "BTCLS (Kalkulasi Terapi Cairan Infus)",
        competencyCode: "KES.PG02.035.01",
        question: "Dokter menginstruksikan pemberian cairan infus NaCl 0,9% sebanyak 500 mL untuk dihabiskan dalam waktu 5 jam menggunakan infus set makro (faktor tetes = 20 tetes/mL). Berapakah kecepatan tetesan infus yang harus diatur oleh perawat?",
        options: [
          "10 tetes/menit",
          "33 tetes/menit",
          "100 tetes/menit",
          "5 tetes/menit",
        ],
        correctIndex: 1,
        explanation:
          "Benar! Rumus tetesan per menit = `(500 mL x 20 tetes/mL) / (5 jam x 60 menit) = 10.000 / 300 = 33,3` -> dibulatkan menjadi 33 tetes/menit.",
        scoreBoost: 6,
      },
      {
        id: "cert-kes-5",
        courseId: "kes-komunitas",
        certTrack: "BNSP Caregiver (Q.86.CGL) & Farmasi Klinis",
        certName: "BNSP Caregiver Lanjut Usia (SKKNI No. 28/2021)",
        competencyCode: "Q.86.CGL.01.018.1",
        question: "Dalam merawat pasien lansia yang mengalami tirah baring total (bedrest) di tempat tidur, tindakan keperawatan manakah yang wajib dilakukan secara berkala untuk mencegah terjadinya luka tekan (ulkus dekubitus)?",
        options: [
          "Membiarkan pasien dalam posisi telentang terus-menerus selama 7 hari tanpa digerakkan",
          "Melakukan alih baring (mobilisasi miring kanan dan miring kiri) setiap 2 jam sekali serta menjaga kebersihan dan kelembapan kulit",
          "Mengikat erat kedua kaki pasien pada rangka besi tempat tidur",
          "Menggunakan seprai yang kasar dan basah",
        ],
        correctIndex: 1,
        explanation:
          "Benar! Alih posisi setiap 2 jam sekali membebaskan penekanan berkepanjangan pada tonjolan tulang (sakrum, tumit, skapula) sehingga aliran darah kapiler kulit tetap lancar.",
        scoreBoost: 6,
      },
      {
        id: "cert-kes-6",
        courseId: "kes-komunitas",
        certTrack: "BNSP Caregiver (Q.86.CGL) & Farmasi Klinis",
        certName: "BNSP Asisten Tenaga Kefarmasian (Manajemen Obat LASA & FEFO)",
        competencyCode: "FARM.K3.004.01",
        question: "Di instalasi farmasi rumah sakit dan apotek, bagaimanakah cara penyimpanan dan penandaan yang benar untuk kelompok obat LASA (Look Alike Sound Alike / Nama Obat Rupa Ucapan Mirip)?",
        options: [
          "Dicampur di dalam satu wadah yang sama tanpa label nama",
          "Diberi jarak/diselingi dengan obat lain pada rak penyimpanan, ditempeli stiker LASA, dan ditulis dengan metode Tall Man Lettering (misal: efeDRIN vs efiNEFrin)",
          "Disimpan di bawah sinar matahari langsung di luar ruangan",
          "Diberikan kepada pasien tanpa membaca resep dokter",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Penataan terpisah, stiker LASA, dan huruf kapital pembeda (Tall Man Lettering) mencegah kesalahan ambil obat (medication error) yang memiliki kemasan atau bunyi nama mirip.",
        scoreBoost: 6,
      },
    ],
  },

  // 6. PENDIDIKAN & BIMBINGAN KONSELING
  pendidikan: {
    fieldId: "pendidikan",
    fieldName: "Pendidikan & Bimbingan Konseling",
    group: "manusia",
    certificationBody: "Google for Education, Kemendikdasmen (PPG) & BNSP Metodologi Pelatihan",
    mainCertificationTitle: "Sertifikasi Google Certified Educator, BNSP Metodologi Pelatihan (N.78SPS02) & Konseling Karier",
    availableCertTracks: [
      "BNSP Metodologi Pelatihan & Pedagogik (N.78SPS02)",
      "Google Certified Educator & EdTech",
      "Bimbingan Karier RIASEC & Konseling Empatik",
    ],
    targetCourses: [
      {
        id: "edu-psikologi",
        code: "EDU101",
        name: "Psikologi Perkembangan & Diagnostik Kesulitan Belajar",
        sks: 3,
        minScore: 76,
        coreCompetency: "Pemetaan Gaya Belajar, Scaffolding ZPD & Pendekatan Konseling Empatik",
        certificationAlignment: "Bimbingan Karier RIASEC & Konseling Empatik",
        description: "Memahami tahapan perkembangan kognitif, sosial-emosional remaja, serta metode identifikasi hambatan belajar siswa.",
      },
      {
        id: "edu-pedagogi",
        code: "EDU204",
        name: "Desain Kurikulum Merdeka & Metodologi Pelatihan (Standar BNSP & Google Educator)",
        sks: 4,
        minScore: 78,
        coreCompetency: "Session Plan (N.78SPS02), Taksonomi Bloom, Micro-Teaching & EdTech",
        certificationAlignment: "Google Certified Educator & EdTech",
        description: "Merancang pengalaman belajar interaktif yang menyesuaikan kecepatan belajar siswa menggunakan teknologi pendidikan dan standar instruktur BNSP.",
      },
      {
        id: "edu-karier",
        code: "EDU209",
        name: "Asesmen Pembelajaran, Evaluasi Kompetensi & Bimbingan Karier",
        sks: 3,
        minScore: 77,
        coreCompetency: "Rubrik Penilaian Autentik, Teori Karier RIASEC & Etika Konseling",
        certificationAlignment: "BNSP Metodologi Pelatihan & Pedagogik (N.78SPS02)",
        description: "Teknik penyusunan instrumen evaluasi objektif serta pendampingan siswa dalam merencanakan masa depan studi dan karier.",
      },
    ],
    remedialActionPlan: [
      {
        stepNumber: "01",
        phase: "Minggu 1 - 2: Penguatan Komunikasi Publik & Empati",
        title: "Latihan Mendengarkan Aktif (Active Listening) & Struktur Penjelasan",
        action: "Pelajari Modul 1 dan Modul 2 untuk menyampaikan konsep rumit menjadi bahasa sederhana serta merespon kebingungan siswa tanpa menyalahkan.",
        targetOutcome: "Meningkatkan kesiapan dasar pada mata kuliah Psikologi Perkembangan dan Konseling.",
      },
      {
        stepNumber: "02",
        phase: "Minggu 3 - 4: Penguasaan Desain Modul Ajar & Session Plan BNSP",
        title: "Menyusun Tujuan Pembelajaran ABCD & Media Digital",
        action: "Selesaikan Modul 3 dan Modul 4 mengenai Pembelajaran Berdiferensiasi, Taksonomi Bloom, dan Google Workspace for Education.",
        targetOutcome: "Mampu membuat kerangka materi ajar 1 pertemuan yang runtut dan terukur.",
      },
      {
        stepNumber: "03",
        phase: "Minggu 5 - 6: Simulasi Sertifikasi BNSP Instruktur & Google Educator",
        title: "Uji Studi Kasus Penanganan Siswa & Evaluasi Belajar",
        action: "Pelajari Modul 5 dan Modul 6 lalu kerjakan 6 latihan uji kompetensi pedagogik, metodologi pelatihan BNSP, dan bimbingan konseling.",
        targetOutcome: "Skor simulasi sertifikasi mencapai minimal 80%.",
      },
      {
        stepNumber: "04",
        phase: "Minggu 7 - 8: Praktik Micro-Teaching / Panduan Sebaya",
        title: "Buat Modul Bimbingan Singkat untuk Teman Sebaya",
        action: "Susun 1 lembar panduan belajar atau peta karier yang siap dipresentasikan saat seleksi masuk Undiksha atau UPGRIM.",
        targetOutcome: "Skor kesiapan jurusan melampaui ambang batas standar.",
      },
    ],
    mismatchBridgeAdvice:
      "Dunia pendidikan modern membutuhkan pendidik dari berbagai latar keahlian (baik teknologi, sains, maupun bahasa). Jika Anda masih gugup berbicara di depan umum, mulailah dari perancangan media belajar digital dan bimbingan kelompok kecil.",
    learningModules: [
      {
        id: "mod-edu-1",
        courseId: "edu-psikologi",
        courseName: "Psikologi Perkembangan & Diagnostik Belajar (EDU101)",
        moduleCode: "EDU-ZPD-01",
        semesterStage: "Semester 1 / Psikologi Pendidikan",
        title: "Modul 1: Pembagian Gaya Belajar, Scaffolding Vygotsky & Diagnostik Kesulitan Belajar",
        duration: "45 Menit",
        level: "Dasar",
        summary: "Mengenali perbedaan kebutuhan belajar setiap siswa dan membangun rasa aman psikologis saat sesi bimbingan.",
        keyConcepts: [
          "Pembelajaran Berdiferensiasi (Tomlinson): Menyesuaikan Konten, Proses, dan Produk sesuai profil kesiapan siswa",
          "Zone of Proximal Development (ZPD) & Scaffolding: Memberikan bantuan terstruktur pada konsep yang belum dikuasai siswa lalu melepasnya bertahap",
          "Growth Mindset (Carol Dweck): Nilai rendah saat ini adalah indikator belum terlatih, bukan ketidakmampuan permanen",
          "Diagnostik Kesulitan Belajar: Membedakan kendala prasyarat kognitif vs kendala motivasi/lingkungan keluarga",
        ],
        studyMaterial:
          "Seorang pendidik dan konselor profesional tidak pernah melabeli siswa sebagai 'tidak berbakat' hanya karena satu hasil nilai tes yang rendah. Tugas utama bimbingan adalah mendiagnosis letak mata rantai konsep yang terputus, lalu menyediakan perancah belajar (scaffolding) hingga siswa mampu mandiri.",
        baliCaseStudy:
          "Studi Kasus Bali: Pendekatan bimbingan karier berbasis filosofi Asah, Asih, Asuh di sekolah menengah Kabupaten Buleleng dan Denpasar.",
        practiceTask:
          "Tuliskan cara merespon siswa yang merasa putus asa karena nilai matematikanya kecil padahal ingin masuk jurusan teknik.",
        scoreBoost: 6,
      },
      {
        id: "mod-edu-2",
        courseId: "edu-psikologi",
        courseName: "Psikologi Perkembangan & Diagnostik Belajar (EDU101)",
        moduleCode: "BK-KON-02",
        semesterStage: "Semester 1 / Teknik Konseling",
        title: "Modul 2: Keterampilan Dasar Konseling (Attending, Empathy, Paraphrasing) & Etika Kerahasiaan",
        duration: "45 Menit",
        level: "Dasar",
        summary: "Mempraktikkan komunikasi konseling perorangan maupun kelompok yang membangun kepercayaan siswa.",
        keyConcepts: [
          "Perilaku Attending: Kontak mata hangat, postur tubuh terbuka, dan mendengarkan aktif tanpa memotong kalimat konseli",
          "Refleksi Perasaan & Paraphrasing: Merangkum kembali inti ucapan siswa untuk memastikan pemahaman yang tepat",
          "Pertanyaan Terbuka (Open-Ended Questions) untuk menggali akar permasalahan minat dan belajar siswa",
          "Asas Kerahasiaan, Kesukarelaan, dan Kemandirian dalam Kode Etik Bimbingan dan Konseling Indonesia (ABKIN)",
        ],
        studyMaterial:
          "Dalam sesi konseling, siswa sering kali enggan terbuka jika langsung dihakimi atau diceramahi. Dengan teknik Paraphrasing dan Refleksi Perasaan, konselor membantu siswa menjernihkan pikirannya sendiri sebelum menyusun rencana aksi perbaikan nilai.",
        baliCaseStudy:
          "Studi Kasus Bali: Layanan konseling sebaya (Peer Counseling) untuk mencegah perundungan dan stres akademik di SMA/SMK se-Bali.",
        practiceTask:
          "Ubahlah kalimat tertutup 'Apakah kamu malas belajar?' menjadi 1 kalimat pertanyaan terbuka yang empatik untuk memulai sesi konseling!",
        scoreBoost: 6,
      },
      {
        id: "mod-edu-3",
        courseId: "edu-pedagogi",
        courseName: "Desain Kurikulum & Metodologi Pelatihan (EDU204)",
        moduleCode: "N.78SPS02.019.2",
        semesterStage: "Semester 2 / Standar BNSP Instruktur",
        title: "Modul 3: Merencanakan Penyajian Materi Pelatihan (Session Plan), Rumus ABCD & Taksonomi Bloom",
        duration: "50 Menit",
        level: "Menengah",
        summary: "Menyusun rencana pembelajaran/pelatihan berstandar SKKNI Metodologi Pelatihan (N.78SPS02.019.2).",
        keyConcepts: [
          "Rumus Tujuan Pembelajaran ABCD: Audience (Peserta didik), Behavior (Kata kerja operasional terukur), Condition (Kondisi/alat bantu), Degree (Standar keberhasilan)",
          "Taksonomi Bloom Revisi (Anderson & Krathwohl): C1 Mengingat, C2 Memahami, C3 Menerapkan, C4 Menganalisis, C5 Mengevaluasi, C6 Mencipta",
          "Struktur Session Plan BNSP: Pendahuluan (Apersepsi & K3), Penyajian Inti (Penjelasan, Demonstrasi, Latihan), dan Penutup (Rangkuman & Evaluasi)",
          "Pemilihan Kata Kerja Operasional (KKO): Hindari kata abstrak seperti 'memahami' pada indikator ujian; gunakan kata terukur seperti 'menghitung', 'mengonfigurasi', atau 'mengklasifikasikan'",
        ],
        studyMaterial:
          "Dalam sertifikasi BNSP Metodologi Pelatihan (unit kompetensi `N.78SPS02.019.2` dan `P.854900.016.01`), seorang instruktur dinilai dari ketajaman merumuskan tujuan belajar yang dapat diukur serta keruntutan alokasi waktu antara teori dan praktik mandiri peserta.",
        baliCaseStudy:
          "Studi Kasus Bali: Penyusunan Modul Ajar Kurikulum Merdeka dan Session Plan pelatihan vokasi di LPK serta SMK Pusat Keunggulan di Bali.",
        practiceTask:
          "Susun 1 kalimat Tujuan Pembelajaran lengkap menggunakan komponen A-B-C-D untuk topik pilihan Anda!",
        scoreBoost: 6,
        referenceResources: [
          {
            title: "Google for Education Teacher Center & Certifications",
            provider: "Google for Education",
            url: "https://edu.google.com/for-educators/certification-programs/",
          },
        ],
      },
      {
        id: "mod-edu-4",
        courseId: "edu-pedagogi",
        courseName: "Desain Kurikulum & Metodologi Pelatihan (EDU204)",
        moduleCode: "GCE-LVL1-04",
        semesterStage: "Semester 2 / Google Certified Educator",
        title: "Modul 4: Integrasi Teknologi Pembelajaran Digital (TPACK) & Micro-Teaching Interaktif",
        duration: "50 Menit",
        level: "Menengah",
        summary: "Menggabungkan penguasaan materi, pedagogi, dan perangkat kolaborasi digital sesuai kurikulum Google Certified Educator.",
        keyConcepts: [
          "Kerangka Kerja TPACK: Technological, Pedagogical, and Content Knowledge",
          "Model Blended Learning & Flipped Classroom (siswa mempelajari video/ringkasan konsep di rumah, lalu berlatih pemecahan masalah di kelas)",
          "Keterampilan Dasar Mengajar (Micro-Teaching): Membuka pelajaran, variasi stimulus, bertanya dasar/lanjut, penguatan (reinforcement), dan menutup pelajaran",
          "Pemanfaatan Kuis Interaktif dan Kolaborasi Dokumen Real-Time untuk meningkatkan partisipasi seluruh siswa",
        ],
        studyMaterial:
          "Teknologi pendidikan bukan sekadar memindahkan buku cetak ke layar proyektor. Dalam kerangka TPACK dan Google Certified Educator, teknologi digunakan untuk memvisualisasikan konsep abstrak dan memberikan umpan balik instan kepada setiap siswa.",
        baliCaseStudy:
          "Studi Kasus Bali: Pengembangan media pembelajaran interaktif berbasis cerita rakyat dan kearifan lokal Bali oleh mahasiswa Undiksha Singaraja.",
        practiceTask:
          "Jelaskan bagaimana penerapan metode 'Flipped Classroom' dapat membantu siswa yang lambat memahami materi saat penjelasan lisan di kelas!",
        scoreBoost: 6,
      },
      {
        id: "mod-edu-5",
        courseId: "edu-karier",
        courseName: "Asesmen Pembelajaran & Bimbingan Karier (EDU209)",
        moduleCode: "N.78SPS02.075.1",
        semesterStage: "Semester 3 / Evaluasi Kompetensi",
        title: "Modul 5: Asesmen Formatif vs Sumatif, Rubrik Penilaian Autentik & Evaluasi Kompetensi",
        duration: "50 Menit",
        level: "Terapan",
        summary: "Merancang alat ukur kemajuan belajar yang adil, transparan, dan bebas bias subjektif.",
        keyConcepts: [
          "Tiga Pendekatan Asesmen: Assessment FOR Learning (Formatif perbaikan proses), Assessment AS Learning (Refleksi diri siswa), dan Assessment OF Learning (Sumatif akhir)",
          "Penyusunan Rubrik Analitik: Memuat kriteria penilaian dan deskripsi indikator skor (misal: Sangat Baik 4, Baik 3, Cukup 2, Perlu Bimbingan 1)",
          "Validitas (mengukur apa yang seharusnya diukur) dan Reliabilitas (kekonsistenan hasil ukur) instrumen tes",
          "Unit Kompetensi BNSP `N.78SPS02.075.1`: Menilai Kemajuan Kompetensi Peserta Pelatihan Secara Individu",
        ],
        studyMaterial:
          "Menilai karya proyek atau keterampilan praktik tidak boleh dilakukan hanya dengan perkiraan subjektif. Dengan menyusun Rubrik Penilaian yang dibagikan sejak awal tugas, siswa memahami standar kualitas yang harus dicapai dan tahu bagian mana yang harus ditingkatkan.",
        baliCaseStudy:
          "Studi Kasus Bali: Penerapan asesmen proyek kolaboratif lintas mata pelajaran (P5 / Kokurikuler) di sekolah-sekolah Provinsi Bali.",
        practiceTask:
          "Buat 2 kriteria penilaian beserta indikator nilai 'Sangat Baik' dan 'Perlu Bimbingan' untuk menilai tugas presentasi lisan siswa!",
        scoreBoost: 6,
      },
      {
        id: "mod-edu-6",
        courseId: "edu-karier",
        courseName: "Asesmen Pembelajaran & Bimbingan Karier (EDU209)",
        moduleCode: "BK-RIASEC-06",
        semesterStage: "Semester 4 / Konseling Karier RIASEC",
        title: "Modul 6: Pemetaan Minat Karier Objektif (Holland RIASEC) & Mediasi Aspirasi Keluarga",
        duration: "45 Menit",
        level: "Sertifikasi",
        summary: "Menjembatani aspirasi minat siswa dengan pertimbangan realistis keluarga secara harmonis.",
        keyConcepts: [
          "Enam Tipe Lingkungan Karier John Holland (RIASEC): Realistic, Investigative, Artistic, Social, Enterprising, Conventional",
          "Mediasi Aspirasi Siswa dan Harapan Orang Tua menggunakan data objektif (akreditasi, biaya, prospek kerja)",
          "Penyusunan Individualized Learning & Career Plan (Rencana Tindak Lanjut Individual)",
          "Pendampingan Transisi SMK/SMA menuju Perguruan Tinggi dan Dunia Industri (Link and Match)",
        ],
        studyMaterial:
          "Ketika terjadi perbedaan pendapat antara pilihan jurusan siswa dan keinginan orang tua, konselor berperan menghadirkan data transparan mengenai prospek kerja, biaya kuliah, dan jembatan kompetensi yang dapat ditempuh bersama.",
        baliCaseStudy:
          "Studi Kasus Bali: Konseling keluarga bagi siswa SMK di Bali yang ingin melanjutkan kuliah sambil bekerja paruh waktu di sektor kreatif.",
        practiceTask:
          "Susun 3 poin agenda diskusi antara siswa, orang tua, dan guru BK ketika memilih kampus di Bali.",
        scoreBoost: 6,
      },
    ],
    certificationDrills: [
      {
        id: "cert-edu-1",
        courseId: "edu-psikologi",
        certTrack: "Bimbingan Karier RIASEC & Konseling Empatik",
        certName: "Sertifikasi Kompetensi Pedagogik & Konseling",
        competencyCode: "P.85000.002.01",
        question: "Seorang siswa memperoleh nilai evaluasi awal yang rendah pada mata pelajaran prasyarat jurusan impiannya. Tindakan pedagogis manakah yang paling tepat dilakukan oleh pembimbing?",
        options: [
          "Menyuruh siswa segera menyerah dan melarangnya belajar bidang tersebut",
          "Melakukan asesmen diagnostik letak kesulitan konsep, lalu memberikan modul remedial bertahap (scaffolding) dan latihan terarah",
          "Memberikan soal ujian akhir yang jauh lebih sulit tanpa penjelasan materi",
          "Mengabaikan hasil evaluasi dan tidak memberikan umpan balik apa pun",
        ],
        correctIndex: 1,
        explanation:
          "Benar! Prinsip asesmen diagnostik dan scaffolding bertujuan menemukan celah pemahaman dasar siswa lalu membimbingnya secara bertahap hingga mencapai standar kompetensi.",
        scoreBoost: 6,
      },
      {
        id: "cert-edu-2",
        courseId: "edu-psikologi",
        certTrack: "Bimbingan Karier RIASEC & Konseling Empatik",
        certName: "Sertifikasi Fasilitator Bimbingan Karier",
        competencyCode: "BK.2026.05",
        question: "Dalam sesi konseling karier, sikap dasar manakah yang wajib dijaga oleh seorang konselor terhadap siswa?",
        options: [
          "Memaksakan jurusan favorit pribadi milik konselor kepada semua siswa",
          "Bersikap empatik, objektif berbasis data, menjaga asas kerahasiaan, dan memfasilitasi otonomi keputusan siswa",
          "Membocorkan rahasia pribadi siswa ke papan pengumuman sekolah",
          "Menilai kepribadian siswa secara mutlak hanya dari satu percakapan singkat",
        ],
        correctIndex: 1,
        explanation:
          "Benar! Konselor profesional bertindak sebagai fasilitator objektif yang menghormati privasi dan memberdayakan siswa dengan informasi terverifikasi.",
        scoreBoost: 6,
      },
      {
        id: "cert-edu-3",
        courseId: "edu-pedagogi",
        certTrack: "BNSP Metodologi Pelatihan & Pedagogik (N.78SPS02)",
        certName: "BNSP Metodologi Pelatihan (Merencanakan Penyajian Materi)",
        competencyCode: "N.78SPS02.019.2",
        question: "Dalam penyusunan Tujuan Pembelajaran berstandar rumus A-B-C-D (Audience, Behavior, Condition, Degree), manakah rumusan komponen 'Behavior' (Kata Kerja Operasional) yang paling terukur untuk diuji?",
        options: [
          "Peserta didik mampu mengonfigurasi tabel routing statis pada 2 router dengan tepat",
          "Peserta didik mengerti secara batin tentang jaringan",
          "Peserta didik menyukai suasana ruang laboratorium",
          "Peserta didik pernah mendengar istilah komputer",
        ],
        correctIndex: 0,
        explanation:
          "Tepat! Sesuai unit kompetensi N.78SPS02.019.2 dan Taksonomi Bloom, kata kerja operasional seperti 'mengonfigurasi', 'menghitung', atau 'menyusun' dapat diamati dan diukur secara objektif.",
        scoreBoost: 6,
      },
      {
        id: "cert-edu-4",
        courseId: "edu-karier",
        certTrack: "BNSP Metodologi Pelatihan & Pedagogik (N.78SPS02)",
        certName: "BNSP Metodologi Pelatihan (Menilai Kemajuan Kompetensi)",
        competencyCode: "N.78SPS02.075.1",
        question: "Apakah fungsi utama dari pelaksanaan Asesmen Formatif dan penggunaan Rubrik Analitik selama proses pembelajaran berlangsung?",
        options: [
          "Memantau perkembangan pemahaman siswa secara berkala dengan kriteria objektif guna memperbaiki strategi belajar sebelum ujian akhir",
          "Semata-mata untuk menghukum siswa tanpa memberikan umpan balik perbaikan",
          "Untuk mengurangi jam belajar siswa di kelas",
          "Untuk menyembunyikan kriteria penilaian agar siswa menebak-nebak sendiri",
        ],
        correctIndex: 0,
        explanation:
          "Benar! Asesmen formatif (assessment for learning) beserta rubrik transparan memandu pengajar dan peserta didik mengetahui bagian kompetensi mana yang sudah tercapai dan mana yang perlu penguatan.",
        scoreBoost: 6,
      },
      {
        id: "cert-edu-5",
        courseId: "edu-pedagogi",
        certTrack: "Google Certified Educator & EdTech",
        certName: "Google Certified Educator Level 1 (TPACK & Blended Learning)",
        competencyCode: "GCE-L1-3.2",
        question: "Seorang guru memberikan video ringkasan materi berdurasi 10 menit untuk dipelajari siswa di rumah, sehingga waktu tatap muka di kelas dapat difokuskan sepenuhnya untuk praktik pemecahan masalah dan diskusi kelompok. Model pembelajaran apakah yang diterapkan guru tersebut?",
        options: [
          "Ceramah Satu Arah Tanpa Tanya Jawab",
          "Flipped Classroom (Kelas Terbalik) dalam kerangka Blended Learning",
          "Ujian Tertulis Tanpa Materi",
          "Isolasi Mandiri Tanpa Kurikulum",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Flipped Classroom memaksimalkan waktu tatap muka di kelas untuk aktivitas kognitif tingkat tinggi (penerapan dan analisis) dengan bimbingan langsung dari guru.",
        scoreBoost: 6,
      },
      {
        id: "cert-edu-6",
        courseId: "edu-pedagogi",
        certTrack: "Google Certified Educator & EdTech",
        certName: "Kurikulum Merdeka (Pembelajaran Berdiferensiasi)",
        competencyCode: "EDU.DIF.04",
        question: "Ketika seorang pendidik mengizinkan siswa memilih bentuk luaran tugas akhir sesuai kekuatan mereka (misalnya berupa laporan tertulis, poster infografis, atau video demonstrasi) selama tetap memenuhi indikator tujuan pembelajaran yang sama, diferensiasi aspek apakah yang sedang diterapkan?",
        options: [
          "Diferensiasi Produk",
          "Penghapusan Kurikulum",
          "Pengurangan Standar Kompetensi",
          "Penyeragaman Mutlak",
        ],
        correctIndex: 0,
        explanation:
          "Benar! Diferensiasi Produk memberikan keleluasaan bentuk karya akhir kepada siswa dengan tetap mengacu pada rubrik capaian kompetensi inti yang setara.",
        scoreBoost: 6,
      },
    ],
  },

  // 7. SENI KARAWITAN, TARI & BUDAYA BALI
  budaya: {
    fieldId: "budaya",
    fieldName: "Seni Karawitan, Tari & Budaya Bali",
    group: "manusia",
    certificationBody: "BNSP / LSP Kebudayaan (SKKNI No. 145/2021) & ISI Denpasar",
    mainCertificationTitle: "Sertifikasi BNSP Penyaji Seni Pertunjukan, Pamong Cagar Budaya (SKKNI 145/2021) & Filologi Lontar",
    availableCertTracks: [
      "BNSP Penyaji Karawitan, Tari & Pedalangan",
      "SKKNI Pelestarian Cagar Budaya & Filologi Lontar",
      "BNSP Manajemen Panggung & Produksi Seni",
    ],
    targetCourses: [
      {
        id: "bud-karawitan",
        code: "SEN102",
        name: "Teori & Praktik Karawitan, Tari & Pedalangan Tradisi Bali",
        sks: 4,
        minScore: 78,
        coreCompetency: "Wiraga, Wirama, Wirasa, Laras Pelog/Slendro & Pakem Pedalangan",
        certificationAlignment: "BNSP Penyaji Karawitan, Tari & Pedalangan",
        description: "Penguasaan teknik dasar gerak tari, pakem tabuh gamelan Bali, pedalangan wayang kulit, serta penghayatan estetika seni pertunjukan.",
      },
      {
        id: "bud-lontar",
        code: "SEN205",
        name: "Filologi Lontar, Aksara Bali & Pelestarian Cagar Budaya (SKKNI 145/2021)",
        sks: 3,
        minScore: 76,
        coreCompetency: "Konservasi Lontar, Pasang Aksara Unicode & Pamong Cagar Budaya",
        certificationAlignment: "SKKNI Pelestarian Cagar Budaya & Filologi Lontar",
        description: "Pelestarian naskah kuno Bali, tata tulis aksara sesuai uger-uger, registrasi objek cagar budaya, serta pengarsipan digital.",
      },
      {
        id: "bud-manajemen",
        code: "SEN301",
        name: "Manajemen Produksi Pertunjukan, Kurasi Panggung & HKI Komunal",
        sks: 3,
        minScore: 76,
        coreCompetency: "Stage Management, Tata Artistik Cahaya/Akustik & Kekayaan Intelektual Komunal",
        certificationAlignment: "BNSP Manajemen Panggung & Produksi Seni",
        description: "Pengelolaan festival budaya, pementasan seni berstandar internasional, dan perlindungan hukum karya tradisi-kreasi.",
      },
    ],
    remedialActionPlan: [
      {
        stepNumber: "01",
        phase: "Minggu 1 - 2: Penguatan Pakem Dasar & Filosofi Seni",
        title: "Pendalaman Struktur Wiraga, Wirama, Wirasa & Laras Gamelan",
        action: "Pelajari Modul 1 dan Modul 2 mengenai klasifikasi seni Bali (Wali, Bebali, Balih-balihan), struktur gending gamelan, dan agem tari.",
        targetOutcome: "Memperbaiki nilai teori dan pemahaman filosofi dasar seni budaya Bali.",
      },
      {
        stepNumber: "02",
        phase: "Minggu 3 - 4: Dokumentasi Lontar & Pelestarian Cagar Budaya",
        title: "Menggabungkan Seni Tradisi dengan Konservasi Modern (SKKNI 145/2021)",
        action: "Selesaikan Modul 3 dan Modul 4 tentang Filologi Lontar, Pasang Aksara Bali, dan Pelestarian Cagar Budaya.",
        targetOutcome: "Siap menghadapi mata kuliah kajian budaya dan konservasi di perguruan tinggi.",
      },
      {
        stepNumber: "03",
        phase: "Minggu 5 - 6: Simulasi Uji Kompetensi BNSP Seni & Budaya",
        title: "Latihan Sertifikasi Penyaji, Konservator & Stage Manager",
        action: "Pelajari Modul 5 dan Modul 6 lalu kerjakan 6 latihan soal sertifikasi pada panel Agen Pembimbing.",
        targetOutcome: "Mencapai skor penguasaan minimal 80%.",
      },
      {
        stepNumber: "04",
        phase: "Minggu 7 - 8: Portofolio Rekaman Karya / Kajian Budaya",
        title: "Susun Dokumentasi Karya Seni atau Transliterasi Lontar",
        action: "Siapkan video dokumentasi latihan gerak/tabuh 3 menit atau kajian tertulis kesenian banjar setempat.",
        targetOutcome: "Siap mengikuti seleksi keterampilan ISI Denpasar, Unud, atau SMKN 3 Sukawati (KOKAR).",
      },
    ],
    mismatchBridgeAdvice:
      "Jurusan Seni dan Budaya tidak hanya menerima siswa yang sudah mahir menari atau menabuh sejak kecil. Terdapat jalur kajian budaya, manajemen produksi pertunjukan, dokumentasi lontar digital, dan kurasi museum/cagar budaya yang sangat membutuhkan keahlian manajerial dan riset.",
    learningModules: [
      {
        id: "mod-bud-1",
        courseId: "bud-karawitan",
        courseName: "Teori & Praktik Karawitan / Tari Bali (SEN102)",
        moduleCode: "R.90000.001",
        semesterStage: "Semester 1 / Estetika Seni Bali",
        title: "Modul 1: Taksonomi Seni Sakral-Profan (Wali, Bebali, Balih-balihan) & Tiga Unsur Estetika",
        duration: "45 Menit",
        level: "Dasar",
        summary: "Memahami klasifikasi fungsi seni pertunjukan Bali serta kesatuan teknik gerak, irama, dan penjiwaan.",
        keyConcepts: [
          "Tri Warga Seni Bali (Seminar Seni Sakral & Profan 1971): Seni Wali (sakral di Utama Mandala), Seni Bebali (pengiring upacara di Madya Mandala), dan Seni Balih-balihan (hiburan/apresiasi di Nista Mandala/publik)",
          "Tiga Pilar Tari Bali: Agem (sikap pokok dasar), Tandang (cara berpindah gerak), dan Tangkis (pengembangan ragam gerak)",
          "Kesatuan Wiraga (kebenaran postur raga), Wirama (ketepatan ketukan/angsel gamelan), dan Wirasa (penjiwaan ekspresi/taksu)",
          "Klasifikasi Karakter Tari Bali: Halus (Alus), Keras (Gagah/Kras), dan Bebancihan (perpaduan karakter putra-putri)",
        ],
        studyMaterial:
          "Memahami batas antara Seni Wali, Bebali, dan Balih-balihan adalah etika paling mendasar bagi akademisi dan seniman Bali. Seni Wali seperti Tari Rejang Dewa dan Sanghyang Dedari tidak boleh dipertunjukkan sembarangan untuk komersial murni, sedangkan Seni Balih-balihan seperti Tari Kebyar Duduk, Oleg Tamulilingan, atau Janger terbuka untuk panggung apresiasi publik.",
        baliCaseStudy:
          "Studi Kasus Bali: Standar kurasi pementasan pada Pesta Kesenian Bali (PKB) di Taman Budaya Art Centre Denpasar.",
        practiceTask:
          "Klasifikasikan masing-masing 2 contoh kesenian di daerah Anda ke dalam kelompok Seni Wali, Bebali, dan Balih-balihan.",
        scoreBoost: 6,
      },
      {
        id: "mod-bud-2",
        courseId: "bud-karawitan",
        courseName: "Teori & Praktik Karawitan / Tari Bali (SEN102)",
        moduleCode: "R.90KAR.002",
        semesterStage: "Semester 1 / Karawitan & Gamelan",
        title: "Modul 2: Sistem Laras Gamelan Bali (Pelog & Slendro), Kotekan & Struktur Gending",
        duration: "50 Menit",
        level: "Dasar",
        summary: "Mengenal struktur orkestrasi gamelan Bali, pembagian fungsi instrumen, dan teknik jalinan nada.",
        keyConcepts: [
          "Sistem Tangga Nada (Laras): Laras Pelog (5 nada Panca Tirtha pada Gong Kebyar atau 7 nada Saih Pitu pada Semar Pagulingan) dan Laras Slendro (Gender Wayang / Angklung)",
          "Teknik Kotekan (ubit-ubitan): Jalinan ritmis saling mengisi antara pukulan Polos (on-beat) dan Sangsih (off-beat) dalam tempo cepat",
          "Struktur Komposisi Tabuh (Tri Angga Gending): Kawitan (pembuka), Pangawak (bagian utama/batang tubuh gending), dan Pangecek/Pekaad (bagian penutup cepat)",
          "Fungsi Instrumen Gamelan: Pemangku Irama (Kendang, Cengceng), Pemangku Melodi (Ugal, Pemade, Kantilan, Reyong), dan Penegas Kalimat Lagu/Colotomic (Kempli, Kempur, Gong)",
        ],
        studyMaterial:
          "Keunikan karawitan Bali di mata dunia terletak pada dinamika Kebyar (perubahan tempo dan volume secara tiba-tiba) serta kerumitan sistem Kotekan. Dalam permainan Gangsa (Pemade dan Kantilan), penabuh Polos dan Sangsih harus berlatih bersama untuk menghasilkan satu jalinan melodi utuh yang rapat.",
        baliCaseStudy:
          "Studi Kasus Bali: Pelestarian barungan gamelan langka (seperti Gamelan Selonding, Gambang, dan Semar Pagulingan) oleh sekaa gong remaja dan mahasiswa ISI Denpasar.",
        practiceTask:
          "Jelaskan perbedaan peran antara instrumen Kendang, Gangsa Pemade, dan Gong Ageng di dalam satu barungan Gamelan Gong Kebyar!",
        scoreBoost: 6,
      },
      {
        id: "mod-bud-3",
        courseId: "bud-lontar",
        courseName: "Filologi Lontar & Pelestarian Cagar Budaya (SEN205)",
        moduleCode: "SEN-LON-03",
        semesterStage: "Semester 2 / Konservasi Lontar",
        title: "Modul 3: Konservasi Fisik Naskah Lontar, Uger-Uger Pasang Aksara & Digitalisasi Unicode",
        duration: "50 Menit",
        level: "Menengah",
        summary: "Teknik merawat warisan pustaka lontar dan mendigitalisasikannya sesuai standar Unicode Aksara Bali.",
        keyConcepts: [
          "Tahapan Konservasi Fisik Lontar: Pembersihan debu, pengolesan minyak serai/kemiri, dan penghitaman guratan aksara dengan jelaga kemiri bakar (pengirengan)",
          "Pengelompokan Aksara Bali: Aksara Wreastra (bahasa Bali lumrah), Aksara Swalalita (bahasa Kawi/Sanskerta), dan Aksara Modre (aksara suci/rerajahan)",
          "Transliterasi (alih aksara Bali ke huruf Latin) vs Transkripsi & Terjemahan makna teks",
          "Standar Digitalisasi Pustaka Lontar: Pemotretan makro beresolusi tinggi dan penyusunan metadata katalog (Judul, Kategori Usada/Wariga/Kakawin, Ukuran Lempir, Asal Griya/Puri)",
        ],
        studyMaterial:
          "Ribuan naskah lontar Bali menyimpan ilmu pengobatan tradisional (Usada), arsitektur (Asta Kosala Kosali), astronomi pertanian (Wariga), hingga sastra filsafat. Melalui filologi modern, mahasiswa mempelajari cara membersihkan lempir daun rontal (Borassus flabellifer) tanpa merusak seratnya serta menyusun arsip digitalnya.",
        baliCaseStudy:
          "Studi Kasus Bali: Program konservasi dan digitalisasi ribuan cakep lontar milik masyarakat oleh Penyuluh Bahasa Bali, Gedong Kirtya Singaraja, dan Museum Bali.",
        practiceTask:
          "Jelaskan perbedaan penggunaan Aksara Wreastra dan Aksara Swalalita dalam penulisan naskah tradisional Bali!",
        scoreBoost: 6,
        referenceResources: [
          {
            title: "Pedoman Warisan Budaya Takbenda & Cagar Budaya",
            provider: "Kementerian Kebudayaan RI",
            url: "https://warisanbudaya.kemdikbud.go.id/",
          },
        ],
      },
      {
        id: "mod-bud-4",
        courseId: "bud-lontar",
        courseName: "Filologi Lontar & Pelestarian Cagar Budaya (SEN205)",
        moduleCode: "SKKNI-145-2021",
        semesterStage: "Semester 2 / SKKNI Cagar Budaya",
        title: "Modul 4: Pelindungan, Registrasi & Zonasi Pelestarian Cagar Budaya (SKKNI No. 145 Tahun 2021)",
        duration: "50 Menit",
        level: "Menengah",
        summary: "Memahami prosedur hukum dan teknis pelestarian benda, bangunan, struktur, dan situs cagar budaya sesuai UU No. 11 Tahun 2010 dan SKKNI.",
        keyConcepts: [
          "Kriteria Cagar Budaya (UU No. 11 Tahun 2010): Berusia 50 tahun atau lebih, mewakili masa gaya paling singkat 50 tahun, dan memiliki arti khusus bagi sejarah, ilmu pengetahuan, serta kebudayaan",
          "Lima Kategori Objek Cagar Budaya: Benda, Bangunan, Struktur, Situs, dan Kawasan Cagar Budaya",
          "Sistem Zonasi Pelestarian Situs: Zona Inti (pelindungan mutlak), Zona Penyangga (buffer), Zona Pengembangan, dan Zona Penunjang",
          "Prinsip Pemugaran Cagar Budaya: Keaslian bahan, bentuk, tata letak, dan teknik pengerjaan (dilarang mengganti batu padas/ukiran kuno dengan semen modern sembarangan)",
        ],
        studyMaterial:
          "Berdasarkan SKKNI No. 145 Tahun 2021 Bidang Pelestarian Cagar Budaya, seorang Pamong Budaya atau Konservator wajib melakukan pendataan, penyelamatan, dan pengamanan objek budaya secara ilmiah. Saat memugar struktur pura kuno atau bangunan bersejarah, keaslian material dan teknik pengerjaan tradisional harus dipertahankan.",
        baliCaseStudy:
          "Studi Kasus Bali: Pelestarian kawasan cagar budaya Daerah Aliran Sungai (DAS) Pakerisan Gianyar (Tampaksiring & Gunung Kawi) yang diakui sebagai Warisan Dunia UNESCO.",
        practiceTask:
          "Sebutkan 4 sistem zonasi ruang yang wajib diterapkan dalam pengelolaan sebuah Kawasan Cagar Budaya!",
        scoreBoost: 6,
      },
      {
        id: "mod-bud-5",
        courseId: "bud-manajemen",
        courseName: "Manajemen Produksi Pertunjukan (SEN301)",
        moduleCode: "R.90000.012",
        semesterStage: "Semester 3 / Manajemen Pertunjukan",
        title: "Modul 5: Manajemen Panggung (Stage Management), Tata Cahaya & Tata Akustik Gamelan",
        duration: "45 Menit",
        level: "Terapan",
        summary: "Mengelola pementasan seni budaya secara profesional dari tahap pra-produksi hingga evaluasi panggung.",
        keyConcepts: [
          "Struktur Tim Produksi: Pimpinan Produksi (Produser), Direktur Artistik/Koreografer, Stage Manager, serta kru Lighting dan Sound Engineer",
          "Penyusunan Cue Sheet / Prompt Book: Naskah panduan detik demi detik kapan lampu menyala (Lighting Cue), musik dimulai (Sound Cue), dan penari masuk panggung",
          "Teknik Mikrofonisasi (Miking) Gamelan Akustik: Menyeimbangkan tangkapan frekuensi tinggi (Cengceng/Gangsa) dan frekuensi rendah (Gong Ageng/Kempur)",
          "Mitigasi Risiko & K3 Panggung Terbuka (Arus listrik tata lampu, kabel panggung, dan jalur evakuasi penonton)",
        ],
        studyMaterial:
          "Sebuah karya seni yang hebat membutuhkan manajemen panggung yang tertib. Stage Manager memegang komando penuh selama geladi bersih (general rehearsal) dan pementasan berlangsung, mengatur alur keluar-masuk penari di sayap panggung (wing), serta memberi aba-aba (Standby -> Go) kepada operator lampu dan suara.",
        baliCaseStudy:
          "Studi Kasus Bali: Manajemen pementasan kolaborasi gamelan kontemporer dan dramatari kolosal di Panggung Terbuka Ardha Candra Denpasar.",
        practiceTask:
          "Susun daftar periksa (checklist) persiapan teknis 60 menit sebelum pementasan tari tradisional dimulai di panggung terbuka.",
        scoreBoost: 6,
      },
      {
        id: "mod-bud-6",
        courseId: "bud-manajemen",
        courseName: "Manajemen Produksi Pertunjukan (SEN301)",
        moduleCode: "KIK-BUD-06",
        semesterStage: "Semester 4 / HKI Komunal & Diplomasi Budaya",
        title: "Modul 6: Kekayaan Intelektual Komunal (KIK), Kurasi Pameran & Diplomasi Budaya Internasional",
        duration: "45 Menit",
        level: "Sertifikasi",
        summary: "Melindungi ekspresi budaya tradisional Bali dari klaim pihak luar dan mengemasnya untuk diplomasi budaya dunia.",
        keyConcepts: [
          "Kekayaan Intelektual Komunal (KIK - PP No. 56 Tahun 2022): Ekspresi Budaya Tradisional (EBT), Pengetahuan Tradisional (PT), dan Indikasi Geografis yang dimiliki bersama oleh komunitas adat",
          "Perbedaan Hak Cipta Kreasi Baru (individu/koreografer) vs Hak Komunal Tradisi (milik masyarakat adat/daerah)",
          "Kurasi Seni & Penulisan Narasi Dwibahasa (Curatorial Text) agar filosofi karya dipahami audiens internasional",
          "Etika Kolaborasi Lintas Budaya & Pengelolaan Royalti/Lisensi Dokumentasi Digital",
        ],
        studyMaterial:
          "Banyak motif tenun tradisional, tarian sakral, maupun gending klasik merupakan Kekayaan Intelektual Komunal (KIK) yang wajib diinventarisasi ke pusat data nasional agar tidak dipatenkan secara sepihak oleh entitas komersial asing. Lulusan seni budaya berperan menjadi kurator dan diplomat budaya yang menjaga kehormatan tradisi Bali.",
        baliCaseStudy:
          "Studi Kasus Bali: Pencatatan Indikasi Geografis dan Kekayaan Intelektual Komunal untuk Kain Endek Bali, Garam Amed, dan Tari Tradisi di 9 kabupaten/kota.",
        practiceTask:
          "Jelaskan perbedaan antara kepemilikan Hak Cipta atas karya tari kreasi baru yang diciptakan tahun ini dengan kepemilikan Kekayaan Intelektual Komunal atas Tari Sanghyang warisan leluhur!",
        scoreBoost: 6,
      },
    ],
    certificationDrills: [
      {
        id: "cert-bud-1",
        courseId: "bud-karawitan",
        certTrack: "BNSP Penyaji Karawitan, Tari & Pedalangan",
        certName: "Sertifikasi Kompetensi Seni Pertunjukan Bali",
        competencyCode: "R.90000.001.01",
        question: "Berdasarkan pengelompokan fungsi seni pertunjukan Bali (Piagam Seminar Seni Sakral dan Profan 1971), kesenian yang dipentaskan khusus sebagai pelengkap upacara di halaman tengah pura (Madya Mandala) seperti Wayang Wong atau Topeng Sidakarya termasuk dalam kategori apa?",
        options: [
          "Seni Balih-balihan murni untuk tiket komersial",
          "Seni Bebali (seni pengiring upacara keagamaan)",
          "Seni Kontemporer Industrial",
          "Seni Instalasi Digital Tanpa Pakem",
        ],
        correctIndex: 1,
        explanation:
          "Benar! Seni Bebali adalah seni pertunjukan pengiring upacara adat/agama yang umumnya dipentaskan di Jaba Tengah (Madya Mandala), berada di antara Seni Wali (Utama Mandala) dan Balih-balihan (Jaba Sisi/publik).",
        scoreBoost: 6,
      },
      {
        id: "cert-bud-2",
        courseId: "bud-karawitan",
        certTrack: "BNSP Penyaji Karawitan, Tari & Pedalangan",
        certName: "BNSP Seniman Karawitan Bali (Teknik Tabuh & Kotekan)",
        competencyCode: "R.90KAR.004.01",
        question: "Dalam teknik permainan instrumen Gamelan Gong Kebyar, disebut apakah jalinan melodi ritmis cepat yang saling mengisi antara pukulan 'Polos' dan pukulan 'Sangsih'?",
        options: [
          "Kotekan (Ubit-ubitan)",
          "Monofon Tunggal Tanpa Irama",
          "Tuning Elektronik",
          "Resitasi Puisi Tanpa Alat Musik",
        ],
        correctIndex: 0,
        explanation:
          "Tepat! Kotekan adalah teknik interlocking khas gamelan Bali di mana permainan Polos (ketukan dasar) dan Sangsih (ketukan sela) berpadu membentuk satu melodi berkecepatan tinggi.",
        scoreBoost: 6,
      },
      {
        id: "cert-bud-3",
        courseId: "bud-lontar",
        certTrack: "SKKNI Pelestarian Cagar Budaya & Filologi Lontar",
        certName: "Sertifikasi Konservasi Pustaka Lontar",
        competencyCode: "SEN.LON.02",
        question: "Dalam perawatan fisik naskah lontar tradisional Bali, bahan alami apakah yang digunakan untuk memperjelas kembali guratan aksara yang mulai pudar sekaligus melindungi daun rontal dari jamur?",
        options: [
          "Cat semprot akrilik sintetis dan tiner besi",
          "Campuran jelaga kemiri bakar (bleng) dan minyak serai/minyak kemiri murni",
          "Air deterjen pakaian dan pemutih klorin",
          "Lem kayu putih yang dilapisi plastik laminating panas",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Jelaga kemiri (pengirengan) masuk ke dalam guratan pengrupak untuk menghitamkan aksara, sementara minyak serai menjaga kelembapan serat daun lontar dan mencegah serangan serangga/jamur.",
        scoreBoost: 6,
      },
      {
        id: "cert-bud-4",
        courseId: "bud-lontar",
        certTrack: "SKKNI Pelestarian Cagar Budaya & Filologi Lontar",
        certName: "BNSP Pelestarian Cagar Budaya (SKKNI No. 145 Tahun 2021)",
        competencyCode: "R.91CGB00.008.2",
        question: "Sesuai Undang-Undang No. 11 Tahun 2010 dan SKKNI Pelestarian Cagar Budaya, prinsip manakah yang wajib dipatuhi saat melakukan pemugaran bangunan pura kuno yang berstatus Cagar Budaya?",
        options: [
          "Merobohkan seluruh ukiran batu padas asli dan menggantinya dengan keramik pabrik modern",
          "Mempertahankan keaslian bahan, bentuk, tata letak, gaya arsitektur, dan teknik pengerjaan tradisional dengan perubahan seminimal mungkin",
          "Mengecat seluruh batu candi kuno dengan cat minyak warna-warni",
          "Menjual batu-batu kuno situs kepada kolektor pribadi",
        ],
        correctIndex: 1,
        explanation:
          "Benar! Pemugaran Cagar Budaya wajib menjaga otentisitas (keaslian bentuk, bahan, tata letak, dan pengerjaan) sesuai kaidah arkeologis dan SKKNI Pelestarian Cagar Budaya.",
        scoreBoost: 6,
      },
      {
        id: "cert-bud-5",
        courseId: "bud-manajemen",
        certTrack: "BNSP Manajemen Panggung & Produksi Seni",
        certName: "Sertifikasi Manajemen Pertunjukan Seni",
        competencyCode: "R.90000.012.01",
        question: "Siapakah sosok di dalam tim produksi pertunjukan yang memegang komando teknis di belakang panggung (backstage), mengatur keluar-masuk penari, serta memberi aba-aba (cue) lampu dan musik saat acara berlangsung?",
        options: [
          "Petugas penjualan tiket di gerbang depan",
          "Stage Manager (Manajer Panggung)",
          "Penonton tamu kehormatan",
          "Desainer poster promosi cetak",
        ],
        correctIndex: 1,
        explanation:
          "Benar! Stage Manager adalah pemimpin operasional di area panggung selama proses geladi bersih (general rehearsal) hingga pertunjukan selesai.",
        scoreBoost: 6,
      },
      {
        id: "cert-bud-6",
        courseId: "bud-manajemen",
        certTrack: "BNSP Manajemen Panggung & Produksi Seni",
        certName: "Pelindungan Kekayaan Intelektual Komunal (KIK Budaya)",
        competencyCode: "KIK.EBT.01",
        question: "Mengapa ekspresi budaya tradisional seperti motif tenun khas daerah, tarian sakral, dan pengetahuan pengobatan lontar Usada perlu dicatatkan sebagai Kekayaan Intelektual Komunal (KIK)?",
        options: [
          "Agar masyarakat adat setempat dilarang menggunakan budayanya sendiri",
          "Untuk memberikan pelindungan hukum defensif agar warisan budaya leluhur tidak diklaim atau dipatenkan secara sepihak oleh pihak luar/asing",
          "Untuk menghapus sejarah asal-usul kesenian tersebut",
          "Agar seluruh kesenian berubah menjadi milik satu perusahaan swasta",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Pencatatan KIK melindungi hak moral dan ekonomi komunitas adat sebagai pemilik sah warisan budaya tradisional dari penyalahgunaan atau klaim pihak luar.",
        scoreBoost: 6,
      },
    ],
  },

  // 8. PERTANIAN ORGANIK & AGROTEKNOLOGI SUBAK
  pertanian: {
    fieldId: "pertanian",
    fieldName: "Pertanian Organik & Agroteknologi Subak",
    group: "alam",
    certificationBody: "BNSP Pertanian Organik (SNI 6729), Smart Farming & Keamanan Pangan HACCP",
    mainCertificationTitle: "Sertifikasi BNSP Fasilitator Pertanian Organik (TAN.OT02), Smart Farming IoT & HACCP Pangan",
    availableCertTracks: [
      "BNSP Pertanian Organik SNI 6729 (TAN.OT02)",
      "Smart Farming IoT, Hidroponik & Subak (A.01HOR00)",
      "BNSP Pascapanen, IndoGAP & HACCP (C.10PKP00)",
    ],
    targetCourses: [
      {
        id: "agr-tanah",
        code: "AGR103",
        name: "Ilmu Tanah, Nutrisi Tanaman & Sistem Pertanian Organik SNI 6729",
        sks: 4,
        minScore: 76,
        coreCompetency: "Sejarah Lahan (TAN.OT02), Kompos Hayati, Zona Penyangga & PHT",
        certificationAlignment: "BNSP Pertanian Organik SNI 6729 (TAN.OT02)",
        description: "Analisis sifat fisik-kimia-biologi tanah, masa konversi lahan organik SNI 6729, pembuatan pupuk hayati, dan pengendalian hama terpadu.",
      },
      {
        id: "agr-subak",
        code: "AGR206",
        name: "Manajemen Irigasi Subak, Hidroponik Presisi & Smart Farming IoT",
        sks: 4,
        minScore: 78,
        coreCompetency: "Distribusi Air Tekuk, Sensor IoT (A.01HOR00.038.1) & Nutrisi AB Mix EC/PPM",
        certificationAlignment: "Smart Farming IoT, Hidroponik & Subak (A.01HOR00)",
        description: "Sinergi tata kelola air warisan dunia Subak Bali dengan otomasi irigasi tetes berbasis sensor dan budidaya hidroponik greenhouse.",
      },
      {
        id: "agr-rantai",
        code: "AGR211",
        name: "Pascapanen, Cold Chain & Jaminan Mutu Keamanan Pangan (HACCP)",
        sks: 3,
        minScore: 75,
        coreCompetency: "Pre-Cooling, Grading Mutu IndoGAP & Titik Kendali Kritis HACCP (C.10PKP00)",
        certificationAlignment: "BNSP Pascapanen, IndoGAP & HACCP (C.10PKP00)",
        description: "Penanganan hasil panen segar berstandar HACCP dan IndoGAP agar memenuhi syarat pemasok hotel bintang lima dan ekspor.",
      },
    ],
    remedialActionPlan: [
      {
        stepNumber: "01",
        phase: "Minggu 1 - 2: Penguatan Dasar Biologi Tanaman & Tanah Organik",
        title: "Memahami Siklus Unsur Hara, pH Tanah & Konversi Lahan SNI 6729",
        action: "Pelajari Modul 1 dan Modul 2 mengenai unsur hara makro (N, P, K), pH tanah ideal, masa konversi lahan organik, dan biopestisida PHT.",
        targetOutcome: "Menutup kekurangan nilai Biologi/Kimia dasar untuk mata kuliah Ilmu Tanah dan Agroekologi.",
      },
      {
        stepNumber: "02",
        phase: "Minggu 3 - 4: Integrasi Kearifan Subak, Hidroponik & Sensor IoT",
        title: "Pelajari Sistem Pembagian Air Tekuk, Nutrisi AB Mix & Otomasi",
        action: "Selesaikan Modul 3 dan Modul 4 untuk memahami cara kerja irigasi Subak, Smart Farming IoT, dan kontrol kepekatan nutrisi hidroponik.",
        targetOutcome: "Siap mengikuti kurikulum Agroteknologi di Unud, PNB Kampus Tabanan, atau SMKN 1 Petang.",
      },
      {
        stepNumber: "03",
        phase: "Minggu 5 - 6: Simulasi Sertifikasi BNSP Organik, Smart Farming & HACCP",
        title: "Latihan Unit Kompetensi TAN.OT02, A.01HOR00 & C.10PKP00",
        action: "Pelajari Modul 5 dan Modul 6 lalu kerjakan 6 soal latihan uji kompetensi BNSP pada panel simulasi di bawah.",
        targetOutcome: "Mencapai skor kelulusan simulasi minimal 80%.",
      },
      {
        stepNumber: "04",
        phase: "Minggu 7 - 8: Proyek Observasi Kebun / Lahan Pangan Lokal",
        title: "Dokumentasikan Pengamatan Kompos atau Tanaman Pekarangan",
        action: "Buat catatan pengamatan 2 minggu pertumbuhan tanaman sayur/herbal dengan pupuk organik cair sebagai portofolio nyata.",
        targetOutcome: "Skor kesiapan jurusan mencapai target optimal.",
      },
    ],
    mismatchBridgeAdvice:
      "Agroteknologi masa kini bukan sekadar mencangkul di sawah, melainkan memadukan bioteknologi, sensor IoT, manajemen bisnis rantai pasok hotel bintang lima, dan konservasi warisan budaya Subak. Siswa dari jurusan IPS maupun SMK Teknologi dapat masuk melalui jalur Agribisnis dan Smart Farming.",
    learningModules: [
      {
        id: "mod-agr-1",
        courseId: "agr-tanah",
        courseName: "Ilmu Tanah & Sistem Pertanian Organik (AGR103)",
        moduleCode: "TAN.OT02.001.01",
        semesterStage: "Semester 1 / SKKNI Pertanian Organik",
        title: "Modul 1: Kesuburan Tanah, Unsur Hara Makro-Mikro, dan Rasio C/N Kompos",
        duration: "45 Menit",
        level: "Dasar",
        summary: "Mengembalikan kesehatan biologis tanah sawah dan kebun tanpa ketergantungan pupuk kimia sintetis.",
        keyConcepts: [
          "Unsur Hara Makro Primer: Nitrogen (N) untuk pertumbuhan vegetatif daun, Fosfor (P) untuk perakaran/bunga, dan Kalium (K) untuk pengisian buah dan imunitas tanaman",
          "Rentang pH Tanah Ideal: 6.0 hingga 7.0 (netral); pemberian kapur pertanian (Dolomit) untuk menaikkan pH tanah yang terlalu masam (< 5.5)",
          "Fermentasi Kompos & Rasio C/N Matang (12:1 hingga 20:1) menggunakan dekomposer Trichoderma atau EM4/MOL",
          "Peran Cacing Tanah, Mikoriza, dan Bakteri Penambat Nitrogen (Rhizobium) dalam struktur remah tanah",
        ],
        studyMaterial:
          "Penggunaan pupuk kimia berlebih dalam jangka panjang membuat tanah menjadi keras (kompak) dan miskin mikroba pengurai. Pertanian organik memulihkan kapasitas tukar kation (KTK) dan struktur remah tanah menggunakan kompos matang, sehingga tanah mampu menyimpan air lebih lama saat musim kemarau.",
        baliCaseStudy:
          "Studi Kasus Bali: Pemulihan kesuburan lahan sawah terasering Jatiluwih Tabanan dan budidaya beras merah organik bernilai ekonomi tinggi.",
        practiceTask:
          "Jelaskan gejala yang tampak pada tanaman jika kekurangan unsur Nitrogen (N) dan solusi pemupukan organik yang tepat!",
        scoreBoost: 6,
        referenceResources: [
          {
            title: "FAO Organic Agriculture & Agroecology Knowledge Hub",
            provider: "Food and Agriculture Organization (FAO)",
            url: "https://www.fao.org/organicag/en/",
          },
        ],
      },
      {
        id: "mod-agr-2",
        courseId: "agr-tanah",
        courseName: "Ilmu Tanah & Sistem Pertanian Organik (AGR103)",
        moduleCode: "SNI-6729-2016",
        semesterStage: "Semester 1 / Standar SNI 6729",
        title: "Modul 2: Konversi Lahan Organik (SNI 6729), Zona Penyangga & Pengendalian Hama Terpadu (PHT)",
        duration: "50 Menit",
        level: "Menengah",
        summary: "Memenuhi persyaratan inspeksi dan sertifikasi kebun organik sesuai regulasi SNI 6729 dan SKKNI TAN.OT02.",
        keyConcepts: [
          "Masa Konversi Lahan (SNI 6729): Minimal 2 tahun sebelum tebar benih untuk tanaman semusim (padi/sayur) atau 3 tahun untuk tanaman tahunan (kopi/kakao)",
          "Zona Penyangga (Buffer Zone) & Filter Air (Kolam eceng gondok/azolla) untuk mencegah kontaminasi pestisida dari lahan tetangga",
          "Pengendalian Hama Terpadu (PHT): Tanaman Refugia (bunga kenikir/matahari pemikat musuh alami), perangkap likat kuning (Yellow Trap), dan biopestisida Azadirachtin (daun mimba)",
          "Pencatatan Buku Rekaman Kebun (Internal Control System / ICS) untuk audit lembaga sertifikasi organik",
        ],
        studyMaterial:
          "Dalam unit kompetensi `TAN.OT02.001.01` (Menganalisis Sejarah Lahan), lahan yang sebelumnya menggunakan pupuk dan pestisida sintetis tidak bisa langsung diklaim organik keesokan harinya. Lahan tersebut wajib menjalani masa konversi guna mengurai residu kimia serta memiliki pembatas fisik (Buffer Zone) yang jelas.",
        baliCaseStudy:
          "Studi Kasus Bali: Sertifikasi organik kelompok tani Kopi Arabika Kintamani Bangli dan Manggis Buleleng untuk pasar ekspor Eropa dan Jepang.",
        practiceTask:
          "Mengapa petani organik menanam bunga Refugia (seperti bunga pukul empat dan kenikir) di pematang sawah? Jelaskan fungsi ekologisnya!",
        scoreBoost: 6,
      },
      {
        id: "mod-agr-3",
        courseId: "agr-subak",
        courseName: "Manajemen Irigasi Subak & Smart Farming (AGR206)",
        moduleCode: "A.01HOR00.038.1",
        semesterStage: "Semester 2 / Hidrologi Subak & IoT",
        title: "Modul 3: Sistem Tekuk Air Subak & Otomasi Irigasi Tetes Berbasis Sensor IoT",
        duration: "50 Menit",
        level: "Menengah",
        summary: "Memadukan keadilan distribusi air tradisional Subak dengan pemeliharaan sistem Smart Farming (A.01HOR00.038.1).",
        keyConcepts: [
          "Struktur Jaringan Irigasi Subak: Empelan (bendung), Telabah Gede (saluran induk), dan Tembuku/Tekuk (bangunan bagi air proporsional)",
          "Pola Tanam Kerta Masa (tanam padi serempak) dan Tulak Sumur untuk memutus siklus hidup hama wereng dan tikus",
          "Arsitektur Smart Farming IoT: Sensor Kapasitif Soil Moisture + Sensor Suhu/Kelembapan Udara -> Mikrokontroler ESP32/LoRa -> Relay Solenoid Valve (Katup Irigasi Otomatis)",
          "Kalibrasi Ambang Batas Kelembapan Tanah agar pompa irigasi tetes menyala otomatis hanya saat tanah mulai kering",
        ],
        studyMaterial:
          "Sistem Subak menerapkan prinsip keadilan pembagian air menggunakan ukuran lebar celah 'tekuk' pada bangunan bagi (tembuku). Pada lahan hortikultura dataran tinggi yang airnya terbatas, penerapan unit kompetensi `A.01HOR00.038.1` (Memelihara Sistem Smart Farming) menghemat pemakaian air dan pupuk cair (fertigasi) hingga 50%.",
        baliCaseStudy:
          "Studi Kasus Bali: Penerapan irigasi tetes otomatis berbasis tenaga surya pada kebun stroberi, paprika, dan sayuran di Bedugul-Petang.",
        practiceTask:
          "Tuliskan logika kerja otomatis (Jika ... Maka ...) antara Sensor Kelembapan Tanah dan Katup Air (Solenoid Valve) pada sistem Smart Farming!",
        scoreBoost: 6,
      },
      {
        id: "mod-agr-4",
        courseId: "agr-subak",
        courseName: "Manajemen Irigasi Subak & Smart Farming (AGR206)",
        moduleCode: "HIDRO-MOD-04",
        semesterStage: "Semester 2 / Budidaya Hidroponik & Greenhouse",
        title: "Modul 4: Teknologi Hidroponik (NFT/DFT), Pengaturan Kepekatan Nutrisi (PPM/EC) & Iklim Greenhouse",
        duration: "50 Menit",
        level: "Terapan",
        summary: "Budidaya sayuran bernilai ekonomi tinggi tanpa tanah di dalam rumah kaca (Screenhouse/Greenhouse).",
        keyConcepts: [
          "Sistem Hidroponik: NFT (Nutrient Film Technique - aliran tipis bersirkulasi) vs DFT (Deep Flow Technique - genangan bersirkulasi yang aman saat listrik padam)",
          "Pengukuran Larutan Nutrisi AB Mix: TDS/PPM (Parts Per Million) atau EC (Electrical Conductivity) serta penjagaan pH air nutrisi pada rentang 5.5 - 6.5",
          "Alasan Pemisahan Pekatan Stok A (mengandung Kalsium/Ca) dan Stok B (mengandung Sulfat/Fosfat) agar tidak mengendap menjadi gipsum",
          "Pengendalian Iklim Mikro Greenhouse: Jaring Insect Net pencegah kutu kebul (whitefly) dan pengkabutan (mist/cooling pad)",
        ],
        studyMaterial:
          "Dalam budidaya hidroponik komersial, kegagalan penyerapan nutrisi (tip burn / daun menguning) sering terjadi karena pH air baku terlalu basa (> 7.5) atau karena petani mencampur pekatan A dan pekatan B secara langsung tanpa diencerkan air terlebih dahulu. Pantau nilai PPM/EC dan pH larutan setiap pagi.",
        baliCaseStudy:
          "Studi Kasus Bali: Pengembangan greenhouse hidroponik selada romain, kale, dan melon premium oleh wirausaha tani muda di Denpasar, Badung, dan Baturiti.",
        practiceTask:
          "Jelaskan mengapa cairan pekatan nutrisi Hidroponik Stok A dan Stok B tidak boleh dicampur langsung dalam keadaan pekat tanpa air!",
        scoreBoost: 6,
      },
      {
        id: "mod-agr-5",
        courseId: "agr-rantai",
        courseName: "Pascapanen & Jaminan Mutu Pangan (AGR211)",
        moduleCode: "INDOGAP-05",
        semesterStage: "Semester 3 / Pascapanen & Cold Chain",
        title: "Modul 5: Fisiologi Pascapanen, Rantai Dingin (Cold Chain) & Standar Mutu IndoGAP",
        duration: "45 Menit",
        level: "Terapan",
        summary: "Menekan susut bobot dan kerusakan hasil panen segar dari kebun hingga ke meja konsumen.",
        keyConcepts: [
          "Komoditas Klimakterik (terus matang setelah dipetik karena gas etilen, misal: pisang, mangga, tomat, pepaya) vs Non-Klimakterik (jeruk, stroberi, manggis, sayuran daun)",
          "Tahapan Pascapanen Standar: Panen pagi hari -> Pre-Cooling (menurunkan panas lapang) -> Sortasi & Grading (Kelas Super/A/B) -> Pengemasan berventilasi -> Penyimpanan dingin",
          "Larangan Mencampur Buah Penghasil Gas Etilen Tinggi (seperti pisang/alpukat matang) dengan sayuran daun hijau di ruang simpan yang sama",
          "Ketertelusuran Produk (Traceability QR Code): Mencatat tanggal panen, blok kebun, dan nama kelompok tani",
        ],
        studyMaterial:
          "Hingga 30% hasil panen hortikultura tropis rusak sebelum sampai ke konsumen akibat suhu penyimpanan yang panas dan benturan mekanis. Dengan melakukan pre-cooling segera setelah panen pagi dan menjaga rantai dingin (Cold Chain), kesegaran sayur dan buah lokal Bali dapat bertahan dua hingga tiga kali lebih lama.",
        baliCaseStudy:
          "Studi Kasus Bali: Rumah kemas (Packing House) manggis ekspor di Kabupaten Tabanan dan Buleleng serta pasokan sayur segar ke hotel di Nusa Dua.",
        practiceTask:
          "Apa yang akan terjadi jika sayuran hijau disimpan di dalam satu ruangan tertutup bersama buah pisang yang sedang matang? Jelaskan penyebab ilmiahnya!",
        scoreBoost: 6,
      },
      {
        id: "mod-agr-6",
        courseId: "agr-rantai",
        courseName: "Pascapanen & Jaminan Mutu Pangan (AGR211)",
        moduleCode: "C.10PKP00.028.2",
        semesterStage: "Semester 4 / Sertifikasi Keamanan Pangan HACCP",
        title: "Modul 6: Sistem Keamanan Pangan HACCP (Hazard Analysis Critical Control Point) Agroindustri",
        duration: "50 Menit",
        level: "Sertifikasi",
        summary: "Mengidentifikasi bahaya biologis, kimia, dan fisik pada rantai pengolahan pangan sesuai SKKNI Keamanan Pangan.",
        keyConcepts: [
          "Tiga Jenis Cemaran Bahaya Pangan (Food Hazards): Bahaya Biologis (bakteri Salmonella, E. coli, kapang Aflatoksin), Bahaya Kimia (residu pestisida, logam berat), dan Bahaya Fisik (kerikil, pecahan kaca, serpihan logam)",
          "Tujuh Prinsip HACCP (Codex Alimentarius & SKKNI `C.10PKP00.028.2`): Analisis bahaya, penentuan Titik Kendali Kritis (CCP), batas kritis, pemantauan, tindakan koreksi, verifikasi, dan dokumentasi",
          "Sanitation Standard Operating Procedures (SSOP) & Good Manufacturing Practices (GMP) di ruang pengolahan pangan",
          "Pengendalian Suhu Zona Bahaya Pangan (Temperature Danger Zone: 5 C - 60 C di mana bakteri berkembang biak sangat cepat)",
        ],
        studyMaterial:
          "Untuk memasok produk pertanian olahan (seperti kopi sangrai, cokelat bean-to-bar, keju artisanal, maupun salad siap saji) ke jaringan hotel internasional dan pasar ekspor, sertifikasi HACCP adalah syarat utama. Pengendali mutu menetapkan Critical Control Point (CCP) seperti suhu pasteurisasi atau pencucian klorin organik untuk menjamin pangan 100% aman dikonsumsi.",
        baliCaseStudy:
          "Studi Kasus Bali: Penerapan standar GMP dan HACCP pada unit pengolahan kacang mete Karangasem, cokelat Tabanan, dan dapur katering penerbangan di Tuban.",
        practiceTask:
          "Sebutkan masing-masing 1 contoh Bahaya Biologis, Bahaya Kimia, dan Bahaya Fisik yang harus dicegah pada proses pengemasan sayuran salad siap santap!",
        scoreBoost: 6,
      },
    ],
    certificationDrills: [
      {
        id: "cert-agr-1",
        courseId: "agr-tanah",
        certTrack: "BNSP Pertanian Organik SNI 6729 (TAN.OT02)",
        certName: "BNSP Fasilitator Pertanian Organik (SNI 6729)",
        competencyCode: "TAN.OT02.001.01",
        question: "Dalam standar sistem pertanian organik SNI 6729 dan unit kompetensi TAN.OT02.001.01, mengapa wajib dibuat 'Zona Penyangga' (Buffer Zone) berupa tanaman pembatas atau parit apabila lahan organik bersebelahan dengan lahan pertanian konvensional?",
        options: [
          "Agar cahaya matahari tidak bisa masuk ke lahan pertanian organik",
          "Untuk mencegah kontaminasi rembesan air irigasi dan tiupan angin pestisida kimia dari lahan konvensional di sebelahnya",
          "Untuk mengurangi luas panen petani tanpa alasan teknis",
          "Karena tanaman pembatas menggantikan kebutuhan air irigasi sepenuhnya",
        ],
        correctIndex: 1,
        explanation:
          "Benar! Buffer Zone (zona penyangga) wajib diterapkan pada unit kompetensi pertanian organik untuk melindungi tanaman dan tanah dari cemaran drift pestisida atau aliran air kimia tetangga.",
        scoreBoost: 6,
      },
      {
        id: "cert-agr-2",
        courseId: "agr-tanah",
        certTrack: "BNSP Pertanian Organik SNI 6729 (TAN.OT02)",
        certName: "BNSP Inspektor Pertanian Organik (Kemasaman Tanah & Kompos)",
        competencyCode: "TAN.OT02.004.01",
        question: "Hasil pengukuran pH tanah pada sebidang lahan kebun di dataran tinggi menunjukkan angka 4.5 (sangat masam), sehingga akar tanaman sulit menyerap unsur Fosfor dan Kalium. Tindakan perbaikan organik apakah yang paling tepat dilakukan?",
        options: [
          "Menyiramkan air aki asam sulfat ke atas lahan",
          "Memberikan kapur pertanian alami (Dolomit / CaMg(CO3)2) dan pupuk kompos matang hingga pH tanah mendekati netral (6.0 - 7.0)",
          "Membakar plastik di atas permukaan tanah",
          "Menutup tanah dengan lapisan aspal panas",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Kapur pertanian (Dolomit) yang diizinkan dalam budidaya organik berfungsi menetralkan kemasaman tanah sekaligus menyumbang unsur Kalsium (Ca) dan Magnesium (Mg).",
        scoreBoost: 6,
      },
      {
        id: "cert-agr-3",
        courseId: "agr-subak",
        certTrack: "Smart Farming IoT, Hidroponik & Subak (A.01HOR00)",
        certName: "BNSP Pengelola Irigasi & Agroteknologi",
        competencyCode: "AGR.SUB.02",
        question: "Pada sistem pertanian tradisional Subak di Bali, apakah fungsi utama bangunan bagi air 'Tembuku' dengan celah proporsional (tekuk)?",
        options: [
          "Menutup seluruh aliran air agar tidak ada sawah yang mendapatkan air",
          "Membagi debit air irigasi secara adil dan terukur ke setiap petak sawah sesuai luas lahan dan kesepakatan krama subak",
          "Mencampur limbah rumah tangga ke dalam saluran sawah",
          "Mengeringkan mata air hulu di kawasan danau",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Tembuku merupakan instrumen teknik hidrologi tradisional Bali yang membagi air secara proporsional, transparan, dan adil bagi seluruh anggota subak.",
        scoreBoost: 6,
      },
      {
        id: "cert-agr-4",
        courseId: "agr-subak",
        certTrack: "Smart Farming IoT, Hidroponik & Subak (A.01HOR00)",
        certName: "BNSP Pemeliharaan Sistem Smart Farming & Hidroponik",
        competencyCode: "A.01HOR00.038.1",
        question: "Dalam budidaya hidroponik dan sistem fertigasi pintar (Smart Farming), mengapa larutan pekatan nutrisi Stok A (mengandung Kalsium Nitrat) dan Stok B (mengandung Kalium/Magnesium Sulfat) dilarang dicampur langsung dalam kondisi pekat tanpa air?",
        options: [
          "Karena ion Kalsium (Ca2+) dan Sulfat (SO4 2-) dalam konsentrasi pekat akan bereaksi membentuk endapan padat Kalsium Sulfat (gipsum) yang menyumbat selang dripper dan tidak bisa diserap akar",
          "Karena warna air akan berubah menjadi pelangi",
          "Karena pompa air hanya mau bekerja jika memakai air laut",
          "Karena tanaman hidroponik tidak membutuhkan unsur Kalsium",
        ],
        correctIndex: 0,
        explanation:
          "Benar! Pekatan A dan B harus diencerkan secara terpisah di dalam tandon air baku (misal: masukkan A ke air lalu aduk rata, baru masukkan B) agar tidak terjadi reaksi pengendapan Kalsium Sulfat.",
        scoreBoost: 6,
      },
      {
        id: "cert-agr-5",
        courseId: "agr-rantai",
        certTrack: "BNSP Pascapanen, IndoGAP & HACCP (C.10PKP00)",
        certName: "Sertifikasi Penanganan Pascapanen Hortikultura",
        competencyCode: "A.011000.014.01",
        question: "Mengapa proses panen sayuran daun segar untuk pasokan hotel sebaiknya dilakukan pada pagi hari sebelum matahari terik diikuti dengan proses pre-cooling?",
        options: [
          "Agar laju respirasi dan penguapan air (transpirasi) tanaman rendah sehingga sayuran tetap renyah dan tidak cepat layu",
          "Karena pada pagi hari berat sayuran menjadi nol gram",
          "Supaya warna daun berubah menjadi cokelat kering",
          "Karena bakteri pembusuk hanya aktif pada suhu dingin",
        ],
        correctIndex: 0,
        explanation:
          "Benar! Panen pagi hari saat suhu lapangan sejuk menekan laju respirasi sel tanaman dan kehilangan air, sehingga umur simpan (shelf-life) sayuran meningkat signifikan.",
        scoreBoost: 6,
      },
      {
        id: "cert-agr-6",
        courseId: "agr-rantai",
        certTrack: "BNSP Pascapanen, IndoGAP & HACCP (C.10PKP00)",
        certName: "BNSP Keamanan Pangan Berbasis HACCP",
        competencyCode: "C.10PKP00.028.2",
        question: "Dalam sistem jaminan keamanan pangan HACCP (Hazard Analysis Critical Control Point), ditemukannya serpihan kawat staples atau pecahan kaca di dalam kemasan produk pangan olahan dikategorikan sebagai jenis bahaya apa?",
        options: [
          "Bahaya Fisik (Physical Hazard)",
          "Bahaya Biologis Virus",
          "Nutrisi Tambahan",
          "Bumbu Penyedap Alami",
        ],
        correctIndex: 0,
        explanation:
          "Tepat! Sesuai unit kompetensi C.10PKP00.028.2, benda asing tajam atau keras seperti kerikil, kaca, plastik keras, dan logam/staples merupakan Bahaya Fisik yang wajib dicegah di ruang pengemasan.",
        scoreBoost: 6,
      },
    ],
  },

  // 9. ILMU KELAUTAN, KONSERVASI PESISIR & ENERGI TERBARUKAN
  lingkungan: {
    fieldId: "lingkungan",
    fieldName: "Ilmu Kelautan & Pengelolaan Lingkungan",
    group: "alam",
    certificationBody: "BNSP Lingkungan (PPPA), Konservasi Karang (M.72KRG00) & Teknisi PLTS (D.35EBT15)",
    mainCertificationTitle: "Sertifikasi BNSP Pengendalian Pencemaran Air (PPPA), Penilai Terumbu Karang & Teknisi Energi Surya (PLTS)",
    availableCertTracks: [
      "BNSP Pengendalian Pencemaran Air (PPPA) & ISO 14001",
      "SKKNI Penilai Terumbu Karang (M.72KRG00) & Blue Carbon",
      "BNSP Teknisi PLTS Energi Terbarukan (D.35EBT15)",
    ],
    targetCourses: [
      {
        id: "env-pesisir",
        code: "ENV102",
        name: "Ekologi Pesisir, Penilaian Terumbu Karang (M.72KRG00) & Blue Carbon",
        sks: 4,
        minScore: 76,
        coreCompetency: "Transek Karang LIT/PIT, Transplantasi Karang & Karbon Biru Mangrove",
        certificationAlignment: "SKKNI Penilai Terumbu Karang (M.72KRG00) & Blue Carbon",
        description: "Kajian ekosistem pesisir pulau tropis, survei kesehatan terumbu karang berstandar SKKNI, serta konservasi hutan mangrove.",
      },
      {
        id: "env-sirkular",
        code: "ENV205",
        name: "Sistem Energi Terbarukan (PLTS Atap Bali Bersih) & Ekonomi Sirkular TPS3R",
        sks: 4,
        minScore: 78,
        coreCompetency: "Instalasi Fotovoltaik PLTS (D.35EBT15), Biokonversi BSF & Audit ISO 14001",
        certificationAlignment: "BNSP Teknisi PLTS Energi Terbarukan (D.35EBT15)",
        description: "Perancangan sistem Pembangkit Listrik Tenaga Surya (PLTS) Atap serta rekayasa pengelolaan sampah sirkular berbasis sumber.",
      },
      {
        id: "env-kualitas",
        code: "ENV209",
        name: "Analisis Kualitas Air, Operasional IPAL & Penyusunan AMDAL (Standar PPPA)",
        sks: 3,
        minScore: 76,
        coreCompetency: "Pengujian Parameter DO, BOD, COD, pH, TSS & Baku Mutu Limbah IPAL",
        certificationAlignment: "BNSP Pengendalian Pencemaran Air (PPPA) & ISO 14001",
        description: "Metode pengambilan sampel air sungai/laut, pengukuran DO, BOD, COD, pH, operasional IPAL, serta dokumen UKL-UPL/AMDAL.",
      },
    ],
    remedialActionPlan: [
      {
        stepNumber: "01",
        phase: "Minggu 1 - 2: Penguatan Dasar Ekologi Pesisir & Kimia Lingkungan",
        title: "Pahami Segitiga Ekosistem Laut, Survei Karang & Parameter Air",
        action: "Pelajari Modul 1 dan Modul 2 mengenai fungsi ekologis mangrove-lamun-karang, metode transek terumbu karang (M.72KRG00), serta parameter DO/BOD/COD.",
        targetOutcome: "Meningkatkan kesiapan dasar untuk mata kuliah Ekologi Pesisir dan Analisis Kualitas Air.",
      },
      {
        stepNumber: "02",
        phase: "Minggu 3 - 4: Penguasaan Sampah Sirkular TPS3R & Energi Surya (PLTS)",
        title: "Pelajari Operasional TPS3R, ISO 14001 & Komponen PLTS Fotovoltaik",
        action: "Selesaikan Modul 3, Modul 4, dan Modul 5 untuk memahami solusi teknis sampah dan transisi energi bersih Bali Net Zero Emission.",
        targetOutcome: "Memahami alur pemilahan sampah dari sumber dan perhitungan daya panel surya.",
      },
      {
        stepNumber: "03",
        phase: "Minggu 5 - 6: Simulasi Sertifikasi BNSP PPPA, Terumbu Karang & PLTS",
        title: "Latihan Uji Kompetensi E.370000, M.72KRG00 & D.35EBT15",
        action: "Pelajari Modul 6 lalu kerjakan 6 soal latihan sertifikasi BNSP bidang lingkungan hidup, kelautan, dan energi terbarukan.",
        targetOutcome: "Lulus simulasi sertifikasi dengan skor minimal 80%.",
      },
      {
        stepNumber: "04",
        phase: "Minggu 7 - 8: Proyek Audit Mini Sampah / Energi Lingkungan Sekitar",
        title: "Buat Laporan Observasi Pengelolaan Sampah atau Efisiensi Listrik",
        action: "Susun 1 lembar audit persentase sampah organik vs plastik atau perhitungan potensi penghematan listrik surya di sekolah.",
        targetOutcome: "Siap masuk Ilmu Kelautan/Teknik Lingkungan Unud, Warmadewa, atau SMK Kelautan & Energi Terbarukan.",
      },
    ],
    mismatchBridgeAdvice:
      "Bidang Kelautan, Lingkungan, dan Energi Terbarukan terbuka bagi siswa yang menyukai kegiatan lapangan, rekayasa teknik surya, maupun manajemen komunitas. Anda tidak harus menjadi penyelam profesional sejak awal karena penguasaan analisis data lingkungan, teknisi PLTS Atap, dan manajemen TPS3R sangat dibutuhkan di seluruh Bali.",
    learningModules: [
      {
        id: "mod-env-1",
        courseId: "env-pesisir",
        courseName: "Ekologi Pesisir & Penilaian Terumbu Karang (ENV102)",
        moduleCode: "M.72KRG00.001.1",
        semesterStage: "Semester 1 / Ekosistem Pesisir",
        title: "Modul 1: Tiga Pilar Ekosistem Pesisir (Mangrove, Lamun, Karang) & Karbon Biru",
        duration: "45 Menit",
        level: "Dasar",
        summary: "Memahami keterkaitan ekologis antara hutan bakau, padang lamun, dan terumbu karang dalam menjaga garis pantai Bali.",
        keyConcepts: [
          "Hutan Mangrove: Peredam gelombang pasang/abrasi, perangkap sedimen lumpur, dan penyimpan karbon biru (Blue Carbon) hingga 4x lebih besar per hektare dibanding hutan darat",
          "Padang Lamun (Seagrass): Tumbuhan berbunga laut yang menjadi area asuhan (nursery ground) ikan, penyu, dan dugong serta penyaring nutrien perairan dangkal",
          "Terumbu Karang: Simbiosis polip karang (hewan Cnidaria) dengan mikroalga Zooxanthellae yang menghasilkan oksigen dan warna karang",
          "Mekanisme Coral Bleaching (Pemutihan Karang): Stres suhu air laut yang meningkat memicu karang mengeluarkan Zooxanthellae sehingga kerangka kapurnya memutih",
        ],
        studyMaterial:
          "Ketiga ekosistem pesisir bekerja saling melindungi. Jika hutan mangrove di muara sungai rusak, sedimen lumpur dari daratan akan langsung terbawa ke laut dan menutupi polip terumbu karang sehingga karang mati karena tidak bisa berfotosintesis. Sebaliknya, terumbu karang yang sehat memecah hingga 90% energi ombak besar sebelum menghantam pantai.",
        baliCaseStudy:
          "Studi Kasus Bali: Konservasi kawasan mangrove Tahura Ngurah Rai (1.373 hektare) dan perlindungan ekosistem pesisir Nusa Penida.",
        practiceTask:
          "Jelaskan mengapa kenaikan suhu air laut sebesar 1-2 derajat Celsius dalam waktu lama dapat menyebabkan pemutihan karang (coral bleaching)!",
        scoreBoost: 6,
      },
      {
        id: "mod-env-2",
        courseId: "env-pesisir",
        courseName: "Ekologi Pesisir & Penilaian Terumbu Karang (ENV102)",
        moduleCode: "M.74PPK01.006.1",
        semesterStage: "Semester 1 / SKKNI Penilai Terumbu Karang",
        title: "Modul 2: Metode Survei Kesehatan Terumbu Karang (PIT/LIT/UPT) & Transplantasi Karang",
        duration: "50 Menit",
        level: "Menengah",
        summary: "Mengukur persentase tutupan karang hidup (Live Coral Cover) sesuai SKKNI Nomor 139 Tahun 2019 dan SKKNI Nomor 638 Tahun 2016.",
        keyConcepts: [
          "Metode Transek Garis: LIT (Line Intercept Transect) dan PIT (Point Intercept Transect) menggunakan pita roll meter sepanjang 50 meter sejajar garis pantai",
          "Metode UPT (Underwater Photo Transect): Pemotretan kuadran 58x44 cm di dasar laut yang dianalisis menggunakan perangkat lunak CPCe (Coral Point Count)",
          "Kategori Kesehatan Tutupan Karang Hidup: Buruk (0-24.9%), Sedang (25-49.9%), Baik (50-74.9%), dan Sangat Baik (75-100%)",
          "Teknik Rehabilitasi Karang: Fragmentasi karang bercabang (Acropora) pada media substrat kubah (reef dome/spider) dan teknologi Biorock berarus listrik tegangan rendah",
        ],
        studyMaterial:
          "Dalam unit kompetensi `M.72KRG00.001.1` dan `M.74PPK01.006.1` (Pengumpulan Data Struktur Komunitas di Terumbu Karang), seorang surveyor menghitung perbandingan antara tutupan karang hidup (Hard Coral / HC) terhadap karang mati (Dead Coral with Algae / DCA), pecahan karang (Rubble), dan pasir (Sand).",
        baliCaseStudy:
          "Studi Kasus Bali: Keberhasilan restorasi terumbu karang Biorock di Desa Pemuteran Buleleng dan transplantasi karang di Pantai Amed Karangasem serta Pantai Pandawa.",
        practiceTask:
          "Jika pada bentangan transek sepanjang 50 meter ditemukan total panjang tutupan karang batu hidup (Hard Coral) sepanjang 30 meter, berapakah persentase tutupan karang hidupnya dan termasuk kategori kondisi apa?",
        scoreBoost: 6,
        referenceResources: [
          {
            title: "Reef Check EcoDiver & Coral Reef Monitoring Protocols",
            provider: "Reef Check Foundation",
            url: "https://www.reefcheck.org/",
          },
        ],
      },
      {
        id: "mod-env-3",
        courseId: "env-sirkular",
        courseName: "Energi Terbarukan PLTS & Manajemen Sampah Sirkular (ENV205)",
        moduleCode: "E.381100.002",
        semesterStage: "Semester 2 / Ekonomi Sirkular & ISO 14001",
        title: "Modul 3: Pengelolaan Sampah Berbasis Sumber, Operasional TPS3R & Sistem ISO 14001",
        duration: "50 Menit",
        level: "Menengah",
        summary: "Mengubah timbulan sampah organik dan residu menjadi sumber daya bernilai guna sehingga menekan beban TPA.",
        keyConcepts: [
          "Komposisi Sampah Bali: Lebih dari 60% adalah sampah organik (sisa dapur dan sarana upakara/canang) yang mudah terurai",
          "Teba Modern & Biokonversi Maggot BSF (Black Soldier Fly / Hermetia illucens) yang mereduksi sampah organik hingga 70% menjadi pakan berprotein tinggi dan pupuk kasgot",
          "Alur TPS3R (Tempat Pengolahan Sampah Reduce-Reuse-Recycle): Pemilahan di rumah tangga -> Pengomposan/BSF -> Bank Sampah Daur Ulang -> Residu minimal (< 10%)",
          "Siklus Manajemen Lingkungan ISO 14001: Plan (Identifikasi Aspek & Dampak Lingkungan), Do (Pengendalian Operasional), Check (Audit Internal), Act (Tinjauan Manajemen)",
        ],
        studyMaterial:
          "Kunci keberhasilan pengelolaan sampah sesuai Pergub Bali No. 47 Tahun 2019 bukanlah memperluas TPA akhir, melainkan menyelesaikan pemilahan sejak dari rumah tangga (berbasis sumber). Dengan memisahkan sampah organik dari anorganik dan residu sejak awal, lebih dari 60% masalah volume sampah selesai di tingkat desa.",
        baliCaseStudy:
          "Studi Kasus Bali: Operasional TPS3R desa adat di Denpasar, Badung, dan Gianyar yang mengolah sampah sarana upakara menjadi kompos organik dan pelet maggot.",
        practiceTask:
          "Rancang alur pemilahan 3 wadah sampah di lingkungan sekolah beserta tujuan pengolahan masing-masing kategori!",
        scoreBoost: 6,
      },
      {
        id: "mod-env-4",
        courseId: "env-sirkular",
        courseName: "Energi Terbarukan PLTS & Manajemen Sampah Sirkular (ENV205)",
        moduleCode: "D.35EBT15.002.1",
        semesterStage: "Semester 3 / SKKNI Teknisi PLTS EBT",
        title: "Modul 4: Sistem Pembangkit Listrik Tenaga Surya (PLTS Fotovoltaik On-Grid vs Off-Grid) & Kalkulasi Kapasitas",
        duration: "55 Menit",
        level: "Terapan",
        summary: "Merancang dan memelihara instalasi panel surya atap sesuai SKKNI Nomor 160/166 Tahun 2019 (D.35EBT15 & M.71EBT16).",
        keyConcepts: [
          "Komponen Utama PLTS: Modul Fotovoltaik (mengubah foton matahari menjadi arus DC), Solar Charge Controller (MPPT), Baterai Penyimpan (LiFePO4), dan Inverter (mengubah arus DC menjadi AC 220V)",
          "Tiga Konfigurasi PLTS: On-Grid (terhubung langsung ke jaringan PLN tanpa baterai), Off-Grid (mandiri dengan baterai untuk pulau/desa terpencil), dan Hybrid",
          "Peak Sun Hours (PSH) di Bali (rata-rata 4.5 - 5.0 jam efektif/hari) & Sudut Kemiringan Panel (Tilt Angle 10-15 derajat menghadap Utara di belahan bumi selatan)",
          "Unit Kompetensi BNSP `M.71EBT16.010.1`: Melaksanakan Pemeriksaan, K3 Kelistrikan DC, dan Pengujian Sistem Monitoring PLTS",
        ],
        studyMaterial:
          "Untuk mewujudkan visi Bali Mandiri Energi Bersih (Bali Net Zero Emission), gedung pemerintah, hotel, dan sekolah kejuruan di Bali mulai menerapkan PLTS Atap. Seorang teknisi PLTS tersertifikasi BNSP wajib memahami perhitungan beban harian (Watt-hour/Wh), penyambungan panel secara Seri (menaikkan Tegangan Volt) vs Paralel (menaikkan Arus Ampere), serta prosedur proteksi petir (Surge Arrester DC/AC).",
        baliCaseStudy:
          "Studi Kasus Bali: Instalasi PLTS Atap pada gedung perkantoran, kampus, dan resort ramah lingkungan di Nusa Dua, Jimbaran, dan Nusa Penida.",
        practiceTask:
          "Jika sebuah sistem PLTS Atap memiliki kapasitas 2 kWp (2.000 Watt-peak) dan wilayah Bali memiliki lama penyinaran efektif (Peak Sun Hours) 4.5 jam per hari, berapa kWh energi listrik yang dihasilkan dalam 1 hari?",
        scoreBoost: 6,
      },
      {
        id: "mod-env-5",
        courseId: "env-kualitas",
        courseName: "Analisis Kualitas Air, IPAL & AMDAL (ENV209)",
        moduleCode: "E.370000.007.01",
        semesterStage: "Semester 3 / Sertifikasi BNSP PPPA",
        title: "Modul 5: Parameter Kualitas Perairan (DO, BOD, COD, TSS, pH) & Baku Mutu Air",
        duration: "45 Menit",
        level: "Terapan",
        summary: "Membaca indikator ilmiah kesehatan sungai dan perairan pesisir berdasarkan uji laboratorium dan SKKNI PPPA.",
        keyConcepts: [
          "DO (Dissolved Oxygen / Oksigen Terlarut): Semakin tinggi (di atas 5 mg/L), semakin sehat perairan bagi kehidupan biota air",
          "BOD (Biological Oxygen Demand): Jumlah oksigen yang dibutuhkan mikroba aerob untuk mengurai bahan organik; nilai BOD tinggi menandakan pencemaran limbah organik",
          "COD (Chemical Oxygen Demand): Jumlah oksigen yang dibutuhkan untuk mengoksidasi zat kimia di dalam air limbah",
          "TSS (Total Suspended Solids / Padatan Tersuspensi) dan TDS (Total Dissolved Solids / Padatan Terlarut)",
        ],
        studyMaterial:
          "Dalam sertifikasi BNSP Penanggung Jawab Pengendalian Pencemaran Air (PPPA - `E.370000.007.01`), hubungan antara DO dan BOD berbanding terbalik. Jika limbah cair organik dapur atau domestik dibuang langsung ke sungai tanpa diolah, nilai BOD akan melonjak tinggi karena bakteri menguras oksigen di dalam air, yang mengakibatkan kadar DO turun drastis.",
        baliCaseStudy:
          "Studi Kasus Bali: Pemantauan berkala kualitas air Daerah Aliran Sungai (DAS) Tukad Badung, Tukad Mati, dan Tukad Ayung sebagai sumber air baku masyarakat.",
        practiceTask:
          "Simpulkan kondisi sebuah sungai jika hasil uji laboratorium menunjukkan nilai DO = 1.6 mg/L dan nilai BOD = 85 mg/L (jauh melampaui baku mutu)!",
        scoreBoost: 6,
      },
      {
        id: "mod-env-6",
        courseId: "env-kualitas",
        courseName: "Analisis Kualitas Air, IPAL & AMDAL (ENV209)",
        moduleCode: "ENV-IPAL-06",
        semesterStage: "Semester 4 / Operasional IPAL & AMDAL",
        title: "Modul 6: Rekayasa Instalasi Pengolahan Air Limbah (IPAL Komunal/Hotel) & Dokumen AMDAL/UKL-UPL",
        duration: "50 Menit",
        level: "Sertifikasi",
        summary: "Menguasai tahapan pengolahan air limbah fisik, biologis, dan kimiawi serta instrumen pencegahan dampak lingkungan.",
        keyConcepts: [
          "Tiga Tahap Pengolahan IPAL: Primary Treatment (Penyaringan kasar/Bar Screen, Grease Trap penangkap lemak, Bak Ekualisasi), Secondary Treatment (Pengolahan Biologis Aerob/Anaerob dengan bakteri pengurai di Biofilter/Aerasi), dan Tertiary Treatment (Filtrasi pasir/karbon aktif, Klorinasi/UV, dan Kolam Indikator Ikan)",
          "Fungsi Grease Trap (Penangkap Lemak) wajib pada dapur restoran dan hotel agar minyak goreng bekas tidak menyumbat pipa dan mematikan bakteri IPAL",
          "Perbedaan Instrumen Lingkungan: AMDAL (untuk proyek berdampak penting skala besar), UKL-UPL (Upaya Pengelolaan & Pemantauan Lingkungan), dan SPPL",
          "Pemanfaatan kembali air olahan IPAL (Water Recycling) untuk penyiraman taman hotel guna menghemat air tanah",
        ],
        studyMaterial:
          "Setiap hotel, rumah sakit, dan industri pencelupan kain wajib mengoperasikan IPAL agar efluen air buangannya memenuhi Baku Mutu Air Limbah. Pada tahap pengolahan biologis (Secondary Treatment), blower aerasi menyuplai oksigen bagi bakteri pengurai (activated sludge / biofilter sarang tawon) untuk menurunkan kadar BOD dan COD secara alami.",
        baliCaseStudy:
          "Studi Kasus Bali: Operasional IPAL terpusat DSDP (Denpasar Sewerage Development Project) Suwung dan daur ulang air limbah untuk penyiraman taman di kawasan ITDC Nusa Dua.",
        practiceTask:
          "Jelaskan mengapa air limbah dari dapur restoran hotel wajib melewati bak 'Grease Trap' (penangkap lemak/minyak) terlebih dahulu sebelum masuk ke bak pengolahan biologis IPAL!",
        scoreBoost: 6,
      },
    ],
    certificationDrills: [
      {
        id: "cert-env-1",
        courseId: "env-kualitas",
        certTrack: "BNSP Pengendalian Pencemaran Air (PPPA) & ISO 14001",
        certName: "BNSP Penanggung Jawab Pengendalian Pencemaran Air (PPPA)",
        competencyCode: "E.370000.007.01",
        question: "Hasil pengujian sampel air sungai menunjukkan kadar Dissolved Oxygen (DO) turun drastis menjadi 1.5 mg/L sementara nilai Biological Oxygen Demand (BOD) meningkat tajam. Apakah kesimpulan ilmiah yang tepat dari data tersebut?",
        options: [
          "Air sungai sangat murni dan siap langsung diminum tanpa dimasak",
          "Perairan mengalami pencemaran bahan organik tinggi yang menguras oksigen terlarut sehingga membahayakan biota air",
          "Sungai tersebut tidak mengandung mikroorganisme sama sekali",
          "Suhu air sungai berada pada titik beku nol derajat",
        ],
        correctIndex: 1,
        explanation:
          "Benar! Nilai BOD yang tinggi menunjukkan banyaknya limbah organik yang sedang diurai oleh bakteri aerob, sehingga menghabiskan oksigen terlarut (DO) di dalam air.",
        scoreBoost: 6,
      },
      {
        id: "cert-env-2",
        courseId: "env-kualitas",
        certTrack: "BNSP Pengendalian Pencemaran Air (PPPA) & ISO 14001",
        certName: "BNSP Operasional Instalasi Pengolahan Air Limbah (POPAL)",
        competencyCode: "E.370000.013.01",
        question: "Pada sistem Instalasi Pengolahan Air Limbah (IPAL) restoran dan perhotelan, apakah fungsi utama dari unit 'Grease Trap' yang dipasang pada saluran awal limbah dapur?",
        options: [
          "Mencampur minyak goreng bekas dengan lumpur aktif",
          "Memisahkan dan menahan lemak serta minyak dapur agar tidak membeku di dalam pipa dan tidak menghambat kerja bakteri pengurai di bak biologis IPAL",
          "Menambahkan pewarna buatan ke dalam air limbah",
          "Mengubah air limbah langsung menjadi air minum kemasan",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Lemak dan minyak memiliki massa jenis lebih ringan dari air sehingga mengapung di Grease Trap; jika lolos ke bak aerasi biologis, lapisan minyak akan menghalangi transfer oksigen dan mematikan bakteri pengurai.",
        scoreBoost: 6,
      },
      {
        id: "cert-env-3",
        courseId: "env-sirkular",
        certTrack: "BNSP Pengendalian Pencemaran Air (PPPA) & ISO 14001",
        certName: "Sertifikasi Manajemen Sampah Sirkular (TPS3R)",
        competencyCode: "E.381100.002.01",
        question: "Mengapa pemilahan sampah organik (sisa makanan dan dedaunan/canang) wajib dilakukan langsung dari sumber rumah tangga sebelum diangkut ke fasilitas TPS3R?",
        options: [
          "Agar volume truk sampah terlihat lebih banyak di jalan raya",
          "Mencegah kontaminasi silang dengan sampah plastik/B3 sehingga bahan organik dapat langsung diolah menjadi kompos/pakan maggot BSF dan daur ulang anorganik tetap bersih",
          "Karena sampah organik tidak bisa terurai secara alami di bumi",
          "Untuk mencampur seluruh baterai bekas ke dalam pupuk tanaman",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Pemilahan dari sumber adalah prinsip utama pengelolaan sampah modern agar bahan organik tidak membusuk bersama plastik dan limbah B3.",
        scoreBoost: 6,
      },
      {
        id: "cert-env-4",
        courseId: "env-sirkular",
        certTrack: "BNSP Teknisi PLTS Energi Terbarukan (D.35EBT15)",
        certName: "BNSP Teknisi Pembangkit Listrik Tenaga Surya (SKKNI EBT)",
        competencyCode: "D.35EBT15.002.1",
        question: "Di dalam instalasi Pembangkit Listrik Tenaga Surya (PLTS), komponen manakah yang berfungsi mengubah arus listrik searah (DC) yang dihasilkan oleh modul panel surya menjadi arus listrik bolak-balik (AC 220V) agar dapat digunakan oleh peralatan elektronik gedung?",
        options: [
          "Solar Inverter",
          "Kabel Grounding Tembaga",
          "Penyangga Aluminium Atap",
          "Termometer Ruangan",
        ],
        correctIndex: 0,
        explanation:
          "Benar! Modul surya fotovoltaik menghasilkan listrik arus searah (Direct Current / DC), sedangkan Solar Inverter mengubahnya menjadi arus bolak-balik (Alternating Current / AC 220V/50Hz).",
        scoreBoost: 6,
      },
      {
        id: "cert-env-5",
        courseId: "env-pesisir",
        certTrack: "SKKNI Penilai Terumbu Karang (M.72KRG00) & Blue Carbon",
        certName: "Sertifikasi Konservasi Ekosistem Pesisir",
        competencyCode: "MAR.KON.04",
        question: "Manakah di bawah ini yang merupakan fungsi ekologis utama dari ekosistem hutan mangrove di kawasan pesisir Bali?",
        options: [
          "Mempercepat pengikisan tanah pantai oleh gelombang laut",
          "Menahan abrasi gelombang, menyaring sedimen lumpur dari darat, menjadi tempat pemijahan biota laut (nursery ground), serta menyerap karbon biru (Blue Carbon)",
          "Meningkatkan suhu permukaan air laut agar karang memutih",
          "Menghilangkan seluruh populasi kepiting dan ikan pesisir",
        ],
        correctIndex: 1,
        explanation:
          "Benar! Akar mangrove yang rapat meredam energi gelombang, menahan lumpur agar tidak merusak terumbu karang, dan menyimpan cadangan karbon dalam jumlah sangat besar.",
        scoreBoost: 6,
      },
      {
        id: "cert-env-6",
        courseId: "env-pesisir",
        certTrack: "SKKNI Penilai Terumbu Karang (M.72KRG00) & Blue Carbon",
        certName: "BNSP Penilai Kondisi Terumbu Karang (SKKNI No. 139/2019)",
        competencyCode: "M.74PPK01.006.1",
        question: "Seorang penyelam ilmiah melakukan survei Line Intercept Transect (LIT) sepanjang 50 meter di perairan Amed dan mencatat total panjang tutupan karang hidup (Live Hard Coral) sebesar 32.5 meter (65%). Berdasarkan kriteria baku kerusakan terumbu karang, termasuk dalam kategori apakah kondisi terumbu karang tersebut?",
        options: [
          "Rusak Berat / Buruk (0 - 24.9%)",
          "Baik (50 - 74.9%)",
          "Mati Total (0%)",
          "Zona Industri Darat",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Tutupan karang hidup 32.5 m dari 50 m adalah 65%, yang berada pada rentang kategori 'Baik' (50% - 74.9%).",
        scoreBoost: 6,
      },
    ],
  },

  // 10. BISNIS DIGITAL, E-COMMERCE & AKUNTANSI UMKM
  bisnis: {
    fieldId: "bisnis",
    fieldName: "Bisnis Digital & Manajemen E-Commerce",
    group: "usaha",
    certificationBody: "BNSP Digital Marketing (M.70MKT00), Teknisi Akuntansi Yunior (M.69PTA00) & Google Skillshop",
    mainCertificationTitle: "Sertifikasi BNSP Digital Marketing, Teknisi Akuntansi Yunior (SAK EMKM) & Google Analytics/Ads",
    availableCertTracks: [
      "BNSP Digital Marketing (M.70MKT00) & Google Ads",
      "BNSP Operasional E-Commerce & Ekspor (G.46RIT00)",
      "BNSP Teknisi Akuntansi Yunior (M.69PTA00 & SAK EMKM)",
    ],
    targetCourses: [
      {
        id: "bis-marketing",
        code: "BIS102",
        name: "Strategi Pemasaran Digital, SEO & Copywriting (Standar BNSP M.70MKT00 & Google)",
        sks: 4,
        minScore: 78,
        coreCompetency: "Riset Pasar (M.70MKT00.009.2), Konten Digital, SEO On-Page & Meta/Google Ads",
        certificationAlignment: "BNSP Digital Marketing (M.70MKT00) & Google Ads",
        description: "Perencanaan kampanye pemasaran digital lintas platform, riset kata kunci, serta penulisan pesan komersial yang persuasif.",
      },
      {
        id: "bis-ecommerce",
        code: "BIS204",
        name: "Manajemen Operasional E-Commerce, Ritel Digital & Ekspor UMKM",
        sks: 4,
        minScore: 78,
        coreCompetency: "Conversion Rate Optimization (CRO), Manajemen SKU & Dokumen Ekspor (FOB/CIF)",
        certificationAlignment: "BNSP Operasional E-Commerce & Ekspor (G.46RIT00)",
        description: "Pengelolaan katalog marketplace, analisis keranjang belanja, manajemen stok ritel modern, dan pengiriman ekspor kriya Bali.",
      },
      {
        id: "bis-analitik",
        code: "BIS208",
        name: "Akuntansi Keuangan UMKM (SAK EMKM), Perhitungan HPP/BEP & Analitik Bisnis",
        sks: 3,
        minScore: 76,
        coreCompetency: "Siklus Akuntansi (M.69PTA00), Laporan Laba Rugi/Neraca, HPP, BEP & ROAS",
        certificationAlignment: "BNSP Teknisi Akuntansi Yunior (M.69PTA00 & SAK EMKM)",
        description: "Pemrosesan entri jurnal, buku besar, penyusunan laporan keuangan UMKM, penentuan HPP, dan evaluasi ROAS iklan.",
      },
    ],
    remedialActionPlan: [
      {
        stepNumber: "01",
        phase: "Minggu 1 - 2: Penguatan Logika Keuangan Dasar & Akuntansi (HPP, BEP, Jurnal)",
        title: "Kuasai Perhitungan Modal, Titik Impas, dan Persamaan Dasar Akuntansi",
        action: "Pelajari Modul 5 dan Modul 6 mengenai rumus HPP, Break-Even Point (BEP), serta persamaan akuntansi (Aset = Liabilitas + Ekuitas).",
        targetOutcome: "Menutup kelemahan hitung ekonomi/akuntansi dasar untuk mata kuliah Keuangan dan Akuntansi UMKM.",
      },
      {
        stepNumber: "02",
        phase: "Minggu 3 - 4: Kerangka Kerja Marketing Funnel, SEO & E-Commerce",
        title: "Memahami Perjalanan Pembeli, Copywriting & Konversi Marketplace",
        action: "Selesaikan Modul 1, Modul 2, Modul 3, dan Modul 4 tentang Strategi Pemasaran Digital, SEO, CRO, dan Ekspor UMKM.",
        targetOutcome: "Mampu menyusun rencana promosi dan operasional toko daring secara terukur berbasis data.",
      },
      {
        stepNumber: "03",
        phase: "Minggu 5 - 6: Simulasi Sertifikasi BNSP Digital Marketing & Akuntansi Yunior",
        title: "Latihan Unit Kompetensi M.70MKT00, G.46RIT00 & M.69PTA00",
        action: "Kerjakan 6 latihan soal sertifikasi pemasaran digital, e-commerce, dan teknisi akuntansi yunior pada panel simulasi.",
        targetOutcome: "Mencapai skor kelulusan simulasi minimal 80%.",
      },
      {
        stepNumber: "04",
        phase: "Minggu 7 - 8: Proyek Audit / Rencana Bisnis UMKM Bali",
        title: "Susun 1 Halaman Business Model Canvas (BMC) & Proyeksi Laba Rugi",
        action: "Buat rencana bisnis digital untuk 1 produk kerajinan atau kuliner lokal Bali lengkap dengan target pasar dan perhitungan harga jual.",
        targetOutcome: "Kesiapan tinggi untuk FEB Unud, PNB, Undiknas, atau SMK Bisnis Daring/Akuntansi.",
      },
    ],
    mismatchBridgeAdvice:
      "Bisnis Digital membutuhkan perpaduan kreativitas komunikasi dan ketelitian membaca angka. Jika Anda berasal dari jurusan IPA atau SMK Teknik, keahlian logika Anda justru sangat unggul untuk bidang Analitik Data Pemasaran (Marketing Analytics), Akuntansi Komputer, dan optimasi SEO.",
    learningModules: [
      {
        id: "mod-bis-1",
        courseId: "bis-marketing",
        courseName: "Strategi Pemasaran Digital & Copywriting (BIS102)",
        moduleCode: "M.70MKT00.009.2",
        semesterStage: "Semester 1 / SKKNI Digital Marketing",
        title: "Modul 1: Riset Pasar, Segmentasi STP, Marketing Funnel (AIDA) & Copywriting",
        duration: "45 Menit",
        level: "Dasar",
        summary: "Mengubah pengunjung biasa menjadi pelanggan loyal melalui riset merek dan tahapan komunikasi yang tepat sasaran.",
        keyConcepts: [
          "Unit Kompetensi BNSP `M.70MKT00.009.2`: Merencanakan Riset Terhadap Sebuah Produk dan/atau Merek menggunakan analisis SWOT dan kompetitor",
          "STP (Segmenting, Targeting, Positioning): Menentukan siapa pembeli ideal (Buyer Persona) agar anggaran promosi tidak terbuang sia-sia",
          "Kerangka AIDA & PAS (Problem - Agitate - Solution) dalam penulisan naskah iklan (Copywriting)",
          "Unique Value Proposition (UVP): Alasan utama mengapa pelanggan memilih produk kita dibanding pesaing",
        ],
        studyMaterial:
          "Kesalahan pemasaran pemula adalah mencoba menjual produk kepada semua orang dengan pesan yang umum. Berdasarkan SKKNI Digital Marketing (`M.70MKT00.005.2` dan `M.70MKT00.014.1`), pemasar wajib memetakan segmen pasar terlebih dahulu, lalu menyiapkan konten digital yang menjawab masalah spesifik target pelanggan.",
        baliCaseStudy:
          "Studi Kasus Bali: Strategi penceritaan (storytelling) asal-usul tenun ikat Endek dan kerajinan perak Bali untuk menembus pasar pembeli mancanegara secara daring.",
        practiceTask:
          "Susun teks promosi singkat (4 kalimat) dengan pola AIDA untuk produk madu hutan asli Karangasem.",
        scoreBoost: 6,
        referenceResources: [
          {
            title: "Google Digital Garage & Skillshop Certifications",
            provider: "Google Skillshop",
            url: "https://skillshop.withgoogle.com/",
          },
        ],
      },
      {
        id: "mod-bis-2",
        courseId: "bis-marketing",
        courseName: "Strategi Pemasaran Digital & Copywriting (BIS102)",
        moduleCode: "M.70MKT00.012.1",
        semesterStage: "Semester 1 / SEO & Periklanan Digital",
        title: "Modul 2: Search Engine Optimization (SEO On-Page/Local SEO) & Kampanye Meta/Google Ads",
        duration: "50 Menit",
        level: "Menengah",
        summary: "Meningkatkan visibilitas organik bisnis di mesin pencari Google serta mengelola metrik iklan berbayar (CTR, CPC, CPA).",
        keyConcepts: [
          "Empat Jenis Search Intent: Informational (mencari cara/info), Navigational, Commercial Investigation (membandingkan merek), dan Transactional (siap membeli)",
          "SEO On-Page & Google Business Profile (Local SEO): Optimasi Title Tag, Meta Description, Heading H1-H3, Alt Text gambar, dan ulasan peta lokasi",
          "Metrik Utama Iklan Digital: Impressions (tayangan), Reach (jangkauan), CTR (Click-Through Rate = Klik / Tayangan x 100%), CPC (Cost Per Click), dan CPA (Cost Per Acquisition)",
          "Pengujian A/B Testing pada visual kreatif dan judul iklan untuk menekan biaya akuisisi pelanggan",
        ],
        studyMaterial:
          "Dalam unit kompetensi `M.70MKT00.012.1` (Menggunakan Media Sosial dan Aplikasi Daring), kesuksesan kampanye diukur menggunakan indikator kinerja utama (KPI). Jika sebuah iklan tayang 10.000 kali (Impressions) dan diklik oleh 250 orang, maka nilai CTR iklan tersebut adalah 2.5%. Semakin relevan iklan dengan audiens, semakin tinggi CTR dan semakin murah biaya per kliknya.",
        baliCaseStudy:
          "Studi Kasus Bali: Optimasi Local SEO (Google Maps & pencarian kata kunci bahasa Inggris) bagi usaha kuliner, spa, dan penyewaan tur lokal di Bali.",
        practiceTask:
          "Jika sebuah iklan digital ditayangkan sebanyak 20.000 kali (Impressions) dan menghasilkan 400 klik ke situs web, hitunglah berapa persen nilai CTR (Click-Through Rate) iklan tersebut!",
        scoreBoost: 6,
      },
      {
        id: "mod-bis-3",
        courseId: "bis-ecommerce",
        courseName: "Manajemen Operasional E-Commerce & Ekspor (BIS204)",
        moduleCode: "G.46RIT00.055.1",
        semesterStage: "Semester 2 / Operasional E-Commerce",
        title: "Modul 3: Optimasi Konversi Toko Daring (CRO), Manajemen Inventori SKU & Omnichannel",
        duration: "50 Menit",
        level: "Menengah",
        summary: "Meningkatkan rasio pembelian (Conversion Rate) pada halaman produk e-commerce dan menjaga akurasi stok gudang.",
        keyConcepts: [
          "Conversion Rate (CR): `(Jumlah Transaksi Lunas / Jumlah Pengunjung Halaman) x 100%`",
          "Elemen Halaman Produk Berkonversi Tinggi: Foto multi-sudut jelas, video demonstrasi, tabel ukuran akurat, ulasan terverifikasi, dan kecepatan respon chat",
          "Manajemen SKU (Stock Keeping Unit), Reorder Point (titik pemesanan kembali), dan Safety Stock agar tidak terjadi pembatalan pesanan",
          "Retensi Pelanggan (Repeat Order & Customer Lifetime Value / LTV) melalui program loyalitas dan CRM",
        ],
        studyMaterial:
          "Mendatangkan ribuan pengunjung ke toko online tidak akan menghasilkan laba apabila halaman produknya membingungkan atau lambat merespon. Sesuai unit kompetensi `G.46RIT00.055.1` (Melakukan Aktivitas Pemasaran Digital untuk Bisnis Ritel), menaikkan Conversion Rate dari 2% menjadi 4% akan menggandakan omzet toko tanpa menambah anggaran iklan.",
        baliCaseStudy:
          "Studi Kasus Bali: Standarisasi katalog digital omnichannel (Marketplace + Website + WhatsApp Commerce) bagi koperasi pengrajin di Gianyar dan Denpasar.",
        practiceTask:
          "Hitung nilai Conversion Rate jika sebuah toko online dikunjungi 2.000 orang dalam sebulan dan menghasilkan 80 transaksi lunas!",
        scoreBoost: 6,
      },
      {
        id: "mod-bis-4",
        courseId: "bis-ecommerce",
        courseName: "Manajemen Operasional E-Commerce & Ekspor (BIS204)",
        moduleCode: "EXP-LOG-04",
        semesterStage: "Semester 3 / Rantai Pasok & Ekspor Kriya",
        title: "Modul 4: Prosedur Ekspor Produk UMKM Bali, Incoterms (FOB vs CIF) & Dokumentasi Kepabeanan",
        duration: "50 Menit",
        level: "Terapan",
        summary: "Membawa produk kerajinan, furnitur, dan pertanian Bali menembus pasar ekspor global secara legal dan aman.",
        keyConcepts: [
          "Empat Dokumen Utama Ekspor: Commercial Invoice, Packing List, Bill of Lading (B/L untuk kargo laut) atau Airway Bill (AWB untuk udara), dan Certificate of Origin (SKA)",
          "Incoterms 2020 Dasar: EXW (Ex Works - pembeli urus semua dari gudang penjual), FOB (Free On Board - penjual tanggung biaya sampai barang naik ke kapal di pelabuhan muat), dan CIF (Cost, Insurance, and Freight - penjual tanggung biaya kapal + asuransi sampai pelabuhan tujuan)",
          "Kode HS (Harmonized System Code) untuk klasifikasi tarif bea dan pajak komoditas perdagangan internasional",
          "Sertifikat Pendukung Ekspor: SVLK (Sistem Verifikasi Legalitas Kayu) untuk kerajinan/furnitur kayu dan Phytosanitary Certificate untuk komoditas pertanian",
        ],
        studyMaterial:
          "Bali merupakan salah satu eksportir produk ekonomi kreatif, perhiasan perak, busana resort, dan kerajinan kayu terbesar di Indonesia. Memahami perbedaan harga jual FOB (misalnya FOB Tanjung Perak/Benoa) dan CIF membantu wirausaha muda menghitung biaya pengiriman kontainer dan asuransi kargo tanpa mengalami kerugian.",
        baliCaseStudy:
          "Studi Kasus Bali: Pengiriman ekspor kerajinan bambu Bangli, furnitur kayu Gianyar, dan produk spa aromaterapi Denpasar ke pasar Eropa dan Australia.",
        practiceTask:
          "Jelaskan perbedaan tanggung jawab biaya antara skema pengiriman ekspor FOB (Free On Board) dan CIF (Cost, Insurance, and Freight)!",
        scoreBoost: 6,
      },
      {
        id: "mod-bis-5",
        courseId: "bis-analitik",
        courseName: "Akuntansi Keuangan UMKM & Analitik Bisnis (BIS208)",
        moduleCode: "FIN-ROAS-05",
        semesterStage: "Semester 3 / Unit Economics & ROAS",
        title: "Modul 5: Perhitungan Harga Pokok Penjualan (HPP), Break-Even Point (BEP) & Evaluasi ROAS",
        duration: "50 Menit",
        level: "Terapan",
        summary: "Memastikan bisnis benar-benar mencetak laba bersih yang sehat dan tidak merugi akibat salah hitung biaya.",
        keyConcepts: [
          "HPP (Harga Pokok Penjualan / Cost of Goods Sold): Total biaya bahan baku + tenaga kerja produksi langsung + kemasan per unit produk",
          "Biaya Tetap (Fixed Cost: sewa ruko, gaji bulanan tetap, langganan internet) vs Biaya Variabel (Variable Cost: bahan baku yang naik turun sesuai jumlah produksi)",
          "Rumus Titik Impas (BEP Unit) = `Total Biaya Tetap / (Harga Jual per Unit - Biaya Variabel per Unit)`",
          "ROAS (Return on Ad Spend) = `Pendapatan dari Iklan / Biaya Iklan yang Dikeluarkan`",
        ],
        studyMaterial:
          "Banyak usaha rintisan terlihat ramai pembeli namun akhirnya tutup karena pemiliknya lupa memasukkan biaya kemasan, penyusutan alat, dan potongan komisi admin marketplace (5-12%) ke dalam perhitungan harga jual. Pastikan setiap unit terjual menyisakan Margin Kontribusi positif untuk menutup biaya tetap.",
        baliCaseStudy:
          "Studi Kasus Bali: Simulasi perhitungan HPP dan titik impas (BEP) usaha kopi kemasan literan dan kuliner lokal milik wirausaha muda SMK di Denpasar.",
        practiceTask:
          "Jika biaya produksi 1 bungkus keripik adalah Rp12.000, harga jual Rp20.000, dan biaya sewa tempat Rp800.000/bulan, berapakah jumlah bungkus minimal yang harus terjual agar mencapai titik impas (BEP)?",
        scoreBoost: 6,
      },
      {
        id: "mod-bis-6",
        courseId: "bis-analitik",
        courseName: "Akuntansi Keuangan UMKM & Analitik Bisnis (BIS208)",
        moduleCode: "M.69PTA00.005.3",
        semesterStage: "Semester 4 / SKKNI Teknisi Akuntansi Yunior",
        title: "Modul 6: Siklus Akuntansi Dasar (Jurnal, Buku Besar, Laporan Keuangan SAK EMKM) & Spreadsheet Akuntansi",
        duration: "55 Menit",
        level: "Sertifikasi",
        summary: "Menyusun laporan keuangan entitas UMKM secara tertib sesuai SKKNI Teknisi Akuntansi Yunior (M.692000 / M.69PTA00).",
        keyConcepts: [
          "Persamaan Dasar Akuntansi: `Aset (Harta) = Liabilitas (Utang/Kewajiban) + Ekuitas (Modal)`",
          "Aturan Saldo Normal Debit vs Kredit: Aset & Beban bertambah di Debit; Liabilitas, Ekuitas, & Pendapatan bertambah di Kredit",
          "Alur Siklus Akuntansi (Unit `M.692000.007.02` s.d. `013.02`): Bukti Transaksi -> Jurnal Umum -> Posting Buku Besar (General Ledger) -> Neraca Saldo -> Laporan Keuangan",
          "Tiga Komponen Laporan Keuangan SAK EMKM (Entitas Mikro, Kecil, dan Menengah): Laporan Laba Rugi, Laporan Posisi Keuangan (Neraca), dan Catatan atas Laporan Keuangan (CaLK)",
        ],
        studyMaterial:
          "Dalam uji sertifikasi BNSP Teknisi Akuntansi Yunior (KKNI Level II SMK Akuntansi dan D3/S1 Bisnis), peserta diuji kemampuannya memisahkan uang pribadi pemilik dari kas usaha (konsep Business Entity), memproses entri jurnal secara berimbang (balance antara Debit dan Kredit), serta menyusun Laporan Laba Rugi dan Neraca menggunakan aplikasi spreadsheet atau komputer akuntansi.",
        baliCaseStudy:
          "Studi Kasus Bali: Pembukuan keuangan digital berstandar SAK EMKM pada koperasi simpan pinjam, BUMDes, dan UMKM binaan di Provinsi Bali agar layak memperoleh pembiayaan perbankan (bankable).",
        practiceTask:
          "Jika sebuah usaha menerima pembayaran tunai atas jasa desain sebesar Rp2.000.000, tuliskan akun apa yang dicatat di sisi Debit dan akun apa yang dicatat di sisi Kredit pada Jurnal Umum!",
        scoreBoost: 6,
      },
    ],
    certificationDrills: [
      {
        id: "cert-bis-1",
        courseId: "bis-analitik",
        certTrack: "BNSP Teknisi Akuntansi Yunior (M.69PTA00 & SAK EMKM)",
        certName: "BNSP Tenaga Pemasar Operasional (Keuangan Bisnis)",
        competencyCode: "M.702090.005.01",
        question: "Sebuah UMKM kerajinan Bali memiliki Biaya Tetap bulanan sebesar Rp3.000.000. Biaya variabel pembuatan per unit produk adalah Rp40.000, dan produk tersebut dijual dengan harga Rp70.000 per unit. Berapakah jumlah unit yang harus terjual dalam sebulan untuk mencapai titik impas (Break-Even Point / BEP)?",
        options: [
          "30 unit produk",
          "100 unit produk",
          "500 unit produk",
          "10 unit produk",
        ],
        correctIndex: 1,
        explanation:
          "Benar! Margin kontribusi per unit = Rp70.000 - Rp40.000 = Rp30.000. Maka BEP Unit = Rp3.000.000 / Rp30.000 = 100 unit.",
        scoreBoost: 6,
      },
      {
        id: "cert-bis-2",
        courseId: "bis-analitik",
        certTrack: "BNSP Teknisi Akuntansi Yunior (M.69PTA00 & SAK EMKM)",
        certName: "BNSP Teknisi Akuntansi Yunior (Memproses Entri Jurnal & Laporan Keuangan)",
        competencyCode: "M.692000.007.02",
        question: "Berdasarkan aturan mekanisme Debit dan Kredit dalam akuntansi dasar, ketika sebuah perusahaan membeli peralatan kantor secara TUNAI senilai Rp5.000.000, bagaimanakah pencatatan entri Jurnal Umum yang tepat?",
        options: [
          "Debit: Peralatan Kantor Rp5.000.000 | Kredit: Kas Rp5.000.000",
          "Debit: Utang Usaha Rp5.000.000 | Kredit: Beban Listrik Rp5.000.000",
          "Debit: Kas Rp5.000.000 | Kredit: Peralatan Kantor Rp5.000.000",
          "Tidak perlu dicatat karena dibayar tunai",
        ],
        correctIndex: 0,
        explanation:
          "Tepat! Sesuai unit kompetensi M.692000.007.02, akun Peralatan Kantor (Aset) bertambah di sisi Debit sebesar Rp5.000.000, sedangkan akun Kas (Aset) berkurang di sisi Kredit sebesar Rp5.000.000.",
        scoreBoost: 6,
      },
      {
        id: "cert-bis-3",
        courseId: "bis-marketing",
        certTrack: "BNSP Digital Marketing (M.70MKT00) & Google Ads",
        certName: "Sertifikasi E-Commerce & Google Analytics (ROAS)",
        competencyCode: "M.70MKT00.012.1",
        question: "Sebuah kampanye promosi digital menghabiskan anggaran iklan sebesar Rp500.000 dan berhasil menghasilkan total penjualan produk senilai Rp2.500.000. Berapakah rasio ROAS (Return on Ad Spend) dari kampanye tersebut?",
        options: [
          "0.2 kali (20%)",
          "5 kali (500%)",
          "25 kali (2500%)",
          "1 kali (100%)",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Rumus ROAS adalah Total Pendapatan Iklan dibagi Biaya Iklan (Rp2.500.000 / Rp500.000 = 5x atau 500%).",
        scoreBoost: 6,
      },
      {
        id: "cert-bis-4",
        courseId: "bis-marketing",
        certTrack: "BNSP Digital Marketing (M.70MKT00) & Google Ads",
        certName: "BNSP Digital Marketing (Konten Digital & Model AIDA)",
        competencyCode: "M.70MKT00.014.1",
        question: "Dalam strategi pemasaran menggunakan model AIDA (Attention, Interest, Desire, Action), apakah tujuan utama dari elemen 'Action' di bagian akhir halaman penawaran?",
        options: [
          "Membuat pembaca menutup halaman web tanpa melakukan apa-apa",
          "Mengarahkan calon pembeli untuk mengambil langkah konkret secara mudah, seperti menekan tombol 'Pesan Sekarang' atau 'Konsultasi via WhatsApp'",
          "Menyembunyikan harga produk agar pembeli bingung",
          "Menghapus seluruh foto produk dari katalog",
        ],
        correctIndex: 1,
        explanation:
          "Benar! Tahap Action (melalui Call-to-Action / CTA yang jelas) memandu calon pelanggan yang sudah tertarik agar segera melakukan transaksi tanpa hambatan.",
        scoreBoost: 6,
      },
      {
        id: "cert-bis-5",
        courseId: "bis-ecommerce",
        certTrack: "BNSP Operasional E-Commerce & Ekspor (G.46RIT00)",
        certName: "BNSP Pemasaran Digital Bisnis Ritel (Optimasi Konversi)",
        competencyCode: "G.46RIT00.055.1",
        question: "Halaman katalog sebuah toko e-commerce dikunjungi oleh 4.000 pengunjung unik dalam satu bulan dan berhasil mencatatkan 120 pesanan yang dibayar lunas. Berapakah nilai Conversion Rate (CR) toko tersebut?",
        options: [
          "3%",
          "30%",
          "0.03%",
          "120%",
        ],
        correctIndex: 0,
        explanation:
          "Benar! Rumus Conversion Rate (CR) = `(Jumlah Transaksi / Jumlah Pengunjung) x 100% = (120 / 4.000) x 100% = 3%`.",
        scoreBoost: 6,
      },
      {
        id: "cert-bis-6",
        courseId: "bis-ecommerce",
        certTrack: "BNSP Operasional E-Commerce & Ekspor (G.46RIT00)",
        certName: "Perdagangan Ekspor-Impor & Logistik (Incoterms 2020)",
        competencyCode: "EXP.INC.2020",
        question: "Dalam kontrak pengiriman ekspor kerajinan Bali ke luar negeri menggunakan ketentuan Incoterms 'CIF' (Cost, Insurance, and Freight), komponen biaya apa sajakah yang wajib ditanggung oleh pihak Eksportir (Penjual)?",
        options: [
          "Hanya biaya bungkus kardus di gudang pengrajin tanpa pengiriman",
          "Harga barang (Cost), premi asuransi perjalanan laut (Insurance), dan biaya tambang kapal (Freight) hingga barang tiba di pelabuhan tujuan pembeli",
          "Biaya gaji karyawan toko milik pembeli di luar negeri",
          "Tidak menanggung biaya apa pun",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Dalam skema CIF, eksportir mengurus dan membayar biaya barang, asuransi kargo, serta biaya pengangkutan kapal hingga pelabuhan tujuan yang disepakati.",
        scoreBoost: 6,
      },
    ],
  },

  // 11. MANAJEMEN PERHOTELAN, KULINER & EKOWISATA BERKELANJUTAN
  pariwisata: {
    fieldId: "pariwisata",
    fieldName: "Manajemen Perhotelan & Ekowisata Berkelanjutan",
    group: "usaha",
    certificationBody: "ASEAN MRA-TP (ACCSTP/CATC), BNSP Perhotelan (I.55HDR00) & GSTC",
    mainCertificationTitle: "Sertifikasi Perhotelan ASEAN MRA-TP (I.55HDR00), Culinary/F&B Hygiene & Pemandu Ekowisata",
    availableCertTracks: [
      "ASEAN MRA-TP Front Office & Housekeeping (I.55HDR00)",
      "BNSP Pemandu Ekowisata & GSTC Tri Hita Karana",
      "ASEAN MRA-TP F&B Service, Culinary & Service Recovery",
    ],
    targetCourses: [
      {
        id: "par-frontoffice",
        code: "PAR101",
        name: "Operasional Front Office, PMS & Tata Graha (Standar ASEAN MRA-TP I.55HDR00)",
        sks: 4,
        minScore: 78,
        coreCompetency: "Guest Cycle (I.55HDR00.001.2), Sistem Opera PMS, RevPAR/ADR & Kamar VCI",
        certificationAlignment: "ASEAN MRA-TP Front Office & Housekeeping (I.55HDR00)",
        description: "Penguasaan alur layanan tamu sejak reservasi hingga check-out serta prosedur penyiapan kamar berstandar hotel bintang lima.",
      },
      {
        id: "par-ekowisata",
        code: "PAR205",
        name: "Manajemen Desa Wisata, Pemandu Ekowisata & Standar GSTC",
        sks: 4,
        minScore: 78,
        coreCompetency: "Carrying Capacity, Community-Based Tourism (CBT) & Penyusunan Itinerary",
        certificationAlignment: "BNSP Pemandu Ekowisata & GSTC Tri Hita Karana",
        description: "Perancangan paket perjalanan wisata berbasis pelestarian budaya dan alam desa tanpa merusak tata nilai masyarakat setempat.",
      },
      {
        id: "par-komunikasi",
        code: "PAR209",
        name: "Manajemen F&B Service, Tata Boga Higienis & Penanganan Keluhan Tamu (MICE)",
        sks: 3,
        minScore: 76,
        coreCompetency: "Sequence of Service (I.55HDR00.038.2), Food Safety & Metode LEARN",
        certificationAlignment: "ASEAN MRA-TP F&B Service, Culinary & Service Recovery",
        description: "Keterampilan tata hidang restoran, sanitasi dapur perhotelan, manajemen konvensi MICE, dan pemecahan masalah keluhan tamu.",
      },
    ],
    remedialActionPlan: [
      {
        stepNumber: "01",
        phase: "Minggu 1 - 2: Penguatan Bahasa Inggris Terapan & Grooming",
        title: "Kuasai Ungkapan Standar Layanan Tamu & Etika Keramahtamahan",
        action: "Pelajari Modul 1 dan Modul 2 mengenai kosakata utama siklus tamu (Guest Cycle), perhitungan RevPAR hotel, dan prosedur Housekeeping.",
        targetOutcome: "Meningkatkan kepercayaan diri pada mata kuliah Operasional Perhotelan.",
      },
      {
        stepNumber: "02",
        phase: "Minggu 3 - 4: Pemahaman Desa Wisata GSTC, F&B Service & MICE",
        title: "Pelajari Prinsip Ekowisata, Tata Hidang & Penanganan Keluhan",
        action: "Selesaikan Modul 3, Modul 4, Modul 5, dan Modul 6 termasuk metode penanganan keluhan tamu (LEARN Method) dan sanitasi F&B.",
        targetOutcome: "Siap mengikuti kurikulum praktik di Poltekpar Bali, PNB, IPB Internasional, maupun SMK Perhotelan/Kuliner.",
      },
      {
        stepNumber: "03",
        phase: "Minggu 5 - 6: Simulasi Sertifikasi BNSP & ASEAN MRA-TP Hospitality",
        title: "Latihan Unit Kompetensi I.55HDR00 & D1.HOT.CL1",
        action: "Kerjakan 6 soal latihan sertifikasi perhotelan, F&B, dan ekowisata bersama Agen Pembimbing.",
        targetOutcome: "Mencapai skor kelulusan simulasi minimal 80%.",
      },
      {
        stepNumber: "04",
        phase: "Minggu 7 - 8: Rancangan Itinerary Ekowisata Berkelanjutan",
        title: "Susun Paket Tur Edukasi Budaya/Alam 1 Hari di Kabupaten Anda",
        action: "Buat rancangan jadwal perjalanan wisata desa yang melibatkan UMKM lokal dan aturan etika pura/lingkungan.",
        targetOutcome: "Skor kesiapan jurusan mencapai standar unggul.",
      },
    ],
    mismatchBridgeAdvice:
      "Pariwisata Bali modern bergerak menuju Quality & Sustainable Tourism. Jika Anda merasa kemampuan bahasa asing masih kurang lancar, mulailah dengan menguasai struktur kalimat layanan standar (standard phrases) dan fokus pada manajemen operasional acara (MICE), kuliner (Culinary Arts), atau pengelolaan desa wisata.",
    learningModules: [
      {
        id: "mod-par-1",
        courseId: "par-frontoffice",
        courseName: "Operasional Front Office & Housekeeping (PAR101)",
        moduleCode: "I.55HDR00.001.2",
        semesterStage: "Semester 1 / Standar ASEAN MRA-TP",
        title: "Modul 1: Empat Tahap Siklus Tamu (Guest Cycle), Reservasi PMS & Metrik Hotel (Occupancy, ADR, RevPAR)",
        duration: "50 Menit",
        level: "Dasar",
        summary: "Memahami alur pelayanan tamu kantor depan (Front Office) serta rumus kinerja pendapatan kamar hotel.",
        keyConcepts: [
          "Empat Tahap Guest Cycle: Pre-Arrival (Reservasi), Arrival (Check-in & Registrasi), Occupancy (Selama Menginap & Night Audit), dan Departure (Check-out & Settlement)",
          "Jenis Reservasi: Guaranteed Reservation (dijamin deposit/kartu kredit sehingga kamar ditahan meski tamu datang larut malam) vs Non-Guaranteed Reservation (batas waktu 6 PM release)",
          "Metrik Utama Pendapatan Hotel: Occupancy Rate (% tingkat hunian), ADR (Average Daily Rate), dan RevPAR (`Revenue Per Available Room = Occupancy Rate x ADR`)",
          "Standar Grooming & Keramahtamahan ASEAN (D1.HOT.CL1.01): Senyum tulus, kontak mata sopan, dan menyebut nama tamu minimal 3 kali selama interaksi",
        ],
        studyMaterial:
          "Berdasarkan SKKNI Hotel dan Restoran (`I.55HDR00.001.2` - Memproses Reservasi) yang diselaraskan dengan ASEAN Common Competency Standards for Tourism Professionals (ACCSTP), petugas Front Office wajib mencatat detail permintaan khusus tamu (Special Request) dan memverifikasi jaminan pembayaran saat check-in.",
        baliCaseStudy:
          "Studi Kasus Bali: Standar penyambutan tamu (welcome ritual) dan manajemen hunian kamar di resort kawasan Nusa Dua, Sanur, dan Ubud.",
        practiceTask:
          "Jika sebuah hotel di Sanur memiliki tingkat hunian (Occupancy) 80% dan rata-rata harga kamar terjual (ADR) Rp1.500.000, berapakah nilai RevPAR hotel tersebut?",
        scoreBoost: 6,
      },
      {
        id: "mod-par-2",
        courseId: "par-frontoffice",
        courseName: "Operasional Front Office & Housekeeping (PAR101)",
        moduleCode: "I.55HDR00.021.2",
        semesterStage: "Semester 1 / Operasional Tata Graha",
        title: "Modul 2: Prosedur Penyiapan Kamar (Make-Up Room), Status Kamar PMS & Chemical Housekeeping",
        duration: "50 Menit",
        level: "Menengah",
        summary: "Menguasai urutan standar pembersihan kamar tamu serta kode status kesiapan kamar di sistem perhotelan.",
        keyConcepts: [
          "Kode Status Kamar PMS: VD (Vacant Dirty), VC (Vacant Clean), VCI (Vacant Clean Inspected - siap jual ke tamu), OD (Occupied Dirty), OC (Occupied Clean), OOO (Out of Order), dan DND (Do Not Disturb)",
          "Prosedur Mengetuk Pintu Kamar Tamu: Ketuk 3 kali sambil menyebutkan identitas ('Housekeeping!'), tunggu 10 detik sebelum mengulangi; dilarang masuk jika terpasang tanda DND",
          "Urutan Make-Up Room: Buka tirai/ventilasi -> Stripping linen kotor -> Making bed (Triple Sheeting) -> Dusting searah jarum jam -> Pembersihan kamar mandi -> Vacuum lantai -> Pengecekan akhir",
          "Pencegahan Kontaminasi Silang (Color-Coded Microfiber Cloth): Warna lap berbeda untuk kaca, meja kamar, wastafel, dan kloset",
        ],
        studyMaterial:
          "Departemen Housekeeping adalah tulang punggung kebersihan dan kenyamanan hotel. Petugas resepsionis hanya boleh menyerahkan kunci kamar yang sudah diperiksa oleh Floor Supervisor dan berstatus Vacant Clean Inspected (VCI).",
        baliCaseStudy:
          "Studi Kasus Bali: Penerapan Green Housekeeping (penggantian kemasan plastik sekali pakai dengan dispenser ramah lingkungan dan pengelolaan linen hemat air) di hotel berbintang Bali.",
        practiceTask:
          "Jelaskan langkah-langkah yang benar saat seorang Room Attendant hendak memasuki kamar tamu untuk melakukan pembersihan rutin!",
        scoreBoost: 6,
      },
      {
        id: "mod-par-3",
        courseId: "par-ekowisata",
        courseName: "Manajemen Desa Wisata & Ekowisata (PAR205)",
        moduleCode: "GSTC-ECO-03",
        semesterStage: "Semester 2 / Ekowisata Berkelanjutan",
        title: "Modul 3: Ekowisata Berbasis Komunitas (CBT), Daya Dukung (Carrying Capacity) & Tri Hita Karana",
        duration: "45 Menit",
        level: "Menengah",
        summary: "Mengelola destinasi wisata yang memberikan manfaat ekonomi langsung bagi warga desa sekaligus menjaga kelestarian alam dan adat.",
        keyConcepts: [
          "Prinsip Tri Hita Karana dalam Pariwisata: Parahyangan (menghormati kesucian pura), Pawongan (memberdayakan warga lokal), dan Palemahan (menjaga kebersihan ekosistem)",
          "Carrying Capacity (Daya Dukung Wisata): Batas maksimal jumlah pengunjung agar lingkungan dan kenyamanan desa tidak rusak (mencegah overtourism)",
          "Community-Based Tourism (CBT): Warga desa menjadi pemilik dan pengelola utama homestay, pemandu lokal, dan kuliner",
          "Kriteria Global Sustainable Tourism Council (GSTC): Pengelolaan berkelanjutan, manfaat sosial-ekonomi lokal, pelestarian budaya, dan konservasi lingkungan",
        ],
        studyMaterial:
          "Pariwisata berkelanjutan (sustainable tourism) tidak diukur semata-mata dari banyaknya jumlah kepala wisatawan yang datang, melainkan dari kualitas belanja, lama tinggal (length of stay), dan dampak positifnya bagi pelestarian desa. Pengelola ekowisata wajib menetapkan kuota kunjungan harian pada spot alam sensitif.",
        baliCaseStudy:
          "Studi Kasus Bali: Tata kelola kebersihan, tata ruang adat, dan pemberdayaan ekonomi warga di Desa Wisata Penglipuran Bangli dan Desa Pemuteran Buleleng.",
        practiceTask:
          "Sebutkan 3 aturan etika (Do's and Don'ts) yang wajib disampaikan pemandu wisata kepada turis sebelum memasuki area desa adat di Bali.",
        scoreBoost: 6,
        referenceResources: [
          {
            title: "GSTC Sustainable Tourism Criteria for Hotels & Tour Operators",
            provider: "Global Sustainable Tourism Council",
            url: "https://www.gstcouncil.org/gstc-criteria/",
          },
        ],
      },
      {
        id: "mod-par-4",
        courseId: "par-ekowisata",
        courseName: "Manajemen Desa Wisata & Ekowisata (PAR205)",
        moduleCode: "PAR.GUI.04",
        semesterStage: "Semester 2 / Kepemanduan Ekowisata",
        title: "Modul 4: Teknik Kepemanduan Ekowisata (Interpretasi Storynomics), Perancangan Itinerary & Tour Costing",
        duration: "50 Menit",
        level: "Terapan",
        summary: "Menyusun jadwal perjalanan wisata yang logis, menghitung komponen biaya tur, dan membawakan narasi budaya yang memikat.",
        keyConcepts: [
          "Teknik Storynomics Tourism: Mengemas fakta sejarah, filosofi arsitektur, dan kearifan ekologis menjadi penceritaan yang menyentuh emosi wisatawan",
          "Penyusunan Itinerary (Jadwal Perjalanan): Mengatur keseimbangan waktu tempuh, durasi aktivitas, waktu istirahat/makan, dan rencana cadangan cuaca (Plan B)",
          "Komponen Perhitungan Biaya Tur (Tour Costing): Fixed Cost (Sewa bus/transportasi, honor pemandu wisata/Tour Guide) vs Variable Cost per peserta (Tiket masuk objek, makan siang, air minum)",
          "Manajemen Keselamatan Wisata Alam (Risk Assessment, P3K Lapangan, dan Briefing Keamanan Trekking/Snorkeling)",
        ],
        studyMaterial:
          "Seorang Pramuwisata (Tour Guide) dan Tour Planner tersertifikasi BNSP tidak hanya menghafal tahun sejarah, tetapi mampu menginterpretasikan makna di balik suatu tradisi serta memastikan ketepatan waktu dan keamanan rombongan selama perjalanan.",
        baliCaseStudy:
          "Studi Kasus Bali: Perancangan paket tur edukasi agro-ekowisata Subak Jatiluwih dan jejak warisan budaya DAS Pakerisan.",
        practiceTask:
          "Jika biaya sewa minibus + pemandu wisata adalah Rp1.200.000 (Fixed Cost) dan biaya makan siang + tiket masuk adalah Rp150.000 per orang (Variable Cost), hitunglah berapa biaya pokok per peserta jika rombongan terdiri dari 10 orang!",
        scoreBoost: 6,
      },
      {
        id: "mod-par-5",
        courseId: "par-komunikasi",
        courseName: "Manajemen F&B Service, Kuliner & Komunikasi (PAR209)",
        moduleCode: "I.55HDR00.038.2",
        semesterStage: "Semester 3 / Standar F&B & Kuliner",
        title: "Modul 5: Standar Tata Hidang Restoran (Sequence of Service), Table Set-Up & Higiene Dapur Kuliner",
        duration: "50 Menit",
        level: "Terapan",
        summary: "Menguasai pelayanan restoran berstandar internasional (I.55HDR00.038.2) dan pencegahan kontaminasi silang di dapur.",
        keyConcepts: [
          "Sequence of Service Restoran: Greeting & Seating -> Unfolding Napkin -> Pouring Ice Water -> Presenting Menu -> Taking Order (dengan Upselling & Repeat Order) -> Serving Food -> Crumbing Down -> Presenting Bill -> Farewell",
          "Empat Jenis Pelayanan Restoran: American Service (makanan sudah ditata di piring dari dapur/Plated), Russian/Silver Service, French Service (Gueridon/masak di samping meja), dan Buffet",
          "Pencegahan Kontaminasi Silang Dapur (Color-Coded Cutting Board / Talenan Berwarna): Merah (Daging Mentah), Biru (Ikan/Seafood), Kuning (Unggas/Ayam), Hijau (Sayur/Buah Segar), Putih (Produk Matang/Roti/Keju)",
          "Kewajiban Mencatat Alergi Makanan Tamu (Food Allergies: Kacang/Peanuts, Gluten, Seafood, Dairy) sebelum meneruskan pesanan ke dapur",
        ],
        studyMaterial:
          "Dalam unit kompetensi `I.55HDR00.038.2` (Menyajikan Makanan) dan `I.55HDR00.040.2` (Membersihkan Area dan Peralatan Dapur), pramusaji dan juru masak wajib menjaga sanitasi ketat serta menanyakan apakah tamu memiliki alergi makanan tertentu saat mencatat pesanan (taking order).",
        baliCaseStudy:
          "Studi Kasus Bali: Pengangkatan kuliner autentik Bali (seperti Bebek Betutu, Lawar, dan Jaje Bali) ke dalam penyajian Fine Dining berstandar higienis internasional di Ubud dan Seminyak.",
        practiceTask:
          "Sebutkan fungsi pembedaan warna talenan (Cutting Board) Merah, Biru, dan Hijau di dapur hotel berbintang!",
        scoreBoost: 6,
      },
      {
        id: "mod-par-6",
        courseId: "par-komunikasi",
        courseName: "Manajemen F&B Service, Kuliner & Komunikasi (PAR209)",
        moduleCode: "D1.HOT.CL1.01",
        semesterStage: "Semester 4 / Service Recovery & MICE",
        title: "Modul 6: Teknik Penanganan Keluhan Tamu (Metode LEARN) & Manajemen Konvensi MICE",
        duration: "45 Menit",
        level: "Sertifikasi",
        summary: "Mengubah situasi keluhan tamu menjadi kepuasan dan loyalitas melalui komunikasi empatik dan manajemen acara MICE.",
        keyConcepts: [
          "Metode LEARN: Listen (Dengarkan tanpa menyela), Empathize (Tunjukkan empati), Apologize (Sampaikan permohonan maaf tulus), React (Berikan solusi nyata segera), Notify (Catat di logbook dan tindak lanjuti)",
          "Industri MICE: Meetings, Incentives, Conventions, and Exhibitions sebagai penggerak wisata bisnis berkualitas tinggi di Bali",
          "Penataan Ruang Konferensi (Banquet & Meeting Room Layout): Theater Style, Classroom Style, U-Shape, Boardroom, dan Round Table Banquet",
          "Service Recovery: Memberikan solusi perbaikan terukur sesuai standar operasional prosedur (SOP)",
        ],
        studyMaterial:
          "Dalam industri hospitaliti, tamu yang menyampaikan keluhan sebenarnya sedang memberi kesempatan kepada hotel untuk memperbaiki layanan sebelum mereka menulis ulasan buruk di internet. Jangan pernah berdebat atau menyalahkan departemen lain di hadapan tamu. Dengarkan dengan saksama, minta maaf atas ketidaknyamanan yang terjadi, dan segera hadirkan solusi.",
        baliCaseStudy:
          "Studi Kasus Bali: Penanganan keluhan tamu dan koordinasi delegasi internasional pada acara konferensi MICE di kawasan BNDCC Nusa Dua dan Sanur.",
        practiceTask:
          "Tuliskan skrip tanggapan 4 kalimat menggunakan metode LEARN apabila seorang tamu melapor bahwa pesanan sarapannya belum datang setelah menunggu 30 menit.",
        scoreBoost: 6,
      },
    ],
    certificationDrills: [
      {
        id: "cert-par-1",
        courseId: "par-frontoffice",
        certTrack: "ASEAN MRA-TP Front Office & Housekeeping (I.55HDR00)",
        certName: "BNSP & ASEAN Standard Front Office Operations",
        competencyCode: "I.55HDR00.001.2",
        question: "Di dalam sistem Property Management System (PMS) perhotelan, kode status kamar manakah yang menandakan bahwa kamar telah selesai dibersihkan oleh room attendant, telah diperiksa oleh supervisor, dan siap diserahkan kepada tamu yang baru check-in?",
        options: [
          "OD (Occupied Dirty)",
          "OOO (Out of Order)",
          "VCI (Vacant Clean Inspected)",
          "DND (Do Not Disturb)",
        ],
        correctIndex: 2,
        explanation:
          "Benar! Status VCI (Vacant Clean Inspected) menjamin bahwa kamar kosong, sudah dibersihkan, dan telah melewati pengecekan akhir oleh Floor Supervisor sehingga layak dijual ke tamu.",
        scoreBoost: 6,
      },
      {
        id: "cert-par-2",
        courseId: "par-frontoffice",
        certTrack: "ASEAN MRA-TP Front Office & Housekeeping (I.55HDR00)",
        certName: "Manajemen Pendapatan Hotel (Occupancy, ADR & RevPAR)",
        competencyCode: "PAR.FO.008.2",
        question: "Sebuah resort di Nusa Dua memiliki tingkat hunian kamar (Occupancy Rate) sebesar 80% dengan harga rata-rata kamar terjual (Average Daily Rate / ADR) sebesar Rp2.000.000. Berapakah nilai RevPAR (Revenue Per Available Room) resort tersebut?",
        options: [
          "Rp1.600.000",
          "Rp200.000",
          "Rp2.800.000",
          "Rp80.000",
        ],
        correctIndex: 0,
        explanation:
          "Tepat! Rumus RevPAR = `Occupancy Rate x ADR = 80% x Rp2.000.000 = Rp1.600.000`.",
        scoreBoost: 6,
      },
      {
        id: "cert-par-3",
        courseId: "par-komunikasi",
        certTrack: "ASEAN MRA-TP F&B Service, Culinary & Service Recovery",
        certName: "BNSP Kepemanduan & Penanganan Keluhan Tamu",
        competencyCode: "D1.HOT.CL1.01",
        question: "Ketika seorang tamu hotel menyampaikan keluhan bahwa pendingin ruangan (AC) di kamarnya tidak dingin, langkah pertama apakah yang wajib dilakukan petugas sesuai prosedur penanganan keluhan (Metode LEARN)?",
        options: [
          "Menyela pembicaraan tamu dan menyalahkan bagian teknisi",
          "Mendengarkan keluhan tamu dengan penuh perhatian tanpa memotong pembicaraan (Listen), menunjukkan empati, dan menyampaikan permohonan maaf atas ketidaknyamanan tersebut",
          "Meminta tamu memperbaiki sendiri mesin AC di kamarnya",
          "Meninggalkan meja resepsionis tanpa memberikan jawaban",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Tahap Listen, Empathize, dan Apologize meredakan ketegangan emosi tamu sebelum petugas segera mengirimkan teknisi atau menawarkan perpindahan kamar (React).",
        scoreBoost: 6,
      },
      {
        id: "cert-par-4",
        courseId: "par-komunikasi",
        certTrack: "ASEAN MRA-TP F&B Service, Culinary & Service Recovery",
        certName: "ASEAN MRA-TP Food & Beverage Hygiene (Pencegahan Kontaminasi Silang)",
        competencyCode: "I.55HDR00.040.2",
        question: "Di dapur hotel berstandar keamanan pangan internasional, mengapa juru masak diwajibkan menggunakan talenan (cutting board) berwarna Merah khusus untuk daging mentah dan warna Hijau khusus untuk sayuran/buah segar?",
        options: [
          "Agar meja dapur terlihat warna-warni saat difoto",
          "Untuk mencegah kontaminasi silang (cross-contamination) bakteri patogen seperti Salmonella dan E. coli dari daging mentah ke sayuran segar siap santap",
          "Karena pisau dapur hanya tajam di atas talenan warna merah",
          "Agar sayuran berubah rasa menjadi daging",
        ],
        correctIndex: 1,
        explanation:
          "Benar! Pemisahan peralatan berdasarkan warna (Color-Coded Cutting Board) adalah prosedur wajib sanitasi dapur untuk mencegah perpindahan bakteri dari bahan mentah ke makanan siap saji.",
        scoreBoost: 6,
      },
      {
        id: "cert-par-5",
        courseId: "par-ekowisata",
        certTrack: "BNSP Pemandu Ekowisata & GSTC Tri Hita Karana",
        certName: "Sertifikasi Pengelolaan Ekowisata Berkelanjutan (GSTC)",
        competencyCode: "PAR.ECO.03",
        question: "Mengapa penetapan batas 'Daya Dukung Wisata' (Carrying Capacity) sangat penting diterapkan pada kawasan desa wisata dan situs alam di Bali?",
        options: [
          "Untuk mencegah kerusakan ekosistem alam, kemacetan ekstrem, serta menjaga kenyamanan warga lokal dan kesakralan budaya dari dampak overtourism",
          "Agar seluruh desa wisata ditutup permanen dari kunjungan siapa pun",
          "Untuk menghilangkan pendapatan UMKM kerajinan dan kuliner warga",
          "Karena wisatawan tidak diizinkan membeli produk lokal",
        ],
        correctIndex: 0,
        explanation:
          "Benar! Pengendalian Carrying Capacity memastikan keseimbangan antara manfaat ekonomi warga, kelestarian lingkungan (Palemahan), dan ketertiban sosial-budaya desa.",
        scoreBoost: 6,
      },
      {
        id: "cert-par-6",
        courseId: "par-ekowisata",
        certTrack: "BNSP Pemandu Ekowisata & GSTC Tri Hita Karana",
        certName: "BNSP Perencanaan Perjalanan Wisata (Tour Costing)",
        competencyCode: "N.79JPW00.015.2",
        question: "Seorang perancang paket ekowisata desa menyusun tur untuk 10 peserta. Biaya tetap (sewa minibus + honor pemandu wisata) adalah Rp1.000.000 untuk seluruh rombongan, sedangkan biaya variabel (makan siang lokal + tiket masuk + donasi konservasi) adalah Rp120.000 per peserta. Berapakah harga pokok tur per peserta?",
        options: [
          "Rp120.000 per peserta",
          "Rp220.000 per peserta",
          "Rp1.120.000 per peserta",
          "Rp50.000 per peserta",
        ],
        correctIndex: 1,
        explanation:
          "Tepat! Biaya tetap per peserta = `Rp1.000.000 / 10 orang = Rp100.000`. Ditambah biaya variabel per peserta `Rp120.000`, maka total harga pokok per peserta adalah `Rp220.000`.",
        scoreBoost: 6,
      },
    ],
  },
};

