import { LearningModule } from "./mentorCurriculum";

export interface MasterclassSection {
  chapterTitle: string;
  paragraphs: string[];
}

export interface PitfallComparison {
  mistake: string;
  expertSolution: string;
}

export interface AttachedModulePdf {
  id: string;
  title: string;
  filename: string;
  folderPath: string;
  fileUrl: string;
  certStandard: string;
  externalSourceUrl: string;
}

export interface ModuleMasterclassContent {
  deepDiveChapters: MasterclassSection[];
  technicalReferenceTitle: string;
  technicalReferenceCode: string;
  professionalWorkflowSteps: string[];
  pitfallComparisons: PitfallComparison[];
  attachedPdf: AttachedModulePdf;
}

interface CourseMasterclassTemplate {
  courseId: string;
  fieldId: string;
  theoryFoundation: string;
  architectureMechanism: string;
  technicalReferenceTitle: string;
  technicalReferenceCode: string;
  workflowSteps: string[];
  pitfalls: PitfallComparison[];
  pdf: AttachedModulePdf;
}

const COURSE_MASTERCLASS_TEMPLATES: Record<string, CourseMasterclassTemplate> = {
  // 01 - TKJ
  "tkj-mtcna": {
    courseId: "tkj-mtcna",
    fieldId: "tkj",
    theoryFoundation:
      "Pada arsitektur MikroTik RouterOS (kurikulum resmi MTCNA), setiap paket jaringan yang masuk ke interface fisik maupun logis akan melewati diagram alir Packet Flow yang ketat: dimulai dari Prerouting (Mangle & Destination NAT), keputusan Routing (apakah paket ditujukan bagi IP milik router sendiri melalui chain INPUT, atau sekadar melintasi router menuju jaringan lain melalui chain FORWARD), hingga Postrouting (Source NAT / Masquerade dan antrian Queue Tree/Simple Queue). Seorang Network Engineer wajib memahami urutan eksekusi ini karena kesalahan menempatkan rule pada chain yang salah akan membuat proteksi keamanan tidak pernah terpicu atau justru memutus trafik manajemen.",
    architectureMechanism:
      "Dalam pengelolaan kualitas layanan (Quality of Service / QoS), algoritma Hierarchical Token Bucket (HTB) dan Per Connection Queue (PCQ) bekerja dengan memisahkan aliran trafik berdasarkan tuple alamat IP dan port. Ketika parameter pcq-classifier=dst-address diterapkan pada arah Download dan pcq-classifier=src-address pada arah Upload, router secara otomatis membuat sub-queue dinamis bagi setiap perangkat aktif. Jaminan bandwidth minimum diatur melalui parameter Limit-At (Committed Information Rate / CIR), sedangkan batas plafon kecepatan maksimum diatur melalui Max-Limit (Maximum Information Rate / MIR).",
    technicalReferenceTitle:
      "REFERENSI CLI ROUTEROS, SUBNETTING VLSM & KEAMANAN FIREWALL (STANDAR MTCNA)",
    technicalReferenceCode: `# 1. Rumus Perhitungan Cepat Subnetting VLSM IPv4
Bit Host (n) = 32 - Prefix   |   Total IP = 2^n   |   Host Valid = 2^n - 2
/24 (255.255.255.0)   = 254 Host  |  /27 (255.255.255.224) = 30 Host
/25 (255.255.255.128) = 126 Host  |  /28 (255.255.255.240) = 14 Host
/26 (255.255.255.192) = 62 Host   |  /30 (255.255.255.252) = 2 Host (Link P2P)

# 2. Hardening Firewall Filter (Proteksi Router Chain INPUT & Isolasi VLAN Chain FORWARD)
/ip firewall filter
add chain=input connection-state=established,related action=accept comment="Allow Established/Related"
add chain=input connection-state=invalid action=drop comment="Drop Invalid Packets"
add chain=input in-interface-list=LAN src-address=192.168.10.0/27 action=accept comment="Allow Admin Subnet"
add chain=input action=drop comment="Default Drop All Other Input to Router"

add chain=forward connection-state=established,related action=accept
add chain=forward connection-state=invalid action=drop
add chain=forward src-address=192.168.30.0/24 dst-address=192.168.10.0/27 action=drop comment="Isolate Guest WiFi"

# 3. Konfigurasi NAT Masquerade & Pembagian Bandwidth Adil dengan PCQ
/ip firewall nat add chain=srcnat out-interface=ether1-isp action=masquerade
/queue type add name="PCQ-Down-5M" kind=pcq pcq-rate=5M pcq-classifier=dst-address
/queue type add name="PCQ-Up-2M" kind=pcq pcq-rate=2M pcq-classifier=src-address
/queue simple add name="Limit-Tamu" target=192.168.30.0/24 max-limit=50M/100M limit-at=20M/40M queue=PCQ-Up-2M/PCQ-Down-5M`,
    workflowSteps: [
      "Tahap 1 (Audit Kebutuhan & Tabel VLSM): Inventarisasi jumlah perangkat di setiap divisi, tambahkan cadangan pertumbuhan 25%, lalu urutkan dari segmen terbesar ke terkecil untuk menentukan blok prefix CIDR tanpa tumpang tindih (overlap).",
      "Tahap 2 (Konfigurasi Dasar & Hardening Akses): Nonaktifkan layanan tidak terpakai (Telnet, FTP, API, WWW port 80) melalui menu /ip service, ubah port SSH/Winbox, dan batasi atribut Allowed Address hanya dari subnet manajemen.",
      "Tahap 3 (Implementasi NAT, DHCP & DNS Cache): Bangun DHCP Server per interface/VLAN, aktifkan fitur Add ARP for Leases untuk mencegah penggunaan IP statis liar, dan konfigurasi stateful firewall filter.",
      "Tahap 4 (Rekayasa Trafik QoS & Failover): Terapkan antrian PCQ dengan pemisahan prioritas trafik interaktif (ICMP/DNS/VoIP pada Priority 1-2) dan unduhan massal (Priority 8), disertai dual-ISP failover menggunakan check-gateway=ping.",
      "Tahap 5 (Uji Beban & Verifikasi Paket): Lakukan pengujian menggunakan tool Ping, Traceroute, Torch, dan Packet Sniffer untuk memastikan tidak ada kebocoran akses antar-segmen dan latensi tetap di bawah 15 ms saat beban puncak.",
    ],
    pitfalls: [
      {
        mistake:
          "Menempatkan rule 'action=drop chain=input' di urutan paling atas sebelum mengizinkan koneksi 'established,related' dan IP administrator.",
        expertSolution:
          "Selalu letakkan rule 'accept established,related' dan 'accept src-address=subnet-admin' di baris teratas sebelum menutup dengan 'action=drop' di baris terakhir agar sesi Winbox/SSH tidak terputus.",
      },
      {
        mistake:
          "Menggunakan 'action=masquerade' tanpa mendefinisikan parameter 'out-interface=ether1-isp'.",
        expertSolution:
          "Wajib menetapkan 'out-interface' (atau 'out-interface-list=WAN') pada rule srcnat agar trafik internal antar-VLAN tidak ikut ter-NAT ke alamat IP router.",
      },
      {
        mistake:
          "Membuat Simple Queue per-IP secara manual untuk ratusan pengguna Wi-Fi publik.",
        expertSolution:
          "Gunakan satu antrian induk dengan tipe antrian PCQ (pcq-classifier=dst-address untuk Download dan src-address untuk Upload) agar router membagi bandwidth secara dinamis dan hemat CPU.",
      },
    ],
    pdf: {
      id: "pdf-tkj-03",
      title:
        "Buku Ajar & Praktikum: Keamanan Jaringan Firewall Filter/NAT, Manajemen Bandwidth PCQ, VPN WireGuard & Fiber Optik FTTH GPON",
      filename:
        "MODUL-TKJ-03-Keamanan-Jaringan-Firewall-QoS-FTTH-WireGuard-VPN.pdf",
      folderPath: "public/pustaka-modul/01-tkj/",
      fileUrl:
        "/pustaka-modul/01-tkj/MODUL-TKJ-03-Keamanan-Jaringan-Firewall-QoS-FTTH-WireGuard-VPN.pdf",
      certStandard: "MikroTik MTCNA/MTCTCE & BNSP Network Security",
      externalSourceUrl:
        "https://help.mikrotik.com/docs/spaces/ROS/pages/328059/RouterOS",
    },
  },

  "tkj-ccna": {
    courseId: "tkj-ccna",
    fieldId: "tkj",
    theoryFoundation:
      "Pada jaringan kampus dan enterprise berstandar Cisco CCNA (200-301), pemisahan broadcast domain pada Layer 2 dilakukan menggunakan Virtual LAN (IEEE 802.1Q). Setiap frame Ethernet yang melintasi tautan Trunk antar-switch disisipi header tag 4-byte yang memuat 12-bit VLAN ID. Untuk mencegah looping frame akibat topologi redundan yang dapat melumpuhkan jaringan melalui Broadcast Storm dan ketidakstabilan tabel MAC Address, protokol Rapid Spanning Tree Protocol (IEEE 802.1w / RSTP) memilih satu Root Bridge berdasarkan nilai Bridge ID (Priority + MAC Address) terendah.",
    architectureMechanism:
      "Pada Layer 3, protokol routing link-state OSPF (Open Shortest Path First) mempertukarkan Link-State Advertisement (LSA) untuk menyusun peta topologi lengkap (LSDB) yang identik di setiap router dalam satu Area. Algoritma Shortest Path First (Dijkstra) kemudian menghitung jalur bebas-loop terbaik berdasarkan akumulasi Cost terendah (Cost = Reference Bandwidth / Interface Bandwidth). Pada segmen jaringan multi-akses (Ethernet), OSPF memilih Designated Router (DR) dan Backup Designated Router (BDR) untuk meminimalkan jumlah pertukaran LSA dari O(n^2) menjadi O(n).",
    technicalReferenceTitle:
      "REFERENSI KONFIGURASI CISCO IOS: VLAN 802.1Q, RSTP & OSPF SINGLE-AREA (CCNA 200-301)",
    technicalReferenceCode: `! 1. Konfigurasi Switch Layer 2 (Access Port, Trunk 802.1Q, PortFast & BPDU Guard)
Switch(config)# vlan 10
Switch(config-vlan)# name SERVER_AKADEMIK
Switch(config)# vlan 20
Switch(config-vlan)# name LAB_SISWA
Switch(config)# spanning-tree mode rapid-pvst
Switch(config)# spanning-tree vlan 10,20 priority 4096

Switch(config)# interface range gigabitEthernet 0/2 - 24
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 20
Switch(config-if-range)# spanning-tree portfast
Switch(config-if-range)# spanning-tree bpduguard enable

Switch(config)# interface gigabitEthernet 0/1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk native vlan 99
Switch(config-if)# switchport trunk allowed vlan 10,20,99

! 2. Konfigurasi Router-on-a-Stick (Inter-VLAN) & Dynamic Routing OSPF Area 0
Router(config)# interface gigabitEthernet 0/0.10
Router(config-subif)# encapsulation dot1Q 10
Router(config-subif)# ip address 10.10.10.1 255.255.255.192
Router(config)# router ospf 1
Router(config-router)# router-id 1.1.1.1
Router(config-router)# auto-cost reference-bandwidth 10000
Router(config-router)# passive-interface default
Router(config-router)# no passive-interface gigabitEthernet 0/1
Router(config-router)# network 10.10.10.0 0.0.0.63 area 0`,
    workflowSteps: [
      "Tahap 1 (Desain Topologi Hirarkis 3-Tier): Pisahkan fungsi jaringan ke dalam lapisan Core (backbone berkecepatan tinggi), Distribution (agregasi routing antar-VLAN & kebijakan ACL), dan Access (koneksi port ke perangkat akhir).",
      "Tahap 2 (Segmentasi VLAN & Keamanan Port L2): Buat database VLAN, tetapkan port pengguna sebagai Access Port dengan fitur PortFast + BPDU Guard, dan pindahkan Native VLAN dari VLAN 1 ke VLAN khusus yang tidak terpakai.",
      "Tahap 3 (Konfigurasi Inter-VLAN Routing): Terapkan sub-interface 802.1Q (Router-on-a-Stick) atau Switch Virtual Interface (SVI) pada Multilayer Switch L3 agar komunikasi antar-VLAN dapat dikendalikan.",
      "Tahap 4 (Aktivasi OSPF & Penyesuaian Cost): Aktifkan proses OSPF pada Area 0, tetapkan Router-ID secara eksplisit menggunakan interface Loopback, dan sesuaikan auto-cost reference-bandwidth agar link 1 Gbps dan 10 Gbps dibedakan secara akurat.",
      "Tahap 5 (Verifikasi Tabel Routing & Adjacency): Jalankan perintah 'show ip ospf neighbor', 'show ip route ospf', dan 'show interfaces trunk' untuk memastikan status adjacency mencapai FULL.",
    ],
    pitfalls: [
      {
        mistake:
          "Membiarkan nilai default 'auto-cost reference-bandwidth 100' (100 Mbps) pada jaringan modern yang menggunakan port Gigabit (1 Gbps) dan 10-Gigabit.",
        expertSolution:
          "Ubah nilai reference-bandwidth menjadi 10000 (10 Gbps) di seluruh router OSPF agar link FastEthernet (Cost 100), Gigabit (Cost 10), dan 10G (Cost 1) tidak sama-sama dihitung bernilai Cost 1.",
      },
      {
        mistake:
          "Ketidakcocokan (mismatch) daftar Allowed VLAN atau Native VLAN pada kedua ujung kabel Trunk antar-switch.",
        expertSolution:
          "Verifikasi kedua sisi port menggunakan 'show interfaces trunk' untuk memastikan enkapsulasi 802.1Q, Native VLAN, dan daftar Allowed VLAN identik di kedua perangkat.",
      },
      {
        mistake:
          "Lupa mengaktifkan perintah 'no shutdown' pada interface fisik induk saat membuat sub-interface Router-on-a-Stick.",
        expertSolution:
          "Pastikan interface fisik utama (misal Gi0/0) dalam kondisi 'no shutdown' tanpa IP address, kemudian tetapkan 'encapsulation dot1Q <vlan-id>' dan IP gateway pada masing-masing sub-interface.",
      },
    ],
    pdf: {
      id: "pdf-tkj-01",
      title:
        "Buku Ajar & Praktikum: Arsitektur Jaringan, Subnetting VLSM, VLAN 802.1Q & Routing OSPF (Standar CCNA 200-301 & MTCNA)",
      filename:
        "MODUL-TKJ-01-Arsitektur-Jaringan-Subnetting-VLAN-OSPF-CCNA-MTCNA.pdf",
      folderPath: "public/pustaka-modul/01-tkj/",
      fileUrl:
        "/pustaka-modul/01-tkj/MODUL-TKJ-01-Arsitektur-Jaringan-Subnetting-VLAN-OSPF-CCNA-MTCNA.pdf",
      certStandard: "Cisco CCNA 200-301 & MikroTik MTCNA",
      externalSourceUrl:
        "https://learningnetwork.cisco.com/s/ccna-exam-topics",
    },
  },

  "tkj-sysadmin": {
    courseId: "tkj-sysadmin",
    fieldId: "tkj",
    theoryFoundation:
      "Administrasi sistem server Linux (Debian/Ubuntu Server) dan infrastruktur fisik Fiber Optik FTTH merupakan tulang punggung operasional cloud dan ISP modern. Pada tingkat sistem operasi, keamanan dan stabilitas server bergantung pada isolasi hak akses POSIX (Owner-Group-Others), pengelolaan service systemd, resolusi nama domain hierarkis melalui Authoritative DNS BIND9, serta terminasi trafik HTTP/HTTPS menggunakan Reverse Proxy Nginx dan kontainerisasi Docker.",
    architectureMechanism:
      "Pada lapisan fisik jaringan akses optik Gigabit Passive Optical Network (GPON), sinyal cahaya laser ditransmisikan dari port PON di OLT (Optical Line Terminal) pada panjang gelombang 1490 nm (Downstream) dan 1310 nm (Upstream) melalui jaringan kabel serat optik Single-Mode G.652D menuju Optical Distribution Cabinet (ODC) dan Optical Distribution Point (ODP). Pembagian sinyal menggunakan Passive Optical Splitter (1:4, 1:8, 1:16) menimbulkan redaman logaritmik yang wajib dihitung dalam Optical Link Budget agar daya terima (Rx Power) di modem ONT pelanggan berada pada rentang kerja optimal -15 dBm hingga -24 dBm.",
    technicalReferenceTitle:
      "REFERENSI LINUX SERVER, DNS BIND9, NGINX, DOCKER & RUMUS REDAMAN FTTH GPON",
    technicalReferenceCode: `# 1. Rumus Perhitungan Optical Link Budget FTTH GPON
Total Redaman (dB) = (Jarak_km x 0.35 dB) + (Jml_Konektor x 0.25 dB) + (Jml_Splice x 0.1 dB) + Loss_Splitter
Rx_Power_ONT (dBm) = Tx_Power_OLT (dBm) - Total Redaman (dB)
Standar Redaman Splitter: 1:2 = 3.7 dB | 1:4 = 7.2 dB | 1:8 = 10.5 dB | 1:16 = 13.8 dB
Rentang Rx Power ONT Ideal: -15.0 dBm s.d. -24.0 dBm (Batas Kritis LOS: < -27.0 dBm)

# 2. Hardening SSH, Permission POSIX & Verifikasi Zona DNS BIND9 di Debian/Ubuntu
sudo sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

sudo chown -R www-data:www-data /var/www/app && sudo chmod -R 750 /var/www/app
sudo named-checkconf && sudo named-checkzone skensa.id /etc/bind/db.skensa.id
sudo systemctl reload bind9

# 3. Verifikasi Reverse Proxy Nginx & Kontainer Docker
sudo nginx -t && sudo systemctl reload nginx
docker compose up -d --build && docker compose ps`,
    workflowSteps: [
      "Tahap 1 (Perencanaan Optical Link Budget): Hitung jarak tarikan kabel drop core, jumlah titik sambungan fusion splicing, dan rasio kombinasi splitter ODC/ODP sebelum instalasi fisik untuk menjamin Rx Power di atas -24 dBm.",
      "Tahap 2 (Penyediaan & Hardening OS Linux): Konfigurasi IP statis pada Netplan/interfaces, aktifkan firewall UFW/nftables hanya pada port 22/80/443, nonaktifkan login root via SSH, dan terapkan autentikasi kunci publik Ed25519.",
      "Tahap 3 (Konfigurasi DNS BIND9 & Web Server Nginx): Buat berkas Forward Zone (A, CNAME, MX, TXT) dan Reverse Zone (PTR), validasi sintaks dengan named-checkzone, lalu siapkan blok server Nginx sebagai Reverse Proxy HTTPS.",
      "Tahap 4 (Orkestrasi Kontainer Docker): Kemas layanan aplikasi dan database ke dalam docker-compose.yml dengan jaringan internal terisolasi, batas penggunaan memori (mem_limit), serta persistent volume.",
      "Tahap 5 (Observabilitas & Backup Otomatis): Pasang agen monitoring SNMP/Prometheus Node Exporter dan jadwalkan pencadangan database harian menggunakan cronjob ke penyimpanan terpisah.",
    ],
    pitfalls: [
      {
        mistake:
          "Memberikan hak akses 'chmod 777' pada direktori aplikasi web (/var/www/html) saat mengalami kendala Permission Denied.",
        expertSolution:
          "Tetapkan kepemilikan ke user layanan web ('chown -R www-data:www-data') dengan izin '755' untuk direktori, '644' untuk berkas statis, dan '600' untuk berkas rahasia (.env).",
      },
      {
        mistake:
          "Mengubah isi record pada berkas zona BIND9 tanpa menaikkan angka Serial Number di blok SOA.",
        expertSolution:
          "Selalu tingkatkan nilai Serial Number (format YYYYMMDDNN) setiap kali mengedit zona DNS sebelum menjalankan 'rndc reload' agar perubahan propagasi terdeteksi oleh server sekunder.",
      },
      {
        mistake:
          "Menggunakan konektor SC/UPC (biru) dan SC/APC (hijau, sudut kemiringan 8 derajat) secara bersilangan pada satu adapter optik.",
        expertSolution:
          "Pastikan warna dan tipe polesan ferule konektor optik seragam (APC ke APC atau UPC ke UPC) untuk menghindari pantulan balik (Return Loss) tinggi dan kerusakan permukaan core kaca.",
      },
    ],
    pdf: {
      id: "pdf-tkj-02",
      title:
        "Buku Ajar & Praktikum: Administrasi Server Linux Debian/Ubuntu, DNS BIND9, Reverse Proxy Nginx & Kontainer Docker (Standar BNSP J.611000)",
      filename:
        "MODUL-TKJ-02-Administrasi-Server-Debian-Linux-DNS-Nginx-Docker-BNSP.pdf",
      folderPath: "public/pustaka-modul/01-tkj/",
      fileUrl:
        "/pustaka-modul/01-tkj/MODUL-TKJ-02-Administrasi-Server-Debian-Linux-DNS-Nginx-Docker-BNSP.pdf",
      certStandard: "BNSP Teknisi Jaringan & Linux Server (LFCS)",
      externalSourceUrl: "https://www.debian.org/doc/manuals/debian-handbook/",
    },
  },

  // 02 - INFORMATIKA
  "if-algoritma": {
    courseId: "if-algoritma",
    fieldId: "informatika",
    theoryFoundation:
      "Rekayasa perangkat lunak berkinerja tinggi bertumpu pada pemilihan Struktur Data yang tepat dan analisis Kompleksitas Algoritma (Big-O Time & Space Complexity). Ketika ukuran data (n) tumbuh dari ratusan menjadi jutaan entitas, algoritma ber-kompleksitas kuadratik O(n^2) seperti pencarian bersarang (nested loop) akan mengonsumsi waktu CPU secara eksponensial dibandingkan algoritma O(n log n) atau lookup berbasis Hash Table O(1).",
    architectureMechanism:
      "Pada tingkat arsitektur kode (Software Design), paradigma Object-Oriented Programming (OOP) dan lima prinsip SOLID menjaga agar sistem skala besar tetap modular, mudah diuji (testable), dan tahan terhadap perubahan kebutuhan bisnis. Dengan menerapkan Dependency Inversion Principle (DIP) dan Interface Segregation, logika bisnis inti (Use Case / Domain Service) tidak bergantung langsung pada pustaka database atau layanan pembayaran pihak ketiga, melainkan berkomunikasi melalui kontrak abstraksi (Interface).",
    technicalReferenceTitle:
      "REFERENSI KOMPLEKSITAS ALGORITMA BIG-O & IMPLEMENTASI OOP SOLID (TYPESCRIPT)",
    technicalReferenceCode: `// 1. Transformasi Algoritma O(n^2) menjadi O(n) menggunakan Hash Map:
export interface CourseEnrollment { studentId: string; courseCode: string; score: number; }

export function buildFastScoreLookup(records: CourseEnrollment[]): Map<string, number> {
  // Waktu Pembangunan: O(n) | Waktu Pencarian per Siswa: O(1)
  const map = new Map<string, number>();
  for (const rec of records) {
    map.set(\`\${rec.studentId}:\${rec.courseCode}\`, rec.score);
  }
  return map;
}

// 2. Implementasi Binary Search O(log n) pada Array Terurut:
export function binarySearchScore(sortedArr: number[], target: number): number {
  let low = 0;
  let high = sortedArr.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (sortedArr[mid] === target) return mid;
    if (sortedArr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    workflowSteps: [
      "Tahap 1 (Spesifikasi Masalah & Batasan Input): Identifikasi ukuran maksimum dataset (n), batas waktu eksekusi, serta kasus batas (edge cases seperti array kosong, nilai negatif, atau duplikasi kunci).",
      "Tahap 2 (Pemilihan Struktur Data Optimal): Gunakan Array/Tuple untuk akses sekuensial berindeks, Set/Map untuk pencarian keunikan O(1), Stack/Queue untuk pemrosesan LIFO/FIFO, dan Graph/Tree untuk data berhirarki.",
      "Tahap 3 (Perancangan Kontrak Interface & Kelas SOLID): Pisahkan tanggung jawab kelas (Single Responsibility) dan definisikan tipe data ketat (strict typing) tanpa menggunakan tipe 'any'.",
      "Tahap 4 (Penulisan Unit Test & Penanganan Eksepsi): Buat pengujian otomatis untuk skenario normal dan skenario gagal (error handling terstruktur) sesuai unit kompetensi BNSP J.620100.017.02.",
      "Tahap 5 (Profiling & Refactoring Kompleksitas): Evaluasi konsumsi memori (Space Complexity) dan hilangkan komputasi berulang melalui teknik Memoization atau Dynamic Programming.",
    ],
    pitfalls: [
      {
        mistake:
          "Memanggil metode '.find()' atau '.includes()' di dalam blok perulangan '.map()' atau 'for' pada ribuan baris data (menghasilkan kompleksitas O(n^2)).",
        expertSolution:
          "Konversi koleksi referensi menjadi objek 'Map' atau 'Set' terlebih dahulu di luar perulangan sehingga setiap lookup di dalam loop berjalan dalam waktu konstan O(1).",
      },
      {
        mistake:
          "Memodifikasi (mutate) array atau objek asli secara langsung di dalam fungsi murni yang menyebabkan bug efek samping (side-effect) pada state UI.",
        expertSolution:
          "Terapkan prinsip Immutability menggunakan spread operator ('[...arr]'), '.map()', '.filter()', atau 'structuredClone()' sebelum melakukan transformasi data.",
      },
      {
        mistake:
          "Menyatukan logika validasi input, query SQL, dan pengiriman email di dalam satu fungsi/kelas raksasa (God Object).",
        expertSolution:
          "Pecah ke dalam lapisan terpisah (Validator, Repository, dan NotificationService) sesuai Single Responsibility Principle agar setiap komponen dapat diuji secara independen.",
      },
    ],
    pdf: {
      id: "pdf-if-01",
      title:
        "Buku Ajar & Praktikum: Algoritma, Struktur Data, Kompleksitas Big-O & Prinsip OOP SOLID (Standar BNSP J.620100)",
      filename:
        "MODUL-IF-01-Algoritma-Struktur-Data-Kompleksitas-BigO-dan-OOP-SOLID.pdf",
      folderPath: "public/pustaka-modul/02-informatika/",
      fileUrl:
        "/pustaka-modul/02-informatika/MODUL-IF-01-Algoritma-Struktur-Data-Kompleksitas-BigO-dan-OOP-SOLID.pdf",
      certStandard: "BNSP Junior Software Developer (J.620100.017.02)",
      externalSourceUrl:
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures",
    },
  },

  "if-web": {
    courseId: "if-web",
    fieldId: "informatika",
    theoryFoundation:
      "Pengembangan aplikasi web full-stack modern mengintegrasikan arsitektur komponen reaktif (React/Next.js), layanan RESTful API yang stateless, pertahanan keamanan berlapis terhadap celah OWASP Top 10, serta deployment terotomatisasi pada infrastruktur Cloud (AWS CLF-C02). Pemisahan antara Server Components dan Client Components memungkinkan pengiriman bundel JavaScript yang minimal ke peramban sekaligus menjaga kerahasiaan kredensial API di sisi server.",
    architectureMechanism:
      "Dari sisi keamanan siber aplikasi, tiga pertahanan utama yang wajib diimplementasikan adalah: (1) Validasi dan sanitasi seluruh masukan pengguna di sisi server untuk mencegah Cross-Site Scripting (XSS) dan Command/SQL Injection, (2) Pengelolaan autentikasi menggunakan token terenkripsi/bertanda tangan kriptografis (JWT) di dalam cookie HttpOnly + Secure + SameSite=Strict accompanied by Role-Based Access Control (RBAC), serta (3) Penerapan arsitektur cloud High Availability lintas Availability Zone (Multi-AZ) dengan Auto Scaling dan Load Balancer.",
    technicalReferenceTitle:
      "REFERENSI REST API NEXT.JS, KEAMANAN OWASP TOP 10 & ARSITEKTUR CLOUD AWS CLF-C02",
    technicalReferenceCode: `// 1. Pola Middleware / Guard Autentikasi & Validasi Payload API:
import { NextResponse } from "next/server";

export async function securePostHandler(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 });
  }
  const body = await req.json();
  // Sanitasi & Validasi Tipe Masukan
  if (typeof body.title !== "string" || body.title.trim().length < 3) {
    return NextResponse.json({ error: "Unprocessable Entity: Judul tidak valid" }, { status: 422 });
  }
  return NextResponse.json({ status: "success", data: { title: body.title.trim() } }, { status: 201 });
}

