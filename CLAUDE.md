# 그립학원 웹사이트 — Claude Code 작업 가이드

## 프로젝트 개요
매쓰그립 수학학원 + 잉그립 영어학원 통합 웹사이트  
기존 HTML 프로토타입을 기반으로 **로고 이미지 + 실사 사진** 삽입 작업

---

## 폴더 구조 (이미지 추가 후 완성형)

```
gripacademy/
├── index.html          ← 메인 통합 페이지 (완성)
├── math.html           ← 매쓰그립 수학 세부 페이지 (완성)
├── english.html        ← 잉그립 영어 세부 페이지 (완성)
├── CLAUDE.md           ← 이 파일
└── assets/
    ├── images/
    │   ├── logo/
    │   │   ├── math-logo-vertical.png     ← 매쓰그립 수직형 로고 (검정배경)
    │   │   ├── math-logo-horizontal.png   ← 매쓰그립 수평형 로고 (검정배경)
    │   │   ├── eng-logo-vertical.png      ← 잉그립 수직형 로고 (검정배경)
    │   │   └── eng-logo-horizontal.png    ← 잉그립 수평형 로고 (검정배경)
    │   └── photos/
    │       ├── director.jpg               ← 원장님 사진 (정면, 증명사진 or 강의 중)
    │       ├── classroom-math.jpg         ← 수학 강의실 / 수업 장면
    │       ├── classroom-eng.jpg          ← 영어 강의실 / 수업 장면
    │       ├── students-math.jpg          ← 수학 수업 중 학생들
    │       ├── students-eng.jpg           ← 영어 수업 중 학생들
    │       └── campus.jpg                 ← 학원 외관 or 내부 전경
```

---

## 작업 목록 (Claude Code에서 순서대로 실행)

### TASK 1 — 폴더 생성
```bash
mkdir -p assets/images/logo
mkdir -p assets/images/photos
```

### TASK 2 — 로고 이미지 삽입

**파일**: `index.html`, `math.html`, `english.html`

#### index.html — NAV 로고 교체
현재 텍스트로만 된 로고를 이미지로 교체.

```html
<!-- 교체 전 (현재) -->
<a href="math.html" class="nav-logo-math">MATH<span>GRIP</span> 수학학원</a>

<!-- 교체 후 -->
<a href="math.html" class="nav-logo-math">
  <img src="assets/images/logo/math-logo-horizontal.png"
       alt="매쓰그립 수학학원"
       style="height:32px; width:auto; object-fit:contain;">
</a>
```

```html
<!-- 교체 전 (현재) -->
<a href="english.html" class="nav-logo-eng">ING<span>GRIP</span> 영어학원</a>

<!-- 교체 후 -->
<a href="english.html" class="nav-logo-eng">
  <img src="assets/images/logo/eng-logo-horizontal.png"
       alt="잉그립 영어학원"
       style="height:32px; width:auto; object-fit:contain;">
</a>
```

#### index.html — FOOTER 로고 교체
```html
<!-- 교체 전 -->
<div class="footer-logo-math">MATH<span>GRIP</span> 수학학원</div>
<div class="footer-logo-eng">ING<span>GRIP</span> 영어학원</div>

<!-- 교체 후 -->
<img src="assets/images/logo/math-logo-horizontal.png" alt="매쓰그립 수학학원"
     style="height:28px; width:auto; filter:brightness(0) invert(1); opacity:0.8;">
<img src="assets/images/logo/eng-logo-horizontal.png" alt="잉그립 영어학원"
     style="height:28px; width:auto; filter:brightness(0) invert(1); opacity:0.8;">
```

#### math.html — NAV 로고 교체
```html
<!-- 교체 전 -->
<div class="nav-brand-text">MATH<span>GRIP</span> 수학학원</div>

<!-- 교체 후 -->
<img src="assets/images/logo/math-logo-horizontal.png"
     alt="매쓰그립 수학학원"
     style="height:34px; width:auto; object-fit:contain;">
```

#### english.html — NAV 로고 교체
```html
<!-- 교체 전 -->
<div class="nav-brand-text">ING<span>GRIP</span> 영어학원</div>

<!-- 교체 후 -->
<img src="assets/images/logo/eng-logo-horizontal.png"
     alt="잉그립 영어학원"
     style="height:34px; width:auto; object-fit:contain;">
```

---

### TASK 3 — 원장님 사진 삽입

**파일**: `index.html`  
**위치**: DIRECTOR 섹션 — 현재 이니셜 원형(`<div class="director-initials">서</div>`) 대체

```html
<!-- 교체 전 -->
<div class="director-initials">서</div>

<!-- 교체 후 -->
<img src="assets/images/photos/director.jpg"
     alt="서명은 원장"
     style="width:120px; height:120px; border-radius:50%;
            object-fit:cover; object-position:top center;
            border:3px solid rgba(25,177,198,0.4);
            margin:0 auto 20px; display:block;">
```

---

### TASK 4 — 수학 페이지 사진 삽입

