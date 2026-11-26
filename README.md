# ChatOnline – Đồ án phần mềm điện toán di động

Ứng dụng chat thời gian thực dùng **React + Vite** ở frontend và **Node.js + WebSocket** ở backend. Không sử dụng cơ sở dữ liệu. Máy chủ giữ tin nhắn trong RAM; trình duyệt lưu lịch sử riêng của tài khoản trong `localStorage`.

## Yêu cầu
- Node.js 18.18+ (khuyến nghị Node.js 20 LTS)
- npm 9+
- Trình duyệt Chrome, Edge hoặc Firefox hiện đại

## Chạy nhanh
1. Giải nén ZIP.
2. Mở terminal tại thư mục dự án.
3. Chạy `npm install` để cài đồng thời dependencies của client và server.
4. Chạy `npm run check` để tự kiểm tra môi trường, cấu hình và mã nguồn.
5. Chạy `npm run dev` để mở cả máy chủ chat và giao diện.
6. Truy cập http://localhost:5173. Mở thêm cửa sổ ẩn danh hoặc trình duyệt khác để thử chat giữa hai tài khoản.

Máy chủ WebSocket mặc định ở `ws://localhost:3001`. Có thể đổi cổng bằng biến môi trường `PORT`.

## Lệnh
- `npm install` – cài dependencies.
- `npm run check` – kiểm tra Node/npm, file cấu hình và cú pháp JavaScript.
- `npm run test` – chạy kiểm thử logic máy chủ.
- `npm run dev` – chạy server và Vite đồng thời.
- `npm run build` – tạo bản build frontend tại `client/dist`.
- `npm start` – chạy máy chủ WebSocket ở chế độ production.

## Chức năng
- Đăng nhập bằng tên hiển thị (không có mật khẩu vì đây là đồ án demo không có backend xác thực).
- Danh sách người đang online.
- Chat cá nhân theo phiên WebSocket.
- Phòng chat chung mặc định.
- Gửi/nhận tin nhắn thời gian thực.
- Trạng thái online/offline và thông báo người dùng tham gia/rời phòng.
- Dấu thời gian, tìm kiếm tin nhắn, giao diện sáng/tối.
- Lưu lịch sử trên trình duyệt bằng localStorage.
- Giao diện responsive cho màn hình máy tính và điện thoại.

## Lưu ý học thuật và giới hạn
Đây là bản demo phục vụ đồ án, không phải dịch vụ chat production. Không có database, đăng ký tài khoản, xác thực danh tính, mã hóa đầu cuối, upload file hay lưu trữ tập trung. Tin nhắn trên máy chủ mất khi máy chủ dừng; localStorage chỉ lưu trên từng trình duyệt. Chat cá nhân chỉ được chuyển tiếp khi cả hai người cùng online. Muốn dùng qua Internet cần triển khai server công khai và cấu hình HTTPS/WSS, firewall và xác thực.

## Cấu trúc
```text
do_an_chat_online/
├── client/              # React + Vite
├── server/              # Node.js + ws
├── docs/                # Hướng dẫn và báo cáo
├── package.json         # Lệnh tổng
└── scripts/check.js     # Tự kiểm tra trước khi chạy
```
