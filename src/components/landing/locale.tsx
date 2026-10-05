import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "zh" | "vi";

const en = {
  metaTitle: "ValidMix — Listing polish for Alibaba and Made-in-China",
  nav: { product: "What we fix", method: "How it works", pricing: "Pricing", stories: "Stories" },
  cta: "Score a listing",
  ctaShort: "Score it",
  menuOpen: "Open menu",
  menuClose: "Close menu",
  heroTitle: "We rewrite your product listings.",
  heroSub: "The title, the specs, and the description. Clear enough that a buyer can ask for a quote.",
  points: ["Same model numbers", "Both websites", "You approve every line"],
  featuresKicker: "What we fix",
  featuresTitle: "The parts of a listing buyers actually read",
  featuresIntro:
    "A buyer decides from the title and the spec table. We fill those in so they don’t have to email you for the basics.",
  features: [
    {
      title: "The title",
      body: "Product, size, and certificate go in the title, in that order. A buyer should know what it is without opening the page. We take out the repeated keywords that make it look like spam.",
    },
    {
      title: "The specs",
      body: "Wattage, material, MOQ, voltage, and the other fields that were left blank or filled in with “yes.” Buyers filter on these. An empty field is a reason to skip you.",
    },
    {
      title: "The description",
      body: "Factory notes turned into English a buyer can paste to their boss. Short sentences: what it does, what it does not do, and what is in the box. No “we are a professional manufacturer.”",
    },
    {
      title: "The photos",
      body: "A short shot list: the nameplate, the size next to a ruler, the box, and the certificate. The pictures should match the words, so nothing is a surprise when the goods arrive.",
    },
    {
      title: "The claims",
      body: "We flag exaggerations and certificates that don’t match the product. If the page says CE and the certificate is for a different model, we mark it before a buyer does.",
    },
    {
      title: "Both websites",
      body: "One rewrite, then a version for Alibaba and a version for Made-in-China. The facts stay the same. The fields and the title length follow each site’s form.",
    },
  ],
  featureCta: "Score a listing",
  methodKicker: "How it works",
  methodTitle: "Paste a page. The score shows up here.",
  steps: [
    {
      title: "Paste the link",
      body: "Your site, or the product page on Alibaba, Made-in-China, or the other sites listed above.",
    },
    {
      title: "See the score",
      body: "We open one live ad and mark it. You get the number. Not the rewrite.",
    },
    {
      title: "Order the rewrite",
      body: "Bench or Floor is the rewrite. The score does not include it.",
    },
  ],
  pricingKicker: "Pricing",
  pricingTitle: "Pay for how many listings you rewrite",
  pricingIntro:
    "Bench is 10 listings a month. Floor is the same rate, four times the work: 40 listings. Yearly is ten months. No unlimited plan.",
  monthly: "Monthly",
  annual: "Annual",
  perMonth: "per month",
  perYear: "per year",
  currency: "Currency",
  mostChosen: "Most chosen",
  continue: "Continue with",
  benchBlurb: "10 listings a month. One website.",
  floorBlurb: "40 listings a month. Both websites.",
  benchPoints: [
    "10 listings each month",
    "Alibaba or Made-in-China",
    "Title, specs, and description",
    "A score before and after",
  ],
  floorPoints: [
    "40 listings each month",
    "Both websites, every listing",
    "Search words and a photo list",
    "A list of every change",
  ],
  storiesKicker: "Stories",
  storiesTitle: "Sellers who stopped resending the spec sheet",
  stories: [
    {
      quote:
        "Our Alibaba titles were factory shorthand. After the A60 rewrite, buyers filtered by color temperature and base instead of asking us to resend the spec.",
      name: "Chen Yu",
      role: "Export lead, Ningbo Harbor Lighting",
      where: "Alibaba",
    },
    {
      quote:
        "Half the Made-in-China attributes were blank. We stopped getting “please send specs” and started getting questions about MOQ and lead time.",
      name: "Amina Hassan",
      role: "Founder, Yiwu PackRight",
      where: "Made-in-China",
    },
    {
      quote:
        "We sell the same hardware on both sites. One brief, two formats. The change log is the document our factory actually follows.",
      name: "Lukas Berger",
      role: "Sales, Rhine & Pearl Trading",
      where: "Both marketplaces",
    },
  ],
  finalTitle: "Paste your site. Get the score.",
  finalBody:
    "We open the ad and show the score on this page. We do not tell you how to rewrite it. That is Bench or Floor.",
  footer:
    "We rewrite product listings for sellers on Alibaba and Made-in-China. Not part of either company.",
  form: {
    link: "Your site or the ad",
    linkPlaceholder: "https://yourfactory.com",
    button: "Score the ad",
    scoring: "Opening the ad…",
    helper: "We open the ad and put the score here. If the site blocks that, paste the title and specs. The rewrite is not included.",
    linkMissing: "Paste your site or a product page.",
    linkBad: "That link does not look complete.",
    blocked: "That site blocks an automatic open. Paste the title and the spec table from the ad.",
    paste: "Title and specs from the ad",
    pastePlaceholder: "Paste the title, then the spec rows.",
    pasteButton: "Score this text",
    pasteShort: "Paste more of the ad. A title alone is not enough.",
    pasteHelp: "We score the text you paste. The rewrite is not included.",
    notListing: "That page is not a product ad. Paste the product page.",
    failed: "The score did not come back. Try again.",
    unavailable: "Scoring is not available right now.",
    busy: "Too many scores at once. Try again in a minute.",
    change: "Score a different page",
    scored: "Scored this ad",
    scoreOnly: "This is the score. It does not include the rewrite.",
    outOf: "out of 100",
    marks: {
      title: "Title",
      specs: "Specs",
      description: "Description",
      photos: "Photos",
      claims: "Claims",
    },
  },
  demo: {
    productTitle: "Product title",
    productName: "Product name",
    messy: "Messy version",
    deleting: "Deleting the messy title",
    typing: "Typing the rewrite",
    rewritten: "Rewritten version",
    restoring: "Putting the messy title back",
    noteDraftAli: "Keyword-stuffed title. Required attributes are empty, so buyers cannot filter or quote.",
    noteGoodAli: "A searchable spec title. Attributes match the filters buyers actually use.",
    noteDraftMic: "The Made-in-China spec table is too vague for a purchasing shortlist.",
    noteGoodMic: "A specification table a buyer can paste straight into an RFQ.",
  },
};

