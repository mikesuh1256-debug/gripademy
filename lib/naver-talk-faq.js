'use strict';

const APPLY_URL = 'https://megrip.com/apply';

const CODES = Object.freeze({
  ROOT: 'faq:root',
  CONSULT: 'faq:category:consult',
  CLASS: 'faq:category:class',
  ACADEMY: 'faq:category:academy',
  CONSULT_PROCESS: 'faq:answer:consult-process',
  CONSULT_FORM: 'faq:answer:consult-form',
  GRADE_SCHEDULE: 'faq:answer:grade-schedule',
  SUBJECT_SCHEDULE: 'faq:answer:subject-schedule',
  TUITION: 'faq:answer:tuition',
  LOCATION: 'faq:answer:location',
  MANAGEMENT: 'faq:answer:management',
  CONSULT_HOURS: 'faq:answer:consult-hours',
  STUDENT_INQUIRY: 'faq:answer:student-inquiry',
});

const CATEGORIES = Object.freeze({
  [CODES.CONSULT]: {
    title: '상담·등록',
    prompt: '상담과 등록에 관해 궁금한 내용을 선택해 주세요.',
    answers: [CODES.CONSULT_PROCESS, CODES.CONSULT_FORM, CODES.CONSULT_HOURS],
  },
  [CODES.CLASS]: {
    title: '수업·수강료',
    prompt: '수업시간과 수강료에 관해 궁금한 내용을 선택해 주세요.',
    answers: [CODES.GRADE_SCHEDULE, CODES.SUBJECT_SCHEDULE, CODES.TUITION],
  },
  [CODES.ACADEMY]: {
    title: '학원·학생관리',
    prompt: '학원 이용과 학생관리에 관해 궁금한 내용을 선택해 주세요.',
    answers: [CODES.LOCATION, CODES.MANAGEMENT, CODES.STUDENT_INQUIRY],
  },
});

const ANSWERS = Object.freeze({
  [CODES.CONSULT_PROCESS]: {
    title: '상담등록 절차',
    category: CODES.CONSULT,
    keywords: ['상담등록', '등록절차', '상담절차', '입학절차'],
    text: '안녕하세요. 상담 등록은 ① 상담신청서 작성 ② 담당자 확인 및 전화상담 ③ 레벨테스트·방문상담 ④ 학생에게 맞는 반과 수업 안내 ⑤ 등록 확정 순서로 진행됩니다.',
  },
  [CODES.CONSULT_FORM]: {
    title: '상담신청서',
    category: CODES.CONSULT,
    keywords: ['상담신청서', '신청서', '상담신청', '입학상담'],
    text: '입학상담을 원하시면 상담신청서를 작성해 주세요. 학생의 학년·학교·희망 과목·현재 학습 상황·원하시는 상담 시간을 적어주시면 확인 후 연락드리겠습니다.',
  },
  [CODES.GRADE_SCHEDULE]: {
    title: '학년별 시간표',
    category: CODES.CLASS,
    keywords: ['학년별', '학년시간', '학년별시간표', '학년별수업'],
    text: '학년별 수업 요일과 시간은 현재 학년뿐 아니라 진도와 레벨, 배정 반에 따라 달라집니다. 학생의 학년과 희망 과목을 상담신청서에 남겨주시면 가능한 반의 요일과 시간을 안내해 드리겠습니다.',
  },
  [CODES.SUBJECT_SCHEDULE]: {
    title: '과목별 시간표',
    category: CODES.CLASS,
    keywords: ['과목별', '과목시간', '수학시간', '영어시간', '수업시간', '요일'],
    text: '과목별 기본 운영시간은 수학 평일 오후 3시~9시, 영어 월·수·금 오후 3시~5시 / 화·목 오후 3시 30분~6시입니다. 반별 요일과 시간은 레벨테스트 및 상담 후 확정됩니다.',
  },
  [CODES.TUITION]: {
    title: '초중등 수강료',
    category: CODES.CLASS,
    keywords: ['수강료', '학원비', '교육비', '초등수강료', '중등수강료'],
    text: '초등·중등 수강료는 과목, 학년, 수업 형태, 주당 수업 횟수에 따라 달라집니다. 학생의 학년과 희망 과목을 상담신청서에 남겨주시면 정확한 수강료를 안내해 드리겠습니다.',
  },
  [CODES.LOCATION]: {
    title: '주소·주차',
    category: CODES.ACADEMY,
    keywords: ['주소', '위치', '주차', '찾아가는길', '오시는길'],
    text: '학원은 서울 서대문구 가재울미래로 17, 7층에 있습니다. 주차가 필요하시면 방문 전에 말씀해 주세요. 이용 가능한 주차 방법을 확인해 안내드리겠습니다.\n\n전화 02-3152-5678',
  },
  [CODES.MANAGEMENT]: {
    title: '학생관리시스템',
    category: CODES.ACADEMY,
    keywords: ['학생관리', '관리시스템', '숙제관리', '출결', '성적관리'],
    text: '매쓰그립 수학과 잉그립 영어는 출결, 숙제·학습기록, 시험·성적, 보강, 상담 및 학부모 피드백을 학생별로 관리합니다. 수학은 풀이 과정과 단원별 학습을, 영어는 단어·문법·백지테스트 등 학습 과정을 함께 기록하며, 등록 후 이용 방법을 안내해 드립니다.',
  },
  [CODES.CONSULT_HOURS]: {
    title: '평일 상담',
    category: CODES.CONSULT,
    keywords: ['평일상담', '상담시간', '상담가능', '전화상담'],
    text: '전화 및 톡톡 상담은 평일 오후 2시~8시에 가능합니다. 상담 시간 외에는 학생 이름, 학년, 희망 과목과 문의 내용을 남겨주시면 확인 후 순서대로 답변드리겠습니다.\n\n전화 02-3152-5678',
  },
  [CODES.STUDENT_INQUIRY]: {
    title: '학생·과목 문의',
    category: CODES.ACADEMY,
    keywords: ['학생이름', '과목문의', '학생문의', '수학문의', '영어문의'],
    text: '학생에게 맞는 정확한 안내를 위해 학생 이름, 학년·학교, 희망 과목, 현재 학습 상황과 문의 내용을 상담신청서에 작성해 주세요. 담당자가 확인한 뒤 원하시는 상담 시간에 연락드리겠습니다.',
  },
});

