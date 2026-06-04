# 그립학원 웹사이트 — Claude Code 작업 가이드

## 프로젝트 개요
- **학원명**: 매쓰그립 수학학원 + 잉그립 영어학원
- **도메인**: megrip.com (Vercel 호스팅, 가비아 도메인)
- **Firebase 프로젝트**: gripacademyweb1
- **노션 Integration 토큰**: Vercel 환경변수 NOTION_TOKEN에 저장 (코드에 하드코딩 금지)
- **Cloudinary**: Cloud=dca7oczdy, Preset=gripacademy (이미지/동영상 업로드)
- **GitHub**: https://github.com/mikesuh1256-debug/gripacademy.git
- **배포**: GitHub push → Vercel 자동 배포 (Claude가 push까지 자동 처리)

---

## 파일 구조

```
gripacademy/
├── index.html              ← 메인 랜딩페이지
├── math.html               ← 매쓰그립 수학 세부페이지
├── english.html            ← 잉그립 영어 세부페이지
├── admin.html              ← 간단 관리자 (GA링크, ID:mikesuh7)
├── portal.html             ← 학부모 포털 (Firebase Auth)
├── teacher.html            ← 선생님 포털 (Firebase Auth)
├── portal-admin.html       ← 관리자 포털 (Firebase Auth) ★ 주요 작업 파일
├── schedule.html           ← 학사일정 (노션 연동)
├── vercel.json             ← Vercel 설정
├── api/
│   ├── schedule.js         ← 노션 학사일정 API (±6개월, role 파라미터)
│   └── import-students.js  ← 노션 학생 DB 가져오기
├── board.html              ← 게시판 (학부모/선생님용)
├── chat.html               ← 톡방 (실시간 채팅)
└── assets/images/
    ├── logo/               ← 로고 파일들 (grip-icon.png 포함)
    └── photos/
```

---

## Firebase 구조 (Firestore Collections)

| 컬렉션 | 용도 |
|--------|------|
| `users` | 로그인 사용자 역할 (admin/teacher/parent) |
| `students` | 학생 정보 155명 (노션에서 가져옴) |
| `classes` | 반 정보 (영어/수학 반) |
| `grades` | 성적 기록 |
| `attendance` | 출결 기록 |
| `attitude` | 태도 기록 |
| `posts` | 게시판 |
| `class_logs` | 수업일지 |
| `student_records` | 학생 일일기록 |
| `payments` | 수납 기록 |
| `textbooks` | 교재 재고 |
| `textbook_assignments` | 학생별 교재 배정 |

---

## 계정 정보

| 역할 | 이메일 | 비고 |
|------|--------|------|
| 관리자(원장님) | mikesuh1256@gmail.com | Firestore role: admin |
| 선생님 예시 | gripaca5612@gmail.com | Firestore role: teacher |

---

## 브랜드 컬러
- 매쓰그립(수학): **#1e2a6d** (포인트 #19b1c6)
- 잉그립(영어): **#00391e** (포인트 #ec6619)
- 논술: **#ec6619**

---

## portal-admin.html — 현재 구현된 기능

### 탭 구조 (6개)
1. **학생 관리** — 학생 목록, 추가, 검색/필터, 상세 모달
2. **반 관리** — 반 만들기, 반 목록, 학생 배정
3. **교재 관리** — 교재 입고/재고, 반별 학생 교재 배정
4. **DB 가져오기** — 노션에서 학생 전체 불러오기, 전체 삭제
5. **계정 생성** — Firebase Auth 계정 등록
6. **전체 일정** — 노션 학사일정 목록/캘린더 뷰

---

### 학생 관리

**학생 목록**
- 이름 옆 사진 미니 썸네일 (직사각형, 클릭 시 라이트박스)
- 수/영/논 동그라미 수강과목 표시
- 학교 헤더 클릭 → 학교별 그룹 정렬 (인원수 표시)
- 학년 헤더 클릭 → 학년별 그룹 정렬
- 연락처 tel: 링크 (모바일 바로 전화)
- 필터: 이름검색, 학년, 과목, **반 이름**, **선생님 이름**
- 관리 버튼: 수정(파란) + 삭제(빨간)

**학생 정보 모달 (3탭)**
- 상단 "학생 정보 편집" 타이틀
- 사진: 직사각형(100×130), 클릭→라이트박스, 변경→크롭 모달
  - 크롭 모달: 드래그 위치조정 + 슬라이더 확대/축소
- 기본정보: 이름/학년/학교/생년월일/성별/주소/학생연락처/학부모연락처1,2/메모
- **수강과목**: 수학/영어/논술 개별 토글 버튼 (courses 배열 저장)
- 반 배정 탭: 수학반/영어반 분리, 담임+요일시간 표시, 최초등록일
- 수납 탭: 수강료/교재비 구분, 총 수납금액 하단 고정