type Copy = typeof en;

const zh: Copy = {
  metaTitle: "ValidMix — 改写阿里巴巴和中国制造网的产品详情",
  nav: { product: "我们改什么", method: "怎么做", pricing: "价格", stories: "客户怎么说" },
  cta: "给广告打分",
  ctaShort: "打分",
  menuOpen: "打开菜单",
  menuClose: "关闭菜单",
  heroTitle: "我们改写你的产品详情。",
  heroSub: "标题、参数和描述。清楚到买家可以直接询价。",
  points: ["型号保持不变", "两个网站都做", "每一行你来确认"],
  featuresKicker: "我们改什么",
  featuresTitle: "买家真正会看的那几块",
  featuresIntro: "买家看标题和参数表就决定要不要问。我们把这些填好，省得他们再发邮件问基本情况。",
  features: [
    {
      title: "标题",
      body: "产品、尺寸、证书按这个顺序写进标题。买家不点开页面也该知道这是什么。重复堆砌的关键词我们会删掉。",
    },
    {
      title: "参数",
      body: "功率、材质、起订量、电压，还有那些空着或只写了“是”的栏。买家靠这些筛选。空栏就是跳过你的理由。",
    },
    {
      title: "描述",
      body: "把工厂笔记写成买家能直接转给上司的英文。短句：做什么、不做什么、箱子里有什么。不写“我们是专业厂家”。",
    },
    {
      title: "图片",
      body: "一份短拍摄清单：铭牌、尺子旁边的尺寸、外箱、证书。照片要和文字一致，货到了才不会意外。",
    },
    {
      title: "宣传",
      body: "我们标出夸大的说法，以及和产品对不上的证书。页面写着 CE，证书却是另一个型号，我们会先标出来。",
    },
    {
      title: "两个网站",
      body: "改写一次，再出一版给阿里巴巴、一版给中国制造网。事实不变。栏位和标题长度按各自的表来。",
    },
  ],
  featureCta: "给一条详情打分",
  methodKicker: "怎么做",
  methodTitle: "贴一个页面。分数就出在这里。",
  steps: [
    { title: "贴链接", body: "你的网站，或者阿里巴巴、中国制造网，以及上面列出的其他网站上的产品页。" },
    { title: "看分数", body: "我们打开一条正在上架的广告并打分。你看到的是分数，不是改写。" },
    { title: "订改写", body: "改写是 Bench 或 Floor。分数里不含改写。" },
  ],
  pricingKicker: "价格",
  pricingTitle: "按你要改的条数付钱",
  pricingIntro: "Bench 每月 10 条。Floor 是同样的单价、四倍的量：每月 40 条。年付按十个月算。没有不限量方案。",
  monthly: "按月",
  annual: "按年",
  perMonth: "每月",
  perYear: "每年",
  currency: "货币",
  mostChosen: "最多人订",
  continue: "选择",
  benchBlurb: "每月 10 条。一个网站。",
  floorBlurb: "每月 40 条。两个网站。",
  benchPoints: ["每月 10 条详情", "阿里巴巴或中国制造网", "标题、参数和描述", "改前改后各有一个分数"],
  floorPoints: ["每月 40 条详情", "每条都出两个网站的版本", "搜索词和拍照清单", "每一处修改都有记录"],
  storiesKicker: "客户怎么说",
  storiesTitle: "不用再反复发送规格书的卖家",
  stories: [
    {
      quote: "我们阿里巴巴的标题是工厂内部说法。A60 改完之后，买家按色温和灯头筛选，不再让我们重发规格。",
      name: "陈宇",
      role: "出口负责人，宁波港湾照明",
      where: "阿里巴巴",
    },
    {
      quote: "中国制造网一半的属性是空的。后来不再收到“请发参数”，开始收到起订量和交期的问题。",
      name: "Amina Hassan",
      role: "创始人，义乌 PackRight",
      where: "中国制造网",
    },
    {
      quote: "同一款五金我们两个网站都卖。一份资料，两种格式。修改记录才是工厂真正照着做的文件。",
      name: "Lukas Berger",
      role: "销售，Rhine & Pearl Trading",
      where: "两个平台",
    },
  ],
  finalTitle: "贴上你的网站。分数出来。",
  finalBody: "我们打开广告，把分数显示在这个页面上。我们不告诉你怎么改。改写是 Bench 或 Floor。",
  footer: "我们为在阿里巴巴和中国制造网开店的卖家改写产品详情。与这两家公司没有关系。",
  form: {
    link: "你的网站或那条广告",
    linkPlaceholder: "https://yourfactory.com",
    button: "给这条广告打分",
    scoring: "正在打开广告…",
    helper: "我们打开广告，把分数显示在这里。如果网站拦住了，就把标题和参数贴过来。不含改写。",
    linkMissing: "请贴上你的网站或产品页。",
    linkBad: "这个链接看起来不完整。",
    blocked: "这个网站不让自动打开。请把广告上的标题和参数表贴过来。",
    paste: "广告上的标题和参数",
    pastePlaceholder: "先贴标题，再贴参数。",
    pasteButton: "给这段文字打分",
    pasteShort: "再多贴一点。光有标题不够。",
    pasteHelp: "我们给这段文字打分。不含改写。",
    notListing: "这个页面不是产品广告。请贴产品页。",
    failed: "分数没有出来。请再试一次。",
    unavailable: "现在没法打分。",
    busy: "同时打分的人太多。过一分钟再试。",
    change: "换一页再打分",
    scored: "打分的是这条广告",
    scoreOnly: "这是分数。不含改写。",
    outOf: "满分 100",
    marks: {
      title: "标题",
      specs: "参数",
      description: "描述",
      photos: "图片",
      claims: "宣传",
    },
  },
  demo: {
    productTitle: "产品标题",
    productName: "产品名称",
    messy: "改之前",
    deleting: "正在删掉乱写的标题",
    typing: "正在打出改好的标题",
    rewritten: "改好的版本",
    restoring: "正在放回乱写的标题",
    noteDraftAli: "标题在堆关键词。必填属性是空的，买家没法筛选，也没法询价。",
    noteGoodAli: "标题里有可搜索的规格。属性和买家真正用的筛选项一致。",
    noteDraftMic: "中国制造网的参数表太含糊，进不了采购的候选名单。",
    noteGoodMic: "一张买家能直接贴进询价单的参数表。",
  },
};

