# Code review — ReactJS-R2S (HTML/CSS)

**Ngày:** 2026-03-27  
**Phạm vi:** `index.html`, `product.html`, `product-detail.html`, `css/*.css`, `package.json`  
**Tiêu chí:** coding convention, HTML/CSS đúng chuẩn, DRY, a11y cơ bản, nhất quán dependency.

---

## 1. Tóm tắt

| Hạng mục | Đánh giá ngắn |
|----------|----------------|
| Cấu trúc trang | Tốt: `header` / `main` / `footer`, `lang="vi"`, BEM tương đối nhất quán |
| HTML semantics | Cần sửa: lồng `button` trong `a`, đường dẫn `img` sai, link rỗng |
| CSS | Cần sửa: selector typo, biến typo, `font-size`/`font-weight` sai |
| DRY | Yếu: footer/header và block CSS lặp trên nhiều tệp |
| Tên dự án vs nội dung | Repo tên React nhưng **chưa dùng React** — cần làm rõ trong README hoặc bổ sung stack |

---

## 2. Phát hiện theo mức ưu tiên

### 2.1. Ưu tiên cao (ảnh hưởng đúng chuẩn / hiển thị)

| ID | Vị trí | Vấn đề | Gợi ý sửa |
|----|--------|--------|-----------|
| H1 | `index.html`, `product.html` (nhiều chỗ) | `<a href="..."><button>...</button></a>` — HTML5 không cho phép lồng interactive trong interactive | Dùng **một** phần tử: `a.btn` (style như nút) **hoặc** `button` + xử lý điều hướng bằng JS; không bọc `button` trong `a`. |
| C1 | `css/style.css` ~L273 | `color: var(--bc-buton)` — typo biến CSS | Đổi thành `var(--bc-button)` (thống nhất với `:root`). |
| C2 | `css/style.css` ~L374; `css/product-detail.css` ~L290 | Selector `footer__column-title` thiếu `.` — không match class | Đổi thành `.footer__column-title`. |
| C3 | Cả 3 file CSS (footer) | `.footer .list li:last-child a` — trong HTML không có class `.list` | Đổi thành `.footer__list li:last-child a`. |
| C4 | `css/style.css`, `product.css`, `product-detail.css` (footer links / strong) | `font-size: 1.4` thiếu đơn vị; `font-size: 600` trên `strong` — sai (600 là weight) | `font-size: 1.4rem`; dùng `font-weight: 600` cho đậm. |

### 2.2. Ưu tiên trung bình (chất lượng, bảo trì)

| ID | Vị trí | Vấn đề | Gợi ý sửa |
|----|--------|--------|-----------|
| P1 | `index.html`, `product.html` (footer social) | `./img//facebook.svg` (và tương tự) — thừa `/` | `./img/facebook.svg`, `./img/Linkedin.svg`, … |
| P2 | Footer | `href=""` trên link mạng xã hội | `href="#!"` tạm hoặc URL thật; thêm `aria-label` mô tả mạng. |
| P3 | `product.html` | Thụt lề / format khối card không đồng đều | Chạy formatter (Prettier, VS Code Format Document) cho HTML. |
| P4 | `product.html` vs `package.json` | Bootstrap **5.3.3** (CDN) khác **^5.3.8** (npm) | Chọn một nguồn: chỉ CDN **hoặc** build từ `node_modules` với một version cố định. |

### 2.3. Ưu tiên thấp (a11y & polish)

| ID | Gợi ý |
|----|--------|
| A1 | Nút prev/next carousel (`main__product-control-btn`): thêm `type="button"`, `aria-label="Xem sản phẩm trước"` / `"... sau"`. |
| A2 | Breadcrumb `product-detail.html`: bọc trong `<nav aria-label="Breadcrumb">`, có thể dùng `<ol><li>`. |
| A3 | Tiêu đề trang: `index.html` vẫn `Tuan1-HTML-CSS` — đổi cho khớp branding (ví dụ tên shop). |

---

## 3. Refactor DRY — đề xuất kiến trúc

