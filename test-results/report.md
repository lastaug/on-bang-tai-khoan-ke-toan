# Báo Cáo Redesign Giao Diện Chuẩn Apple (Apple Human Interface Guidelines) - For Bunny

**Tên ứng dụng**: For Bunny – Ôn Tập Hệ Thống Tài Khoản Kế Toán (Thông tư 99/2025/TT-BTC)  
**Môi trường thực thi**: Windows Local Server (`http://localhost:5173`)  
**Tiêu chuẩn thiết kế áp dụng**: Apple Human Interface Guidelines (Clarity, Deference, Depth, Simplicity, Consistency, Craft)  
**Tình trạng kiểm thử**: **100% ĐẠT CHUẨN TOÀN DIỆN**

---

## 1. Tóm tắt các nâng cấp thiết kế chính (Apple Design Standard)

1. **Design System & Bảng màu (Apple System Colors & Surfaces)**:
   - Thay thế toàn bộ phong cách card rời rạc bằng hệ thống Apple Card đồng nhất (`.apple-card`, `.apple-card-hover`).
   - Tối ưu hóa độ tương phản và phân cấp thị giác theo chuẩn Apple:
     - **Light Mode**: Nền `#f5f5f7`, thẻ bề mặt trắng thanh lịch với đường viền siêu mảnh `rgba(0,0,0,0.06)`, shadow nhẹ tự nhiên. Không còn các khối màu đen gắt.
     - **Dark Mode**: Nền đen thuần `#000000`, thẻ xám bề mặt `#1c1c1e` với viền `rgba(255,255,255,0.08)`.
   - Màu sắc trạng thái pastel tinh tế (Neutral, Blue, Amber, Emerald) thay thế cho các dải màu neon hoặc gradient sặc sỡ.

2. **Typography & Tabular Figures**:
   - Sử dụng font hệ thống cao cấp: `-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif`.
   - Toàn bộ số hiệu tài khoản và chỉ số thống kê áp dụng `font-variant-numeric: tabular-nums` (`.font-tabular`), giúp người học quét mắt dọc bảng cân đối và danh mục mà không bị lệch hàng.

3. **Dashboard tinh tế**:
   - **Hero Banner**: Bỏ khối hộp đen nặng nề trong Light Mode; chuyển sang thiết kế thích ứng mượt mà với ánh sáng tỏa nhẹ (ambient glow), thông tin Thông tư 99/2025/TT-BTC rõ ràng, nút "Tiếp tục học tập" nổi bật.
   - **4 Stat Cards**: Icon squircle Apple, số liệu phân cấp sắc nét, phân biệt rõ ràng giữa "Đã học qua" và "Đã thuộc vững".
   - **4 Method Cards**: Đồng nhất ngôn ngữ thiết kế, icon huy hiệu màu pastel nhẹ nhàng, mô tả ngắn gọn và nút "Bắt đầu ngay" kích hoạt tức thì.
   - **8 Nhóm tài khoản**: Bố cục thẻ kèm tag đầu số, thanh progress bar tinh tế.

4. **Trắc nghiệm thông minh (Quiz) - 0px Shift & Phím tắt**:
   - **Khắc phục triệt để hiện tượng lệch ô (0px Layout Displacement)**: Cố định tuyệt đối chiều cao ô đáp án (`h-[64px]`), viền cố định 2px trước và sau khi chọn, khe icon 24px luôn chiếm chỗ. Dù bấm nhanh hay chậm, giao diện hoàn toàn tĩnh tại, êm mắt.
   - **Phím tắt toàn diện**: Hỗ trợ chuyển câu bằng Mũi tên trái (←) và Mũi tên phải (→), phím 1-4 để chọn đáp án, Enter/Space để xác nhận.

5. **Flashcard 3D & Ghép đôi**:
   - Thẻ lật 3D mượt mà với 4 nút đánh giá mức độ ghi nhớ theo thang Spaced Repetition.
   - Ghép đôi nối từ 2 cột cân đối, phản hồi xúc giác (tactile feedback) và âm thanh chuẩn xác.

---

## 2. Bảng đối chiếu giao diện Trước & Sau Redesign (Before / After Evidence)