function textButton(title, code) {
  return { type: 'TEXT', data: { title, code } };
}

function linkButton(title, url = APPLY_URL) {
  return { type: 'LINK', data: { title, url, mobileUrl: url } };
}

function textMessage(text, buttons = []) {
  const textContent = { text };
  if (buttons.length) {
    textContent.quickReply = { buttonList: buttons };
  }
  return { event: 'send', textContent };
}

function rootMessage(prefix = '') {
  const message = [
    prefix,
    '안녕하세요. 매쓰그립 수학·잉그립 영어·씨앤에이논술 통합 상담실입니다.',
    '궁금하신 내용을 아래 메뉴에서 선택해 주세요.',
    '상담 가능 시간은 평일 오후 2시~8시입니다.',
  ].filter(Boolean).join('\n\n');

  return textMessage(message, [
    textButton(CATEGORIES[CODES.CONSULT].title, CODES.CONSULT),
    textButton(CATEGORIES[CODES.CLASS].title, CODES.CLASS),
    textButton(CATEGORIES[CODES.ACADEMY].title, CODES.ACADEMY),
    linkButton('상담신청'),
  ]);
}

function categoryMessage(code) {
  const category = CATEGORIES[code];
  if (!category) return rootMessage();

  return textMessage(category.prompt, [
    ...category.answers.map(answerCode => textButton(ANSWERS[answerCode].title, answerCode)),
    textButton('처음으로', CODES.ROOT),
  ]);
}

function answerMessage(code) {
  const answer = ANSWERS[code];
  if (!answer) return rootMessage();

  return textMessage(answer.text, [
    linkButton('상담신청'),
    textButton('이전메뉴', answer.category),
    textButton('처음으로', CODES.ROOT),
  ]);
}

function compactText(value) {
  return String(value || '').toLowerCase().replace(/[\s·ㆍ.,!?/()-]/g, '');
}

function codeFromTypedText(text) {
  const normalized = compactText(text);
  if (!normalized) return null;
  if (['메뉴', '처음', '처음으로', '시작', '도움말'].some(word => normalized === compactText(word))) {
    return CODES.ROOT;
  }

  for (const [code, category] of Object.entries(CATEGORIES)) {
    if (compactText(category.title) === normalized) return code;
  }

  for (const [code, answer] of Object.entries(ANSWERS)) {
    const candidates = [answer.title, ...answer.keywords].map(compactText);
    if (candidates.some(keyword => normalized.includes(keyword) || keyword.includes(normalized))) {
      return code;
    }
  }
  return null;
}

function handleTalkEvent(body) {
  if (!body || typeof body !== 'object') return null;

  if (body.event === 'open') {
    if (body.options && body.options.unreadMessage === true) return null;
    return rootMessage();
  }

  if (body.event !== 'send' || !body.textContent) return null;

  const code = body.textContent.code || codeFromTypedText(body.textContent.text);
  if (code === CODES.ROOT) return rootMessage();
  if (CATEGORIES[code]) return categoryMessage(code);
  if (ANSWERS[code]) return answerMessage(code);

  return rootMessage('문의하신 내용은 담당자가 확인해 답변드리겠습니다. 빠른 안내는 아래 메뉴를 이용해 주세요.');
}

module.exports = {
  ANSWERS,
  APPLY_URL,
  CATEGORIES,
  CODES,
  answerMessage,
  categoryMessage,
  codeFromTypedText,
  handleTalkEvent,
  rootMessage,
};