### 3.1. CSS: tách lớp và tránh lặp

**Hiện trạng:** `style.css`, `product.css`, `product-detail.css` lặp lại phần lớn `:root`, `.container`, `.btn`, header, footer.

**Đề xuất cấu trúc tệp:**

```
css/
  base.css        /* reset đã có reset.css — giữ riêng; base: :root, .container, .btn, typography */
  layout.css      /* .header, .header__*, navbar-toggler nếu dùng chung */
  footer.css      /* .footer__* — một nơi sửa cho mọi trang */
  home.css          /* chỉ hero + product section trang chủ */
  product-list.css  /* grid/list + card — hoặc scope dưới .main__product-list */
  product-detail.css /* chỉ .product-detail__* */
```

**Thứ tự link trong HTML (ví dụ trang chủ):**

1. `reset.css`  
2. `base.css`  
3. `layout.css`  
4. `footer.css`  
5. `home.css`  

Trang danh sách: thêm `product-list.css` (và `layout.css` có thể gộp rule responsive header chung). Trang chi tiết: `base` + `layout` + `footer` + `product-detail.css`.

**Lợi ích:** Sửa typo `.footer__column-title`, `font-size` footer **một lần**; giảm drift giữa các file.

### 3.2. HTML: header / footer lặp 3 trang

**Hiện trạng:** Copy-paste `<header>` và `<footer>` giữa `index.html`, `product.html`, `product-detail.html`.

**Hướng xử lý (chọn một):**

| Phương án | Khi nào phù hợp | Ghi chú |
|-----------|------------------|---------|
| **Build nhẹ** (Vite, Parcel, eleventy) | Dự án sẽ mở rộng | `include` partial `header.html` / `footer.html` |
| **Thành phần server** (PHP/JSP/Thymeleaf) | Backend có sẵn | Include template |
| **Git + chỉnh tay** | Bài tập tĩnh, chưa có build | Giữ nguyên nhưng **ghi chú trong README**: “Sửa header/footer ở cả 3 file” + checklist release |

Khuyến nghị dài hạn: dùng **Vite** với HTML multi-page hoặc một template engine — phù hợp khi tên repo chuyển sang React sau này.

### 3.3. Bootstrap

- Nếu **chỉ** `product.html` cần Bootstrap: giữ CDN **hoặc** bundle từ npm, không cần nhân đôi.  
- Nếu refactor DRY CSS: tránh chồng `container` Bootstrap với `.container` custom (đã có width cố định) — đổi tên class layout custom (ví dụ `.page-container`) nếu xung đột với Bootstrap.

### 3.4. `package.json`

- Thêm script phục vụ dev: ví dụ `"dev": "npx serve ."` hoặc Vite sau khi scaffold.  
- Đồng bộ phiên bản Bootstrap giữa CDN và `dependencies` (hoặc bỏ dependency nếu chỉ dùng CDN).

---

## 4. Checklist thực hiện (gợi ý thứ tự)

1. Sửa lỗi CSS: `--bc-buton`, `.footer__column-title`, `.footer__list`, `rem` / `font-weight`.  
2. Sửa HTML: bỏ `button` trong `a`, sửa đường dẫn `img`, `href` rỗng.  
3. Tách `footer.css` + `base.css` (hoặc gộp base+footer) và cập nhật `<link>` trên từng trang.  
4. Format `product.html`, thống nhất Bootstrap version.  
5. (Tùy chọn) Scaffold Vite + partial HTML hoặc chuẩn bị migration React nếu đúng mục tiêu “ReactJS-R2S”.

---

## 5. Kết luận

Mã nguồn có **nền tảng convention tốt** (BEM, cấu trúc trang). Các điểm cần xử lý trước là **lỗi HTML/CSS thực sự** (nested button, selector/biến typo) và **DRY** ở CSS + header/footer để giảm chi phí bảo trì. Việc **đồng bộ tên dự án, README và stack** (HTML tĩnh vs React) giúp reviewer và người mới vào repo hiểu đúng phạm vi.
