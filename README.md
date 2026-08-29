# 실버문 브랜드 홈페이지

주방, 거실, 캠핑을 위한 스테인리스 디자인 제품 셀렉트 브랜드 **실버문**의 정적 홈페이지입니다.

## 페이지

- `index.html` — 홈과 대표 제품
- `about.html` — 브랜드 및 운영자 소개
- `products.html` — `products.json`을 읽어 만드는 제품 목록
- `stories.html` — 브랜드 이야기와 블로그 목록
- `contact.html` — 이메일 문의 폼

## 미리보기

별도의 빌드 과정이 없습니다. 다만 제품 목록은 JSON을 읽으므로 `file://`로 직접 열기보다 간단한 정적 파일 서버나 GitHub Pages에서 확인해야 합니다.

## 제품 추가

제품은 `products.json` 배열에 아래 형식의 항목만 추가하면 홈의 대표 제품과 제품 페이지에 자동 반영됩니다. 홈에는 배열의 앞 3개가 표시됩니다.

```json
{
  "name": "제품명",
  "price": 120000,
  "image": "https://이미지-주소.jpg",
  "url": "https://구매-링크"
}
```

## 먼저 바꿀 내용

1. `hello@silvermoon.kr`, `@silvermoon.objects`를 실제 연락처로 교체
2. `products.json`에 실제 제품을 추가하거나 순서 변경
3. 소개 문구와 SNS 주소 교체
4. 이야기 글을 실제 게시물 링크로 연결

`assets/silvermoon-products.png`는 첫 화면 구성을 위해 생성한 임시 제품 이미지입니다.
