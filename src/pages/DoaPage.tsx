import { useState } from 'react';
import { Search, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

interface Doa {
  id: number;
  title: string;
  arabic: string;
  latin: string;
  translation: string;
  source: string;
  category: string;
}

const doaList: Doa[] = [
  // Doa Sehari-hari
  { id: 1, title: 'Doa Sebelum Tidur', arabic: 'بِاسْمِكَ اللّٰهُمَّ أَمُوْتُ وَأَحْيَا', latin: "Bismikallahumma amuutu wa ahyaa", translation: 'Dengan menyebut nama-Mu ya Allah, aku mati dan aku hidup.', source: 'HR. Bukhari no. 6324', category: 'Harian' },
  { id: 2, title: 'Doa Bangun Tidur', arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِيْ أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُوْرُ', latin: "Alhamdu lillaahil-ladzii ahyaanaa ba'da maa amaatanaa wa ilaihin-nusyuur", translation: 'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami, dan kepada-Nya lah kami akan dikembalikan.', source: 'HR. Bukhari no. 6325', category: 'Harian' },
  { id: 3, title: 'Doa Masuk Kamar Mandi', arabic: 'اللّٰهُمَّ إِنِّيْ أَعُوْذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ', latin: "Allahumma innii a'uudzu bika minal khubutsi wal khabaa-its", translation: 'Ya Allah, aku berlindung kepada-Mu dari gangguan setan laki-laki dan setan perempuan.', source: 'HR. Bukhari no. 142', category: 'Harian' },
  { id: 4, title: 'Doa Keluar Kamar Mandi', arabic: 'غُفْرَانَكَ', latin: 'Ghufraanak', translation: 'Aku memohon ampunan-Mu.', source: 'HR. Abu Dawud no. 30', category: 'Harian' },
  { id: 5, title: 'Doa Sebelum Makan', arabic: 'بِسْمِ اللّٰهِ', latin: 'Bismillaah', translation: 'Dengan menyebut nama Allah.', source: 'HR. Abu Dawud no. 3767', category: 'Harian' },
  { id: 6, title: 'Doa Sesudah Makan', arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِيْ أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِيْنَ', latin: "Alhamdu lillaahil-ladzii ath'amanaa wa saqaanaa wa ja'alanaa muslimiin", translation: 'Segala puji bagi Allah yang telah memberi kami makan dan minum, serta menjadikan kami sebagai orang-orang Islam.', source: 'HR. Abu Dawud no. 3850', category: 'Harian' },
  { id: 7, title: 'Doa Keluar Rumah', arabic: 'بِسْمِ اللّٰهِ تَوَكَّلْتُ عَلَى اللّٰهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللّٰهِ', latin: "Bismillaahi tawakkaltu 'alallaahi wa laa hawla wa laa quwwata illaa billaah", translation: 'Dengan menyebut nama Allah, aku bertawakal kepada Allah. Tidak ada daya dan kekuatan kecuali dengan pertolongan Allah.', source: 'HR. Abu Dawud no. 5095', category: 'Harian' },
  { id: 8, title: 'Doa Masuk Rumah', arabic: 'بِسْمِ اللّٰهِ وَلَجْنَا وَبِسْمِ اللّٰهِ خَرَجْنَا وَعَلَى اللّٰهِ رَبِّنَا تَوَكَّلْنَا', latin: "Bismillaahi walajnaa wa bismillaahi kharajnaa wa 'alaallaahi rabbinaa tawakkalnaa", translation: 'Dengan menyebut nama Allah kami masuk, dengan menyebut nama Allah kami keluar, dan kepada Allah Tuhan kami, kami bertawakal.', source: 'HR. Abu Dawud no. 5096', category: 'Harian' },
  { id: 9, title: 'Doa Masuk Masjid', arabic: 'اللّٰهُمَّ افْتَحْ لِيْ أَبْوَابَ رَحْمَتِكَ', latin: "Allaahummaf-tah lii abwaaba rahmatik", translation: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.', source: 'HR. Muslim no. 713', category: 'Harian' },
  { id: 10, title: 'Doa Keluar Masjid', arabic: 'اللّٰهُمَّ إِنِّيْ أَسْأَلُكَ مِنْ فَضْلِكَ', latin: "Allahumma innii as-aluka min fadllik", translation: 'Ya Allah, sesungguhnya aku memohon kepada-Mu sebagian dari karunia-Mu.', source: 'HR. Muslim no. 713', category: 'Harian' },

  // Doa dari Al-Qur'an
  { id: 11, title: 'Doa Mohon Kebaikan Dunia Akhirat', arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ', latin: "Rabbanaa aatinaa fid-dunyaa hasanatan wa fil-aakhirati hasanatan wa qinaa 'adzaaban-naar", translation: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.', source: 'QS. Al-Baqarah: 201', category: "Al-Qur'an" },
  { id: 12, title: 'Doa Mohon Kesabaran', arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا وَانصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ', latin: "Rabbanaa afrigh 'alainaa shabran wa tsabbit aqdaamanaa wanshurnaa 'alal-qawmil-kaafiriin", translation: 'Ya Tuhan kami, tuangkanlah kesabaran atas diri kami, kokohkanlah pendirian kami, dan tolonglah kami menghadapi orang-orang kafir.', source: 'QS. Al-Baqarah: 250', category: "Al-Qur'an" },
  { id: 13, title: 'Doa Mohon Ampunan', arabic: 'رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا أَوْ أَخْطَأْنَا', latin: "Rabbanaa laa tu-aakhidznaa in nasiinaa aw akhtha'naa", translation: 'Ya Tuhan kami, janganlah Engkau hukum kami jika kami lupa atau kami melakukan kesalahan.', source: 'QS. Al-Baqarah: 286', category: "Al-Qur'an" },
  { id: 14, title: 'Doa Mohon Keteguhan Iman', arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ', latin: "Rabbanaa laa tuzigh quluubanaa ba'da idz hadaitanaa wa hab lanaa min ladunka rahmah, innaka antal-wahhaab", translation: 'Ya Tuhan kami, janganlah Engkau condongkan hati kami setelah Engkau beri petunjuk kepada kami, dan karuniakanlah kepada kami rahmat dari sisi-Mu. Sesungguhnya Engkau Maha Pemberi.', source: 'QS. Ali Imran: 8', category: "Al-Qur'an" },
  { id: 15, title: 'Doa Nabi Ibrahim untuk Keturunan', arabic: 'رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ', latin: "Rabbi hab lii minash-shaalihiin", translation: 'Ya Tuhanku, anugerahkanlah kepadaku anak yang termasuk orang-orang saleh.', source: 'QS. Ash-Shaffat: 100', category: "Al-Qur'an" },
  { id: 16, title: 'Doa Nabi Musa', arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', latin: "Rabbish-rah lii shadrii wa yassir lii amrii", translation: 'Ya Tuhanku, lapangkanlah dadaku dan mudahkanlah urusanku.', source: 'QS. Thaha: 25-26', category: "Al-Qur'an" },
  { id: 17, title: 'Doa Mohon Ilmu', arabic: 'رَبِّ زِدْنِي عِلْمًا', latin: "Rabbi zidnii 'ilmaa", translation: 'Ya Tuhanku, tambahkanlah kepadaku ilmu.', source: 'QS. Thaha: 114', category: "Al-Qur'an" },
  { id: 18, title: 'Doa Nabi Yunus', arabic: 'لَا إِلٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ', latin: "Laa ilaaha illaa anta subhaanaka innii kuntu minazh-zhaalimiin", translation: 'Tidak ada Tuhan selain Engkau, Mahasuci Engkau. Sesungguhnya aku termasuk orang-orang yang zalim.', source: 'QS. Al-Anbiya: 87', category: "Al-Qur'an" },
  { id: 19, title: 'Doa untuk Kedua Orang Tua', arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', latin: "Rabbirhamhumaa kamaa rabbayaanii shaghiiraa", translation: 'Ya Tuhanku, sayangilah keduanya sebagaimana mereka berdua telah mendidikku waktu kecil.', source: 'QS. Al-Isra: 24', category: "Al-Qur'an" },
  { id: 20, title: 'Doa Mohon Perlindungan dari Setan', arabic: 'رَبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ الشَّيَاطِينِ وَأَعُوذُ بِكَ رَبِّ أَن يَحْضُرُونِ', latin: "Rabbi a'uudzu bika min hamazaatisy-syayaathiin wa a'uudzu bika rabbi ay yahdhuruun", translation: 'Ya Tuhanku, aku berlindung kepada-Mu dari bisikan-bisikan setan, dan aku berlindung kepada-Mu ya Tuhanku dari kedatangan mereka kepadaku.', source: 'QS. Al-Mu\'minun: 97-98', category: "Al-Qur'an" },

  // Doa dari Hadits
  { id: 21, title: 'Sayyidul Istighfar', arabic: 'اللّٰهُمَّ أَنْتَ رَبِّيْ لَا إِلٰهَ إِلَّا أَنْتَ خَلَقْتَنِيْ وَأَنَا عَبْدُكَ وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ أَعُوْذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ أَبُوْءُ لَكَ بِنِعْمَتِكَ عَلَيَّ وَأَبُوْءُ بِذَنْبِيْ فَاغْفِرْ لِيْ فَإِنَّهُ لَا يَغْفِرُ الذُّنُوْبَ إِلَّا أَنْتَ', latin: "Allahumma anta rabbii laa ilaaha illaa anta, khalaqtanii wa ana 'abduka, wa ana 'alaa 'ahdika wa wa'dika mas-tatha'tu, a'uudzu bika min syarri maa shana'tu, abuu-u laka bini'matika 'alayya wa abuu-u bidzanbii, faghfirlii fa-innahu laa yaghfirudz-dzunuuba illaa anta", translation: 'Ya Allah, Engkau adalah Tuhanku, tidak ada tuhan yang berhak disembah kecuali Engkau. Engkau telah menciptakanku dan aku adalah hamba-Mu...', source: 'HR. Bukhari no. 6306', category: 'Hadits' },
  { id: 22, title: 'Doa Pagi dan Petang', arabic: 'اللّٰهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوْتُ وَإِلَيْكَ النُّشُوْرُ', latin: "Allahumma bika ashbahnaa wa bika amsainaa wa bika nahyaa wa bika namuutu wa ilaikan-nusyuur", translation: 'Ya Allah, dengan rahmat-Mu kami memasuki waktu pagi, dengan rahmat-Mu kami memasuki waktu petang, dengan rahmat-Mu kami hidup, dengan rahmat-Mu kami mati, dan kepada-Mu kebangkitan.', source: 'HR. Tirmidzi no. 3391', category: 'Hadits' },
  { id: 23, title: 'Doa Ketika Berpakaian', arabic: 'اَلْحَمْدُ لِلّٰهِ الَّذِيْ كَسَانِيْ هٰذَا وَرَزَقَنِيْهِ مِنْ غَيْرِ حَوْلٍ مِنِّيْ وَلَا قُوَّةٍ', latin: "Alhamdu lillaahil-ladzii kasaanii haadzaa wa razaqanihi min ghairi hawlin minnii wa laa quwwah", translation: 'Segala puji bagi Allah yang telah memberikan pakaian ini kepadaku dan memberiku rezeki tanpa daya dan kekuatan dariku.', source: 'HR. Abu Dawud no. 4023', category: 'Hadits' },
  { id: 24, title: 'Doa Naik Kendaraan', arabic: 'سُبْحَانَ الَّذِيْ سَخَّرَ لَنَا هٰذَا وَمَا كُنَّا لَهُ مُقْرِنِيْنَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُوْنَ', latin: "Subhaanal-ladzii sakhkhara lanaa haadzaa wa maa kunnaa lahuu muqriniin, wa innaa ilaa rabbinaa lamunqalibuun", translation: 'Mahasuci Dzat yang telah menundukkan ini untuk kami, padahal kami tidak mampu menguasainya. Dan sesungguhnya kami akan kembali kepada Tuhan kami.', source: 'QS. Az-Zukhruf: 13-14', category: 'Hadits' },
  { id: 25, title: 'Doa Ketika Hujan', arabic: 'اللّٰهُمَّ صَيِّبًا نَافِعًا', latin: "Allahumma shayyiban naafi'aa", translation: 'Ya Allah, turunkanlah hujan yang bermanfaat.', source: 'HR. Bukhari no. 1032', category: 'Hadits' },
  { id: 26, title: 'Doa Ketika Bersin', arabic: 'اَلْحَمْدُ لِلّٰهِ', latin: 'Alhamdulillaah', translation: 'Segala puji bagi Allah.', source: 'HR. Bukhari no. 6224', category: 'Hadits' },
  { id: 27, title: 'Doa Menjenguk Orang Sakit', arabic: 'لَا بَأْسَ طَهُوْرٌ إِنْ شَاءَ اللّٰهُ', latin: "Laa ba'sa thahuurun insyaa-Allaah", translation: 'Tidak mengapa, semoga sakitnya menjadi penyucian, insya Allah.', source: 'HR. Bukhari no. 3616', category: 'Hadits' },
  { id: 28, title: 'Doa Ketika Bercermin', arabic: 'اللّٰهُمَّ أَنْتَ حَسَّنْتَ خَلْقِيْ فَحَسِّنْ خُلُقِيْ', latin: "Allahumma anta hassanta khalqii fa-hassin khuluqii", translation: 'Ya Allah, Engkau telah membaguskan ciptaanku, maka baguskanlah pula akhlakku.', source: 'HR. Ahmad no. 3823', category: 'Hadits' },
];

const categories = ['Semua', 'Harian', "Al-Qur'an", 'Hadits'];

const DoaPage = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = doaList.filter((d) => {
    const matchCat = activeCategory === 'Semua' || d.category === activeCategory;
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.translation.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen pb-20 px-4 pt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Doa Harian</h1>
          <p className="text-xs text-muted-foreground">{doaList.length} doa dari Al-Qur'an & Hadits</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari doa..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Doa List */}
      <div className="space-y-2">
        {filtered.map((doa) => {
          const isExpanded = expandedId === doa.id;
          return (
            <button
              key={doa.id}
              onClick={() => setExpandedId(isExpanded ? null : doa.id)}
              className="w-full text-left p-4 rounded-xl bg-card border border-border transition-all active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{doa.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{doa.source}</p>
                </div>
                <span className="text-muted-foreground mt-0.5">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </span>
              </div>

              {isExpanded && (
                <div className="mt-3 space-y-3 border-t border-border pt-3">
                  <p className="font-arabic text-right text-xl leading-[2.2] text-foreground">{doa.arabic}</p>
                  <p className="text-xs text-primary italic">{doa.latin}</p>
                  <p className="text-xs text-muted-foreground">{doa.translation}</p>
                </div>
              )}
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-10 text-muted-foreground text-sm">
            Tidak ada doa yang ditemukan
          </div>
        )}
      </div>
    </div>
  );
};

export default DoaPage;
