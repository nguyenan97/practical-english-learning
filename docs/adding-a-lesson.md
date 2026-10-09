---
title: Thêm bài học mới
lang: vi
---

# Thêm bài mới mà không sửa nhiều danh sách

## Nguồn dữ liệu chính

- `lessons/*.md`: metadata và nội dung bài hoàn chỉnh.
- `_data/chunks.yml`: ID, nghĩa, mẫu câu và tình huống của từng chunk.
- `_data/phrase_groups.yml`: nhóm tình huống để tra câu.
- `scenarios/*.md`: vai, mục tiêu, các lượt đối thoại và nhánh thay đổi.
- `templates/`: mẫu để thêm nội dung.
- `sources/`: nguồn học đã làm sạch; không phải câu nào cũng đã được khuyến nghị về cách dùng.
- `methods/`: nguyên tắc học; `agent-skill/`: hướng dẫn cho agent.

Trang chủ, danh sách bài và scenario lấy dữ liệu từ front matter khi Jekyll build. Thêm bài không cần sửa danh sách điều hướng thủ công.

## Quy trình

1. Đọc các bài đã có và learning history riêng nếu người học cung cấp. Chọn một mục tiêu giao tiếp khác. Không có history thì không khẳng định người học chưa từng học mục tiêu này.
2. Chọn 3–5 chunks mới. Thêm ID ổn định vào `_data/chunks.yml`; không tạo ID khác cho cùng chunk chỉ để tránh kiểm tra trùng.
3. Sao chép [lesson template]({{ '/templates/lesson-template.html' | relative_url }}) thành `lessons/YYYY-MM-DD-topic.md`. Điền metadata thật, `order` duy nhất và các ID tham chiếu.
4. Viết đúng 4 bước, dùng ba marker `<!-- step -->` và một marker `<!-- answers -->`. Giữ nguyên marker; layout dùng chúng để chia nội dung.
5. Thêm scenario từ [scenario template]({{ '/templates/scenario-template.html' | relative_url }}), gồm 6–10 lượt mẫu, lượt chỉ dành cho đối tác, một nhánh thay đổi và đổi vai.
6. Viết đáp án đầy đủ. Câu hỏi mở có nhiều đáp án đúng; ghi rõ câu mẫu và tiêu chí đánh giá.
7. Chạy kiểm tra và build; mở trang chủ, bài mới, phrase bank và scenario ở màn hình rộng và nhỏ.
8. Review tính tự nhiên, độ khó, mục tiêu không trùng và dữ liệu đã ẩn danh. Kiểm tra ID không thay thế review sư phạm.
9. Commit trên branch riêng, push và tạo PR. Không đưa log người học vào PR.

## Metadata

`lesson_id`, `lesson_key`, `order` phải duy nhất. `date` là ngày xuất bản bài, không phải ngày người học hoàn thành. `new_chunk_ids` và `review_chunk_ids` tách nội dung mới khỏi ôn. Chỉ thêm `prerequisite_lesson_ids` nếu bài thực sự cần kiến thức đó; không dùng để buộc học theo thứ tự khi không cần.

`scenario_id` trỏ tới scenario của bài. Scenario dùng `lesson_id_ref` để liên kết ngược. Chunk dùng `lesson_id` để trỏ tới bài giới thiệu chunk đó.

## Kiểm tra tại máy

```sh
python3 -m pip install -r requirements-dev.txt
python3 scripts/validate-content.py
python3 scripts/test-validation.py
bundle install
bundle exec jekyll build
python3 scripts/validate-content.py --site _site
bundle exec jekyll serve
```

Chạy kiểm tra frontend bằng Playwright theo hướng dẫn trong README. CI cũng kiểm tra nội dung và build trên pull request, tách khỏi deploy chỉ chạy khi cập nhật `main`.
