export type NewsCategoryKey = "science" | "cooperation" | "education" | "society";

export type OfficialNewsArticle = {
  id: number | string;
  title: string;
  summary: string;
  category: NewsCategoryKey;
  date: string;
  image: string | null;
  body: string[];
  sources: string[];
  contentType?: "ARTICLE" | "EVENT" | "ANNOUNCEMENT" | "PROJECT" | "OPPORTUNITY" | "PUBLICATION";
  actionUrl?: string | null;
  actionClosesAt?: string | null;
  actionLabel?: string | null;
};

const NEWS_TITLE_NAMES = [
  ["rosatom quantum", "Rosatom Quantum"],
  ["dmitry chernyshenko", "Dmitry Chernyshenko"],
  ["bauman moscow", "Bauman Moscow"],
  ["saint petersburg", "Saint Petersburg"],
  ["bonch-bruevich", "Bonch-Bruevich"],
  ["leningrad pushkin", "Leningrad Pushkin"],
  ["mega-science", "Mega-Science"],
  ["vostokgosplan", "Vostokgosplan"],
  ["innopraktika", "Innopraktika"],
  ["studturizm", "Studturizm"],
  ["mendeleev", "Mendeleev"],
  ["rosatom", "Rosatom"],
  ["bologna", "Bologna"],
  ["herzen", "Herzen"],
  ["putin", "Putin"],
  ["ninh thuận", "Ninh Thuận"],
  ["bình dương", "Bình Dương"],
  ["quảng bình", "Quảng Bình"],
  ["bắc cực", "Bắc Cực"],
  ["việt nam", "Việt Nam"],
  ["liên bang nga", "Liên bang Nga"],
  ["nga", "Nga"],
] as const;

export function formatNewsTitle(title: string): string {
  if (!title) return "";
  const letters = title.replace(/[^a-zA-ZÀ-ỹ]/g, "");
  const uppercaseLetters = title.replace(/[^A-ZÀ-Ỹ]/g, "");
  let formatted =
    letters.length > 5 && uppercaseLetters.length / letters.length > 0.7
      ? title.charAt(0) + title.slice(1).toLocaleLowerCase("vi")
      : title;

  for (const [name, canonical] of NEWS_TITLE_NAMES) {
    const pattern = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    formatted = formatted.replace(
      new RegExp(`(?<![\\p{L}\\p{N}])${pattern}(?![\\p{L}\\p{N}])`, "giu"),
      canonical,
    );
  }

  return formatted
    .replace(/\b(AI|EEF|HUS|MICE|PTIT|SKIF|UAV|VNU|VVER-1200)\b/gi, (value) =>
      value.toUpperCase(),
    )
    .replace(/\bM\.A\./gi, "M.A.");
}

export function newsArticleHref(article: Pick<OfficialNewsArticle, "id" | "title">) {
  const slug = article.title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
  return `/news/${article.id}/${slug || "tin-tuc"}`;
}

