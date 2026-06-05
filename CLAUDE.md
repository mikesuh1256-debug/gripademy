# 그립학원 웹사이트 — Claude Code 작업 가이드

## 프로젝트 개요
- **학원명**: 매쓰그립 수학학원 + 잉그립 영어학원
- **도메인**: megrip.com (Vercel 호스팅, 가비아 도메인)
- **Firebase 프로젝트**: gripacademyweb1
- **노션 Integration 토큰**: Vercel 환경변수 `NOTION_TOKEN` 에 저장 (코드에 하드코딩 금지)
- **Cloudinary**: Cloud=`dca7oczdy`, Preset=`gripacademy` (이미지/동영상 업로드)
- **GitHub**: https://github.com/mikesuh1256-debug/gripacademy.git
- **배포**: GitHub push → Vercel 자동 배포 (Claude가 commit+push 자동 처리)

---

## 파일 구조

```
gripacademy/
├── index.html              ← 메인 랜딩페이지 (GA 트래킹, 모바일 반응형)
├── math.html               ← 매쓰그립 수학 세부페이지
├── english.html            ← 잉그립 영어 세부페이지
├── admin.html              ← 간단 관리자 (GA링크, ID:mikesuh7)
├── portal.html             ← 학부모 포털 ★ 아파트앱 스타일
├── teacher.html            ← 선생님 포털 ★ 아파트앱 스타일
├── portal-admin.html       ← 관리자 포털 ★ 주요 작업 파일
├── board.html              ← 게시판 (학부모/선생님용, 이미지/동영상)
├── chat.html               ← 톡방 (실시간 채팅, Firestore)
├── schedule.html           ← 학사일정 (노션 연동)
├── vercel.json             ← Vercel 설정
├── api/
│   ├── schedule.js         ← 노션 학사일정 API (±6개월, role 파라미터)
│   └── import-students.js  ← 노션 학생 DB 가져오기
└── assets/images/
    ├── logo/               ← grip-icon.png
    └── photos/             ← 시설 사진들
```

---

## Firebase 구조 (Firestore Collections)

| 컬렉션 | 용도 |
|--------|------|
| `users` | 로그인 사용자 역할 (admin/teacher/parent) |
| `students` | 학생 정보 (status: 재원/퇴원/삭제) |
| `classes` | 반 정보 (영어/수학 반) |
| `grades` | 성적 기록 |
| `attendance` | 출결 기록 |
| `attitude` | 태도 기록 |
| `posts` | 게시판 글 (category, imageURLs, isPinned) |
| `class_logs` | 수업일지 |
| `student_records` | 학생 일일기록 |
| `payments` | 수납 기록 |
| `textbooks` | 교재 재고 |
| `textbook_assignments` | 학생별 교재 배정 |
| `chatRooms` | 톡방 (participantIds[], lastMessage) |
| `chatRooms/{id}/messages` | 채팅 메시지 (실시간) |

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

## 포털 공통 UI (아파트앱 스타일)