| Màn hình | Ảnh Trước Nâng Cấp (Before) | Ảnh Sau Nâng Cấp (After - Apple Quality) | Đánh giá & Cải tiến |
|:---|:---:|:---:|:---|
| **Dashboard (Light Mode)** | [dashboard-light.png](file:///d:/Antigravity/Ôn%20bảng%20tài%20khoản%20kế%20toán/test-results/ui-before/dashboard-light.png) | [dashboard-light.png](file:///d:/Antigravity/Ôn%20bảng%20tài%20khoản%20kế%20toán/test-results/ui-after/dashboard-light.png) | Loại bỏ hộp đen thô; card phẳng sang trọng, thoáng đãng, phân cấp chuẩn Apple |
| **Dashboard (Dark Mode)** | [dashboard-dark.png](file:///d:/Antigravity/Ôn%20bảng%20tài%20khoản%20kế%20toán/test-results/ui-before/dashboard-dark.png) | [dashboard-dark.png](file:///d:/Antigravity/Ôn%20bảng%20tài%20khoản%20kế%20toán/test-results/ui-after/dashboard-dark.png) | Nền đen sâu (OLED friendly), các card `#1c1c1e` tách lớp rõ ràng, tương phản êm dịu |
| **Danh mục tài khoản (Catalog)** | [catalog.png](file:///d:/Antigravity/Ôn%20bảng%20tài%20khoản%20kế%20toán/test-results/ui-before/catalog.png) | [catalog.png](file:///d:/Antigravity/Ôn%20bảng%20tài%20khoản%20kế%20toán/test-results/ui-after/catalog.png) | Ô tìm kiếm bo góc Apple, cây phân cấp có đường kẻ gióng mờ tinh tế, mã TK tabular |
| **Flashcard 3D** | [flashcard.png](file:///d:/Antigravity/Ôn%20bảng%20tài%20khoản%20kế%20toán/test-results/ui-before/flashcard.png) | [flashcard.png](file:///d:/Antigravity/Ôn%20bảng%20tài%20khoản%20kế%20toán/test-results/ui-after/flashcard.png) | Thẻ học bo góc chuẩn Apple, các nút đánh giá pastel dịu mắt, hỗ trợ phím tắt 1-4 |
| **Trắc nghiệm (Quiz)** | [quiz.png](file:///d:/Antigravity/Ôn%20bảng%20tài%20khoản%20kế%20toán/test-results/ui-before/quiz.png) | [quiz.png](file:///d:/Antigravity/Ôn%20bảng%20tài%20khoản%20kế%20toán/test-results/ui-after/quiz.png) | Cố định 100% vị trí (0px shift), huy hiệu 1-2-3-4 nổi bật, thanh giải thích tĩnh tại |
| **Ghép đôi (Matching)** | [matching.png](file:///d:/Antigravity/Ôn%20bảng%20tài%20khoản%20kế%20toán/test-results/ui-before/matching.png) | [matching.png](file:///d:/Antigravity/Ôn%20bảng%20tài%20khoản%20kế%20toán/test-results/ui-after/matching.png) | 2 cột thẻ cân đối, hiệu ứng bấm nảy xúc giác (Apple press), thanh đếm thời gian sắc nét |

---

## 3. Kết quả kiểm thử chức năng & độ phản hồi (Responsiveness)

- **Độ dịch chuyển ô khi làm trắc nghiệm**: `opt1_deltaY: 0px`, `opt2_deltaY: 0px`, `opt3_deltaY: 0px`, `opt4_deltaY: 0px`, `nextBtn_deltaY: 0px`. Hoàn toàn không rung lắc khi chọn đáp án.
- **Phím tắt điều hướng**: Phím Mũi tên trái (←) và Mũi tên phải (→) hoạt động tức thì giữa các câu hỏi.
- **Desktop (1280x800 & 1920x1080)**: Bố cục lưới thông thoáng, Sidebar cố định với logo Kuromi và tên thương hiệu "For Bunny".
- **Tablet (768x1024)**: Bố cục thích ứng linh hoạt, không vỡ layout.
- **Mobile (375x812)**: Thanh điều hướng chuyển sang dạng Bottom Navigation bar tiện dụng, không tràn ngang (`htmlWidth = 369px`).
- **Lỗi hiển thị & Console**: Đã khắc phục mã SVG path bị lỗi ở icon con mắt, 0 lỗi runtime phát sinh.