const vi: Copy = {
  metaTitle: "ValidMix — Viết lại trang sản phẩm trên Alibaba và Made-in-China",
  nav: { product: "Chúng tôi sửa gì", method: "Cách làm", pricing: "Giá", stories: "Khách nói gì" },
  cta: "Chấm một trang",
  ctaShort: "Chấm điểm",
  menuOpen: "Mở menu",
  menuClose: "Đóng menu",
  heroTitle: "Chúng tôi viết lại trang sản phẩm của bạn.",
  heroSub: "Tiêu đề, thông số và mô tả. Rõ đến mức người mua có thể hỏi giá.",
  points: ["Giữ nguyên mã hàng", "Cả hai website", "Bạn duyệt từng dòng"],
  featuresKicker: "Chúng tôi sửa gì",
  featuresTitle: "Những phần người mua thực sự đọc",
  featuresIntro:
    "Người mua quyết định từ tiêu đề và bảng thông số. Chúng tôi điền những chỗ đó để họ không phải gửi email hỏi phần cơ bản.",
  features: [
    {
      title: "Tiêu đề",
      body: "Tên hàng, kích thước và chứng nhận đi vào tiêu đề, theo thứ tự đó. Người mua phải biết đó là gì mà không cần mở trang. Chúng tôi bỏ từ khóa lặp lại cho đỡ giống thư rác.",
    },
    {
      title: "Thông số",
      body: "Công suất, chất liệu, số lượng tối thiểu, điện áp, và những ô để trống hoặc chỉ ghi “có”. Người mua lọc theo các ô này. Ô trống là lý do để họ bỏ qua bạn.",
    },
    {
      title: "Mô tả",
      body: "Ghi chú xưởng được viết thành tiếng Anh mà người mua có thể gửi cho sếp. Câu ngắn: làm được gì, không làm được gì, trong thùng có gì. Không viết “chúng tôi là nhà sản xuất chuyên nghiệp”.",
    },
    {
      title: "Ảnh",
      body: "Một danh sách chụp ngắn: biển tên, kích thước cạnh thước kẻ, thùng, và chứng nhận. Ảnh phải khớp chữ, để khi hàng tới không có gì bất ngờ.",
    },
    {
      title: "Lời quảng cáo",
      body: "Chúng tôi đánh dấu câu phóng đại và chứng nhận không đúng sản phẩm. Trang ghi CE mà giấy chứng nhận là model khác, chúng tôi đánh dấu trước khi người mua thấy.",
    },
    {
      title: "Cả hai website",
      body: "Viết lại một lần, rồi một bản cho Alibaba và một bản cho Made-in-China. Sự thật không đổi. Ô và độ dài tiêu đề theo form của từng trang.",
    },
  ],
  featureCta: "Chấm một trang",
  methodKicker: "Cách làm",
  methodTitle: "Dán một trang. Điểm hiện ngay tại đây.",
  steps: [
    {
      title: "Dán link",
      body: "Website của bạn, hoặc trang sản phẩm trên Alibaba, Made-in-China, hay các trang liệt kê ở trên.",
    },
    {
      title: "Xem điểm",
      body: "Chúng tôi mở một trang đang bán và chấm. Bạn nhận được điểm. Không phải bản viết lại.",
    },
    {
      title: "Đặt bản viết lại",
      body: "Bench hoặc Floor mới là bản viết lại. Điểm không kèm bản đó.",
    },
  ],
  pricingKicker: "Giá",
  pricingTitle: "Trả theo số trang bạn muốn viết lại",
  pricingIntro:
    "Bench là 10 trang mỗi tháng. Floor là cùng đơn giá, gấp bốn lần việc: 40 trang. Trả năm tính mười tháng. Không có gói không giới hạn.",
  monthly: "Theo tháng",
  annual: "Theo năm",
  perMonth: "mỗi tháng",
  perYear: "mỗi năm",
  currency: "Tiền tệ",
  mostChosen: "Được chọn nhiều",
  continue: "Chọn",
  benchBlurb: "10 trang mỗi tháng. Một website.",
  floorBlurb: "40 trang mỗi tháng. Cả hai website.",
  benchPoints: [
    "10 trang mỗi tháng",
    "Alibaba hoặc Made-in-China",
    "Tiêu đề, thông số và mô tả",
    "Điểm trước và sau khi sửa",
  ],
  floorPoints: [
    "40 trang mỗi tháng",
    "Mỗi trang có bản cho cả hai website",
    "Từ khóa tìm kiếm và danh sách ảnh",
    "Danh sách từng chỗ đã sửa",
  ],
  storiesKicker: "Khách nói gì",
  storiesTitle: "Người bán không còn phải gửi lại bảng thông số",
  stories: [
    {
      quote:
        "Tiêu đề Alibaba của chúng tôi là cách gọi trong xưởng. Sau khi viết lại đèn A60, người mua lọc theo nhiệt độ màu và đuôi đèn, không bắt gửi lại thông số.",
      name: "Chen Yu",
      role: "Phụ trách xuất khẩu, Ningbo Harbor Lighting",
      where: "Alibaba",
    },
    {
      quote:
        "Một nửa thuộc tính trên Made-in-China bị trống. Chúng tôi hết nhận “xin gửi thông số” và bắt đầu nhận câu hỏi về số lượng tối thiểu và thời gian giao.",
      name: "Amina Hassan",
      role: "Người sáng lập, Yiwu PackRight",
      where: "Made-in-China",
    },
    {
      quote:
        "Chúng tôi bán cùng một loại phụ kiện trên cả hai trang. Một bản brief, hai định dạng. Nhật ký sửa đổi là tài liệu xưởng thực sự làm theo.",
      name: "Lukas Berger",
      role: "Bán hàng, Rhine & Pearl Trading",
      where: "Cả hai sàn",
    },
  ],
  finalTitle: "Dán website. Nhận điểm.",
  finalBody:
    "Chúng tôi mở trang và hiện điểm tại đây. Chúng tôi không chỉ cách viết lại. Việc đó là Bench hoặc Floor.",
  footer:
    "Chúng tôi viết lại trang sản phẩm cho người bán trên Alibaba và Made-in-China. Không thuộc về hai công ty đó.",
  form: {
    link: "Website của bạn hoặc trang quảng cáo",
    linkPlaceholder: "https://yourfactory.com",
    button: "Chấm trang này",
    scoring: "Đang mở trang…",
    helper: "Chúng tôi mở trang và hiện điểm tại đây. Nếu trang chặn, hãy dán tiêu đề và thông số. Không kèm bản viết lại.",
    linkMissing: "Hãy dán website hoặc trang sản phẩm.",
    linkBad: "Link này có vẻ chưa đủ.",
    blocked: "Trang này chặn mở tự động. Hãy dán tiêu đề và bảng thông số trên quảng cáo.",
    paste: "Tiêu đề và thông số trên quảng cáo",
    pastePlaceholder: "Dán tiêu đề, rồi các dòng thông số.",
    pasteButton: "Chấm đoạn này",
    pasteShort: "Hãy dán thêm. Chỉ có tiêu đề thì chưa đủ.",
    pasteHelp: "Chúng tôi chấm đoạn chữ bạn dán. Không kèm bản viết lại.",
    notListing: "Trang này không phải trang sản phẩm. Hãy dán trang sản phẩm.",
    failed: "Điểm chưa về. Thử lại.",
    unavailable: "Hiện không chấm được.",
    busy: "Đang có quá nhiều lượt chấm. Thử lại sau một phút.",
    change: "Chấm trang khác",
    scored: "Đã chấm trang này",
    scoreOnly: "Đây là điểm. Không kèm bản viết lại.",
    outOf: "trên 100",
    marks: {
      title: "Tiêu đề",
      specs: "Thông số",
      description: "Mô tả",
      photos: "Ảnh",
      claims: "Lời quảng cáo",
    },
  },
  demo: {
    productTitle: "Tiêu đề sản phẩm",
    productName: "Tên sản phẩm",
    messy: "Bản lộn xộn",
    deleting: "Đang xóa tiêu đề lộn xộn",
    typing: "Đang gõ bản viết lại",
    rewritten: "Bản đã viết lại",
    restoring: "Đang đưa tiêu đề lộn xộn trở lại",
    noteDraftAli: "Tiêu đề nhồi từ khóa. Thuộc tính bắt buộc đang trống, người mua không lọc hoặc hỏi giá được.",
    noteGoodAli: "Tiêu đề có thông số để tìm. Thuộc tính khớp bộ lọc người mua thực sự dùng.",
    noteDraftMic: "Bảng thông số Made-in-China quá mơ hồ để vào danh sách mua hàng.",
    noteGoodMic: "Một bảng thông số người mua có thể dán thẳng vào yêu cầu báo giá.",
  },
};

const COPY: Record<Lang, Copy> = { en, zh, vi };

type LocaleState = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Copy;
};

const KEY = "validmix-lang";
const LocaleContext = createContext<LocaleState | null>(null);

function readLang(): Lang {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "zh" || stored === "vi" || stored === "en") return stored;
  } catch {
    /* ignore */
  }
  return "en";
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    setLangState(readLang());
  }, []);

  useEffect(() => {
    const htmlLang = lang === "zh" ? "zh-Hans" : lang === "vi" ? "vi" : "en";
    document.documentElement.lang = htmlLang;
    document.title = COPY[lang].metaTitle;
  }, [lang]);

  const setLang = (next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
  };

  return (
    <LocaleContext.Provider value={{ lang, setLang, t: COPY[lang] }}>{children}</LocaleContext.Provider>
  );
}

export function useI18n() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useI18n must be used within LocaleProvider");
  return value;
}
