import type { Locale } from "@/core/i18n/locale";

type Localized<T> = Record<Locale, T>;

export type Expert = {
  id: string;
  initials: string;
  name: string;
  institution: string;
  country: "VN" | "RU";
  topics: string[];
  publications: string[];
  copy: Localized<{ discipline: string; bio: string; focus: string }>;
};

export type Opportunity = {
  id: string;
  topics: string[];
  relatedExpertIds: string[];
  copy: Localized<{
    title: string;
    summary: string;
    status: string;
    scope: string;
    objective: string;
    conditions: string[];
    timeline: string[];
  }>;
};

export const EXPERTS: Expert[] = [
  {
    id: "nguyen-van-an",
    initials: "NA",
    name: "GS.TS Nguyễn Văn An",
    institution: "Viện Khoa học Vật liệu, VAST",
    country: "VN",
    topics: ["Vật liệu chức năng", "Composite", "Nhiệt độ cao"],
    publications: ["Functional composites for high-temperature environments", "Surface engineering for resilient materials"],
    copy: {
      vi: { discipline: "Vật liệu tiên tiến", bio: "Nghiên cứu vật liệu chức năng, composite và bề mặt kỹ thuật cho các hệ thống làm việc ở điều kiện nhiệt độ cao.", focus: "Kết nối thiết kế vật liệu, đặc trưng vi cấu trúc và thử nghiệm trong môi trường khắc nghiệt." },
      en: { discipline: "Advanced materials", bio: "Researches functional materials, composites and engineered surfaces for systems operating in high-temperature environments.", focus: "Connects materials design, microstructure characterization and testing in extreme environments." },
      ru: { discipline: "Передовые материалы", bio: "Исследует функциональные материалы, композиты и инженерные поверхности для высокотемпературных систем.", focus: "Связывает проектирование материалов, анализ микроструктуры и испытания в экстремальных условиях." },
    },
  },
  {
    id: "elena-kurchatova",
    initials: "EK",
    name: "Prof. Elena Kurchatova",
    institution: "National University of Science and Technology MISIS",
    country: "RU",
    topics: ["Nanomaterials", "Energy storage", "Functional surfaces"],
    publications: ["Nanostructured electrodes for sustainable storage", "Interfaces in multifunctional energy materials"],
    copy: {
      vi: { discipline: "Nano và lưu trữ năng lượng", bio: "Tập trung vào vật liệu nano, bề mặt chức năng và các hướng nghiên cứu liên quan đến hệ thống lưu trữ năng lượng bền vững.", focus: "Phát triển cấu trúc nano và giao diện vật liệu cho thiết bị lưu trữ thế hệ mới." },
      en: { discipline: "Nanomaterials and energy storage", bio: "Focuses on nanomaterials, functional surfaces and research directions for sustainable energy-storage systems.", focus: "Develops nanostructures and material interfaces for next-generation storage devices." },
      ru: { discipline: "Наноматериалы и накопление энергии", bio: "Занимается наноматериалами, функциональными поверхностями и устойчивыми системами накопления энергии.", focus: "Разрабатывает наноструктуры и интерфейсы материалов для накопителей нового поколения." },
    },
  },
  {
    id: "le-thi-mai",
    initials: "LM",
    name: "PGS.TS Lê Thị Mai",
    institution: "Trường Đại học Khoa học Tự nhiên, ĐHQGHN",
    country: "VN",
    topics: ["Khoa học biển", "Viễn thám", "AI & dữ liệu"],
    publications: ["Multisource remote sensing for coastal observation", "Machine learning for marine-data analysis"],
    copy: {
      vi: { discipline: "Khoa học biển và dữ liệu", bio: "Kết hợp viễn thám, phân tích dữ liệu và học máy cho các bài toán quan sát biển và vùng ven bờ.", focus: "Xây dựng tuyến dữ liệu đa nguồn phục vụ nghiên cứu biến động môi trường biển." },
      en: { discipline: "Marine science and data", bio: "Combines remote sensing, data analysis and machine learning for marine and coastal observation.", focus: "Builds multisource data pipelines for studying environmental change in marine systems." },
      ru: { discipline: "Морские науки и данные", bio: "Сочетает дистанционное зондирование, анализ данных и машинное обучение для наблюдения за морем и побережьем.", focus: "Создаёт многоканальные потоки данных для изучения изменений морской среды." },
    },
  },
];

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "ai-scientific-data",
    topics: ["AI", "Dữ liệu khoa học", "Đa ngôn ngữ"],
    relatedExpertIds: ["le-thi-mai", "elena-kurchatova"],
    copy: {
      vi: { title: "Nhóm nghiên cứu chung về AI cho dữ liệu khoa học Việt–Nga", summary: "Tìm nhóm nghiên cứu quan tâm đến tìm kiếm ngữ nghĩa, dữ liệu đa ngôn ngữ và các quy trình phân tích có thể giải thích.", status: "Đang mở", scope: "Việt Nam ↔ Liên bang Nga", objective: "Hình thành nhóm làm việc song phương, thống nhất bộ bài toán tham chiếu và chia sẻ phương pháp đánh giá.", conditions: ["Có hướng nghiên cứu liên quan đến AI hoặc dữ liệu khoa học", "Có đầu mối chuyên môn tham gia trao đổi định kỳ", "Chấp nhận công bố rõ nguồn và giới hạn của dữ liệu minh hoạ"], timeline: ["Tiếp nhận quan tâm · đang mở", "Trao đổi phạm vi · theo nhóm chủ đề", "Hình thành kế hoạch nghiên cứu chung · sau khi hai bên thống nhất"] },
      en: { title: "Joint research group on AI for Vietnam–Russia scientific data", summary: "Seeking teams interested in semantic search, multilingual data and explainable analysis workflows.", status: "Open", scope: "Vietnam ↔ Russian Federation", objective: "Form a bilateral working group, agree on reference problems and share evaluation methods.", conditions: ["Relevant AI or scientific-data research", "A specialist contact available for recurring exchanges", "Clear disclosure of illustrative-data sources and limits"], timeline: ["Expressions of interest · open", "Scope exchange · by topic group", "Joint research plan · after bilateral agreement"] },
      ru: { title: "Совместная группа по ИИ для научных данных России и Вьетнама", summary: "Приглашаются команды, работающие с семантическим поиском, многоязычными данными и объяснимым анализом.", status: "Открыто", scope: "Вьетнам ↔ Российская Федерация", objective: "Сформировать двустороннюю рабочую группу, согласовать эталонные задачи и методы оценки.", conditions: ["Исследования в области ИИ или научных данных", "Эксперт для регулярного обмена", "Прозрачное указание источников и ограничений демонстрационных данных"], timeline: ["Приём интереса · открыт", "Обсуждение масштаба · по темам", "Совместный план · после согласования сторон"] },
    },
  },
  {
    id: "functional-materials",
    topics: ["Vật liệu chức năng", "Composite", "Năng lượng"],
    relatedExpertIds: ["nguyen-van-an", "elena-kurchatova"],
    copy: {
      vi: { title: "Mạng nghiên cứu vật liệu chức năng trong môi trường khắc nghiệt", summary: "Kết nối nhóm nghiên cứu về composite, lớp phủ và vật liệu lưu trữ hoạt động trong điều kiện nhiệt và cơ học phức tạp.", status: "Đang kết nối", scope: "Nhóm nghiên cứu song phương", objective: "Đối sánh năng lực thử nghiệm và xây dựng một chương trình trao đổi phương pháp đặc trưng vật liệu.", conditions: ["Có năng lực tổng hợp, mô phỏng hoặc thử nghiệm vật liệu", "Sẵn sàng chia sẻ quy trình đo ở mức phương pháp", "Không yêu cầu trao đổi dữ liệu hạn chế trong giai đoạn giới thiệu"], timeline: ["Lập bản đồ năng lực · hiện tại", "Phiên chuyên môn · dự kiến theo quý", "Chủ đề chung · xác nhận sau phiên chuyên môn"] },
      en: { title: "Functional-materials network for extreme environments", summary: "Connecting teams working on composites, coatings and storage materials under complex thermal and mechanical conditions.", status: "Connecting", scope: "Bilateral research teams", objective: "Map testing capabilities and establish an exchange program around material-characterization methods.", conditions: ["Materials synthesis, modelling or testing capability", "Willingness to share measurement methods", "No restricted-data exchange during the discovery stage"], timeline: ["Capability mapping · current", "Specialist sessions · planned quarterly", "Joint topic · confirmed after specialist review"] },
      ru: { title: "Сеть функциональных материалов для экстремальных условий", summary: "Объединяет команды по композитам, покрытиям и материалам накопления энергии для сложных термомеханических условий.", status: "Формируется", scope: "Двусторонние исследовательские группы", objective: "Сопоставить испытательные возможности и создать программу обмена методами характеризации.", conditions: ["Компетенции в синтезе, моделировании или испытаниях", "Готовность обмениваться методиками измерений", "Без обмена ограниченными данными на ознакомительном этапе"], timeline: ["Карта компетенций · сейчас", "Экспертные сессии · ежеквартально", "Общая тема · после экспертного обзора"] },
    },
  },
  {
    id: "marine-observation",
    topics: ["Khoa học biển", "Viễn thám", "Dữ liệu mở"],
    relatedExpertIds: ["le-thi-mai"],
    copy: {
      vi: { title: "Tuyến hợp tác quan sát biển bằng dữ liệu đa nguồn", summary: "Trao đổi phương pháp kết hợp ảnh vệ tinh, số liệu quan trắc và mô hình học máy cho nghiên cứu vùng ven bờ.", status: "Thăm dò quan tâm", scope: "Khoa học biển Việt–Nga", objective: "Xác định các bài toán quan sát có thể so sánh và bộ tiêu chí đánh giá chung giữa hai hệ sinh thái nghiên cứu.", conditions: ["Có kinh nghiệm với dữ liệu biển hoặc viễn thám", "Có thể mô tả rõ giấy phép và nguồn dữ liệu", "Ưu tiên phương pháp có khả năng tái lập"], timeline: ["Khảo sát chủ đề · đang thực hiện", "Chia sẻ seminar · sau khi đủ nhóm quan tâm", "Lựa chọn bài toán · theo đồng thuận chuyên môn"] },
      en: { title: "Multisource-data collaboration for marine observation", summary: "Exchange methods combining satellite imagery, observations and machine learning for coastal research.", status: "Exploring interest", scope: "Vietnam–Russia marine science", objective: "Identify comparable observation problems and shared evaluation criteria across both research ecosystems.", conditions: ["Marine-data or remote-sensing experience", "Clear data licensing and provenance", "Preference for reproducible methods"], timeline: ["Topic survey · active", "Shared seminar · after sufficient interest", "Problem selection · by specialist consensus"] },
      ru: { title: "Сотрудничество по многоканальным данным для наблюдения за морем", summary: "Обмен методами объединения спутниковых снимков, наблюдений и машинного обучения для изучения побережья.", status: "Сбор интереса", scope: "Морские науки России и Вьетнама", objective: "Определить сопоставимые задачи наблюдения и общие критерии оценки для двух научных экосистем.", conditions: ["Опыт работы с морскими данными или ДЗЗ", "Понятные лицензии и происхождение данных", "Приоритет воспроизводимых методов"], timeline: ["Опрос тем · идёт", "Общий семинар · после набора групп", "Выбор задачи · экспертным консенсусом"] },
    },
  },
];

export function getExpert(id: string) {
  return EXPERTS.find((expert) => expert.id === id);
}

export function getOpportunity(id: string) {
  return OPPORTUNITIES.find((opportunity) => opportunity.id === id);
}
