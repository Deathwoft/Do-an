# BÁO CÁO ĐỒ ÁN
## PHẦN MỀM CHAT ONLINE – PHẦN MỀM ĐIỆN TOÁN DI ĐỘNG

**Sinh viên:** ........................................................  
**Mã sinh viên:** ....................................................  
**Lớp:** .............................................................  
**Giảng viên hướng dẫn:** ............................................  
**Trường:** ..........................................................  
**Năm học:** 2026–2027

---

# LỜI MỞ ĐẦU
Trong bối cảnh thiết bị di động và Internet trở nên phổ biến, nhu cầu trao đổi thông tin tức thời ngày càng tăng. Ứng dụng chat trực tuyến cho phép người dùng trao đổi nội dung nhanh chóng, hỗ trợ làm việc và học tập từ nhiều vị trí. Đồ án xây dựng một ứng dụng chat minh họa sử dụng React ở phía giao diện và Node.js kết hợp WebSocket ở phía máy chủ. Hệ thống không sử dụng cơ sở dữ liệu; dữ liệu phiên chat được giữ trong bộ nhớ máy chủ và lịch sử cục bộ được lưu tại trình duyệt.

# CHƯƠNG 1. TỔNG QUAN ĐỀ TÀI
## 1.1. Lý do chọn đề tài
Chat trực tuyến là ví dụ tiêu biểu cho ứng dụng điện toán di động có tương tác mạng. Đề tài giúp vận dụng kiến thức lập trình giao diện, xử lý sự kiện, giao tiếp client-server và thiết kế giao diện thích ứng nhiều kích thước màn hình.

## 1.2. Mục tiêu
- Xây dựng giao diện chat dễ sử dụng, tương thích máy tính và điện thoại.
- Cho phép nhiều người tham gia phòng chat chung.
- Hỗ trợ gửi tin nhắn cá nhân giữa các người dùng đang trực tuyến.
- Hiển thị trạng thái online, thời gian gửi và thông báo tham gia/rời phòng.
- Lưu lịch sử cục bộ và hỗ trợ tìm kiếm tin nhắn.
- Có quy trình kiểm tra môi trường và kiểm thử logic trước khi chạy.

## 1.3. Phạm vi và giới hạn
Sản phẩm là nguyên mẫu học tập. Không có tài khoản/mật khẩu, cơ chế xác thực, database, mã hóa đầu cuối, upload tệp hay đồng bộ lịch sử giữa các thiết bị. Máy chủ chuyển tiếp tin nhắn trong thời gian hoạt động; khi máy chủ dừng, dữ liệu RAM bị mất. localStorage chỉ tồn tại trên trình duyệt hiện tại.

# CHƯƠNG 2. PHÂN TÍCH YÊU CẦU
## 2.1. Đối tượng sử dụng
Người dùng có trình duyệt hiện đại và kết nối được tới máy chủ ứng dụng.

## 2.2. Yêu cầu chức năng
1. Đăng nhập bằng tên hiển thị.
2. Đăng xuất khỏi phiên hiện tại.
3. Hiển thị danh sách người dùng trực tuyến.
4. Tham gia phòng chat chung.
5. Gửi và nhận tin nhắn thời gian thực.
6. Chat cá nhân với người đang trực tuyến.
7. Hiển thị trạng thái online/offline.
8. Hiển thị thời gian gửi tin nhắn.
9. Lưu lịch sử tin nhắn cục bộ trong trình duyệt.
10. Tìm kiếm nội dung tin nhắn và người gửi.
11. Chuyển đổi giao diện sáng/tối.
12. Hiển thị giao diện responsive trên điện thoại và máy tính.
13. Kiểm tra dữ liệu đầu vào, giới hạn độ dài tin nhắn và xử lý lỗi kết nối.

## 2.3. Yêu cầu phi chức năng
- Giao diện rõ ràng, thao tác đơn giản.
- Tin nhắn được truyền qua WebSocket hai chiều.
- Không lưu mật khẩu hay thông tin nhạy cảm.
- Mã nguồn chia thành frontend, backend và kiểm thử.
- Có hướng dẫn cài đặt, chạy và kiểm thử.

# CHƯƠNG 3. PHÂN TÍCH VÀ THIẾT KẾ HỆ THỐNG
## 3.1. Kiến trúc
Hệ thống áp dụng mô hình Client–Server:
- Client: React quản lý trạng thái giao diện, danh sách người dùng, tin nhắn và kết nối WebSocket.
- Server: Node.js và thư viện `ws` nhận kết nối, kiểm tra gói tin, quản lý phiên người dùng và chuyển tiếp tin nhắn.
- Lưu trữ: không có CSDL. Server lưu trạng thái kết nối trong RAM; client lưu lịch sử theo tên người dùng bằng localStorage.