# 2. Ringkasan Pilar AWS Well-Architected Framework (Sertifikasi AWS CLF-C02):
1. Operational Excellence : Otomasi CI/CD & Infrastructure as Code (AWS CloudFormation)
2. Security               : Prinsip IAM Least Privilege, MFA, AWS WAF, Enkripsi KMS
3. Reliability            : Deployment Multi-AZ (RDS Standby) & Auto Scaling Group
4. Performance Efficiency : Pemilihan tipe instance tepat guna & caching CloudFront CDN
5. Cost Optimization      : Reserved Instances / Savings Plans & AWS Cost Explorer
6. Sustainability         : Optimasi utilisasi komputasi serverless (AWS Lambda)`,
    workflowSteps: [
      "Tahap 1 (Perancangan Kontrak API OpenAPI/Swagger): Tentukan endpoint URL berbasis kata benda jamak (/api/v1/modules), metode HTTP semantik, skema request body, dan kode status respons.",
      "Tahap 2 (Pembangunan Antarmuka Komponen Modular): Susun komponen UI yang dapat digunakan kembali (reusable), kelola state loading/error/success secara eksplisit, dan pastikan aksesibilitas keyboard.",
      "Tahap 3 (Implementasi Keamanan Autentikasi & Otorisasi): Gunakan hashing bcrypt/Argon2 untuk kata sandi, terapkan rate-limiting pada endpoint login, dan cek hak akses pemilik data (mencegah celah IDOR).",
      "Tahap 4 (Otomasi Pipeline CI/CD): Konfigurasi GitHub Actions untuk menjalankan pemeriksaan linter, pemeriksaan tipe TypeScript ('tsc --noEmit'), dan pengujian otomatis setiap ada Pull Request.",
      "Tahap 5 (Deployment Cloud & Observabilitas): Publikasikan aplikasi di balik Reverse Proxy / CloudFront CDN dengan sertifikat TLS 1.3 dan pantau metrik latensi serta error rate.",
    ],
    pitfalls: [
      {
        mistake:
          "Menyimpan kunci rahasia API (Secret Key) pada variabel lingkungan berawalan 'NEXT_PUBLIC_' sehingga terekspos di kode peramban pengguna.",
        expertSolution:
          "Gunakan variabel lingkungan tanpa awalan 'NEXT_PUBLIC_' dan panggil API pihak ketiga hanya dari dalam Server Component atau Route Handler (/api/...).",
      },
      {
        mistake:
          "Mengandalkan validasi form di sisi frontend (HTML required/JavaScript) saja tanpa memvalidasi ulang payload di endpoint backend.",
        expertSolution:
          "Selalu jalankan validasi skema ketat di sisi server karena penyerang dapat mengirim request HTTP langsung menggunakan cURL atau Postman melewati antarmuka web.",
      },
      {
        mistake:
          "Menyimpan token akses sensitif di dalam 'localStorage' yang rentan dicuri apabila terjadi celah Cross-Site Scripting (XSS).",
        expertSolution:
          "Simpan sesi token di dalam cookie dengan flag 'HttpOnly; Secure; SameSite=Strict' sehingga tidak dapat dibaca oleh skrip JavaScript di sisi klien.",
      },
    ],
    pdf: {
      id: "pdf-if-02",
      title:
        "Buku Ajar & Praktikum: Arsitektur Web Modern Next.js, RESTful API, Keamanan OWASP Top 10 & Cloud AWS CLF-C02",
      filename:
        "MODUL-IF-02-FullStack-Web-Nextjs-REST-API-Keamanan-OWASP-dan-Cloud-AWS.pdf",
      folderPath: "public/pustaka-modul/02-informatika/",
      fileUrl:
        "/pustaka-modul/02-informatika/MODUL-IF-02-FullStack-Web-Nextjs-REST-API-Keamanan-OWASP-dan-Cloud-AWS.pdf",
      certStandard: "BNSP Web Developer & AWS Cloud Practitioner CLF-C02",
      externalSourceUrl: "https://owasp.org/www-project-top-ten/",
    },
  },

  "if-database": {
    courseId: "if-database",
    fieldId: "informatika",
    theoryFoundation:
      "Sistem manajemen basis data relasional (RDBMS seperti PostgreSQL, MySQL, dan Oracle Database) menjamin integritas data jangka panjang melalui aturan Normalisasi (1NF, 2NF, 3NF, BCNF), batasan kunci referensial (Foreign Key Constraints), serta kepatuhan transaksi ACID (Atomicity, Consistency, Isolation, Durability). Tanpa normalisasi yang tepat, basis data akan mengalami duplikasi penyimpanan serta anomali saat penyisipan, pembaruan, maupun penghapusan baris.",
    architectureMechanism:
      "Pada skala produksi, kecepatan eksekusi query SQL sangat bergantung pada rancangan struktur indeks B-Tree dan cara penulisan rencana eksekusi (Query Execution Plan). Klausa WHERE dan JOIN yang memanfaatkan indeks terurut mampu memangkas waktu pencarian dari Sequential Scan O(n) menjadi Index Scan O(log n). Selain itu, operasi kritikal yang melibatkan pembaruan lebih dari satu tabel wajib dijalankan di dalam blok transaksi ('BEGIN ... COMMIT / ROLLBACK') dengan tingkat isolasi yang mencegah kondisi Race Condition.",
    technicalReferenceTitle:
      "REFERENSI NORMALISASI 3NF, INDEXING B-TREE, PARAMETERIZED QUERY & TRANSAKSI ACID",
    technicalReferenceCode: `-- 1. Skema Tabel Ter-normalisasi 3NF & B-Tree Composite Index:
CREATE TABLE mata_kuliah (
    id_matkul VARCHAR(16) PRIMARY KEY,
    nama_matkul VARCHAR(120) NOT NULL,
    sks SMALLINT NOT NULL CHECK (sks BETWEEN 1 AND 6),
    ambang_skor NUMERIC(5,2) NOT NULL DEFAULT 75.00
);