**학생 데이터 모델 (Firestore students)**
```
name, grade, school, courses[], course(하위호환),
birthday, gender, address, studentPhone,
phone, parentRelation1, phone2, parentRelation2,
memo, status(재원/퇴원), notionId, photoURL, createdAt
```

---

### 반 관리

**반 만들기**
- 수학반/영어반 2컬럼 폼
- 반구분: 초등/중등/고등수학, 초등/중등/고등영어
- 담임 드롭다운: 수학(변선숙T·오미경T·안영균T·박진희T·권유경T), 영어(Emma·Rita·Jay)
- 강의실: 601~603호, 6층/7층 그립룸, 701~708호

**반 목록**
- 2단계 필터: 카테고리 → 요일 서브메뉴
- 정렬 버튼: 기본순/담임별/강의실별/반이름순
- 구분 컬럼: 수학=#1e2a6d 배경, 영어=#00391e 배경
- 수정(인라인): 반명/구분/요일시간/담임/강의실 즉시 편집
- **반이름 클릭 → 아코디언 학생 관리**
  - 상단: 현재 등록 학생 pill (✕로 즉시 제외)
  - 하단: 이름 검색 → 결과 체크(누적) → 등록 버튼
  - 등록 시: 수학반→수학 과목 자동 추가, 영어반→영어 자동 추가

**반 데이터 모델 (Firestore classes)**
```
name, subject(math/english), category(math_elem 등),
days, time, schedule, teacherName, classroom,
studentIds[], createdAt
```

**카테고리 매핑**
- math_elem/math_mid/math_high
- english_elem/english_mid/english_high

---

### 교재 관리

- 교재 입고: 교재명/출판사/수량/단가/과목 → Firestore textbooks
- 재고 추가/삭제
- 반 선택 → 학생 목록 + 배정된 교재 표시
- 교재 배정 → 재고 자동 차감 / 취소 → 재고 복구

---

### DB 가져오기 (노션 연동)

**노션 필드명 (실제 확인된 컬럼명)**
- 이름: title 필드
- 학교: `학교`
- 학년: `학년`
- 수학 등록: `수학 등록` (체크박스)
- 영어 등록: `영어 등록` (체크박스)
- 논술 등록: `논술 등록` (체크박스)
- 보호자 연락처: `보호자 연락처` (쉼표로 phone/phone2 분리)
- 학생 연락처: `학생 연락처`

**import 흐름**
1. 전체 학생 삭제 (빨간 버튼) → Firebase students 전체 삭제
2. 노션에서 불러오기 → 진행률 바 표시 (1명당 갱신)
3. 전체 Firebase에 저장 → 완료 시 학생 관리 탭 자동 이동

---

### 전체 일정

- Netlify function: `/.netlify/functions/schedule?role=admin`
- 날짜 범위: ±6개월
- **목록 뷰**: 월별 그룹, 날짜블록+일정명+부서뱃지
- **캘린더 뷰**: 월 그리드, 날짜에 색상 점(●), 클릭 → 해당 월 일정 목록
- 부서 색상: 원장만=빨강, 영어과=초록, 수학과=파랑, 전체학원=보라

---

## UI 디자인 현황

**전체 스타일**
- 배경: #f7f8fc, 기본 폰트: 15px
- 탭: 3열(모바일)/6열(데스크탑) 그리드, 활성=남색 박스
- 콘텐츠: 흰 박스 하나, 내부 섹션은 구분선만
- 카드 박스 없음 (이전 중첩 박스 제거됨)

**반 관리 섹션**
- 반만들기: 수학 2.5px 남색 테두리, 영어 2.5px 초록 테두리
- 반목록: border 박스로 감싸기

---

## 영어과 반 구조

**월수금 3:00-5:00**: Run_B(Emma), Run_C(Rita), Master A-1, Reach1(Jay/Rita), Reach2(Emma/Jay), Touch1(Emma/Rita)  
**화목 3:30-6:00**: Catch2(Emma/Jay), Hold(Jay/Rita), Touch2(Emma/Rita)

선생님(영어): Emma, Rita, Jay  
선생님(수학): 변선숙T, 오미경T, 안영균T, 박진희T, 권유경T

---

## 노션 연동

| 기능 | DB ID |
|------|-------|
| 학사일정 | 1b2a6cf4db6a811b9f5ce34f2725857c |
| 학생 DB | 1b2a6cf4db6a81ee9273ce8e72ec29a7 |

학사일정 role 파라미터:
- `?role=parent` → 공지대상: 수학/영어학부모/전체학원
- `?role=teacher` → 해당부서: 영어과/수학과/전체학원
- `?role=admin` → 전체

---

## 다음 세션 시작 방법

```
CLAUDE.md 읽고 이어서 작업해줘.
```

**주의사항**
- push는 GitHub Desktop 또는 터미널 `git push origin main` 으로 직접 해야 함 (인증 문제)
- 작업 완료 후 항상 CLAUDE.md 업데이트하기
- 컨텍스트가 길어지면 새 세션 권장
