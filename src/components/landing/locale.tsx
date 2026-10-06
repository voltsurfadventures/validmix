import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "zh" | "vi";

const en = {
  metaTitle: "ValidMix — Listing polish for Alibaba and Made-in-China",
  nav: { product: "What we fix", method: "How it works", pricing: "Pricing", stories: "Stories" },
  cta: "Get a free listing score",
  ctaShort: "Get a listing score",
  heroSecondary: "See a rewrite",
  menuOpen: "Open menu",
  menuClose: "Close menu",
  heroTitle: "We rewrite your product listings.",
  heroSub: "The title, the specs, and the description. Clear enough that a buyer can ask for a quote.",
  placesNote: "Paid rewrites are Alibaba and Made-in-China. We can score the other sites.",
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
      body: "We flag exaggerations and certificates that don’t match the product. A blank spec stays blank. We do not invent certificates. If the page says CE and the certificate is for a different model, we mark it before a buyer does.",
    },
    {
      title: "Both websites",
      body: "One rewrite, then a version for Alibaba and a version for Made-in-China. The facts stay the same. The fields and the title length follow each site’s form.",
    },
  ],
  featureCta: "Get a free listing score",
  methodKicker: "How it works",
  methodTitle: "Send the listing. Your team posts the file.",
  steps: [
    {
      title: "Send the listing",
      body: "Paste the product link or the spec sheet. We keep your model numbers exactly as they are.",
    },
    {
      title: "Pay for the batch",
      body: "The sample is free. A paid batch is charged before the files go out.",
    },
    {
      title: "Check the rewrite, then post it",
      body: "You get a new title, filled-in specs, and a clearer description. Download one file for Alibaba and one for Made-in-China. Your team posts them.",
    },
  ],
  pricingKicker: "Pricing",
  pricingTitle: "Pay for the batch, not a subscription.",
  pricingIntro: "Prices in US dollars. Charged before the files are sent. Stop after any batch.",
  pricingNote: "No monthly plan until a batch has been posted and you come back. No yearly plan yet.",
  mostChosen: "Most chosen",
  plans: {
    sample: {
      eyebrow: "See the work",
      name: "Sample",
      line: "One listing. Both websites.",
      points: ["Title, specs, and description", "A score before and after", "Alibaba and Made-in-China versions"],
      button: "Get a listing score",
    },
    bench: {
      eyebrow: "",
      name: "Bench",
      line: "Try it on a small catalog. One website.",
      points: [
        "10 listings",
        "Alibaba or Made-in-China",
        "Title, specs, and description",
        "A score before and after",
        "Extra listings $6 each",
      ],
      button: "Continue with Bench",
    },
    floor: {
      eyebrow: "",
      name: "Floor",
      line: "The batch most factories start with. Both websites.",
      points: [
        "40 listings",
        "Both websites, every listing",
        "Search words and a photo list",
        "A list of every change",
        "Extra listings $5 each",
      ],
      button: "Continue with Floor",
    },
    line: {
      eyebrow: "",
      name: "Line",
      line: "For the products you actually sell.",
      points: [
        "100 listings",
        "Both websites, every listing",
        "Your own word list",
        "A person reviews your 10 main products",
        "Extra listings $5 each",
      ],
      button: "Continue with Line",
    },
  },
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
  finalTitle: "Send one listing.",
  finalBody: "The sample is free. A paid batch is charged before the files go out.",
  footer:
    "We rewrite product listings for sellers on Alibaba and Made-in-China. Your team posts the files. We do not log into the factory account. Not part of either company.",
  form: {
    name: "Name",
    email: "Work email",
    company: "Company",
    website: "Website",
    websitePlaceholder: "Alibaba or Made-in-China link, or the product link",
    product: "One product link or a note to paste the spec",
    productPlaceholder: "Product link, or paste the spec",
    site: "Which site",
    siteAli: "Alibaba",
    siteMic: "Made-in-China",
    siteBoth: "Both",
    note: "Note",
    noteOptional: "Optional",
    button: "Send the listing",
    payButton: "Send this batch",
    sending: "Sending…",
    success: "We rewrite one listing free. If you want a batch, you pay before the files are sent.",
    paySuccess: "We have this batch. Payment details come next. The files go out after payment clears.",
    missing: "Fill in the blank fields.",
    emailBad: "That email does not look right.",
    websiteBad: "That website link does not look complete.",
    failed: "That did not send. Try again in a minute.",
    emailInstead: "Email this instead",
  },
  checkoutTitle: "Pay for the batch",
  checkoutBody: "Pay by card (Stripe) or by USD bank transfer (Wise). We send the files after payment clears.",
  checkoutPaypal: "PayPal if the factory cannot use a card.",
  checkoutBack: "Back to pricing",
  checkoutMissing: "Pick Bench, Floor, or Line.",
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
  cta: "免费给一条详情打分",
  ctaShort: "给一条详情打分",
  heroSecondary: "看一条改写",
  menuOpen: "打开菜单",
  menuClose: "关闭菜单",
  heroTitle: "我们改写你的产品详情。",
  heroSub: "标题、参数和描述。清楚到买家可以直接询价。",
  placesNote: "付费改写只做阿里巴巴和中国制造网。其他网站我们可以打分。",
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
      body: "我们标出夸大的说法，以及和产品对不上的证书。空着的参数保持空白。我们不编造证书。页面写着 CE，证书却是另一个型号，我们会先标出来。",
    },
    {
      title: "两个网站",
      body: "改写一次，再出一版给阿里巴巴、一版给中国制造网。事实不变。栏位和标题长度按各自的表来。",
    },
  ],
  featureCta: "免费给一条详情打分",
  methodKicker: "怎么做",
  methodTitle: "你把详情发来。文件由你们自己发布。",
  steps: [
    {
      title: "把详情发来",
      body: "贴上产品链接或规格表。型号按原样保留。",
    },
    {
      title: "为这一批付款",
      body: "样品免费。付费的一批在文件发出之前收款。",
    },
    {
      title: "核对改写，然后自己发布",
      body: "你会得到新标题、填好的参数和更清楚的描述。下载一份给阿里巴巴，一份给中国制造网。由你们的人发布。",
    },
  ],
  pricingKicker: "价格",
  pricingTitle: "按这一批付钱，不是订阅。",
  pricingIntro: "价格为美元。文件发出之前收款。这一批做完就可以停。",
  pricingNote: "在有一批已经发布、并且你再回来之前，没有月费方案。也还没有年费方案。",
  mostChosen: "最多人选",
  plans: {
    sample: {
      eyebrow: "先看效果",
      name: "Sample",
      line: "一条详情。两个网站。",
      points: ["标题、参数和描述", "改前改后各有一个分数", "阿里巴巴和中国制造网两个版本"],
      button: "给一条详情打分",
    },
    bench: {
      eyebrow: "",
      name: "Bench",
      line: "先在一个小目录上试。一个网站。",
      points: ["10 条详情", "阿里巴巴或中国制造网", "标题、参数和描述", "改前改后各有一个分数", "加条每条 $6"],
      button: "选择 Bench",
    },
    floor: {
      eyebrow: "",
      name: "Floor",
      line: "多数工厂从这一批开始。两个网站。",
      points: ["40 条详情", "每条都出两个网站", "搜索词和拍照清单", "每一处修改的清单", "加条每条 $5"],
      button: "选择 Floor",
    },
    line: {
      eyebrow: "",
      name: "Line",
      line: "给你真正在卖的产品。",
      points: ["100 条详情", "每条都出两个网站", "你们自己的词表", "有人看过你们的 10 个主打产品", "加条每条 $5"],
      button: "选择 Line",
    },
  },
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
  finalTitle: "先发一条详情。",
  finalBody: "样品免费。付费的一批在文件发出之前收款。",
  footer: "我们为在阿里巴巴和中国制造网开店的卖家改写产品详情。文件由你们发布。我们不登录工厂的账号。与这两家公司没有关系。",
  form: {
    name: "姓名",
    email: "工作邮箱",
    company: "公司",
    website: "网站",
    websitePlaceholder: "阿里巴巴或中国制造网链接，或产品链接",
    product: "一条产品链接，或贴上规格",
    productPlaceholder: "产品链接，或贴上规格",
    site: "哪个网站",
    siteAli: "阿里巴巴",
    siteMic: "中国制造网",
    siteBoth: "两个都要",
    note: "备注",
    noteOptional: "选填",
    button: "发送这条详情",
    payButton: "发送这一批",
    sending: "正在发送…",
    success: "我们免费改写一条详情。如果要一批，文件发出之前付款。",
    paySuccess: "这一批已收到。接下来是付款说明。款项到账后发送文件。",
    missing: "请把空着的栏填上。",
    emailBad: "这个邮箱看起来不对。",
    websiteBad: "这个网站链接看起来不完整。",
    failed: "没有发出去。过一分钟再试。",
    emailInstead: "改用邮件发送",
  },
  checkoutTitle: "为这一批付款",
  checkoutBody: "用卡支付（Stripe），或用美元银行转账（Wise）。款项到账后我们发送文件。",
  checkoutPaypal: "如果工厂不能用卡，可以用 PayPal。",
  checkoutBack: "返回价格",
  checkoutMissing: "请先选 Bench、Floor 或 Line。",
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
  cta: "Chấm miễn phí một trang",
  ctaShort: "Chấm một trang",
  heroSecondary: "Xem một bản viết lại",
  menuOpen: "Mở menu",
  menuClose: "Đóng menu",
  heroTitle: "Chúng tôi viết lại trang sản phẩm của bạn.",
  heroSub: "Tiêu đề, thông số và mô tả. Rõ đến mức người mua có thể hỏi giá.",
  placesNote: "Bản viết lại có phí chỉ dành cho Alibaba và Made-in-China. Các trang còn lại chúng tôi có thể chấm điểm.",
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
      body: "Chúng tôi đánh dấu câu phóng đại và chứng nhận không đúng sản phẩm. Ô thông số trống thì để trống. Chúng tôi không bịa chứng nhận. Trang ghi CE mà giấy chứng nhận là model khác, chúng tôi đánh dấu trước khi người mua thấy.",
    },
    {
      title: "Cả hai website",
      body: "Viết lại một lần, rồi một bản cho Alibaba và một bản cho Made-in-China. Sự thật không đổi. Ô và độ dài tiêu đề theo form của từng trang.",
    },
  ],
  featureCta: "Chấm miễn phí một trang",
  methodKicker: "Cách làm",
  methodTitle: "Bạn gửi trang. Đội của bạn đăng file.",
  steps: [
    {
      title: "Gửi trang sản phẩm",
      body: "Dán link sản phẩm hoặc bảng thông số. Chúng tôi giữ nguyên mã hàng.",
    },
    {
      title: "Trả tiền cho cả lô",
      body: "Mẫu thì miễn phí. Lô có phí được thu trước khi file được gửi đi.",
    },
    {
      title: "Kiểm bản viết lại, rồi đăng",
      body: "Bạn nhận tiêu đề mới, thông số đã điền, và mô tả rõ hơn. Tải một file cho Alibaba và một file cho Made-in-China. Đội của bạn đăng chúng.",
    },
  ],
  pricingKicker: "Giá",
  pricingTitle: "Trả cho cả lô, không phải thuê bao.",
  pricingIntro: "Giá tính bằng đô la Mỹ. Thu trước khi gửi file. Làm xong một lô thì có thể dừng.",
  pricingNote: "Chưa có gói tháng cho đến khi một lô đã được đăng và bạn quay lại. Chưa có gói năm.",
  mostChosen: "Được chọn nhiều",
  plans: {
    sample: {
      eyebrow: "Xem việc làm",
      name: "Sample",
      line: "Một trang. Cả hai website.",
      points: ["Tiêu đề, thông số và mô tả", "Điểm trước và sau khi sửa", "Bản Alibaba và Made-in-China"],
      button: "Chấm một trang",
    },
    bench: {
      eyebrow: "",
      name: "Bench",
      line: "Thử trên một danh mục nhỏ. Một website.",
      points: [
        "10 trang",
        "Alibaba hoặc Made-in-China",
        "Tiêu đề, thông số và mô tả",
        "Điểm trước và sau khi sửa",
        "Thêm trang, $6 mỗi trang",
      ],
      button: "Tiếp tục với Bench",
    },
    floor: {
      eyebrow: "",
      name: "Floor",
      line: "Lô mà hầu hết xưởng bắt đầu. Cả hai website.",
      points: [
        "40 trang",
        "Mỗi trang có cả hai website",
        "Từ khóa tìm và danh sách ảnh",
        "Danh sách từng chỗ đã sửa",
        "Thêm trang, $5 mỗi trang",
      ],
      button: "Tiếp tục với Floor",
    },
    line: {
      eyebrow: "",
      name: "Line",
      line: "Cho những sản phẩm bạn thực sự bán.",
      points: [
        "100 trang",
        "Mỗi trang có cả hai website",
        "Bảng từ của riêng bạn",
        "Có người xem 10 sản phẩm chính",
        "Thêm trang, $5 mỗi trang",
      ],
      button: "Tiếp tục với Line",
    },
  },
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
  finalTitle: "Gửi một trang trước.",
  finalBody: "Mẫu thì miễn phí. Lô có phí được thu trước khi file được gửi đi.",
  footer:
    "Chúng tôi viết lại trang sản phẩm cho người bán trên Alibaba và Made-in-China. Đội của bạn đăng file. Chúng tôi không đăng nhập tài khoản xưởng. Không thuộc về hai công ty đó.",
  form: {
    name: "Tên",
    email: "Email công việc",
    company: "Công ty",
    website: "Website",
    websitePlaceholder: "Link Alibaba hoặc Made-in-China, hoặc link sản phẩm",
    product: "Một link sản phẩm, hoặc dán bảng thông số",
    productPlaceholder: "Link sản phẩm, hoặc dán thông số",
    site: "Trang nào",
    siteAli: "Alibaba",
    siteMic: "Made-in-China",
    siteBoth: "Cả hai",
    note: "Ghi chú",
    noteOptional: "Không bắt buộc",
    button: "Gửi trang này",
    payButton: "Gửi lô này",
    sending: "Đang gửi…",
    success: "Chúng tôi viết lại một trang miễn phí. Nếu bạn muốn cả lô, hãy trả tiền trước khi file được gửi.",
    paySuccess: "Đã nhận lô này. Chi tiết thanh toán sẽ được gửi tiếp. File đi sau khi tiền vào.",
    missing: "Hãy điền các ô còn trống.",
    emailBad: "Email này có vẻ chưa đúng.",
    websiteBad: "Link website này có vẻ chưa đủ.",
    failed: "Chưa gửi được. Thử lại sau một phút.",
    emailInstead: "Gửi bằng email",
  },
  checkoutTitle: "Trả tiền cho cả lô",
  checkoutBody: "Trả bằng thẻ (Stripe) hoặc chuyển khoản USD (Wise). Chúng tôi gửi file sau khi tiền vào.",
  checkoutPaypal: "PayPal nếu xưởng không dùng được thẻ.",
  checkoutBack: "Về phần giá",
  checkoutMissing: "Hãy chọn Bench, Floor hoặc Line.",
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