CREATE TABLE riwayat_ujian_sertifikasi (
    id_ujian BIGSERIAL PRIMARY KEY,
    nim_siswa CHAR(10) NOT NULL,
    id_matkul VARCHAR(16) NOT NULL REFERENCES mata_kuliah(id_matkul) ON UPDATE CASCADE,
    nilai_ujian NUMERIC(5,2) NOT NULL CHECK (nilai_ujian BETWEEN 0 AND 100),
    waktu_submit TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ujian_matkul_nilai ON riwayat_ujian_sertifikasi(id_matkul, nilai_ujian DESC);

-- 2. Transaksi Atomik (ACID) dengan Penguncian Baris (FOR UPDATE):
BEGIN;
UPDATE kuota_sertifikasi
   SET kuota_tersisa = kuota_tersisa - 1
 WHERE kode_skema = 'BNSP-J620100' AND kuota_tersisa > 0;
INSERT INTO pendaftaran_asesi (nim_siswa, kode_skema, status)
VALUES ('2026010045', 'BNSP-J620100', 'TERDAFTAR');
COMMIT;`,
    workflowSteps: [
      "Tahap 1 (Pemodelan Konseptual ERD): Identifikasi entitas utama, atribut kunci, dan kardinalitas relasi (1:1, 1:N, atau M:N yang wajib dipecah menggunakan tabel jembatan / junction table).",
      "Tahap 2 (Verifikasi Normalisasi 1NF, 2NF, 3NF): Pastikan setiap sel bersifat atomik (1NF), hilangkan ketergantungan parsial pada kunci komposit (2NF), dan pisahkan atribut yang bergantung transitif pada kolom non-kunci (3NF).",
      "Tahap 3 (Implementasi DDL & Integritas Referensial): Terapkan tipe data paling efisien, batasan NOT NULL, UNIQUE, CHECK, serta FOREIGN KEY pada skrip migrasi database.",
      "Tahap 4 (Penulisan Query Analitik & Prepared Statement): Gunakan INNER/LEFT JOIN, agregasi GROUP BY + HAVING, dan pastikan seluruh variabel input dikirim melalui Parameterized Query ($1, $2).",
      "Tahap 5 (Audit Performa EXPLAIN ANALYZE): Jalankan 'EXPLAIN ANALYZE' pada query yang lambat untuk mendeteksi Sequential Scan dan tambahkan indeks B-Tree yang sesuai.",
    ],
    pitfalls: [
      {
        mistake:
          "Menyimpan daftar ID atau kategori yang dipisahkan koma (misal 'TKJ101,TKJ202,TKJ304') di dalam satu kolom VARCHAR (melanggar aturan 1NF).",
        expertSolution:
          "Buat tabel relasi terpisah (junction table) dengan Foreign Key agar setiap nilai berada pada baris mandiri dan dapat diindeks serta di-JOIN secara efisien.",
      },
      {
        mistake:
          "Menggunakan klausa 'HAVING' untuk memfilter kolom biasa yang sebenarnya tidak melibatkan fungsi agregasi (COUNT/SUM/AVG).",
        expertSolution:
          "Filter baris mentah sedini mungkin menggunakan klausa 'WHERE' sebelum pengelompokan 'GROUP BY', dan gunakan 'HAVING' khusus untuk memfilter hasil agregasi.",
      },
      {
        mistake:
          "Menggabungkan input string pengguna langsung ke dalam kalimat SQL ('SELECT * FROM users WHERE nim = ' + inputNim) yang membuka celah fatal SQL Injection.",
        expertSolution:
          "Selalu gunakan Parameterized Queries / Prepared Statements sehingga mesin database memperlakukan input pengguna murni sebagai parameter literal, bukan perintah SQL.",
      },
    ],
    pdf: {
      id: "pdf-if-03",
      title:
        "Buku Ajar & Praktikum: Perancangan Basis Data Relasional, Normalisasi 1NF-3NF, Optimasi Query SQL & Transaksi ACID",
      filename:
        "MODUL-IF-03-Perancangan-Basis-Data-Normalisasi-3NF-SQL-Indexing-dan-ACID.pdf",
      folderPath: "public/pustaka-modul/02-informatika/",
      fileUrl:
        "/pustaka-modul/02-informatika/MODUL-IF-03-Perancangan-Basis-Data-Normalisasi-3NF-SQL-Indexing-dan-ACID.pdf",
      certStandard: "Oracle Database SQL & BNSP Basis Data (J.620100.020.02)",
      externalSourceUrl: "https://www.postgresql.org/docs/current/tutorial.html",
    },
  },

  // 03 - DKV
  "dkv-tipografi": {
    courseId: "dkv-tipografi",
    fieldId: "dkv",
    theoryFoundation:
      "Komunikasi visual yang efektif dibangun di atas penguasaan Nirmana Dwimatra, Psikologi Persepsi Gestalt, dan sistem Tipografi Grid Modular. Otak manusia tidak membaca elemen visual secara terpisah, melainkan mengelompokkannya berdasarkan hukum Proximity (kedekatan jarak), Similarity (kesamaan rupa), Continuity (arah aliran mata), dan Figure-Ground. Dalam tipografi editorial maupun antarmuka, hirarki visual mengarahkan urutan baca audiens dari judul utama (Primary), subjudul (Secondary), hingga isi naskah (Tertiary).",
    architectureMechanism:
      "Pada tahap produksi grafika (Pre-Press Offset & Digital Printing sesuai standar BNSP M.74100), desainer wajib memahami perbedaan fisika cahaya aditif RGB (layar) dan tinta subtraktif CMYK (kertas). Berkas siap cetak wajib memiliki resolusi gambar bitmap minimal 300 PPI pada dimensi aktual, mode warna CMYK dengan profil ICC yang sesuai, tambahan area Bleed 3-5 mm di luar garis potong pisau (Trim Line), serta konversi seluruh huruf menjadi kurva vektor (Create Outlines) agar tidak terjadi substitusi font di mesin RIP percetakan.",
    technicalReferenceTitle:
      "STANDAR TEKNIS PRE-PRESS OFFSET CMYK & SKALA TIPOGRAFI MODULAR (BNSP M.74100)",
    technicalReferenceCode: `1. PARAMETER WAJIB FINAL ARTWORK CETAK OFFSET (PDF/X-1a:2001):
- Color Mode       : CMYK (Total Ink Coverage / TAC maksimum 300% - 320% untuk kertas Art Paper)
- Resolusi Bitmap  : 300 PPI (Pixels Per Inch) pada skala dimensi 100%
- Bleed Area       : 3 mm s.d. 5 mm di seluruh sisi luar Trim Box
- Safety Margin    : Minimal 5 mm di sisi dalam Trim Box untuk teks dan logo penting
- Teks Body Hitam  : Gunakan K=100% (C=0, M=0, Y=0) dengan atribut Overprint Fill aktif
- Blok Hitam Pekat : Gunakan Rich Black (C=60%, M=40%, Y=40%, K=100%)
- Tipografi & Link : Seluruh font telah di-Create Outlines & gambar berstatus Embedded

2. PARAMETER KETERBACAAN TIPOGRAFI (READABILITY & LEGIBILITY):
- Panjang Baris Ideal (Measure) : 45 hingga 75 karakter per baris (termasuk spasi)
- Jarak Antarbaris (Leading)    : 140% - 160% dari ukuran font body (misal font 10pt -> leading 15pt)
- Kontras Figur-Latar           : Pastikan nilai luminansi teks vs latar kontras tajam`,
    workflowSteps: [
      "Tahap 1 (Analisis Brief & Penentuan Grid): Tentukan format ukuran akhir media (misal A4 210x297 mm), margin aman, jumlah kolom grid modular, dan lebar gutter.",
      "Tahap 2 (Penyusunan Hirarki Tipografi): Pilih pasangan font (Font Pairing) antara Display/Serif untuk judul dan Sans-Serif humanis/geometris untuk teks isi dengan rasio ukuran yang jelas.",
      "Tahap 3 (Penerapan Komposisi Gestalt & Warna): Atur jarak antar-kelompok informasi (Proximity) dan terapkan aturan proporsi warna 60% warna dominan, 30% warna sekunder, dan 10% warna aksen (Focal Point).",
      "Tahap 4 (Pemeriksaan Teknis Pre-Flight): Cek resolusi efektif seluruh tautan foto di panel Links (minimal 300 PPI), konversi objek RGB ke CMYK, dan periksa pemisahan pelat warna (Separations Preview).",
      "Tahap 5 (Packaging & Ekspor PDF/X): Lakukan Create Outlines pada teks, aktifkan tanda potong (Crop Marks) dan Use Document Bleed Settings (3 mm), lalu ekspor ke standar PDF/X-1a atau PDF/X-4.",
    ],
    pitfalls: [
      {
        mistake:
          "Mendesain materi cetak brosur/kemasan dalam mode warna RGB Neon sehingga warna berubah kusam drastis saat dicetak menggunakan tinta CMYK.",
        expertSolution:
          "Atur dokumen kerja ke mode CMYK sejak awal (atau gunakan Proof Colors dengan profil ISO Coated v2) dan gunakan panduan buku warna fisik untuk warna kritis.",
      },
      {
        mistake:
          "Menggunakan warna Registration (C:100 M:100 Y:100 K:100) atau 4-warna pada teks paragraf berukuran kecil (8-10 pt).",
        expertSolution:
          "Gunakan tinta hitam murni 1-pelat (C:0 M:0 Y:0 K:100) dengan opsi Overprint agar teks tetap tajam meskipun terjadi pergeseran mikro (misregistration) pelat cetak.",
      },
      {
        mistake:
          "Menempatkan elemen teks penting atau logo terlalu mepet ke tepi kanvas tanpa memperhatikan margin dalam dan area potong Bleed.",
        expertSolution:
          "Selalu tambahkan Bleed 3 mm untuk latar belakang yang menyentuh tepi, dan jaga jarak teks minimal 5-8 mm ke arah dalam dari garis potong (Trim Line).",
      },
    ],
    pdf: {
      id: "pdf-dkv-01",
      title:
        "Buku Ajar & Praktikum: Nirmana Dwimatra, Psikologi Persepsi Gestalt, Hirarki Tipografi & Produksi Pre-Press CMYK (Standar BNSP M.74100)",
      filename:
        "MODUL-DKV-01-Nirmana-Prinsip-Gestalt-Tipografi-dan-Produksi-PrePress-CMYK.pdf",
      folderPath: "public/pustaka-modul/03-dkv/",
      fileUrl:
        "/pustaka-modul/03-dkv/MODUL-DKV-01-Nirmana-Prinsip-Gestalt-Tipografi-dan-Produksi-PrePress-CMYK.pdf",
      certStandard: "BNSP Desainer Grafis Muda (M.74100) & Adobe ACP",
      externalSourceUrl: "https://helpx.adobe.com/illustrator/user-guide.html",
    },
  },

  "dkv-uiux": {
    courseId: "dkv-uiux",
    fieldId: "dkv",
    theoryFoundation:
      "Desain Antarmuka (User Interface / UI) dan Pengalaman Pengguna (User Experience / UX) menggabungkan riset perilaku manusia dengan rekayasa sistem desain komponen. Proses UX dimulai dari tahap Empathize & Define (menyusun User Persona dan User Journey Map untuk menemukan titik kesulitan pengguna), dilanjutkan dengan Information Architecture (IA) dan pembuatan Wireframe berfokus alur navigasi sebelum masuk ke tahap visual High-Fidelity.",
    architectureMechanism:
      "Pada skala produk digital berkelanjutan, konsistensi antarmuka antara tim desainer dan tim developer dijaga menggunakan Design System di Figma. Seluruh atribut dasar disimpan sebagai Design Tokens (warna semantik, skala tipografi, spasi kelipatan 8px), sedangkan komponen dibangun secara responsif menggunakan Auto-Layout, Constraints, dan Variants. Seluruh antarmuka wajib memenuhi standar aksesibilitas WCAG 2.1 Level AA (rasio kontras teks normal minimal 4.5:1 dan ukuran target sentuh minimal 44x44 px).",
    technicalReferenceTitle:
      "STANDAR DESIGN SYSTEM FIGMA, HEURISTIK NIELSEN & AKSESIBILITAS WCAG 2.1 AA",
    technicalReferenceCode: `1. PARAMETER AKSESIBILITAS ANTARMUKA (WCAG 2.1 LEVEL AA):
- Kontras Teks Reguler (< 18pt) : Rasio luminansi minimum 4.5 : 1 terhadap warna latar
- Kontras Teks Besar (>= 18pt)  : Rasio luminansi minimum 3.0 : 1 terhadap warna latar
- Ukuran Target Sentuh Mobile   : Minimum 44 x 44 px CSS dengan jarak pisah minimal 8 px
- Indikator Status & Error      : Tidak boleh hanya mengandalkan warna (wajib disertai ikon + teks jelas)

2. ARSITEKTUR ATOMIC DESIGN & TOKENS (SISTEM 8-POINT GRID):
- Spacing Scale   : 4px (0.25rem), 8px (0.5rem), 16px (1rem), 24px (1.5rem), 32px (2rem), 48px (3rem)
- Component State : Default | Hover | Focused (Outline Ring) | Active/Pressed | Disabled | Loading`,
    workflowSteps: [
      "Tahap 1 (Riset Pengguna & Pemetaan Alur): Susun pernyataan masalah (Problem Statement), buat User Flow dari titik masuk hingga tujuan akhir (Task Completion), dan pangkas langkah yang tidak perlu.",
      "Tahap 2 (Wireframing Low-Fidelity): Buat kerangka tata letak hitam-putih untuk menguji hirarki informasi dan penempatan Call-to-Action (CTA) tanpa terdistraksi oleh dekorasi warna.",
      "Tahap 3 (Penyusunan Design Tokens & Komponen Auto-Layout): Definisikan variabel warna dan tipografi, lalu bangun komponen tombol, input form, dan kartu menggunakan Auto-Layout di Figma.",
      "Tahap 4 (Prototyping Interaktif & Audit Aksesibilitas): Hubungkan antar-layar dengan transisi Smart Animate yang wajar (150-300 ms) dan uji rasio kontras warna menggunakan alat pemeriksa WCAG.",
      "Tahap 5 (Usability Testing & Developer Handoff): Uji prototipe kepada minimal 5 pengguna sasaran menggunakan skenario tugas spesifik, catat tingkat keberhasilan, dan siapkan spesifikasi ukuran untuk developer.",
    ],
    pitfalls: [
      {
        mistake:
          "Langsung mendesain tampilan warna-warni (High-Fidelity) tanpa menyusun User Flow dan Wireframe sehingga alur aplikasi membingungkan pengguna.",
        expertSolution:
          "Selesaikan struktur Information Architecture dan pengujian alur pada tahap Low-Fidelity Wireframe sebelum menerapkan gaya visual.",
      },
      {
        mistake:
          "Menggunakan teks abu-abu muda di atas latar putih (rasio kontras < 2.5:1) demi alasan estetika minimalis sehingga gagal terbaca oleh pengguna.",
        expertSolution:
          "Pastikan setiap teks informasi memenuhi batas kontras WCAG AA minimal 4.5:1 agar tetap tajam di berbagai kondisi pencahayaan layar.",
      },
      {
        mistake:
          "Membuat komponen di Figma dengan grup manual (Group) tanpa Auto-Layout sehingga kotak tombol rusak saat panjang teks label berubah.",
        expertSolution:
          "Gunakan fitur Auto-Layout dengan pengaturan Padding horizontal/vertikal dan opsi 'Hug Contents' atau 'Fill Container' agar komponen responsif otomatis.",
      },
    ],
    pdf: {
      id: "pdf-dkv-03",
      title:
        "Buku Ajar & Praktikum: UI/UX Design System di Figma, Standar Aksesibilitas WCAG 2.1 AA & Prinsip Motion Graphics",
      filename:
        "MODUL-DKV-03-UI-UX-Design-System-Figma-WCAG-Accessibility-dan-Motion-Graphics.pdf",
      folderPath: "public/pustaka-modul/03-dkv/",
      fileUrl:
        "/pustaka-modul/03-dkv/MODUL-DKV-03-UI-UX-Design-System-Figma-WCAG-Accessibility-dan-Motion-Graphics.pdf",
      certStandard: "Google UX Design & Adobe Certified Professional",
      externalSourceUrl: "https://www.w3.org/WAI/WCAG21/quickref/",
    },
  },

  "dkv-branding": {
    courseId: "dkv-branding",
    fieldId: "dkv",
    theoryFoundation:
      "Perancangan Identitas Merek (Brand Identity) dan Ilustrasi Vektor membutuhkan sintesis antara ketajaman konsep strategis dan presisi kurva Bezier. Sebuah sistem identitas visual bukan sekadar gambar logo, melainkan bahasa visual menyeluruh yang mencakup filosofi nilai merek, konstruksi grid geometris simbol, sistem lockup, palet warna lintas media (HEX, RGB, CMYK, Pantone), tipografi korporat, hingga pola supergrafis.",
    architectureMechanism:
      "Dalam pengerjaan vektor menggunakan Adobe Illustrator (kurikulum Adobe Certified Professional & BNSP M.74100.005.02), kurva yang bersih dan halus dibentuk dengan menempatkan titik jangkar (Anchor Points) seminimal mungkin hanya pada titik ekstrem kurva (puncak atas, bawah, kiri, kanan) serta menjaga keseimbangan tangen Direction Handles. Seluruh aturan pemakaian logo kemudian dibakukan ke dalam dokumen Graphic Standard Manual (GSM) untuk menjaga konsistensi merek.",
    technicalReferenceTitle:
      "STANDAR KONSTRUKSI VEKTOR LOGO & STRUKTUR GRAPHIC STANDARD MANUAL (GSM)",
    technicalReferenceCode: `1. UJI KELAYAKAN TEKNIS LOGO VEKTOR PROFESIONAL:
- Uji Siluet Hitam-Putih (1-Bit) : Bentuk simbol tetap teridentifikasi jelas tanpa gradasi/warna
- Uji Skalabilitas Ekstrem       : Tetap terbaca tajam pada ukuran 16x16 px (Favicon) hingga 10 meter
- Kebersihan Anchor Points       : Tidak ada titik jangkar berlebih (stray points) atau jalur terbuka
- Outlined Stroke & Pathfinder   : Seluruh garis ketebalan (stroke) telah di-Expand menjadi bidang utuh

2. KOMPONEN INTI BUKU PANDUAN GRAPHIC STANDARD MANUAL (GSM):
- Bab 1 : Brand Essence, Positioning & Kepribadian Merek
- Bab 2 : Anatomi Logo, Grid Konstruksi, Rasio Proporsi (x-height) & Area Clear Space
- Bab 3 : Konfigurasi Warna (Primary/Secondary Palette dalam kode HEX, RGB, CMYK, Pantone)
- Bab 4 : Aturan Larangan Penggunaan Logo (Incorrect Usage / Don'ts) & Aplikasi Mockup`,
    workflowSteps: [
      "Tahap 1 (Pembedahan Creative Brief & Riset Kompetitor): Petakan keunikan produk, karakter audiens, dan celah visual yang membedakan merek dari kompetitor di industri sejenis.",
      "Tahap 2 (Mind Mapping & Eksplorasi Sketsa Manual): Terjemahkan kata kunci abstrak menjadi метаfora bentuk konkret melalui puluhan sketsa cepat di atas kertas.",
      "Tahap 3 (Digitalisasi Vektor & Grid Geometris): Bangun konstruksi vektor di Adobe Illustrator menggunakan Pen Tool dan Shape Builder dengan proporsi rasio yang terukur.",
      "Tahap 4 (Uji Skalabilitas & Variasi Lockup): Uji keterbacaan logo pada latar terang, latar gelap (reverse), ukuran mikro, serta susun variasi lockup horizontal dan vertikal.",
      "Tahap 5 (Penyusunan Buku GSM & Paket Ekspor Aset): Dokumentasikan seluruh aturan ke dalam GSM dan ekspor paket master file (.AI, .EPS, .SVG, .PDF, dan .PNG transparan).",
    ],
    pitfalls: [
      {
        mistake:
          "Membuat logo dengan detail garis yang terlalu tipis dan rumit sehingga menyatu menjadi bercak buram saat dicetak kecil pada kop surat atau bordir seragam.",
        expertSolution:
          "Sederhanakan bentuk negatif (negative space) dan pastikan ketebalan celah terkecil tetap terlihat jelas saat diuji pada lebar 15-20 mm.",
      },
      {
        mistake:
          "Menyerahkan file logo kepada klien dengan garis berbasis Stroke yang belum di-Expand sehingga ketebalan garis berubah kacau saat diperbesar/diperkecil.",
        expertSolution:
          "Selalu jalankan perintah 'Object > Expand / Outline Stroke' dan satukan bidang dengan Pathfinder Unite pada file master produksi.",
      },
      {
        mistake:
          "Tidak menyertakan aturan Clear Space (batas ruang kosong minimum di sekeliling logo) di dalam buku panduan GSM.",
        expertSolution:
          "Tetapkan satuan ukur Clear Space menggunakan elemen proporsional dari logo itu sendiri (misalnya 1x tinggi huruf awal atau simbol) agar mudah dipatuhi oleh vendor.",
      },
    ],
    pdf: {
      id: "pdf-dkv-02",
      title:
        "Buku Ajar & Praktikum: Perancangan Identitas Merek, Konstruksi Logo Grid & Graphic Standard Manual (GSM)",
      filename:
        "MODUL-DKV-02-Brand-Identity-Logo-Grid-System-dan-Graphic-Standard-Manual.pdf",
      folderPath: "public/pustaka-modul/03-dkv/",
      fileUrl:
        "/pustaka-modul/03-dkv/MODUL-DKV-02-Brand-Identity-Logo-Grid-System-dan-Graphic-Standard-Manual.pdf",
      certStandard: "BNSP Desainer Grafis Muda (M.74100.005.02)",
      externalSourceUrl:
        "https://www.interaction-design.org/literature/topics/graphic-design",
    },
  },

  // 04 - ARSITEKTUR
  "ars-tradisional": {
    courseId: "ars-tradisional",
    fieldId: "arsitektur",
    theoryFoundation:
      "Arsitektur Tradisional Bali (Asta Kosala Kosali dan Asta Bumi) merupakan sistem rekayasa ruang holistik yang menyatukan ergonomi antropometri tubuh manusia, kosmologi tata nilai Sanga Mandala, serta ketahanan konstruksi kayu tropis. Dimensi bangunan tidak menggunakan meteran kaku yang seragam, melainkan diselaraskan dengan anatomi pemilik utama (pengawak) melalui satuan sikut: Depa (rentang dua tangan), Hasta (siku ke ujung jari tengah), Musti (kepalan tangan dengan ibu jari tegak), dan Anguli (lebar ruas jari) yang diakhiri dengan penambahan angka pengurip.",
    architectureMechanism:
      "Pada skala tata letak tapak (site planning), perpotongan sumbu sakral Kaja-Kelod (gunung-laut) dan Kangin-Kauh (matahari terbit-terbenam) melahirkan sembilan petak Sanga Mandala. Zona Kaja-Kangin (Utama ning Utama) dikhususkan bagi Parahyangan (Pemerajan/Sanggah), zona tengah (Madya) untuk Pawongan (hunian yang mengelilingi ruang terbuka Natah sebagai pengatur mikroklimat aliran udara), dan zona Kelod-Kauh (Nista ning Nista) untuk Palemahan/teba serta instalasi pengolahan limbah.",
    technicalReferenceTitle:
      "MATRIKS ZONASI SANGA MANDALA, TRI ANGGA & SATUAN ANTROPOMETRI ASTA KOSALA KOSALI",
    technicalReferenceCode: `1. HIRARKI ZONASI TAPAK SANGA MANDALA (BALI SELATAN - GUNUNG DI UTARA):
- Utama ning Utama (Kaja-Kangin) : Area Suci Pemerajan / Sanggah Keluarga
- Utama ning Madya (Kaja)        : Bale Daja (Meten / Gedung) - Ruang tidur utama & pusaka
- Madya ning Utama (Kangin)      : Bale Dangin (Bale Gede / Sakenem) - Ruang upacara adat
- Madya ning Madya (Tengah)      : Natah (Courtyard terbuka pusat sirkulasi udara & cahaya)
- Madya ning Nista (Kauh)        : Bale Dauh (Loji) - Ruang terima tamu & kerja harian
- Nista ning Madya (Kelod)       : Paon (Dapur) & Jineng/Klumpu (Lumbung padi)
- Nista ning Nista (Kelod-Kauh)  : Teba, sumur resapan, dan instalasi pengolahan air limbah

2. STRUKTUR VERTIKAL TRI ANGGA & SISTEM SAMBUNGAN KAYU:
- Utama Angga (Kepala) : Konstruksi atap iga-iga, apit-apit, dan petaka
- Madya Angga (Badan)  : Tiang kolom kayu (Sesaka), balok pengikat (Lambang & Sineb), dinding
- Nista Angga (Kaki)   : Pondasi batu kali dan lantai panggung (Bebaturan / Undag ganjil)
- Sambungan Tahan Gempa: Sistem purus-lubang (Mortise & Tenon) dengan pasak kayu (Lantakan)`,
    workflowSteps: [
      "Tahap 1 (Analisis Orientasi Tapak & Sumbu Kosmologi): Identifikasi arah Kaja (Gunung Agung/pegunungan utama) dan arah Kangin (Timur) pada lokasi proyek untuk membagi grid Sanga Mandala.",
      "Tahap 2 (Penentuan Satuan Sikut Antropometri): Ukur satuan dasar tubuh pengguna utama (Hasta, Musti, Depa) untuk menentukan proporsi tinggi tiang sesaka, lebar bentang bale, dan jarak antar-massa bangunan.",
      "Tahap 3 (Perancangan Tata Massa & Proporsi Natah): Tempatkan massa bangunan mengelilingi halaman tengah (Natah) agar tercipta efek tekanan udara positif-negatif yang mengalirkan angin sejuk ke setiap bale.",
      "Tahap 4 (Rekayasa Teknis Struktur Tri Angga): Rancang detail pondasi bebaturan, sambungan tiang sesaka-canggahwang-sunduk yang bersifat fleksibel meredam guncangan gempa bumi.",
      "Tahap 5 (Adaptasi Fungsi Kontemporer & Utilitas Modern): Integrasikan jalur pipa MEP, pencahayaan tidak langsung, dan sanitasi modern secara tersembunyi tanpa merusak pakem proporsi fasad tradisional.",
    ],
    pitfalls: [
      {
        mistake:
          "Menempatkan toilet, septic tank, atau area servis kotor tepat di zona Kaja-Kangin (Utama ning Utama) atau bersebelahan langsung dengan tembok penyengker Merajan tanpa jeda ruang.",
        expertSolution:
          "Tempatkan seluruh utilitas kotor dan pengolahan limbah pada zona Nista (Kelod / Kelod-Kauh) atau berikan jarak pemisah (telajakan/gang sempadan) yang memadai sesuai etika tata ruang.",
      },
      {
        mistake:
          "Menutup seluruh halaman tengah (Natah) dengan atap masif dan perkerasan beton kedap air sehingga bangunan kehilangan sirkulasi udara alami dan area resapan hujan.",
        expertSolution:
          "Pertahankan Natah sebagai ruang terbuka hijau/berpori yang berfungsi sebagai paru-paru termal dan pengumpul cahaya alami bagi seluruh massa bangunan di sekelilingnya.",
      },
      {
        mistake:
          "Menggunakan sambungan paku/beton kaku pada rangka kayu tradisional yang justru mudah patah getas saat menerima beban lateral gempa.",
        expertSolution:
          "Gunakan prinsip sambungan purus-lubang dan pasak kayu (knock-down) yang memungkinkan disipasi energi kinetik gempa secara elastis.",
      },
    ],
    pdf: {
      id: "pdf-ars-01",
      title:
        "Buku Ajar & Praktikum: Antropometri Ruang, Arsitektur Tradisional Bali Asta Kosala Kosali & Bangunan Hijau Greenship GBCI",
      filename:
        "MODUL-ARS-01-Antropometri-Asta-Kosala-Kosali-dan-Sains-Bangunan-Tropis-GBCI.pdf",
      folderPath: "public/pustaka-modul/04-arsitektur/",
      fileUrl:
        "/pustaka-modul/04-arsitektur/MODUL-ARS-01-Antropometri-Asta-Kosala-Kosali-dan-Sains-Bangunan-Tropis-GBCI.pdf",
      certStandard: "Greenship Associate GBCI & SKKNI Arsitek",
      externalSourceUrl: "https://gbcindonesia.org/greenship",
    },
  },

  "ars-cad": {
    courseId: "ars-cad",
    fieldId: "arsitektur",
    theoryFoundation:
      "Transformasi digital industri arsitektur dan konstruksi beralih dari penggambaran garis 2D konvensional (CAD) menuju Building Information Modeling (BIM) berbasis objek parametrik 3D (Autodesk Revit sesuai standar ISO 19650 dan Autodesk Certified User). Dalam ekosistem BIM, setiap elemen dinding, kolom, pintu, dan atap merupakan komponen cerdas yang menyimpan atribut lapisan material, nilai konduktivitas termal, spesifikasi struktur, hingga volume biaya.",
    architectureMechanism:
      "Sinkronisasi dua arah (Bi-directional Associativity) pada BIM menjamin bahwa setiap revisi posisi dinding atau bukaan pada tampilan Denah akan secara otomatis memperbarui gambar Tampak, Potongan, Detail 3D, serta tabel jadwal perhitungan volume material (Schedules / Bill of Quantities) secara real-time. Selain itu, penggabungan model Arsitektur, Struktur, dan MEP memungkinkan pelaksanaan Clash Detection otomatis untuk menemukan tabrakan antara jalur pipa/ducting AC dengan balok beton sebelum konstruksi dimulai di lapangan.",
    technicalReferenceTitle:
      "STANDAR KETEBALAN GARIS DED (ISO 128) & HIRARKI LEVEL OF DEVELOPMENT BIM (LOD 100-500)",
    technicalReferenceCode: `1. STANDAR KETEBALAN GARIS GAMBAR KERJA DED (PLOT STYLE / CTB ISO 128):
- 0.50 mm : Garis potong elemen struktur utama (Kolom & Dinding Beton Terpotong)
- 0.35 mm : Garis potong dinding pasangan bata & kusen terpotong
- 0.25 mm : Garis objek tampak depan dekat (Fasad utama, perabot utama)
- 0.18 mm : Garis objek tampak jauh & proyeksi atap
- 0.09 mm : Garis dimensi ukur, garis as grid (centerline), dan tekstur arsir (hatch)

2. MATRIKS LEVEL OF DEVELOPMENT (LOD) MODEL BIM:
- LOD 100 : Model massa konseptual untuk analisis orientasi matahari & KDB/KLB
- LOD 200 : Elemen sistem generik dengan perkiraan dimensi ruang (Schematic Design)
- LOD 300 : Elemen terukur presisi siap cetak dokumen gambar kerja DED (Design Development)
- LOD 350 : Mencakup koordinasi antardisiplin & Clash Detection Struktur-MEP
- LOD 400 : Detail fabrikasi bengkel & perakitan konstruksi
- LOD 500 : Model As-Built terverifikasi lapangan untuk operasional gedung`,
    workflowSteps: [
      "Tahap 1 (Penyiapan Project Template & Elevasi Datum): Konfigurasi satuan proyek (Milimeter), tetapkan garis datum Levels (Elevasi Lantai +-0.00, Balok Ring, Puncak Atap) dan sumbu Grids (A-B-C / 1-2-3).",
      "Tahap 2 (Pemodelan Elemen Struktur & Arsitektur Parametrik): Bangun kolom struktur, pondasi, dinding berlapis (Core Boundary + Finishing), lantai, dan atap dengan mengikatkan constraint Top/Base ke Level terkait.",
      "Tahap 3 (Penempatan Family & Pembuatan Jadwal Kuantitas): Masukkan komponen pintu, jendela, dan sanitasi, lalu buat Material Takeoff / Schedules untuk mengekstrak luas dinding dan volume beton otomatis.",
      "Tahap 4 (Koordinasi Clash Detection Lintas Disiplin): Uji model gabungan Arsitektur-Struktur-MEP untuk memastikan tidak ada pipa utilitas yang menembus balok struktural tanpa selongsong (sleeve).",
      "Tahap 5 (Penyusunan Sheet DED & Ekspor IFC/PDF): Susun potongan melintang/memanjang, beri anotasi dimensi berjenjang, keterangan elevasi, dan ekspor ke lembar gambar ber-kop standar.",
    ],
    pitfalls: [
      {
        mistake:
          "Menggambar seluruh elemen denah di AutoCAD menggunakan satu layer tunggal ('Layer 0') dengan ketebalan garis yang seragam sehingga gambar kerja sulit dibaca tukang di lapangan.",
        expertSolution:
          "Terapkan sistem penamaan layer disiplin (A-WALL, S-COLS, A-DOOR, A-DIMS) dengan pembedaan lineweight tegas antara objek terpotong (0.35-0.50 mm) dan garis arsir/dimensi (0.09 mm).",
      },
      {
        mistake:
          "Membuat tinggi dinding di Revit dengan memasukkan angka tinggi lepas (Unconnected Height) alih-alih menguncinya ke Level lantai di atasnya.",
        expertSolution:
          "Selalu ikatkan parameter 'Top Constraint' dinding dan kolom ke Level di atasnya agar ketika tinggi antar-lantai direvisi, seluruh dinding menyesuaikan secara otomatis.",
      },
      {
        mistake:
          "Menghitung ulang luas keramik dan volume pasangan dinding secara manual di spreadsheet terpisah setiap kali ada perubahan denah.",
        expertSolution:
          "Gunakan fitur 'Schedules/Quantities' bawaan BIM sehingga setiap perubahan panjang dinding pada model 3D langsung memperbarui tabel volume secara akurat.",
      },
    ],
    pdf: {
      id: "pdf-ars-02",
      title:
        "Buku Ajar & Praktikum: Gambar Kerja DED AutoCAD, Pemodelan BIM 3D Autodesk Revit (LOD 300) & Clash Detection",
      filename:
        "MODUL-ARS-02-Pemodelan-CAD-2D-BIM-Autodesk-Revit-LOD300-dan-DED.pdf",
      folderPath: "public/pustaka-modul/04-arsitektur/",
      fileUrl:
        "/pustaka-modul/04-arsitektur/MODUL-ARS-02-Pemodelan-CAD-2D-BIM-Autodesk-Revit-LOD300-dan-DED.pdf",
      certStandard: "Autodesk Certified User (ACU) & BNSP Juru Gambar F.410000",
      externalSourceUrl: "https://help.autodesk.com/view/RVT/2024/ENU/",
    },
  },

  "ars-ekologis": {
    courseId: "ars-ekologis",
    fieldId: "arsitektur",
    theoryFoundation:
      "Fisika Bangunan Tropis dan Perencanaan Wilayah Berkelanjutan (standar Greenship GBCI & SNI 6389:2020) berfokus pada pengendalian iklim mikro secara pasif tanpa ketergantungan berlebih pada pendingin udara mekanis (AC). Di wilayah beriklim tropis lembap seperti Bali, tantangan utama adalah meminimalkan perolehan panas radiasi matahari pada selubung bangunan (Overall Thermal Transfer Value / OTTV) sekaligus membuang akumulasi kelembapan melalui ventilasi silang (Cross Ventilation).",
    architectureMechanism:
      "Secara struktural dan regulasi tata ruang, setiap perancangan bangunan wajib mematuhi persyaratan intensitas lahan (KDB, KLB, KDH, dan Garis Sempadan Bangunan / GSB) serta ketahanan gempa SNI 1726:2019. Prinsip mekanika Strong Column Weak Beam menjamin bahwa saat terjadi gempa kuat, kolom utama bangunan tetap berdiri kokoh menopang beban gravitasi sementara energi gempa diserap melalui deformasi daktail pada ujung-ujung balok.",
    technicalReferenceTitle:
      "RUMUS OTTV SELUBUNG BANGUNAN (SNI 6389:2020) & INTENSITAS LAHAN (KDB, KLB, KDH)",
    technicalReferenceCode: `1. RUMUS OVERALL THERMAL TRANSFER VALUE (SNI 6389:2020 & GREENSHIP GBCI):
OTTV_fasad = [ alpha x U_w x (1 - WWR) x TD_ek ] + [ U_f x WWR x delta_T ] + [ SC x WWR x SF ]
Batas Maksimum Konservasi Energi Gedung: OTTV_total <= 35 Watt/m2
- WWR (Window-to-Wall Ratio) : Luas Bukaan Kaca / Luas Total Fasad (Rekomendasi Tropis: 20% - 30%)
- SC (Shading Coefficient)   : Koefisien peneduh kaca Low-E + tritisan overhang / secondary skin

2. RUMUS REGULASI INTENSITAS PEMANFAATAN RUANG (TATA KOTA):
- Luas Lantai Dasar Maks (m2)   = KDB (%) x Luas Lahan Total (m2)
- Total Luas Seluruh Lantai (m2)= KLB     x Luas Lahan Total (m2)
- Luas Ruang Terbuka Hijau (m2) = KDH (%) x Luas Lahan Total (m2)
- Syarat Ventilasi Alami (SNI)  : Luas bukaan ventilasi bersih >= 5% - 10% dari luas lantai ruang`,
    workflowSteps: [
      "Tahap 1 (Analisis Lintasan Matahari & Mawar Angin): Petakan diagram Sun-Path dan arah angin dominan tahunan untuk mengorientasikan sisi memanjang bangunan menghadap Utara-Selatan.",
      "Tahap 2 (Kalkulasi Kapasitas Tapak KDB, KLB, KDH): Hitung batas tapak lantai dasar maksimum, total luas lantai, sempadan pantai/sungai, dan alokasi area resapan hijau.",
      "Tahap 3 (Rekayasa Selubung Pasif & Sun-Shading): Rancang lebar tritisan atap (overhang), kisi-kisi fasad ganda (secondary skin), dan rasio jendela (WWR) agar nilai OTTV berada di bawah 35 W/m2.",
      "Tahap 4 (Desain Sirkulasi Udara Silang & Pencahayaan Alami): Tempatkan bukaan inlet di sisi tekanan angin positif dan outlet di sisi berlawanan dengan target iluminasi alami ruang kerja 250-300 Lux.",
      "Tahap 5 (Audit Struktur Portal Tahan Gempa): Pastikan denah simetris/kompak, gunakan ikatan sloof-kolom-ringbalk yang menerus, dan terapkan manajemen air hujan Zero Run-Off (sumur resapan).",
    ],
    pitfalls: [
      {
        mistake:
          "Menempatkan fasad kaca penuh (Curtain Wall WWR > 70%) menghadap langsung ke arah Barat tanpa sirip peneduh (shading) sehingga nilai OTTV melonjak di atas 65 W/m2.",
        expertSolution:
          "Minimalkan bukaan kaca di sisi Barat/Timur (tempatkan ruang servis/tangga/toilet di sisi Barat) atau pasang sirip peneduh vertikal/horizontal dan kaca Low-E.",
      },
      {
        mistake:
          "Membuat jendela besar hanya pada satu sisi dinding ruang (Single-Sided Ventilation) sehingga angin tidak dapat mengalir melintasi ruangan.",
        expertSolution:
          "Rancang bukaan pada dua sisi dinding yang berhadapan atau bersilangan (Cross Ventilation) disertai bukaan atas (jalusi/stack effect) untuk membuang udara panas di bawah plafon.",
      },
      {
        mistake:
          "Membangun kolom lantai dasar yang ramping namun menopang dinding masif berat di lantai atas (Soft Story Mechanism) yang sangat rawan runtuh saat gempa bumi.",
        expertSolution:
          "Jaga kekakuan struktur merata dari pondasi hingga atap, hindari perubahan kekakuan mendadak antar-lantai, dan patuhi rasio kapasitas kolom-balok SNI 1726.",
      },
    ],
    pdf: {
      id: "pdf-ars-03",
      title:
        "Buku Ajar & Praktikum: Sistem Struktur Tahan Gempa SNI 1726:2019 & Perencanaan Tata Ruang Wilayah (KDB, KLB, KDH)",
      filename:
        "MODUL-ARS-03-Struktur-Tahan-Gempa-SNI1726-dan-Tata-Ruang-KDB-KLB-KDH.pdf",
      folderPath: "public/pustaka-modul/04-arsitektur/",
      fileUrl:
        "/pustaka-modul/04-arsitektur/MODUL-ARS-03-Struktur-Tahan-Gempa-SNI1726-dan-Tata-Ruang-KDB-KLB-KDH.pdf",
      certStandard: "SNI 1726:2019 & Regulasi Tata Ruang Wilayah",
      externalSourceUrl: "https://simbg.pu.go.id/",
    },
  },

  // 05 - KESEHATAN
  "kes-anatomi": {
    courseId: "kes-anatomi",
    fieldId: "kesehatan",
    theoryFoundation:
      "Ilmu Biomedik Dasar, Pengkajian Tanda-Tanda Vital (TTV), dan Kegawatdaruratan BTCLS merupakan kompetensi penyelamatan nyawa yang diujikan secara ketat pada Uji Kompetensi Nasional (UKOM). Perubahan fisiologis pada frekuensi napas (RR), saturasi oksigen (SpO2), frekuensi nadi (HR), tekanan darah (TD/MAP), suhu tubuh, dan tingkat kesadaran (GCS / AVPU) merupakan sinyal peringatan dini terjadinya hipoksia jaringan, syok hipovolemik/septik, atau dekompensasi kardiopulmoner.",
    architectureMechanism:
      "Dalam kondisi gawat darurat pra-rumah sakit maupun IGD, tenaga kesehatan menggunakan sistem Triase START (Simple Triage and Rapid Treatment) untuk memilah prioritas penanganan korban dalam waktu < 60 detik berdasarkan 4 parameter: kemampuan berjalan, patensi jalan napas & frekuensi pernapasan, waktu pengisian kapiler (CRT) / nadi radialis, serta respons neurologis mengikuti perintah. Apabila ditemukan pasien henti jantung (tidak sadar, tidak bernapas/gasping, nadi karotis tidak teraba dalam <= 10 detik), algoritma Bantuan Hidup Dasar (BHD AHA) mewajibkan kompresi dada berkualitas tinggi (30:2).",
    technicalReferenceTitle:
      "REFERENSI TTV, RUMUS MAP, SKORING GCS, TRIASE START & ALGORITMA RJP (BTCLS/UKOM)",
    technicalReferenceCode: `1. RUMUS HEMODINAMIK & PENILAIAN KESADARAN GLASGOW COMA SCALE (GCS 3 - 15):
- Mean Arterial Pressure (MAP) = [ Tekanan Sistolik + (2 x Tekanan Diastolik) ] / 3
  (Nilai Normal: 70 - 100 mmHg | Batas Kritis Perfusi OrganVital / Syok: MAP < 65 mmHg)
- GCS Eye (E1-E4)    : 4 Spontan | 3 Terhadap Suara | 2 Terhadap Nyeri | 1 Tidak Ada Respons
- GCS Verbal (V1-V5) : 5 Orientasi Baik | 4 Bingung | 3 Kata Tak Tepat | 2 Erangan | 1 Tidak Ada
- GCS Motorik (M1-M6): 6 Ikut Perintah | 5 Lokalisir Nyeri | 4 Menghindar | 3 Fleksi | 2 Ekstensi | 1 Nihil

2. PROTOKOL HIGH-QUALITY CPR DEWASA (AHA GUIDELINES) & TRIASE START:
- Rasio Kompresi : Ventilasi = 30 Kompresi : 2 Napas Buatan (1 atau 2 Penolong Dewasa)
- Kecepatan & Kedalaman      = 100 - 120 kali/menit | Kedalaman 5 - 6 cm | Full Chest Recoil
- Label MERAH (Immediate/P1) = RR > 30x/mnt, atau CRT > 2 dtk (Nadi radial -), atau gagal ikut perintah
- Label KUNING (Delayed/P2)  = Tidak bisa jalan, namun RR <= 30x/mnt, CRT <= 2 dtk, sadar ikut perintah`,
    workflowSteps: [
      "Tahap 1 (3A - Aman Diri, Aman Lingkungan, Aman Pasien): Gunakan Alat Pelindung Diri (APD sarung tangan medis/masker) dan pastikan lokasi bebas bahaya sebelum menyentuh korban.",
      "Tahap 2 (Primary Survey ABCDE & Cek Respons): Tepuk bahu korban untuk menilai kesadaran (AVPU/GCS), periksa napas dan raba nadi karotis secara simultan maksimal 10 detik.",
      "Tahap 3 (Aktivasi Code Blue & RJP Berkualitas Tinggi): Jika nadi karotis tidak teraba, panggil bantuan + AED, lalu mulai kompresi dada 30:2 di setengah bawah sternum dengan kedalaman 5-6 cm.",
      "Tahap 4 (Manajemen Jalan Napas & Oksigenasi): Buka jalan napas dengan Head-Tilt Chin-Lift (atau Jaw Thrust bila dicurigai cedera servikal) dan berikan terapi oksigen sesuai target saturasi SpO2.",
      "Tahap 5 (Secondary Survey, Pengukuran TTV & Evaluasi NEWS2): Ukur TD, nadi, napas, suhu, hitung nilai MAP serta skor NEWS2, lalu dokumentasikan di lembar observasi klinis.",
    ],
    pitfalls: [
      {
        mistake:
          "Melakukan manuver Head-Tilt Chin-Lift (menengadahkan kepala) pada korban kecelakaan lalu lintas dengan kecurigaan patah tulang leher (trauma servikal).",
        expertSolution:
          "Wajib gunakan teknik Jaw Thrust (mendorong sudut rahang bawah ke depan tanpa menengadahkan leher) disertai pemasangan Cervical Collar untuk melindungi medula spinalis.",
      },
      {
        mistake:
          "Memeriksa nadi pada pasien tidak sadar lebih dari 10 detik atau memeriksa nadi perifer (radialis) saat menentukan henti jantung.",
        expertSolution:
          "Periksa nadi sentral (Arteri Karotis pada dewasa/anak atau Arteri Brakialis pada bayi) bersamaan dengan melihat pergerakan dada dalam waktu maksimal 10 detik.",
      },
      {
        mistake:
          "Menganggap pernapasan megap-megap tidak teratur (Agonal Gasping) sebagai napas normal sehingga menunda pelaksanaan RJP.",
        expertSolution:
          "Agonal gasping adalah tanda klasik henti jantung mendadak; perlakukan sama seperti pasien tidak bernapas dan segera mulai kompresi dada.",
      },
    ],
    pdf: {
      id: "pdf-kes-01",
      title:
        "Buku Ajar & Praktikum: Pemeriksaan Tanda Vital, Early Warning Score (NEWS2), Triase START & BHD/RJP (Standar UKOM & BTCLS)",
      filename:
        "MODUL-KES-01-Pemeriksaan-TTV-NEWS2-Triase-START-dan-BHD-RJP-BTCLS.pdf",
      folderPath: "public/pustaka-modul/05-kesehatan/",
      fileUrl:
        "/pustaka-modul/05-kesehatan/MODUL-KES-01-Pemeriksaan-TTV-NEWS2-Triase-START-dan-BHD-RJP-BTCLS.pdf",
      certStandard: "UKOM Nasional & BTCLS (Basic Trauma Cardiac Life Support)",
      externalSourceUrl:
        "https://www.who.int/publications/i/item/9789241598620",
    },
  },

  "kes-dasar": {
    courseId: "kes-dasar",
    fieldId: "kesehatan",
    theoryFoundation:
      "Keperawatan Dasar, Pencegahan dan Pengendalian Infeksi (PPI), serta Enam Sasaran Keselamatan Pasien (SKP) merupakan fondasi mutu pelayanan rumah sakit terakreditasi. Infeksi terkait pelayanan kesehatan (Healthcare-Associated Infections / HAIs seperti Phlebitis, ISK kateter, dan VAP) dicegah melalui pemutusan rantai penularan kuman menggunakan Kewaspadaan Standar (5 Moments for Hand Hygiene WHO, sterilisasi alat, dan pemilahan limbah tajam/infeksius).",
    architectureMechanism:
      "Dalam kolaborasi interprofesional antara perawat, apoteker, dan dokter, kesalahan medis akibat miskomunikasi saat operan jaga (handover) atau pelaporan kondisi kritis via telepon dicegah dengan protokol komunikasi terstruktur SBAR (Situation, Background, Assessment, Recommendation) serta konfirmasi TBAK (Tulis, Baca Ulang / Read-Back, dan Konfirmasi).",
    technicalReferenceTitle:
      "ENAM SASARAN KESELAMATAN PASIEN (SKP), 5 MOMEN CUCI TANGAN WHO & PROTOKOL SBAR",
    technicalReferenceCode: `1. ENAM SASARAN KESELAMATAN PASIEN (STANDAR AKREDITASI RS KEMENKES & JCI):
- SKP 1 : Mengidentifikasi pasien dengan tepat (Minimal 2 identitas: Nama Lengkap & Tgl Lahir / No RM)
- SKP 2 : Meningkatkan komunikasi efektif (Metode SBAR saat lapor & TBAK / Read-Back saat instruksi lisan)
- SKP 3 : Meningkatkan keamanan obat yang perlu diwaspadai (High-Alert Medications, Elektrolit Pekat, LASA)
- SKP 4 : Memastikan tepat-lokasi, tepat-prosedur, dan tepat-pasien sebelum tindakan operasi (Surgical Time-Out)
- SKP 5 : Mengurangi risiko infeksi terkait pelayanan kesehatan (5 Moments for Hand Hygiene WHO)
- SKP 6 : Mengurangi risiko cedera pasien akibat terjatuh (Asesmen Skala Jatuh Morse / Humpty Dumpty)

2. LIMA MOMEN CUCI TANGAN (5 MOMENTS FOR HAND HYGIENE WHO):
(1) Sebelum menyentuh pasien, (2) Sebelum tindakan aseptik, (3) Setelah risiko paparan cairan tubuh,
(4) Setelah menyentuh pasien, (5) Setelah menyentuh lingkungan sekitar pasien.`,
    workflowSteps: [
      "Tahap 1 (Verifikasi Identitas Ganda Aktif): Tanyakan nama lengkap dan tanggal lahir kepada pasien secara terbuka sambil mencocokkannya dengan gelang identitas dan rekam medis sebelum tindakan apa pun.",
      "Tahap 2 (Pelaksanaan Hand Hygiene 6 Langkah): Lakukan cuci tangan dengan Handrub berbasis alkohol (20-30 detik) atau sabun dan air mengalir (40-60 detik) sesuai 5 Momen WHO.",
      "Tahap 3 (Penerapan Teknik Aseptik & Steril): Bedakan prosedur bersih dan prosedur steril (seperti pemasangan kateter urine atau perawatan luka terbuka) untuk menjaga bebas mikroorganisme.",
      "Tahap 4 (Pelaporan Klinis Terstruktur SBAR): Susun data Situation, Background, Assessment terbaru sebelum menghubungi dokter penanggung jawab, lalu catat instruksi dengan prosedur TBAK.",
      "Tahap 5 (Manajemen Limbah Medis & Keselamatan Kerja): Buang jarum suntik bekas langsung ke dalam Safety Box tahan tusuk tanpa melakukan penutupan ulang jarum dengan dua tangan (No Two-Handed Recapping).",
    ],
    pitfalls: [
      {
        mistake:
          "Mengidentifikasi pasien hanya dengan menyebut nomor kamar atau nomor tempat tidur ('Pasien Kamar 12 Bed B').",
        expertSolution:
          "Nomor kamar/bed tidak pernah boleh digunakan sebagai penanda identitas karena pasien dapat berpindah ruang; wajib gunakan minimal 2 penanda unik (Nama Lengkap + Tanggal Lahir/No RM).",
      },
      {
        mistake:
          "Menutup kembali jarum suntik bekas pakai menggunakan dua tangan (two-handed recapping) yang menjadi penyebab utama tertusuk jarum (Needle Stick Injury).",
        expertSolution:
          "Buang spuit beserta jarumnya langsung ke dalam wadah Safety Box kuning, atau gunakan teknik One-Handed Scoop jika penutupan sangat terpaksa dilakukan sebelum tindakan.",
      },
      {
        mistake:
          "Menyimpan ampul elektrolit pekat (seperti KCl 7,46% atau NaCl 3%) secara bebas di troli obat bangsal rawat inap biasa.",
        expertSolution:
          "Elektrolit pekat wajib disimpan terpisah di instalasi farmasi/ruang khusus berlabel High-Alert merah dan wajib melalui pengecekan ganda (Independent Double Check) oleh dua nakes.",
      },
    ],
    pdf: {
      id: "pdf-kes-02",
      title:
        "Buku Ajar & Praktikum: Enam Sasaran Keselamatan Pasien (SKP), Pencegahan Infeksi (PPI), Komunikasi SBAR & Asuhan Caregiver",
      filename:
        "MODUL-KES-02-Keselamatan-Pasien-SKP-Pencegahan-Infeksi-SBAR-dan-Caregiver.pdf",
      folderPath: "public/pustaka-modul/05-kesehatan/",
      fileUrl:
        "/pustaka-modul/05-kesehatan/MODUL-KES-02-Keselamatan-Pasien-SKP-Pencegahan-Infeksi-SBAR-dan-Caregiver.pdf",
      certStandard: "Standar Akreditasi RS Kemenkes & BNSP Caregiver Q.86.CGL",
      externalSourceUrl:
        "https://www.who.int/teams/integrated-health-services/patient-safety",
    },
  },

  "kes-komunitas": {
    courseId: "kes-komunitas",
    fieldId: "kesehatan",
    theoryFoundation:
      "Asuhan Keperawatan Gerontik (Caregiver), Farmakologi Klinis, dan Kesehatan Komunitas menuntut ketelitian tinggi dalam penghitungan dosis obat, pengaturan laju terapi cairan intravena, serta pencegahan komplikasi imobilisasi jangka panjang pada pasien lanjut usia. Pada pasien lansia yang mengalami tirah baring lama (bedridden), tekanan mekanis terus-menerus pada area tonjolan tulang (sakrum, trokanter, tumit) menghambat aliran darah kapiler dan memicu nekrosis jaringan (ulkus dekubitus / pressure injury).",
    architectureMechanism:
      "Dalam pemberian medikasi dan terapi cairan infus, tenaga kesehatan menerapkan prinsip 7 Benar Pemberian Obat disertai perhitungan matematis yang presisi. Kecepatan tetesan infus per menit (tpm / gtt/min) ditentukan oleh volume cairan total (mL), faktor tetes set infus (Makrodrip 20 tetes/mL untuk dewasa atau Mikrodrip 60 tetes/mL untuk anak/geriatri dengan pembatasan cairan), serta durasi waktu pemberian dalam satuan menit.",
    technicalReferenceTitle:
      "RUMUS KALKULASI DOSIS OBAT, LAJU TETES INFUS & PENCEGAHAN DEKUBITUS CAREGIVER",
    technicalReferenceCode: `1. RUMUS PERHITUNGAN DOSIS OBAT & KECEPATAN TETESAN INFUS (STANDAR UKOM):
- Volume Obat Suntik (mL)   = [ Dosis Instruksi (mg) / Dosis Sediaan Tersedia (mg) ] x Pelarut (mL)
- Tetesan Infus (tpm / gtt) = [ Volume Cairan (mL) x Faktor Tetes (tetes/mL) ] / [ Waktu (Jam) x 60 ]
  * Faktor Tetes Makrodrip = 20 tetes/mL (atau 15 tetes/mL) | Mikrodrip = 60 tetes/mL

2. PROTOKOL ASUHAN CAREGIVER LANSIA & PENCEGAHAN LUKA TEKAN (DEKUBITUS):
- Alih Baring Berkala       : Ubah posisi tidur (miring kanan - terlentang - miring kiri) setiap 2 jam
- Pengkajian Risiko Braden  : Evaluasi persepsi sensori, kelembapan kulit, aktivitas, mobilitas, dan nutrisi
- Posisi Pemberian Makan/NGT: Tinggikan kepala tempat tidur 30 - 45 derajat (Semi-Fowler) selama makan
                              dan pertahankan minimal 30 menit pasca-makan untuk mencegah aspirasi paru`,
    workflowSteps: [
      "Tahap 1 (Verifikasi 7 Benar Medikasi): Periksa Benar Pasien, Benar Obat, Benar Dosis, Benar Rute, Benar Waktu, Benar Informasi, dan Benar Dokumentasi beserta tanggal kedaluwarsa obat.",
      "Tahap 2 (Perhitungan & Double-Check Dosis/Infus): Hitung volume pengenceran vial atau tetesan infus per menit secara tertulis, lalu lakukan verifikasi silang untuk obat berisiko tinggi.",
      "Tahap 3 (Pengkajian Fungsional & Risiko Lansia): Nilai kemandirian aktivitas harian (Indeks Barthel/Katz), risiko jatuh (Skala Morse), dan integritas kulit (Skala Braden).",
      "Tahap 4 (Pelaksanaan Mobilisasi & Alih Baring): Lakukan jadwal alih baring per 2 jam dengan ganjalan bantal pada area tonjolan tulang serta latihan gerak sendi (Range of Motion / ROM) pasif-aktif.",
      "Tahap 5 (Edukasi Keluarga & Promosi Kesehatan Komunitas): Berikan penyuluhan kepatuhan minum obat hipertensi/diabetes dan pencegahan penyakit menular berbasis masyarakat.",
    ],
    pitfalls: [
      {
        mistake:
          "Memberikan makan/minum atau nutrisi melalui selang NGT saat pasien lansia berbaring datar (0 derajat / Supine) sehingga cairan masuk ke saluran napas (pneumonia aspirasi).",
        expertSolution:
          "Wajib posisikan pasien pada posisi Semi-Fowler atau Fowler (kepala ditinggikan 30-45 derajat) sebelum pemberian makan/NGT dan pertahankan selama 30-45 menit sesudahnya.",
      },
      {
        mistake:
          "Menggerus tablet bersalut enterik (Enteric-Coated) atau lepas lambat (Sustained-Release / SR) untuk dimasukkan ke selang NGT.",
        expertSolution:
          "Tablet salut enterik/SR tidak boleh digerus karena merusak mekanisme pelepasan obat dan dapat memicu toksisitas overdosis seketika; konsultasikan penggantian sediaan sirup/suspensi ke apoteker.",
      },
      {
        mistake:
          "Memijat kuat area kulit di atas tonjolan tulang yang sudah tampak kemerahan menetap (dekubitus derajat 1).",
        expertSolution:
          "Jangan memijat jaringan kemerahan di atas tonjolan tulang karena akan memperparah robekan kapiler bawah kulit; lakukan pembebasan tekanan (off-loading) dan jaga kelembapan kulit.",
      },
    ],
    pdf: {
      id: "pdf-kes-03",
      title:
        "Buku Ajar & Praktikum: Farmakologi Klinis, Prinsip 7 Benar Pemberian Obat, Kalkulasi Dosis & Laju Tetes Infus",
      filename:
        "MODUL-KES-03-Farmakologi-Klinis-Perhitungan-Dosis-Obat-dan-Laju-Tetes-Infus.pdf",
      folderPath: "public/pustaka-modul/05-kesehatan/",
      fileUrl:
        "/pustaka-modul/05-kesehatan/MODUL-KES-03-Farmakologi-Klinis-Perhitungan-Dosis-Obat-dan-Laju-Tetes-Infus.pdf",
      certStandard: "UKOM Keperawatan & Farmasi Klinis",
      externalSourceUrl: "https://pionas.pom.go.id/",
    },
  },

  // 06 - PENDIDIKAN
  "edu-psikologi": {
    courseId: "edu-psikologi",
    fieldId: "pendidikan",
    theoryFoundation:
      "Psikologi Perkembangan dan Diagnostik Kesulitan Belajar membekali pendidik dengan landasan ilmiah mengenai bagaimana struktur kognitif, sosio-emosional, dan neurokognitif peserta didik berkembang. Mengacu pada teori konstruktivisme kognitif Jean Piaget dan konstruktivisme sosiokultural Lev Vygotsky, proses belajar paling optimal terjadi di dalam Zone of Proximal Development (ZPD), yakni rentang tugas yang belum mampu diselesaikan siswa sendirian namun dapat dikuasai dengan bantuan terstruktur (Scaffolding).",
    architectureMechanism:
      "Karena setiap kelas terdiri dari siswa dengan kesiapan belajar (Readiness), minat (Interest), dan profil belajar (Learning Profile) yang beragam, pengajaran satu arah yang seragam (one-size-fits-all) akan membuat siswa cepat merasa bosan sementara siswa yang belum menguasai prasyarat tertinggal jauh. Kerangka Pembelajaran Berdiferensiasi (Carol Ann Tomlinson) menyesuaikan Konten, Proses pendampingan, dan Produk unjuk kerja tanpa menurunkan standar Capaian Pembelajaran.",
    technicalReferenceTitle:
      "MATRIKS ZPD VYGOTSKY, DIFERENSIASI PEMBELAJARAN & DIAGNOSTIK KESULITAN BELAJAR",
    technicalReferenceCode: `1. TAHAPAN SCAFFOLDING DALAM ZONE OF PROXIMAL DEVELOPMENT (VYGOTSKY):
- Tahap 1 (I Do - Modeling)    : Pendidik mendemonstrasikan langkah berpikir & penyelesaian masalah secara eksplisit
- Tahap 2 (We Do - Guided)     : Praktik terbimbing kolaboratif dengan bantuan kerangka kerja / lembar kerja
- Tahap 3 (You Do Together)    : Diskusi kelompok sebaya (Peer Tutoring) dengan umpan balik formatif
- Tahap 4 (You Do Alone)       : Bantuan dilepas bertahap (Fading) hingga siswa mencapai penguasaan mandiri

2. TIGA PILAR PEMBELAJARAN BERDIFERENSIASI (KURIKULUM MERDEKA):
- Diferensiasi Konten : Penyesuaian tingkat kompleksitas bahan ajar & moda representasi (teks/visual/simulasi)
- Diferensiasi Proses : Variasi intensitas bimbingan (Coaching intensif bagi yang belum siap vs eksplorasi mandiri)
- Diferensiasi Produk : Pilihan bentuk karya akhir yang tetap diukur dengan rubrik kompetensi yang setara`,
    workflowSteps: [
      "Tahap 1 (Asesmen Diagnostik Kognitif & Non-Kognitif Awal): Petakan penguasaan materi prasyarat, kesejahteraan psikologis, dan preferensi belajar siswa sebelum memulai bab baru.",
      "Tahap 2 (Pengelompokan Fleksibel Berdasarkan Kesiapan): Bagi siswa ke dalam kelompok kesiapan (Perlu Bimbingan Dasar, Siap Berkembang, dan Mahir) yang bersifat dinamis.",
      "Tahap 3 (Penerapan Strategi Scaffolding Berjenjang): Sediakan pemandu langkah (graphic organizer / worked example) bagi kelompok dasar dan tantangan analisis studi kasus bagi kelompok mahir.",
      "Tahap 4 (Observasi Formatif & Deteksi Miskonsepsi): Pantau proses kerja siswa secara real-time untuk mengoreksi kesalahan konsep sedini mungkin sebelum menjadi kebiasaan.",
      "Tahap 5 (Refleksi Metakognitif Peserta Didik): Ajak siswa mengevaluasi strategi belajar mereka sendiri (apa yang sudah dikuasai, bagian mana yang masih sulit, dan rencana tindak lanjut).",
    ],
    pitfalls: [
      {
        mistake:
          "Mengartikan Pembelajaran Berdiferensiasi sebagai keharusan membuat 30 RPP/Modul Ajar yang berbeda untuk 30 siswa di dalam kelas.",
        expertSolution:
          "Diferensiasi bukan individualisasi ekstrem, melainkan pengelompokan strategis (3 tingkat kesiapan atau pilihan moda produk) dalam satu alur Modul Ajar yang terpadu.",
      },
      {
        mistake:
          "Memberikan soal tambahan yang jauh lebih banyak kepada siswa yang selesai lebih cepat (yang justru terasa seperti hukuman bagi siswa berprestasi).",
        expertSolution:
          "Berikan pengayaan berorientasi kedalaman berpikir (Enrichment HOTS / proyek eksplorasi kontekstual), bukan sekadar menambah kuantitas soal rutin yang sama.",
      },
      {
        mistake:
          "Melabeli siswa yang lambat memahami konsep abstrak sebagai 'kurang cerdas' tanpa memeriksa apakah materi prasyarat fondasinya sudah tuntas.",
        expertSolution:
          "Lakukan diagnostik pohon prasyarat belajar dan gunakan media konkret/visual jembatan sebelum masuk ke simbol abstrak.",
      },
    ],
    pdf: {
      id: "pdf-edu-01",
      title:
        "Buku Ajar & Praktikum: Psikologi Perkembangan Peserta Didik, Scaffolding Vygotsky (ZPD) & Pembelajaran Berdiferensiasi",
      filename:
        "MODUL-EDU-01-Psikologi-Perkembangan-Vygotsky-ZPD-dan-Diferensiasi-Belajar.pdf",
      folderPath: "public/pustaka-modul/06-pendidikan/",
      fileUrl:
        "/pustaka-modul/06-pendidikan/MODUL-EDU-01-Psikologi-Perkembangan-Vygotsky-ZPD-dan-Diferensiasi-Belajar.pdf",
      certStandard: "UKMPPG Kemendikdasmen & BNSP Metodologi Pelatihan",
      externalSourceUrl: "https://guru.kemendikdasmen.go.id/",
    },
  },

  "edu-pedagogi": {
    courseId: "edu-pedagogi",
    fieldId: "pendidikan",
    theoryFoundation:
      "Desain Kurikulum Merdeka dan Metodologi Pelatihan Kerja (standar BNSP N.78SPS02 & Google Certified Educator) menerapkan prinsip Backward Design (Understanding by Design / UbD) yang dikembangkan oleh Grant Wiggins dan Jay McTighe. Perancang kurikulum tidak memulai dari daftar bab buku teks atau aktivitas permainan kelas, melainkan menetapkan Tujuan Akhir (Desired Results), dilanjutkan dengan merancang Bukti Asesmen Autentik (Acceptable Evidence), baru kemudian menyusun Langkah Pembelajaran (Learning Plan).",
    architectureMechanism:
      "Dalam pengintegrasian teknologi ke dalam pengajaran, kerangka kerja TPACK (Technological Pedagogical Content Knowledge) menuntut keseimbangan antara penguasaan materi keilmuan (Content), metode pengajaran aktif seperti Project-Based Learning / PjBL (Pedagogy), dan pemanfaatan perangkat digital interaktif (Technology). Seluruh indikator Tujuan Pembelajaran dirumuskan menggunakan Kata Kerja Operasional (KKO) Taksonomi Bloom Revisi yang terukur dari C1-C3 menuju level berpikir tingkat tinggi HOTS (C4 Menganalisis, C5 Mengevaluasi, C6 Mencipta).",
    technicalReferenceTitle:
      "KERANGKA BACKWARD DESIGN (UbD), TAKSONOMI BLOOM REVISI & SINTAKS PjBL (BNSP N.78SPS02)",
    technicalReferenceCode: `1. TIGA TAHAP PERANCANGAN MODUL AJAR BACKWARD DESIGN (UbD):
Tahap 1 (Identify Desired Results)   : Turunkan Capaian Pembelajaran (CP) menjadi Tujuan Pembelajaran (TP)
Tahap 2 (Determine Assessment)       : Susun instrumen tugas performa autentik & Rubrik Analitik SEBELUM aktivitas
Tahap 3 (Plan Learning Experiences)  : Rancang alur kegiatan kelas (Pendahuluan, Inti PjBL/PBL, Penutup)

2. ENAM SINTAKS BAKU PROJECT-BASED LEARNING (PjBL):
(1) Pertanyaan Mendasar (Essential Question) -> (2) Desain Perencanaan Proyek -> (3) Penyusunan Jadwal Milestones
-> (4) Pemantauan Kemajuan Proyek (Monitoring) -> (5) Pengujian Hasil & Presentasi -> (6) Evaluasi Pengalaman`,
    workflowSteps: [
      "Tahap 1 (Analisis Capaian Pembelajaran & Unit Kompetensi): Bedah elemen kompetensi yang harus dikuasai peserta didik/asesi di akhir fase pembelajaran.",
      "Tahap 2 (Perumusan Tujuan Pembelajaran Berformat ABCD): Tuliskan kalimat tujuan yang memuat Audience, Behavior (KKO spesifik C4-C6), Condition, dan Degree ketuntasan.",
      "Tahap 3 (Perancangan Asesmen Performa & Rubrik): Buat tugas unjuk kerja nyata beserta rubrik penilaian sebelum merancang slide presentasi atau aktivitas harian.",
      "Tahap 4 (Penyusunan Skenario PjBL & Integrasi TPACK): Pilih media teknologi interaktif yang relevan untuk membantu siswa melakukan eksperimen dan kolaborasi proyek.",
      "Tahap 5 (Uji Keterbacaan & Evaluasi Pasca-Mengajar): Lakukan refleksi efektivitas modul ajar berdasarkan ketercapaian indikator siswa.",
    ],
    pitfalls: [
      {
        mistake:
          "Menggunakan kata kerja tidak terukur seperti 'Memahami' atau 'Mengetahui' sebagai indikator penilaian di dalam RPP/Modul Ajar.",
        expertSolution:
          "Gunakan Kata Kerja Operasional (KKO) yang dapat diamati dan diukur secara objektif seperti 'Mengklasifikasikan (C3)', 'Mendiagnosis (C4)', 'Membandingkan (C5)', atau 'Merancang (C6)'.",
      },
      {
        mistake:
          "Menyusun soal ujian atau rubrik penilaian paling akhir setelah seluruh jam pelajaran selesai sehingga materi yang diajarkan tidak selaras dengan yang diujikan.",
        expertSolution:
          "Terapkan prinsip Backward Design: tetapkan instrumen asesmen tepat setelah merumuskan Tujuan Pembelajaran agar seluruh kegiatan belajar terarah (Constructive Alignment).",
      },
      {
        mistake:
          "Menggunakan aplikasi teknologi digital sekadar untuk memindahkan buku cetak ke layar PDF tanpa mengubah metode ceramah satu arah (hanya level Substitution pada model SAMR).",
        expertSolution:
          "Gunakan teknologi pada level Modification/Redefinition untuk memungkinkan simulasi interaktif, kolaborasi data real-time, dan umpan balik instan.",
      },
    ],
    pdf: {
      id: "pdf-edu-02",
      title:
        "Buku Ajar & Praktikum: Perancangan Kurikulum Backward Design (UbD), Taksonomi Bloom Revisi (HOTS) & Rubrik Asesmen Autentik",
      filename:
        "MODUL-EDU-02-Backward-Design-UbD-Modul-Ajar-Taksonomi-Bloom-dan-Rubrik-Asesmen.pdf",
      folderPath: "public/pustaka-modul/06-pendidikan/",
      fileUrl:
        "/pustaka-modul/06-pendidikan/MODUL-EDU-02-Backward-Design-UbD-Modul-Ajar-Taksonomi-Bloom-dan-Rubrik-Asesmen.pdf",
      certStandard: "BNSP Metodologi Pelatihan (N.78SPS02) & Google Certified Educator",
      externalSourceUrl: "https://kurikulum.kemendikdasmen.go.id/",
    },
  },

  "edu-karier": {
    courseId: "edu-karier",
    fieldId: "pendidikan",
    theoryFoundation:
      "Evaluasi Pembelajaran, Asesmen Kompetensi, dan Bimbingan Karier berfokus pada pengukuran objektif kualitas instrumen tes (Validitas, Reliabilitas, Tingkat Kesukaran, dan Daya Pembeda) serta pendampingan psikologis peserta didik dalam merencanakan masa depan akademik/vokasional. Dalam konseling karier, teori heksagonal John Holland (RIASEC) memetakan keselarasan (congruence) antara tipe kepribadian individu dengan karakteristik tuntutan lingkungan kerja.",
    architectureMechanism:
      "Ketika mendampingi siswa yang memperoleh skor tes di bawah ambang batas atau mengalami ketidaksesuaian antara minat alami dengan jurusan tujuan, konselor menerapkan pendekatan Person-Centered Counseling (Carl Rogers) dan Cognitive Restructuring. Konselor menggunakan teknik Active Listening, Paraphrasing, dan Reflection of Feeling untuk memvalidasi emosi siswa terlebih dahulu, kemudian memfasilitasi penyusunan rencana aksi jembatan kompetensi (bridging plan) yang terukur.",
    technicalReferenceTitle:
      "RUMUS ANALISIS BUTIR SOAL (TINGKAT KESUKARAN & DAYA PEMBEDA) SERTA PEMETAAN RIASEC",
    technicalReferenceCode: `1. RUMUS ANALISIS KUALITAS BUTIR SOAL EVALUASI PENDIDIKAN:
- Indeks Tingkat Kesukaran (P) = Jumlah Siswa Menjawab Benar (B) / Jumlah Total Peserta Tes (JS)
  * Kriteria P: 0.00 - 0.30 (Soal Sukar) | 0.31 - 0.70 (Soal Sedang / Ideal) | 0.71 - 1.00 (Soal Mudah)
- Indeks Daya Pembeda (D)      = (BA / JA) - (BB / JB)
  * BA/JA = Proporsi benar kelompok atas | BB/JB = Proporsi benar kelompok bawah (Ideal: D >= 0.30)

2. ENAM DIMENSI TIPOLOGI KARIER JOHN HOLLAND (RIASEC):
- R (Realistic)    : Praktis, rekayasa mesin/jaringan, agroteknologi, lapangan
- I (Investigative): Analitis, riset ilmiah, pemrograman algoritma, diagnostik medis/lingkungan
- A (Artistic)     : Ekspresif, desain visual DKV, arsitektur, seni pertunjukan & sastra
- S (Social)       : Empatik, keguruan, keperawatan, konseling, pelayanan perhotelan
- E (Enterprising) : Kepemimpinan, manajemen bisnis, pemasaran digital, kewirausahaan
- C (Conventional) : Terstruktur, akuntansi keuangan, administrasi basis data, audit mutu`,
    workflowSteps: [
      "Tahap 1 (Penyusunan Kisi-Kisi & Rubrik Analitik): Petakan distribusi indikator soal dan susun rubrik berskala deskriptif (Skor 1-4) agar penilaian antar-penguji konsisten (inter-rater reliability).",
      "Tahap 2 (Analisis Empiris Butir Soal): Hitung indeks kesukaran (P), daya pembeda (D), dan efektivitas pengecoh (distractor) untuk merevisi soal yang cacat.",
      "Tahap 3 (Pemetaan Profil Bakat & Minat RIASEC): Analisis dua atau tiga kode huruf dominan siswa (misal I-R-C atau A-S-E) dan bandingkan dengan tuntutan mata kuliah jurusan tujuan.",
      "Tahap 4 (Sesi Konseling Empatik & Refleksi): Bangun rapport tanpa menghakimi, gunakan pertanyaan terbuka, dan bantu siswa mengenali kekuatan transferabel yang dimilikinya.",
      "Tahap 5 (Kontrak Belajar & Pemantauan Remedial): Tetapkan target mingguan yang spesifik (SMART Goals) mencakup penyelesaian modul materi dan simulasi sertifikasi.",
    ],
    pitfalls: [
      {
        mistake:
          "Menggunakan Rubrik Holistik yang hanya memberikan satu angka nilai akhir pada asesmen formatif sehingga siswa tidak tahu bagian mana yang harus diperbaiki.",
        expertSolution:
          "Gunakan Rubrik Analitik yang merinci kriteria per komponen (misal ketepatan konsep, kerapian teknis, analisis kasus) agar umpan balik perbaikan bersifat spesifik.",
      },
      {
        mistake:
          "Langsung mendikte atau menasihati siswa di menit pertama sesi konseling sebelum mendengarkan dan memvalidasi kecemasan yang dirasakan siswa.",
        expertSolution:
          "Terapkan keterampilan Attending dan Reflection of Feeling terlebih dahulu hingga siswa merasa dipahami, baru masuk ke tahap eksplorasi alternatif solusi.",
      },
      {
        mistake:
          "Mempertahankan butir soal ujian yang memiliki Indeks Daya Pembeda (D) bernilai negatif (di mana siswa kelompok pintar justru banyak menjawab salah).",
        expertSolution:
          "Butir soal dengan nilai D negatif menandakan kunci jawaban salah atau kalimat soal ambigu; soal tersebut wajib dibuang atau ditulis ulang.",
      },
    ],
    pdf: {
      id: "pdf-edu-03",
      title:
        "Buku Ajar & Praktikum: Teknik Konseling Empatik, Pemetaan Minat Karier Holland RIASEC & Pendidikan Inklusif (PPI)",
      filename:
        "MODUL-EDU-03-Teknik-Konseling-Empatik-Holland-RIASEC-dan-Pendidikan-Inklusif.pdf",
      folderPath: "public/pustaka-modul/06-pendidikan/",
      fileUrl:
        "/pustaka-modul/06-pendidikan/MODUL-EDU-03-Teknik-Konseling-Empatik-Holland-RIASEC-dan-Pendidikan-Inklusif.pdf",
      certStandard: "Standar Kompetensi Konselor & Bimbingan Karier Nasional",
      externalSourceUrl:
        "https://www.onetonline.org/find/descriptor/browse/1.B.1",
    },
  },

  // 07 - BUDAYA
  "bud-karawitan": {
    courseId: "bud-karawitan",
    fieldId: "budaya",
    theoryFoundation:
      "Seni Pertunjukan Tradisi Nusantara (Tari, Karawitan, dan Pedalangan Bali sesuai standar BNSP R.90000) berdiri di atas kesatuan struktur teknik gerak, sistem tangga nada akustik gamelan (Laras Pelog dan Laras Slendro), serta filosofi sakralitas ruang. Dalam estetika tari Bali, mutu penyajian diukur melalui integrasi empat unsur: Agem (sikap dasar tubuh yang kokoh dan asimetris), Tandang (mekanisme perpindahan langkah dan transisi gerak), Tangkis (kekayaan variasi motif gerak tangan/jari), dan Tangkep (ekspresi mimik wajah dan ketajaman sorot mata seledet).",
    architectureMechanism:
      "Pada seni karawitan Bali, orkestrasi Gamelan Gong Kebyar maupun Semar Pagulingan menggunakan sistem Laras Pelog (5 nada: Panca Nada atau 7 nada: Sapta Nada dengan urutan ding-dong-deng-dung-dang) dan Laras Slendro (seperti pada Gamelan Angklung 4 nada dan Gender Wayang 5 nada untuk iringan pertunjukan Wayang Kulit Parwa). Sinkronisasi dinamis antara aksen gerak penari (angsel) dengan pukulan kendang, ceng-ceng, dan kajar membutuhkan ketepatan Wirama dan penghayatan Wirasa (Taksu).",
    technicalReferenceTitle:
      "TAKSONOMI TARI BALI (UNESCO), STRUKTUR TEKNIK GERAK & SISTEM LARAS GAMELAN (BNSP R.90000)",
    technicalReferenceCode: `1. KLASIFIKASI TIGA GENRE TARI BALI (PIAGAM SASANA BUDAYA 1971 & UNESCO):
- Tari Wali (Sakral - Jeroan Pura)      : Rejang Dewa, Sanghyang Dedari, Baris Gede, Pendet Sakral
- Tari Bebali (Upacara - Jaba Tengah)   : Dramatari Gambuh, Topeng Sidhakarya, Wayang Wong
- Tari Balih-Balihan (Apresiasi Publik) : Kebyar Duduk, Oleg Tamulilingan, Legong Kraton, Janger

2. EMPAT KOMPONEN EVALUasi KOMPETENSI PENYAJI TARI & KARAWITAN:
- Wiraga (Agem, Tandang, Tangkis) : Ketepatan proporsi sudut tubuh, kelenturan, dan stamina fisik
- Wirama (Musikalitas & Angsel)   : Presisi jatuhnya gerak dengan ketukan Kajar, Kendang, dan Gong
- Wirasa (Tangkep & Taksu)        : Penghayatan karakter tokoh (Halus, Keras/Krodha, Banyol)
- Struktur Komposisi Gending      : Kawitan (Introduksi) -> Pengawak (Bagian Pokok) -> Pengecet (Penutup)`,
    workflowSteps: [
      "Tahap 1 (Pemanasan Anatomi & Latihan Sikap Agem): Lakukan olah tubuh kelenturan sendi bahu, pergelangan tangan, dan lutut untuk membentuk postur Agem Putra/Putri yang stabil.",
      "Tahap 2 (Penguasaan Motif Tandang, Tangkis & Tangkep): Latih koordinasi gerak leher (ngelier), mata (nyeledet), dan jari tangan (ngeruji/ngiting) secara terpisah maupun terpadu.",
      "Tahap 3 (Analisis Struktur Gending & Sinyal Angsel): Pelajari pola pukulan pemangku irama (Kajar dan Kendang) untuk mengenali aba-aba perubahan tempo dan koda angsel.",
      "Tahap 4 (Pendalaman Karakter Dramaturgi / Wirasa): Bedah latar belakang kisah epos (Ramayana/Mahabharata/Panji) agar ekspresi wajah mencerminkan psikologi tokoh yang dibawakan.",
      "Tahap 5 (Gladi Resik Panggung & Etika Pementasan): Sesuaikan komposisi pola lantai (blocking) dengan dimensi panggung serta patuhi etika batas antara seni sakral dan komersial.",
    ],
    pitfalls: [
      {
        mistake:
          "Menampilkan tarian sakral kategori Tari Wali (seperti Tari Sanghyang atau Topeng Sidhakarya lengkap dengan banten sakral) sebagai hiburan makan malam komersial di restoran/hotel.",
        expertSolution:
          "Patuhi Perda Provinsi Bali dan etika budaya: hanya sajikan repertoar kategori Tari Balih-Balihan untuk acara hiburan wisata komersial guna menjaga kesucian warisan budaya.",
      },
      {
        mistake:
          "Hanya menghafal urutan koreografi fisik (Wiraga) tanpa mendengarkan ketukan instrumen Kajar sehingga gerakan mendahului atau tertinggal dari aksen gamelan (lepas Wirama).",
        expertSolution:
          "Berlatihlah dengan memfokuskan pendengaran pada ketukan dasar Kajar dan aba-aba Kendang sebagai kompas tempo utama sepanjang pementasan.",
      },
      {
        mistake:
          "Menyamakan teknik pukulan panggul tanpa melakukan penutupan bilah (ngelais/nutup) pada instrumen Gangsa/Gender sehingga suara dengung perunggu saling bertabrakan.",
        expertSolution:
          "Kuasai teknik tangan kiri menutup bilah nada sebelumnya tepat saat tangan kanan memukul bilah nada berikutnya (teknik kotekan/ubitan yang bersih).",
      },
    ],
    pdf: {
      id: "pdf-bud-01",
      title:
        "Buku Ajar & Praktikum: Estetika Seni Pertunjukan Nusantara (Wiraga, Wirama, Wirasa), Struktur Karawitan & Dramaturgi",
      filename:
        "MODUL-BUD-01-Estetika-Seni-Pertunjukan-Wiraga-Wirama-Wirasa-dan-Karawitan.pdf",
      folderPath: "public/pustaka-modul/07-budaya/",
      fileUrl:
        "/pustaka-modul/07-budaya/MODUL-BUD-01-Estetika-Seni-Pertunjukan-Wiraga-Wirama-Wirasa-dan-Karawitan.pdf",
      certStandard: "BNSP Penyaji Seni Pertunjukan & Karawitan (R.90000)",
      externalSourceUrl: "https://warisanbudaya.kemdikbud.go.id/",
    },
  },

  "bud-lontar": {
    courseId: "bud-lontar",
    fieldId: "budaya",
    theoryFoundation:
      "Filologi Lontar, Aksara Bali, dan Pelestarian Cagar Budaya (standar SKKNI Nomor 145 Tahun 2021 kode R.91CGB00 & UU No. 11 Tahun 2010) memadukan kecermatan linguistik kuno dengan sains konservasi material organik dan anorganik. Manuskrip lontar Nusantara menyimpan pengetahuan pengobatan (Usada), arsitektur (Asta Kosala Kosali), hukum adat (Awig-Awig), dan filsafat sastra (Kakawin/Parwa) yang ditulis menggunakan sistem ejaan Pasang Aksara Bali (Aksara Wreastra, Swalalita, dan Modre).",
    architectureMechanism:
      "Dari sisi konservasi fisik, lempir daun rontal (Borassus flabellifer) bersifat higroskopis sehingga rentan rapuh atau ditumbuhi jamur apabila disimpan pada kelembapan ekstrem, serta rentan dimakan serangga pengerat naskah (Lepisma saccharina). Prosedur restorasi dan pelestarian objek Cagar Budaya wajib memegang teguh prinsip Keaslian (Authenticity), Intervensi Minimum, Reversibilitas, dan Dokumentasi Objektif Ilmiah.",
    technicalReferenceTitle:
      "PROSEDUR KONSERVASI MANUSKRIP LONTAR, KAIDAH PASANG AKSARA & ZONASI CAGAR BUDAYA",
    technicalReferenceCode: `1. STANDAR OPERASIONAL KONSERVASI FISIK & DIGITALISASI NASKAH LONTAR:
- Pembersihan Kering   : Sapu debu mikro searah serat daun menggunakan kuas bulu halus kering
- Penghitaman Guratan  : Oleskan pasta minyak kemiri bakar (Tingkih) + minyak sereh wangi (Citronella)
                         secara merata lalu bersihkan sisa minyak dengan kain katun lembut bebas serat
- Parameter Penyimpanan: Suhu ruang stabil 20 C - 24 C | Kelembapan Relatif (RH) 45% - 55% dalam Kropak
- Standar Digitalisasi : Pemotretan kamera makro pencahayaan difus tanpa UV pada resolusi >= 600 DPI (RAW/TIFF)

2. SISTEM KLASIFIKASI AKSARA BALI & METODOLOGI FILOLOGI:
- Aksara Wreastra (18 Aksara Dasar ha-na-ca-ra-ka...) : Penulisan bahasa Bali lumrah sehari-hari
- Aksara Swalalita (47 Aksara)                        : Penulisan kosakata bahasa Kawi / Sanskerta
- Aksara Modre                                        : Aksara sakral rerajahan dan mantra keagamaan`,
    workflowSteps: [
      "Tahap 1 (Registrasi Kodikologi & Diagnosis Kerusakan): Catat dimensi panjang-lebar lempir, jumlah baris tulisan per halaman (recto-verso), kondisi tali pengikat (ketengkong), dan tingkat kerapuhan.",
      "Tahap 2 (Tindakan Konservasi Preventif & Kuratif): Bersihkan kotoran organik, aplikasikan campuran kemiri bakar untuk memperjelas keterbacaan aksara, dan berikan minyak atsiri sereh/cengkeh penolak serangga.",
      "Tahap 3 (Digitalisasi Arsip Beresolusi Tinggi): Lakukan pemotretan lempir demi lempir dengan color checker chart dan skala milimeter tanpa menggunakan lampu kilat (flash) langsung.",
      "Tahap 4 (Transliterasi & Kritik Teks Filologi): Alih-aksarakan teks Aksara Bali ke huruf Latin secara diplomatis maupun edisi kritis dengan mencatat varian bacaan (Apparatus Criticus).",
      "Tahap 5 (Penyusunan Kajian Pelestarian Cagar Budaya): Susun rekomendasi zonasi perlindungan (Zona Inti, Zona Penyangga, Zona Pengembangan) sesuai SKKNI No. 145 Tahun 2021.",
    ],
    pitfalls: [
      {
        mistake:
          "Mencuci lempir lontar yang berdebu menggunakan air sabun basah atau menjemurnya langsung di bawah terik matahari siang.",
        expertSolution:
          "Air dan panas matahari langsung akan membuat serat daun rontal melengkung pecah dan mengelupas; gunakan pembersihan kering dan minyak kemiri bakar tradisional di ruang teduh.",
      },
      {
        mistake:
          "Melakukan pemugaran bangunan Cagar Budaya dengan membongkar batu bata/ukiran asli lalu menggantinya dengan semen beton cetak modern.",
        expertSolution:
          "Wajib patuhi prinsip keaslian bahan (Material Authenticity) dan intervensi minimum; konsolidasi struktur harus menggunakan material yang kompatibel dan terdokumentasi.",
      },
      {
        mistake:
          "Menerjemahkan kata bahasa Kawi/Jawa Kuno di dalam lontar secara harfiah menggunakan kamus bahasa Bali modern tanpa memeriksa konteks kalimat sastra.",
        expertSolution:
          "Gunakan kamus Jawa Kuno-Indonesia (Zoetmulder) dan perhatikan metrum tembang/konteks filologis naskah agar makna filosofis tidak terdistorsi.",
      },
    ],
    pdf: {
      id: "pdf-bud-02",
      title:
        "Buku Ajar & Praktikum: Filologi Nusantara, Pasang Aksara Bali, Konservasi Manuskrip Lontar & Pelestarian Cagar Budaya",
      filename:
        "MODUL-BUD-02-Filologi-Nusantara-Transliterasi-Aksara-Bali-dan-Konservasi-Lontar.pdf",
      folderPath: "public/pustaka-modul/07-budaya/",
      fileUrl:
        "/pustaka-modul/07-budaya/MODUL-BUD-02-Filologi-Nusantara-Transliterasi-Aksara-Bali-dan-Konservasi-Lontar.pdf",
      certStandard: "SKKNI Pelestarian Cagar Budaya No. 145/2021 (R.91CGB00)",
      externalSourceUrl: "https://jdih.kemnaker.go.id/",
    },
  },

  "bud-manajemen": {
    courseId: "bud-manajemen",
    fieldId: "budaya",
    theoryFoundation:
      "Manajemen Produksi Pertunjukan, Kuratorial Pameran Budaya, dan Perlindungan Kekayaan Intelektual Komunal (KIK) menjembatani kekayaan seni tradisi dengan tata kelola industri kreatif profesional. Sebuah produksi panggung berskala festival (seperti Pesta Kesenian Bali) melibatkan koordinasi presisi antara tim Artistik (Sutradara, Koreografer, Penata Musik) dan tim Teknis-Manajerial (Produser, Stage Manager, Penata Cahaya, Penata Suara).",
    architectureMechanism:
      "Selama pementasan berlangsung, Stage Manager memegang kendali penuh atas keselamatan panggung dan ketepatan waktu transisi menggunakan dokumen Master Cue Sheet. Selain aspek teknis panggung, pengelola budaya wajib memahami instrumen hukum Peraturan Pemerintah Nomor 56 Tahun 2022 tentang Kekayaan Intelektual Komunal (KIK) untuk menginventarisasi dan melindungi Ekspresi Budaya Tradisional (EBT) dan Pengetahuan Tradisional (PT) masyarakat adat dari klaim komersial sepihak.",
    technicalReferenceTitle:
      "STRUKTUR MASTER CUE SHEET STAGE MANAGER & PERLINDUNGAN HKI KOMUNAL (PP NO. 56/2022)",
    technicalReferenceCode: `1. FORMAT STANDAR MASTER CUE SHEET PRODUKSI PERTUNJUKAN:
- Kolom Identitas Cue : Nomor Urut Cue (Sound Cue S-01, Lighting Cue L-01, Multimedia Cue V-01)
- Trigger / Pemicu    : Kalimat dialog dalang, ketukan gong, atau timecode spesifik (misal 00:12:45)
- Aksi Stage Manager  : Perintah komunikasi Clear-Com ('Standby L-04 & S-03 ... GO L-04 & S-03!')
- Blocking & Properti : Posisi masuk-keluar penari (Stage Left / Stage Right / Upstage / Downstage)

2. KLASIFIKASI KEKAYAAN INTELEKTUAL KOMUNAL (PP NO. 56 TAHUN 2022 - DJKI KEMENKUMHAM):
- Ekspresi Budaya Tradisional (EBT) : Tari tradisi, gending karawitan, motif tenun Gringsing/Endek, upacara
- Pengetahuan Tradisional (PT)      : Ramuan pengobatan Usada, teknik subak, arsitektur tradisional
- Indikasi Geografis (IG)           : Produk khas wilayah geografis (Kopi Arabika Kintamani, Garam Amed)
- Sifat Kepemilikan KIK             : Komunal (milik komunitas adat asal), inklusif, perlindungan tanpa batas waktu`,
    workflowSteps: [
      "Tahap 1 (Pra-Produksi & Penyusunan Konsep Kuratorial): Tetapkan tema besar festival/pameran, susun narasi kuratorial, anggaran produksi, dan jadwal lini masa (Production Timeline).",
      "Tahap 2 (Penyusunan Technical Rider & Stage Plot): Buat denah tata letak panggung (Stage Plot), kebutuhan saluran mikrofon (Channel List), dan desain tata cahaya (Lighting Plot).",
      "Tahap 3 (Pembuatan Master Cue Sheet & Cue-to-Cue Rehearsal): Sinkronisasikan seluruh perpindahan adegan, musik, dan lampu bersama operator teknis sebelum Gladi Bersih (Dress Rehearsal).",
      "Tahap 4 (Manajemen Kerumunan & Keselamatan Acara): Pastikan jalur evakuasi darurat penonton bebas hambatan, kapasitas tribun tidak terlampaui, dan instalasi listrik panggung ter-grounding aman.",
      "Tahap 5 (Dokumentasi & Pencatatan Inventaris KIK): Daftarkan dokumentasi karya tradisi komunitas ke dalam Pusat Data Nasional Kekayaan Intelektual Komunal bersama Dinas Kebudayaan.",
    ],
    pitfalls: [
      {
        mistake:
          "Menjalankan pementasan multi-adegan hanya dengan instruksi lisan spontan tanpa dokumen Cue Sheet tertulis sehingga transisi lampu dan musik terlambat.",
        expertSolution:
          "Susun Master Cue Sheet terpadu dan lakukan sesi latihan khusus 'Cue-to-Cue' (melompati bagian tengah tarian untuk fokus melatih ketepatan transisi teknis).",
      },
      {
        mistake:
          "Mendaftarkan motif kain tradisional warisan leluhur desa adat sebagai Hak Cipta atau Merek Pribadi atas nama satu perusahaan perorangan.",
        expertSolution:
          "Motif dan ekspresi budaya warisan leluhur merupakan Kekayaan Intelektual Komunal (EBT) yang wajib dicatatkan atas nama komunitas masyarakat adat pengembannya.",
      },
      {
        mistake:
          "Mengabaikan pemeriksaan beban daya genset dan penataan kabel audio-lighting di lantai panggung yang berisiko memicu korsleting atau membuat penari tersandung.",
        expertSolution:
          "Pisahkan jalur fase listrik Audio dan Lighting untuk mencegah dengung (ground loop hum) serta tutup seluruh jalur kabel melintang dengan pelindung kabel (cable ramp/gaffer tape).",
      },
    ],
    pdf: {
      id: "pdf-bud-03",
      title:
        "Buku Ajar & Praktikum: Manajemen Produksi Pertunjukan, Kuratorial Pameran Budaya & Perlindungan HKI Komunal (EBT)",
      filename:
        "MODUL-BUD-03-Manajemen-Produksi-Festival-Budaya-Kuratorial-dan-HKI-Komunal.pdf",
      folderPath: "public/pustaka-modul/07-budaya/",
      fileUrl:
        "/pustaka-modul/07-budaya/MODUL-BUD-03-Manajemen-Produksi-Festival-Budaya-Kuratorial-dan-HKI-Komunal.pdf",
      certStandard: "BNSP Manajemen Panggung & Regulasi KIK DJKI (PP No. 56/2022)",
      externalSourceUrl: "https://dgip.go.id/",
    },
  },

  // 08 - PERTANIAN
  "agr-tanah": {
    courseId: "agr-tanah",
    fieldId: "pertanian",
    theoryFoundation:
      "Ilmu Tanah, Fisiologi Nutrisi Tanaman, dan Sistem Pertanian Organik (standar nasional SNI 6729:2016 dan skema BNSP TAN.OT02) menekankan pemulihan kesehatan biologi-fisika-kimia tanah secara berkelanjutan. Kemampuan tanah dalam menyimpan dan menyediakan kation unsur hara makro (N, P, K, Ca, Mg) bagi akar tanaman ditentukan oleh nilai Kapasitas Tukar Kation (KTK / Cation Exchange Capacity), kandungan bahan organik (humus), serta kemasaman pH tanah.",
    architectureMechanism:
      "Pada tanah masam (pH < 5.5), ion Aluminium (Al3+) dan Besi (Fe2+) mengikat erat unsur Fosfor (P) menjadi senyawa tidak larut sehingga tanaman mengalami defisiensi meskipun telah dipupuk. Penambahan bahan organik kompos matang (rasio C/N 10-20) dan kapur pertanian Dolomit [CaMg(CO3)2] menaikkan pH tanah ke rentang netral (6.0-7.0) sekaligus merangsang populasi mikroba menguntungkan seperti jamur antagonis Trichoderma sp. dan bakteri penambat nitrogen Rhizobium/Azotobacter.",
    technicalReferenceTitle:
      "STANDAR PERTANIAN ORGANIK SNI 6729:2016, RASIO C/N KOMPOS & AMBANG EKONOMI PHT",
    technicalReferenceCode: `1. PERSYARATAN SERTIFIKASI PERTANIAN ORGANIK (SNI 6729:2016 - BNSP TAN.OT02):
- Masa Konversi Lahan Tanaman Semusim (Padi/Sayur) : Minimal 24 bulan (2 tahun) sebelum tebar benih
- Masa Konversi Lahan Tanaman Tahunan (Kopi/Kakao) : Minimal 36 bulan (3 tahun) sebelum panen organik
- Pencegahan Kontaminasi                           : Wajib ada Zona Penyangga (Buffer Zone) & kolam filter air
- Dokumentasi Wajib                                : Rekaman Internal Control System (ICS) & ketelusuran lot

2. PARAMETER BIOKIMIA PENGOMPOSAN & PENGENDALIAN HAMA TERPADU (PHT):
- Rasio C/N Bahan Baku Awal Kompos : 25 : 1 s.d. 30 : 1 (Campuran bahan coklat kaya C + bahan hijau kaya N)
- Rasio C/N Kompos Matang Stabil   : 10 : 1 s.d. 20 : 1 (Suhu kembali ke suhu ruang, pH 6.5-7.5, tidak berbau)
- Ambang Ekonomi (Economic Threshold): Batas kepadatan populasi hama di mana intervensi biopestisida wajib
                                       dilakukan agar kerugian hasil panen tidak melampaui biaya pengendalian`,
    workflowSteps: [
      "Tahap 1 (Pengambilan Sampel Tanah Komposit & Uji pH/KTK): Ambil sampel tanah secara zig-zag pada kedalaman perakaran (0-20 cm), ukur pH tanah dan kandungan C-organik.",
      "Tahap 2 (Formulasi Kompos & Pupuk Hayati): Susun tumpukan bahan organik dengan rasio C/N ~30:1 (misal jerami padi + pupuk kandang matang + dedak), inokulasikan dekomposer, dan pantau fase termofilik (55-65 C).",
      "Tahap 3 (Penyiapan Lahan Konversi & Buffer Zone): Tanam tanaman barier (seperti rumput vetiver/kaliandra) di sekeliling batas lahan dan bangun bak filtrasi bio-arang pada saluran masuk air.",
      "Tahap 4 (Agroekologi Pengendalian Hama Terpadu / PHT): Lakukan pengamatan ekosistem mingguan, lestarikan musuh alami (predator/parasitoid), dan aplikasikan agensia hayati Trichoderma/Beauveria bassiana.",
      "Tahap 5 (Audit Internal Control System / ICS): Catat seluruh asal benih non-GMO, tanggal aplikasi pupuk organik, dan volume panen untuk pemeriksaan Lembaga Sertifikasi Organik (LSO).",
    ],
    pitfalls: [
      {
        mistake:
          "Mengaplikasikan pupuk kandang segar atau kompos mentah (rasio C/N masih > 40) langsung ke lubang tanam yang memicu imobilisasi Nitrogen dan panas pembusukan akar.",
        expertSolution:
          "Pastikan pupuk organik melalui proses fermentasi aerobik hingga matang sempurna (rasio C/N < 20, suhu dingin stabil, dan tekstur remah hitam) sebelum diaplikasikan.",
      },
      {
        mistake:
          "Menyemprotkan pestisida secara terjadwal rutin setiap minggu tanpa memedulikan ada atau tidaknya populasi hama (sistem kalender buta).",
        expertSolution:
          "Terapkan prinsip PHT: lakukan pemantauan berkala dan hanya semprotkan biopestisida nabati (seperti ekstrak biji mimba/Azadirachtin) saat populasi hama menyentuh Ambang Ekonomi.",
      },
      {
        mistake:
          "Mengklaim hasil panen sebagai '100% Organik Bersertifikat' padahal lahan baru berhenti menggunakan pestisida sintetis selama 3 bulan tanpa masa konversi.",
        expertSolution:
          "Patuhi masa konversi lahan SNI 6729:2016 (2 tahun untuk tanaman semusim, 3 tahun untuk tanaman tahunan) agar residu kimia dalam tanah terdegradasi sesuai standar.",
      },
    ],
    pdf: {
      id: "pdf-agr-01",
      title:
        "Buku Ajar & Praktikum: Sistem Pertanian Organik SNI 6729:2016, Kesuburan Tanah (C/N & KTK) & Pengendalian Hama Terpadu (PHT)",
      filename:
        "MODUL-AGR-01-Pertanian-Organik-SNI6729-Kesuburan-Tanah-dan-Pengendalian-Hama-Terpadu.pdf",
      folderPath: "public/pustaka-modul/08-pertanian/",
      fileUrl:
        "/pustaka-modul/08-pertanian/MODUL-AGR-01-Pertanian-Organik-SNI6729-Kesuburan-Tanah-dan-Pengendalian-Hama-Terpadu.pdf",
      certStandard: "BNSP Pertanian Organik (TAN.OT02) & SNI 6729:2016",
      externalSourceUrl: "https://www.fao.org/organicag/en/",
    },
  },

  "agr-subak": {
    courseId: "agr-subak",
    fieldId: "pertanian",
    theoryFoundation:
      "Manajemen Irigasi Subak, Hidroponik Presisi, dan Smart Farming IoT (standar SKKNI A.01HOR00.038.1) mengintegrasikan kearifan tata kelola air komunal Bali (sistem pembagian air proporsional Tembuku dan pola tanam serempak Kerta Masa) dengan teknologi sensor presisi. Dalam sistem budidaya tanpa tanah (Hidroponik NFT, DFT, dan Fertirigasi Tetes), seluruh kebutuhan 13 unsur hara mineral esensial dipasok melalui larutan nutrisi AB Mix terlarut.",
    architectureMechanism:
      "Secara kimiawi, Pekatan A (yang mengandung Kalsium Nitrat Ca(NO3)2 dan Fe-EDTA) dan Pekatan B (yang mengandung Kalium Dihidrogen Fosfat KH2PO4 dan Magnesium Sulfat MgSO4) wajib disimpan terpisah dan baru boleh dicampurkan setelah masing-masing diencerkan di dalam air baku. Pencampuran pekatan A dan B secara langsung tanpa air akan memicu reaksi pengendapan Kalsium Sulfat (Gipsum CaSO4) dan Kalsium Fosfat yang tidak larut. Sistem Smart Farming memantau nilai Electrical Conductivity (EC), pH larutan (5.5-6.5), suhu ruang, dan kelembapan tanah menggunakan mikrokontroler yang terhubung melalui protokol ringan MQTT.",
    technicalReferenceTitle:
      "KIMIA NUTRISI HIDROPONIK AB MIX (EC/TDS/pH) & ARSITEKTUR TELEMETRI SMART FARMING IoT",
    technicalReferenceCode: `1. PARAMETER NUTRISI HIDROPONIK PRESISI (SKKNI A.01HOR00.038.1):
- Rentang pH Larutan Ideal          : 5.5 - 6.5 (Jika pH > 7.0 -> unsur Fe, Mn, P mengendap / Lockout)
- Koreksi pH Larutan                : Gunakan asam fosfat (H3PO4) untuk pH Down | KOH untuk pH Up
- EC Sayuran Daun (Selada/Pakcoy)   : Fase Semai 0.8 - 1.0 mS/cm | Fase Vegetatif 1.2 - 1.8 mS/cm
- EC Tanaman Buah (Melon/Tomat)     : Fase Vegetatif 1.5 - 2.2 mS/cm | Fase Generatif 2.5 - 3.5 mS/cm
- Suhu & Oksigen Terlarut (DO) Air  : Suhu larutan < 28 C | DO >= 6 mg/L untuk mencegah busuk akar Pythium

2. RUMUS TARGET DOSIS LARUTAN AB MIX PADA TANDON:
Volume Pekatan A/B (mL) = Volume Tandon (Liter) x [ (Target_EC - EC_Air_Baku) / Kenaikan_EC_per_5mL ] x 5 mL`,
    workflowSteps: [
      "Tahap 1 (Uji Kualitas Air Baku & Kalibrasi Sensor): Ukur EC/TDS dan pH air baku awal menggunakan meter yang telah dikalibrasi dengan cairan larutan buffer standar (pH 4.01 dan 6.86).",
      "Tahap 2 (Pencampuran Larutan Nutrisi Bertahap): Tuangkan takaran Pekatan A ke dalam tandon berisi air baku, aduk hingga homogen sempurna, baru kemudian masukkan Pekatan B dan sesuaikan pH ke 5.8-6.2.",
      "Tahap 3 (Pengaturan Aliran Sirkulasi & Kemiringan Talang): Pastikan kemiringan talang NFT berkisar 2% - 3% dengan debit aliran 1 - 2 Liter/menit per jalur agar akar mendapat lapisan tipis air kaya oksigen.",
      "Tahap 4 (Instalasi Node Sensor IoT & Akuator Otomatis): Pasang sensor kelembapan media, suhu-RH, dan pompa peristaltik dosing yang dikendalikan otomatis saat nilai EC/kelembapan turun di bawah ambang batas.",
      "Tahap 5 (Sanitasi Biosekuriti Greenhouse): Bersihkan lumut dan biofilm pada pipa distribusi setiap selesai siklus panen menggunakan hidrogen peroksida (H2O2) food-grade.",
    ],
    pitfalls: [
      {
        mistake:
          "Menuangkan cairan pekat Stok A dan Stok B ke dalam satu gelas takar yang sama sebelum dituang ke tandon air.",
        expertSolution:
          "Jangan pernah menyatukan pekatan A dan B dalam kondisi murni; larutkan Stok A ke dalam air tandon terlebih dahulu, aduk rata, baru tuangkan Stok B.",
      },
      {
        mistake:
          "Hanya menambahkan air dan nutrisi AB Mix terus-menerus tanpa pernah mengecek pH larutan sehingga tanaman mengalami keriting kuning (defisiensi Besi/Kalsium) padahal nilai TDS tinggi.",
        expertSolution:
          "Ukur dan koreksi pH larutan setiap hari ke rentang 5.5 - 6.5 karena pada pH basa (> 7.0) akar tidak mampu menyerap Fe dan Ca meskipun unsur tersebut melimpah di air.",
      },
      {
        mistake:
          "Membiarkan suhu air tandon hidroponik di dataran rendah melampaui 32 C di siang hari sehingga kadar oksigen terlarut (DO) anjlok dan akar membusuk coklat.",
        expertSolution:
          "Tanam tandon nutrisi di bawah tanah/tempat teduh, lapisi dinding tandon dengan insulasi termal, dan pasang aerator batu gelembung udara (venturi) untuk menjaga kadar DO.",
      },
    ],
    pdf: {
      id: "pdf-agr-02",
      title:
        "Buku Ajar & Praktikum: Smart Farming IoT, Manajemen Nutrisi Hidroponik AB Mix (EC/TDS/pH) & Irigasi Presisi Subak",
      filename:
        "MODUL-AGR-02-Smart-Farming-IoT-Nutrisi-Hidroponik-AB-Mix-dan-Irigasi-Subak.pdf",
      folderPath: "public/pustaka-modul/08-pertanian/",
      fileUrl:
        "/pustaka-modul/08-pertanian/MODUL-AGR-02-Smart-Farming-IoT-Nutrisi-Hidroponik-AB-Mix-dan-Irigasi-Subak.pdf",
      certStandard: "SKKNI Hidroponik & Smart Agriculture (A.01HOR00.038.1)",
      externalSourceUrl: "https://pertanian.go.id/",
    },
  },

  "agr-rantai": {
    courseId: "agr-rantai",
    fieldId: "pertanian",
    theoryFoundation:
      "Teknologi Pascapanen, Manajemen Rantai Dingin (Cold Chain), dan Sistem Jaminan Mutu Keamanan Pangan HACCP (standar BNSP C.10PKP00.028.2 & SNI CAC/RCP 1:2011) bertujuan menekan tingkat kehilangan hasil panen (post-harvest loss) serta menjamin produk bebas dari cemaran biologis, kimia, dan fisik. Komoditas hortikultura yang telah dipanen tetap merupakan jaringan hidup yang melakukan proses respirasi (mengubah cadangan gula menjadi CO2, H2O, dan panas) serta transpirasi.",
    architectureMechanism:
      "Penanganan pascapanen membedakan buah Klimakterik (yang memproduksi lonjakan hormon etilen C2H4 dan dapat diperam matang setelah petik) dari buah Non-Klimakterik. Pendinginan awal (Pre-Cooling) segera setelah panen memperlambat laju respirasi dan aktivitas enzim perombak. Pada lini pengolahan pangan dan komoditas perkebunan (seperti Kopi Arabika Kintamani Indikasi Geografis), penerapan 7 Prinsip HACCP menetapkan Batas Kritis terukur pada setiap Titik Kendali Kritis (Critical Control Point / CCP), seperti pengeringan kadar air biji kopi ke 11% - 12% untuk mencegah racun jamur Ochratoxin A.",
    technicalReferenceTitle:
      "TUJUH PRINSIP HACCP, FISIOLOGI KLIMAKTERIK & PARAMETER MUTU KOPI SPESIALTI (SNI)",
    technicalReferenceCode: `1. PERBEDAAN FISIOLOGI KOMODITAS PASCAPANEN:
- Buah Klimakterik (Lonjakan Etilen)     : Pisang, Mangga, Alpukat, Pepaya, Tomat, Melon
- Buah Non-Klimakterik (Tanpa Lonjakan)  : Jeruk, Stroberi, Anggur, Salak, Semangka, Nanas
  * Catatan Rantai Dingin: Jangan menyimpan buah penghasil etilen tinggi (Pisang/Mangga matang) satu ruang
    tertutup dengan sayuran hijau/bunga potong karena etilen mempercepat pelayuan dan penguningan klorofil.

2. PARAMETER TITIK KENDALI KRITIS (CCP) PASCAPANEN KOPI SPESIALTI & PANGAN:
- Kadar Air Biji Kopi Hijau (Green Bean) : Wajib 11.0% - 12.5% (Mencegah kapang Aspergillus & Ochratoxin A)
- Suhu Penyimpanan Cold Storage Sayur    : 2 C - 8 C (Hindari Chilling Injury pada buah tropis sensitif < 10 C)
- Tujuh Prinsip HACCP                    : (1) Analisis Bahaya, (2) Penentuan CCP, (3) Batas Kritis,
                                           (4) Pemantauan, (5) Tindakan Koreksi, (6) Verifikasi, (7) Dokumentasi`,
    workflowSteps: [
      "Tahap 1 (Penentuan Indeks Kematangan Panen & Pre-Cooling): Panen pada pagi hari saat suhu lapang rendah, lakukan sortasi grade, dan segera buang panas lapang (field heat) dengan Pre-Cooling.",
      "Tahap 2 (Penyusunan Diagram Alir Proses & Analisis Bahaya): Petakan seluruh tahapan dari penerimaan bahan baku, pencucian, pengeringan/pasteurisasi, hingga pengemasan kedap (hermetik).",
      "Tahap 3 (Penetapan Titik Kendali Kritis / CCP): Gunakan Pohon Keputusan (CCP Decision Tree) untuk menentukan tahapan mana yang mutlak menghilangkan atau menurunkan bahaya ke tingkat aman.",
      "Tahap 4 (Penetapan Batas Kritis & Prosedur Monitoring): Tetapkan angka batas kritis terukur (misal suhu pasteurisasi 72 C selama 15 detik, atau kadar air biji <= 12.0%) beserta jadwal pengecekannya.",
      "Tahap 5 (Tindakan Koreksi, Verifikasi & Ketelusuran Lot): Siapkan protokol isolasi produk yang melanggar batas kritis dan beri kode batch produksi untuk ketelusuran (Traceability).",
    ],
    pitfalls: [
      {
        mistake:
          "Menetapkan batas kritis CCP dengan kalimat subjektif seperti 'Biji kopi harus kering merata' atau 'Pemanasan dilakukan sampai matang'.",
        expertSolution:
          "Batas kritis (Critical Limit) dalam dokumen HACCP wajib berupa parameter kuantitatif yang dapat diukur cepat secara fisik/kimia, seperti 'Kadar air 11,0% - 12,0%' atau 'Suhu inti >= 75 C selama 2 menit'.",
      },
      {
        mistake:
          "Menyimpan buah tropis seperti pisang atau mangga di dalam ruang pendingin bersuhu 2 C yang justru menyebabkan kulit buah menghitam dan gagal matang (Chilling Injury).",
        expertSolution:
          "Sesuaikan suhu penyimpanan dengan ambang kritis komoditas: buah tropis sensitif disimpan pada suhu sejuk 12 C - 14 C, sedangkan sayuran daun subtropis pada 1 C - 4 C.",
      },
      {
        mistake:
          "Menumpuk karung kopi atau biji-bijian menempel langsung di lantai semen dan dinding gudang tanpa alas palet sehingga menyerap uap air tanah.",
        expertSolution:
          "Wajib gunakan palet kayu/plastik setinggi minimal 10-15 cm dari lantai dan beri jarak 50 cm dari dinding gudang dengan sirkulasi udara terjaga.",
      },
    ],
    pdf: {
      id: "pdf-agr-03",
      title:
        "Buku Ajar & Praktikum: Fisiologi Pascapanen, Manajemen Cold Chain, Sertifikasi IndoGAP & Sistem HACCP (CCP)",
      filename:
        "MODUL-AGR-03-Teknologi-Pascapanen-Cold-Chain-IndoGAP-dan-Keamanan-Pangan-HACCP.pdf",
      folderPath: "public/pustaka-modul/08-pertanian/",
      fileUrl:
        "/pustaka-modul/08-pertanian/MODUL-AGR-03-Teknologi-Pascapanen-Cold-Chain-IndoGAP-dan-Keamanan-Pangan-HACCP.pdf",
      certStandard: "BNSP Keamanan Pangan HACCP (C.10PKP00.028.2) & IndoGAP",
      externalSourceUrl: "https://www.fao.org/3/y1579e/y1579e03.htm",
    },
  },

  // 09 - LINGKUNGAN
  "env-pesisir": {
    courseId: "env-pesisir",
    fieldId: "lingkungan",
    theoryFoundation:
      "Ekologi Pesisir, Penilaian Kesehatan Terumbu Karang (standar SKKNI kode M.72KRG00.001.1 / M.74PPK01.006.1), dan Konservasi Karbon Biru (Blue Carbon) memiliki peran vital dalam melindungi garis pantai dari abrasi gelombang serta menyerap emisi gas rumah kaca. Tiga ekosistem kunci pesisir tropis adalah hutan Mangrove, padang Lamun (Seagrass), dan Terumbu Karang (Coral Reefs) yang saling terhubung secara fisik maupun ekologis.",
    architectureMechanism:
      "Dalam survei ilmiah kondisi terumbu karang menggunakan metode Line Intercept Transect (LIT) atau Underwater Photo Transect (UPT), peneliti mengukur proporsi tutupan karang keras hidup (Live Hard Coral Cover: Acropora dan Non-Acropora) terhadap total panjang garis transek (50 m atau 100 m) lalu mengklasifikasikannya berdasarkan Kepmen LH No. 4 Tahun 2001. Sementara itu, pada ekosistem hutan mangrove, pengukuran diameter batang setinggi dada (DBH 1.3 m) di dalam plot kuadrat digunakan dalam persamaan alometrik untuk menghitung stok biomassa karbon atas permukaan dan cadangan karbon sedimen.",
    technicalReferenceTitle:
      "RUMUS TUTUPAN TERUMBU KARANG (LIT/UPT), KRITERIA KEPMEN LH 4/2001 & STOK BLUE CARBON",
    technicalReferenceCode: `1. RUMUS PERSENTASE TUTUPAN KARANG HIDUP & KATEGORI KEPMEN LH NO. 4 TAHUN 2001:
% Tutupan Karang Hidup (HC) = [ (Total Panjang Acropora + Non-Acropora) / Panjang Total Transek ] x 100%
- 0.0%  - 24.9% : Kondisi BURUK (Rusak Berat)
- 25.0% - 49.9% : Kondisi SEDANG (Rusak Sedang)
- 50.0% - 74.9% : Kondisi BAIK
- 75.0% - 100%  : Kondisi SANGAT BAIK

2. RUMUS KONVERSI BIOMASSA MANGROVE KE SERAPAN GAS RUMAH KACA (CO2-EKUIVALEN):
- Biomassa Pohon (W, kg)          = a x (DBH ^ b)  [Persamaan Alometrik Spesies, misal Rhizophora sp.]
- Stok Karbon Organik (ton C/ha)  = Total Biomassa Kering (ton/ha) x 0.47
- Ekuivalen Serapan CO2 (ton/ha)  = Stok Karbon (ton C/ha) x (Mr CO2 / Ar C) = Stok Karbon x 3.67`,
    workflowSteps: [
      "Tahap 1 (Penentuan Stasiun & Kontur Kedalaman Survei): Tetapkan koordinat GPS titik penyelaman dan bentangkan pita ukur fiberglass 50 m sejajar garis pantai pada kedalaman konstan (3-5 m dan 10 m).",
      "Tahap 2 (Pencatatan Lifeform LIT / Pemotretan Frame UPT): Catat setiap transisi bentuk pertumbuhan karang (Branching, Massive, Tabulate, Foliose), alga, maupun substrat abiotik (pasir/rubble).",
      "Tahap 3 (Analisis Citra Kohort & Perhitungan Persentase): Olah foto kuadrat 58x44 cm menggunakan perangkat lunak CPCe (Coral Point Count with Excel extensions) untuk memperoleh % tutupan.",
      "Tahap 4 (Inventarisasi Plot Mangrove & Pengukuran DBH): Buat plot transek 10x10 m di hutan mangrove, identifikasi spesies (Rhizophora, Avicennia, Sonneratia), dan ukur lingkar batang.",
      "Tahap 5 (Penyusunan Peta Zonasi Konservasi & Rehabilitasi): Tentukan rekomendasi teknik transplantasi karang (Spider Frame / Biorock) atau restorasi hidrologi mangrove sesuai kecocokan substrat.",
    ],
    pitfalls: [
      {
        mistake:
          "Membentangkan pita transek survei terumbu karang secara tegak lurus dari pantai menuju laut dalam sehingga melintasi gradien kedalaman yang berbeda-beda.",
        expertSolution:
          "Transek LIT/UPT wajib dibentangkan sejajar garis pantai (mengikuti kontur kedalaman yang sama, isobath) agar data komunitas karang konsisten dan dapat dibandingkan antar-tahun.",
      },
      {
        mistake:
          "Memasukkan kategori 'Dead Coral with Algae (DCA)' atau 'Soft Coral' ke dalam penjumlahan persentase Tutupan Karang Keras Hidup (Hard Coral Cover) saat menentukan baku mutu Kepmen LH.",
        expertSolution:
          "Kriteria baku mutu Kepmen LH No. 4/2001 dihitung spesifik dari penjumlahan tutupan karang batu hidup (Acropora + Non-Acropora); catat Soft Coral dan DCA pada kolom terpisah.",
      },
      {
        mistake:
          "Menanam bibit mangrove jenis Rhizophora mucronata secara seragam di hamparan pasir terbuka pantai berombak besar yang bukan zona alaminya sehingga bibit hanyut mati.",
        expertSolution:
          "Perhatikan zonasi alami substrat dan salinitas: zona terdepan berpasir/berlumpur laut cocok untuk Avicennia/Sonneratia, sedangkan zona tengah berlumpur dalam cocok untuk Rhizophora.",
      },
    ],
    pdf: {
      id: "pdf-env-02",
      title:
        "Buku Ajar & Praktikum: Ekologi Pesisir, Survei Terumbu Karang (LIT & UPT) serta Perhitungan Stok Blue Carbon Mangrove",
      filename:
        "MODUL-ENV-02-Ekologi-Pesisir-Survei-Terumbu-Karang-LIT-UPT-dan-Blue-Carbon-Mangrove.pdf",
      folderPath: "public/pustaka-modul/09-lingkungan/",
      fileUrl:
        "/pustaka-modul/09-lingkungan/MODUL-ENV-02-Ekologi-Pesisir-Survei-Terumbu-Karang-LIT-UPT-dan-Blue-Carbon-Mangrove.pdf",
      certStandard: "SKKNI Penilai Terumbu Karang (M.72KRG00.001.1 / M.74PPK01.006.1)",
      externalSourceUrl: "https://pusatdata.brin.go.id/",
    },
  },

  "env-sirkular": {
    courseId: "env-sirkular",
    fieldId: "lingkungan",
    theoryFoundation:
      "Rekayasa Sistem Energi Terbarukan (PLTS Fotovoltaik standar BNSP D.35EBT15), Pemetaan Spasial GIS, dan Ekonomi Sirkular TPS3R mendukung target transisi energi bersih (Bali Net Zero Emission 2045). Pembangkit Listrik Tenaga Surya (PLTS) mengonversi foton radiasi matahari menjadi arus listrik searah (DC) melalui efek fotovoltaik pada sel silikon, yang kemudian dioptimalkan titik dayanya oleh MPPT (Maximum Power Point Tracking) dan diubah menjadi arus bolak-balik (AC 230V/50Hz) oleh Inverter.",
    architectureMechanism:
      "Dalam perhitungan desain teknik (Sizing PLTS), kapasitas total panel surya (kWp) ditentukan oleh profil beban energi harian (kWh/hari), rata-rata jam penyinaran matahari puncak (Peak Sun Hours / PSH), serta faktor efisiensi sistem (Performance Ratio ~0.75-0.80). Sementara itu, pada pengelolaan sampah sirkular dan pemantauan lingkungan spasial, neraca massa TPS3R memilah residu organik/anorganik di hulu, dan analisis citra satelit multispektral menghitung Normalized Difference Vegetation Index (NDVI) untuk memantau perubahan tutupan hijau.",
    technicalReferenceTitle:
      "RUMUS SIZING PLTS SURYA (kWp, MPPT, DoD BATERAI), EMISI GRK & INDEKS VEGETASI NDVI",
    technicalReferenceCode: `1. RUMUS PERANCANGAN TEKNIS PLTS ATAP / OFF-GRID (STANDAR BNSP D.35EBT15):
- Kapasitas Panel Surya (kWp)   = Kebutuhan Energi Harian (kWh/hari) / (Peak Sun Hours x Performance Ratio)
- Kapasitas Bank Baterai (Wh)   = [ Beban Malam (Wh) x Hari Otonomi ] / (Efisiensi Inverter x DoD Baterai)
  * Contoh: Beban 15 kWh/hari, PSH Bali = 4.8 jam, PR = 0.78 -> Kapasitas PLTS = 15 / (4.8 x 0.78) = 4.01 kWp

2. RUMUS INDEKS VEGETASI PENGINDERAAN JAUH (NDVI) & JEJAK KARBON:
- NDVI = (Band_NIR - Band_Red) / (Band_NIR + Band_Red)   [Rentang: -1.0 s.d. +1.0; Hutan Rapat > 0.6]
- Emisi GRK (kg CO2e) = Data Aktivitas Konsumsi (kWh atau Liter BBM) x Faktor Emisi Grid/Bahan Bakar`,
    workflowSteps: [
      "Tahap 1 (Audit Energi & Profil Beban Harian): Inventarisasi daya (Watt) dan durasi nyala (jam) seluruh peralatan listrik untuk memetakan kurva beban siang vs malam.",
      "Tahap 2 (Kalkulasi Kapasitas Array Panel, SCC MPPT & Inverter): Hitung kWp modul surya, pastikan tegangan rangkaian seri string (Voc) tidak melebihi batas input maksimum MPPT/Inverter.",
      "Tahap 3 (Analisis Bayangan & Kemiringan Sudut Panel): Pasang panel menghadap ekuator (Utara untuk lokasi di selatan khatulistiwa seperti Bali) dengan sudut kemiringan 10-15 derajat bebas bayangan (shading).",
      "Tahap 4 (Instalasi Proteksi DC/AC & Grounding): Pasang MCB DC, Surge Protection Device (SPD) penangkal petir di sisi DC maupun AC, serta sistem pembumian (grounding) dengan resistansi < 5 Ohm.",
      "Tahap 5 (Komisioning, Uji Isolasi & Monitoring PR): Ukur tegangan Voc, arus Isc, resistansi isolasi kabel, dan pantau rasio produksi energi harian.",
    ],
    pitfalls: [
      {
        mistake:
          "Membiarkan sebagian kecil permukaan satu panel surya tertutup bayangan pohon atau tiang antena (Partial Shading) pada rangkaian seri string yang menurunkan daya seluruh deret panel secara drastis.",
        expertSolution:
          "Pastikan area pemasangan 100% bebas bayangan pada jam efektif matahari (09.00-15.00), aktifkan fitur Bypass Diode / Shade Management MPPT, atau gunakan Microinverter.",
      },
      {
        mistake:
          "Menguras kapasitas baterai setiap malam hingga 100% habis (DoD 100%) sehingga usia pakai siklus baterai rusak dalam hitungan bulan.",
        expertSolution:
          "Perhitungkan batas Depth of Discharge (DoD) aman saat merancang kapasitas baterai: maksimal 50% untuk baterai timbal-asam (VRLA/Gel) dan 80% untuk baterai Lithium LiFePO4.",
      },
      {
        mistake:
          "Menggunakan MCB AC biasa pada jalur arus searah (DC) dari panel surya yang berisiko memicu busur api listrik (DC Arc Fault) saat diputus dalam kondisi berbeban.",
        expertSolution:
          "Wajib gunakan komponen proteksi khusus bersertifikasi DC (MCB DC, Fuse DC gPV, dan konektor MC4 ter-crimping rapat) pada sisi antara modul surya, SCC, dan baterai.",
      },
    ],
    pdf: {
      id: "pdf-env-03",
      title:
        "Buku Ajar & Praktikum: Perancangan PLTS Surya (Peak Sun Hours, MPPT, Performance Ratio) & Pemetaan Spasial GIS NDVI",
      filename:
        "MODUL-ENV-03-Rekayasa-PLTS-Surya-OffGrid-OnGrid-dan-Analisis-Spasial-GIS-NDVI.pdf",
      folderPath: "public/pustaka-modul/09-lingkungan/",
      fileUrl:
        "/pustaka-modul/09-lingkungan/MODUL-ENV-03-Rekayasa-PLTS-Surya-OffGrid-OnGrid-dan-Analisis-Spasial-GIS-NDVI.pdf",
      certStandard: "BNSP Teknisi PLTS (D.35EBT15) & Analisis Spasial GIS",
      externalSourceUrl: "https://ebtke.esdm.go.id/",
    },
  },

  "env-kualitas": {
    courseId: "env-kualitas",
    fieldId: "lingkungan",
    theoryFoundation:
      "Analisis Kualitas Air, Operasional Instalasi Pengolahan Air Limbah (IPAL), dan Penyusunan Dokumen Lingkungan AMDAL/UKL-UPL merupakan kompetensi wajib bagi Penanggung Jawab Pengendalian Pencemaran Air (PPPA) dan Penanggung Jawab Operasional Pengolahan Air Limbah (POPAL) berstandar BNSP E.370000 serta ISO 14001:2015. Pengolahan air limbah bertujuan menurunkan beban polutan organik, padatan tersuspensi, senyawa kimia, dan bakteri patogen hingga memenuhi Baku Mutu Air Limbah (Permen LHK No. 68 Tahun 2016) sebelum dibuang ke badan air penerima.",
    architectureMechanism:
      "Sistem IPAL bekerja secara berurutan melalui empat tahapan proses: (1) Pre-Treatment / Pengolahan Pendahuluan (Bar Screen penyaring sampah kasar, Grit Chamber, dan Grease Trap penangkap lemak dapur/hotel), (2) Primary Treatment (Bak Ekualisasi penyeragam debit/pH dan Bak Pengendap Awal), (3) Secondary Treatment / Pengolahan Biologis (Lumpur Aktif Aerobik, Moving Bed Biofilm Reactor / MBBR, atau Biofilter Anaerob-Aerob di mana bakteri menguraikan BOD dan COD dengan suplai oksigen terlarut DO >= 2.0 mg/L), serta (4) Tertiary Treatment (Filtrasi pasir/karbon aktif dan disinfeksi bakteri Coliform).",
    technicalReferenceTitle:
      "PARAMETER OPERASIONAL IPAL (BOD5, COD, TSS, DO) & STANDAR BAKU MUTU PERMEN LHK 68/2016",
    technicalReferenceCode: `1. RUMUS OPERASIONAL IPAL & EFISIENSI PENYISIHAN POLUTAN (STANDAR PPPA / POPAL):
- Beban Pencemaran Harian (kg/hari) = Debit Air Limbah (m3/hari) x Konsentrasi (mg/L) x 0.001
- Waktu Tinggal Hidrolis / HRT (Jam)= [ Volume Bak Reaktor (m3) / Debit Air Limbah (m3/hari) ] x 24 jam
- Efisiensi Penyisihan / Removal (%)= [ (Konsentrasi_Inlet - Konsentrasi_Outlet) / Konsentrasi_Inlet ] x 100%
- Rasio Biodegradabilitas (BOD5/COD)= Jika >= 0.5 (Mudah diolah secara biologis) | Jika < 0.3 (Butuh Fisik-Kimia)

2. BAKU MUTU AIR LIMBAH DOMESTIK (PERMEN LHK NO. 68 TAHUN 2016):
pH: 6.0 - 9.0 | BOD5 <= 30 mg/L | COD <= 100 mg/L | TSS <= 30 mg/L | Minyak & Lemak <= 5 mg/L | Amoniak <= 10 mg/L`,
    workflowSteps: [
      "Tahap 1 (Karakterisasi Inlet & Pemisahan Sumber Limbah): Pisahkan saluran air hujan (drainase) dari saluran air limbah, dan pasang Grease Trap pada jalur limbah dapur/restoran sebelum masuk ke IPAL.",
      "Tahap 2 (Pengendalian Ekualisasi & Keseimbangan Nutrisi): Pantau pH di bak ekualisasi (6.5-8.5) dan jaga rasio nutrisi mikroba aerobik BOD : Nitrogen : Fosfor pada proporsi mendekati 100 : 5 : 1.",
      "Tahap 3 (Pemantauan Reaktor Biologis Aerob): Jaga konsentrasi Dissolved Oxygen (DO) di bak aerasi minimal 2.0 mg/L dan lakukan uji pengendapan lumpur SV30 (Sludge Volume Index 30 menit ideal 300-500 mL/L).",
      "Tahap 4 (Pengambilan Sampel Outlet & Uji Laboratorium Terakreditasi): Ambil sampel air limbah pada titik penaatan (Outlet IPAL) sesuai metode SNI dan uji parameter wajib setiap bulan.",
      "Tahap 5 (Pelaporan SIMPEL KLHK & Siklus PDCA ISO 14001): Dokumentasikan debit harian pada logbook flowmeter dan laporkan kepatuhan baku mutu secara berkala dalam dokumen UKL-UPL/AMDAL.",
    ],
    pitfalls: [
      {
        mistake:
          "Membuang sisa minyak goreng bekas dapur restoran dan air bilasan deterjen disinfektan klorin dosis tinggi langsung ke dalam bak biologi IPAL.",
        expertSolution:
          "Lemak yang tidak tertahan Grease Trap akan menyelimuti flok bakteri menghalangi difusi oksigen, sedangkan klorin membunuh mikroba pengurai di bak aerasi.",
      },
      {
        mistake:
          "Melakukan pengenceran air limbah menggunakan air bersih sumur/PDAM sebelum titik outlet agar konsentrasi mg/L terlihat turun.",
        expertSolution:
          "Pengenceran air limbah (dilution) dilarang keras oleh regulasi lingkungan hidup; kepatuhan diukur dari efisiensi pengolahan nyata dan total beban pencemaran (kg/hari).",
      },
      {
        mistake:
          "Mematikan blower aerator IPAL aerobik sepanjang malam demi menghemat tagihan listrik sehingga bakteri aerob mati dan bak mengeluarkan bau busuk gas H2S.",
        expertSolution:
          "Bakteri aerob membutuhkan suplai oksigen kontinu; gunakan pengatur siklus intermittent timer terukur atau inverter VFD dengan tetap menjaga kadar DO >= 2.0 mg/L.",
      },
    ],
    pdf: {
      id: "pdf-env-01",
      title:
        "Buku Ajar & Praktikum: Pengendalian Pencemaran Air (PPPA/POPAL), Parameter BOD/COD/DO/TSS & Sistem Manajemen ISO 14001:2015",
      filename:
        "MODUL-ENV-01-Pengendalian-Pencemaran-Air-IPAL-BOD-COD-dan-Sistem-ISO14001.pdf",
      folderPath: "public/pustaka-modul/09-lingkungan/",
      fileUrl:
        "/pustaka-modul/09-lingkungan/MODUL-ENV-01-Pengendalian-Pencemaran-Air-IPAL-BOD-COD-dan-Sistem-ISO14001.pdf",
      certStandard: "BNSP PPPA/POPAL (E.370000) & ISO 14001:2015",
      externalSourceUrl: "https://ppkl.menlhk.go.id/",
    },
  },

  // 10 - BISNIS
  "bis-marketing": {
    courseId: "bis-marketing",
    fieldId: "bisnis",
    theoryFoundation:
      "Strategi Pemasaran Digital, Optimasi Mesin Pencari (SEO/SEM), dan Copywriting (standar BNSP M.70MKT00 & Google Ads Certification) mengubah pendekatan pemasaran dari promosi masal spekulatif menjadi sistem akuisisi pelanggan terukur berbasis data (Performance Marketing). Fondasi strategis dimulai dari pemetaan STP (Segmentation, Targeting, Positioning) dan perumusan Unique Selling Proposition (USP) yang menjawab masalah spesifik segmen pasar.",
    architectureMechanism:
      "Dalam eksekusi kampanye digital, pelanggan digerakkan melalui corong konversi (Conversion Funnel): tahap Top of Funnel (TOFU - Awareness melalui impresi konten/iklan), Middle of Funnel (MOFU - Consideration melalui klik menuju Landing Page dan edukasi nilai produk), hingga Bottom of Funnel (BOFU - Conversion transaksi pembayaran dan Retensi). Efisiensi anggaran iklan dievaluasi secara ketat menggunakan metrik CTR, CPC, CVR, CPA (Cost Per Acquisition), dan ROAS (Return on Ad Spend).",
    technicalReferenceTitle:
      "RUMUS ANALITIK DIGITAL MARKETING (ROAS, CPA, CTR, CVR) & KERANGKA COPYWRITING AIDA",
    technicalReferenceCode: `1. RUMUS EVALUASI KINERJA KAMPANYE IKLAN DIGITAL (STANDAR BNSP M.70MKT00):
- Click-Through Rate (CTR %)       = (Jumlah Klik / Jumlah Impresi Tayang) x 100%
- Conversion Rate (CVR %)          = (Jumlah Transaksi Pembelian / Jumlah Klik Landing Page) x 100%
- Cost Per Click (CPC)             = Total Biaya Iklan / Jumlah Klik
- Cost Per Acquisition (CPA)       = Total Biaya Iklan / Jumlah Transaksi Pembelian
- Return on Ad Spend (ROAS)        = Total Omzet Pendapatan Iklan / Total Biaya Iklan
- Break-Even ROAS Minimum          = 1 / Persentase Gross Margin Produk
  (Contoh: Harga jual Rp 200.000, HPP Rp 120.000 -> Margin 40% [0.4] -> Break-Even ROAS = 1 / 0.4 = 2.5x)

2. STRUKTUR COPYWRITING PERSUASIF (FORMULA AIDA & PAS):
- AIDA : Attention (Headline memikat) -> Interest (Fakta relevan) -> Desire (Manfaat & Bukti Sosial) -> Action (CTA)
- PAS  : Problem (Masalah audiens) -> Agitate (Dampak jika dibiarkan) -> Solution (Solusi produk spesifik)`,
    workflowSteps: [
      "Tahap 1 (Riset Pasar, Buyer Persona & Audit Kata Kunci): Identifikasi kata kunci ber-intensi beli tinggi (Transactional/Commercial Intent) dengan volume pencarian optimal.",
      "Tahap 2 (Optimasi SEO On-Page & Kecepatan Landing Page): Susun struktur heading H1-H3, Meta Title/Description, kecepatan muat halaman < 2.5 detik, dan tombol Call-to-Action yang jelas.",
      "Tahap 3 (Perancangan Materi Kreatif & A/B Testing Copywriting): Buat minimal 2 variasi headline dan visual iklan menggunakan kerangka AIDA/PAS untuk menguji mana yang menghasilkan CTR tertinggi.",
      "Tahap 4 (Konfigurasi Pixel Tracking & Peluncuran Kampanye): Pasang event tracking (ViewContent, AddToCart, InitiateCheckout, Purchase) agar algoritma iklan dapat mengoptimalkan konversi.",
      "Tahap 5 (Audit Metrik Corong & Realokasi Anggaran): Analisis rasio CTR, CVR, CPA, dan ROAS; matikan iklan dengan CPA melebihi margin laba dan tingkatkan anggaran pada kampanye dengan ROAS di atas target.",
    ],
    pitfalls: [
      {
        mistake:
          "Merasa kampanye iklan sudah menguntungkan hanya karena memperoleh nilai ROAS 2.0x, padahal margin laba kotor produknya hanya 30% (Break-Even ROAS = 3.33x).",
        expertSolution:
          "Selalu hitung Break-Even ROAS (1 / % Margin Kotor) terlebih dahulu sebelum menjalankan iklan berbayar agar setiap transaksi tidak justru menggerus modal.",
      },
      {
        mistake:
          "Menyalahkan materi visual iklan saat jumlah klik (CTR) sudah sangat tinggi (> 3%), tetapi tidak ada satu pun pengunjung yang membeli di website (CVR < 0.2%).",
        expertSolution:
          "Jika CTR tinggi namun CVR rendah, masalah berada pada halaman tujuan (Landing Page lambat, harga tidak kompetitif, atau alur checkout rumit), bukan pada gambar iklannya.",
      },
      {
        mistake:
          "Menjejalkan puluhan kata kunci secara berulang-ulang dan tidak alami di dalam satu paragraf artikel (Keyword Stuffing) yang justru terkena penalti mesin pencari.",
        expertSolution:
          "Tulis konten yang menjawab maksud pencarian pengguna (Search Intent) secara komprehensif, terstruktur, dan gunakan variasi sinonim semantik secara alami.",
      },
    ],
    pdf: {
      id: "pdf-biz-01",
      title:
        "Buku Ajar & Praktikum: Strategi Digital Marketing, STP Positioning, SEO/SEM & Analisis Metrik ROAS, CPA, CTR (Standar BNSP M.70MKT00)",
      filename:
        "MODUL-BIZ-01-Digital-Marketing-Conversion-Funnel-SEO-SEM-dan-Kalkulasi-ROAS-CPA.pdf",
      folderPath: "public/pustaka-modul/10-bisnis/",
      fileUrl:
        "/pustaka-modul/10-bisnis/MODUL-BIZ-01-Digital-Marketing-Conversion-Funnel-SEO-SEM-dan-Kalkulasi-ROAS-CPA.pdf",
      certStandard: "BNSP Digital Marketing (M.70MKT00) & Google Ads Certification",
      externalSourceUrl: "https://skillshop.withgoogle.com/",
    },
  },

  "bis-ecommerce": {
    courseId: "bis-ecommerce",
    fieldId: "bisnis",
    theoryFoundation:
      "Manajemen Operasional E-Commerce, Ritel Digital Omnichannel, dan Prosedur Ekspor UMKM (standar BNSP G.46RIT00 & perdagangan internasional Incoterms 2020) mengintegrasikan pengelolaan katalog produk digital, sinkronisasi stok gudang (Warehouse Management), layanan pelanggan responsif, hingga kepatuhan kepabeanan lintas negara. Dalam ekosistem Omnichannel, stok produk yang dijual di website mandiri, berbagai marketplace, dan toko fisik dihubungkan ke satu basis data inventori terpusat.",
    architectureMechanism:
      "Pengendalian stok menggunakan sistem kode unik SKU (Stock Keeping Unit) serta perhitungan Safety Stock dan Reorder Point (ROP) untuk mencegah pembatalan pesanan akibat kehabisan barang (stockout). Pada transaksi ekspor produk kriya, fesyen, atau komoditas pertanian Bali ke pasar global, eksportir wajib menguasai penentuan kode klasifikasi HS Code, pemilihan syarat penyerahan barang Incoterms 2020 (EXW, FOB, CIF, DDP), serta penyusunan dokumen pengapalan (Invoice, Packing List, Bill of Lading, Certificate of Origin / SKA, dan PEB).",
    technicalReferenceTitle:
      "RUMUS INVENTORI (SAFETY STOCK & ROP) SERTA STANDAR DOKUMEN EKSPOR INCOTERMS 2020",
    technicalReferenceCode: `1. RUMUS PENGENDALIAN PERSEDIAAN GUDANG E-COMMERCE (INVENTORY CONTROL):
- Safety Stock (Unit)       = (Penjualan Harian Maks x Lead Time Maks) - (Penjualan Rata2 x Lead Time Rata2)
- Reorder Point / ROP (Unit)= (Penjualan Harian Rata-rata x Lead Time Pasokan Hari) + Safety Stock
- Average Order Value (AOV) = Total Omzet Penjualan / Jumlah Pesanan Transaksi

2. PEMBAGIAN TANGGUNG JAWAB INCOTERMS 2020 (KAMAR DAGANG INTERNASIONAL / ICC):
- EXW (Ex Works)                : Pembeli menanggung seluruh biaya & risiko sejak barang diambil di gudang penjual
- FOB (Free On Board)           : Penjual menanggung biaya & mengurus ekspor hingga barang dimuat di atas kapal muat
- CIF (Cost, Insurance, Freight): Penjual wajib membayar biaya kapal (Freight) + Asuransi kargo hingga pelabuhan tujuan`,
    workflowSteps: [
      "Tahap 1 (Standarisasi Kode SKU & Optimasi Katalog): Buat penamaan SKU terstruktur (Kategori-Model-Warna-Ukuran), foto produk berlatar bersih multi-sudut, dan tabel spesifikasi dimensi akurat.",
      "Tahap 2 (Kalkulasi Safety Stock & Integrasi Omnichannel): Hitung titik pemesanan ulang (ROP) setiap SKU laku keras (Fast-Moving) dan aktifkan sinkronisasi stok otomatis antar-marketplace.",
      "Tahap 3 (Strategi Peningkatan AOV & Konversi Toko): Terapkan paket hemat (Product Bundling), Cross-Selling produk pelengkap, dan respons chat pelanggan di bawah 5 menit.",
      "Tahap 4 (Klasifikasi HS Code & Kontrak Ekspor): Tentukan 8-10 digit kode HS bersama pembeli luar negeri, sepakati Incoterms (FOB/CIF) dan metode pembayaran (Letter of Credit / T/T).",
      "Tahap 5 (Penerbitan Dokumen Pengapalan & Kepabeanan): Siapkan Commercial Invoice, Packing List, pengurusan SKA/COO (untuk keringanan bea masuk FTA), PEB Bea Cukai, dan Bill of Lading.",
    ],
    pitfalls: [
      {
        mistake:
          "Menjual stok barang yang sama di 4 marketplace berbeda tanpa sistem sinkronisasi inventori dan tanpa Safety Stock sehingga terjadi pesanan ganda saat stok fisik sudah habis.",
        expertSolution:
          "Gunakan pengelola inventori terpusat, sisihkan buffer Safety Stock, dan segera lakukan pemesanan ulang ke pemasok saat stok menyentuh angka Reorder Point (ROP).",
      },
      {
        mistake:
          "Menyepakati harga kontrak ekspor dengan skema CIF (Cost, Insurance, and Freight) namun hanya menghitung harga barang di gudang tanpa memasukkan biaya kontainer kapal dan asuransi laut.",
        expertSolution:
          "Pahami struktur biaya Incoterms 2020: untuk harga CIF, tambahkan biaya Trucking ke pelabuhan, THC, Custom Clearance (PEB), Ocean Freight, dan premi asuransi ke dalam komponen harga.",
      },
      {
        mistake:
          "Mengekspor produk berbahan kayu atau hasil pertanian tanpa menyertakan dokumen Phytosanitary Certificate / V-Legal SVLK sehingga kontainer ditahan di pelabuhan negara tujuan.",
        expertSolution:
          "Periksa regulasi karantina dan standar teknis negara tujuan berdasarkan HS Code sebelum pengapalan dimulai.",
      },
    ],
    pdf: {
      id: "pdf-biz-02",
      title:
        "Buku Ajar & Praktikum: Operasional Toko E-Commerce Omnichannel, Manajemen SKU & Prosedur Ekspor (Incoterms 2020 & HS Code)",
      filename:
        "MODUL-BIZ-02-Manajemen-ECommerce-Omnichannel-dan-Prosedur-Ekspor-Incoterms.pdf",
      folderPath: "public/pustaka-modul/10-bisnis/",
      fileUrl:
        "/pustaka-modul/10-bisnis/MODUL-BIZ-02-Manajemen-ECommerce-Omnichannel-dan-Prosedur-Ekspor-Incoterms.pdf",
      certStandard: "BNSP Operasional E-Commerce (G.46RIT00) & Ekspor Perdagangan",
      externalSourceUrl: "https://inaexport.id/",
    },
  },

  "bis-analitik": {
    courseId: "bis-analitik",
    fieldId: "bisnis",
    theoryFoundation:
      "Akuntansi Keuangan UMKM (standar SAK EMKM Ikatan Akuntan Indonesia & skema BNSP Teknisi Akuntansi Yunior M.692000), Perhitungan Harga Pokok Penjualan (HPP), dan Analitik Kelayakan Bisnis merupakan fondasi pengambilan keputusan finansial yang sehat. Siklus akuntansi memproses bukti transaksi harian melalui penjurnalan berpasangan (Double-Entry Bookkeeping), pemindahbukuan ke Buku Besar, Neraca Saldo, Jurnal Penyesuaian, hingga penyajian Laporan Laba Rugi dan Laporan Posisi Keuangan (Neraca).",
    architectureMechanism:
      "Dalam akuntansi manajemen dan perencanaan usaha, setiap biaya diklasifikasikan ke dalam Biaya Tetap (Fixed Cost yang tidak berubah mengikuti volume produksi jangka pendek, seperti sewa gedung dan gaji staf tetap) serta Biaya Variabel (Variable Cost yang berubah proporsional per unit produk, seperti bahan baku dan kemasan). Selisih antara harga jual per unit dan biaya variabel per unit menghasilkan Margin Kontribusi yang digunakan untuk menghitung titik impas Break-Even Point (BEP).",
    technicalReferenceTitle:
      "PERSAMAAN AKUNTANSI SAK EMKM, SALDO NORMAL DEBIT-KREDIT & RUMUS BEP / LTV:CAC",
    technicalReferenceCode: `1. PERSAMAAN DASAR AKUNTANSI & ATURAN SALDO NORMAL AKUN (SAK EMKM):
ASET = LIABILITAS (UTANG) + EKUITAS (MODAL) + (PENDAPATAN - BEBAN)
- Kelompok Aset & Beban                   : Bertambah di DEBIT  | Berkurang di KREDIT | Saldo Normal: DEBIT
- Kelompok Liabilitas, Ekuitas, Pendapatan: Bertambah di KREDIT | Berkurang di DEBIT  | Saldo Normal: KREDIT

2. RUMUS HARGA POKOK PENJUALAN (HPP), BREAK-EVEN POINT (BEP) & UNIT ECONOMICS:
- HPP Dagang / Manufaktur   = Persediaan Awal + Pembelian Bersih (atau Biaya Produksi) - Persediaan Akhir
- Margin Kontribusi / Unit  = Harga Jual per Unit - Biaya Variabel per Unit
- BEP (dalam Unit Terjual)  = Total Biaya Tetap (Fixed Cost) / Margin Kontribusi per Unit
- BEP (dalam Nilai Rupiah)  = Total Biaya Tetap / [ 1 - (Biaya Variabel per Unit / Harga Jual per Unit) ]
- Rasio LTV : CAC           = Customer Lifetime Value / Customer Acquisition Cost (Target Sehat >= 3 : 1)`,
    workflowSteps: [
      "Tahap 1 (Pemisahan Entitas Keuangan & Bagan Akun): Pisahkan rekening bank pribadi pemilik dari rekening operasional usaha (Business Entity Concept) dan susun kode Bagan Akun (Chart of Accounts).",
      "Tahap 2 (Kalkulasi HPP & Penetapan Harga Jual): Hitung seluruh komponen bahan baku langsung, tenaga kerja langsung, dan overhead produksi untuk menentukan HPP per unit yang akurat.",
      "Tahap 3 (Pencatatan Jurnal Umum & Buku Besar): Catat setiap transaksi secara kronologis dengan keseimbangan total nilai Debit sama dengan total nilai Kredit.",
      "Tahap 4 (Penyusunan Laporan Laba Rugi & Neraca SAK EMKM): Susun Laporan Laba Rugi periode berjalan dan pindahkan laba bersih ke akun Saldo Laba pada Neraca akhir periode.",
      "Tahap 5 (Analisis Titik Impas BEP & Arus Kas): Hitung target penjualan bulanan minimum (BEP) dan jaga rasio likuiditas kas operasional minimal 3-6 bulan biaya tetap.",
    ],
    pitfalls: [
      {
        mistake:
          "Mencampuradukkan uang kas usaha dengan pengeluaran belanja rumah tangga pribadi pemilik sehingga laba riil usaha tidak dapat diaudit.",
        expertSolution:
          "Patuhi prinsip Entitas Ekonomi (Economic Entity Assumption): setiap pengambilan uang oleh pemilik wajib dicatat secara resmi pada akun Prive / Penarikan Pemilik.",
      },
      {
        mistake:
          "Menentukan harga jual produk hanya dengan mengikuti harga kompetitor tanpa menghitung komponen biaya penyusutan alat, biaya pengemasan, dan potongan biaya admin platform.",
        expertSolution:
          "Susun struktur HPP dan biaya variabel penjualan secara lengkap (termasuk fee marketplace 5-10%) agar Margin Kontribusi per unit tetap bernilai positif.",
      },
      {
        mistake:
          "Menganggap bisnis yang memiliki angka Laba Bersih tinggi di kertas otomatis aman, padahal seluruh penjualannya berbentuk piutang macet dan kas tunai kosong.",
        expertSolution:
          "Pantau Arus Kas Operasional (Operating Cash Flow) dan umur piutang (Aging Receivable) secara ketat karena bisnis gagal bayar disebabkan oleh kehabisan kas likuid.",
      },
    ],
    pdf: {
      id: "pdf-biz-03",
      title:
        "Buku Ajar & Praktikum: Siklus Akuntansi Keuangan SAK EMKM, Analisis Break-Even Point (BEP) & Unit Economics (LTV:CAC)",
      filename:
        "MODUL-BIZ-03-Akuntansi-Keuangan-SAK-EMKM-Break-Even-Point-dan-Unit-Economics.pdf",
      folderPath: "public/pustaka-modul/10-bisnis/",
      fileUrl:
        "/pustaka-modul/10-bisnis/MODUL-BIZ-03-Akuntansi-Keuangan-SAK-EMKM-Break-Even-Point-dan-Unit-Economics.pdf",
      certStandard: "BNSP Teknisi Akuntansi Yunior (M.692000) & SAK EMKM IAI",
      externalSourceUrl: "https://web.iaiglobal.or.id/",
    },
  },

  // 11 - PARIWISATA
  "par-frontoffice": {
    courseId: "par-frontoffice",
    fieldId: "pariwisata",
    theoryFoundation:
      "Operasional Divisi Kamar (Rooms Division: Front Office & Housekeeping) berstandar ASEAN Mutual Recognition Arrangement on Tourism Professionals (ASEAN MRA-TP) dan SKKNI Perhotelan (I.55HDR00) merupakan jantung pendapatan utama industri akomodasi. Front Office mengelola siklus perjalanan tamu (Guest Cycle: Pre-Arrival, Arrival, Occupancy, Departure) serta pencatatan akuntansi tamu (Guest Folio) di dalam sistem Property Management System (PMS).",
    architectureMechanism:
      "Secara paralel, departemen Housekeeping memastikan kesiapan standar kebersihan, higienitas, dan kenyamanan kamar melalui pembaruan kode status kamar secara real-time (Vacant Dirty -> Vacant Clean -> Vacant Clean Inspected / VCI). Kinerja finansial manajemen hotel dievaluasi setiap hari menggunakan tiga indikator utama: Tingkat Hunian Kamar (Occupancy Rate), Rata-rata Harga Kamar Terjual (Average Daily Rate / ADR), dan Pendapatan per Kamar Tersedia (Revenue Per Available Room / RevPAR).",
    technicalReferenceTitle:
      "RUMUS METRIK PENDAPATAN HOTEL (OCCUPANCY, ADR, RevPAR) & SOP ROOMS DIVISION",
    technicalReferenceCode: `1. RUMUS INDIKATOR KINERJA UTAMA PERHOTELAN (HOTEL REVENUE KPI):
- Occupancy Rate (%)                  = (Jumlah Kamar Terjual / Total Kamar Tersedia) x 100%
- Average Daily Rate / ADR (Rp)       = Total Pendapatan Kamar / Jumlah Kamar Terjual
- Revenue Per Available Room (RevPAR) = Total Pendapatan Kamar / Total Kamar Tersedia
  * Rumus Alternatif RevPAR           = Occupancy Rate (%) x ADR

2. KODE STATUS KAMAR STANDAR HOUSEKEEPING & FRONT OFFICE (PMS):
- OCC (Occupied Clean / Dirty) : Kamar sedang dihuni tamu (terdaftar aktif)
- VD  (Vacant Dirty)           : Tamu baru saja Check-Out, kamar belum dibersihkan
- VC  (Vacant Clean)           : Kamar sudah dibersihkan Room Attendant, menunggu inspeksi Supervisor
- VCI (Vacant Clean Inspected) : Kamar telah lulus pemeriksaan Supervisor & SIAP DIJUAL saat Check-In
- OOO (Out of Order)           : Kamar rusak berat/renovasi, dikurangi dari inventori kamar tersedia`,
    workflowSteps: [
      "Tahap 1 (Persiapan Kedatangan & Blocking Kamar): Periksa daftar Expected Arrival List (EAL), permintaan khusus tamu VIP/repeater, dan pastikan kamar berstatus VCI di sistem PMS.",
      "Tahap 2 (Prosedur Registrasi Check-In): Sambut tamu dengan standar grooming prima, verifikasi kartu identitas/paspor dan lembar registrasi, ambil jaminan deposit/pre-authorisation, dan serahkan kunci kamar.",
      "Tahap 3 (SOP Make-Up Room Housekeeping): Ketuk pintu 3 kali sambil menyebut 'Housekeeping', buka tirai/ventilasi, tarik linen kotor (stripping bed), pasang linen bersih dengan sudut amplop (Hospital Corner), dan sanitasi kamar mandi.",
      "Tahap 4 (Audit Night Audit & Rekonsiliasi Folio): Verifikasi seluruh transaksi posting harian kamar dan outlet F&B serta cetak laporan kinerja Occupancy, ADR, dan RevPAR.",
      "Tahap 5 (Prosedur Check-Out & Penyelesaian Tagihan): Cetak Guest Folio untuk ditinjau tamu, proses pembayaran akhir, kembalikan deposit, dan ubah status kamar di PMS menjadi Vacant Dirty.",
    ],
    pitfalls: [
      {
        mistake:
          "Menyerahkan kunci kamar kepada tamu Check-In untuk kamar yang masih berstatus VC (Vacant Clean) sebelum diperiksa oleh Floor Supervisor menjadi VCI (Vacant Clean Inspected).",
        expertSolution:
          "Resepsionis hanya boleh memberikan kunci kamar yang telah berstatus VCI di PMS untuk menjamin tidak ada kelengkapan amenities yang terlewat atau kendala teknis di kamar.",
      },
      {
        mistake:
          "Menggunakan satu helai kain lap yang sama untuk membersihkan kloset kamar mandi lalu mengelap meja tulis dan cermin wastafel kamar tamu.",
        expertSolution:
          "Terapkan sistem Color-Coded Cleaning Cloths (pembedaan warna kain lap khusus kloset, wastafel, kaca, dan perabot kayu) untuk mencegah kontaminasi bakteri silang.",
      },
      {
        mistake:
          "Menilai kesuksesan pendapatan hotel hanya dari tingginya angka Occupancy Rate (misal 95%) tanpa memperhatikan bahwa harga kamar dibanting terlalu murah sehingga RevPAR merosot.",
        expertSolution:
          "Gunakan metrik RevPAR (Occupancy x ADR) sebagai tolok ukur keseimbangan antara tingkat keterisian kamar dan optimalisasi harga jual (Yield Management).",
      },
    ],
    pdf: {
      id: "pdf-par-01",
      title:
        "Buku Ajar & Praktikum: Operasional Front Office, Housekeeping & Kalkulasi Metrik Hotel (Occupancy, ADR, RevPAR) Standar ASEAN MRA-TP",
      filename:
        "MODUL-PAR-01-Operasional-Front-Office-Housekeeping-dan-Metrik-RevPAR-ADR-ASEAN-MRATP.pdf",
      folderPath: "public/pustaka-modul/11-pariwisata/",
      fileUrl:
        "/pustaka-modul/11-pariwisata/MODUL-PAR-01-Operasional-Front-Office-Housekeeping-dan-Metrik-RevPAR-ADR-ASEAN-MRATP.pdf",
      certStandard: "ASEAN MRA-TP & BNSP Perhotelan (I.55HDR00)",
      externalSourceUrl: "https://asean.org/",
    },
  },

  "par-ekowisata": {
    courseId: "par-ekowisata",
    fieldId: "pariwisata",
    theoryFoundation:
      "Manajemen Desa Wisata, Kepemanduan Ekowisata (standar BNSP N.79JPW00), dan Kriteria Pariwisata Berkelanjutan Global (GSTC & filosofi Tri Hita Karana) mengedepankan pariwisata berkualitas yang melestarikan alam, menghormati kearifan adat lokal, dan mendistribusikan manfaat ekonomi langsung kepada masyarakat desa. Seorang pemandu ekowisata (Ecotour Guide) berperan sebagai interpreter yang menerjemahkan fenomena ekologi dan sejarah budaya menjadi kisah edukatif yang menggugah kesadaran konservasi wisatawan.",
    architectureMechanism:
      "Dalam perancangan paket perjalanan (Tour Planning & Costing), perencana tur menyusun jadwal perjalanan logis (Itinerary Distribution of Time) serta menghitung struktur biaya tetap (sewa bus, fee pemandu) dan biaya variabel per peserta (tiket objek, konsumsi) untuk menentukan harga jual paket per pax. Pada tingkat pengelolaan kawasan destinasi, perhitungan Daya Dukung Kawasan Wisata (Carrying Capacity metode Cifuentes: PCC, RCC, ECC) diterapkan untuk membatasi kuota kunjungan harian agar ekosistem tidak mengalami kerusakan akibat overtourism.",
    technicalReferenceTitle:
      "RUMUS TOUR COSTING PER PAX, DAYA DUKUNG WISATA (PCC, RCC, ECC) & KRITERIA GSTC",
    technicalReferenceCode: `1. RUMUS PERHITUNGAN HARGA PAKET WISATA (TOUR COSTING PER PAX):
- Total Biaya Tetap per Peserta = Total Fixed Cost (Transportasi + Fee Guide + Tol/Parkir) / Jumlah Peserta (Pax)
- Total HPP Paket per Peserta   = Total Biaya Tetap per Peserta + Variable Cost per Peserta (Tiket + Makan + Air)
- Harga Jual Paket per Peserta  = Total HPP Paket per Peserta + Margin Keuntungan Biro Perjalanan (%)
  * Catatan Complimentary (FOC) : Biaya untuk peserta gratis (Tour Leader) dibebankan ke pembagi peserta berbayar.

2. RUMUS DAYA DUKUNG KAWASAN EKOWISATA (METODE CIFUENTES):
- PCC (Physical Carrying Capacity)  = (Luas Area Jalur / Luas Ruang per Wisatawan) x (Jam Buka / Durasi Kunjungan)
- RCC (Real Carrying Capacity)      = PCC x Cf_1 (Curah Hujan) x Cf_2 (Kemiringan) x Cf_3 (Gangguan Satwa)
- ECC (Effective Carrying Capacity) = RCC x Kapasitas Manajemen Pengelola Destinasi (%)`,
    workflowSteps: [
      "Tahap 1 (Inventarisasi Potensi 4A Desa Wisata): Petakan Attraction (alam/budaya), Accessibility (akses jalan), Amenity (homestay/toilet bersih), dan Ancillary (kelembagaan Pokdarwis).",
      "Tahap 2 (Penyusunan Tour Itinerary & Kalkulasi Costing): Rancang rute perjalanan bebas putar-balik (no backtracking), alokasikan buffer waktu lalu lintas, dan hitung harga paket per pax.",
      "Tahap 3 (Briefing Pra-Tur & Etika Budaya Lokal): Berikan penjelasan keselamatan (Safety Briefing) serta aturan sopan santun berpakaian adat dan larangan di kawasan suci Pura sebelum memasuki lokasi.",
      "Tahap 4 (Pelaksanaan Interpretasi Tematik Lapangan): Gunakan prinsip interpretasi Freeman Tilden (mengaitkan objek dengan pengalaman wisatawan, mengungkap makna di balik fakta, dan memantik kepedulian).",
      "Tahap 5 (Audit Daya Dukung & Evaluasi Pasca-Tur): Pantau kepadatan pengunjung terhadap batas ECC, terapkan prinsip Leave No Trace (bebas sampah plastik), dan kumpulkan umpan balik wisatawan.",
    ],
    pitfalls: [
      {
        mistake:
          "Menyusun jadwal perjalanan (Itinerary) dengan estimasi waktu tempuh di kertas tanpa memperhitungkan waktu kemacetan, waktu antre tiket, dan waktu istirahat toilet (Rest Stop).",
        expertSolution:
          "Selalu tambahkan buffer waktu 15-20% pada setiap perpindahan objek wisata agar seluruh jadwal kunjungan tidak molor berantakan.",
      },
      {
        mistake:
          "Membagikan biaya tetap (sewa bus dan fee guide) dengan jumlah total rombongan termasuk 2 orang Free of Charge (FOC / Tour Leader gratis) sehingga biro perjalanan merugi.",
        expertSolution:
          "Seluruh komponen biaya tetap maupun variabel dari peserta FOC wajib ditanggung dan dibagi hanya oleh jumlah peserta yang membayar (Paying Pax).",
      },
      {
        mistake:
          "Membiarkan ribuan wisatawan masuk serentak ke kawasan ekosistem rapuh atau pura kuno melampaui batas Effective Carrying Capacity (ECC) demi mengejar penjualan tiket harian.",
        expertSolution:
          "Terapkan sistem kuota reservasi terjadwal (Time-Slot Booking) dan rotasi jalur interpretasi sesuai angka ECC untuk menjaga kelestarian situs jangka panjang.",
      },
    ],
    pdf: {
      id: "pdf-par-02",
      title:
        "Buku Ajar & Praktikum: Kepemanduan Ekowisata (Tour Guiding), Standar Global GSTC, Carrying Capacity & Tri Hita Karana",
      filename:
        "MODUL-PAR-02-Kepemanduan-Ekowisata-Desa-Wisata-GSTC-dan-Carrying-Capacity.pdf",
      folderPath: "public/pustaka-modul/11-pariwisata/",
      fileUrl:
        "/pustaka-modul/11-pariwisata/MODUL-PAR-02-Kepemanduan-Ekowisata-Desa-Wisata-GSTC-dan-Carrying-Capacity.pdf",
      certStandard: "BNSP Pemandu Ekowisata (N.79JPW00) & Standar GSTC",
      externalSourceUrl: "https://www.gstcouncil.org/gstc-criteria/",
    },
  },

  "par-komunikasi": {
    courseId: "par-komunikasi",
    fieldId: "pariwisata",
    theoryFoundation:
      "Manajemen Food & Beverage (F&B) Service, Higiene Sanitasi Kuliner, dan Penanganan Keluhan Tamu (Service Recovery standar ASEAN MRA-TP D1.HOT.CL1.01) menggabungkan ketepatan prosedur pelayanan meja (Sequence of Service), keamanan pangan mikrobiologis di dapur komersial, serta kecerdasan emosional komunikasi lintas budaya. Dalam operasional kuliner, bakteri patogen pemicu keracunan makanan berkembang biak sangat pesat pada rentang suhu 5 C hingga 60 C (Temperature Danger Zone).",
    architectureMechanism:
      "Untuk menjamin keamanan pangan dan profitabilitas restoran, tim dapur menerapkan rotasi stok FIFO (First-In, First-Out), pemisahan talenan warna (Color-Coded Cutting Boards) untuk mencegah kontaminasi silang antara daging mentah dengan makanan siap saji, serta pengendalian Food Cost Percentage melalui Standard Recipe Card. Sementara di ruang makan dan MICE, setiap keluhan tamu ditangani secara terstruktur menggunakan protokol LAST (Listen, Apologize, Solve, Thank) untuk mengubah ketidakpuasan menjadi loyalitas.",
    technicalReferenceTitle:
      "STANDAR SUHU PANGAN (TEMPERATURE DANGER ZONE), RUMUS FOOD COST & PROTOKOL LAST",
    technicalReferenceCode: `1. PENGENDALIAN SUHU KEAMANAN PANGAN DAPUR HOTEL (FOOD SAFETY STANDAR WHO/HACCP):
- Penyimpanan Beku (Freezer)     : <= -18 C (Membekukan aktivitas mikroba)
- Penyimpanan Dingin (Chiller)   : 1 C s.d. 4 C (Bahan segar susu, daging siap olah, sayur)
- TEMPERATURE DANGER ZONE        : 5 C s.d. 60 C (Bakteri membelah diri tiap 20 menit; batas paparan maks 2 jam)
- Penyajian Panas (Hot Holding)  : >= 60 C (Suhu hidangan prasmanan / Chafing Dish wajib di atas 60 C)

2. KODE WARNA TALENAN DAPUR (MENCEGAH CROSS-CONTAMINATION) & RUMUS FOOD COST:
- Merah : Daging Merah Mentah | Kuning : Unggas Mentah | Biru : Ikan/Seafood | Hijau : Sayur/Buah | Putih : Roti/Keju
- Food Cost Percentage (%) = [ Harga Pokok Bahan Baku Resep (HPP) / Harga Jual Menu Bersih ] x 100%
- Protokol Penanganan Keluhan LAST : Listen (Dengarkan) -> Apologize (Minta Maaf) -> Solve (Solusi) -> Thank (Terima Kasih)`,
    workflowSteps: [
      "Tahap 1 (Persiapan Mise en Place & Sanitasi Area): Periksa kebersihan peralatan makan (chinaware, silverware, glassware bebas noda melalui polishing air panas) dan kelengkapan meja (table set-up).",
      "Tahap 2 (Pengendalian Penerimaan & Penyimpanan Bahan Dapur): Periksa suhu bahan pangan saat datang, beri label tanggal kedaluwarsa (FIFO), dan simpan di Chiller (<= 4 C) atau Freezer (<= -18 C).",
      "Tahap 3 (Pelaksanaan Sequence of Service & Verifikasi Alergi): Sambut tamu, sajikan menu, tanyakan pantangan diet atau alergi makanan (kacang, gluten, seafood) secara aktif saat Taking Order.",
      "Tahap 4 (Penanganan Keluhan dengan Metode LAST): Saat tamu menyampaikan komplain, dengarkan penuh perhatian tanpa menyela, sampaikan empati permohonan maaf, tarik hidangan bermasalah, dan berikan penggantian cepat.",
      "Tahap 5 (Pencatatan Logbook Incident & Evaluasi Food Cost): Dokumentasikan setiap insiden keluhan pada logbook briefing harian dan audit persentase Food Cost terhadap resep standar.",
    ],
    pitfalls: [
      {
        mistake:
          "Memotong dada ayam mentah di atas talenan lalu langsung menggunakan talenan dan pisau yang sama untuk memotong buah salad segar tanpa pencucian sanitasi.",
        expertSolution:
          "Disiplin gunakan talenan kode warna terpisah (Kuning untuk unggas mentah, Hijau untuk buah/sayur segar) guna mencegah kontaminasi silang bakteri Salmonella dan Campylobacter.",
      },
      {
        mistake:
          "Membiarkan hidangan berkuah santan atau daging pada meja prasmanan (buffet) dalam keadaan hangat suam-suam kuku (35 C - 45 C) selama lebih dari 4 jam.",
        expertSolution:
          "Suhu 35-45 C berada tepat di tengah Temperature Danger Zone; pastikan pemanas Chafing Dish menjaga suhu makanan >= 60 C dan ganti porsi secara berkala.",
      },
      {
        mistake:
          "Berdebat atau menyalahkan tamu/departemen lain di hadapan tamu saat menerima keluhan pesanan yang salah atau terlambat.",
        expertSolution:
          "Jangan pernah berargumen defensif; terapkan protokol LAST (Listen, Apologize, Solve, Thank) dan fokus pada penyelesaian masalah tamu terlebih dahulu.",
      },
    ],
    pdf: {
      id: "pdf-par-03",
      title:
        "Buku Ajar & Praktikum: Manajemen F&B Service, Keamanan Pangan Dapur (Temperature Danger Zone) & Service Recovery (Metode LAST)",
      filename:
        "MODUL-PAR-03-Manajemen-FnB-Service-Higiene-Dapur-Danger-Zone-dan-Service-Recovery-LAST.pdf",
      folderPath: "public/pustaka-modul/11-pariwisata/",
      fileUrl:
        "/pustaka-modul/11-pariwisata/MODUL-PAR-03-Manajemen-FnB-Service-Higiene-Dapur-Danger-Zone-dan-Service-Recovery-LAST.pdf",
      certStandard: "ASEAN MRA-TP F&B Division & Standar Higiene Kuliner",
      externalSourceUrl:
        "https://www.who.int/publications/i/item/9789241594639",
    },
  },
};