## 3.2. Luồng hoạt động
1. Người dùng nhập tên và đăng nhập.
2. React mở kết nối WebSocket tới server.
3. Client gửi gói `join` kèm tên hiển thị.
4. Server kiểm tra tên, đăng ký phiên và phát danh sách người dùng.
5. Khi gửi tin nhắn phòng chung, client gửi gói `message`; server phát tới các kết nối.
6. Khi chat riêng, client gửi gói `direct`; server tìm người nhận đang online và chuyển tiếp.
7. Khi ngắt kết nối, server xóa phiên và cập nhật danh sách online.

## 3.3. Giao thức trao đổi
- `join`: tham gia với tên hiển thị.
- `message`: gửi nội dung trong phòng chung.
- `direct`: gửi nội dung tới một người đang online.
- `users`: danh sách phiên trực tuyến do server phát.
- `system`: thông báo người dùng tham gia/rời phòng.
- `error`: thông báo dữ liệu hoặc kết nối không hợp lệ.

# CHƯƠNG 4. CÔNG NGHỆ SỬ DỤNG
- **React 18:** xây dựng giao diện theo component và quản lý trạng thái.
- **Vite:** công cụ phát triển và đóng gói frontend.
- **Node.js:** môi trường chạy JavaScript phía máy chủ.
- **WebSocket (`ws`):** giao tiếp hai chiều, độ trễ thấp, phù hợp chat thời gian thực.
- **HTML/CSS:** cấu trúc, bố cục responsive và giao diện sáng/tối.
- **localStorage/sessionStorage:** lưu lịch sử và phiên đăng nhập ở trình duyệt.
- **Node Test Runner:** kiểm thử logic xử lý dữ liệu phía server.

# CHƯƠNG 5. KIỂM THỬ
## 5.1. Kịch bản kiểm thử
| STT | Nội dung | Kết quả mong đợi |
|---|---|---|
| 1 | Nhập tên hợp lệ | Vào màn hình chat |
| 2 | Tên ngắn hơn 2 ký tự | Hiển thị cảnh báo |
| 3 | Hai người vào phòng | Danh sách online cập nhật |
| 4 | Gửi tin nhắn phòng chung | Các phiên nhận được tin |
| 5 | Chat riêng người online | Hai bên nhận được tin |
| 6 | Chat riêng người offline | Hiển thị thông báo lỗi |
| 7 | Tin nhắn rỗng | Không gửi |
| 8 | Tin nhắn quá 2000 ký tự | Server từ chối |
| 9 | Tìm kiếm tin nhắn | Lọc theo nội dung/người gửi |
| 10 | Đổi giao diện | Chuyển sáng/tối |
| 11 | Thu nhỏ màn hình | Giao diện thích ứng |
| 12 | Ngắt kết nối server | Hiển thị trạng thái ngoại tuyến |

## 5.2. Kiểm thử tự động
Chạy `npm test` tại thư mục gốc để kiểm tra hàm chuẩn hóa tên, tạo tin nhắn, từ chối tin rỗng/quá dài và phân tích gói JSON. Chạy `npm run check` để kiểm tra phiên bản Node.js, cấu trúc file và cú pháp JavaScript.

## 5.3. Kết quả kiểm thử
Điền kết quả thực tế sau khi chạy dự án trên máy nộp bài. Đính kèm ảnh chụp màn hình trang đăng nhập, phòng chat chung và chat cá nhân vào báo cáo nếu giảng viên yêu cầu minh chứng giao diện.

# CHƯƠNG 6. HƯỚNG DẪN CÀI ĐẶT VÀ SỬ DỤNG
1. Cài Node.js 18 trở lên.
2. Giải nén source code.
3. Mở terminal tại thư mục gốc và chạy `npm install`.
4. Chạy `npm run check`.
5. Chạy `npm test`.
6. Chạy `npm run dev`.
7. Mở `http://localhost:5173`.
8. Mở trình duyệt thứ hai với tên khác để kiểm thử chat nhiều người.

# KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN
Đồ án đã thiết kế nguyên mẫu chat trực tuyến dựa trên React và Node.js/WebSocket, đáp ứng các chức năng cốt lõi của một ứng dụng nhắn tin thời gian thực trong phạm vi không sử dụng cơ sở dữ liệu. Hướng phát triển gồm bổ sung xác thực người dùng, database, gửi hình ảnh/tệp, thông báo đẩy, mã hóa, triển khai HTTPS/WSS và tối ưu cho thiết bị di động.

# TÀI LIỆU THAM KHẢO
1. React Documentation – https://react.dev/
2. Node.js Documentation – https://nodejs.org/docs/
3. MDN Web Docs, WebSocket API – https://developer.mozilla.org/docs/Web/API/WebSocket
4. Vite Documentation – https://vite.dev/
