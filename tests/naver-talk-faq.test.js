'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  ANSWERS,
  CATEGORIES,
  CODES,
  codeFromTypedText,
  handleTalkEvent,
} = require('../lib/naver-talk-faq');

function buttonsOf(message) {
  return message.textContent.quickReply.buttonList;
}

test('open 이벤트는 대분류 메뉴와 상담신청 링크를 반환한다', () => {
  const response = handleTalkEvent({ event: 'open', options: { unreadMessage: false } });
  const buttons = buttonsOf(response);

  assert.equal(response.event, 'send');
  assert.deepEqual(buttons.slice(0, 3).map(button => button.data.code), [
    CODES.CONSULT,
    CODES.CLASS,
    CODES.ACADEMY,
  ]);
  assert.equal(buttons[3].type, 'LINK');
  assert.equal(buttons[3].data.url, 'https://megrip.com/apply');
});

test('읽지 않은 메시지가 있는 open 이벤트에는 중복 안내를 보내지 않는다', () => {
  const response = handleTalkEvent({ event: 'open', options: { unreadMessage: true } });
  assert.equal(response, null);
});

test('대분류 버튼은 질문 3개와 처음으로 버튼을 반환한다', () => {
  const response = handleTalkEvent({
    event: 'send',
    textContent: { text: '수업·수강료', code: CODES.CLASS, inputType: 'button' },
  });
  const buttons = buttonsOf(response);

  assert.deepEqual(buttons.slice(0, 3).map(button => button.data.code), CATEGORIES[CODES.CLASS].answers);
  assert.equal(buttons[3].data.code, CODES.ROOT);
});

test('FAQ 답변은 상담신청, 이전메뉴, 처음으로 버튼을 반환한다', () => {
  const response = handleTalkEvent({
    event: 'send',
    textContent: { text: '주소·주차', code: CODES.LOCATION, inputType: 'button' },
  });
  const buttons = buttonsOf(response);

  assert.match(response.textContent.text, /가재울미래로 17/);
  assert.equal(buttons[0].type, 'LINK');
  assert.equal(buttons[1].data.code, CODES.ACADEMY);
  assert.equal(buttons[2].data.code, CODES.ROOT);
});

test('직접 입력한 주요 키워드도 해당 FAQ로 연결한다', () => {
  assert.equal(codeFromTypedText('중등 수강료가 궁금해요'), CODES.TUITION);
  assert.equal(codeFromTypedText('주차 가능한가요?'), CODES.LOCATION);
  assert.equal(codeFromTypedText('상담시간'), CODES.CONSULT_HOURS);
});

test('알 수 없는 문의에는 기본 메뉴를 다시 보여준다', () => {
  const response = handleTalkEvent({ event: 'send', textContent: { text: '기타 문의입니다' } });
  assert.match(response.textContent.text, /담당자가 확인/);
  assert.equal(buttonsOf(response).length, 4);
});

test('echo 등 불필요한 이벤트는 응답하지 않는다', () => {
  assert.equal(handleTalkEvent({ event: 'echo', textContent: { text: '반복 금지' } }), null);
  assert.equal(handleTalkEvent({ event: 'leave' }), null);
});

test('모든 퀵 버튼 제목은 네이버 제한 10자 이내다', () => {
  const messages = [
    handleTalkEvent({ event: 'open', options: {} }),
    ...Object.keys(CATEGORIES).map(code => handleTalkEvent({ event: 'send', textContent: { code } })),
    ...Object.keys(ANSWERS).map(code => handleTalkEvent({ event: 'send', textContent: { code } })),
  ];

  for (const message of messages) {
    for (const button of buttonsOf(message)) {
      assert.ok([...button.data.title].length <= 10, `${button.data.title} 버튼이 10자를 초과했습니다.`);
    }
  }
});