export function getMasterclassContentForModule(
  mod: LearningModule
): ModuleMasterclassContent {
  const template =
    COURSE_MASTERCLASS_TEMPLATES[mod.courseId] ||
    COURSE_MASTERCLASS_TEMPLATES["tkj-mtcna"];

  return {
    deepDiveChapters: [
      {
        chapterTitle: `BAB I: Landasan Teori, Arsitektur & Konsep Mendalam (${mod.moduleCode || mod.id.toUpperCase()})`,
        paragraphs: [
          mod.studyMaterial,
          template.theoryFoundation,
          `Dalam konteks penguasaan kompetensi ${mod.courseName} (${mod.semesterStage || "Kurikulum Inti"} - Level ${mod.level}), pembelajar dituntut tidak sekadar menghafal definisi permukaan, melainkan memahami hubungan kausalitas antar-komponen: ${mod.keyConcepts.join("; ")}. Penguasaan menyeluruh atas fondasi ini memastikan kesiapan menghadapi skenario kerja nyata maupun ujian sertifikasi resmi.`,
        ],
      },
      {
        chapterTitle: `BAB II: Mekanisme Kerja Teknis, Standar Operasional & Konteks Industri`,
        paragraphs: [
          template.architectureMechanism,
          mod.baliCaseStudy,
        ],
      },
    ],
    technicalReferenceTitle: template.technicalReferenceTitle,
    technicalReferenceCode: template.technicalReferenceCode,
    professionalWorkflowSteps: template.workflowSteps,
    pitfallComparisons: template.pitfalls,
    attachedPdf: template.pdf,
  };
}

export function getAllPustakaPdfByField(fieldId: string): AttachedModulePdf[] {
  const seen = new Set<string>();
  const result: AttachedModulePdf[] = [];

  for (const tpl of Object.values(COURSE_MASTERCLASS_TEMPLATES)) {
    if (tpl.fieldId === fieldId && !seen.has(tpl.pdf.id)) {
      seen.add(tpl.pdf.id);
      result.push(tpl.pdf);
    }
  }
  return result;
}
