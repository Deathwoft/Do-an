# HƯỚNG DẪN CÀI ĐẶT VÀ SỬ DỤNG

## 1. Cài đặt
- Cài Node.js phiên bản 18 trở lên.
- Giải nén dự án, mở terminal tại thư mục gốc.
- Chạy `npm install` (nếu npm báo thiếu concurrently hoặc ws, chạy `npm run install:all` rồi `npm install` tại thư mục gốc).
- Chạy `npm run check`, sau đó `npm test`.

## 2. Khởi động
Chạy `npm run dev`. Mở `http://localhost:5173`. Máy chủ WebSocket chạy cổng 3001.

## 3. Kiểm thử chat
- Mở hai cửa sổ trình duyệt (một cửa sổ thường, một cửa sổ ẩn danh).
- Đăng nhập bằng hai tên khác nhau, ví dụ An và Bình.
- Chọn Phòng chung và gửi tin nhắn.
- Chọn tên thành viên ở thanh bên để nhắn riêng.
- Thử tìm kiếm, đổi giao diện sáng/tối, thay đổi kích thước cửa sổ.

## 4. Khắc phục sự cố
- `EADDRINUSE`: cổng 3001 hoặc 5173 đang được dùng. Tắt tiến trình cũ trước khi chạy lại.
- Không kết nối máy chủ: kiểm tra terminal server, firewall và URL WebSocket.
- Tên đã được sử dụng: chọn tên khác hoặc đóng phiên trình duyệt cũ.
- Nếu `npm install` lỗi mạng, thử lại khi có Internet.

## 5. Đóng gói nộp
Nộp file ZIP source code và báo cáo Word đi kèm. Không đưa `node_modules` vào ZIP; người chấm cài lại bằng `npm install`.