// Generated from the official DOCX files in /Tin tức.
export const OFFICIAL_NEWS = [
  {
    "id": 1,
    "title": "MANG TRI THỨC TRỞ VỀ",
    "summary": "Từ nước Nga nhìn về quê hương, hầu như tất cả cộng đồng người Việt Nam tại Nga nói chung và đội ngũ trí thức... nói riêng đều có một niềm tin lớn lao đặt vào tương lai đất nước. Trong tinh thần chung đó, niềm mong mỏi được “trở về Việt Nam”, hay “kết thúc khóa học sớm để trở về Việt Nam” từ các chuyên gia, nghiên cứu sinh, sinh viên... để cống hiến, để làm việc, ngày càng trở nên thiết tha hơn.",
    "category": "cooperation",
    "date": "08/2026",
    "image": null,
    "body": [
      "Từ nước Nga nhìn về quê hương, hầu như tất cả cộng đồng người Việt Nam tại Nga nói chung và đội ngũ trí thức... nói riêng đều có một niềm tin lớn lao đặt vào tương lai đất nước. Trong tinh thần chung đó, niềm mong mỏi được “trở về Việt Nam”, hay “kết thúc khóa học sớm để trở về Việt Nam” từ các chuyên gia, nghiên cứu sinh, sinh viên... để cống hiến, để làm việc, ngày càng trở nên thiết tha hơn.",
      "Quỹ “Truyền thống và Hữu nghị” trao tặng bằng khen những sinh viên có thành tích học tập xuất sắc.",
      "Hướng về Việt Nam",
      "Đêm hè ở Moskva, ánh sáng nhá nhem cứ lơ lửng nơi chân trời. Màn đêm xuống chậm. Trong khuôn viên Đại học Kỹ thuật quốc gia Moskva Bauman, nhiều phòng thí nghiệm vẫn sáng đèn. Sau chiếc bàn làm việc, Phạm Quốc Phòng chăm chú dõi theo những chấm sáng nhỏ nhấp nháy trên màn hình máy tính. Lâu nay, chàng nghiên cứu sinh Việt Nam vẫn miệt mài với các thuật toán điều khiển máy bay không người lái (UAV).",
      "Cách đó hơn 1.000 ki-lô mét, tại thành phố Rostov bên bờ sông Đông, Bùi Bảo Thiện còn cặm cụi nghiên cứu số liệu về sự thay đổi của rừng, đất nông nghiệp hay tốc độ mở rộng đô thị. Thiện hiện là trợ lý nghiên cứu tại Đại học Liên bang miền nam, thành phố Rostov trên sông Đông. Anh làm việc hằng ngày với những con số, dù trông có vẻ khô khan, nhưng là căn cứ để quy hoạch thành phố, bảo vệ tài nguyên hay giảm tác động biến đổi khí hậu.",
      "Trong khi Phạm Quốc Phòng nghiên cứu hướng lên bầu trời, Bùi Bảo Thiện lại quan sát mặt đất. Nhưng, khi được hỏi về dự định sau khi bảo vệ thành công luận án tiến sĩ, cả hai đều khẳng định dứt khoát: “Trở về Việt Nam!”.",
      "Sang Nga năm 2018 theo diện học bổng, Phạm Quốc Phòng hoàn thành năm dự bị tiếng Nga và theo học chương trình kỹ sư, chuyên gia tại Đại học Bauman - một trong những trường kỹ thuật hàng đầu của Nga. Sau khi tốt nghiệp, anh tiếp tục ở lại theo đuổi con đường nghiên cứu khoa học.",
      "Gần chín năm sống ở Nga, Phòng thu lượm được nhiều kiến thức, đồng thời hiểu hơn về cách người Nga xây dựng nền tảng khoa học. “Nga có thế mạnh rất lớn về hàng không vũ trụ và lý thuyết điều khiển. Nền tảng khoa học rất chắc cùng nguồn tài liệu phong phú đã giúp chúng tôi có cơ sở để phát triển những hướng nghiên cứu mới, trong đó có điều khiển đội hình UAV”, Phòng nói.",
      "Đề tài nghiên cứu của nhà nghiên cứu về phương pháp và thuật toán điều khiển UAV không chỉ phục vụ lĩnh vực quân sự. Theo anh, UAV còn được sử dụng rộng rãi trong mục đích dân sự, như vận chuyển, cứu nạn, cứu hộ, giám sát cháy rừng, quan trắc môi trường hay khảo sát địa chất… Tại Việt Nam, đây vẫn là lĩnh vực còn nhiều dư địa phát triển. Điều này khiến Phòng tích cực hơn, quyết tâm hơn để sau khi hoàn thành chương trình nghiên cứu, có thể sớm trở về phục vụ đất nước.",
      "Khác với Phòng, Thiện chọn “ăn ngủ” với những tín hiệu thay đổi trên mặt đất. Sinh năm 1998, hiện là trợ lý nghiên cứu tại Đại học Liên bang miền nam ở Rostov trên sông Đông, Thiện đang chuẩn bị bước vào chương trình nghiên cứu sinh sau khi tốt nghiệp thạc sĩ loại xuất sắc.",
      "Chọn hướng nghiên cứu phân tích không gian, viễn thám và học máy, chàng kỹ sư trẻ nhấn mạnh, những ứng dụng từ nghiên cứu này rất gần với đời sống. Từ dữ liệu, các mô hình có thể dự báo xu hướng mở rộng đô thị, đánh giá sự thay đổi của diện tích rừng, theo dõi nhiệt độ bề mặt đất hay xác định những khu vực có nguy cơ chịu tác động mạnh từ biến đổi khí hậu. Những kết quả đó không chỉ phục vụ nghiên cứu, mà còn hỗ trợ các nhà quản lý xây dựng quy hoạch, bảo vệ môi trường và phát triển đô thị theo hướng bền vững.",
      "Chặng đường nghiên cứu còn “dài rộng” phía trước, nhưng Thiện đã vạch sẵn kế hoạch trở về Việt Nam để giảng dạy và nghiên cứu. Trả lời chậm, như đã suy nghĩ chắc chắn về điều đó, Thiện nói: “Tôi mong những gì học được ở nước ngoài không dừng lại ở các bài báo khoa học hay thành tích cá nhân, mà có thể chuyển hóa thành những giá trị thiết thực cho khoa học, giáo dục và phục vụ sự phát triển của đất nước”.",
      "Với Thiện, sự trở về đâu chỉ là thay đổi nơi làm việc. Đó còn là mang theo cả một hành trình nhiều năm học tập xa nhà, cả những lần thất bại, những đêm thức trắng xử lý dữ liệu, hay cả những kinh nghiệm nghiên cứu tích lũy được. Anh hy vọng sẽ tiếp tục tham gia các dự án nghiên cứu trong nước, hướng dẫn sinh viên, đồng thời tận dụng mạng lưới học thuật đã xây dựng tại Nga để kết nối các cơ sở nghiên cứu của Việt Nam với các đối tác quốc tế.",
      "“Tôi nghĩ, không chỉ tôi, mà các nhà khoa học khác, đều mong muốn được làm việc trong một môi trường coi trọng tri thức, tôn trọng chuyên môn và tạo cơ hội để các nhà khoa học trẻ phát triển bằng năng lực thực chất. Mới về sẽ có nhiều bỡ ngỡ, sự hỗ trợ của Nhà nước về cơ sở vật chất, điều kiện sinh hoạt là vô cùng quan trọng”, Thiện nói.",
      "Tối ưu nguồn lực",
      "Mỗi năm, Chính phủ Nga dành khoảng 1.000 chỉ tiêu học bổng các trình độ đại học, thạc sĩ, tiến sĩ, thực tập chuyên ngành và tiếng Nga cho công dân Việt Nam. Nếu như trước đây, câu chuyện về nguồn lực người Việt Nam ở nước ngoài nói chung và ở Nga nói riêng thường được nhắc đến nhiều hơn dưới góc độ kiều hối, đầu tư hay thương mại, thì trong bối cảnh phát triển mới, nguồn lực tri thức đang được đặt ở vị trí ngày càng quan trọng. Tại Nga, nguồn lực ấy không chỉ là hàng nghìn lưu học sinh đang học tập tại các trường đại học, mà còn là đội ngũ giáo sư, nhà khoa học, nghiên cứu viên, kỹ sư đã nhiều năm làm việc trong các viện nghiên cứu, trung tâm khoa học và doanh nghiệp công nghệ của Nga. Họ “thấm” nền khoa học Nga, thông thạo ngôn ngữ, quen với văn hóa nghiên cứu, đồng thời cũng hiểu rõ những yêu cầu phát triển của Việt Nam.",
      "Theo Tiến sĩ Nguyễn Quốc Hùng, Giám đốc Quỹ thúc đẩy hợp tác Nga-Việt “Truyền thống và Hữu nghị”, thế giới đang bước vào giai đoạn cạnh tranh bằng khoa học, công nghệ và đổi mới sáng tạo. Hơn 30 năm gắn bó với nước Nga, Tiến sĩ Nguyễn Quốc Hùng nhìn nhận: Hiện là thời điểm của những cơ hội hợp tác mới giữa hai nước. Liên bang Nga là một cường quốc hàng đầu thế giới về khoa học cơ bản, công nghệ hạt nhân, hàng không vũ trụ, năng lượng, vật liệu mới và trí tuệ nhân tạo (AI). Sau biến động địa chính trị những năm gần đây, Nga đang đẩy mạnh chiến lược tự chủ công nghệ và xoay trục hướng Đông. Điều này mở ra nhiều dư địa hợp tác chiến lược với Việt Nam, trong đó có cơ hội hợp tác chuyển giao công nghệ lõi, giảm phụ thuộc nhập khẩu công nghệ và tiến tới làm chủ các phân khúc cao trong chuỗi giá trị.",
      "Ông cũng khẳng định: Đội ngũ trí thức, nhà khoa học, sinh viên, cộng đồng người Việt tại Nga đang ngày càng phát triển vững mạnh, có tri thức khoa học, có nền tảng hiểu biết văn hóa-xã hội Nga, đang dần hình thành một thế hệ trẻ, hội nhập ngày càng sâu vào đời sống xã hội sở tại, có quan hệ tốt với các cơ quan đoàn thể, tổ chức khoa học tại Nga. Họ đóng vai trò là cầu nối chuyển giao tri thức, là những người nắm vững tinh hoa khoa học Nga và hiểu rõ nhu cầu thực tiễn của Việt Nam.",
      "“Nếu biết tận dụng đúng thời điểm, Việt Nam có thể tiếp cận sâu hơn các công nghệ lõi, từng bước nâng cao năng lực làm chủ công nghệ và tham gia các phân khúc có giá trị gia tăng cao hơn”, Tiến sĩ Nguyễn Quốc Hùng nhận định.",
      "Tiềm năng là rất lớn, tuy nhiên, một thực tế tồn tại nhiều năm nay là đội ngũ trí thức Việt Nam tại Nga vẫn đang hoạt động khá phân tán. Do điều kiện địa lý xa cách, mỗi người đều có những mối quan hệ học thuật riêng, những hướng nghiên cứu riêng, chưa có nhiều cơ hội kết nối với nhau hoặc với các cơ quan, doanh nghiệp trong nước. Thực tế này cho thấy, nhu cầu xây dựng một mạng lưới, một sự liên kết chặt chẽ hơn, nhằm tận dụng và phát huy hiệu quả nguồn lực trí thức người Việt tại Nga phục vụ tiến trình phát triển của Việt Nam, là hết sức cần thiết.",
      "Khoa học có thể không có biên giới, nhưng trách nhiệm với quê hương luôn là sợi dây gắn kết những người làm khoa học với đất nước. Dù sống và làm việc tại miền Bạch dương xa xôi, trái tim của cộng đồng người Việt, của đội ngũ trí thức luôn hướng về quê hương với khát vọng cống hiến cao nhất, nhằm góp phần đưa khoa học-kỹ thuật trở thành trụ cột vững chắc trong quan hệ Đối tác chiến lược toàn diện Việt Nam-Liên bang Nga, góp phần đưa Việt Nam vững vàng bước vào kỷ nguyên mới"
    ],
    "sources": [
      "https://nhandan.vn/mang-tri-thuc-tro-ve-post984840.html"
    ]
  },
  {
    "id": 2,
    "title": "Ông Đỗ Xuân Hoàng được Saint Petersburg ghi nhận thành tích hợp tác quốc tế",
    "summary": "Trong suốt những năm hoạt động, Quỹ đã triển khai nhiều dự án thiết thực nhằm củng cố và phát triển quan hệ hợp tác song phương Nga – Việt, nhận được sự đánh giá cao từ đại diện các cơ quan chính quyền, các tổ chức xã hội và cơ sở giáo dục của cả hai nước.",
    "category": "cooperation",
    "date": "08/2026",
    "image": "https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169200/vnru/news/official-edbe2e6d-a90d-4dc0-be56-098fae9b5936.webp",
    "body": [
      "Trong suốt những năm hoạt động, Quỹ đã triển khai nhiều dự án thiết thực nhằm củng cố và phát triển quan hệ hợp tác song phương Nga – Việt, nhận được sự đánh giá cao từ đại diện các cơ quan chính quyền, các tổ chức xã hội và cơ sở giáo dục của cả hai nước.",
      "Ông Đỗ Xuân Hoàng hiện là Chủ tịch liên hiệp các tổ chức người Việt Nam tại Liên bang Nga, Ủy viên Ủy ban Trung ương Mặt trận Tổ quốc Việt Nam. Ông luôn tích cực ủng hộ các chương trình của Saint Petersburg trong việc thiết lập, mở rộng quan hệ với các địa phương của Việt Nam, với các tổ chức xã hội và cộng đồng người Việt tại Liên bang Nga; đồng thời đóng góp hiệu quả vào các dự án giao lưu và phát triển văn hóa Nga – Việt, cũng như các hoạt động quảng bá tiếng Nga tại Việt Nam và tiếng Việt tại Nga.",
      "Đặc biệt, vào năm 2023, ông Đỗ Xuân Hoàng đã đóng góp vai trò tích cực trong việc hiện thực hóa dự án dựng tượng Chủ tịch Hồ Chí Minh tại thành phố Saint Petersburg."
    ],
    "sources": [
      "https://spbdnevnik.ru/news/2026-08-26/nagrady-za-vydayushchiesya-zaslugi-poluchat-v-peterburge-spetsialisty-oblasti-mezhdunarodnogo-sotrudnichestva"
    ]
  },
  {
    "id": 3,
    "title": "Meet Global MICE Congress 2026 dự kiến diễn ra tại Moskva",
    "summary": "Meet Global MICE Congress là điểm hẹn thường niên của các chuyên gia trong ngành MICE đến từ các quốc gia khối BRICS và nhóm các nước Nam Bán cầu (Global South) nhằm trao đổi kinh nghiệm, thảo luận về các vấn đề cấp thiết và tìm kiếm những cơ hội phát triển kinh doanh mới.",
    "category": "cooperation",
    "date": "08/2026",
    "image": null,
    "body": [
      "Meet Global MICE Congress là điểm hẹn thường niên của các chuyên gia trong ngành MICE đến từ các quốc gia khối BRICS và nhóm các nước Nam Bán cầu (Global South) nhằm trao đổi kinh nghiệm, thảo luận về các vấn đề cấp thiết và tìm kiếm những cơ hội phát triển kinh doanh mới.",
      "Trong khuôn khổ chương trình năm nay, dự kiến sẽ có hơn 15 phiên làm việc chuyên đề. Vào ngày đầu tiên, trọng tâm chương trình sẽ hướng vào các vấn đề hợp tác liên chính phủ, các xu hướng chủ đạo trong ngành; đồng thời các đại biểu cũng sẽ thảo luận về chiến lược quảng bá điểm đến, tương lai của ngành triển lãm – hội nghị và các chủ đề toàn cầu khác.",
      "Tâm điểm của ngày thứ hai là hoạt động kinh doanh cùng các cơ hội phát triển và vươn tầm toàn cầu. Bên cạnh các phiên thảo luận bàn tròn (panel discussion) truyền thống, khách tham dự sẽ được trải nghiệm các buổi đào tạo chuyên sâu và các phần chia sẻ của chuyên gia dưới hình thức diễn đàn mở (open mic). Đại diện các cơ quan chính phủ và khối doanh nghiệp sẽ cùng chia sẻ những kinh nghiệm thực tiễn xuất sắc nhất trong lĩnh vực du lịch công vụ.",
      "Tại sự kiện, sẽ bố trí khu vực triển lãm dành cho các đơn vị trưng bày của Nga và quốc tế, nơi các đại biểu có thể quảng bá dịch vụ, gặp gỡ và đàm phán trực tiếp với các khách hàng tiềm năng cũng như các đơn vị tổ chức sự kiện. Tại không gian đại hội cũng sẽ có các gian hàng thuộc dự án \"Tiệc trà Moscow\" (Московское чаепитие) và chương trình \"Sản xuất tại Moscow\" (Made in Moscow / Сделано в Москве).",
      "Vào năm 2024, sự kiện Meet Global MICE Congress: Phiên bản BRICS đã thu hút hơn 1.300 đại diện ngành MICE đến từ 17 quốc gia, bao gồm Nga, Ấn Độ, Trung Quốc và nhiều quốc gia khác.",
      "Cục Du lịch Quốc gia Việt Nam đề nghị các Sở Du lịch, Sở VHTTDL, doanh nghiệp lữ hành, khách sạn, hàng không và đơn vị dịch vụ du lịch có nhu cầu chủ động nghiên cứu, đăng ký tham dự và liên hệ Ban Tổ chức để nắm thông tin về chương trình, điều kiện, thủ tục tham dự.",
      "Đầu mối liên hệ Ban Tổ chức (Bà Catherine Trofimova; Điện thoại: +7 901 383 33 02; Email: TrofimovaEV@mos.ru) và thông tin về Cục Du lịch Quốc gia Việt Nam để tổng hợp, theo dõi."
    ],
    "sources": [
      "https://events.rbc.ru/event/68dd0ebd9a79476d9da995ec#info"
    ],
    "contentType": "EVENT"
  },
  {
    "id": 4,
    "title": "TUYỂN SINH TRONG KHUÔN KHỔ TRƯỜNG QUỐC TẾ “STUDTURIZM”",
    "summary": "Khóa học Du lịch Sinh viên Quốc tế sẽ được tổ chức từ ngày 21 đến 26 tháng 9 năm 2026 tại Việt Nam, tại Đại học Đà Nẵng (Đại học Ngoại ngữ).",
    "category": "cooperation",
    "date": "08/2026",
    "image": null,
    "body": [
      "Khóa học Du lịch Sinh viên Quốc tế sẽ được tổ chức từ ngày 21 đến 26 tháng 9 năm 2026 tại Việt Nam, tại Đại học Đà Nẵng (Đại học Ngoại ngữ).",
      "Năm 2026 được tuyên bố là Năm Hợp tác Khoa học và Giáo dục Nga - Việt Nam.",
      "Chương trình bao gồm các lớp học và hội thảo chung, giới thiệu ngôn ngữ và văn hóa, các nghề thủ công và trò chơi truyền thống, các chuyến tham quan và làm việc nhóm. Chương trình đặc biệt chú trọng đến việc làm việc với sinh viên quốc tế - người tham gia sẽ được tham quan các khu sinh viên, chợ địa phương, không gian nghệ thuật và các khu vực ven sông ít được thấy trong các chuyến tham quan thông thường.",
      "Chương trình đặc biệt chú trọng kinh nghiệm làm việc với sinh viên quốc tế. Vì vậy, ứng viên cần từng tham gia các hoạt động cố vấn, hỗ trợ hoặc đồng hành giúp sinh viên nước ngoài thích nghi với môi trường học tập và cuộc sống.",
      "Đối tượng đăng ký gồm sinh viên hệ chính quy; nghiên cứu sinh hệ chính quy hoặc không chính quy; giảng viên, nhà khoa học trẻ và chuyên gia trẻ trong độ tuổi từ 18 đến 35.",
      "Ngôn ngữ làm việc của chương trình là tiếng Anh và ứng viên cần có trình độ từ B2 trở lên. Bên cạnh đó, người tham gia phải có kinh nghiệm được xác nhận trong các hoạt động thanh niên, tự quản sinh viên hoặc hoạt động xã hội.",
      "Thời hạn đăng ký kéo dài đến hết ngày 1/9. Với những bạn trẻ đáp ứng điều kiện, đây là dịp để trải nghiệm môi trường đại học tại Việt Nam, kết nối với sinh viên hai nước và trực tiếp tham gia một chương trình giao lưu giáo dục Nga – Việt.",
      "Link đăng ký: https://forms.yandex.ru/u/6a8553c2d04688456f6ba4ba/"
    ],
    "sources": [
      "https://intermol.su/news/prodolzhaetsya-nabor-uchastnikov-na-mezhdunarodnuyu-shkolu-studturizma-vo-vetname/"
    ],
    "contentType": "OPPORTUNITY"
  },
  {
    "id": 5,
    "title": "TRƯỜNG ĐẠI HỌC KHOA HỌC TỰ NHIÊN VÀ ROSATOM QUANTUM THÚC ĐẨY HỢP TÁC TRONG LĨNH VỰC CÔNG NGHỆ LƯỢNG TỬ",
    "summary": "Ngày 12/8/2026, tại Trường Đại học Khoa học Tự nhiên, ĐHQGHN (HUS), lãnh đạo Nhà trường đã có buổi gặp gỡ và trao đổi với đoàn đại biểu từ Rosatom Quantum, đơn vị điều phối sáng kiến quốc gia của Nga về điện toán lượng tử, nhằm thảo luận về định hướng hợp tác khoa học – công nghệ, với trọng tâm là công nghệ lượng tử.",
    "category": "education",
    "date": "12/08/2026",
    "image": "https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169181/vnru/news/official-5365b1a1-06e3-4dd3-9e70-c172c9c555c5.webp",
    "body": [
      "Ngày 12/8/2026, tại Trường Đại học Khoa học Tự nhiên, ĐHQGHN (HUS), lãnh đạo Nhà trường đã có buổi gặp gỡ và trao đổi với đoàn đại biểu từ Rosatom Quantum, đơn vị điều phối sáng kiến quốc gia của Nga về điện toán lượng tử, nhằm thảo luận về định hướng hợp tác khoa học – công nghệ, với trọng tâm là công nghệ lượng tử.",
      "Tại buổi làm việc, hai bên cùng nhìn lại nền tảng hợp tác lâu đời giữa Việt Nam và Liên bang Nga, đồng thời trao đổi về cách thức đưa mối quan hệ hợp tác vào những chương trình cụ thể, thiết thực hơn, đặc biệt trong đào tạo nguồn nhân lực trẻ và triển khai các dự án nghiên cứu chung.",
      "Một trong những nội dung được quan tâm là đề xuất xây dựng Chiến lược Lượng tử Quốc gia, với các trọng tâm gồm phát triển nguồn nhân lực, đào tạo chuyên gia và xây dựng hạ tầng nghiên cứu – công nghệ. Đại diện ROSATOM QUANTUM bày tỏ mong muốn tìm kiếm một đầu mối phù hợp tại Việt Nam để phối hợp triển khai các chương trình giáo dục, nghiên cứu trong lĩnh vực tính toán lượng tử và cảm biến lượng tử.",
      "Phát biểu tại buổi gặp, PGS.TS. Ngạc An Bang, Phó Hiệu trưởng Trường Đại học Khoa học Tự nhiên, khẳng định hợp tác quốc tế cần được xây dựng trên tinh thần bình đẳng, thực chất và cùng có lợi. Theo PGS.TS. Ngạc An Bang, Việt Nam hiện đã có đủ năng lực để tham gia đối thoại và đóng góp vào các chương trình hợp tác quốc tế trong những lĩnh vực công nghệ mới.",
      "Hiện HUS có khoảng 700 giảng viên, nhà khoa học và 10.000 sinh viên; mỗi năm công bố hơn 600 bài báo khoa học, trong đó khoảng 80% thuộc nhóm Q1, Q2. Nhà trường đang tham gia nhiều lĩnh vực công nghệ chiến lược của quốc gia như điện hạt nhân, công nghệ bán dẫn, công nghệ sinh học – y sinh và công nghệ lượng tử. Đặc biệt, HUS là đơn vị tiên phong trong hệ thống ĐHQGHN nghiên cứu về công nghệ lượng tử; những kết quả bước đầu của Nhà trường đã góp phần đặt nền tảng cho việc hình thành một viện nghiên cứu mới thuộc ĐHQGHN trong lĩnh vực này.",
      "Về phía ROSATOM, ông Denis Avetisyan, cố vấn của Rosatom JV Quantum, nhấn mạnh mục tiêu hợp tác không chỉ dừng ở giáo dục hay xây dựng phòng thí nghiệm, mà hướng tới đồng hành cùng Việt Nam xây dựng Chiến lược Lượng tử Quốc gia độc lập và bền vững. Hai bên cũng trao đổi về khả năng phát triển các chương trình đào tạo, nghiên cứu chung và kết nối các nhà khoa học, giảng viên, sinh viên hai nước.",
      "PGS.TS. Ngạc An Bang, Phó Hiệu trưởng Trường Đại học Khoa học Tự nhiên trao tặng quà lưu niệm đến đoàn đại biểu ROSATOM QUANTUM",
      "Buổi làm việc mở ra những triển vọng hợp tác mới giữa Trường Đại học Khoa học Tự nhiên và ROSATOM QUANTUM, đồng thời góp phần tăng cường kết nối khoa học – công nghệ giữa Việt Nam và Liên bang Nga trong một lĩnh vực có ý nghĩa quan trọng đối với tương lai."
    ],
    "sources": [
      "https://hus.vnu.edu.vn/tin-tuc-su-kien/truong-dai-hoc-khoa-hoc-tu-nhien-va-rosatom-quantum-thuc-day-hop-tac-trong-linh-vuc-cong-nghe-luong-tu-145808"
    ]
  },
  {
    "id": 6,
    "title": "VIỆT NAM VÀ NGA THÚC ĐẨY HỢP TÁC GIÁO DỤC, KHOA HỌC VÀ CÔNG NGHỆ",
    "summary": "Ngày 13/8, ông Vladimir Murashkin, Trưởng Cơ quan đại diện Rossotrudnichestvo tại Việt Nam, tham dự cuộc làm việc tại Bộ Giáo dục và Đào tạo. Nội dung trao đổi tập trung vào những vấn đề hiện nay trong hợp tác song phương về giáo dục, khoa học và công nghệ.",
    "category": "education",
    "date": "13/08/2026",
    "image": "https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169196/vnru/news/official-cd567ac8-0de8-45d8-a46a-1c50be23e42d.webp",
    "body": [
      "Ngày 13/8, ông Vladimir Murashkin, Trưởng Cơ quan đại diện Rossotrudnichestvo tại Việt Nam, tham dự cuộc làm việc tại Bộ Giáo dục và Đào tạo. Nội dung trao đổi tập trung vào những vấn đề hiện nay trong hợp tác song phương về giáo dục, khoa học và công nghệ.",
      "Tại cuộc gặp, hai bên đánh giá cao kết quả của các hoạt động hợp tác đã triển khai và thống nhất tiếp tục thúc đẩy quan hệ trong những lĩnh vực có thế mạnh. Kết thúc buổi làm việc, đại diện hai phía khẳng định sẵn sàng phát triển thêm các sáng kiến giáo dục, khoa học và công nghệ chung giữa Việt Nam và Nga.",
      "Giáo dục và khoa học tiếp tục là một trong những lĩnh vực quan trọng trong quan hệ hai nước. Năm 2026 cũng diễn ra Năm chéo Khoa học và Giáo dục Việt Nam – Liên bang Nga. Tháng 2, tại Hà Nội, Giáo sư, Viện sĩ Châu Văn Minh, Chủ tịch Viện Hàn lâm Khoa học và Công nghệ Việt Nam, được trao danh hiệu Đại sứ Khoa học và Giáo dục của Liên bang Nga. Sự kiện được phía Việt Nam đánh giá là một hoạt động góp phần thúc đẩy hợp tác nghiên cứu và đào tạo giữa hai nước.",
      "Trong lĩnh vực đào tạo, Nga hiện duy trì 1.000 suất học bổng mỗi năm dành cho công dân Việt Nam. Cùng với tuyển sinh du học, các hoạt động kết nối giữa trường đại học hai nước đang hướng tới những chương trình đào tạo chung, trao đổi học thuật và nghiên cứu khoa học. Ông Vladimir Murashkin từng nhấn mạnh ưu tiên kết nối thế hệ trẻ Việt Nam và Nga thông qua các chương trình đào tạo, nghiên cứu chung, đồng thời coi tri thức và sự hiểu biết lẫn nhau là nền tảng cho quan hệ lâu dài giữa hai nước.",
      "Các hoạt động hợp tác ở cấp cơ sở giáo dục cũng được mở rộng. Trong những chương trình kết nối gần đây, nhiều trường đại học Nga đã giới thiệu cơ hội học tập và nghiên cứu với học sinh, sinh viên Việt Nam. Đại học Bách khoa Saint Petersburg Peter Đại đế cho biết sinh viên Việt Nam đặc biệt quan tâm tới các ngành kỹ thuật, khoa học tự nhiên và khả năng tham gia dự án nghiên cứu, phòng thí nghiệm trong quá trình học. Tại các hoạt động quảng bá giáo dục Nga, phía Nga tiếp tục giới thiệu cơ chế tuyển sinh theo diện chỉ tiêu học bổng dành cho Việt Nam.",
      "Bên cạnh hợp tác giữa các trường, kết nối đào tạo với doanh nghiệp cũng được triển khai. Tháng 4/2026, Trường Đại học Hàng hải Việt Nam ký thỏa thuận hợp tác với DBF Logistic Vietnam, đơn vị thuộc Tập đoàn Vận tải Viễn Đông FESCO của Nga. Tại sự kiện, ông Vladimir Murashkin cho rằng hoạt động này không chỉ gắn đào tạo với thực tiễn doanh nghiệp mà còn đóng góp vào hợp tác Việt Nam – Nga trong giáo dục, khoa học và phát triển nguồn nhân lực.",
      "Trong hợp tác khoa học, Viện Hàn lâm Khoa học và Công nghệ Việt Nam và các đối tác Nga tiếp tục duy trì các hoạt động nghiên cứu, đào tạo và trao đổi chuyên môn. Phía Nga đồng thời xác định Trung tâm Khoa học và Văn hóa Nga tại Hà Nội là một đầu mối kết nối các cơ sở giáo dục hai nước, hỗ trợ học bổng, trao đổi học thuật cũng như phổ biến tiếng Nga và văn hóa Nga tại Việt Nam.",
      "Cuộc làm việc ngày 13/8 tại Bộ Giáo dục và Đào tạo tiếp tục đặt giáo dục, khoa học và công nghệ trong chương trình hợp tác song phương. Hai bên khẳng định định hướng phát triển quan hệ đối tác Nga – Việt Nam và chuẩn bị các sáng kiến chung mới trong những lĩnh vực này."
    ],
    "sources": [
      "https://www.facebook.com/rcnkvn/posts/pfbid02JbjQ5F7NAHpAEHUshPMwSzTTDmitjf9eL9MAwwwELmSrAL9gXDp8ZoNSUxCKbguul"
    ]
  },
  {
    "id": 7,
    "title": "DMITRY CHERNYSHENKO: LƯỢNG KHÁCH DU LỊCH VIỆT NAM ĐẾN NGA ĐÃ TĂNG 35,7%",
    "summary": "Ngày 26/8/2026, Phó Thủ tướng Nga Dmitry Chernyshenko đã có cuộc gặp làm việc với Đại sứ Việt Nam tại Liên bang Nga Đặng Minh Khôi. Hai bên đã thảo luận về hợp tác giữa hai nước trên nhiều lĩnh vực, bao gồm du lịch, thương mại và tài chính.",
    "category": "society",
    "date": "26/08/2026",
    "image": "https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169183/vnru/news/official-53aff395-c1bc-4120-ae40-1a7c260aa11c.webp",
    "body": [
      "Ngày 26/8/2026, Phó Thủ tướng Nga Dmitry Chernyshenko đã có cuộc gặp làm việc với Đại sứ Việt Nam tại Liên bang Nga Đặng Minh Khôi. Hai bên đã thảo luận về hợp tác giữa hai nước trên nhiều lĩnh vực, bao gồm du lịch, thương mại và tài chính.",
      "Phó Thủ tướng Nga Dmitry Chernyshenko đã có cuộc gặp làm việc với Đại sứ Việt Nam tại Liên bang Nga Đặng Minh Khôi",
      "Ông Dmitry Chernyshenko cho biết, năm nay, cuộc họp lần thứ 26 của Ủy ban liên chính phủ Nga-Việt Nam về hợp tác thương mại, kinh tế, khoa học và kỹ thuật dự kiến ​​sẽ được tổ chức tại Hà Nội vào tháng 11.",
      "Năm 2026 đánh dấu kỷ niệm 10 năm Hiệp định Thương mại Tự do giữa Việt Nam và Liên minh Kinh tế Á - Âu (EAEU) có hiệu lực. Theo Phó Thủ tướng Chernyshenko, cơ chế này đã chứng minh tính hiệu quả, đóng góp quan trọng vào tăng trưởng kim ngạch thương mại hai chiều. Hướng tới Khóa họp lần thứ 26 Ủy ban liên chính phủ Việt Nam - LB Nga về hợp tác kinh tế - thương mại và khoa học - kỹ thuật, Phó Thủ tướng Nga đề xuất hai bên cần tập trung thúc đẩy hợp tác trong các lĩnh vực mới và tiềm năng, nhằm tạo ra động lực tăng trưởng bền vững.",
      "Đáng chú ý, một trong những điểm sáng nổi bật nhất được hai bên thảo luận là sự phục hồi và tăng trưởng ngoạn mục của ngành du lịch. Phó Thủ tướng Chernyshenko và Đại sứ Đặng Minh Khôi cùng ghi nhận đà phát triển rất tích cực ở cả hai chiều. Nếu năm 2025 Việt Nam đón 690.000 lượt khách Nga, thì trong nửa đầu năm 2026, con số này đã đạt 863.000 lượt. Điều này cho thấy sức hút ngày càng lớn của các điểm đến Việt Nam đối với du khách Nga. Ở chiều ngược lại, lượng khách du lịch Việt Nam đến Nga cũng ghi nhận mức tăng trưởng ấn tượng. Hiện nay, hai bên đã phối hợp khai thác thành công 31 chuyến bay trên 15 đường bay kết nối đến nhiều thành phố khác nhau, tạo tiền đề quan trọng để mở rộng mạng lưới đường bay trong thời gian tới.",
      "Về phần mình, Đại sứ Việt Nam tại LB Nga Đặng Minh Khôi nhấn mạnh sự phát triển tốt đẹp của quan hệ Đối tác chiến lược toàn diện Việt Nam - LB Nga trên tất cả các lĩnh vực. Đại sứ Đặng Minh Khôi khẳng định, Việt Nam luôn coi trọng và mong muốn cùng LB Nga tiếp tục đẩy mạnh hợp tác thực chất, hiệu quả không chỉ trong các lĩnh vực truyền thống như chính trị, năng lượng, dầu khí, mà còn mở rộng sang khoa học, giáo dục, văn hóa, thể thao và du lịch. Qua đó, đưa quan hệ hai nước ngày càng đi vào chiều sâu, mang lại lợi ích thiết thực cho nhân dân hai nước.",
      "Nguôn tin: http://government.ru/news/59695/"
    ],
    "sources": []
  },
  {
    "id": 8,
    "title": "THƯƠNG MẠI VÀ ĐẦU TƯ GIỮA NGA VÀ VIỆT NAM NĂM 2026: CÁC LĨNH VỰC HỢP TÁC MỚI",
    "summary": "Năm 2026, quan hệ kinh tế giữa Nga và Việt Nam sẽ bước vào một giai đoạn mới. Điều này không chỉ bao gồm việc khôi phục thương mại song phương mà còn thiết lập một hệ thống hợp tác công nghiệp, công nghệ và hậu cần sâu rộng hơn. Các lĩnh vực hợp tác trọng điểm sẽ bao gồm sản xuất chung, đầu tư, vận tải và hậu cần, công nghệ số, năng lượng, du lịch và hợp tác khoa học công nghệ.",
    "category": "society",
    "date": "08/2026",
    "image": "https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169191/vnru/news/official-ae6ab3f0-9830-417e-9098-a8eca19c3102.webp",
    "body": [
      "Năm 2026, quan hệ kinh tế giữa Nga và Việt Nam sẽ bước vào một giai đoạn mới. Điều này không chỉ bao gồm việc khôi phục thương mại song phương mà còn thiết lập một hệ thống hợp tác công nghiệp, công nghệ và hậu cần sâu rộng hơn. Các lĩnh vực hợp tác trọng điểm sẽ bao gồm sản xuất chung, đầu tư, vận tải và hậu cần, công nghệ số, năng lượng, du lịch và hợp tác khoa học công nghệ.",
      "Năm 2025, kim ngạch thương mại giữa hai nước đạt 4,77 tỷ USD, tăng 4% so với năm trước. Việt Nam xuất khẩu hàng hóa trị giá 2,26 tỷ USD sang Nga và nhập khẩu hàng hóa Nga trị giá 2,51 tỷ USD. Trong 5 tháng đầu năm 2026, kim ngạch thương mại đạt khoảng 2,16 tỷ USD, tăng 6,6% so với cùng kỳ năm ngoái. Các mặt hàng xuất khẩu chính của Việt Nam gồm dệt may, cà phê, thủy sản, giày dép, hạt điều, tiêu, cao su và điện tử; Nga cung cấp dầu khí, than đá, phân bón, kim loại, thiết bị và hóa chất. Mục tiêu chiến lược của hai nước là nâng kim ngạch thương mại lên 10 tỷ USD.",
      "Đồng thời, mô hình tương tác kinh tế cũng đang thay đổi. Tại một hội nghị kinh doanh ở Thành phố Hồ Chí Minh ngày 5 tháng 8, trọng tâm không chỉ là bán hàng hóa Nga sang Việt Nam mà còn là tìm kiếm đối tác sản xuất chung, nội địa hóa, trao đổi công nghệ và tích hợp chuỗi cung ứng. Các lĩnh vực tiềm năng được xác định bao gồm cơ khí chính xác, sản xuất linh kiện điện tử, tự động hóa, thiết bị, nhà máy thông minh, chuyển đổi số, chế biến thực phẩm, bao bì và logistics. Các công ty Nga có thể cung cấp công nghệ, thiết bị và phần mềm, trong khi các đối tác Việt Nam có thể cung cấp năng lực sản xuất, tích hợp hệ thống và dịch vụ.",
      "Hợp tác đầu tư đóng vai trò then chốt. Đầu năm 2026, có khoảng 220 dự án của Nga với tổng vốn đầu tư khoảng 996 triệu USD đang được triển khai tại Việt Nam. Tại Nga, có khoảng 18 dự án của Việt Nam với tổng giá trị khoảng 1,64 tỷ USD. Mô hình liên doanh, kết hợp công nghệ của Nga với năng lực sản xuất và khả năng tiếp cận thị trường của Việt Nam, ngày càng trở nên quan trọng. Moscow cũng đang khuyến khích các doanh nghiệp Việt Nam nội địa hóa sản xuất và thành lập các liên doanh.",
      "Lĩnh vực thực phẩm vẫn là một lĩnh vực riêng biệt. Các công ty Nga đang tích cực quảng bá các sản phẩm thịt và sữa, hải sản, bánh kẹo, trà, dầu thực vật và các mặt hàng khác tại Việt Nam. Nga cũng quan tâm đến việc nhập khẩu các sản phẩm nông nghiệp của Việt Nam. Tiềm năng hợp tác không chỉ giới hạn ở thương mại: công nghệ của Nga có thể được sử dụng trong ngành công nghiệp thực phẩm, bao bì, hệ thống truy xuất nguồn gốc, hậu cần lạnh và chế biến thực phẩm.",
      "Vận tải hàng hóa đang trở thành yếu tố then chốt trong thương mại song phương. Năm 2025, lưu lượng vận chuyển hàng hóa giữa Nga và Việt Nam đạt 688.300 tấn, tăng 38%. Hợp tác giữa các công ty cảng và vận tải Nga và Việt Nam, cũng như hợp tác đường sắt, đang phát triển. Hai bên đang xem xét phát triển hành lang vận tải Việt Nam - Trung Quốc - Nga, có thể mở rộng quan hệ thương mại trên toàn khu vực Á-Âu. Các vấn đề như xây dựng tuyến tàu điện ngầm tại Hà Nội, chuyển giao công nghệ, đào tạo nhân lực và sử dụng các giải pháp số trong quản lý vận tải cũng đang được thảo luận.",
      "Ngành hàng không cũng đã phát triển đáng kể. Trong nửa đầu năm 2026, lượng hành khách giữa Nga và Việt Nam đạt 1,07 triệu người, tăng 32% so với cùng kỳ năm ngoái. Việc mở rộng các chuyến bay thẳng đang thúc đẩy du lịch. Trong bảy tháng đầu năm 2026, khoảng 863.000 du khách Nga đã đến thăm Việt Nam, tăng 174% so với cùng kỳ năm ngoái. Nga đã trở thành thị trường du lịch châu Âu lớn nhất của Việt Nam, và tổng lượng khách du lịch Nga năm 2026 có thể vượt quá 1 triệu người.",
      "Đồng thời, hợp tác kỹ thuật số và công nghệ đang mở rộng. Các công ty CNTT Nga đang giới thiệu các giải pháp về hậu cần số, tự động hóa cảng và tự động hóa kho bãi tại Việt Nam. Thị trường số hóa công nghiệp Việt Nam được xem là đầy triển vọng đối với các nhà phát triển phần mềm Nga. Các cơ chế mới cho phép các công ty CNTT nước ngoài thành lập liên doanh với các đối tác Việt Nam và tham gia vào các dự án chuyển đổi số của chính phủ, với điều kiện phải nội địa hóa và chuyển giao công nghệ. An ninh mạng, trí tuệ nhân tạo và chuyển đổi số cũng là những ưu tiên trong hợp tác công nghệ song phương.",
      "Năng lượng vẫn là trụ cột chiến lược trong quan hệ song phương. Các công ty Nga tiếp tục tham gia vào các dự án dầu khí của Việt Nam, và hợp tác trong lĩnh vực năng lượng hạt nhân đang đạt đến một tầm cao mới. Cụ thể, các cuộc thảo luận đang được tiến hành về việc xây dựng trung tâm nghiên cứu công nghệ hạt nhân, đào tạo chuyên gia, an toàn bức xạ và triển vọng về các lò phản ứng mô-đun nhỏ. Điều này cho thấy sự chuyển dịch dần từ hợp tác nguyên liệu truyền thống sang hợp tác công nghệ cao.",
      "Vùng Viễn Đông Nga đang ngày càng trở nên quan trọng. Khu vực Primorsky Krai được xem là một nền tảng thuận lợi để phát triển logistics hàng hải, thương mại thực phẩm, nông nghiệp, du lịch và thu hút đầu tư từ Việt Nam. Sự tăng trưởng kim ngạch thương mại của Primorsky Krai với Việt Nam và sự sẵn có của các tuyến vận chuyển container trực tiếp giữa các cảng trong khu vực với Thành phố Hồ Chí Minh, Hải Phòng và Đà Nẵng tạo ra thêm nhiều cơ hội để mở rộng quan hệ kinh tế.",
      "Như vậy, quan hệ đối tác kinh tế Nga-Việt Nam đến năm 2026 sẽ dần mở rộng vượt ra ngoài lĩnh vực thương mại truyền thống. Mô hình đầy triển vọng này dựa trên sản xuất chung, nội địa hóa, trao đổi công nghệ, phát triển các hành lang giao thông, số hóa, năng lượng và du lịch. Nếu được thực hiện nhất quán, cách tiếp cận này sẽ cho phép hai nước không chỉ tăng cường thương mại mà còn tạo ra các chuỗi sản xuất và công nghệ bền vững hơn, có thể hình thành nền tảng cho quan hệ đối tác kinh tế lâu dài."
    ],
    "sources": [
      "https://ru.vietnamplus.vn/torgovlja-i-investitsii-rossii-i-v-etnama-v-2026-godu-novie-napravlenija-sotrudnichestva-post100130.vnp"
    ]
  },
  {
    "id": 9,
    "title": "Mở rộng hợp tác khoa học, giáo dục vì phát triển Việt - Nga",
    "summary": "Vào ngày 26 tháng 8 tại Hà Nội, trong khuôn khổ Ngày Hội đồng Nhân dân Thế giới tại Việt Nam, Liên minh các Tổ chức Hữu nghị Việt Nam và Hội đồng Nhân dân Thế giới, phối hợp với Đại học Kinh tế - Đại học Quốc gia Việt Nam, Hà Nội, đã tổ chức hội thảo với chủ đề \"Hợp tác quốc tế trong khoa học và giáo dục như một yếu tố thúc đẩy phát triển bền vững\". Hội thảo đã thảo luận các giải pháp mở rộng hợp tác trong giáo dục, khoa học và công nghệ, tập trung vào kết nối Việt Nam và Liên bang Nga.",
    "category": "education",
    "date": "08/2026",
    "image": null,
    "body": [
      "Vào ngày 26 tháng 8 tại Hà Nội, trong khuôn khổ Ngày Hội đồng Nhân dân Thế giới tại Việt Nam, Liên minh các Tổ chức Hữu nghị Việt Nam và Hội đồng Nhân dân Thế giới, phối hợp với Đại học Kinh tế - Đại học Quốc gia Việt Nam, Hà Nội, đã tổ chức hội thảo với chủ đề \"Hợp tác quốc tế trong khoa học và giáo dục như một yếu tố thúc đẩy phát triển bền vững\". Hội thảo đã thảo luận các giải pháp mở rộng hợp tác trong giáo dục, khoa học và công nghệ, tập trung vào kết nối Việt Nam và Liên bang Nga.",
      "Kết nối tri thức vì phát triển bền vững",
      "Phát biểu tại tọa đàm, PGS. TS. Lê Trung Thành, Phó Hiệu trưởng Trường Đại học Kinh tế, Đại học Quốc gia Hà Nội nhận định thế giới đang bước vào giai đoạn chuyển đổi sâu rộng. Trí tuệ nhân tạo, chuyển đổi số, kinh tế xanh và biến đổi khí hậu đang làm thay đổi cách thức nghiên cứu, làm việc và hợp tác. Các mục tiêu phát triển bền vững không thể được thực hiện bởi một quốc gia hay tổ chức riêng lẻ mà đòi hỏi các mạng lưới hợp tác quốc tế để chia sẻ tri thức, kết nối kinh nghiệm và huy động nguồn lực. Trong đó, hợp tác quốc tế về khoa học và giáo dục là nền tảng quan trọng thúc đẩy phát triển bền vững.",
      "PGS. TS. Lê Trung Thành, Phó Hiệu trưởng Trường Đại học Kinh tế, Đại học Quốc gia Hà Nội phát biểu tại tọa đàm.",
      "Từ yêu cầu đó, tọa đàm hướng tới tạo diễn đàn trao đổi học thuật, mở rộng không gian đối thoại và tìm kiếm các mô hình hợp tác mới. Trọng tâm là tăng cường kết nối giữa các trường đại học; gắn nghiên cứu khoa học với đổi mới sáng tạo và nhu cầu xã hội; phát huy vai trò của các tổ chức quốc tế trong kết nối cơ sở giáo dục, nhà khoa học và đối tác quốc tế. Qua đó, các bên hướng tới hình thành mạng lưới hợp tác đa phương, góp phần giải quyết các vấn đề kinh tế - xã hội và thúc đẩy phát triển bền vững.",
      "Ông Andrey Belyaninov, Tổng Thư ký Hội đồng nhân dân thế giới phát biểu tại tọa đàm.",
      "Ông Andrey Belyaninov, Tổng Thư ký Hội đồng nhân dân thế giới nhấn mạnh trách nhiệm của các nhà nghiên cứu và giáo dục đối với tương lai của đất nước. Theo ông, giáo dục cần trang bị cho thế hệ trẻ khả năng nhận diện, kiểm chứng thông tin và nâng cao “sức đề kháng” trước những tác động tiêu cực từ tin giả trên không gian mạng. Những thành tựu khoa học cũng cần được định hướng vì hòa bình, phát triển bền vững và phục vụ con người. Ông đề cao vai trò của ngoại giao nhân dân trong thúc đẩy đối thoại, tăng cường hợp tác và cùng giải quyết các vấn đề vì một tương lai hòa bình.",
      "Bà Alexandra Ochirova, Đại sứ thiện chí UNESCO cho rằng hợp tác quốc tế trong giáo dục và khoa học có thể trở thành nền tảng học thuật để tăng cường kết nối giữa các quốc gia. Theo bà, quá trình này cần dựa trên sự hiểu biết về lịch sử, sự tương tác giữa các yếu tố xã hội, văn hóa và khoa học và tôn trọng những giá trị riêng của mỗi dân tộc.",
      "Bà Alexandra Ochirova, Đại sứ thiện chí UNESCO trình bày tham luận.",
      "Bà nhấn mạnh văn hóa giúp các thế hệ duy trì bản sắc và tạo động lực phát triển. Vì vậy, giáo dục và khoa học cần gắn với các giá trị nhân văn, đạo đức và trách nhiệm đối với cộng đồng. Trong bối cảnh hiện nay, bà Alexandra Ochirova cho rằng các nhà khoa học, nhà văn hóa và tổ chức xã hội cần thúc đẩy chia sẻ thông tin dựa trên sự thật, tăng cường hiểu biết và gìn giữ bản sắc văn hóa.",
      "Mở rộng hợp tác Việt Nam-Nga trong giáo dục và công nghệ.",
      "Đại sứ Giáo dục và Khoa học Nga Tô Thị Tuyết Khanh trình bày tham luận.",
      "Tại tọa đàm, Đại sứ Giáo dục và Khoa học Nga Tô Thị Tuyết Khanh nhấn mạnh giáo dục, đào tạo, khoa học và công nghệ là những lĩnh vực quan trọng, góp phần phát triển nguồn nhân lực và thúc đẩy quan hệ Việt Nam - Nga. Hằng năm, Liên bang Nga dành 1.000 chỉ tiêu đào tạo cho học sinh, sinh viên Việt Nam trong nhiều lĩnh vực như kỹ thuật, y tế, năng lượng và kinh tế. Đồng thời, nhu cầu học tiếng Việt tại Nga ngày càng tăng, nhất là khi nhiều người Nga quan tâm đến thị trường Việt Nam.",
      "Định hướng hợp tác thời gian tới, bà đề xuất các trường đại học của hai nước đẩy mạnh trao đổi sinh viên, giảng viên, ấn phẩm khoa học và tổ chức các hội thảo quốc tế. Bên cạnh hợp tác song phương, các cơ sở giáo dục có thể mở rộng kết nối đa phương với các đối tác quốc tế trong giáo dục, đào tạo và nghiên cứu khoa học. Bên cạnh đó, việc phát triển các không gian giới thiệu văn hóa, ngôn ngữ Nga tại các trường đại học có thể giúp sinh viên hiểu rõ hơn về cơ hội học tập, nghiên cứu và nghề nghiệp liên quan đến tiếng Nga. Đây là nền tảng để hình thành các chương trình hợp tác giáo dục quốc tế sâu rộng hơn.",
      "PGS. TS. Hoàng Anh Sơn, Giám đốc Học viện Khoa học và Công nghệ, Viện Hàn lâm Khoa học và Công nghệ Việt Nam trình bày tham luận.",
      "Ở góc độ khoa học và công nghệ, PGS. TS. Hoàng Anh Sơn, Giám đốc Học viện Khoa học và Công nghệ, Viện Hàn lâm Khoa học và Công nghệ Việt Nam, cho rằng khoa học, công nghệ và đổi mới sáng tạo ngày càng giữ vai trò quan trọng trong chiến lược phát triển của các quốc gia.",
      "Hợp tác quốc tế, trong đó có hợp tác với Nga, có ý nghĩa quan trọng đối với việc phát triển các công nghệ chiến lược của Việt Nam. Qua đó, các nhà khoa học có thêm điều kiện tiếp cận tri thức, công nghệ, thiết bị và mạng lưới nghiên cứu quốc tế. Ngoại giao công nghệ có ý nghĩa quan trọng trong kết nối chuyên gia, thu hút tri thức và nguồn lực quốc tế. Theo ông, Hội đồng nhân dân thế giới có thể trở thành cầu nối giữa các viện nghiên cứu, trường đại học và đối tác Việt Nam - Nga trong khoa học, công nghệ và chuyển đổi số.",
      "Để nâng cao hiệu quả hợp tác với các đối tác, ông Hoàng Anh Sơn đề xuất đẩy mạnh nghiên cứu và đào tạo nhân lực trình độ cao. Các lĩnh vực ưu tiên gồm trí tuệ nhân tạo, bán dẫn, công nghệ sinh học, công nghệ lượng tử và năng lượng mới. Đồng thời, cần thúc đẩy chuyển giao, làm chủ công nghệ; hoàn thiện hành lang pháp lý và phát huy mô hình hợp tác công - tư.",
      "Phiên thảo luận tại tọa đàm “Hợp tác quốc tế trong lĩnh vực khoa học và giáo dục như một yếu tố thúc đẩy phát triển bền vững\".",
      "Các ý kiến thảo luận tại tọa đàm nhấn mạnh yêu cầu chuyển từ những hoạt động hợp tác ngắn hạn sang các chương trình có tác động dài hạn. Trong đó, các chương trình đào tạo chung, song bằng và giáo sư thỉnh giảng được đánh giá là những hình thức hợp tác hiệu quả.",
      "Các đại biểu đề xuất tăng cường hợp tác Việt Nam - Nga trong những lĩnh vực mới như trí tuệ nhân tạo, đạo đức và quản lý AI, công nghệ sinh học, kỹ thuật, chăm sóc sức khỏe. Qua đó, hai nước có thể phát huy thế mạnh của mỗi nền giáo dục, mở rộng kết nối học thuật và tạo nền tảng cho các chương trình hợp tác có chiều sâu, đóng góp cho phát triển bền vững."
    ],
    "sources": [
      "https://thoidai.com.vn/mo-rong-hop-tac-khoa-hoc-giao-duc-vi-phat-trien-viet-nga-756909.html"
    ]
  },
  {
    "id": 10,
    "title": "THÚC ĐẨY QUAN HỆ HỢP TÁC TOÀN DIỆN VIỆT NAM – NGA",
    "summary": "Sáng nay (27/8), tại Trụ sở Chính phủ, Phó Thủ tướng Thường trực Chính phủ Phạm Gia Túc có buổi làm việc với Đại sứ Liên bang Nga tại Việt Nam Bezdetko Gennady Stepanovich.",
    "category": "cooperation",
    "date": "27/08/2026",
    "image": "https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169193/vnru/news/official-b39014db-7d27-4e4a-abde-e1396cec3c2d.webp",
    "body": [
      "Sáng nay (27/8), tại Trụ sở Chính phủ, Phó Thủ tướng Thường trực Chính phủ Phạm Gia Túc có buổi làm việc với Đại sứ Liên bang Nga tại Việt Nam Bezdetko Gennady Stepanovich.",
      "Phó Thủ tướng Thường trực Chính phủ Phạm Gia Túc có buổi làm việc với Đại sứ Liên bang Nga tại Việt Nam Bezdetko Gennady Stepanovich - Ảnh: chinhphu.vn/Nguyễn Hoàng",
      "Phó Thủ tướng Thường trực Chính phủ Phạm Gia Túc bày tỏ vui mừng trước sự phát triển tốt đẹp, sôi động, hiệu quả trong mối quan hệ hợp tác đối tác chiến lược toàn diện Việt Nam - Liên bang Nga thời gian qua; cho rằng những kết quả đạt được đã mang lại lợi ích thiết thực cho sự phát triển chung của 2 nước, 2 dân tộc Việt Nam và Liên bang Nga.",
      "Trên nền tảng kết quả hợp tác tốt đẹp giữa 2 nước, Việt Nam mong muốn tiếp tục thúc đẩy hơn nữa các hoạt động hợp tác với Liên bang Nga trong lĩnh vực chính trị, ngoại giao, kinh tế, giáo dục-đào tạo, văn hoá, an ninh-quốc phòng...",
      "Phó Thủ tướng Thường trực Chính phủ Phạm Gia Túc khẳng định, Việt Nam luôn hoan nghênh, chào đón và tạo các điều kiện thuận lợi cho các doanh nghiệp Liên bang Nga sang hợp tác, đầu tư hiệu quả, bền vững, lâu dài tại Việt Nam.",
      "Phó Thủ tướng Thường trực Chính phủ Phạm Gia Túc và Đại sứ Bezdetko Gennady Stepanovich cùng trao đổi nhiều vấn đề mà 2 bên cùng quan tâm trong thúc đẩy quan hệ hợp tác toàn diện giữa 2 nước - Ảnh: chinhphu.vn/Nguyễn Hoàng",
      "Đại sứ Bezdetko Gennady Stepanovich nhấn mạnh, Liên bang Nga đặc biệt coi trọng quan hệ hợp tác với Việt Nam, luôn mong muốn mở rộng các hoạt động hợp tác; sẵn sàng thúc đẩy các hoạt động hợp tác với Việt Nam trong các lĩnh vực Nga có thế mạnh và Việt Nam có nhu cầu như năng lượng, cơ khí, chế tạo máy,...",
      "Đại sứ cũng đề nghị 2 bên cần có các giải pháp quyết liệt hơn nữa trong thúc đẩy các hoạt động hợp tác còn nhiều tiềm năng như đầu tư, xuất nhập khẩu, nông nghiệp, du lịch, giáo dục-đào tạo...",
      "Tại buổi làm việc, Phó Thủ tướng Thường trực Chính phủ Phạm Gia Túc và Đại sứ Bezdetko Gennady Stepanovich cùng trao đổi nhiều vấn đề mà 2 bên cùng quan tâm trong thúc đẩy quan hệ hợp tác toàn diện giữa 2 nước, trong đó có các giải pháp thúc đẩy, khuyến khích đầu tư, tháo gỡ khó khăn cho các dự án, bảo đảm cân đối thương mại, an ninh, quốc phòng, chuyển giao công nghệ, phòng, chống tội phạm mạng, hợp tác hàng không dân dụng…, việc chuẩn bị các nội dung, thoả thuận hợp tác giữa lãnh đạo cấp cao 2 nước tại các cuộc gặp song phương và tại các hội nghị."
    ],
    "sources": [
      "https://baochinhphu.vn/thuc-day-quan-he-hop-tac-toan-dien-viet-nam-lien-bang-nga-102260827121815421.htm"
    ]
  },
  {
    "id": 11,
    "title": "QUỐC HỘI VIỆT NAM ĐÃ PHÊ DUYỆT VIỆC XÂY DỰNG HAI TỔ MÁY PHÁT ĐIỆN VVER-1200 TẠI NHÀ MÁY ĐIỆN HẠT NHÂN NINH THUẬN",
    "summary": "Quốc hội Việt Nam đã thông qua nghị quyết phê duyệt việc xây dựng Nhà máy điện hạt nhân Ninh Thuận-1 tại xã Phước Đình, huyện Thuận Nam. Quyết định này khởi động lại chương trình hạt nhân của đất nước sau 10 năm gián đoạn.",
    "category": "science",
    "date": "08/2026",
    "image": "https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169186/vnru/news/official-6137f058-127b-49ff-97c7-073a8e681cb4.webp",
    "body": [
      "Quốc hội Việt Nam đã thông qua nghị quyết phê duyệt việc xây dựng Nhà máy điện hạt nhân Ninh Thuận-1 tại xã Phước Đình, huyện Thuận Nam. Quyết định này khởi động lại chương trình hạt nhân của đất nước sau 10 năm gián đoạn.",
      "Tập đoàn nhà nước Rosatom sẽ đảm nhiệm vai trò tổng thầu cho dự án. Nhà máy sẽ bao gồm hai tổ máy phát điện với lò phản ứng VVER-1200, tổng công suất 2.400 MW. Tổ máy số 2 của nhà máy điện hạt nhân Leningrad-2 đã được chọn làm mô hình tham khảo để xây dựng.",
      "Dự án này dựa trên khuôn khổ pháp lý được thiết lập trong chuyến thăm Moscow kéo dài 4 ngày của Thủ tướng Phạm Minh Tinh vào tháng 3 năm 2026. Vào thời điểm đó, Rosatom và các quan chức Việt Nam đã ký kết một thỏa thuận hợp tác liên chính phủ được cập nhật, tạo cơ sở pháp lý mới cho việc nối lại hoạt động xây dựng.",
      "Dự án này từng được thảo luận vào năm 2009-2010, nhưng đã bị bỏ dở vào năm 2016 do những vấn đề kinh tế nghiêm trọng và chi phí dự kiến ​​tăng vọt. Trong những năm gần đây, các thành viên quốc hội đã nhiều lần kêu gọi chính phủ khôi phục dự án, cuối cùng dẫn đến một thỏa thuận liên chính phủ mới và sự chấp thuận cuối cùng của quốc hội."
    ],
    "sources": [
      "https://www.atomic-energy.ru/news/2026/08/27/168076"
    ],
    "contentType": "ANNOUNCEMENT"
  },
  {
    "id": 12,
    "title": "HƯỚNG TỚI TỔ CHỨC MÙA VĂN HÓA NGA TẠI VIỆT NAM",
    "summary": "Ngày 11/8/2026, tại trụ sở Bộ Văn hóa, Thể thao và Du lịch, Cục trưởng Cục Hợp tác quốc tế đã có buổi tiếp, làm việc với Đại biện lâm thời Đại sứ quán Liên bang Nga tại Việt Nam Ivan Nesterov trao đổi về hợp tác văn hóa, thể thao và du lịch Việt Nam – Liên bang Nga.",
    "category": "society",
    "date": "11/08/2026",
    "image": "https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169185/vnru/news/official-5cc29b09-0150-41b1-9a7f-b781389200c4.webp",
    "body": [
      "Ngày 11/8/2026, tại trụ sở Bộ Văn hóa, Thể thao và Du lịch, Cục trưởng Cục Hợp tác quốc tế đã có buổi tiếp, làm việc với Đại biện lâm thời Đại sứ quán Liên bang Nga tại Việt Nam Ivan Nesterov trao đổi về hợp tác văn hóa, thể thao và du lịch Việt Nam – Liên bang Nga.",
      "Tại buổi tiếp, hai bên vui mừng trước những kết quả tích cực của hợp tác văn hóa, thể thao và du lịch Việt Nam – Liên bang Nga trên cơ sở quan hệ đối tác chiến lược toàn diện giữa hai nước đang phát triển rất tốt đẹp. Bên cạnh các hoạt động văn hóa lớn đã được tổ chức năm 2026 như Những ngày Văn hóa Nga tại Việt Nam, các hoạt động triển lãm của Nga tại Việt Nam, Cục trưởng Nguyễn Phương Hòa và Đại biện lâm thời Đại sứ quán Nga tại Việt Nam đánh giá, hợp tác du lịch Việt Nam – Nga đang có nhiều triển vọng lớn. Trong 6 tháng năm 2026, số khách du lịch Nga đến Việt Nam đạt gần 800 nghìn lượt, tăng gấp 3 lần so với cùng kỳ năm 2025. Hai bên tin tưởng, năm 2026, số khách du lịch Nga đến Việt Nam có thể đạt mốc 1 triệu lượt khách nhờ các chính sách thuận lợi của Việt Nam để thu hút du khách Nga hiện nay như miễn thị thực đơn phương cho khách du lịch Nga, nhiều chuyến bay thẳng giữa các thành phố của hai nước được kết nối, tăng cường…",
      "Trao đổi về kế hoạch tổ chức các hoạt động trong thời gian tới, bà Nguyễn Phương Hòa đề nghị Đại sứ quán Nga tại Việt Nam hỗ trợ, kết nối và kiến nghị các cơ quan chức năng của Nga tạo điều kiện thuận lợi, phối hợp tổ chức thành công Những ngày Phim Việt Nam tại Nga vào tháng 9 năm 2026, góp phần phát triển hơn nữa hợp tác văn hóa hai nước. Nhân dịp này, bà Nguyễn Phương Hòa thông tin và mời phía Nga cử đoàn, gửi phim tham gia Liên hoan Phim quốc tế Hà Nội lần thứ VIII được tổ chức vào cuối tháng 11 năm 2026.",
      "Về phần mình, chia sẻ kế hoạch tổ chức Giải thưởng Điện ảnh Á – Âu mở rộng “Con bướm kim cương” do Bộ Văn hóa Liên bang Nga và Quỹ Văn hóa Nga sáng lập, Bộ Văn hóa, Thể thao và Du lịch Việt Nam được mời tham gia đồng sáng lập, Đại biện lâm thời Nga tại Việt Nam mời phía Việt Nam gửi phim tham gia giải thưởng được tổ chức vào tháng 11 năm 2026 tại Moscow nhằm thúc đẩy hợp tác, giao lưu điện ảnh giữa các quốc gia Á – Âu và quảng bá các giá trị văn hóa, tinh thần, đạo đức và bản sắc dân tộc.",
      "Về các liên hoan nghệ thuật quốc tế, nhắc lại thành công của Lễ hội Văn hóa thế giới Hà Nội lần thứ nhất năm 2025 với sự tham gia rất hiệu quả của phía Liên bang Nga, Cục trưởng Nguyễn Phương Hòa thông tin về kế hoạch tổ chức Lễ hội Văn hóa thế giới Hà Nội lần thứ hai từ ngày 01-04/10/2026 và mong đợi sự tham gia tích cực hơn nữa của phía Liên bang Nga, góp phần vào thành công chung của sự kiện. Đối với Diễn đàn văn hóa quốc tế St. Petersburg lần thứ XII năm 2026, Liên hoan Xiếc quốc tế St.Petersburg và các hoạt động văn hóa quốc tế khác, phía Việt Nam khẳng định sẽ tích cực xem xét cử đoàn tham gia theo lời mời của phía Nga, qua đó khẳng định quan hệ hữu nghị thân tình giữa hai nước.",
      "Đối với kế hoạch năm 2027, phía Liên bang Nga thông báo, trên cơ sở thỏa thuận đạt được giữa Thủ tướng Chính phủ Việt Nam Lê Minh Hưng và Tổng thống Nga, Bộ Văn hóa Liên bang Nga mong muốn phối hợp với Bộ Văn hóa, Thể thao và Du lịch Việt Nam tổ chức “Mùa Văn hóa Nga tại Việt Nam trong năm 2027”. Đánh giá cao sáng kiến, đề nghị của phía Nga, bà Nguyễn Phương Hòa chuyển thư của Bộ trưởng Bộ Văn hóa, Thể thao và Du lịch Lâm Thị Phương Thanh tới Bộ trưởng Bộ Văn hóa Nga về việc này và khẳng định, Bộ Văn hóa, Thể thao và Du lịch Việt Nam sẽ phối hợp cùng phía Liên bang Nga tổ chức các hoạt động văn hóa, nghệ thuật Nga tại Việt Nam trong suốt bốn mùa của năm 2027. Đây là sự kiện văn hóa có ý nghĩa, kỷ niệm 15 năm hai nước nâng cấp lên quan hệ đối tác chiến lược toàn diện, đồng thời tạo thêm dấu ấn mới trong quan hệ hữu nghị Việt Nam – Nga.",
      "Tại cuộc tiếp, Cục trưởng Nguyễn Phương Hòa đề nghị Đại sứ quán Nga tại Việt Nam phối hợp, thúc đẩy để hai bên sớm thống nhất dự thảo Hiệp định giữa Chính phủ Việt Nam và Chính phủ Liên bang Nga về thành lập Trung tâm Văn hóa Việt Nam tại Nga và Trung tâm Khoa học và Văn hóa Nga tại Việt Nam. Bên cạnh đó, hai bên chia sẻ, trao đổi các biện pháp tăng cường hợp tác thể thao giữa các liên đoàn thể thao Việt Nam và Nga.",
      "Trong không khí thân tình, hai bên tin tưởng, các hoạt động giao lưu văn hóa, hợp tác du lịch, thể thao Việt Nam – Nga sẽ tiếp tục được hai bên ưu tiên, đẩy mạnh, tạo những đóng góp tích cực hơn nữa vào việc củng cố, phát triển quan hệ đối tác chiến lược toàn diện Việt Nam-Nga trong kỷ nguyên mới./."
    ],
    "sources": [
      "https://icd.gov.vn/huong-toi-to-chuc-mua-van-hoa-nga-tai-viet-nam/"
    ]
  },
  {
    "id": 13,
    "title": "CÁC NHÀ KHOA HỌC TỪ ROSATOM VÀ ĐẠI HỌC KỸ THUẬT QUỐC GIA BAUMAN MOSCOW ĐÃ PHÁT TRIỂN MỘT CÔNG NGHỆ ĐỘC ĐÁO ĐỂ SẢN XUẤT CHIP TANTALUM CHO MÁY TÍNH LƯỢNG TỬ",
    "summary": "Tại Quantum Park thuộc Trường Đại học Kỹ thuật Quốc gia Moscow mang tên N.E. Bauman (Bauman MSTU) và Viện Nghiên cứu Khoa học Tự động Toàn Nga (VNIIA), các nhà khoa học đã phát triển thành công công nghệ chế tạo mạch tích hợp siêu dẫn dựa trên nền tảng tantalum (tantal) — một trong những nền tảng vật liệu đầy triển vọng cho các bộ đồng xử lý lượng tử. Chính công nghệ này cho phép cải thiện gấp nhiều lần chất lượng của cơ sở linh kiện điện tử (ЭКБ) lượng tử siêu dẫn. Hệ số phẩm chất (độ lợi) của các vi mạch tantalum do Nga sản xuất đã đạt tới con số hàng chục triệu — mức độ mà hiện nay chỉ có một vài trung tâm khoa học hàng đầu thế giới đạt được. Các kết quả nghiên cứu đã được công bố trên tạp chí khoa học uy tín Applied Physics Reviews (APR 2026). Những lô hàng bộ đồng xử lý lượng tử đầu tiên trên nền tảng tantalum đã được ký kết hợp đồng cung cấp ngay trong mùa thu năm 2026.Quy mô của cuộc cách mạng công nghệ AI hiện nay phụ thuộc trực tiếp vào năng lượng tính toán. Các siêu máy tính thế hệ mới là yếu tố cực kỳ then chốt cho việc huấn luyện mạng thần kinh nhân tạo (AI), mô phỏng khí hậu, giải mã bộ gen và tìm kiếm các vật liệu mới. Trong khi đó, máy tính truyền thống đang dần tiến đến ranh giới vật lý: chúng tiêu thụ hàng megawatt điện năng, chiếm dụng không gian của cả tòa nhà, và hiệu suất của chúng đang bị giới hạn bởi các định luật vật lý lượng tử. Đến năm 2030, thế giới sẽ cần đến các hệ thống tính toán ở cấp độ exaflop (exaflop systems) – nhanh hơn gấp nhiều lần so với các hệ thống hiện tại.",
    "category": "education",
    "date": "08/2026",
    "image": "https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169199/vnru/news/official-e1fb2be7-d8b6-4803-bf6c-2dc5a0097971.webp",
    "body": [
      "Tại Quantum Park thuộc Trường Đại học Kỹ thuật Quốc gia Moscow mang tên N.E. Bauman (Bauman MSTU) và Viện Nghiên cứu Khoa học Tự động Toàn Nga (VNIIA), các nhà khoa học đã phát triển thành công công nghệ chế tạo mạch tích hợp siêu dẫn dựa trên nền tảng tantalum (tantal) — một trong những nền tảng vật liệu đầy triển vọng cho các bộ đồng xử lý lượng tử. Chính công nghệ này cho phép cải thiện gấp nhiều lần chất lượng của cơ sở linh kiện điện tử (ЭКБ) lượng tử siêu dẫn. Hệ số phẩm chất (độ lợi) của các vi mạch tantalum do Nga sản xuất đã đạt tới con số hàng chục triệu — mức độ mà hiện nay chỉ có một vài trung tâm khoa học hàng đầu thế giới đạt được. Các kết quả nghiên cứu đã được công bố trên tạp chí khoa học uy tín Applied Physics Reviews (APR 2026). Những lô hàng bộ đồng xử lý lượng tử đầu tiên trên nền tảng tantalum đã được ký kết hợp đồng cung cấp ngay trong mùa thu năm 2026.Quy mô của cuộc cách mạng công nghệ AI hiện nay phụ thuộc trực tiếp vào năng lượng tính toán. Các siêu máy tính thế hệ mới là yếu tố cực kỳ then chốt cho việc huấn luyện mạng thần kinh nhân tạo (AI), mô phỏng khí hậu, giải mã bộ gen và tìm kiếm các vật liệu mới. Trong khi đó, máy tính truyền thống đang dần tiến đến ranh giới vật lý: chúng tiêu thụ hàng megawatt điện năng, chiếm dụng không gian của cả tòa nhà, và hiệu suất của chúng đang bị giới hạn bởi các định luật vật lý lượng tử. Đến năm 2030, thế giới sẽ cần đến các hệ thống tính toán ở cấp độ exaflop (exaflop systems) – nhanh hơn gấp nhiều lần so với các hệ thống hiện tại.",
      "Ảnh SEM của một con chip có bộ cộng hưởng dựa trên tantali",
      "Một trong những hướng đi cốt lõi và đầy triển vọng là việc sử dụng các kiến trúc lai (hybrid architectures), nơi các siêu máy tính truyền thống hoạt động kết hợp với các bộ đồng xử lý lượng tử, photon, thần kinh (neural) và các loại bộ đồng xử lý khác. Nền tảng lượng tử siêu dẫn nằm trong số những công nghệ tiềm năng nhất, và đây cũng chính là hướng đi mà các tập đoàn công nghệ lớn như IBM, Google và nhiều ông lớn khác đang theo đuổi. Trong gần 25 năm qua, ngành công nghiệp này đã phát triển dựa trên vật liệu nhôm — một loại vật liệu có tính ứng dụng công nghệ cao và tưởng chừng như không thể thay thế, nhờ đó các bộ xử lý lượng tử NISQ (lượng tử nhiễu quy mô trung bình) mới có thể trở thành hiện thực. Tuy nhiên, khi số lượng qubit tăng lên, các vật liệu và công nghệ hiện tại lại bắt đầu giới hạn hiệu suất của máy tính: các khuyết tật bề mặt và quá trình oxy hóa làm gia tăng hiện tượng mất liên kết (decogherence) của qubit, dẫn đến việc mất mát thông tin. Mạch tích hợp càng phức tạp, tổn thất này càng trở nên nghiêm trọng.Khác với nhôm, tantalum (tantal) hầu như không phản ứng với axit và các môi trường ăn mòn mạnh. Nhờ đặc tính này, các vi mạch có thể trải qua các phương pháp xử lý bề mặt chuyên sâu để loại bỏ hoàn toàn các tạp chất nguyên tử và lớp oxit vốn làm giảm chất lượng của qubit. Lớp oxit tự nhiên của tantalum chứa ít khuyết tật hơn nhiều so với nhôm, đồng nghĩa với việc thông tin lượng tử được lưu trữ lâu hơn. Trong thực tiễn thế giới, những qubit tốt nhất hiện nay đều được chế tạo trên nền tảng tantalum: thời gian liên kết (coherence time) đã đạt tới 1,68 miligiây (nghiên cứu của Đại học Princeton, công bố trên tạp chí Nature năm 2025), vượt trội gấp nhiều lần so với các thế hệ tương đương bằng nhôm. Việc chuyển đổi từ nhôm sang tantalum là một trong những con đường tiềm năng nhất để chế tạo ra các máy tính lượng tử có khả năng chống lỗi (fault-tolerant quantum computers).Tại Quantum Park, các nhà khoa học đã phát triển thành công công nghệ chế tạo các chip lượng tử dựa trên nền tảng alpha-tantalum có độ tinh khiết cao.",
      "Thách thức lớn nhất nằm ở chỗ tantalum là một kim loại rất \"đỏng đảnh\" (khó xử lý): màng mỏng của nó phát triển theo hai pha (beta và alpha), và trong một thời gian dài, cơ chế hình thành pha alpha mong muốn trên các đế silicon (silicon substrates) vẫn là một ẩn số.",
      "Ảnh SEM của một con chip có bộ cộng hưởng dựa trên tantal",
      "Các nhà khoa học và kỹ sư Nga đã phát hiện ra cơ chế chuyển pha tự phát của tantalum từ pha beta siêu bền (metastable beta-phase) sang pha alpha mong muốn dùng cho các mạch siêu dẫn ngay trong giai đoạn tăng trưởng của màng mỏng.\"Trong quá trình phát triển công nghệ, chúng tôi đã thực hiện hơn 1.000 thí nghiệm. Những kết quả này đã giúp chúng tôi đưa ra giả thuyết về cơ chế lựa chọn pha, giải thích quá trình hình thành của alpha-tantalum và beta-tantalum\", ông Evgeny Zikiy, nhà phát triển công nghệ kiêm nghiên cứu viên cao cấp tại Quantum Park, giải thích. \"Bằng cách sử dụng các phương pháp kính hiển vi điện tử truyền qua có độ phân giải nguyên tử, chúng tôi đã phân tích hình thái của hàng chục tấm wafer được sản xuất hàng loạt và theo dõi các đặc tính cấu trúc ở cấp độ dưới nanomet (sub-nanometer) của alpha-tantalum trên nền silicon — những chi tiết mà các thiết bị 'thông thường' đơn giản là không thể nhìn thấy được. Qua quá trình nghiên cứu tỉ mỉ, chúng tôi đã hiểu rõ bản chất của những cấu trúc siêu nhỏ này và nghiên cứu sự hình thành các màng mỏng ở độ dày chỉ vài chục lớp nguyên tử\".Hệ số phẩm chất (độ lợi) của các bộ cộng hưởng (resonators) là bài \"kiểm tra khắc nghiệt\" (test-drive) chính đối với công nghệ mạch tích hợp siêu dẫn dùng cho các ứng dụng lượng tử. Chỉ số này cho biết hệ thống có thể lưu trữ trạng thái lượng tử trong bao lâu: hệ số phẩm chất càng cao, qubit tồn tại càng lâu và các thuật toán lượng tử hoạt động càng đáng tin cậy. Đối với các bộ cộng hưởng tantalum được chế tạo tại Quantum Park, hệ số phẩm chất đạt tới 10 triệu ở chế độ đơn photon (single-photon mode). Điều này có nghĩa là một photon vi sóng có thể \"chạy\" bên trong bộ cộng hưởng hàng chục triệu lần (khoảng 10 km) trước khi năng lượng của nó bị tiêu tán. Và tất cả những điều này diễn ra chỉ trong vài phần triệu giây.Chỉ số đạt được này nằm trong số những kết quả tốt nhất thế giới: những giá trị tương tự hiện nay chỉ có thể đạt được bởi các đồng nghiệp từ Đại học Princeton (Mỹ) và Trung tâm Công nghệ Nano imec của Bỉ.\"Công nghệ mới này đối với chúng tôi đã được thử nghiệm thành công trên các bộ cộng hưởng vi sóng cryo (cryogenic microwave resonators), và chúng tôi đã nâng cao hệ số phẩm chất của các mạch tích hợp siêu dẫn lên hơn một dòng bậc độ lớn (gấp hơn 10 lần).",
      "Giai đoạn khó khăn nhất đã được bắt đầu — đó là đưa vào sản xuất hàng loạt. Những lô hàng bộ đồng xử lý lượng tử đầu tiên trên nền tảng tantalum đã được ký kết hợp đồng cung cấp ngay trong mùa thu năm 2026\", ông Ilya Rodionov, người đứng đầu cụm công nghệ Quantum Park, nhấn mạnh.Các nghiên cứu được thực hiện trong khuôn khổ dự án công nghệ chiến lược \"Tính toán lai cấp độ Exascale (Bauman DeepTech)\" thuộc chương trình \"Prioritet-2030\" (Ưu tiên-2030). Kết quả nghiên cứu đã được công bố trên tạp chí vật lý uy tín Applied Physics Reviews.",
      "Quantum Park là một phức hợp đa chức năng độc nhất vô nhị, được thiết kế và xây dựng chuyên biệt nhằm giải quyết các bài toán thực tiễn tại giao điểm của các công nghệ lượng tử, photon và lưu chất (fluidics). Cụm công nghệ này là một phần thuộc khuôn viên trường (campus) của Đại học Kỹ thuật Quốc gia Moscow mang tên N.E. Bauman (Bauman MSTU), được xây dựng trong khuôn khổ dự án liên bang \"Xây dựng mạng lưới các campus hiện đại\". Dự án liên bang này đang được triển khai như một phần của dự án quốc gia \"Thế hệ trẻ và Trẻ em\".Xí nghiệp quốc doanh hợp nhất liên bang \"Viện Nghiên cứu Khoa học Tự động Toàn Nga mang tên N.L. Dukhov\" (FGUP \"VNIIA\") được thành lập vào năm 1954 và là một trong những tổ chức nghiên cứu khoa học hàng đầu của Tập đoàn Năng lượng Nguyên tử Quốc gia \"Rosatom\". FGUP \"VNIIA\" là doanh nghiệp mũi nhọn trong tổ hợp vũ khí hạt nhân của Rosatom, đồng thời là đơn vị dẫn đầu cả nước trong lĩnh vực Hệ thống điều khiển tự động quá trình công nghệ (ACS TP) cho các cơ sở hạt nhân, cũng như trong việc chế tạo các máy phát neutron di động.",
      "Tin Khoa học – Công nghệ"
    ],
    "sources": [
      "https://www.atomic-energy.ru/news/2026/08/24/167955"
    ]
  },
  {
    "id": 14,
    "title": "SINH VIÊN VIỆT NAM THAM GIA CHƯƠNG TRÌNH ĐÀO TẠO CÔNG NGHỆ HẠT NHÂN TẠI NGA",
    "summary": "Sinh viên Việt Nam vừa tham gia chương trình giáo dục quốc tế Summer Institute \"Obninsk Tech: train-the-trainers” tại Nga, cùng hàng chục giảng viên trẻ và nhà nghiên cứu đến từ 12 quốc gia khác, tìm hiểu kinh nghiệm của Nga trong đào tạo nhân lực công nghệ cao và công nghệ hạt nhân.",
    "category": "education",
    "date": "20/07/2026",
    "image": "https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169198/vnru/news/official-dac97b94-2f1c-43ef-8e76-6040c9bc030e.webp",
    "body": [
      "Sinh viên Việt Nam vừa tham gia chương trình giáo dục quốc tế Summer Institute \"Obninsk Tech: train-the-trainers” tại Nga, cùng hàng chục giảng viên trẻ và nhà nghiên cứu đến từ 12 quốc gia khác, tìm hiểu kinh nghiệm của Nga trong đào tạo nhân lực công nghệ cao và công nghệ hạt nhân.",
      "Chương trình diễn ra từ ngày 20/7 đến 2/8 tại các cơ sở giáo dục và khoa học hàng đầu của Nga, trong đó có Viện Năng lượng nguyên tử Obninsk thuộc Đại học Nghiên cứu hạt nhân quốc gia MEPhI, Học viện Kỹ thuật Rosatom, Đại học Điện kỹ thuật Saint Petersburg LETI và Đại học Bách khoa Saint Petersburg.",
      "Hoạt động trong chương trình đào tạo",
      "Đoàn tham dự gồm các chuyên gia, nhà nghiên cứu đến từ Belarus, Bangladesh, Hungary, Ấn Độ, Indonesia, Kyrgyzstan, Trung Quốc, Malaysia, Serbia, Tanzania, Ethiopia, Nam Phi và Việt Nam. Theo Ban tổ chức, phía Việt Nam có hai sinh viên từ Đại học Quốc gia Hà Nội và Đại học Bách khoa Thành phố Hồ Chí Minh.",
      "Trong chương trình, các học viên nước ngoài được tiếp cận hai hướng đào tạo chính là “Công nghệ hạt nhân” và “Điện tử và Tự động hóa”. Nội dung gồm vận hành lò phản ứng, tính toán thủy nhiệt và neutron, an toàn nhà máy điện hạt nhân, kiểm soát bức xạ, hệ thống điều khiển, laser…",
      "Các học viên cũng tham quan các phòng thí nghiệm và trung tâm nghiên cứu, đồng thời tìm hiểu mô hình đào tạo kỹ sư của Nga.",
      "Trong chương trình, các học viên có nhiều cơ hội tìm hiểu mô hình đào tạo kỹ sư của Nga",
      "Chương trình còn dành thời lượng cho giao lưu văn hóa và phát triển kỹ năng làm việc nhóm. Các giảng viên, nhà nghiên cứu tham gia thảo luận về khả năng phát triển các mối liên kết khoa học, giáo dục giữa các trường đại học của các nước tham dự.",
      "“Summer Institute” được tổ chức tại Đại học Điện kỹ thuật Saint Petersburg LETI từ năm 2025 với sự hỗ trợ của Bộ Khoa học và Giáo dục Đại học Liên bang Nga. Chương trình nhằm giới thiệu tiềm năng công nghệ và giáo dục của Nga cho giảng viên các trường đại học nước ngoài, đồng thời thúc đẩy trao đổi kinh nghiệm trong đào tạo nhân lực cho các ngành công nghệ cao.",
      "Việc Việt Nam có sinh viên tham gia chương trình diễn ra trong bối cảnh hợp tác Việt Nam-Nga trong lĩnh vực khoa học, giáo dục và công nghệ tiếp tục được thúc đẩy, trong đó năng lượng hạt nhân là một trong những lĩnh vực được hai bên quan tâm.",
      "Quỹ \"Truyền thống và Hữu nghị\" tích cực kết nối với phía Việt Nam, tạo điều kiện để các sinh viên Việt Nam tham gia hoạt động có ý nghĩa rất thiết thực nêu trên.",
      "Tin Giáo dục – Đào tạo"
    ],
    "sources": [
      "https://nhandan.vn/sinh-vien-viet-nam-tham-gia-chuong-trinh-dao-tao-cong-nghe-hat-nhan-tai-nga-post982695.html"
    ]
  },
  {
    "id": 15,
    "title": "NGA ĐANG THÚC ĐẨY ĐỂ TRỞ THÀNH NƯỚC XUẤT KHẨU GIÁO DỤC",
    "summary": "Số lượng sinh viên nước ngoài tăng mạnh, đến năm 2030 cứ 10 sinh viên ở Nga thì 1 người là người nước ngoài",
    "category": "education",
    "date": "08/2026",
    "image": "https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169194/vnru/news/official-c057d936-19de-4e5a-929e-5563b279cb2f.webp",
    "body": [
      "Số lượng sinh viên nước ngoài tăng mạnh, đến năm 2030 cứ 10 sinh viên ở Nga thì 1 người là người nước ngoài",
      "Ảnh của hãng tin Moscow",
      "Tại Nga, số lượng sinh viên đến từ các nước CIS đang giảm dần, trong khi số sinh viên đến từ các nước châu Á ngày càng tăng. Tổng tỷ lệ sinh viên nước ngoài tại các trường đại học Nga tăng nhanh đến mức đến năm 2030, cứ 10 sinh viên ở Nga có thể có 1 người là người nước ngoài – theo dự báo của Trung tâm Kinh tế Giáo dục Liên tục (CENO) thuộc Học viện Tổng thống. Chính quyền Nga có kế hoạch tăng số sinh viên nước ngoài đang học tập lên 500.000 người vào năm 2030. Theo tính toán của các chuyên gia, đến thời điểm đó, cứ 4 sinh viên nước ngoài thì 1 người sẽ học các chương trình y khoa.",
      "Tăng trưởng ổn định số lượng sinh viên nước ngoài",
      "Tại Nga đang ghi nhận sự tăng trưởng ổn định về số lượng sinh viên nước ngoài. Từ năm 2010 đến năm 2024, con số này đã tăng từ 154.000 lên 356.000 người. “Hiện nay, trong hệ thống giáo dục đại học Nga đang có hơn 414.000 sinh viên nước ngoài đến từ 184 quốc gia”, Bộ trưởng Bộ Khoa học và Giáo dục đại học Nga Valery Falkov cho biết.",
      "Giới chức Nga đặt mục tiêu nâng số sinh viên nước ngoài lên 500.000 người vào năm 2030. Các chỉ tiêu như vậy, cụ thể, đã được đưa vào sắc lệnh tổng thống “Về các mục tiêu phát triển quốc gia của Liên bang Nga đến năm 2030 và tầm nhìn đến năm 2036”.",
      "Trong hơn 10 năm qua, tỷ lệ sinh viên nước ngoài trong tổng số sinh viên đại học Nga đã tăng hơn 2,5 lần: từ 3% năm 2013 lên 7,2% năm 2025, – theo nhận xét của Inna Karakchieva, nghiên cứu viên cao cấp tại CENO thuộc Học viện Tổng thống. Nếu duy trì động lực hiện tại, các chuyên gia dự báo rằng đến năm 2030, cứ 10 sinh viên và cựu sinh viên đại học ở Nga sẽ có 1 người là người nước ngoài.",
      "Thay đổi cơ cấu nguồn gốc sinh viên",
      "Việc học tập tại Nga trước hết thu hút sinh viên từ các nước CIS, cũng như từ các nước đang phát triển – Trung Quốc, Ấn Độ, các nước Trung Đông và châu Phi. Tuy nhiên, cơ cấu các nước gửi sinh viên đang thay đổi. Nếu năm 2010, sinh viên từ các nước CIS chiếm 76% tổng số sinh viên nước ngoài, thì đến năm 2024, tỷ lệ này giảm xuống còn 60%, – theo nghiên cứu của Học viện Tổng thống. Trong cùng giai đoạn, tỷ lệ sinh viên từ các nước châu Á (ngoại trừ các nước châu Á thuộc CIS) tăng từ 14% lên 21%. Tỷ lệ sinh viên từ các nước châu Phi tiệm cận 10%, so với 4% năm 2010.",
      "Tại Nga đang học khoảng 25.000 sinh viên từ Ấn Độ, theo dữ liệu của Học viện Tổng thống. Số công dân Trung Quốc đang học tại các trường đại học Nga theo các chương trình giáo dục chính là 56.000, Đại sứ Nga tại Trung Quốc Igor Morgulov cho biết vào cuối năm ngoái. Con số này tương đương với số sinh viên từ Kazakhstan (55.500), Turkmenistan (53.300), Uzbekistan (47.500), theo báo cáo của Hội đồng Đối ngoại Nga (RSMD).",
      "Đặc điểm dòng sinh viên chảy vào Nga",
      "Dòng sinh viên vào Nga có những đặc điểm riêng, – theo nhận xét của Tatyana Klyachko, Giám đốc CENO thuộc Học viện Tổng thống. Theo bà, nhóm lớn nhất là thí sinh từ Kazakhstan và Turkmenistan. “Trung Quốc chủ yếu là sinh viên thạc sĩ, trong khi Ấn Độ, Ai Cập và Malaysia tập trung vào các chuyên ngành y khoa – phần lớn do thiếu hụt bác sĩ tại các nước này”, bà cho biết.",
      "Ngo ra, bà Klyachko lưu ý rằng giáo dục y khoa ít bị ảnh hưởng bởi các thay đổi hình thức liên quan đến hệ thống Bologna. Theo tính toán của các nhà khoa học từ Đại học Sechenov, đến năm 2030, số sinh viên nước ngoài học các chương trình y khoa tại các trường đại học Nga có thể đạt 117.000 người.",
      "Doanh thu từ xuất khẩu giáo dục tăng",
      "Doanh thu của các trường đại học Nga từ việc đào tạo sinh viên nước ngoài cũng đang tăng. Theo dữ liệu của Học viện Tổng thống, doanh thu của các trường đại học Nga từ hoạt động giáo dục theo hợp đồng với sinh viên nước ngoài trong năm 2023 đã tăng 27,7% so với năm trước và đạt 40,5 tỷ ruble. Tăng trưởng xuất khẩu dịch vụ giáo dục đã tiếp tục năm thứ 5 liên tiếp, trong đó khối lượng doanh thu gần như gấp đôi so với năm 2019, khi chỉ số này là 20,5 tỷ ruble.",
      "Hơn một nửa (55%) tổng số tiền từ sinh viên nước ngoài chảy vào Nga tập trung ở 6 khu vực: Moskva, Saint-Petersburg, Bashkortostan, Tatarstan, Primorsky Krai và tỉnh Volgograd.",
      "Ví dụ về phát triển thành công xuất khẩu giáo dục, theo các chuyên gia, hiện nay là Tatarstan – nơi năm 2023 thu về gần 4 tỷ ruble từ hoạt động giáo dục với sinh viên nước ngoài. Để so sánh: các trường đại học Saint-Petersburg trong cùng kỳ thu về dưới 3 tỷ ruble.",
      "So sánh với Mỹ",
      "“Hiện nay tại các trường đại học Nga đang học khoảng 370.000 sinh viên nước ngoài trên tổng số khoảng 4,66 triệu người. Tỷ lệ của họ là khoảng 8,5%”, bà Tatyana Klyachko lưu ý. Theo chỉ số tương đối, con số này tương đương với Mỹ, bà tiếp lời. “Tuy nhiên, về con số tuyệt đối thì sự khác biệt rất lớn: các trường đại học Mỹ tiếp nhận hơn 1 triệu sinh viên nước ngoài. Nói cách khác, thống kê của Nga phần nào trông thuyết phục hơn do cơ sở so sánh tổng thể nhỏ hơn”, chuyên gia nhận định.",
      "Xu hướng theo cấp học",
      "Nga vẫn hấp dẫn đối với thí sinh nước ngoài trong phân khúc đào tạo có chi phí hợp lý và chất lượng khá, theo bà Tatyana Klyachko. “Đất nước này thường thu hút những người tìm kiếm sự cân bằng hợp lý giữa chi phí và trình độ đào tạo, chứ không phải các lộ trình học thuật danh giá, ưu tú. Trong khi đó, những sinh viên tốt nghiệp giàu có hơn và có năng lực học thuật mạnh hơn từ Trung Quốc và Ấn Độ thường chọn các hướng học bằng tiếng Anh – Mỹ, Anh, Canada hoặc Úc”, bà nói.",
      "Yếu tố hạn chế đối với tăng trưởng tiếp theo, theo các chuyên gia, là sự không chắc chắn xung quanh tương lai của hệ thống cử nhân và thạc sĩ. “Đối với sinh viên định hướng sự nghiệp quốc tế, điều quan trọng là phải hiểu họ sẽ nhận được bằng cấp nào và bằng đó sẽ được công nhận ra sao ở nước ngoài. Chừng nào chưa có sự rõ ràng này, dòng sinh viên vào chủ yếu đến từ các quốc gia và nhóm thí sinh mà uy tín giáo dục Nga là đủ, bất kể mô hình đào tạo hình thức nào”, bà Klyachko chỉ ra.",
      "Cụ thể, mặc dù tổng số sinh viên nước ngoài trong hệ thống giáo dục đại học Nga tăng, nhưng tỷ lệ của họ ở bậc cử nhân lại giảm: từ 70% trong tuyển sinh năm 2016 xuống 58% năm 2025, và trong tổng số đang học – từ 71% xuống 59%. Ngược lại, ở bậc chuyên gia, từ 2016 đến 2025 ghi nhận sự tăng trưởng ổn định về số công dân nước ngoài. Cụ thể, tuyển sinh tăng từ 12.900 lên 25.900, và tỷ lệ trong tuyển sinh tăng từ 17% lên 24%, theo Học viện Tổng thống.",
      "Số sinh viên nước ngoài ở bậc thạc sĩ cho thấy mức tăng trưởng năng động nhất: từ 1,3% năm 2016 lên 17,7% năm 2025. “Như vậy, chuyên gia và thạc sĩ là những động lực tăng trưởng. Tổng tỷ lệ của hai bậc này trong tuyển sinh đã tăng từ 18% năm 2016 lên 42% năm 2025”, Inna Karakchieva cho biết.",
      "Cán cân xuất-nhập giáo dục",
      "“Hiện nay, đa số tuyệt đối sinh viên nước ngoài tại Nga là công dân các nước CIS (chủ yếu Kazakhstan, Turkmenistan, Uzbekistan, Tajikistan), và cùng với công dân Trung Quốc và Ấn Độ, ba nguồn này cung cấp khoảng 75% sinh viên nước ngoài đang học tại Nga”, Dmitry Shtykhno, Phó Hiệu trưởng Đại học Kinh tế Plekhanov, cho biết. Các yếu tố quan trọng quyết định khối lượng và cơ cấu sinh viên nước ngoài là các suất học bổng (quota) của Chính phủ Nga dành cho công dân nước ngoài. “Trong khi đó, số công dân Nga đi học ở nước ngoài thấp hơn đáng kể, khoảng 60.000 người”, chuyên gia lưu ý.",
      "Mặc dù số sinh viên nước ngoài tại Nga tăng, nhưng dòng sinh viên Nga ra nước ngoài vẫn còn khá yếu. Theo dữ liệu UNESCO năm 2023, trung bình mỗi năm có khoảng 62.000 sinh viên Nga học ở nước ngoài. Phần lớn học tại các trường đại học Đức, S éc, Mỹ, Anh, Pháp, Phần Lan. “Như vậy, cán cân dòng sinh viên vào-ra có thể đánh giá là 6,5:1, tức là Nga ngày nay đóng vai trò là nước xuất khẩu giáo dục”, Vasily Kutyin, Giám đốc Phân tích của Ingo Bank, nhận định.",
      "Khối lượng thị trường giáo dục đại học toàn cầu được ước tính đến năm 2025 đã vượt 1 nghìn tỷ USD, và đến năm 2034 có thể tăng lên 2,5 nghìn tỷ USD với tốc độ tăng trưởng trung bình hàng năm 11,62%.",
      "Tin Khoa học – Công nghệ"
    ],
    "sources": []
  },
  {
    "id": 16,
    "title": "TỔNG THỐNG NGA PUTIN CHỈ ĐẠO BỔ SUNG ĐÀO TẠO AI VÀO CÁC CHƯƠNG TRÌNH CỦA CÁC TRƯỜNG HỌC VÀ ĐẠI HỌC Ở NGA",
    "summary": "Trí tuệ nhân tạo và an ninh thông tin tại Nga sẽ được giảng dạy từ bậc phổ thông. Tổng thống Putin đã giao nhiệm vụ đưa các điều chỉnh vào chiến lược phát triển giáo dục và các tiêu chuẩn giáo dục, có tính đến ảnh hưởng ngày càng tăng của các công nghệ mới.",
    "category": "education",
    "date": "08/2026",
    "image": "https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169192/vnru/news/official-af81d69d-ca59-4758-8542-b124aeeface4.webp",
    "body": [
      "Trí tuệ nhân tạo và an ninh thông tin tại Nga sẽ được giảng dạy từ bậc phổ thông. Tổng thống Putin đã giao nhiệm vụ đưa các điều chỉnh vào chiến lược phát triển giáo dục và các tiêu chuẩn giáo dục, có tính đến ảnh hưởng ngày càng tăng của các công nghệ mới.",
      "Thay đổi trong chiến lược giáo dục",
      "Dự thảo chiến lược phát triển giáo dục Nga đến năm 2036, các tiêu chuẩn giáo dục đại học, tiêu chuẩn nghề nghiệp, cũng như các chương trình giáo dục phổ thông sẽ được hoàn thiện để tính đến ảnh hưởng của các công nghệ thông tin mới và công nghệ trí tuệ nhân tạo (AI) đang phát triển nhanh chóng, tác động đến nền kinh tế.",
      "Những chỉ đạo này của Tổng thống Nga Vladimir Putin nằm trong danh sách được hình thành sau cuộc họp của Hội đồng Quốc gia về vấn đề đào tạo nhân lực cho nền kinh tế, diễn ra ngày 25 tháng 12 năm 2025. Các chỉ đạo đã được công bố trên trang web chính thức của Tổng thống.",
      "Bản báo cáo đầu tiên về tiến độ thực hiện các chỉ đạo đã được các cơ quan chịu trách nhiệm trình bày vào mùa xuân và mùa hè năm 2026.",
      "Chỉ đạo của Tổng thống",
      "Trong các tiêu chuẩn giáo dục đại học quốc gia liên bang và tiêu chuẩn nghề nghiệp, cần đưa vào các thay đổi quy định việc đào tạo kỹ năng sử dụng công nghệ AI. Với sự tham gia của các nhà tuyển dụng, sẽ xây dựng các chương trình nâng cao trình độ về sử dụng AI trong hoạt động nghề nghiệp ở các ngành kinh tế và lĩnh vực xã hội khác nhau. Các cơ quan chịu trách nhiệm được chỉ định là Chính phủ và ủy ban Kinh tế Dữ liệu của Hội đồng Nhà nước.",
      "Tổng thống Nga Vladimir Putin",
      "Chính phủ Nga cùng với chính quyền tỉnh Moscow được giao nhiệm vụ xây dựng và triển khai dự án thí điểm đưa vào các chương trình giáo dục phổ thông liên bang chính các khóa học định hướng thực tiễn, dành cho việc sử dụng IT và AI, cũng như về an ninh thông tin.",
      "Đối với giáo viên cũng sẽ tổ chức đào tạo về IT và AI trong khuôn khổ nâng cao trình độ. Các công ty công nghệ sẽ được thu hút tham gia vào công việc này.",
      "Tại các vùng sẽ bổ nhiệm các quan chức được ủy quyền để phối hợp công tác đảm bảo nhân lực cho các ngành kinh tế và lĩnh vực xã hội, thích ứng thị trường lao động với các thay đổi công nghệ. Các quan chức của cơ quan nhà nước liên bang và các quan chức được ủy quyền của các chủ thể liên bang sẽ được đào tạo về ảnh hưởng của các thay đổi công nghệ đến các ngành kinh tế khác nhau và thị trường lao động.",
      "Nhu cầu chuyên gia AI",
      "Năm 2025, nhu cầu đối với chuyên gia AI tại Nga tăng gấp đôi. Số lượng tin tuyển dụng có đề cập đến kỹ năng AI tăng 90%, như CNews đã đưa tin vào tháng 1 năm 2026.",
      "Trong số các nghề AI được săn đón nhất trong những năm gần đây, đại diện các dịch vụ tìm kiếm việc làm nêu tên: huấn luyện viên AI (ch chuyên gia đào tạo mạng neural), biên tập viên AI (tạo và hiệu đính văn bản, chuẩn bị các ví dụ chính xác cho bộ dữ liệu dùng để huấn luyện mô hình AI), kỹ sư ML (phát triển thuật toán cho máy học), kỹ sư prompt (soạn thảo truy vấn văn bản cho AI), người sáng tạo neural (họa sĩ AI, minh họa viên AI, nhà thiết kế AI).",
      "Sự quan tâm của người Nga đối với các khóa học trực tuyến liên quan đến học AI cũng tăng đáng kể, như đại diện GetCourse thông báo với CNews vào tháng 2 năm 2026. Các trường dạy AI đã kiếm được 1,7 tỷ ruble trong năm 2025. Năm 2024, doanh thu của họ là 955 triệu ruble. Các chương trình được săn đón nhất là làm việc với mạng neural “từ đầu”, ứng dụng AI để tạo ảnh và văn bản, tối ưu hóa quy trình kinh doanh, marketing, tạo prompt hoặc phát triển chatbot.",
      "Tin Khoa học – Công nghệ"
    ],
    "sources": [
      "https://www.cnews.ru/news/top/2026-02-13_v_shkolah_i_vuzah_rossii_vvedut"
    ]
  },
  {
    "id": 17,
    "title": "VOSTOKGOSPLAN SẼ TRÌNH BÀY BẢN TÓM TẮT VỀ ROBOT TẠI DIỄN ĐÀN KINH TẾ PHƯƠNG ĐÔNG (EEF) 2026",
    "summary": "“Robot và Trí tuệ Nhân tạo: Thực tiễn và Cơ hội Quốc tế cho Nga, Viễn Đông và Bắc Cực” là tiêu đề của một bản tóm tắt mới do Trung tâm Phương Đông về Quy hoạch Bang thuộc Liên bang (Vostokgosplan) chuẩn bị phối hợp với Trường Kinh tế Cao cấp (HSE). Vào tháng 9, bản báo cáo sẽ được trình bày tại Diễn đàn Kinh tế Phương Đông.",
    "category": "society",
    "date": "08/2026",
    "image": "https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169180/vnru/news/official-50ad77b4-0ce6-45a6-9ed8-08258d23f44b.webp",
    "body": [
      "“Robot và Trí tuệ Nhân tạo: Thực tiễn và Cơ hội Quốc tế cho Nga, Viễn Đông và Bắc Cực” là tiêu đề của một bản tóm tắt mới do Trung tâm Phương Đông về Quy hoạch Bang thuộc Liên bang (Vostokgosplan) chuẩn bị phối hợp với Trường Kinh tế Cao cấp (HSE). Vào tháng 9, bản báo cáo sẽ được trình bày tại Diễn đàn Kinh tế Phương Đông.",
      "Bản tóm tắt được gửi đến đại diện của các cơ quan chức năng, các tổ chức phát triển, khoa học, doanh nghiệp và cộng đồng chuyên gia tham gia vào việc hình thành chính sách phát triển công nghệ của Nga, đặc biệt là Viễn Đông và Bắc Cực, cũng như tất cả những ai theo dõi sự phát triển của robot và AI một cách chuyên nghiệp hoặc vì mục đích nghiên cứu,” các tác giả của công trình cho biết.",
      "Nhóm chuyên gia đặt ra nhiệm vụ hệ thống hóa các phương pháp tiếp cận và công cụ của nhà nước để hỗ trợ robot và AI tại các quốc gia hàng đầu, xác định các thực tiễn phù hợp với điều kiện của các vùng xa xôi, với mật độ dân số thấp và thiếu hụt nhân sự, cũng như xác định các cơ hội và hạn chế khi sử dụng công nghệ tại Khu vực Liên bang Viễn Đông và Bắc Cực Nga, cũng như các lĩnh vực hợp tác quốc tế đầy hứa hẹn cho Nga.",
      "Theo dự báo của Liên đoàn Robot Quốc tế (IFR), đến năm 2028, số lượng robot công nghiệp được lắp đặt hàng năm trên thế giới dự kiến sẽ đạt 700 nghìn chiếc. Các nhà phân tích đã nghiên cứu các trường hợp của các quốc gia dẫn đầu trong lĩnh vực robot và AI: Trung Quốc, Hàn Quốc, Nhật Bản, Mỹ, Đức và UAE. Trong số các xu hướng toàn cầu quan trọng trong giai đoạn 2025–2026, các chuyên gia đã nhấn mạnh, ví dụ, sự chuyển đổi từ máy móc mã hóa cứng sang các hệ thống tự động với AI, sự hội tụ giữa công nghệ thông tin và vận hành, sự mở rộng sử dụng robot hình người, nhu cầu về an ninh và khả năng chống chịu mạng, tầm quan trọng ngày càng tăng của đào tạo nhân sự và phát triển sự hợp tác giữa con người và máy móc (robot giúp bù đắp sự thiếu hụt chuyên gia và giảm bớt khối lượng công việc thường nhật cho nhân viên).",
      "«Khi công nghệ phát triển, cạnh tranh giữa các quốc gia chuyển từ lợi thế sản xuất cá nhân sang dẫn đầu trong hệ sinh thái dữ liệu, tính toán, tiêu chuẩn và ứng dụng. Những ai phát triển cơ sở công nghệ nhanh hơn và có thể kết nối AI, robot và hạ tầng công nghiệp thành một tổng thể duy nhất sẽ có lợi thế bền vững. Còn lại, nguy cơ khoảng cách công nghệ ngày càng tăng, trong đó sự phụ thuộc vào các nền tảng và linh kiện bên ngoài sẽ ngày càng tăng”, các chuyên gia cho biết.",
      "Đối với Nga, AI và robot công nghiệp là công cụ để đảm bảo chủ quyền công nghệ và tăng năng suất kinh tế. Phát triển robot và trí tuệ nhân tạo là một trong những ưu tiên công nghệ quốc gia. Đến năm 2030, quốc gia này dự kiến sẽ lọt vào top 25 quốc gia hàng đầu thế giới về mật độ robot hóa, đạt 145 robot công nghiệp trên 10 nghìn lao động. Như đã đề cập trong Vostokgosplan, kể từ năm 2025, số liệu thống kê về mật độ robot hóa đã được thu thập hàng tháng: năm 2025, con số là 29 robot trên 10 nghìn công nhân, từ tháng 1 đến tháng 5 năm 2026 là 28.",
      "“Chính sách nhà nước của Nga trong lĩnh vực robot hiện nay chủ yếu tập trung vào robot hóa công nghiệp. Các mục tiêu ưu tiên, chỉ số hiệu suất và các biện pháp hỗ trợ liên quan đến tự động hóa sản xuất và tăng mật độ robot công nghiệp. Robot dịch vụ cũng đang phát triển, nhưng chủ yếu qua các lĩnh vực liên quan - hệ thống không người lái, AI, số hóa giao thông, chăm sóc sức khỏe, nông nghiệp và giám sát hạ tầng, vốn hiện chưa có hệ thống quản lý riêng biệt ở cấp quốc gia,” Vostokgosplan nhấn mạnh.",
      "Để đạt được mục tiêu tăng mật độ robot hóa, một mạng lưới rộng lớn các Trung tâm Phát triển Robot Công nghiệp (IDDC) đang được xây dựng tại Nga. Trung tâm của hệ thống là trung tâm liên bang, được tổ chức vào năm 2024 dựa trên Đại học Innopolis. Một mạng lưới các trung tâm vệ tinh khu vực đang được triển khai. Tính đến mùa hè năm 2026, 8 trung tâm vệ tinh như vậy vượt qua vòng tuyển chọn cạnh tranh đã nhận được khoản tài trợ. Họ chủ yếu tập trung ở khu vực châu Âu của Nga (các Quận Liên bang Trung tâm, Tây Bắc, Volga và Ural). Mục tiêu chiến lược là triển khai ít nhất 3 CRPR ở mỗi khu vực liên bang, bao gồm cả Khu vực Liên bang Viễn Đông.",
      "Trong bối cảnh toàn Nga, Viễn Đông chiếm một vị trí đặc biệt: ở đây, nhu cầu tự động hóa không chỉ được quyết định bởi nhu cầu tăng năng suất, mà còn bởi những đặc thù riêng của từng vùng lãnh thổ. Công nghệ nên bù đắp cho những hạn chế cấu trúc của vùng vĩ mô - thiếu hụt nguồn lao động, khoảng cách xa, điều kiện tự nhiên và khí hậu khó khăn cùng chi phí vận hành cao. Đó là lý do tại sao tác động kinh tế của việc đưa AI và robot vào khu vực có thể cao hơn mức trung bình toàn quốc.",
      "Đồng thời, nhu cầu mục tiêu về tự động hóa vẫn vượt lên trên mức độ sẵn sàng của khu vực cho việc triển khai quy mô lớn. Các hạn chế chủ yếu do thiếu nhân sự, trung tâm năng lực, cơ sở hạ tầng dịch vụ và cơ chế hỗ trợ dự án. Do đó, theo các tác giả của bản tóm tắt, ưu tiên không nên là tăng số lượng thí điểm cá nhân, mà là tạo ra một hệ thống khu vực có khả năng sao chép các công nghệ thành công.",
      "“Do đó, lợi thế cạnh tranh của Viễn Đông và Bắc Cực không được xác định bởi mức độ số hóa hiện tại, mà bởi cơ hội trở thành nơi thử nghiệm cho việc phát triển và thử nghiệm các công nghệ trong nước tập trung vào làm việc trong điều kiện khắc nghiệt. Việc triển khai thành công mô hình này không chỉ thúc đẩy phát triển công nghệ của chính vùng vĩ mô mà còn tạo ra các giải pháp áp dụng cho các khu vực khó tiếp cận khác,” các tác giả của bản tóm tắt kết luận.",
      "Tin Giáo dục – Đào tạo"
    ],
    "sources": [],
    "contentType": "PUBLICATION"
  },
  {
    "id": 18,
    "title": "12 TRƯỜNG ĐẠI HỌC NGA ĐÀO TẠO CHUYÊN GIA AI",
    "summary": "Nhu cầu về chuyên gia trí tuệ nhân tạo (AI) tại Nga đang tăng vọt. Để đáp ứng nhu cầu của thị trường và thực hiện Chiến lược phát triển AI quốc gia đến năm 2030, Bộ Khoa học và Giáo dục Đại học Nga cùng các tập đoàn công nghệ lớn đã chọn ra 12 trường đại học hàng đầu đảm nhận sứ mệnh đào tạo các chuyên gia hàng đầu trong lĩnh vực này. Trong đó, cả công dân Nga và sinh viên nước ngoài đều có thể học tập tại đây.",
    "category": "education",
    "date": "08/2026",
    "image": "https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169188/vnru/news/official-622e9e38-0c5d-4a57-a7ce-9fafd05c6ae5.webp",
    "body": [
      "Nhu cầu về chuyên gia trí tuệ nhân tạo (AI) tại Nga đang tăng vọt. Để đáp ứng nhu cầu của thị trường và thực hiện Chiến lược phát triển AI quốc gia đến năm 2030, Bộ Khoa học và Giáo dục Đại học Nga cùng các tập đoàn công nghệ lớn đã chọn ra 12 trường đại học hàng đầu đảm nhận sứ mệnh đào tạo các chuyên gia hàng đầu trong lĩnh vực này. Trong đó, cả công dân Nga và sinh viên nước ngoài đều có thể học tập tại đây.",
      "Sinh viên trường Đại học Kinh tế Cao cấp (HSE) đang tham dự hội thảo về AI",
      "Dưới đây là danh sách 12 trường đại học của Nga đang dẫn đầu trong việc đào tạo chuyên gia AI:",
      "1. Viện Vật lý và Công nghệ Moscow (MIPT)",
      "Được mệnh danh là \"cái nôi\" của ngành công nghệ thông tin và AI tại Nga. MIPT có các phòng thí nghiệm hiện đại hợp tác trực tiếp với các gã khổng lồ công nghệ như Yandex, Sber và Tinkoff. Sinh viên ở đây được đào tạo sâu về học máy (Machine Learning) và phân tích dữ liệu lớn.",
      "2. Trường Đại học Kinh tế Cao cấp (HSE)",
      "Khoa Toán học và Khoa học Máy tính của HSE là một trong những nơi mạnh nhất nước Nga. Trường nổi bật với việc kết hợp AI với kinh tế học, khoa học dữ liệu (Data Science) và khoa học xã hội.",
      "3. Đại học Công nghệ Thông tin, Cơ học và Quang học ITMO (ITMO)",
      "ITMO không chỉ nổi tiếng về lập trình cạnh tranh mà còn là trung tâm hàng đầu về thị giác máy tính (Computer Vision) và AI. Trường có mạng lưới phòng thí nghiệm rộng lớn được tài trợ bởi các công ty công nghệ dẫn đầu.",
      "4. Trường Đại học Quốc gia Moscow (MSU)",
      "Với nền tảng toán học và cơ học truyền thống cực kỳ mạnh mẽ, MSU cung cấp nền tảng lý thuyết vững chắc cho AI. Khoa Cơ học và Toán học cùng Khoa Tính toán Toán học và Điều khiển học là nơi sản sinh ra nhiều nhà khoa học hàng đầu về AI.",
      "5. Đại học Innopolis",
      "Đây là một trường đại học đặc thù, được xây dựng từ đầu nhằm tập trung hoàn toàn vào CNTT và Robotics. Môi trường học tập tại Innopolis mang tiêu chuẩn quốc tế, đào tạo bằng tiếng Anh và tập trung mạnh vào AI tự trị, xe tự lái và robot.",
      "6. Đại học Kỹ thuật Nhà nước Moscow mang tên Bauman (MGTU mang tên Bauman)",
      "Được ví như \"MIT của nước Nga\", trường tập trung vào AI ứng dụng trong kỹ thuật, chế tạo máy, công nghiệp quốc phòng và hệ thống điều khiển tự động phức tạp.",
      "7. Trường Đại học Quốc gia Saint Petersburg (SPbSU)",
      "SPbSU sở hữu Trung tâm Nghiên cứu Trí tuệ Nhân tạo lớn mạnh. Trường đào tạo chuyên sâu về xử lý ngôn ngữ tự nhiên (NLP) và phát triển các mô hình ngôn ngữ lớn (LLM) bằng tiếng Nga.",
      "8. Trường Đại học Quốc gia Tomsk (TSU)",
      "Là trung tâm giáo dục và khoa học lớn nhất ở Siberia, TSU phát triển mạnh mẽ các ứng dụng AI trong y tế (chẩn đoán hình ảnh), ngôn ngữ học tính toán và phân tích dữ liệu địa không gian.",
      "9. Trường Đại học Liên bang Kazan (KFU)",
      "KFU nổi bật với việc phát triển các dự án AI kết hợp với ngành công nghiệp dầu khí, hóa chất. Ngoài ra, trường còn mạnh về xử lý ngôn ngữ tự nhiên đa ngôn ngữ, đặc biệt là bảo tồn và số hóa các ngôn ngữ thiểu số.",
      "10. Trường Đại học Liên bang Ural (UrFU)",
      "UrFU ứng dụng AI vào các ngành công nghiệp nặng, luyện kim, vật liệu mới và phát triển các giải pháp cho \"Thành phố thông minh\" (Smart City) tại khu vực Ural.",
      "11. Viện Công nghệ và Khoa học Skolkovo (Skoltech)",
      "Một viện nghiên cứu tiên phong, tập trung vào giáo dục sau đại học (Thạc sĩ, Tiến sĩ). Skoltech đào tạo các nhà nghiên cứu R&D công nghệ cao, kết hợp chặt chẽ AI với y sinh học, năng lượng và kỹ thuật vật liệu.",
      "12. Trường Đại học Liên hữu nghị Nhân dân Nga (RUDN)",
      "RUDN tập trung vào phát triển AI đa ngôn ngữ và hệ thống dịch thuật tự động. Với mạng lưới sinh viên quốc tế khổng lồ, trường có lợi thế lớn trong việc huấn luyện các mô hình ngôn ngữ đa quốc gia.",
      "Kết luận: Các trường đại học này không chỉ cung cấp kiến thức lý thuyết mà còn đóng vai trò là các trung tâm R&D (Nghiên cứu và Phát triển) thực thụ. Nhờ sự hợp tác chặt chẽ với các tập đoàn như Yandex, Sber, VK và nhà nước, sinh viên tốt nghiệp từ 12 trường này ngay lập tức có thể đảm nhận các vị trí quan trọng trong kỷ nguyên công nghệ AI mới của nước Nga.",
      "Tin Giáo dục – Đào tạo"
    ],
    "sources": [
      "https://ru.gw2ru.com/read/251843-12-rossijskih-vuzov-gde-gotovyat-ii-specialistov"
    ]
  },
  {
    "id": 19,
    "title": "NƯỚC NGA CHÍNH THỨC TỪ BỎ HỆ THỐNG BOLOGNA",
    "summary": "Kể từ ngày 1 tháng 9 năm 2026, hệ thống giáo dục đại học của Liên bang Nga chính thức bước vào giai đoạn chuyển đổi quan trọng nhất trong hơn hai thập kỷ qua: từ bỏ mô hình hai cấp “cử nhân – thạc sĩ” theo chuẩn Bologna mà nước này đã gia nhập từ năm 2003, để chuyển sang một mô hình giáo dục nội địa hoàn toàn mới. Thay cho các khái niệm quen thuộc cử nhân và thạc sĩ, các trường đại học Nga sẽ áp dụng hai cấp học mới mang tên “giáo dục đại học cơ bản” và “giáo dục đại học chuyên sâu”.",
    "category": "education",
    "date": "08/2026",
    "image": "https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169189/vnru/news/official-6ee78612-9bb5-4b3d-89b9-84b8eb67ce1e.webp",
    "body": [
      "Những thay đổi lớn tại các trường đại học từ ngày 1 tháng 9 năm 2026",
      "Một bước ngoặt lịch sử trong giáo dục Nga",
      "Kể từ ngày 1 tháng 9 năm 2026, hệ thống giáo dục đại học của Liên bang Nga chính thức bước vào giai đoạn chuyển đổi quan trọng nhất trong hơn hai thập kỷ qua: từ bỏ mô hình hai cấp “cử nhân – thạc sĩ” theo chuẩn Bologna mà nước này đã gia nhập từ năm 2003, để chuyển sang một mô hình giáo dục nội địa hoàn toàn mới. Thay cho các khái niệm quen thuộc cử nhân và thạc sĩ, các trường đại học Nga sẽ áp dụng hai cấp học mới mang tên “giáo dục đại học cơ bản” và “giáo dục đại học chuyên sâu”.",
      "Đây không phải là một quyết định bất ngờ, mà là kết quả của một quá trình chuẩn bị kéo dài từ năm 2022, khi Nga bị loại khỏi các cấu trúc của tiến trình Bologna sau các lệnh trừng phạt quốc tế. Bài viết này tổng hợp toàn diện những gì sẽ thay đổi, ai bị ảnh hưởng, ai không, và những điều sinh viên, phụ huynh cần biết để chuẩn bị cho giai đoạn chuyển tiếp này.",
      "Vì sao Nga rời bỏ hệ thống Bologna?",
      "Hệ thống Bologna là mô hình giáo dục đại học châu Âu, chia việc học thành hai cấp độc lập: cử nhân (4 năm) và thạc sĩ (2 năm). Nga gia nhập tiến trình này vào năm 2003 với kỳ vọng được công nhận văn bằng lẫn nhau với các nước châu Âu và tạo điều kiện cho sinh viên di chuyển học tập quốc tế. Đến năm 2011, phần lớn các trường đại học Nga đã chuyển đổi sang mô hình này, chỉ còn y khoa, quân sự và một số ngành kỹ thuật đặc thù giữ lại hệ chuyên gia 5 năm.",
      "Tuy nhiên, trên thực tế, hệ thống này không đáp ứng được kỳ vọng ban đầu. Theo Internauka.org, các nhà tuyển dụng Nga phổ biến coi cử nhân là chưa được đào tạo đầy đủ để hành nghề độc lập; khoảng một nửa sinh viên tốt nghiệp cử nhân không tiếp tục học thạc sĩ; và việc công nhận văn bằng Nga ở nước ngoài vẫn rất hạn chế trong thực tế, dù về lý thuyết đã tham gia Bologna.",
      "Mùa xuân năm 2022, nhóm Bologna đã đình chỉ sự tham gia của Nga trong mọi cấu trúc của tiến trình này. Ngay sau đó, Bộ trưởng Khoa học và Giáo dục đại học Nga, ông Valery Falkov, tuyên bố hệ thống Bologna “đã hết thời” và công bố kế hoạch chuyển sang một mô hình giáo dục riêng của Nga. Bộ Khoa học và Giáo dục đại học đưa ra ba lý do chính thức cho sự thay đổi này.",
      "Thứ nhất, mô hình hai cấp không còn phù hợp với nhu cầu thực tế của nền kinh tế Nga;",
      "Thứ hai, hệ thống này tạo ra sự đứt gãy với truyền thống giáo dục đại học lâu đời của Nga;",
      "Thứ ba, nước Nga cần một chính sách giáo dục mang tính chủ quyền, độc lập với các khuôn khổ phương Tây.",
      "Lộ trình triển khai: từ thí điểm đến áp dụng toàn quốc",
      "Lộ trình cải cách hệ thống giáo dục đại học Nga giai đoạn 2022–2030",
      "Việc chuyển đổi được thực hiện theo từng giai đoạn, không áp dụng đột ngột cho toàn bộ hệ thống. Từ năm 2023, mô hình mới đã được thử nghiệm tại 6 trường đại học tiên phong: Đại học Liên bang Baltic mang tên Kant, Đại học Công nghệ Nghiên cứu Quốc gia MISiS, Học viện Hàng không Moskva, Đại học Mỏ Saint-Petersburg, Đại học Tổng hợp Quốc gia Tomsk và Đại học Sư phạm Quốc gia Moskva.",
      "Đến tháng 1 năm 2026, danh sách thí điểm được mở rộng thêm 11 trường đại học nữa, trong đó có những tên tuổi lớn như MGTU mang tên Bauman, Viện Vật lý – Kỹ thuật Moskva (MFTI) và Đại học Liên bang Viễn Đông, đưa tổng số trường tham gia thí điểm lên 17 trường. Chương trình thí điểm này đã được kéo dài đến năm 2030. Kể từ ngày 1 tháng 9 năm 2026, các trường trong danh sách thí điểm chính thức bắt đầu tuyển sinh và giảng dạy theo mô hình mới, trong khi quá trình chuyển đổi bắt buộc cho toàn bộ các trường đại học trên cả nước dự kiến hoàn tất muộn nhất vào năm 2030.",
      "Cấu trúc mới thay thế cử nhân và thạc sĩ",
      "Theo quy định mới, bằng cử nhân không còn tồn tại như một cấp học chính thức dành cho sinh viên nhập học từ năm 2026 trở đi. Thay vào đó, Nga áp dụng mô hình ba cấp gồm giáo dục đại học cơ bản, giáo dục đại học chuyên sâu và nghiên cứu sinh – cấp này được tách hẳn ra khỏi hệ thống giáo dục đại học, trở thành một bậc đào tạo chuyên môn độc lập.",
      "Giáo dục đại học cơ bản được thiết kế để thay thế đồng thời cả cử nhân và chuyên gia 5 năm trước đây, cung cấp kiến thức nền tảng toàn diện, đủ để người học có thể hành nghề ngay sau khi tốt nghiệp. Thời gian đào tạo linh hoạt hơn: hầu hết các ngành vẫn giữ 4 năm, nhưng những lĩnh vực kỹ thuật, y khoa hoặc có tính đặc thù cao có thể kéo dài lên 5–6 năm.",
      "Giáo dục đại học chuyên sâu, về bản chất, là phiên bản nâng cấp của thạc sĩ cũ, nhưng bổ sung thêm các hướng đào tạo quản lý và nghiên cứu bên cạnh hướng chuyên môn. Chương trình chuyên khoa y học sau đại học và đào tạo trợ giảng-thực tập trong lĩnh vực nghệ thuật cũng được xếp vào cấp học này.",
      "Một điểm thay đổi quan trọng về quyền lợi tài chính: theo quy định trước đây, việc học thạc sĩ sau khi đã có bằng chuyên gia bị coi là học văn bằng đại học thứ hai, nên không được cấp suất học bổng ngân sách. Quy định mới xóa bỏ rào cản này – bất kỳ ai đã hoàn thành chương trình giáo dục đại học cơ bản đều có quyền cạnh tranh suất học ngân sách (miễn phí) ở cấp giáo dục chuyên sâu, mở rộng đáng kể cơ hội tiếp cận giáo dục miễn phí cho sinh viên.",
      "Ai bị ảnh hưởng, ai không?",
      "Đây là câu hỏi được quan tâm nhiều nhất, và câu trả lời chính thức từ Bộ Khoa học và Giáo dục đại học Nga là: không có việc chuyển đổi bắt buộc đối với sinh viên đang học.",
      "Sinh viên đang học năm 1, 2, 3 hoặc 4 hệ cử nhân: vẫn tiếp tục học theo chương trình đã đăng ký, thi tốt nghiệp và nhận bằng cử nhân theo mẫu hiện hành. Không có việc chuyển sang chương trình mới, không cần thi lại hay tốt nghiệp sớm.",
      "Người đã tốt nghiệp, có bằng cử nhân: vẫn giữ nguyên giá trị pháp lý đầy đủ. Người sử dụng lao động có nghĩa vụ chấp nhận bằng cử nhân ngang hàng với bất kỳ văn bằng đại học nào khác, không có sự phân biệt hay giảm giá trị.",
      "Thí sinh dự thi tuyển sinh năm học 2026/2027: sẽ là những người đầu tiên trải nghiệm mô hình mới, nhưng chỉ tại các trường thuộc danh sách thí điểm; các trường ngoài danh sách này vẫn tuyển sinh theo mô hình cũ cho đến khi có quy định chuyển đổi cụ thể.",
      "Các khóa đào tạo nâng cao, chuyển đổi nghề nghiệp (bổ túc chuyên môn): vẫn tiếp tục vận hành theo hình thức hiện tại, không bị ảnh hưởng bởi cải cách lần này.",
      "Riêng vấn đề quy đổi tương đương giữa bằng cử nhân cũ và bằng chuyên gia hiện vẫn chưa được quy định chính thức và rõ ràng; Bộ Khoa học và Giáo dục đại học đang xây dựng các quy chuẩn chuyển tiếp cho vấn đề này, và người học nên theo dõi sát các cập nhật trên trang chính thức của Bộ.",
      "Tác động tới thị trường lao động và công nhận quốc tế",
      "Việc đổi tên và cấu trúc văn bằng đặt ra câu hỏi lớn cho cả người lao động hiện tại và tương lai: liệu tấm bằng mới có được nhà tuyển dụng đánh giá ngang bằng, hay thậm chí cao hơn so với bằng cấp theo hệ Bologna cũ?",
      "Hiện tại, các nhà tuyển dụng lớn của Nga vẫn đang trong tư thế quan sát và chưa công bố bất kỳ thay đổi cụ thể nào trong tiêu chí tuyển dụng. Phần lớn các chuyên gia nhân sự (HR) cho biết họ quan tâm đến kỹ năng và kinh nghiệm thực tế của ứng viên hơn là tên gọi của văn bằng. Theo dự đoán, trong khoảng 3–5 năm tới, các yêu cầu tuyển dụng sẽ dần được điều chỉnh khi lứa sinh viên đầu tiên tốt nghiệp theo hệ thống mới chính thức bước vào thị trường lao động.",
      "Về công nhận văn bằng quốc tế, đây là khía cạnh cần lưu tâm nhiều nhất. Mô hình văn bằng mới của Nga không còn tương thích trực tiếp với khung cử nhân → thạc sĩ theo chuẩn quốc tế đang áp dụng tại Mỹ, Anh và các nước thuộc Liên minh châu Âu. Điều này có nghĩa là việc sử dụng bằng “giáo dục đại học cơ bản” của Nga để xin học thạc sĩ tại các trường đại học nước ngoài sẽ khó khăn hơn so với trước, và quyết định công nhận sẽ phụ thuộc vào chính sách riêng của từng trường đại học tiếp nhận.",
      "Một số quốc gia trong Cộng đồng các quốc gia độc lập (SNG) và các nước có hiệp định song phương với Nga vẫn tiếp tục công nhận văn bằng Nga theo các thỏa thuận đã ký kết. Đối với những ai có định hướng phát triển sự nghiệp quốc tế, lời khuyên được đưa ra là nên chủ động tìm hiểu chính sách công nhận văn bằng của trường đại học hoặc quốc gia mục tiêu ngay từ giai đoạn lựa chọn ngành học.",
      "Kết luận",
      "Việc Nga từ bỏ hệ thống Bologna để chuyển sang mô hình giáo dục đại học riêng, có hiệu lực từ ngày 1 tháng 9 năm 2026, đánh dấu sự thay đổi cấu trúc sâu rộng nhất của nền giáo dục đại học nước này trong hơn 20 năm qua. Tuy vậy, đây là một quá trình chuyển đổi từng bước, kéo dài đến năm 2030, chứ không phải một cuộc cách mạng diễn ra ngay lập tức trên toàn quốc.",
      "Đối với những người đang học hoặc đã tốt nghiệp theo hệ cử nhân – thạc sĩ cũ, thông tin quan trọng nhất cần nắm rõ là: văn bằng của họ hoàn toàn không bị ảnh hưởng, không cần chuyển đổi hay xác nhận lại. Chỉ những thí sinh nhập học từ năm học 2026/2027 trở đi, đặc biệt tại 17 trường đại học đã được đưa vào danh sách thí điểm, mới là những người đầu tiên học tập theo mô hình “giáo dục đại học cơ bản” và “giáo dục đại học chuyên sâu” hoàn toàn mới này.",
      "Tin Khoa học – Công nghệ"
    ],
    "sources": [
      "https://www.rbc.ru/life/news/6a881a7ed3cd35bedb4ae4a5"
    ]
  },
  {
    "id": 20,
    "title": "DỰ ÁN LƯỢNG TỬ CỦA ROSATOM: KHÁT VỌNG ĐỊNH HÌNH LẠI CÔNG NGHỆ LÕI VÀ TẦM NHÌN VĨ MÔ ĐẾN NĂM 2030",
    "summary": "Cuộc đua lượng tử toàn cầu từ lâu đã bước ra khỏi những trang sách khoa học viễn tưởng để trở thành chiến trường công nghệ khốc liệt nhất của thế kỷ 21. Không đứng ngoài cuộc chơi, Nga đã và đang triển khai chiến lược lượng tử đầy tham vọng. Dưới sự dẫn dắt của Tập đoàn Năng lượng Nguyên tử Quốc gia (Rosatom), quốc gia này không chỉ đặt mục tiêu bắt kịp mà còn tham vọng tiên phong trong việc thương mại hóa và ứng dụng điện toán lượng tử vào các ngành kinh tế trọng điểm đến năm 2030.",
    "category": "science",
    "date": "08/2026",
    "image": "https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169179/vnru/news/official-4c6bd669-1af1-443d-8723-b5acfcfaad58.webp",
    "body": [
      "Cuộc đua lượng tử toàn cầu từ lâu đã bước ra khỏi những trang sách khoa học viễn tưởng để trở thành chiến trường công nghệ khốc liệt nhất của thế kỷ 21. Không đứng ngoài cuộc chơi, Nga đã và đang triển khai chiến lược lượng tử đầy tham vọng. Dưới sự dẫn dắt của Tập đoàn Năng lượng Nguyên tử Quốc gia (Rosatom), quốc gia này không chỉ đặt mục tiêu bắt kịp mà còn tham vọng tiên phong trong việc thương mại hóa và ứng dụng điện toán lượng tử vào các ngành kinh tế trọng điểm đến năm 2030.",
      "Từ tiềm lực nền tảng đến cú bứt phá trên bản đồ lượng tử thế giới",
      "Năm 2020, Chính phủ Liên bang Nga chính thức phê duyệt lộ trình quốc gia mang tên “Điện toán lượng tử”. Trọng trách điều phối được giao cho Rosatom – tập đoàn sở hữu tiềm lực khoa học đồ sộ, nền tảng công nghiệp vững chắc và khả năng quản trị các siêu dự án công nghệ cao.",
      "Ngay lập tức, một mạng lưới nghiên cứu chưa từng có được thiết lập. Hơn 600 nhà khoa học tinh hoa từ 16 trung tâm nghiên cứu và trường đại học hàng đầu (bao gồm Viện Vật lý Lebedev - FIAN, Trung tâm Lượng tử Nga - RCC, Đại học Lomonosov, Đại học MISIS, HSE, Skoltech...) đã được quy tụ để giải quyết bài toán lượng tử.",
      "Máy tính lượng tử mạnh nhất ở Nga được đặt tại Viện Vật lý Lebedev thuộc Viện Hàn lâm Khoa học Nga",
      "Chỉ sau 4 năm, những trái ngọt đầu tiên đã xuất hiện. Tính đến cuối năm 2024, Nga đã phát triển thành công bốn nguyên mẫu bộ xử lý lượng tử hoạt động trên bốn nền tảng ưu tiên khác nhau: ion, nguyên tử trung hòa, photon và siêu dẫn.",
      "Thành tựu này đưa Nga lọt vào nhóm 3 cường quốc duy nhất trên thế giới (bên cạnh Mỹ và Trung Quốc) sở hữu máy tính lượng tử trên cả bốn nền tảng này. Xét về năng lực xử lý, Nga hiện nằm trong top 6 quốc gia sở hữu bộ xử lý lượng tử có công suất từ 70 qubit trở lên. Các nguyên mẫu bao gồm:",
      "70 qubit trên ion (phòng thí nghiệm FIAN).",
      "72 qubit trên nguyên tử trung hòa (Đại học Lomonosov).",
      "35 qubit trên photon (Đại học Lomonosov).",
      "16 qubit trên nền tảng siêu dẫn (Đại học MISIS).",
      "Đặc biệt, vào tháng 8 năm 2025, liên minh khoa học từ FIAN và RCC đã xác lập một kỷ lục thế giới mới khi thực hiện thuật toán lượng tử lớn nhất trên qudit: trình diễn cổng Toffoli tổng quát (phép toán logic đa qubit) trên 10 ion. Đây là cổng logic lớn nhất từng được ghi nhận trong giới học thuật toàn cầu cho đến nay.",
      "Lộ trình 2030: Chuyển dịch từ “Phòng thí nghiệm” ra “Thực tiễn”",
      "Sau những thành tựu bước đầu, vào tháng 8/2025, Ủy ban Chính phủ Nga đã phê duyệt lộ trình Điện toán lượng tử giai đoạn mới, kéo dài đến năm 2030. Trọng tâm của giai đoạn này không chỉ là nâng cấp phần cứng mà là “hạ cánh” công nghệ xuống nền kinh tế thực.",
      "Lộ trình 2030 được vạch ra với 6 trụ cột cốt lõi:",
      "Phần cứng: Mục tiêu phát triển thành công bộ xử lý lượng tử 300 qubit.",
      "Thuật toán và phần mềm: Bổ sung thêm 54 thuật toán lượng tử mới vào danh sách 34 thuật toán hiện có, tập trung vào tối ưu hóa, hóa học, mô hình hóa và phân tích dữ liệu.",
      "Hạ tầng đám mây: Xây dựng dịch vụ đám mây truy cập từ xa, phục vụ ít nhất 10.000 người dùng trong các bài toán khoa học, công nghiệp và logistics.",
      "Xác nhận ứng dụng thực tiễn: Kiểm chứng ít nhất 100 giả thuyết khoa học về ứng dụng lượng tử trong nền kinh tế thực, từ đó thiết lập các tiêu chuẩn kỹ thuật cho giải pháp.",
      "Phát triển nhân lực: Đào tạo 8.300 cử nhân, 2.600 thạc sĩ/chuyên gia và 800 nghiên cứu sinh chuyên ngành lượng tử.",
      "Tài chính: Tổng ngân sách đầu tư dự kiến lên tới 29 tỷ ruble (từ nguồn ngân sách liên bang và vốn đối ứng của Rosatom).",
      "“Lộ trình mới đặt ra những mục tiêu đầy tham vọng: không chỉ tiếp tục nghiên cứu mà phải ứng dụng tích cực đổi mới lượng tử vào các ngành công nghiệp. Việc hình thành một ngành công nghiệp lượng tử tại Nga là bước ngoặt mang lại chất lượng mới cho nền kinh tế. Công nghệ lượng tử phải trở thành một nguồn lực hiệu quả mới.”– Bà Ekaterina Solntseva, Giám đốc Công nghệ Lượng tử Tập đoàn Rosatom.",
      "Từ năm 2026, bên cạnh điện toán, Rosatom sẽ chính thức mở rộng nghiên cứu sang lĩnh vực cảm biến lượng tử, hướng tới việc chế tạo các thiết bị đo lường siêu chính xác dựa trên hiệu ứng lượng tử.",
      "Lời giải cho các bài toán công nghiệp phức tạp",
      "Dù việc ứng dụng công nghệ lượng tử toàn cầu vẫn ở giai đoạn sơ khai, giới chuyên môn dự báo thế giới sẽ đạt được “ưu thế lượng tử” (Quantum Supremacy) trong vòng 5-10 năm tới.",
      "Tại Nga, lợi thế lớn nhất là việc nghiên cứu lượng tử được dẫn dắt bởi chính các tập đoàn công nghiệp như Rosatom – những người hiểu rõ nhất họ cần giải quyết bài toán gì. Giám đốc Ekaterina Solntseva nhấn mạnh: “Điều này mang lại cơ hội để Nga trở thành một trong những quốc gia tiên phong định hình phương pháp ứng dụng lượng tử vào nền kinh tế thực”.",
      "Hiện tại, Rosatom đã triển khai hơn 10 dự án thí điểm. Một minh chứng tiêu biểu là dự án đổi mới ngành “Proryv” (Đột phá), nơi sức mạnh lượng tử đã được chứng minh:",
      "Tối ưu hóa chuỗi cung ứng: Bài toán lập kế hoạch dài hạn sản xuất và cung cấp nhiên liệu hạt nhân vốn vô cùng phức tạp, nay được tính toán thử nghiệm trên thuật toán lượng tử chỉ mất vài phút.",
      "Mô hình hóa toán học: Gần đây nhất, các nhà khoa học đã giải quyết bài toán mô hình truyền nhiệt bằng cách sử dụng bộ tính toán 50 qubit (tại FIAN) qua nền tảng đám mây để giải hệ phương trình đại số tuyến tính (SLAE). Mặc dù kích thước hệ phương trình còn nhỏ, đây là bước đi nền tảng mở ra kỷ nguyên mô hình hóa công nghiệp bằng lượng tử.",
      "Ngoài năng lượng, các chuyên gia kỳ vọng những “giải pháp hữu ích” đầu tiên của lượng tử sẽ bùng nổ trong các lĩnh vực: Hóa học (tìm kiếm vật liệu mới), Dược phẩm (mô phỏng tương tác phân tử để phát triển thuốc, y học cá nhân hóa), Logistics (tối ưu hóa chuỗi cung ứng) và Tài chính (tối ưu hóa danh mục đầu tư, quản trị rủi ro).",
      "“Ưu thế lượng tử” thực sự và Nghệ thuật đầu tư hiệu quả",
      "Tuy nhiên, giới khoa học Nga vẫn giữ một cái nhìn thực tế và hoài nghi lành mạnh. Ông Ruslan Yunusov, Cố vấn của Tổng giám đốc Rosatom, định nghĩa: ”Ưu thế lượng tử chỉ thực sự đạt được khi máy tính lượng tử có thể giải quyết một bài toán phức tạp, có giá trị sống còn với kinh tế và công nghiệp, hiệu quả hơn siêu máy tính truyền thống”. Rủi ro lớn nhất vẫn là “thung lũng chết” giữa thành công trong phòng thí nghiệm và khả năng thương mại hóa.",
      "Dù vậy, khi so sánh với thế giới, chiến lược của Nga đang cho thấy hiệu quả đầu tư đáng kinh ngạc. Theo McKinsey Quantum Technology Monitor 2024, dù Nga chỉ đứng thứ 11 thế giới về ngân sách đầu tư cho lượng tử, nhưng lại đứng sát nút Mỹ và Trung Quốc về kết quả thực tiễn.",
      "Điển hình, ngân sách lượng tử của Nga chỉ bằng khoảng 1/10 so với Đức. Thế nhưng cùng một thời điểm xuất phát, Đức hiện mới giới thiệu bộ xử lý 10 qubit, trong khi Nga đã sở hữu 4 nguyên mẫu hoạt động mạnh mẽ, vươn mốc 70 qubit.",
      "Bài toán nhân sự và Hệ sinh thái liên ngành",
      "Một ngành công nghiệp tương lai không thể tồn tại nếu thiếu nguồn nhân lực kế cận. Rosatom hiểu rõ điều này và đã bao phủ mạng lưới giáo dục từ phổ thông đến sau đại học.",
      "Chương trình Cử nhân Kỹ thuật Lượng tử và Thạc sĩ Điện tử Lượng tử đã được triển khai tại Trung tâm RCC, Đại học MEPhI và LETI.",
      "Hơn 11 triệu trẻ em Nga đã được tiếp cận kiến thức lượng tử thông qua chiến dịch “Bài học số” toàn quốc trong 4 năm qua.",
      "Dự án “Tuần lễ Lượng tử Rosatom” và cuộc thi tay nghề AtomSkills liên tục được tổ chức tại các địa phương để phổ cập khoa học.",
      "“Chúng tôi đã xây dựng được một hệ sinh thái khoa học thu hút tới 80% các nhóm nghiên cứu chuyên ngành trên cả nước. Trọng tâm tiếp theo là đưa các đối tác công nghiệp vào cuộc để họ trở thành những 'khách hàng thông thái' đầu tiên,” ông Ruslan Yunusov chia sẻ.",
      "Động lực của tương lai: Chất lượng thay vì Số lượng",
      "Động lực để ngành công nghiệp lượng tử bứt tốc trong thập kỷ tới sẽ nằm ở doanh nghiệp. Những công ty tiên phong dám đầu tư, cùng kỹ sư xây dựng mô hình ứng dụng ngay từ bây giờ sẽ là những người hưởng “phần thưởng người dẫn đầu” khi thị trường bùng nổ.",
      "Bên cạnh đó, tư duy của cuộc đua lượng tử đang thay đổi. Nếu trước đây, các quốc gia chạy đua về “số lượng qubit” thì nay, chất lượng qubit mới là chìa khóa. Một minh chứng rõ ràng: Bộ tính toán 1.121 qubit của IBM hiện tại thậm chí còn yếu hơn máy tính ion 56 qubit của Quantinuum và hệ thống 127 qubit khác của chính IBM do tỷ lệ nhiễu và khả năng sửa lỗi khác nhau. Khả năng giải quyết bài toán thực tế mới là thước đo cuối cùng.",
      "Công nghệ lượng tử đã không còn là đặc quyền của các nhà vật lý. Như bà Ekaterina Solntseva đã đúc kết:",
      "“Một mình các nhà vật lý sẽ không thể xây dựng được một 'tương lai lượng tử' trọn vẹn. Y học lượng tử cần bác sĩ, công nghiệp lượng tử cần các nhà sản xuất, và logistics lượng tử cần các chuyên gia chuỗi cung ứng. Tương lai của lượng tử chắc chắn phải là sự giao thoa liên ngành.”",
      "Với tầm nhìn chiến lược, ngân sách tối ưu và một hệ sinh thái đang thành hình, Dự án Lượng tử của Rosatom không chỉ là câu chuyện của ngành hạt nhân, mà là lá bài chiến lược để nền kinh tế Nga sẵn sàng cho cuộc cách mạng công nghiệp tiếp theo của nhân loại."
    ],
    "sources": [
      "https://science.mail.ru/articles/42707-kvantovyj-proekt-rosatoma/"
    ],
    "contentType": "PROJECT"
  },
  {
    "id": 21,
    "title": "HƠN 2.200 SINH VIÊN TẠI NGA NHẬN TÀI TRỢ 1 TRIỆU RÚP ĐỂ PHÁT TRIỂN DỰ ÁN KHỞI NGHIỆP CÔNG NGHỆ",
    "summary": "Chính phủ Liên bang Nga đã công bố kết quả Cuộc thi “Student Startup” (Khởi nghiệp sinh viên) năm 2026. Theo đó, 2.222 sinh viên, nghiên cứu sinh và bác sĩ nội trú sẽ được nhận khoản tài trợ 1 triệu rúp/người để phát triển các dự án khởi nghiệp dựa trên khoa học và công nghệ. Chương trình được triển khai từ năm 2022 theo sáng kiến của Bộ Khoa học và Giáo dục đại học Nga, trong khuôn khổ Nền tảng Khởi nghiệp Công nghệ Đại học. Bên cạnh công dân Nga, các thí sinh đến từ 8 quốc gia hữu nghị cũng có dự án được lựa chọn nhận tài trợ. Tuy nhiên, Ban Tổ chức chưa công bố danh sách các quốc gia và cá nhân đoạt giải. Vì vậy, hiện chưa có cơ sở xác nhận có sinh viên Việt Nam trong số các dự án được hỗ trợ.",
    "category": "education",
    "date": "07/2026",
    "image": "https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169177/vnru/news/official-1fc011ef-db6d-4eb7-bbd9-cb47b64b2729.webp",
    "body": [
      "Chính phủ Liên bang Nga đã công bố kết quả Cuộc thi “Student Startup” (Khởi nghiệp sinh viên) năm 2026. Theo đó, 2.222 sinh viên, nghiên cứu sinh và bác sĩ nội trú sẽ được nhận khoản tài trợ 1 triệu rúp/người để phát triển các dự án khởi nghiệp dựa trên khoa học và công nghệ. Chương trình được triển khai từ năm 2022 theo sáng kiến của Bộ Khoa học và Giáo dục đại học Nga, trong khuôn khổ Nền tảng Khởi nghiệp Công nghệ Đại học. Bên cạnh công dân Nga, các thí sinh đến từ 8 quốc gia hữu nghị cũng có dự án được lựa chọn nhận tài trợ. Tuy nhiên, Ban Tổ chức chưa công bố danh sách các quốc gia và cá nhân đoạt giải. Vì vậy, hiện chưa có cơ sở xác nhận có sinh viên Việt Nam trong số các dự án được hỗ trợ.",
      "Phó Thủ tướng Nga Dmitry Chernyshenko cho biết chương trình là một trong những công cụ quan trọng nhằm thực hiện mục tiêu quốc gia về đạt được vị thế dẫn đầu công nghệ. Khoảng 70% số dự án được tài trợ thuộc các lĩnh vực ưu tiên trong các chương trình quốc gia về phát triển công nghệ, góp phần thúc đẩy thương mại hóa các kết quả nghiên cứu ngay từ môi trường đại học.",
      "Theo Bộ trưởng Khoa học và Giáo dục đại học Valery Falkov, sau bốn năm triển khai, Nền tảng Khởi nghiệp Công nghệ Đại học đã hình thành hệ sinh thái hỗ trợ sinh viên chuyển hóa ý tưởng nghiên cứu thành doanh nghiệp công nghệ. Năm 2026, các dự án đoạt giải đến từ hơn 300 trường đại học thuộc 79 chủ thể của Liên bang Nga, trong đó Moskva, Cộng hòa Tatarstan, Saint Petersburg, tỉnh Novosibirsk và Cộng hòa Bashkortostan là những địa phương có nhiều dự án được lựa chọn nhất.",
      "Các dự án tham gia cuộc thi năm nay thuộc 7 lĩnh vực gồm: công nghệ số; y học và công nghệ chăm sóc sức khỏe; công nghệ hóa học và vật liệu mới; thiết bị và công nghệ sản xuất thông minh; công nghệ sinh học; năng lượng tiết kiệm tài nguyên; và công nghiệp sáng tạo. Chương trình tiếp tục khẳng định định hướng của Nga trong việc xây dựng hệ sinh thái đổi mới sáng tạo, thúc đẩy tinh thần khởi nghiệp và gắn kết chặt chẽ giữa nghiên cứu khoa học với nhu cầu của doanh nghiệp và thị trường.",
      "Cuộc thi “Student Startup”",
      "Khởi động: năm 2022 theo sáng kiến của Bộ Khoa học và Giáo dục đại học Liên bang Nga.",
      "Đơn vị tổ chức: Quỹ Hỗ trợ Đổi mới sáng tạo (Фонд содействия инновациям).",
      "Mục tiêu: hỗ trợ sinh viên thương mại hóa kết quả nghiên cứu, thành lập doanh nghiệp công nghệ và phát triển hệ sinh thái khởi nghiệp trong các trường đại học.",
      "Đối tượng: sinh viên đại học, nghiên cứu sinh và bác sĩ nội trú.",
      "Mức hỗ trợ: 1 triệu rúp/dự án (không hoàn lại) để phát triển sản phẩm, hoàn thiện công nghệ và đưa dự án ra thị trường.",
      "Kết quả năm 2026: 2.222 dự án được lựa chọn từ hơn 300 trường đại học thuộc 79 chủ thể của Liên bang Nga; khoảng 70% thuộc các lĩnh vực ưu tiên của các chương trình quốc gia về phát triển công nghệ."
    ],
    "sources": [
      "https://t.me/minobrnaukiofficial/19274?single"
    ],
    "contentType": "ANNOUNCEMENT"
  },
  {
    "id": 22,
    "title": "BỘ TRƯỞNG KHOA HỌC VÀ GIÁO DỤC ĐẠI HỌC NGA: AI ĐANG LÀM THAY ĐỔI MÔ HÌNH NGHIÊN CỨU KHOA HỌC",
    "summary": "Phát biểu tại phiên toàn thể Đại hội toàn quốc lần thứ XIV của Hội đồng các nhà khoa học trẻ và các hội khoa học sinh viên, Bộ trưởng Khoa học và Giáo dục đại học Liên bang Nga Valery Falkov khẳng định trí tuệ nhân tạo (AI) đang tạo ra những thay đổi căn bản đối với hệ thống nghiên cứu khoa học và đổi mới sáng tạo. Theo ông, AI và Machine learning không còn chỉ là công cụ hỗ trợ mà đang trở thành yếu tố định hình cách thức tổ chức nghiên cứu, cấu trúc tri thức khoa học và vai trò của nhà khoa học trong kỷ nguyên số.",
    "category": "education",
    "date": "07/2026",
    "image": null,
    "body": [
      "Phát biểu tại phiên toàn thể Đại hội toàn quốc lần thứ XIV của Hội đồng các nhà khoa học trẻ và các hội khoa học sinh viên, Bộ trưởng Khoa học và Giáo dục đại học Liên bang Nga Valery Falkov khẳng định trí tuệ nhân tạo (AI) đang tạo ra những thay đổi căn bản đối với hệ thống nghiên cứu khoa học và đổi mới sáng tạo. Theo ông, AI và Machine learning không còn chỉ là công cụ hỗ trợ mà đang trở thành yếu tố định hình cách thức tổ chức nghiên cứu, cấu trúc tri thức khoa học và vai trò của nhà khoa học trong kỷ nguyên số.",
      "Bộ trưởng Falkov cho biết, trong quá trình xây dựng mô hình phát triển khoa học của Nga năm 2025, Bộ Khoa học và Giáo dục đại học đã xác định AI là động lực quan trọng của giai đoạn phát triển mới. Nhiều quốc gia có nền khoa học phát triển đang tái cấu trúc hệ thống nghiên cứu nhằm thích ứng với xu thế này, trong đó AI ngày càng đóng vai trò trung tâm trong quá trình tạo ra tri thức mới.",
      "Theo ông Valery Falkov, mô hình nghiên cứu khoa học mới sẽ có một số đặc điểm nổi bật như: các mô hình AI nền tảng và cơ sở dữ liệu lớn trở thành một phần quan trọng của kết quả nghiên cứu; các phòng thí nghiệm cần xây dựng hệ sinh thái công cụ AI và tích hợp vào các nền tảng số; hạ tầng tính toán hiệu năng cao và khả năng tiếp cận các tập dữ liệu quy mô lớn sẽ trở thành lợi thế cạnh tranh của các quốc gia. Đồng thời, nhà khoa học vẫn giữ vai trò trung tâm, song cần được trang bị các năng lực mới để khai thác hiệu quả AI trong nghiên cứu.",
      "Bộ trưởng Bộ Khoa học và Giáo dục đại học Liên bang Nga cũng nhận định trong những năm tới, các viện nghiên cứu sẽ có nhiều thay đổi về mô hình tổ chức, đồng thời xuất hiện nhiều tổ chức nghiên cứu mới dựa trên các mô hình toán học chuyên ngành kết hợp với các tác nhân AI (AI agents). Dịp này, Bộ cũng công bố chương trình tuyển chọn các tổ chức nghiên cứu và phát triển khoa học mới; các đơn vị được lựa chọn sẽ nhận được nguồn tài trợ để nâng cấp cơ sở vật chất, trang thiết bị phục vụ nghiên cứu."
    ],
    "sources": [
      "https://t.me/minobrnaukiofficial/19160?single"
    ]
  },
  {
    "id": 23,
    "title": "QUỸ INNOPRAKTIKA TRIỂN KHAI CHƯƠNG TRÌNH ĐÀO TẠO QUỐC TẾ VỀ CÔNG NGHỆ TIÊN TIẾN DÀNH CHO SINH VIÊN NƯỚC NGOÀI",
    "summary": "Bộ Khoa học và Giáo dục đại học Liên bang Nga thông báo Quỹ Innopraktika đã khởi động chương trình quốc tế \"Summer Multiversity – 2026\", quy tụ sinh viên và nhà nghiên cứu trẻ đến từ nhiều quốc gia tham gia đào tạo, nghiên cứu và thực hành tại các trường đại học, viện nghiên cứu và doanh nghiệp công nghệ hàng đầu của Nga. Chương trình hướng tới phát triển nguồn nhân lực chất lượng cao trong các lĩnh vực công nghệ mũi nhọn, đồng thời tăng cường hợp tác khoa học – giáo dục quốc tế.",
    "category": "education",
    "date": "07/2026",
    "image": null,
    "body": [
      "Bộ Khoa học và Giáo dục đại học Liên bang Nga thông báo Quỹ Innopraktika đã khởi động chương trình quốc tế \"Summer Multiversity – 2026\", quy tụ sinh viên và nhà nghiên cứu trẻ đến từ nhiều quốc gia tham gia đào tạo, nghiên cứu và thực hành tại các trường đại học, viện nghiên cứu và doanh nghiệp công nghệ hàng đầu của Nga. Chương trình hướng tới phát triển nguồn nhân lực chất lượng cao trong các lĩnh vực công nghệ mũi nhọn, đồng thời tăng cường hợp tác khoa học – giáo dục quốc tế.",
      "Người tham gia sẽ được học tập theo các chuyên đề về trí tuệ nhân tạo, công nghệ sinh học, y sinh, năng lượng, công nghệ thông tin, vật liệu mới và các lĩnh vực công nghệ cao khác, kết hợp với thực tập tại doanh nghiệp, tham quan các trung tâm nghiên cứu và giao lưu với các nhà khoa học, chuyên gia hàng đầu của Nga. Chương trình cũng tạo cơ hội để sinh viên quốc tế tìm hiểu hệ sinh thái đổi mới sáng tạo và môi trường nghiên cứu của Nga.",
      "Innopraktika là một quỹ phi lợi nhuận của Nga được thành lập nhằm kết nối khoa học – giáo dục – doanh nghiệp, thúc đẩy thương mại hóa kết quả nghiên cứu, đào tạo nhân lực công nghệ cao và hỗ trợ các dự án đổi mới sáng tạo. Quỹ là đơn vị tổ chức nhiều chương trình hợp tác quốc tế, thực tập, khởi nghiệp và phát triển tài năng trẻ, đồng thời phối hợp chặt chẽ với các trường đại học, viện nghiên cứu và các tập đoàn công nghệ lớn của Nga."
    ],
    "sources": [
      "https://t.me/minobrnaukiofficial/19258\\"
    ]
  },
  {
    "id": 24,
    "title": "TRƯỜNG ĐẠI HỌC DẦU KHÍ VIỆT NAM VÀ ĐẠI HỌC CÔNG NGHỆ HÓA HỌC MENDELEEV (NGA) THÚC ĐẨY HỢP TÁC NGHIÊN CỨU KHOA HỌC CHIẾN LƯỢC",
    "summary": "Ngày 30/6, Trường Đại học Dầu khí Việt Nam (PVU) và Đại học Công nghệ Hóa học D.I. Mendeleev (MUCTR, Liên bang Nga) đã tổ chức buổi làm việc nhằm cụ thể hóa các nội dung hợp tác về khoa học – công nghệ sau khi hai bên ký Biên bản ghi nhớ (MoU) tại Hội nghị Hiệu trưởng các trường đại học Việt Nam – Nga diễn ra vào tháng 5/2026. Buổi làm việc tập trung vào việc xây dựng các chương trình nghiên cứu chung, hướng tới phát triển bền vững trong lĩnh vực lọc – hóa dầu và công nghệ vật liệu.",
    "category": "education",
    "date": "30/06/2026",
    "image": null,
    "body": [
      "Ngày 30/6, Trường Đại học Dầu khí Việt Nam (PVU) và Đại học Công nghệ Hóa học D.I. Mendeleev (MUCTR, Liên bang Nga) đã tổ chức buổi làm việc nhằm cụ thể hóa các nội dung hợp tác về khoa học – công nghệ sau khi hai bên ký Biên bản ghi nhớ (MoU) tại Hội nghị Hiệu trưởng các trường đại học Việt Nam – Nga diễn ra vào tháng 5/2026. Buổi làm việc tập trung vào việc xây dựng các chương trình nghiên cứu chung, hướng tới phát triển bền vững trong lĩnh vực lọc – hóa dầu và công nghệ vật liệu.",
      "Tại cuộc họp, PVU đã giới thiệu các định hướng nghiên cứu trọng điểm gồm công nghệ màng tách, tái chế nhựa theo mô hình kinh tế tuần hoàn, vật liệu chức năng tiên tiến, nhiên liệu bền vững và vật liệu aerogel phục vụ xử lý môi trường. Trong khi đó, MUCTR giới thiệu thế mạnh về công nghệ hóa học, mô phỏng số (Digital Twins), thiết bị phục vụ khai thác dầu khí, công nghệ xúc tác và các vật liệu tiên tiến ứng dụng trong ngành lọc – hóa dầu. Hai bên đánh giá nhiều hướng nghiên cứu có tính bổ trợ cao và thống nhất xây dựng các chương trình hợp tác cụ thể trong thời gian tới.",
      "Đại diện hai bên cũng trao đổi về việc kết nối các nhóm nghiên cứu, phát triển các dự án khoa học chung, thúc đẩy chuyển giao công nghệ và mở rộng hợp tác đào tạo nguồn nhân lực chất lượng cao trong lĩnh vực năng lượng và hóa học. Đây được xem là bước triển khai quan trọng nhằm hiện thực hóa các cam kết hợp tác giữa hai cơ sở giáo dục, góp phần tăng cường kết nối khoa học – công nghệ giữa Việt Nam và Liên bang Nga.",
      "Thông tin thêm: Đại học Công nghệ Hóa học D.I. Mendeleev (MUCTR)",
      "Thành lập năm 1898, là một trong những trường đại học hàng đầu của Nga về hóa học, công nghệ hóa học, khoa học vật liệu và kỹ thuật hóa học.",
      "Trường mang tên nhà hóa học nổi tiếng Dmitri I. Mendeleev, người xây dựng Bảng tuần hoàn các nguyên tố hóa học.",
      "MUCTR có thế mạnh trong các lĩnh vực hóa dầu, xúc tác, công nghệ polymer, vật liệu tiên tiến, hóa dược, công nghệ môi trường và chuyển đổi số trong công nghiệp hóa chất.",
      "Tháng 5/2026, MUCTR và PVU đã ký Biên bản ghi nhớ hợp tác tại Hội nghị Hiệu trưởng các trường đại học Việt Nam – Nga, mở ra khuôn khổ hợp tác về đào tạo, nghiên cứu khoa học và chuyển giao công nghệ giữa hai cơ sở giáo dục."
    ],
    "sources": [
      "https://petrovietnam.petrotimes.vn/pvu-va-muctr-thuc-day-hop-tac-quoc-te-ket-noi-nghien-cuu-khoa-hoc-chien-luoc-742882.html"
    ]
  },
  {
    "id": 25,
    "title": "TRƯỜNG ĐẠI HỌC BÌNH DƯƠNG VÀ ĐẠI HỌC BÁCH KHOA SAINT PETERSBURG MỞ RỘNG HỢP TÁC ĐÀO TẠO VÀ NGHIÊN CỨU",
    "summary": "Trong khuôn khổ tăng cường hợp tác giáo dục Việt Nam – Liên bang Nga, Trường Đại học Bình Dương (BDU) đã có buổi làm việc với Đại học Bách khoa Saint Petersburg Peter Đại đế (SPbPU) nhằm thúc đẩy các chương trình hợp tác trong đào tạo, nghiên cứu khoa học và trao đổi học thuật giữa hai cơ sở giáo dục. Buổi làm việc diễn ra trong không khí hữu nghị, khẳng định quyết tâm của hai bên trong việc phát triển quan hệ đối tác lâu dài.",
    "category": "education",
    "date": "07/2026",
    "image": null,
    "body": [
      "Trong khuôn khổ tăng cường hợp tác giáo dục Việt Nam – Liên bang Nga, Trường Đại học Bình Dương (BDU) đã có buổi làm việc với Đại học Bách khoa Saint Petersburg Peter Đại đế (SPbPU) nhằm thúc đẩy các chương trình hợp tác trong đào tạo, nghiên cứu khoa học và trao đổi học thuật giữa hai cơ sở giáo dục. Buổi làm việc diễn ra trong không khí hữu nghị, khẳng định quyết tâm của hai bên trong việc phát triển quan hệ đối tác lâu dài.",
      "Tại cuộc gặp, lãnh đạo hai trường đã trao đổi về việc mở rộng chương trình trao đổi giảng viên, sinh viên, phát triển các chương trình đào tạo liên kết, phối hợp triển khai đề tài nghiên cứu khoa học, đồng thời tăng cường chia sẻ kinh nghiệm trong đào tạo các ngành kỹ thuật, công nghệ và chuyển đổi số. Hai bên cũng thống nhất thúc đẩy các hoạt động giao lưu học thuật, góp phần nâng cao chất lượng đào tạo và hội nhập quốc tế.",
      "Đại diện Đại học Bình Dương đánh giá quan hệ hợp tác với SPbPU không chỉ mở ra cơ hội tiếp cận nền giáo dục và khoa học công nghệ tiên tiến của Nga cho giảng viên, sinh viên mà còn góp phần củng cố quan hệ hữu nghị truyền thống giữa hai nước thông qua hợp tác giáo dục – đào tạo. Đây cũng là một trong những hoạt động thiết thực hưởng ứng Năm Hợp tác Khoa học và Giáo dục Việt Nam – Liên bang Nga 2026.",
      "Thông tin thêm: Đại học Bách khoa Saint Petersburg Peter Đại đế (SPbPU)",
      "Thành lập năm 1899, là một trong những trường đại học kỹ thuật lâu đời và uy tín nhất của Liên bang Nga.",
      "Trường có thế mạnh trong các lĩnh vực kỹ thuật, cơ khí, năng lượng, vật liệu mới, công nghệ thông tin, trí tuệ nhân tạo và chuyển đổi số.",
      "SPbPU hiện hợp tác với hàng trăm trường đại học và doanh nghiệp trên thế giới, đồng thời là một trong những trường kỹ thuật có số lượng sinh viên quốc tế lớn của Nga.",
      "Trong nhiều năm qua, SPbPU duy trì quan hệ hợp tác với nhiều cơ sở giáo dục đại học Việt Nam thông qua các chương trình đào tạo, nghiên cứu khoa học và trao đổi học thuật."
    ],
    "sources": [
      "https://bdu.edu.vn/tin-tuc-su-kien/moi-quan-he-huu-nghi-viet-nga-tiep-tuc-duoc-cung-co-thong-qua-hoat-dong-giao-duc-dao-tao-giua-truong-dai-hoc-binh-duong-va-truong-dai-hoc-bach-khoa-st-petersburg-895.html"
    ]
  },
  {
    "id": 26,
    "title": "ĐẠI HỌC VIỄN THÔNG QUỐC GIA SAINT PETERSBURG MANG TÊN GIÁO SƯ M.A. BONCH-BRUEVICH HOÀN THÀNH KHÓA HỌC VỀ TRÍ TUỆ NHÂN TẠO VÀ AN TOÀN THÔNG TIN DÀNH CHO SINH VIÊN PTIT",
    "summary": "Ngày 6/7, Đại học Viễn thông Quốc gia Saint Petersburg mang tên Giáo sư M.A. Bonch-Bruevich (SPbSUT) đã hoàn thành khóa học chuyên đề về ứng dụng trí tuệ nhân tạo (AI) trong an toàn thông tin dành cho sinh viên Học viện Công nghệ Bưu chính Viễn thông (PTIT). Đây là hoạt động nằm trong chuỗi hợp tác giữa hai cơ sở giáo dục, tiếp nối các buổi làm việc nhằm mở rộng hợp tác đào tạo và nghiên cứu trong lĩnh vực công nghệ số giữa Việt Nam và Liên bang Nga.",
    "category": "education",
    "date": "06/07/2026",
    "image": null,
    "body": [
      "Ngày 6/7, Đại học Viễn thông Quốc gia Saint Petersburg mang tên Giáo sư M.A. Bonch-Bruevich (SPbSUT) đã hoàn thành khóa học chuyên đề về ứng dụng trí tuệ nhân tạo (AI) trong an toàn thông tin dành cho sinh viên Học viện Công nghệ Bưu chính Viễn thông (PTIT). Đây là hoạt động nằm trong chuỗi hợp tác giữa hai cơ sở giáo dục, tiếp nối các buổi làm việc nhằm mở rộng hợp tác đào tạo và nghiên cứu trong lĩnh vực công nghệ số giữa Việt Nam và Liên bang Nga.",
      "Khóa học do PGS.TS. Igor Ushakov, Trưởng Bộ môn An toàn thông tin mạng máy tính của SPbSUT, trực tiếp giảng dạy. Nội dung tập trung vào các xu hướng mới trong ứng dụng AI và học máy vào bảo vệ hệ thống thông tin, phát hiện và ứng phó với các mối đe dọa an ninh mạng, kết hợp giữa lý thuyết và các bài tập thực hành. Sinh viên PTIT cũng có cơ hội trao đổi trực tiếp với giảng viên và chuyên gia Nga về các bài toán thực tiễn trong lĩnh vực an toàn thông tin.",
      "Theo SPbSUT, khóa học là một phần trong định hướng tăng cường hợp tác lâu dài với PTIT. Trước đó, lãnh đạo hai trường đã thống nhất thúc đẩy xây dựng chương trình đào tạo song bằng, triển khai các đề tài nghiên cứu chung, trao đổi giảng viên và sinh viên, đồng thời mở rộng các khóa học ngắn hạn và chương trình học thuật trong các lĩnh vực viễn thông, an toàn thông tin và trí tuệ nhân tạo.",
      "Việc tổ chức thành công khóa học không chỉ góp phần nâng cao năng lực chuyên môn cho sinh viên PTIT trong lĩnh vực an ninh mạng và AI mà còn đánh dấu bước tiến mới trong hợp tác giáo dục giữa hai trường, hướng tới xây dựng các chương trình đào tạo và nghiên cứu chung đáp ứng nhu cầu phát triển nguồn nhân lực chất lượng cao cho chuyển đổi số của Việt Nam và Liên bang Nga.",
      "Thông tin thêm: Đại học Viễn thông Quốc gia Saint Petersburg (SPbSUT)",
      "Tên đầy đủ: Đại học Viễn thông Quốc gia Saint Petersburg mang tên Giáo sư M.A. Bonch-Bruevich (SPbSUT).",
      "Thành lập: năm 1930, là một trong những trường đại học hàng đầu của Nga trong lĩnh vực viễn thông và công nghệ thông tin.",
      "Thế mạnh đào tạo: viễn thông, mạng máy tính, an toàn thông tin, trí tuệ nhân tạo, công nghệ thông tin, kỹ thuật vô tuyến, điện tử và kinh tế số.",
      "Quy mô: khoảng 13.000 sinh viên, với hệ thống phòng thí nghiệm hiện đại và mạng lưới hợp tác rộng khắp với các doanh nghiệp công nghệ, viễn thông trong và ngoài nước.",
      "Hợp tác với Việt Nam: SPbSUT có quan hệ hợp tác truyền thống với nhiều cơ sở đào tạo Việt Nam, đặc biệt là Học viện Công nghệ Bưu chính Viễn thông (PTIT). Hai bên đang thúc đẩy chương trình đào tạo song bằng, nghiên cứu chung, trao đổi giảng viên – sinh viên và tổ chức các khóa học chuyên đề về an toàn thông tin, trí tuệ nhân tạo. Trường cũng đã đào tạo nhiều thế hệ chuyên gia viễn thông Việt Nam và được Nhà nước Việt Nam trao Huân chương Hữu nghị vì những đóng góp trong đào tạo nguồn nhân lực."
    ],
    "sources": [
      "https://www.sut.ru/studentu/bonchnews/international/06-07-2026-zavershilsya-kurs-spbgut-dlya-studentov-vetnamskogo-universiteta-PTIT"
    ]
  },
  {
    "id": 27,
    "title": "ĐẠI HỌC HERZEN ĐƯỢC ĐỀ XUẤT ĐĂNG CAI DIỄN ĐÀN NGOẠI GIAO NHÂN DÂN NGA – VIỆT LẦN THỨ II",
    "summary": "Tại phiên họp Hội đồng Khoa học của Đại học Sư phạm Quốc gia Nga mang tên A.I. Herzen (Herzen University), ông Vyacheslav Kalganov, Phó Chủ tịch Ủy ban Đối ngoại thành phố Saint Petersburg, đánh giá Herzen là một trong những trường đại học hàng đầu của Nga trong hợp tác với Việt Nam. Theo ông, nhà trường đã xây dựng được mạng lưới hợp tác bài bản, lâu dài với các cơ sở giáo dục Việt Nam, và những kết quả này đã được ghi nhận ở cấp nhà nước của cả hai quốc gia.",
    "category": "education",
    "date": "10/20/2026",
    "image": null,
    "body": [
      "Tại phiên họp Hội đồng Khoa học của Đại học Sư phạm Quốc gia Nga mang tên A.I. Herzen (Herzen University), ông Vyacheslav Kalganov, Phó Chủ tịch Ủy ban Đối ngoại thành phố Saint Petersburg, đánh giá Herzen là một trong những trường đại học hàng đầu của Nga trong hợp tác với Việt Nam. Theo ông, nhà trường đã xây dựng được mạng lưới hợp tác bài bản, lâu dài với các cơ sở giáo dục Việt Nam, và những kết quả này đã được ghi nhận ở cấp nhà nước của cả hai quốc gia.",
      "Phát biểu tại cuộc họp, ông Kalganov đề xuất lựa chọn Đại học Herzen làm địa điểm tổ chức Diễn đàn Ngoại giao nhân dân Nga – Việt lần thứ II, dự kiến diễn ra vào tháng 10/2026 tại Saint Petersburg. Phía Nga, Ủy ban Đối ngoại thành phố Saint Petersburg sẽ là đơn vị chủ trì tổ chức. Diễn đàn lần thứ nhất được tổ chức tại Hà Nội vào năm 2025 với sự tham gia tích cực của đoàn Đại học Herzen.",
      "Đại học Herzen là một trong những đối tác truyền thống của nhiều cơ sở giáo dục Việt Nam, đặc biệt trong lĩnh vực đào tạo giáo viên, ngôn ngữ Nga, khoa học giáo dục và giao lưu học thuật. Trường thường xuyên tiếp nhận sinh viên Việt Nam theo các chương trình học bổng, trao đổi học thuật và phối hợp tổ chức các hoạt động văn hóa, giáo dục, góp phần củng cố quan hệ hợp tác giữa hai nước.",
      "Đề xuất lựa chọn Đại học Herzen đăng cai Diễn đàn Ngoại giao nhân dân Nga – Việt lần thứ II tiếp tục khẳng định vai trò ngày càng nổi bật của nhà trường trong việc thúc đẩy giao lưu nhân dân, hợp tác giáo dục và tăng cường quan hệ hữu nghị truyền thống giữa Việt Nam và Liên bang Nga.",
      "Thông tin thêm: Đại học Sư phạm Quốc gia Nga mang tên A.I. Herzen (Herzen University)",
      "Thành lập: năm 1797, là một trong những trường đại học sư phạm lâu đời và danh tiếng nhất của Liên bang Nga.",
      "Trụ sở: thành phố Saint Petersburg.",
      "Thế mạnh đào tạo: sư phạm, khoa học giáo dục, tâm lý học, ngôn ngữ học, ngôn ngữ Nga, khoa học xã hội và nhân văn.",
      "Hợp tác với Việt Nam: Là một trong những trường đại học Nga có quan hệ hợp tác lâu đời với Việt Nam, duy trì liên kết với nhiều trường đại học sư phạm và cơ sở đào tạo trong nước; thường xuyên tiếp nhận lưu học sinh Việt Nam, triển khai các chương trình trao đổi giảng viên, sinh viên và phối hợp tổ chức các hoạt động văn hóa, giáo dục Việt – Nga. Năm 2025, trường tổ chức Lễ hội Văn hóa và Ngôn ngữ Việt Nam lần thứ VI, đồng thời là một trong những đơn vị tích cực tham gia Diễn đàn Ngoại giao nhân dân Việt Nam – Nga lần thứ I tại Hà Nội.",
      "Vai trò hiện nay: Herzen được Bộ Giáo dục Liên bang Nga giao đào tạo giáo viên, nghiên cứu khoa học giáo dục và thúc đẩy hợp tác quốc tế, đặc biệt với các quốc gia châu Á, trong đó có Việt Nam."
    ],
    "sources": [
      "https://m.vk.com/wall-46508610_35938"
    ],
    "contentType": "EVENT"
  },
  {
    "id": 28,
    "title": "85% SINH VIÊN NGA SỬ DỤNG AI ĐỂ HỖ TRỢ HỌC TẬP",
    "summary": "Theo khảo sát mới do VK Education thực hiện với 1.000 sinh viên từ 18–25 tuổi tại các trường đại học trên khắp nước Nga, 85% sinh viên cho biết đang sử dụng trí tuệ nhân tạo (AI) để hỗ trợ học tập, đưa AI trở thành công cụ công nghệ được sử dụng phổ biến nhất trong môi trường đại học. Kết quả khảo sát cho thấy AI đang ngày càng trở thành một phần trong phương pháp học tập và nghiên cứu của sinh viên Nga.",
    "category": "education",
    "date": "07/2026",
    "image": null,
    "body": [
      "Theo khảo sát mới do VK Education thực hiện với 1.000 sinh viên từ 18–25 tuổi tại các trường đại học trên khắp nước Nga, 85% sinh viên cho biết đang sử dụng trí tuệ nhân tạo (AI) để hỗ trợ học tập, đưa AI trở thành công cụ công nghệ được sử dụng phổ biến nhất trong môi trường đại học. Kết quả khảo sát cho thấy AI đang ngày càng trở thành một phần trong phương pháp học tập và nghiên cứu của sinh viên Nga.",
      "Động lực học tập lớn nhất của sinh viên là nhận thức về cơ hội nghề nghiệp trong tương lai (76%), tiếp theo là các câu chuyện truyền cảm hứng (38%), sự động viên từ gia đình và bạn bè (28%) và mong muốn tránh bị thôi học (25%). Bên cạnh đó, 83% sinh viên bày tỏ mong muốn áp dụng các phương pháp quản lý thời gian để nâng cao năng suất học tập. Phổ biến nhất là phương pháp \"Swiss Cheese\" (chia nhỏ nhiệm vụ lớn thành nhiều bước nhỏ), tiếp đến là \"Eat the Frog\" (hoàn thành việc khó nhất ngay đầu ngày) và kỹ thuật Pomodoro (luân phiên giữa học tập và nghỉ ngơi).",
      "Ngoài AI, sinh viên Nga còn sử dụng nhiều công cụ số khác phục vụ học tập như lưu trữ đám mây (29%), bảng cộng tác trực tuyến (26%), loa thông minh (16%) và công nghệ chuyển văn bản thành giọng nói (15%) để nghe lại bài giảng. Khi lập kế hoạch học tập, hơn một nửa số sinh viên sử dụng ứng dụng ghi chú trên điện thoại hoặc ghi nhớ cá nhân, trong khi tỷ lệ sử dụng lịch điện tử và các ứng dụng quản lý công việc chuyên dụng vẫn còn khá khiêm tốn.",
      "Thông tin thêm: VK Education",
      "VK Education là nền tảng giáo dục do VK – tập đoàn công nghệ số lớn nhất của Nga – phát triển nhằm đào tạo và phát triển nguồn nhân lực trong các lĩnh vực công nghệ thông tin, trí tuệ nhân tạo, khoa học dữ liệu và an ninh mạng. Thông qua mạng lưới hợp tác với hàng trăm trường đại học, VK Education triển khai các khóa học, chương trình thực tập, cuộc thi công nghệ và nghiên cứu về xu hướng giáo dục số, góp phần thúc đẩy chuyển đổi số và đổi mới phương pháp đào tạo trong giáo dục đại học Nga."
    ],
    "sources": [
      "https://m.vk.com/wall-206228370_9002"
    ]
  },
  {
    "id": 29,
    "title": "DU HỌC SINH VIỆT NAM GIỚI THIỆU VĂN HÓA DÂN TỘC TẠI NGÀY HỘI CÁC QUỐC GIA CỦA TRƯỜNG ĐẠI HỌC KIẾN TRÚC - XÂY DỰNG SAINT PETERSBURG",
    "summary": "Du học sinh Việt Nam nổi bật tại Lễ hội “Đối thoại các nền văn hóa” của Đại học Kiến trúc – Xây dựng Quốc gia Saint Petersburg",
    "category": "society",
    "date": "29/06/2026",
    "image": null,
    "body": [
      "Du học sinh Việt Nam nổi bật tại Lễ hội “Đối thoại các nền văn hóa” của Đại học Kiến trúc – Xây dựng Quốc gia Saint Petersburg",
      "Ngày 29/6, Trường Đại học Kiến trúc – Xây dựng Quốc gia Saint Petersburg (SPbGASU) đã tổ chức Lễ hội thường niên “Đối thoại các nền văn hóa” (Диалог культур), khép lại chương trình đào tạo tiếng Nga dành cho sinh viên quốc tế hệ dự bị. Chương trình quy tụ du học sinh đến từ 18 quốc gia, mỗi đoàn giới thiệu về lịch sử, văn hóa và bản sắc dân tộc thông qua các bài thuyết trình, trình diễn nghệ thuật và hoạt động giao lưu.",
      "Trong khuôn khổ lễ hội, hai du học sinh Việt Nam Hoàng Ngọc Huy và Phạm Xuân Đông đã mang đến một phần trình bày ấn tượng về đất nước Việt Nam. Mở đầu, hai em giới thiệu Việt Nam là \"trái tim của Đông Nam Á\", khái quát vị trí địa lý, lịch sử hàng nghìn năm đấu tranh giành độc lập và quá trình phát triển đất nước sau công cuộc Đổi mới, minh họa bằng các số liệu về tăng trưởng GDP và giảm tỷ lệ nghèo. Bài thuyết trình cũng giới thiệu những giá trị văn hóa đặc sắc của Việt Nam như nền văn minh lúa nước, tín ngưỡng thờ cúng tổ tiên và truyền thuyết Con Rồng Cháu Tiên, đồng thời nhấn mạnh mối quan hệ hữu nghị truyền thống giữa Việt Nam và Liên bang Nga.",
      "Điểm nhấn của phần trình bày là tiết mục biểu diễn của Phạm Xuân Đông với cây sáo trúc. Em đã trình diễn các giai điệu truyền thống của Việt Nam cùng hai ca khúc Nga quen thuộc \"Chiều Matxcơva\" (Подмосковные вечера) và \"Katyusha\", nhận được những tràng pháo tay nồng nhiệt từ giảng viên và sinh viên quốc tế. Tiết mục không chỉ góp phần quảng bá văn hóa Việt Nam mà còn thể hiện sự giao thoa văn hóa và tình hữu nghị giữa nhân dân hai nước.",
      "Bên cạnh đoàn Việt Nam, lễ hội còn có sự tham gia của sinh viên đến từ Burundi, Mali, Trung Quốc, Indonesia, Zambia, Yemen, Cộng hòa Congo, Campuchia, Bangladesh, Cuba, Angola, Guinea Xích đạo và nhiều quốc gia khác. Các đoàn đã giới thiệu trang phục truyền thống, nghệ thuật, ẩm thực, trà đạo, thơ ca, âm nhạc và các nét văn hóa đặc sắc của dân tộc mình, tạo nên một không gian giao lưu đa văn hóa sôi động.",
      "Theo SPbGASU, Lễ hội “Đối thoại các nền văn hóa” là hoạt động thường niên của Khoa Giao tiếp liên văn hóa nhằm giúp sinh viên quốc tế rèn luyện tiếng Nga, kỹ năng thuyết trình và tăng cường hiểu biết giữa các nền văn hóa. Phát biểu sau chương trình, bà Karina Surkova, Trưởng Khoa Dự bị dành cho công dân nước ngoài, đánh giá cao chất lượng các phần trình bày và cho biết khả năng sử dụng tiếng Nga của sinh viên quốc tế được cải thiện rõ rệt qua từng tuần học.",
      "Thông tin thêm: Trường Đại học Kiến trúc – Xây dựng Quốc gia Saint Petersburg (SPbGASU)",
      "Thành lập: năm 1832, là một trong những trường đại học kỹ thuật lâu đời nhất của Liên bang Nga.",
      "Trụ sở: thành phố Saint Petersburg.",
      "Thế mạnh đào tạo: kiến trúc, kỹ thuật xây dựng, quy hoạch đô thị, giao thông, hạ tầng kỹ thuật và công nghệ xây dựng.",
      "Quy mô: khoảng 12.000 sinh viên, trong đó có sinh viên quốc tế đến từ hơn 60 quốc gia.",
      "Quan hệ với Việt Nam: SPbGASU tiếp nhận du học sinh Việt Nam theo diện học bổng Hiệp định và học bổng của Chính phủ Nga; đồng thời duy trì hợp tác với các cơ sở đào tạo Việt Nam trong lĩnh vực kiến trúc, xây dựng và quy hoạch đô thị.",
      "Theo: https://www.spbgasu.ru/news-and-events/news/zavershaya-obuchenie-inostrannye-slushateli-podgotovitelnogo-otdeleniya-rasskazali-o-svoikh-stranakh/"
    ],
    "sources": []
  },
  {
    "id": 30,
    "title": "TRUNG TÂM VĂN HÓA NGA – VIỆT TẠI ĐẠI HỌC HERZEN KỶ NIỆM MỘT NĂM THÀNH LẬP",
    "summary": "Ngày 28/7, Trung tâm Văn hóa Nga – Việt tại Đại học Sư phạm Quốc gia Nga mang tên A.I. Herzen (Herzen University) đã kỷ niệm một năm đi vào hoạt động. Sau một năm, Trung tâm đã tổ chức hơn 30 hoạt động gồm hội thảo, tọa đàm, lớp trải nghiệm và các chương trình giao lưu văn hóa, thu hút trên 1.000 lượt người tham dự, trở thành một trong những điểm nhấn trong hợp tác giáo dục, văn hóa và giao lưu nhân dân giữa Việt Nam và Liên bang Nga.",
    "category": "society",
    "date": "28/07/2026",
    "image": null,
    "body": [
      "Ngày 28/7, Trung tâm Văn hóa Nga – Việt tại Đại học Sư phạm Quốc gia Nga mang tên A.I. Herzen (Herzen University) đã kỷ niệm một năm đi vào hoạt động. Sau một năm, Trung tâm đã tổ chức hơn 30 hoạt động gồm hội thảo, tọa đàm, lớp trải nghiệm và các chương trình giao lưu văn hóa, thu hút trên 1.000 lượt người tham dự, trở thành một trong những điểm nhấn trong hợp tác giáo dục, văn hóa và giao lưu nhân dân giữa Việt Nam và Liên bang Nga.",
      "Nhân dịp này, Đại sứ Việt Nam tại Liên bang Nga Đặng Minh Khôi đã gửi thư chúc mừng, khẳng định nhiều thế hệ chuyên gia Việt Nam được đào tạo tại Đại học Herzen luôn dành tình cảm sâu sắc đối với các thầy cô giáo Nga và đất nước Nga. Đại sứ đánh giá cao những đóng góp của Trung tâm trong việc tăng cường hiểu biết giữa nhân dân hai nước và khẳng định Đại sứ quán Việt Nam sẽ tiếp tục đồng hành, hỗ trợ triển khai các hoạt động hợp tác về văn hóa, giáo dục và nhân văn. Thay mặt Đại sứ quán, Bí thư thứ nhất, bà Mai Nguyễn Tuyết Hoa cũng gửi lời chúc Trung tâm tiếp tục phát huy vai trò là cầu nối vun đắp tình hữu nghị và sự gắn kết giữa nhân dân Việt Nam và Nga.",
      "Phát biểu tại buổi lễ, Hiệu trưởng Đại học Herzen Sergey Tarasov cho biết hợp tác với Việt Nam luôn là một trong những ưu tiên trong chiến lược quốc tế hóa của nhà trường. Bên cạnh việc tiếp nhận du học sinh Việt Nam và phát triển chương trình đào tạo tiếng Việt cho sinh viên Nga, trường còn biên soạn các giáo trình về du lịch Việt Nam và Việt Nam học, đồng thời triển khai các Trung tâm Giáo dục mở, giảng dạy tiếng Nga tại Hà Nội và Đà Nẵng, với hơn 1.300 học viên đã tham gia học tập. Theo ông, Năm Hợp tác Khoa học và Giáo dục Việt Nam – Liên bang Nga sẽ tạo thêm động lực để hai bên triển khai nhiều dự án hợp tác mới.",
      "Đánh giá về hoạt động của Trung tâm, Phó Chủ tịch Ủy ban Đối ngoại thành phố Saint Petersburg Vyacheslav Kalganov cho biết mô hình này đang nhận được sự quan tâm của cả hai nước và đã trở thành địa điểm thường xuyên tổ chức các hoạt động giao lưu Việt Nam – Nga. Ông cũng tiết lộ hai bên đã thống nhất tiếp tục tổ chức nhiều sự kiện lớn tại đây trong những năm tới, trong đó có các hoạt động kỷ niệm 120 năm ngày sinh Tổng Bí thư Lê Duẩn vào năm 2027 và các ngày lễ lịch sử quan trọng của Việt Nam trong năm 2028.",
      "Chương trình kỷ niệm diễn ra trong không khí đậm đà bản sắc hai dân tộc với các tiết mục nghệ thuật do sinh viên Nga và Việt Nam biểu diễn, cùng triển lãm ảnh giới thiệu chặng đường một năm hoạt động của Trung tâm. Những hoạt động này tiếp tục khẳng định vai trò của Trung tâm Văn hóa Nga – Việt như một không gian đối thoại văn hóa, góp phần làm sâu sắc hơn quan hệ hữu nghị và hợp tác giáo dục giữa Việt Nam và Liên bang Nga.",
      "Thông tin thêm: Trung tâm Văn hóa Nga – Việt tại Đại học Herzen",
      "Được thành lập ngày 28/7/2025 nhân dịp 75 năm thiết lập quan hệ ngoại giao Việt Nam – Liên bang Nga, Trung tâm Văn hóa Nga – Việt là mô hình đầu tiên thuộc một trường đại học Nga chuyên thúc đẩy giao lưu văn hóa, giáo dục và nghiên cứu về Việt Nam. Trung tâm hoạt động trên ba lĩnh vực chính: giới thiệu văn hóa, khoa học – giáo dục và giao lưu học thuật; đồng thời hỗ trợ kết nối các cơ sở giáo dục của Nga, Việt Nam và khu vực Đông Nam Á. Đây cũng là nơi tổ chức nhiều hoạt động thường niên như Tuần lễ Việt Nam, Ngày Thanh niên Việt Nam tại Saint Petersburg và các hội thảo về hợp tác Việt Nam – Nga."
    ],
    "sources": [
      "https://www.herzen.spb.ru/news-events/news/?ELEMENT_ID=66581"
    ]
  },
  {
    "id": 31,
    "title": "DU HỌC SINH VIỆT NAM BẢO VỆ THÀNH CÔNG LUẬN ÁN TIẾN SĨ TRƯỚC THỜI HẠN 18 THÁNG TẠI NGA",
    "summary": "Ngày 22/4/2026, du học sinh Phạm Thị Gấm, nghiên cứu sinh chuyên ngành Hóa phân tích tại Đại học Tổng hợp Quốc gia Voronezh (VGU), Liên bang Nga, đã bảo vệ thành công luận án tiến sĩ với đề tài \"Xác định kháng sinh trong môi trường lỏng bằng cảm biến ampe dựa trên các polyme in dấu phân tử\", hoàn thành chương trình đào tạo trước thời hạn 18 tháng.",
    "category": "education",
    "date": "22/04/2026",
    "image": null,
    "body": [
      "Ngày 22/4/2026, du học sinh Phạm Thị Gấm, nghiên cứu sinh chuyên ngành Hóa phân tích tại Đại học Tổng hợp Quốc gia Voronezh (VGU), Liên bang Nga, đã bảo vệ thành công luận án tiến sĩ với đề tài \"Xác định kháng sinh trong môi trường lỏng bằng cảm biến ampe dựa trên các polyme in dấu phân tử\", hoàn thành chương trình đào tạo trước thời hạn 18 tháng.",
      "Đề tài nghiên cứu tập trung phát triển các cảm biến điện hóa sử dụng polyme in dấu phân tử (Molecularly Imprinted Polymers – MIP) nhằm phát hiện nhanh, có độ chọn lọc và độ nhạy cao đối với dư lượng kháng sinh trong các môi trường lỏng như nước và sữa. Kết quả nghiên cứu mở ra triển vọng ứng dụng trong kiểm soát an toàn thực phẩm, giám sát ô nhiễm môi trường và phát triển các phương pháp phân tích hiện đại với chi phí thấp, thời gian phân tích ngắn.",
      "Trong gần 30 tháng học tập và nghiên cứu tại VGU (từ tháng 10/2023 đến tháng 4/2026), chị Phạm Thị Gấm đã công bố 16 công trình khoa học, gồm 10 bài báo trên các tạp chí quốc tế thuộc hệ thống Web of Science và Scopus, cùng 6 báo cáo tại các hội thảo khoa học chuyên ngành. Với những kết quả nổi bật này, chị đã được trao Giải Nhất Nghiên cứu khoa học năm học 2025–2026 của nhà trường.",
      "Chia sẻ sau khi bảo vệ thành công luận án, Tiến sĩ Phạm Thị Gấm cho biết ngay từ khi bắt đầu chương trình nghiên cứu sinh, chị đã xây dựng kế hoạch nghiên cứu rõ ràng với mục tiêu hoàn thành luận án trong thời gian ngắn nhất nhưng vẫn bảo đảm chất lượng khoa học. Bên cạnh sự nỗ lực của bản thân, chị luôn nhận được sự hướng dẫn tận tình của Giáo sư Alexander Nikolaevich Zyablov cùng sự động viên của gia đình, đồng nghiệp và bạn bè.",
      "Từng học đại học và thạc sĩ tại Nga trong giai đoạn 2007–2014, sau hơn chín năm trở về Việt Nam công tác, chị quyết định quay lại Đại học Tổng hợp Quốc gia Voronezh để tiếp tục theo đuổi con đường nghiên cứu khoa học. Thành tích bảo vệ luận án trước thời hạn cùng những kết quả nghiên cứu đạt được là minh chứng cho năng lực, tinh thần học thuật và ý chí vươn lên của du học sinh Việt Nam tại Liên bang Nga, đồng thời góp phần khẳng định hình ảnh đội ngũ trí thức trẻ Việt Nam trên các diễn đàn khoa học quốc tế.",
      "Thông tin thêm: Đại học Tổng hợp Quốc gia Voronezh (VGU)",
      "Được thành lập năm 1918, Đại học Tổng hợp Quốc gia Voronezh (Voronezh State University – VGU) là một trong những trường đại học nghiên cứu uy tín của Liên bang Nga, đào tạo trên nhiều lĩnh vực như khoa học tự nhiên, hóa học, vật lý, công nghệ thông tin, kinh tế, luật và khoa học xã hội. Trường có quan hệ hợp tác lâu năm với Việt Nam và đã đào tạo nhiều thế hệ cán bộ, giảng viên, nhà khoa học Việt Nam, đặc biệt trong các lĩnh vực khoa học cơ bản và khoa học tự nhiên.",
      "(nội dung và ảnh của bài viết do nhân vật cung cấp)"
    ],
    "sources": []
  },
  {
    "id": 32,
    "title": "DU HỌC SINH VIỆT NAM THAM DỰ DIỄN ĐÀN THANH NIÊN TOÀN NGA VỀ SINH THÁI HỌC 2026",
    "summary": "Từ ngày 21/6 đến 8/7/2026, tại bán đảo Kamchatka (Liên bang Nga) đã diễn ra Diễn đàn Thanh niên toàn Nga về Sinh thái học 2026 với chủ đề “Hệ sinh thái – Vùng đất được bảo tồn”. Diễn đàn quy tụ 600 đại biểu, gồm 300 thanh niên và 300 thiếu niên được tuyển chọn từ 89 chủ thể của Liên bang Nga cùng đại diện 6 quốc gia gồm Việt Nam, Belarus, Kazakhstan, Ấn Độ, Maroc và Turkmenistan. Đại diện Việt Nam tham dự diễn đàn là nghiên cứu sinh Hồ Minh Nhựt, hiện đang học tập tại Đại học Bách khoa Saint Petersburg Peter Đại đế (SPbPU).",
    "category": "education",
    "date": "21/06/2026",
    "image": "https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169190/vnru/news/official-761046d1-84ae-4c0c-81bf-668e6cf12bd3.webp",
    "body": [
      "Từ ngày 21/6 đến 8/7/2026, tại bán đảo Kamchatka (Liên bang Nga) đã diễn ra Diễn đàn Thanh niên toàn Nga về Sinh thái học 2026 với chủ đề “Hệ sinh thái – Vùng đất được bảo tồn”. Diễn đàn quy tụ 600 đại biểu, gồm 300 thanh niên và 300 thiếu niên được tuyển chọn từ 89 chủ thể của Liên bang Nga cùng đại diện 6 quốc gia gồm Việt Nam, Belarus, Kazakhstan, Ấn Độ, Maroc và Turkmenistan. Đại diện Việt Nam tham dự diễn đàn là nghiên cứu sinh Hồ Minh Nhựt, hiện đang học tập tại Đại học Bách khoa Saint Petersburg Peter Đại đế (SPbPU).",
      "Diễn đàn là một trong những hoạt động học thuật lớn của Nga trong lĩnh vực môi trường và phát triển bền vững, tập trung vào ba chủ đề chính: công nghệ sinh thái, giáo dục sinh thái và du lịch sinh thái. Bên cạnh các bài giảng chuyên đề, tọa đàm với các chuyên gia và hoạt động xây dựng dự án, các đại biểu còn tham gia khảo sát thực địa tại nhiều địa điểm tiêu biểu của Kamchatka như hồ Mikhizha, sông Bystra và bãi biển Khalaktyrsky bên bờ Thái Bình Dương, nổi tiếng với bãi cát đen được hình thành từ hoạt động núi lửa hàng triệu năm trước. Thông qua các hoạt động này, các đại biểu được thực hành các phương pháp nghiên cứu hiện trường về hệ sinh thái rừng, đồng bằng và ven biển, đồng thời cùng trao đổi, đề xuất các sáng kiến giải quyết những vấn đề môi trường trong tương lai.",
      "Bên cạnh các hoạt động chuyên môn, Lễ hội Đoàn kết các dân tộc và văn hóa đã trở thành điểm nhấn của diễn đàn. Trong trang phục áo dài truyền thống, nghiên cứu sinh Hồ Minh Nhựt đã giới thiệu về đất nước và văn hóa Việt Nam, đồng thời trình bày ca khúc Nối vòng tay lớn của nhạc sĩ Trịnh Công Sơn với phần lời được dịch sang tiếng Nga. Tiết mục nhận được sự hưởng ứng nhiệt tình của các đại biểu quốc tế, góp phần quảng bá hình ảnh Việt Nam và thể hiện tinh thần đoàn kết, hữu nghị giữa các dân tộc.",
      "Việc tham gia Diễn đàn Thanh niên toàn Nga về Sinh thái học không chỉ tạo cơ hội để đại diện Việt Nam trao đổi học thuật, cập nhật các xu hướng nghiên cứu mới trong lĩnh vực môi trường và phát triển bền vững mà còn góp phần tăng cường giao lưu thanh niên, quảng bá văn hóa Việt Nam và mở rộng hợp tác quốc tế trong lĩnh vực khoa học, giáo dục và bảo vệ môi trường.",
      "Thông tin thêm: Diễn đàn Thanh niên toàn Nga về Sinh thái học",
      "Diễn đàn Thanh niên toàn Nga về Sinh thái học là hoạt động thường niên thuộc hệ thống các diễn đàn thanh niên quốc gia của Liên bang Nga, do Cơ quan Liên bang về Thanh niên (Rosmolodezh) phối hợp với Chính quyền vùng Kamchatka tổ chức. Chương trình hướng tới bồi dưỡng thế hệ lãnh đạo trẻ trong lĩnh vực môi trường, biến đổi khí hậu và phát triển bền vững, đồng thời tạo diễn đàn kết nối các nhà khoa học trẻ, chuyên gia và thanh niên đến từ Nga và nhiều quốc gia trên thế giới. Diễn đàn kết hợp giữa đào tạo học thuật, nghiên cứu thực địa, xây dựng sáng kiến và giao lưu văn hóa, qua đó thúc đẩy hợp tác quốc tế trong lĩnh vực sinh thái học và bảo vệ môi trường.",
      "(nội dung và ảnh của bài viết do nhân vật cung cấp)"
    ],
    "sources": []
  },
  {
    "id": 33,
    "title": "NGA PHÁT TRIỂN GẦN 110 TUYẾN DU LỊCH KHOA HỌC NHẰM KHƠI DẬY ĐAM MÊ NGHIÊN CỨU TRONG GIỚI TRẺ",
    "summary": "Các tuyến du lịch được thiết kế theo hình thức trải nghiệm học thuật, kết hợp tham quan với các hoạt động giáo dục và phổ biến khoa học. Người tham gia có cơ hội tiếp cận trực tiếp các phòng thí nghiệm, trung tâm nghiên cứu, đài thiên văn, cung thiên văn, bảo tàng khoa học, công viên công nghệ và các cơ sở sản xuất công nghệ cao. Theo ông Dmitry Chernyshenko, sau hơn hai năm triển khai, chương trình đã bổ sung thêm hơn 30 tuyến mới, phản ánh nhu cầu ngày càng tăng đối với loại hình du lịch kết hợp giáo dục này.",
    "category": "society",
    "date": "08/2026",
    "image": "https://res.cloudinary.com/dwjqosrrk/image/upload/v1788169176/vnru/news/official-1d2dc0c8-8651-4bfd-abf0-377c756e1338.webp",
    "body": [
      "Phó Thủ tướng Liên bang Nga Dmitry Chernyshenko cho biết, trong khuôn khổ Thập kỷ Khoa học và Công nghệ (2022–2031), Nga đã xây dựng gần 110 tuyến du lịch khoa học tại 35 chủ thể liên bang, góp phần đưa khoa học đến gần hơn với công chúng, đặc biệt là thanh thiếu niên và sinh viên. Chương trình được triển khai theo chỉ đạo của Tổng thống Vladimir Putin, hướng tới khơi dậy niềm yêu thích nghiên cứu khoa học và đổi mới sáng tạo trong thế hệ trẻ.",
      "Các tuyến du lịch được thiết kế theo hình thức trải nghiệm học thuật, kết hợp tham quan với các hoạt động giáo dục và phổ biến khoa học. Người tham gia có cơ hội tiếp cận trực tiếp các phòng thí nghiệm, trung tâm nghiên cứu, đài thiên văn, cung thiên văn, bảo tàng khoa học, công viên công nghệ và các cơ sở sản xuất công nghệ cao. Theo ông Dmitry Chernyshenko, sau hơn hai năm triển khai, chương trình đã bổ sung thêm hơn 30 tuyến mới, phản ánh nhu cầu ngày càng tăng đối với loại hình du lịch kết hợp giáo dục này.",
      "Bộ trưởng Khoa học và Giáo dục đại học Nga Valery Falkov cho biết du lịch khoa học phát triển mạnh nhất tại những địa phương có hệ thống trường đại học, viện nghiên cứu và hạ tầng khoa học phát triển. Hiện nay, Cơ sở dữ liệu toàn quốc về các điểm đến du lịch khoa học do Bộ quản lý đã có hơn 1.300 địa điểm mở cửa đón khách tham quan, tạo điều kiện để công chúng trực tiếp tìm hiểu hoạt động nghiên cứu và những thành tựu khoa học của Nga.",
      "Bên cạnh việc phát triển các tuyến tham quan, Bộ Khoa học và Giáo dục đại học Nga cũng phối hợp với các địa phương xây dựng chiến lược phát triển du lịch khoa học. Năm 2025, lần đầu tiên Nga tổ chức chương trình tăng tốc dành cho các địa phương nhằm hỗ trợ xây dựng sản phẩm du lịch khoa học, với sự tham gia của 57 chủ thể liên bang. Đến nay, Saint Petersburg, các nước cộng hòa Tuva, Bashkortostan, Sakha cùng các vùng Krasnodar, Krasnoyarsk, Perm, Stavropol, Amur, Arkhangelsk, Irkutsk, Nizhny Novgorod, Ryazan, Samara và Tambov là những địa phương dẫn đầu trong phát triển loại hình du lịch này.",
      "Thông tin thêm: Chương trình \"Du lịch khoa học\"",
      "Chương trình \"Du lịch khoa học\" được triển khai từ năm 2022 trong khuôn khổ Thập kỷ Khoa học và Công nghệ Liên bang Nga (2022–2031). Mục tiêu của chương trình là thu hút thanh thiếu niên tham gia nghiên cứu khoa học, nâng cao hiểu biết của xã hội về các thành tựu khoa học - công nghệ của Nga và tăng cường kết nối giữa các cơ sở nghiên cứu với cộng đồng.",
      "Khác với du lịch truyền thống, các tuyến du lịch khoa học được xây dựng quanh những cơ sở nghiên cứu, trường đại học, viện hàn lâm, phòng thí nghiệm, trung tâm công nghệ và doanh nghiệp công nghệ cao. Người tham gia không chỉ tham quan mà còn được trải nghiệm các hoạt động nghiên cứu, giao lưu với các nhà khoa học và tìm hiểu về những công nghệ đang được ứng dụng trong thực tiễn. Từ năm 2025, Nga cũng ban hành Tiêu chuẩn quốc gia (GOST) về du lịch khoa học, tạo cơ sở pháp lý thống nhất cho việc phát triển loại hình du lịch này trên phạm vi toàn quốc."
    ],
    "sources": [
      "https://t.me/minobrnaukiofficial/19677"
    ]
  },
  {
    "id": 34,
    "title": "NGA THÚC ĐẨY PHÁT TRIỂN HẠ TẦNG NGHIÊN CỨU \"MEGA-SCIENCE\" VÀ ỨNG DỤNG AI TRONG KHOA HỌC",
    "summary": "Ngày 11/08/2026, tại thành phố Novosibirsk, Tổng thống Liên bang Nga Vladimir Putin đã chủ trì phiên họp của Hội đồng về Khoa học và Giáo dục, tập trung thảo luận các giải pháp hiện đại hóa hạ tầng nghiên cứu quốc gia, phát triển các tổ hợp nghiên cứu quy mô lớn (mega-science) và thúc đẩy ứng dụng trí tuệ nhân tạo (AI) trong hoạt động khoa học.",
    "category": "science",
    "date": "11/08/2026",
    "image": null,
    "body": [
      "Ngày 11/08/2026, tại thành phố Novosibirsk, Tổng thống Liên bang Nga Vladimir Putin đã chủ trì phiên họp của Hội đồng về Khoa học và Giáo dục, tập trung thảo luận các giải pháp hiện đại hóa hạ tầng nghiên cứu quốc gia, phát triển các tổ hợp nghiên cứu quy mô lớn (mega-science) và thúc đẩy ứng dụng trí tuệ nhân tạo (AI) trong hoạt động khoa học.",
      "Phát biểu tại phiên họp, Tổng thống Vladimir Putin nhấn mạnh các dự án nghiên cứu quy mô lớn đang góp phần hình thành hệ thống hạ tầng khoa học, giáo dục và xã hội hiện đại tại nhiều địa phương. Theo ông, các cơ sở nghiên cứu này cần được khai thác theo cơ chế mở, tạo điều kiện để các nhà khoa học, giảng viên, sinh viên, trường đại học và viện nghiên cứu trên cả nước cùng tiếp cận và sử dụng. Tổng thống cũng khẳng định việc tập trung nguồn lực của các trường đại học, viện nghiên cứu, doanh nghiệp và các tập đoàn công nghệ là yếu tố quyết định để tạo ra những đột phá khoa học.",
      "Trước khi diễn ra phiên họp, Tổng thống Putin đã thăm Trung tâm sử dụng chung \"Nguồn photon vòng tròn Siberia\" (SKIF) – một trong những dự án mega-science trọng điểm của Nga. Ông đánh giá SKIF là một trong những máy gia tốc hạt mạnh nhất thế giới hiện nay, thậm chí ở một số thông số kỹ thuật còn chưa có công trình tương đương. Theo kế hoạch, những trạm nghiên cứu đầu tiên của tổ hợp sẽ được đưa vào vận hành trước cuối năm 2026.",
      "Tại phiên họp, Bộ trưởng Khoa học và Giáo dục đại học Valery Falkov cho rằng việc phát triển các tổ hợp mega-science đòi hỏi một thế hệ nhân lực mới có khả năng thiết kế, vận hành và khai thác các hệ thống nghiên cứu hiện đại. Theo đó, sự tham gia của các trường đại học vào các dự án mega-science cần trở thành một trong những tiêu chí đánh giá chất lượng cơ sở giáo dục đại học. Ông cho biết Đại học Quốc gia Novosibirsk hiện đã triển khai chương trình đào tạo về các phương pháp nghiên cứu synchrotron và mô hình này sẽ tiếp tục được mở rộng tại nhiều trường đại học khác.",
      "Bộ trưởng cũng đề xuất cập nhật các tiêu chí xác định dự án mega-science phù hợp với bối cảnh phát triển khoa học hiện nay, đồng thời nhấn mạnh yêu cầu tăng cường ứng dụng trí tuệ nhân tạo trong nghiên cứu nhưng phải bảo đảm chất lượng dữ liệu và xây dựng các cơ chế kiểm chứng thông tin khoa học nhằm hạn chế những kết quả nghiên cứu thiếu tin cậy.",
      "Phó Thủ tướng Dmitry Chernyshenko cho biết Chính phủ Nga đang triển khai chương trình thí điểm \"AI trong khoa học\" trên 9 lĩnh vực thuộc các dự án quốc gia về phát triển công nghệ, với sự tham gia của các doanh nghiệp công nghệ hàng đầu như Sber, Yandex và T-Bank. Chính phủ cũng đặt mục tiêu số hóa toàn bộ dữ liệu khoa học của Nga để xây dựng kho dữ liệu dùng chung phục vụ đào tạo các mô hình AI quốc gia.",
      "Theo đề xuất của Phó Thủ tướng, Trung tâm SKIF sẽ là cơ sở nghiên cứu đầu tiên ứng dụng AI trong quản lý và khai thác các tổ hợp mega-science. Đồng thời, Nga sẽ phát triển hạ tầng AI khoa học dựa trên Mạng máy tính nghiên cứu quốc gia do Viện Kurchatov quản lý, giúp các nhà khoa học được truy cập miễn phí vào tài nguyên tính toán của các trường đại học, viện nghiên cứu và doanh nghiệp công nghệ trên toàn quốc. Hiện nhiều nền tảng AI hỗ trợ nghiên cứu như AI for Science của Sber, iFORA của Trường Đại học Kinh tế Quốc dân (HSE) hay Talisman của Viện Hàn lâm Khoa học Nga đã được đưa vào sử dụng.",
      "Thông tin thêm: Hạ tầng nghiên cứu \"mega-science\" của Nga",
      "Các tổ hợp nghiên cứu mega-science là những cơ sở hạ tầng khoa học quy mô đặc biệt lớn, sử dụng các thiết bị nghiên cứu hiện đại như máy gia tốc hạt, nguồn bức xạ synchrotron, nguồn neutron và các tổ hợp nghiên cứu vật lý năng lượng cao. Đây là nền tảng để thực hiện các nghiên cứu tiên phong trong vật lý, hóa học, vật liệu mới, sinh học, y học và công nghệ cao.",
      "Nga hiện đang triển khai một số dự án mega-science trọng điểm như SKIF tại Novosibirsk và NICA tại Dubna, đồng thời coi đây là một trong những trụ cột của chiến lược phát triển khoa học và công nghệ quốc gia. Bên cạnh đầu tư hạ tầng, Chính phủ Nga cũng ưu tiên đào tạo nguồn nhân lực chất lượng cao, thúc đẩy hợp tác giữa các trường đại học, viện nghiên cứu và doanh nghiệp, cũng như ứng dụng trí tuệ nhân tạo nhằm nâng cao hiệu quả nghiên cứu và rút ngắn thời gian tạo ra các kết quả khoa học có giá trị."
    ],
    "sources": [
      "https://t.me/minobrnaukiofficial/19765,",
      "https://t.me/minobrnaukiofficial/19764,",
      "https://t.me/minobrnaukiofficial/19771"
    ]
  },
  {
    "id": 35,
    "title": "TRƯỜNG ĐẠI HỌC QUẢNG BÌNH THÚC ĐẨY HỢP TÁC VỚI ĐẠI HỌC TỔNG HỢP LENINGRAD PUSHKIN",
    "summary": "Ngày 6/8/2026, Trường Đại học Quảng Bình đã tổ chức cuộc họp trực tuyến với Đại học Tổng hợp Leningrad Pushkin (Pushkin Leningrad State University – PLSU), Liên bang Nga, nhằm trao đổi các định hướng hợp tác trong đào tạo, nghiên cứu khoa học và quốc tế hóa giáo dục. Cuộc họp còn có sự tham dự của đại diện Ủy ban Giáo dục phổ thông và giáo dục nghề nghiệp tỉnh Leningrad cùng Ủy ban Quan hệ đối ngoại tỉnh Leningrad, thể hiện sự quan tâm của chính quyền địa phương Nga đối với việc mở rộng hợp tác giáo dục với Việt Nam.",
    "category": "education",
    "date": "06/08/2026",
    "image": null,
    "body": [
      "Ngày 6/8/2026, Trường Đại học Quảng Bình đã tổ chức cuộc họp trực tuyến với Đại học Tổng hợp Leningrad Pushkin (Pushkin Leningrad State University – PLSU), Liên bang Nga, nhằm trao đổi các định hướng hợp tác trong đào tạo, nghiên cứu khoa học và quốc tế hóa giáo dục. Cuộc họp còn có sự tham dự của đại diện Ủy ban Giáo dục phổ thông và giáo dục nghề nghiệp tỉnh Leningrad cùng Ủy ban Quan hệ đối ngoại tỉnh Leningrad, thể hiện sự quan tâm của chính quyền địa phương Nga đối với việc mở rộng hợp tác giáo dục với Việt Nam.",
      "Phát biểu tại cuộc họp, Hiệu trưởng Trường Đại học Quảng Bình PGS.TS. Nguyễn Đức Vượng khẳng định việc mở rộng hợp tác với các cơ sở giáo dục đại học uy tín của Liên bang Nga là một trong những định hướng quan trọng nhằm nâng cao chất lượng đào tạo, nghiên cứu khoa học và hội nhập quốc tế của nhà trường. Về phía Nga, bà Irina Kirillova, Chủ tịch Ủy ban Giáo dục phổ thông và giáo dục nghề nghiệp tỉnh Leningrad, nhấn mạnh tỉnh Leningrad luôn coi trọng việc phát triển quan hệ đối tác với Việt Nam trên nền tảng truyền thống hợp tác lâu đời giữa hai nước, đồng thời bày tỏ sẵn sàng mở rộng các chương trình trao đổi học thuật và dự án hợp tác chung trong bối cảnh ngày càng có nhiều thanh niên Việt Nam quan tâm đến tiếng Nga và văn hóa Nga.",
      "Tại buổi làm việc, hai trường đã giới thiệu về quá trình phát triển, thế mạnh đào tạo và định hướng quốc tế hóa. Hai bên thống nhất sẽ ưu tiên thúc đẩy hợp tác trong các lĩnh vực như đào tạo du học sinh Việt Nam, trao đổi giảng viên và sinh viên, triển khai các đề tài nghiên cứu chung, tổ chức hội thảo khoa học quốc tế và chia sẻ kinh nghiệm quản trị đại học. Đặc biệt, hai trường đã cơ bản thống nhất nội dung Biên bản ghi nhớ hợp tác (MoU) và lộ trình hoàn thiện các thủ tục để tiến tới ký kết chính thức trong thời gian tới.",
      "Nhân dịp này, Trường Đại học Quảng Bình cũng mời đoàn đại biểu Đại học Tổng hợp Leningrad Pushkin tham dự Hội nghị khoa học quốc tế dự kiến tổ chức vào tháng 10 tới tại tỉnh Quảng Trị. Theo phía Nga, sau khi ký kết, Đại học Tổng hợp Leningrad Pushkin sẽ trở thành trường đại học đầu tiên của Liên bang Nga thiết lập quan hệ đối tác chính thức với Trường Đại học Quảng Bình, mở ra triển vọng hợp tác lâu dài trong đào tạo, nghiên cứu và trao đổi học thuật.",
      "Cuộc làm việc cũng diễn ra trong bối cảnh Ủy ban Quan hệ đối ngoại tỉnh Leningrad đang chuẩn bị ký kết thỏa thuận hợp tác với tỉnh Quảng Trị nhân chuyến thăm Việt Nam sắp tới của Thống đốc tỉnh Leningrad Alexander Drozdenko. Theo phía Nga, hợp tác giáo dục sẽ là một trong những nội dung quan trọng góp phần củng cố quan hệ giữa hai địa phương, bên cạnh các lĩnh vực logistics cảng biển, thu hút đầu tư và phát triển nông nghiệp công nghệ cao.",
      "Thông tin thêm: Đại học Tổng hợp Leningrad Pushkin",
      "Được thành lập năm 1992, Đại học Tổng hợp Leningrad Pushkin (PLSU) là một trong những trường đại học đa ngành lớn của khu vực Tây Bắc Liên bang Nga, trực thuộc tỉnh Leningrad. Trường hiện đào tạo khoảng 15.000 sinh viên với hơn 50 chương trình đại học và sau đại học thuộc 11 khoa, bao gồm khoa học tự nhiên, khoa học xã hội, giáo dục, ngoại ngữ, luật, kinh tế, tâm lý học và công nghệ thông tin. PLSU đồng thời là trung tâm nghiên cứu khoa học và hợp tác quốc tế năng động, duy trì hơn 50 thỏa thuận hợp tác với các trường đại học và tổ chức giáo dục trên thế giới."
    ],
    "sources": [
      "https://kvs.lenobl.ru/ru/news/97257/",
      "https://brief24.ru/lenobl/2026/8/7/294919",
      "https://qbu.edu.vn/2026/08/truong-dai-hoc-quang-binh-lam-viec-truc-tuyen-voi-truong-dai-hoc-tong-hop-leningrad-pushkin-lien-bang-nga/"
    ]
  },
  {
    "id": 36,
    "title": "HƠN 160.000 THÍ SINH QUỐC TẾ ĐĂNG KÝ DU HỌC TẠI NGA TRONG NĂM 2026",
    "summary": "Theo số liệu do Cơ quan Hợp tác Liên bang Nga (Rossotrudnichestvo) công bố, tính đến đầu tháng 7/2026, hệ thống Education in Russia – cổng thông tin \"một cửa\" tiếp nhận hồ sơ tuyển sinh của các trường đại học Nga – đã ghi nhận hơn 160.000 lượt đăng ký của thí sinh quốc tế, tăng so với 144.000 lượt của cùng kỳ năm 2025. Kết quả này cho thấy sức hấp dẫn ngày càng lớn của giáo dục đại học Nga đối với sinh viên quốc tế.",
    "category": "education",
    "date": "07/20/2026",
    "image": null,
    "body": [
      "Theo số liệu do Cơ quan Hợp tác Liên bang Nga (Rossotrudnichestvo) công bố, tính đến đầu tháng 7/2026, hệ thống Education in Russia – cổng thông tin \"một cửa\" tiếp nhận hồ sơ tuyển sinh của các trường đại học Nga – đã ghi nhận hơn 160.000 lượt đăng ký của thí sinh quốc tế, tăng so với 144.000 lượt của cùng kỳ năm 2025. Kết quả này cho thấy sức hấp dẫn ngày càng lớn của giáo dục đại học Nga đối với sinh viên quốc tế.",
      "Phó Giám đốc Rossotrudnichestvo Pavel Shevtsov cho biết mục tiêu nâng số lượng sinh viên quốc tế học tập tại Nga lên 500.000 người vào năm 2030 là một thách thức lớn, song hoàn toàn khả thi. Ông nhấn mạnh Nga không chỉ hướng đến tăng số lượng mà còn chú trọng thu hút những thí sinh có năng lực và động lực học tập cao, qua đó nâng cao chất lượng nguồn nhân lực quốc tế được đào tạo tại các trường đại học Nga.",
      "Một trong những giải pháp đang được thúc đẩy là mở rộng các chương trình đào tạo bằng ngoại ngữ, đặc biệt là tiếng Anh. Theo mô hình này, sinh viên quốc tế có thể bắt đầu chương trình học bằng tiếng Anh, đồng thời tiếp tục học tiếng Nga trong suốt quá trình đào tạo và bảo vệ luận văn bằng tiếng Nga khi tốt nghiệp. Cách tiếp cận này được đánh giá tạo điều kiện thuận lợi hơn so với việc chỉ học tiếng Nga trong một năm dự bị trước khi bước vào chương trình chính khóa.",
      "Các chuyên gia giáo dục Nga cho rằng, cùng với việc phát triển chương trình đào tạo bằng ngoại ngữ, cần đổi mới mô hình đào tạo dự bị, kéo dài quá trình học tiếng Nga xuyên suốt khóa học và tăng cường cung cấp thông tin tuyển sinh bằng nhiều ngôn ngữ. Bên cạnh đó, việc tổ chức các kỳ thi Olympic quốc tế, cấp học bổng toàn phần và triển khai các khóa học tiếng Nga trực tuyến trước khi nhập học cũng được xem là những giải pháp quan trọng nhằm thu hút sinh viên quốc tế có chất lượng.",
      "Theo Bộ Khoa học và Giáo dục đại học Liên bang Nga, đến năm 2025, hơn 400.000 sinh viên quốc tế đang theo học tại các trường đại học Nga, tăng đáng kể so với 376.000 sinh viên của năm 2024. Sinh viên quốc tế chủ yếu theo học các ngành y khoa, kỹ thuật, xây dựng và năng lượng hạt nhân. Ngoài Moskva và Saint Petersburg, nhiều trung tâm đào tạo lớn như Tomsk, Novosibirsk, Krasnoyarsk, Voronezh và Nizhny Novgorod cũng ngày càng thu hút đông đảo sinh viên quốc tế, trong đó có sinh viên đến từ Việt Nam.",
      "Thông tin thêm: Cổng tuyển sinh Education in Russia",
      "Education in Russia là cổng thông tin tuyển sinh quốc tế chính thức do Rossotrudnichestvo vận hành, đóng vai trò là hệ thống \"một cửa\" tiếp nhận hồ sơ của thí sinh nước ngoài đăng ký học tại các cơ sở giáo dục đại học của Liên bang Nga. Thông qua hệ thống này, thí sinh có thể tìm hiểu chương trình đào tạo, nộp hồ sơ trực tuyến và đăng ký xét tuyển theo diện học bổng Chính phủ Nga hoặc diện tự túc.",
      "Việc mở rộng quy mô tuyển sinh quốc tế là một trong những ưu tiên của Chiến lược phát triển giáo dục đại học Nga đến năm 2030. Song song với việc tăng số lượng sinh viên quốc tế, Nga đang đẩy mạnh quốc tế hóa chương trình đào tạo, phát triển các khóa học bằng ngoại ngữ, cải tiến chương trình dự bị tiếng Nga và tăng cường hợp tác với các trường đại học, cơ quan đại diện Nga ở nước ngoài nhằm thu hút nguồn nhân lực chất lượng cao trên phạm vi toàn cầu."
    ],
    "sources": [
      "https://www.vedomosti.ru/society/articles/2026/07/09/1212296-v-2026-obuchenie-v-rossii-zainteresovalo-160-000-inostrantsev"
    ]
  },
  {
    "id": 37,
    "title": "HỌC SINH VIỆT NAM CHINH PHỤC BẮC CỰC TRONG DỰ ÁN QUỐC TẾ \"TÀU PHÁ BĂNG TRI THỨC - 2026\"",
    "summary": "Em Nguyễn Đình Trọng Khang, học sinh 16 tuổi đến từ Thành phố Hồ Chí Minh, đã trở thành đại diện duy nhất của Việt Nam giành quyền tham gia dự án quốc tế \"Tàu phá băng Tri thức - 2026\" (Icebreaker of Knowledge) do Tập đoàn Năng lượng nguyên tử quốc gia Nga (Rosatom) tổ chức. Sau quá trình tuyển chọn với gần 5.000 thí sinh đến từ nhiều quốc gia, chỉ 22 học sinh xuất sắc được lựa chọn tham gia chuyến thám hiểm Bắc Cực trên tàu phá băng chạy bằng năng lượng hạt nhân \"50 năm Chiến thắng\".",
    "category": "education",
    "date": "08/2026",
    "image": null,
    "body": [
      "Em Nguyễn Đình Trọng Khang, học sinh 16 tuổi đến từ Thành phố Hồ Chí Minh, đã trở thành đại diện duy nhất của Việt Nam giành quyền tham gia dự án quốc tế \"Tàu phá băng Tri thức - 2026\" (Icebreaker of Knowledge) do Tập đoàn Năng lượng nguyên tử quốc gia Nga (Rosatom) tổ chức. Sau quá trình tuyển chọn với gần 5.000 thí sinh đến từ nhiều quốc gia, chỉ 22 học sinh xuất sắc được lựa chọn tham gia chuyến thám hiểm Bắc Cực trên tàu phá băng chạy bằng năng lượng hạt nhân \"50 năm Chiến thắng\".",
      "Ngay từ khi còn là học sinh trung học, Trọng Khang đã thể hiện niềm đam mê với các lĩnh vực STEM, đặc biệt là trí tuệ nhân tạo (AI) và vật lý lý thuyết. Em đã thực hiện một công trình nghiên cứu về vật lý lý thuyết, triển khai nhiều dự án ứng dụng AI và xây dựng một kênh trên mạng xã hội nhằm chia sẻ với thanh niên về các cơ hội học tập, nghiên cứu và phát triển nghề nghiệp trên thế giới. Bên cạnh thành tích học tập, Khang còn sử dụng thành thạo tiếng Pháp và đạt nhiều thành tích trong các môn võ thuật, bóng rổ và bóng ném.",
      "Đối với Trọng Khang, chuyến thám hiểm Bắc Cực không chỉ là cơ hội khám phá một trong những vùng đất đặc biệt nhất trên thế giới mà còn là dịp giao lưu với những học sinh có thành tích xuất sắc đến từ nhiều quốc gia. Trong hành trình này, em dự định giới thiệu với bạn bè quốc tế về các ứng dụng của trí tuệ nhân tạo, đồng thời truyền cảm hứng để học sinh mạnh dạn tham gia nghiên cứu khoa học từ khi còn ngồi trên ghế nhà trường.",
      "Chia sẻ trước chuyến đi, Trọng Khang cho biết việc trở thành một trong 22 học sinh được lựa chọn là dấu mốc quan trọng nhất trên con đường nghiên cứu khoa học của mình. Em bày tỏ mong muốn được khoác trang phục truyền thống Việt Nam, giương cao quốc kỳ tại 90° vĩ Bắc – điểm cực Bắc địa lý của Trái Đất – như một cách giới thiệu hình ảnh Việt Nam tới bạn bè quốc tế.",
      "Thông tin thêm: Dự án \"Tàu phá băng Tri thức\"",
      "\"Tàu phá băng Tri thức\" (Icebreaker of Knowledge) là dự án giáo dục quốc tế do Rosatom tổ chức hằng năm nhằm bồi dưỡng thế hệ học sinh có năng lực nổi bật trong các lĩnh vực khoa học, công nghệ, kỹ thuật và toán học (STEM). Chương trình đưa các học sinh xuất sắc từ nhiều quốc gia tham gia chuyến thám hiểm Bắc Cực trên tàu phá băng chạy bằng năng lượng hạt nhân \"50 năm Chiến thắng\", kết hợp các hoạt động trải nghiệm, giao lưu quốc tế và học tập về khoa học, công nghệ hạt nhân, biến đổi khí hậu và phát triển bền vững.",
      "Thông qua dự án, Rosatom hướng tới khơi dậy niềm đam mê nghiên cứu khoa học, tăng cường hợp tác quốc tế giữa thanh thiếu niên và tạo cơ hội để các nhà khoa học trẻ tương lai tiếp cận những công nghệ tiên tiến cũng như môi trường nghiên cứu đặc thù của vùng Bắc Cực."
    ],
    "sources": [
      "https://www.facebook.com/share/1Dd8Q75ovC/"
    ]
  },
  {
    "id": 38,
    "title": "NGA KỲ VỌNG TỔ HỢP NGHIÊN CỨU SKIF TẠO RA NHỮNG ĐỘT PHÁ KHOA HỌC TẦM THẾ GIỚI",
    "summary": "Sau chuyến thăm Trung tâm sử dụng chung \"Nguồn photon vòng tròn Siberia\" (SKIF) của Tổng thống Nga Vladimir Putin, giới khoa học Nga đánh giá đây sẽ là một trong những hạ tầng nghiên cứu quan trọng nhất của đất nước, tạo nền tảng cho các phát minh khoa học và công nghệ mang tầm thế giới.",
    "category": "science",
    "date": "08/2026",
    "image": null,
    "body": [
      "Sau chuyến thăm Trung tâm sử dụng chung \"Nguồn photon vòng tròn Siberia\" (SKIF) của Tổng thống Nga Vladimir Putin, giới khoa học Nga đánh giá đây sẽ là một trong những hạ tầng nghiên cứu quan trọng nhất của đất nước, tạo nền tảng cho các phát minh khoa học và công nghệ mang tầm thế giới.",
      "Bộ trưởng Khoa học và Giáo dục đại học Nga Valery Falkov khẳng định việc xây dựng SKIF – nguồn bức xạ synchrotron thế hệ 4+ đầu tiên của Nga – là sự kiện có ý nghĩa đặc biệt đối với nền khoa học quốc gia. Theo ông, chỉ một số rất ít quốc gia trên thế giới có khả năng xây dựng và vận hành các tổ hợp nghiên cứu loại này. Ông bày tỏ tin tưởng SKIF sẽ tạo ra những khám phá khoa học có ý nghĩa toàn cầu, đồng thời trở thành nơi đào tạo thế hệ nhà khoa học và kỹ sư công nghệ cao trong tương lai.",
      "Trong chuyến thị sát, Tổng thống Vladimir Putin đã trực tiếp tìm hiểu nguyên lý hoạt động của SKIF và đánh giá cao tiềm năng ứng dụng của tổ hợp trong nhiều lĩnh vực như vật lý, hóa học, khoa học vật liệu, sinh học, địa chất, khảo cổ học và cổ sinh vật học. Đặc biệt, hệ thống còn có thể hỗ trợ kiểm tra các linh kiện điện tử, phát hiện những vi mạch độc hại hoặc bị cài cắm mà các phương pháp kiểm tra thông thường không thể nhận diện.",
      "Hiệu trưởng Đại học Nghiên cứu Hạt nhân Quốc gia MEPhI Vladimir Shevchenko cho biết trường sẽ tham gia các nghiên cứu về vật liệu mới và công nghệ chẩn đoán tại SKIF, đồng thời đưa sinh viên, nghiên cứu sinh đến thực tập và nghiên cứu khi các trạm nghiên cứu của trung tâm đi vào hoạt động.",
      "Thông tin thêm: SKIF là gì?",
      "SKIF (Siberian Circular Photon Source) là nguồn bức xạ synchrotron thế hệ 4+ đầu tiên của Nga, được xây dựng tại thành phố khoa học Koltsovo (tỉnh Novosibirsk) trong khuôn khổ Chương trình phát triển nghiên cứu synchrotron và neutron của Liên bang Nga đến năm 2030.",
      "Synchrotron là hệ thống máy gia tốc hạt tạo ra các chùm tia X có độ sáng và cường độ cực lớn, cho phép quan sát cấu trúc vật chất ở cấp độ nguyên tử và phân tử mà các thiết bị thông thường không thể thực hiện. Khi hoàn thành, SKIF sẽ là nguồn synchrotron có độ phát xạ thấp nhất thế giới, giúp nghiên cứu các vật liệu mới, chip bán dẫn, pin thế hệ mới, dược phẩm, protein, vật liệu nano, xúc tác hóa học, cũng như phục vụ nghiên cứu trong y sinh, địa chất, khảo cổ học và công nghệ lượng tử. Trung tâm dự kiến có 30 trạm nghiên cứu chuyên ngành, phục vụ hàng nghìn nhà khoa học trong và ngoài nước mỗi năm, được Nga xác định là một trong những dự án \"mega-science\" quan trọng nhất nhằm thúc đẩy năng lực nghiên cứu và đổi mới sáng tạo quốc gia."
    ],
    "sources": [
      "https://share.google/TJl8h3E4XyQOvZoD8"
    ]
  },
  {
    "id": 39,
    "title": "NGA DỰ KIẾN XÂY DỰNG MẠNG LƯỚI CỤM ĐÀO TẠO Y KHOA CÔNG NGHỆ CAO",
    "summary": "Chính phủ Liên bang Nga đang xem xét triển khai mạng lưới các cụm đào tạo y khoa công nghệ cao trên phạm vi toàn quốc nhằm đào tạo thế hệ bác sĩ và nhân viên y tế đáp ứng yêu cầu của nền y học số và công nghệ cao. Mô hình mới sẽ kết hợp đào tạo y khoa truyền thống với thực hành lâm sàng từ sớm và tăng cường các kiến thức liên ngành như trí tuệ nhân tạo (AI), robot y tế, công nghệ sinh học, hệ thống không người lái và phân tích dữ liệu lớn trong y tế.",
    "category": "society",
    "date": "08/2026",
    "image": null,
    "body": [
      "Chính phủ Liên bang Nga đang xem xét triển khai mạng lưới các cụm đào tạo y khoa công nghệ cao trên phạm vi toàn quốc nhằm đào tạo thế hệ bác sĩ và nhân viên y tế đáp ứng yêu cầu của nền y học số và công nghệ cao. Mô hình mới sẽ kết hợp đào tạo y khoa truyền thống với thực hành lâm sàng từ sớm và tăng cường các kiến thức liên ngành như trí tuệ nhân tạo (AI), robot y tế, công nghệ sinh học, hệ thống không người lái và phân tích dữ liệu lớn trong y tế.",
      "Theo định hướng này, các cụm đào tạo sẽ trở thành trung tâm đào tạo nguồn nhân lực y tế thế hệ mới, nơi sinh viên không chỉ được học kiến thức chuyên môn mà còn được trang bị các kỹ năng công nghệ phục vụ chuyển đổi số trong ngành y. Một trong những nguyên tắc cốt lõi của mô hình là tăng thời lượng thực hành tại bệnh viện ngay từ những tháng đầu của khóa học, giúp sinh viên sớm tiếp cận môi trường khám chữa bệnh thực tế.",
      "Mô hình thí điểm hiện được triển khai tại vùng Stavropol, với sự liên kết giữa Viện Y khoa Nevinnomyssk và Trường Cao đẳng Y khoa Bắc Kavkaz. Cụm đào tạo này hiện có hơn 7.000 sinh viên đến từ 38 vùng của Nga. Trong quá trình đào tạo, sinh viên được học với các công nghệ hiện đại như thực tế ảo (VR), trí tuệ nhân tạo, mô hình mô phỏng lâm sàng và bàn giải phẫu 3D \"Pirogov\", đồng thời tham gia thực hành tại bệnh viện, phòng khám và hệ thống cấp cứu ngay từ tháng thứ hai của năm học đầu tiên.",
      "Theo kết quả bước đầu, hơn 50% sinh viên của cụm đào tạo đã có việc làm đúng chuyên ngành trước khi tốt nghiệp. Mô hình cũng đứng đầu toàn Nga về tỷ lệ việc làm của sinh viên tốt nghiệp các trường cao đẳng y tế, trong khi mức lương trung bình của người học sau tốt nghiệp cao hơn khoảng 20% so với mặt bằng chung. Đáng chú ý, trong bối cảnh học phí tại nhiều trường y ở Nga tăng mạnh trong hai năm qua, học phí tại cụm Stavropol năm 2026 lại giảm gần 20%, góp phần mở rộng cơ hội tiếp cận giáo dục y khoa.",
      "Theo các nhà hoạch định chính sách, việc nhân rộng mô hình này sẽ góp phần giảm tình trạng thiếu hụt nhân lực y tế tại các địa phương, đồng thời thu hẹp khoảng cách về chất lượng đào tạo giữa Moskva, Saint Petersburg và các vùng khác của Nga.",
      "Thông tin thêm: Cụm đào tạo y khoa công nghệ cao",
      "Mô hình cụm đào tạo y khoa công nghệ cao hướng tới xây dựng hệ sinh thái đào tạo tích hợp giữa trường đại học, cao đẳng y, bệnh viện và doanh nghiệp công nghệ. Thay vì chỉ đào tạo bác sĩ theo phương thức truyền thống, mô hình mới chú trọng phát triển đội ngũ nhân lực có khả năng làm việc trong môi trường y tế số, thành thạo các công nghệ như AI, robot phẫu thuật, phân tích dữ liệu y tế và công nghệ sinh học.",
      "Đây được xem là một trong những định hướng quan trọng của Nga nhằm hiện đại hóa hệ thống đào tạo nhân lực y tế, đáp ứng nhu cầu phát triển của ngành chăm sóc sức khỏe trong bối cảnh chuyển đổi số và già hóa dân số."
    ],
    "sources": [
      "https://share.google/gKoTcmB8YFDx2tJ9l"
    ]
  },
  {
    "id": 40,
    "title": "Mở đăng ký tham gia Trường học quốc tế \"Studturizm\" tại Việt Nam",
    "summary": "Chương trình Trường học quốc tế \"Studturizm\" sẽ diễn ra từ 21–26/9/2026 tại Đại học Đà Nẵng (Trường Đại học Ngoại ngữ), quy tụ sinh viên, nghiên cứu sinh, giảng viên trẻ và nhà khoa học trẻ của Liên bang Nga tham gia các hoạt động giao lưu học thuật và trải nghiệm văn hóa Việt Nam.",
    "category": "education",
    "date": "26/09/2026",
    "image": null,
    "body": [
      "Chương trình Trường học quốc tế \"Studturizm\" sẽ diễn ra từ 21–26/9/2026 tại Đại học Đà Nẵng (Trường Đại học Ngoại ngữ), quy tụ sinh viên, nghiên cứu sinh, giảng viên trẻ và nhà khoa học trẻ của Liên bang Nga tham gia các hoạt động giao lưu học thuật và trải nghiệm văn hóa Việt Nam.",
      "Trong khuôn khổ chương trình, học viên sẽ gặp gỡ sinh viên Việt Nam, tham gia các lớp học và hội thảo chuyên đề, tìm hiểu ngôn ngữ, văn hóa, truyền thống của Việt Nam, đồng thời tham gia các hoạt động tham quan, làm việc nhóm và trao đổi kinh nghiệm. Một nội dung trọng tâm của chương trình là nâng cao kỹ năng hỗ trợ, hướng dẫn và đồng hành cùng sinh viên quốc tế trong môi trường đại học.",
      "Đối tượng tham gia gồm sinh viên hệ chính quy bậc cử nhân và chuyên gia, nghiên cứu sinh, giảng viên, nhà nghiên cứu dưới 35 tuổi và cựu sinh viên đã tốt nghiệp không quá ba năm. Người tham gia phải từ 18–35 tuổi, có kinh nghiệm hỗ trợ sinh viên quốc tế hoặc tham gia các hoạt động tình nguyện, giao lưu quốc tế và có trình độ tiếng Anh tối thiểu B2.",
      "Sau khi kết thúc chương trình tại Việt Nam, các học viên sẽ tiếp tục triển khai các hoạt động hỗ trợ và giao lưu với sinh viên quốc tế tại chính cơ sở đào tạo của mình ở Nga, góp phần mở rộng mạng lưới hợp tác và giao lưu thanh niên giữa hai nước.",
      "Chương trình được tổ chức trong khuôn khổ Năm Hợp tác Khoa học và Giáo dục Việt Nam – Liên bang Nga, do Chương trình \"Studturizm\" và Đại học Liên bang Viễn Đông (FEFU) phối hợp tổ chức dưới sự bảo trợ của Bộ Khoa học và Giáo dục đại học Liên bang Nga. Thời hạn nhận hồ sơ đăng ký đến ngày 1/9/2026.",
      "Thông tin thêm: Chương trình \"Studturizm\"",
      "Studturizm là chương trình do Bộ Khoa học và Giáo dục đại học Liên bang Nga khởi xướng nhằm thúc đẩy giao lưu học thuật và phát triển du lịch giáo dục giữa các trường đại học. Chương trình tạo điều kiện để sinh viên, nghiên cứu sinh và giảng viên trẻ tham gia các khóa học ngắn hạn, trường hè, trường quốc tế và các hoạt động trải nghiệm văn hóa tại Nga và các nước đối tác, qua đó tăng cường năng lực hội nhập quốc tế, giao lưu liên văn hóa và xây dựng mạng lưới hợp tác giữa các cơ sở giáo dục đại học."
    ],
    "sources": [
      "https://t.me/minobrnaukiofficial/20016"
    ],
    "contentType": "OPPORTUNITY"
  }
] satisfies OfficialNewsArticle[];

export function getOfficialNewsArticle(id: string | number) {
  return OFFICIAL_NEWS.find((article) => String(article.id) === String(id));
}
