export interface KisahNabi {
  id: number;
  name: string;
  arabic: string;
  description: string;
  miracles: string[];
}

export const kisahNabiData: KisahNabi[] = [
  {
    id: 1,
    name: "Nabi Adam",
    arabic: "آدَم",
    description: "Manusia dan khalifah pertama yang diciptakan Allah SWT dari tanah. Beliau diturunkan ke bumi bersama Siti Hawa setelah digoda oleh iblis untuk memakan buah terlarang di surga.",
    miracles: ["Manusia pertama ciptaan Allah", "Diajarkan segala nama benda oleh Allah"]
  },
  {
    id: 2,
    name: "Nabi Idris",
    arabic: "إِدْرِيس",
    description: "Nabi pertama yang diberikan kemampuan membaca dan menulis. Beliau diangkat ke langit oleh Allah SWT karena ketakwaannya yang luar biasa.",
    miracles: ["Bisa membaca dan menulis pertama kali", "Ahli astronomi dan perbintangan", "Merasakan sakaratul maut lalu dihidupkan kembali"]
  },
  {
    id: 3,
    name: "Nabi Nuh",
    arabic: "نُوح",
    description: "Diselamatkan dari banjir bandang dahsyat bersama sedikit pengikutnya di dalam bahtera besar setelah berdakwah selama 950 tahun namun hanya sedikit umatnya yang beriman.",
    miracles: ["Membuat bahtera raksasa melintasi banjir bandang", "Umur yang sangat panjang (mencapai 950 tahun dakwah)"]
  },
  {
    id: 4,
    name: "Nabi Hud",
    arabic: "هُود",
    description: "Diutus untuk kaum 'Aad yang unggul dalam teknologi dan bangunan namun sangat sombong. Mereka dihukum dengan angin topan yang sangat dahsyat.",
    miracles: ["Selamat dari angin badai yang menghancurkan seluruh kaum 'Aad"]
  },
  {
    id: 5,
    name: "Nabi Shaleh",
    arabic: "صَالِح",
    description: "Diutus kepada kaum Tsamud. Allah memberinya mukjizat unta betina yang keluar dari batu, namun kaumnya membunuh unta tersebut sehingga diazab dengan petir berkilauan.",
    miracles: ["Mengeluarkan unta betina hidup dari celah batu"]
  },
  {
    id: 6,
    name: "Nabi Ibrahim",
    arabic: "إِبْرَاهِيم",
    description: "Bapak para Nabi (Abul Anbiya). Diuji oleh Allah untuk menyembelih anaknya, Ismail. Beliau juga berani menghancurkan berhala-berhala Raja Namrud.",
    miracles: ["Tidak hangus dibakar api oleh Raja Namrud", "Membangun Ka'bah bersama Nabi Ismail", "Air zamzam terpancar di bawah telapak kaki anaknya"]
  },
  {
    id: 7,
    name: "Nabi Luth",
    arabic: "لُوط",
    description: "Diutus untuk kaum Sodom yang melakukan praktik seks sesama jenis. Allah menghancurkan wilayah mereka dengan hujan batu dan guncangan hebat.",
    miracles: ["Diselamatkan oleh Malaikat dari azab kota Sodom"]
  },
  {
    id: 8,
    name: "Nabi Ismail",
    arabic: "إِسْمَاعِيل",
    description: "Putra Nabi Ibrahim yang sangat taat berniat dikorbankan untuk Allah. Keturunan beliau adalah bangsa Arab dan Nabi Muhammad SAW.",
    miracles: ["Digantikan dengan domba saat akan disembelih", "Munculnya sumur air Zamzam di kakinya"]
  },
  {
    id: 9,
    name: "Nabi Ishaq",
    arabic: "إِسْحَاق",
    description: "Putra kedua Nabi Ibrahim dari Siti Sarah. Dari garis keturunannya lahir banyak nabi bagi Bani Israil.",
    miracles: ["Lahir dari ibu yang sudah sangat tua (Sarah)", "Meneruskan dakwah ketauhidan bapaknya"]
  },
  {
    id: 10,
    name: "Nabi Ya'qub",
    arabic: "يَعْقُوب",
    description: "Putra Nabi Ishaq. Beliau juga dikenal sebagai 'Israil', dan gelar ini menjadi cikal bakal sebutan Bani Israil. Ayah dari Nabi Yusuf.",
    miracles: ["Kesabaran luar biasa saat kehilangan Yusuf", "Menyembuhkan kebutaannya dengan usapan baju Yusuf"]
  },
  {
    id: 11,
    name: "Nabi Yusuf",
    arabic: "يُوسُف",
    description: "Diberi ketampanan luar biasa dan kemampuan menakwilkan mimpi. Dibuang oleh saudaranya ke sumur namun akhirnya menjadi bendahara negara Mesir.",
    miracles: ["Ketampanan yang membuat wanita memotong jarinya", "Ahli tafsir/takwil mimpi yang akurat"]
  },
  {
    id: 12,
    name: "Nabi Ayyub",
    arabic: "أَيُّوب",
    description: "Terkenal dengan kesabaran tingkat tinggi saat diuji dengan penyakit parah, kehancuran harta benda, dan kematian anak-anaknya.",
    miracles: ["Cepat sembuh dengan memukulkan kakinya ke tanah memancarkan air", "Kesabaran sempurna tak goyah sedikitpun"]
  },
  {
    id: 13,
    name: "Nabi Syu'aib",
    arabic: "شُعَيْب",
    description: "Diutus pada bangsa Madyan yang suka curang dalam berdagang. Beliau dijuluki Khatibul Anbiya (Pemberi pidato para nabi) karena kelancarannya berbicara.",
    miracles: ["Mendatangkan awan berapi dan gempa untuk kaum Madyan"]
  },
  {
    id: 14,
    name: "Nabi Musa",
    arabic: "مُوسَى",
    description: "Nabi yang berbicara langsung dengan Allah SWT. Berperang membebaskan Bani Israil dari perbudakan Fir'aun.",
    miracles: ["Tongkat membelah laut merah", "Tongkat menjadi ular besar", "Tangan mengeluarkan cahaya terang"]
  },
  {
    id: 15,
    name: "Nabi Harun",
    arabic: "هَارُون",
    description: "Saudara sekaligus juru bicara pendamping Nabi Musa saat menghadapi Fir'aun, karena Nabi Musa memiliki kekakuan lidah.",
    miracles: ["Kepiawaian dan kefasihan berbicara", "Tongkat yang diagungkan bani Israil"]
  },
  {
    id: 16,
    name: "Nabi Dzulkifli",
    arabic: "ذُوالْكِفْل",
    description: "Sangat taat beribadah dan selalu memegang kesabaran. Namanya Dzulkifli berarti 'Tanggupan', karena ia sanggup memegang banyak tanggung jawab puasa & shalat harian.",
    miracles: ["Menjadi raja pelindung dan tak pernah sekalipun marah atau batal puasa sunnahnya"]
  },
  {
    id: 17,
    name: "Nabi Daud",
    arabic: "دَاوُد",
    description: "Diberikan kitab Zabur. Mampu mengalahkan raksasa Jalut di masa muda dan menjadi raja besar Bani Israil.",
    miracles: ["Bisa melunakkan besi dengan tangan kosong", "Suara merdu saat membaca Zabur", "Mengerti suara burung/hewan gunung"]
  },
  {
    id: 18,
    name: "Nabi Sulaiman",
    arabic: "سُلَيْمَان",
    description: "Putra Nabi Daud yang menjadi raja paling kaya dan berkuasa. Diberi mukjizat menundukkan angin, jin, manusia, hingga binatang.",
    miracles: ["Berbicara bahasa binatang", "Memerintahkan dan mempekerjakan bangsa Jin", "Mengendalikan angin untuk berpindah"]
  },
  {
    id: 19,
    name: "Nabi Ilyas",
    arabic: "إِلْيَاس",
    description: "Diutus ke bangsa Ba'albek penyembah berhala. Menurunkan azab kemarau tiga tahun saat mereka berpaling dari seruannya.",
    miracles: ["Selamat dari kejahatan Raja Ahab dan selamat hidup sampai diangkat (seperti kepercayaan sebagian ulama)"]
  },
  {
    id: 20,
    name: "Nabi Ilyasa",
    arabic: "الْيَسَع",
    description: "Nabi penerus perjuangan dakwah Nabi Ilyas. Memimpin umat dari lembah Yordania yang tadinya diliputi kekeruhan masa.",
    miracles: ["Menghidupkan orang mati atas izin Allah", "Bisa menggandakan sumber air yang sedikit"]
  },
  {
    id: 21,
    name: "Nabi Yunus",
    arabic: "يُونُس",
    description: "Nabi yang sempat menyerah meninggalkan kaumnya di Ninawa. Beliau ditelan Ikan Paus dan kembali berdakwah setelah bertaubat. Kaumnya merupakan satu-satunya umat yang semua warganya akhirnya beriman sebelum di azab.",
    miracles: ["Tetap hidup dan selamat setelah tiga hari di dalam perut Ikan Nun (Paus/Hiu Besar)"]
  },
  {
    id: 22,
    name: "Nabi Zakariya",
    arabic: "زَكَرِيَّا",
    description: "Pengasuh Maryam ibu Nabi Isa. Beliau tak henti berdoa meminta keturunan hingga lanjut usia.",
    miracles: ["Dikaruniai anak (Nabi Yahya) padahal istrinya mandul dan keduanya sudah sangat tua renta"]
  },
  {
    id: 23,
    name: "Nabi Yahya",
    arabic: "يَحْيَى",
    description: "Dianugerahi hikmah (ilmu keagamaan dan sifat sabar) sejak masih kanak-kanak. Tidak pernah berdosa atau bermaksiat sedikitpun selama hidupnya.",
    miracles: ["Hafal kitab Taurat di usia sangat muda", "Kasih sayangnya pada hewan dan seluruh ciptaan luar biasa"]
  },
  {
    id: 24,
    name: "Nabi Isa",
    arabic: "عِيسَى",
    description: "Lahir tanpa seorang ayah melalui keajaiban tiupan roh kudus kepada Maryam. Diberikan Injil dan menyampaikan kedatangan Nabi terakhir (Ahmad). Beliau tidak dibunuh, melainkan diangkat Allah.",
    miracles: ["Bisa berbicara secara fasih sewaktu masih bayi dalam ayunan", "Menghidupkan orang yang sudah mati", "Menyembuhkan tuna netra dan kusta", "Bisa membuat burung hidup dari gumpalan tanah"]
  },
  {
    id: 25,
    name: "Nabi Muhammad",
    arabic: "مُحَمَّد",
    description: "Penutup Para Nabi (Khataman Nabiyyin). Diutus menyempurnakan akhlak manusia serta merangkum seluruh wahyu dengan kelengkapan syariat untuk segala umat dan zaman.",
    miracles: ["Mukjizat Terbesar Sepanjang Masa: Turunnya Kitab Suci Al-Qur'an", "Perjalanan Isra' Mi'raj di malam hari", "Membelah bulan dengan jari", "Air memancar dari celah jarinya"]
  }
];
