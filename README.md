# Daily English — Practical English Learning

Mỗi ngày 20 phút: **nhớ lại → học vài câu mới → luyện hội thoại → tự kiểm tra**. Nội dung dành cho khoảng A2–B1, học từ tình huống đến câu tiếng Anh thay vì dịch từng từ.

## Bắt đầu học

Mở [website](https://nguyenan97.github.io/practical-english-learning/) và bấm **Bắt đầu học hôm nay**. Lần đầu bắt đầu từ bài 01 hoặc chọn tình huống đang cần. Các bài đến lượt ôn chỉ hiện khi bạn đã lưu tự đánh giá trên chính trình duyệt đó.

- [Hướng dẫn bắt đầu](docs/start-here.md)
- [Cách luyện trong một buổi](docs/daily-routine.md)
- [Ôn và tự đánh giá](docs/review-and-mastery.md)
- [Cách thêm bài mới](docs/adding-a-lesson.md)

Bấm chuyển bước chỉ thay đổi phần đang xem, không đánh dấu mastery. Sau khi tự làm exit task, người học chọn mức 0–4 và các chunks đã tự dùng đúng. Tiến độ lưu trên trình duyệt; không có tài khoản, đồng bộ thiết bị hay chấm nói tự động. Khi không bật JavaScript, toàn bộ nội dung vẫn đọc và luyện được.

## Cấu trúc

```text
index.md                    # trang Hôm nay
_layouts/                   # giao diện chung, trang chủ, bài học 4 bước
_includes/                  # danh sách tự động, chunk cards, luyện từng lượt
_data/                      # chunks và nhóm tình huống, nguồn dữ liệu chính
assets/                     # CSS responsive và JavaScript không cần bundler
lessons/                    # bài hoàn chỉnh + index tự lấy từ metadata
phrases/                    # sổ câu có tìm kiếm và lọc tình huống
scenarios/                  # hội thoại, nhánh thay đổi, prompt luyện với AI
sources/                    # nguồn học đã làm sạch, giữ để tham khảo
methods/                    # phương pháp học
agent-skill/                # workflow và quy tắc nguồn cho agent
docs/                       # cách học và cách đóng góp
templates/                  # mẫu bài, scenario và learning log
scripts/                    # validation và browser smoke checks
.github/workflows/          # kiểm tra PR và deploy main lên GitHub Pages
```

Bài học lấy các câu chuẩn từ `_data/chunks.yml`; câu được lặp trong bài tập khi có mục đích thực hành. Danh sách bài, scenario và liên kết bài trong phrase bank được tạo từ metadata; không cần cập nhật nhiều danh sách thủ công.

## Phương pháp

Luyện nhớ chủ động, ôn cách quãng, đổi ngữ cảnh, dùng câu gắn với bản thân và tự gọi lại sau một hoạt động khác. Mỗi bài có 3–5 chunks mới, phần ôn tách riêng, hội thoại thực tế, bài tập nói và đáp án cuối bài. Mục tiêu là tự sử dụng, không phải chỉ nhận ra đáp án.

Lịch ôn mặc định sau lần sử dụng thành công: 1, 3, 7, 14, 30, 60 ngày. Kết quả yếu đưa bài về ngày tiếp theo. Đây là lịch khởi đầu có thể điều chỉnh bằng việc ôn sớm, không phải lời hứa nhớ lâu cho mọi người.

## Chạy và kiểm tra

Cần Ruby 3.3, Bundler và Python 3.

```sh
python3 -m pip install -r requirements-dev.txt
python3 scripts/validate-content.py
python3 scripts/test-validation.py
bundle install
bundle exec jekyll build
python3 scripts/validate-content.py --site _site
bundle exec jekyll serve
```

Mở `http://localhost:4000/practical-english-learning/`. URL tài nguyên và liên kết dùng `relative_url`, hỗ trợ GitHub Pages dưới đường dẫn repo. GitHub Actions build và kiểm tra PR; chỉ workflow deploy trên `main` mới xuất bản website.

Browser smoke checks (cần Node, Playwright và Chromium):

```sh
npm install --no-save --package-lock=false playwright
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium node scripts/smoke-ui.cjs
```

Mặc định script kiểm tra website tại `http://127.0.0.1:4000/practical-english-learning/`; đặt `TEST_BASE_URL` để kiểm tra nơi khác. Không cần Node để build hay dùng website.

Validation kiểm tra metadata, ID, tham chiếu chunks/scenarios/prerequisites, vòng lặp prerequisite, số chunks, bốn bước, đáp án và liên kết trong bản build. Review bằng người vẫn cần cho tính tự nhiên và sự khác biệt về mục tiêu giao tiếp.

## Quyền riêng tư và nguồn

Không đưa câu trả lời hoặc log thật lên Git. Lưu log file trong `private/`; Git và Jekyll đều loại thư mục này. `work/`, script, dependency và file tạm cũng không nằm trong website. Trang skill, phương pháp và nguồn vẫn có thể truy cập qua tài liệu, nhưng không chiếm luồng học chính.

Xem [source policy](agent-skill/source-policy.md). Nguồn học chỉ giữ nội dung đã làm sạch; không đưa tên, địa chỉ liên hệ, account hoặc metadata nhận dạng vào bài.