모든 포털(학부모/선생님/관리자)이 동일한 스타일 적용:
- 그라디언트 헤더 (#1e2a6d → #19b1c6)
- 그립학원 로고 + 이름
- 인사말: "안녕하세요? [이름] 학부모님/선생님/원장님 👋"
- 이름 추출 규칙: 3자↑ → 성 제거, 2자 → 성 제거(1자만), 1자 → 그대로
- 고정 서브 네비 (가로 스크롤 버튼)
- 아이콘 그리드 (박스 없이 이모지+텍스트)
- 하단 네비바

---

## portal.html (학부모 포털)

**주요 기능:**
- 아이콘 그리드: 공지사항→board.html, 톡방→chat.html, 학사일정, 수업자료, 수상, 성적, 출결, 내정보
- 서브 네비: 홈 / 마이페이지 / 공지 / 톡방 / 블로그(예정) / 유튜브(예정)
- 벨 아이콘: 새 채팅 오면 빨간 점 알림
- 최신 공지 미리보기 (board.html 연동)
- 다가오는 일정 미리보기 (role=admin 전체 일정)
- MY 페이지: 성적/출결/태도/일정 탭

---

## portal-admin.html (관리자 포털)

### 탭 구조 (8개)
1. **학생 관리** — 학생 목록, 추가, 검색/필터
2. **반 관리** — 반 만들기, 반 목록, 학생 배정
3. **교재 관리** — 교재 입고/재고, 반별 학생 교재 배정
4. **DB 가져오기** — 노션에서 학생 전체 불러오기
5. **계정 생성** — Firebase Auth 계정 등록
6. **전체 일정** — 노션 학사일정 목록/캘린더 뷰
7. **게시판** — 글 작성/수정/삭제, Cloudinary 이미지/동영상 업로드
8. **톡방 관리** — 채팅방 만들기, 학생→학부모 uid 자동 매핑

### 학생 관리 특이사항
- 삭제 → 소프트딜리트 (status:'삭제', 복원 가능)
- 퇴원 처리 → status:'퇴원' (복원 가능)
- 퇴원/삭제 학생은 별도 섹션에서 관리, 복원 버튼 제공

---

## teacher.html (선생님 포털)

**기능:** 수업일지 / 학생기록 / 성적 / 출결 / 게시판 / 학사일정
**인사말:** 역할에 따라 "선생님" 또는 "원장님" 자동 표시
**타이틀 필드:** Firestore user document에 `title` 필드 추가하면 커스텀 직책 사용 가능

---

## board.html (게시판)

- Firebase Auth 필요 (학부모/선생님)
- 카테고리: 공지 / 수업자료 / 수상 / 가정통신문
- 이미지/동영상 Cloudinary 업로드
- 조회수 자동 카운트
- 고정글 상단 표시, 새 글 N 배지

---

## chat.html (톡방)

- Firebase Firestore 실시간 채팅 (onSnapshot)
- 참여 중인 방만 표시
- 이미지/동영상 전송 (Cloudinary)
- 관리자 포털에서 방 만들기 → 학생 선택 → 학부모 uid 자동 초대

---

## 노션 연동

| 기능 | DB ID |
|------|-------|
| 학사일정 | 1b2a6cf4db6a811b9f5ce34f2725857c |
| 학생 DB | 1b2a6cf4db6a81ee9273ce8e72ec29a7 |

**학사일정 role 파라미터:**
- `?role=admin` → 전체 (학부모/선생님 포털 모두 이걸 사용)
- `?role=parent` → 학부모 공개 일정만
- `?role=teacher` → 교사 관련 일정

**노션 토큰 갱신 방법:**
1. notion.so/my-integrations → 기존 통합 선택
2. New secret 생성
3. Vercel → Settings → Environment Variables → `NOTION_TOKEN` 업데이트
4. Redeploy

---

## 영어과 반 구조

**월수금 3:00-5:00**: Run_B(Emma), Run_C(Rita), Master A-1, Reach1(Jay/Rita), Reach2(Emma/Jay), Touch1(Emma/Rita)
**화목 3:30-6:00**: Catch2(Emma/Jay), Hold(Jay/Rita), Touch2(Emma/Rita)

선생님(영어): Emma, Rita, Jay
선생님(수학): 변선숙T, 오미경T, 안영균T, 박진희T, 권유경T

---

## 주의사항

- **토큰 보안**: Notion 토큰, Cloudinary 설정 등을 코드에 하드코딩하지 말 것 (GitHub secret scanning)
- **배포**: Claude가 commit+push 자동 처리 (별도 push 불필요)
- **캐시 문제**: 변경사항이 안 보이면 강력 새로고침 (Cmd+Shift+R)
- **모바일 캐시**: iOS Safari → 설정 → Safari → 방문기록 및 웹데이터 지우기

---

## 다음 세션 시작 방법

```
CLAUDE.md 읽고 이어서 작업해줘.
```