**파일**: `math.html`  
**위치**: HERO 섹션 하단 또는 TRACK 섹션 사이에 배치

HERO 섹션 `</section>` 바로 위에 아래 코드 삽입:
```html
<!-- 캠퍼스/수업 사진 배너 -->
<div style="display:grid; grid-template-columns:1fr 1fr; height:320px; overflow:hidden;">
  <img src="assets/images/photos/classroom-math.jpg"
       alt="수학 강의실"
       style="width:100%; height:100%; object-fit:cover; display:block;">
  <img src="assets/images/photos/students-math.jpg"
       alt="수학 수업 장면"
       style="width:100%; height:100%; object-fit:cover; display:block;">
</div>
```

---

### TASK 5 — 영어 페이지 사진 삽입

**파일**: `english.html`  
**위치**: HERO 섹션 직후

HERO `</section>` 바로 다음에 삽입:
```html
<div style="display:grid; grid-template-columns:1fr 1fr; height:320px; overflow:hidden;">
  <img src="assets/images/photos/classroom-eng.jpg"
       alt="영어 강의실"
       style="width:100%; height:100%; object-fit:cover; display:block;">
  <img src="assets/images/photos/students-eng.jpg"
       alt="영어 수업 장면"
       style="width:100%; height:100%; object-fit:cover; display:block;">
</div>
```

---

### TASK 6 — 메인 campus 사진 삽입 (선택)

**파일**: `index.html`  
**위치**: BANNER 섹션과 PROGRAMS 섹션 사이

```html
<!-- 학원 전경 풀블리드 사진 -->
<div style="height:400px; overflow:hidden; position:relative;">
  <img src="assets/images/photos/campus.jpg"
       alt="학원 전경"
       style="width:100%; height:100%; object-fit:cover; object-position:center;
              filter:brightness(0.7);">
  <div style="position:absolute; inset:0; display:flex; align-items:center;
              justify-content:center; flex-direction:column; gap:12px;">
    <p style="font-size:12px; letter-spacing:4px; color:rgba(255,255,255,0.6);
              text-transform:uppercase; font-family:'Montserrat',sans-serif;">
      서울 서대문구 가재울
    </p>
    <p style="font-size:28px; font-weight:700; color:#fff; letter-spacing:-0.5px;">
      15년 전통의 명문 학원
    </p>
  </div>
</div>
```

---

## 로고 파일 배경 처리 안내

현재 로고 PNG 파일들이 **검정 배경**으로 되어 있음.

### 옵션 A — 배경 제거 (권장)
로고 PNG를 투명 배경으로 변환 후 사용.  
무료 도구: [remove.bg](https://www.remove.bg) 또는 Photoshop

### 옵션 B — CSS mix-blend-mode 활용 (즉시 가능)
배경 제거 없이 검정 배경 로고를 흰 배경에 올릴 때:
```css
.nav-logo-math img,
.nav-logo-eng img {
  mix-blend-mode: multiply;  /* 흰 배경에서 검정 배경 제거 효과 */
}
```
어두운 배경(HERO, DIRECTOR 섹션)에서는:
```css
img.logo-on-dark {
  filter: brightness(0) invert(1);  /* 검정 로고 → 흰색으로 반전 */
}
```

### 옵션 C — CSS filter로 색상 맞추기
```css
/* 검정 로고를 매쓰그립 네이비(#1e2a6d)로 */
img.math-logo {
  filter: brightness(0) saturate(100%)
          invert(13%) sepia(52%) saturate(1200%)
          hue-rotate(210deg) brightness(90%) contrast(95%);
}
/* 검정 로고를 잉그립 그린(#00391e)으로 */
img.eng-logo {
  filter: brightness(0) saturate(100%)
          invert(16%) sepia(63%) saturate(900%)
          hue-rotate(120deg) brightness(85%) contrast(95%);
}
```

---

## 브랜드 컬러 정리

| 학원 | 메인 | 포인트 | 서브 |
|------|------|--------|------|
| 매쓰그립 수학 | `#1e2a6d` | `#19b1c6` | `#7e7e7f` |
| 잉그립 영어 | `#00391e` | `#ec6619` | `#7e7e7f` |

---

## Claude Code 실행 순서 요약

```
1. cd gripacademy
2. mkdir -p assets/images/logo assets/images/photos
3. 로고 PNG 파일 → assets/images/logo/ 에 복사
4. 사진 파일 → assets/images/photos/ 에 복사
5. Claude Code에게 이 CLAUDE.md 파일 읽게 하고 TASK 순서대로 실행 요청
6. 브라우저에서 index.html 열어서 확인
```

---

## 배포 준비 (옵션)

로컬 확인 완료 후 실제 배포를 원하면:
- **Vercel**: `vercel deploy` (무료, 빠름)
- **GitHub Pages**: `git push` 후 자동 배포
- **카페24/가비아**: FTP로 파일 업로드

현재 구조는 순수 정적 HTML이므로 **어떤 호스팅이든 그대로 올리면 됨.**
