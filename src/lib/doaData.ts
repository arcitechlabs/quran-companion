export interface Doa {
  id: number;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  source: string;
  category: string;
}

export const categories = [
  'Semua',
  'Taubat',
  'Rezeki',
  'Harian',
  'Perlindungan',
  'Keluarga',
  'Kesembuhan',
  'Ibadah',
  "Al-Qur'an",
];

export const doaData: Doa[] = [
  // --- TAUBAT & ISTIGHFAR ---
  {
    id: 1,
    title: 'Sayyidul Istighfar',
    arabic: 'اللّٰهُمَّ أَنْتَ رَبِّيْ لَا إِلٰهَ إِلَّا أَنْتَ خَلَقْتَنِيْ وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطعتُ أَعُوْذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوْءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوْءُ بِذَنْبِيْ فَاغْفِرْ لِيْ فَإِنَّهُ لَا يَغْفِرُ الذُّنُوْبَ إِلَّا أَنْتَ',
    latin: "Allahumma anta rabbii laa ilaaha illaa anta, khalaqtanii wa ana 'abduka, wa ana 'alaa 'ahdika wa wa'dika mas-tatha'tu, a'uudzu bika min syarri maa shana'tu, abuu-u laka bini'matika 'alayya wa abuu-u bidzanbii, faghfirlii fa-innahu laa yaghfirudz-dzunuuba illaa anta",
    translation: 'Ya Allah, Engkau adalah Tuhanku, tidak ada tuhan yang berhak disembah kecuali Engkau. Engkau telah menciptakanku dan aku adalah hamba-Mu. Aku menetapi perjanjian-Mu dan janji-Mu sesuai dengan kemampuanku. Aku berlindung kepada-Mu dari keburukan apa yang telah aku perbuat. Aku mengakui nikmat-Mu kepadaku dan aku mengakui dosaku kepada-Mu, maka ampunilah aku. Sebab tidak ada yang dapat mengampuni dosa melainkan Engkau.',
    source: 'HR. Bukhari',
    category: 'Taubat'
  },
  {
    id: 2,
    title: 'Doa Nabi Adam (Mohon Ampunan)',
    arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ',
    latin: 'Rabbanaa zhalamnaa anfusanaa wa-in lam taghfir lanaa watarhamnaa lanakuunanna minal khaasiriin',
    translation: 'Ya Tuhan kami, kami telah menzalimi diri kami sendiri. Jika Engkau tidak mengampuni kami dan memberi rahmat kepada kami, niscaya kami termasuk orang-orang yang rugi.',
    source: 'QS. Al-A\'raf: 23',
    category: 'Taubat'
  },
  {
    id: 3,
    title: 'Doa Nabi Yunus',
    arabic: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
    latin: 'Laa ilaaha illaa anta subhaanaka innii kuntu minazh-zhaalimiin',
    translation: 'Tidak ada Tuhan selain Engkau, Mahasuci Engkau. Sesungguhnya aku termasuk orang-orang yang zalim.',
    source: 'QS. Al-Anbiya: 87',
    category: 'Taubat'
  },

  // --- REZEKI & KEBERKAHAN ---
  {
    id: 4,
    title: 'Doa Mohon Kelancaran Rezeki',
    arabic: 'اللّٰهُمَّ اكْفِنِيْ بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِيْ بِفَضْلِكَ عَمَّنْ سِوَاكَ',
    latin: 'Allahummak-finii bihalaalika \'an haraamika wa aghninii bifadhlika \'amman siwaaka',
    translation: 'Ya Allah, cukupkanlah aku dengan rezeki-Mu yang halal (sehingga aku terhindar) dari yang haram, dan kayakanlah aku dengan karunia-Mu (sehingga aku tidak meminta) kepada selain-Mu.',
    source: 'HR. Tirmidzi',
    category: 'Rezeki'
  },
  {
    id: 5,
    title: 'Doa Mohon Rezeki Melimpah',
    arabic: 'اللّٰهُمَّ أَكْثِرْ مَالِيْ وَوَلَدِيْ وَبَارِكْ لِيْ فِيمَا أَعْطَيْتَنِيْ',
    latin: 'Allahumma aktsir maalii wa waladii wa baarik lii fiimaa a\'thaitanii',
    translation: 'Ya Allah, perbanyaklah harta dan anakku, serta berkahilah aku atas apa yang Engkau berikan kepadaku.',
    source: 'HR. Bukhari & Muslim',
    category: 'Rezeki'
  },
  {
    id: 6,
    title: 'Doa Rezeki Tak Terduga',
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ',
    latin: 'Wamay-yattaqillaaha yaj\'al lahuu makhrajaa, wayarzuq-hu min haitsu laa yahtasib',
    translation: 'Barangsiapa bertakwa kepada Allah niscaya Dia akan membukakan jalan keluar baginya, dan memberinya rezeki dari arah yang tiada disangka-sangkanya.',
    source: 'QS. Ath-Thalaq: 2-3',
    category: 'Rezeki'
  },

  // --- PERLINDUNGAN ---
  {
    id: 7,
    title: 'Doa Perlindungan Total (Dzikir Pagi/Petang)',
    arabic: 'بِسْمِ اللّٰهِ الَّذِيْ لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيْعُ الْعَلِيْمُ',
    latin: 'Bismillaahilladzii laa yadhurru ma\'as-mihii syai-un fil ardhi wa laa fis-samaa-i wa huwas-samii\'ul \'aliim',
    translation: 'Dengan menyebut nama Allah yang dengan nama-Nya tidak ada sesuatu pun yang dapat membahayakan di bumi maupun di langit. Dan Dia Maha Mendengar lagi Maha Mengetahui.',
    source: 'HR. Abu Dawud & Tirmidzi',
    category: 'Perlindungan'
  },
  {
    id: 8,
    title: 'Doa Berlindung dari Penyakit Berbahaya',
    arabic: 'اللّٰهُمَّ إِنِّيْ أَعُوْذُ بِكَ مِنَ الْبَرَصِ وَالْجُنُوْنِ وَالْجُذَامِ وَمِنْ سَيِّئِ الْأَسْقَامِ',
    latin: 'Allahumma innii a\'uudzu bika minal barashi wal junuuni wal judzaami wa min sayyi-il asqaam',
    translation: 'Ya Allah, aku berlindung kepada-Mu dari penyakit sopak (kusta), gila, lepra, dan dari keburukan segala penyakit.',
    source: 'HR. Abu Dawud',
    category: 'Perlindungan'
  },

  // --- KELUARGA ---
  {
    id: 9,
    title: 'Doa Kebaikan Keluarga & Keturunan',
    arabic: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا',
    latin: 'Rabbanaa hab lanaa min azwaajinaa wa dzurriyyaatinaa qurrata a\'yunin waj\'alnaa lil muttaqiina imaamaa',
    translation: 'Ya Tuhan kami, anugerahkanlah kepada kami pasangan kami dan keturunan kami sebagai penyenang hati (kami), dan jadikanlah kami imam bagi orang-orang yang bertakwa.',
    source: 'QS. Al-Furqan: 74',
    category: 'Keluarga'
  },
  {
    id: 10,
    title: 'Doa untuk Orang Tua',
    arabic: 'رَّبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيراً',
    latin: 'Rabbighfir lii waliwaalidayya warhamhumaa kamaa rabbayaanii shagiiraa',
    translation: 'Ya Tuhanku, ampunilah aku dan kedua orang tuaku, dan sayangilah keduanya sebagaimana mereka berdua telah mendidikku pada waktu kecil.',
    source: 'QS. Al-Isra: 24',
    category: 'Keluarga'
  },

  // --- KESEMBUHAN ---
  {
    id: 11,
    title: 'Doa Menjenguk Orang Sakit',
    arabic: 'اللّٰهُمَّ رَبَّ النَّاسِ أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ شِفَاءً لَا يُغَادِرُ سَقَمًا',
    latin: 'Allahumma rabban-naasi adzhibil ba\'sa, isyfi antas-syaafii, laa syifaa-a illaa syifaa-uka syifaa-an laa yughaadiru saqamaa',
    translation: 'Ya Allah, Tuhan segala manusia, hilangkanlah penyakit. Sembuhkanlah, Engkaulah yang menyembuhkan, tidak ada kesembuhan melainkan kesembuhan-Mu, kesembuhan yang tidak menyisakan sedikit pun penyakit.',
    source: 'HR. Bukhari & Muslim',
    category: 'Kesembuhan'
  },

  // --- IBADAH ---
  {
    id: 12,
    title: 'Doa Mohon Istiqamah dalam Shalat',
    arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي ۚ رَبَّنَا وَتَقَبَّلْ دُعَاءِ',
    latin: 'Rabbij\'alnii muqiimash-shalaati wa min dzurriyyatii, rabbanaa wa taqabbal du\'aa-i',
    translation: 'Ya Tuhanku, jadikanlah aku dan anak cucuku orang yang tetap melaksanakan shalat, ya Tuhan kami, perkenankanlah doaku.',
    source: 'QS. Ibrahim: 40',
    category: 'Ibadah'
  },

  // --- HARIAN (EXISTING + MORE) ---
  {
    id: 13,
    title: 'Doa Sebelum Tidur',
    arabic: 'بِاسْمِكَ اللّٰهُمَّ أَمُوْتُ وَأَحْيَا',
    latin: 'Bismikallahumma amuutu wa ahyaa',
    translation: 'Dengan menyebut nama-Mu ya Allah, aku mati dan aku hidup.',
    source: 'HR. Bukhari',
    category: 'Harian'
  },
  {
    id: 14,
    title: 'Doa Bangun Tidur',
    arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِيْ أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُوْرُ',
    latin: 'Alhamdu lillaahil-ladzii ahyaanaa ba\'da maa amaatanaa wa ilaihin-nusyuur',
    translation: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya lah kami akan dikembalikan.',
    source: 'HR. Bukhari',
    category: 'Harian'
  },
  {
    id: 15,
    title: 'Doa Masuk Kamar Mandi',
    arabic: 'اللّٰهُمَّ إِنِّيْ أَعُوْذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    latin: 'Allahumma innii a\'uudzu bika minal khubutsi wal khabaa-its',
    translation: 'Ya Allah, aku berlindung kepada-Mu dari gangguan setan laki-laki dan setan perempuan.',
    source: 'HR. Bukhari',
    category: 'Harian'
  },
  {
    id: 16,
    title: 'Doa Keluar Rumah',
    arabic: 'بِسْمِ اللّٰهِ تَوَكَّلْتُ عَلَى اللّٰهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ',
    latin: 'Bismillaahi tawakkaltu \'alallaahi wa laa hawla wa laa quwwata illaa billaah',
    translation: 'Dengan menyebut nama Allah, aku bertawakal kepada Allah. Tidak ada daya dan kekuatan kecuali dengan pertolongan Allah.',
    source: 'HR. Abu Dawud',
    category: 'Harian'
  },
  {
    id: 17,
    title: 'Doa Mohon Kebaikan Dunia Akhirat',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    latin: 'Rabbanaa aatinaa fid-dunyaa hasanatan wa fil-aakhirati hasanatan wa qinaa \'adzaaban-naar',
    translation: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.',
    source: 'QS. Al-Baqarah: 201',
    category: "Al-Qur'an"
  },
  {
    id: 18,
    title: 'Doa Mohon Kesabaran',
    arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ',
    latin: 'Rabbanaa afrigh \'alainaa shabran wa tsabbit aqdaamanaa wanshurnaa \'alal-qawmil-kaafiriin',
    translation: 'Ya Tuhan kami, tuangkanlah kesabaran atas diri kami, kokohkanlah pendirian kami, dan tolonglah kami menghadapi orang-orang kafir.',
    source: 'QS. Al-Baqarah: 250',
    category: "Al-Qur'an"
  },
  {
    id: 19,
    title: 'Doa Mohon Keteguhan Iman',
    arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ',
    latin: 'Rabbanaa laa tuzigh quluubanaa ba\'da idz hadaitanaa wa hab lanaa min ladunka rahmah, innaka antal-wahhaab',
    translation: 'Ya Tuhan kami, janganlah Engkau condongkan hati kami setelah Engkau beri petunjuk kepada kami, dan karuniakanlah kepada kami rahmat dari sisi-Mu. Sesungguhnya Engkau Maha Pemberi.',
    source: 'QS. Ali Imran: 8',
    category: "Al-Qur'an"
  },
  {
    id: 20,
    title: 'Doa Nabi Musa (Mohon Kemudahan)',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    latin: 'Rabbish-rah lii shadrii wa yassir lii amrii',
    translation: 'Ya Tuhanku, lapangkanlah dadaku dan mudahkanlah urusanku.',
    source: 'QS. Thaha: 25-26',
    category: "Al-Qur'an"
  },
  {
    id: 21,
    title: 'Doa Mohon Ilmu yang Bermanfaat',
    arabic: 'اللّٰهُمَّ إِنِّيْ أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا',
    latin: 'Allahumma innii as-aluka \'ilman naafi\'an wa rizqan thayyiban wa \'amalan mutaqabbalan',
    translation: 'Ya Allah, sesungguhnya aku memohon kepada-Mu ilmu yang bermanfaat, rezeki yang baik, dan amal yang diterima.',
    source: 'HR. Ibnu Majah',
    category: 'Ibadah'
  },
  {
    id: 22,
    title: 'Doa Menghilangkan Kesedihan & Gelisah',
    arabic: 'اللّٰهُمَّ إِنِّيْ أَعُوْذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
    latin: 'Allahumma innii a\'uudzu bika minal hammi wal hazani wal \'ajzi wal kasali wal bukhli wal jubni wa dhala\'id-daini wa ghalabatir-rijaal',
    translation: 'Ya Allah, aku berlindung kepada-Mu dari rasa sedih dan gelisah, rasa lemah dan malas, kikir dan penakut, lilitan hutang dan penguasaan orang lain.',
    source: 'HR. Bukhari',
    category: 'Perlindungan'
  },
  {
    id: 23,
    title: 'Doa Memohon Ampunan Dosa Besar & Kecil',
    arabic: 'اللّٰهُمَّ اغْفِرْ لِيْ ذَنْبِيْ كُلَّهُ دِقَّهُ وَجِلَّهُ وَأَوَّلَهُ وَآخِرَهُ وَعَلَانِيَتَهُ وَسِرَّهُ',
    latin: 'Allahummagh-firlii dzanbii kullahu diqqahu wa jillahu wa awwalahu wa aakhirahu wa \'alaaniyatahu wa sirrahu',
    translation: 'Ya Allah, ampunilah seluruh dosaku, yang besar maupun yang kecil, yang awal maupun yang akhir, yang terang-terangan maupun yang tersembunyi.',
    source: 'HR. Muslim',
    category: 'Taubat'
  },
  {
    id: 24,
    title: 'Doa Mohon Kecukupan Hati (Qanaah)',
    arabic: 'اللّٰهُمَّ قَنِّعْنِيْ بِمَا رَزَقْتَنِيْ وَبَارِكْ لِيْ فِيْهِ',
    latin: 'Allahumma qanni\'nii bimaa razaqtanii wa baarik lii fiihi',
    translation: 'Ya Allah, jadikanlah aku merasa cukup dengan apa yang Engkau rezekikan kepadaku dan berkahilah rezeki tersebut bagiku.',
    source: 'HR. Hakim',
    category: 'Rezeki'
  },
  {
    id: 25,
    title: 'Doa Agar Terhindar dari Sifat Pelit',
    arabic: 'اللّٰهُمَّ إِنِّيْ أَعُوْذُ بِكَ مِنَ الْبُخْلِ وَأَعُوْذُ بِكَ مِنَ الْجُبْنِ',
    latin: 'Allahumma innii a\'uudzu bika minal bukhli wa a\'uudzu bika minal jubni',
    translation: 'Ya Allah, sesungguhnya aku berlindung kepada-Mu dari sifat kikir dan sifat penakut.',
    source: 'HR. Bukhari',
    category: 'Perlindungan'
  },
  {
    id: 26,
    title: 'Doa Nabi Ibrahim (Mohon Keamanan Negeri)',
    arabic: 'رَبِّ اجْعَلْ هَٰذَا بَلَدًا آمِنًا وَارْزُقْ أَهْلَهُ مِنَ الثَّمَرَاتِ',
    latin: 'Rabbij\'al haadzaa baladan aaminan warzuq ahlahuu minats-tsamaraat',
    translation: 'Ya Tuhanku, jadikanlah negeri ini negeri yang aman, dan berilah rezeki kepada penduduknya dari buah-buahan.',
    source: 'QS. Al-Baqarah: 126',
    category: "Al-Qur'an"
  },
  {
    id: 27,
    title: 'Doa Mohon Kesembuhan (Nabi Ayyub)',
    arabic: 'أَنِّي مَسَّنِيَ الضُّرُّ وَأَنتَ أَرْحَمُ الرَّاحِمِينَ',
    latin: 'Annii massaniyad-dhurru wa anta arhamur-raahimiin',
    translation: 'Sesungguhnya aku telah ditimpa penyakit, dan Engkau adalah Tuhan Yang Maha Penyayang di antara semua yang penyayang.',
    source: 'QS. Al-Anbiya: 83',
    category: 'Kesembuhan'
  },
  {
    id: 28,
    title: 'Doa Mohon Petunjuk & Ketakwaan',
    arabic: 'اللّٰهُمَّ إِنِّيْ أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
    latin: 'Allahumma innii as-alukal hudaa wat-tuqaa wal \'afaafa wal ghinaa',
    translation: 'Ya Allah, sesungguhnya aku memohon kepada-Mu petunjuk, ketakwaan, kesucian diri, dan kecukupan.',
    source: 'HR. Muslim',
    category: 'Ibadah'
  },
  {
    id: 29,
    title: 'Doa Agar Hati Ditetapkan dalam Agama',
    arabic: 'يَا مُقَلِّبَ الْقُلُوْبِ ثَبِّتْ قَلْبِيْ عَلَى دِيْنِكَ',
    latin: 'Yaa muqallibal quluubi tsabbit qalbii \'alaa diinika',
    translation: 'Wahai Dzat yang membolak-balikkan hati, tetapkanlah hatiku di atas agama-Mu.',
    source: 'HR. Tirmidzi',
    category: 'Ibadah'
  },
  {
    id: 30,
    title: 'Doa Keluar Kamar Mandi',
    arabic: 'غُفْرَانَكَ',
    latin: 'Ghufraanak',
    translation: 'Aku memohon ampunan-Mu.',
    source: 'HR. Abu Dawud',
    category: 'Harian'
  }
];
