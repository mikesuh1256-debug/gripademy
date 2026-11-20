(() => {
  'use strict';
  const node = (id) => document.getElementById(id);
  const root = node('quick-application');
  if (!root) return;
  const list = [
    ['이름', node('quick-name')],
    ['연락처', node('quick-phone')],
    ['최종학력·전공', node('quick-education')],
    ['수학 지도 경력', node('quick-experience')],
    ['지도 가능 학년', node('quick-grades')],
    ['희망연봉', node('quick-salary')],
    ['근무 가능 시작일', node('quick-start')],
  ];
  const recipient = 'mikesuh1256@gmail.com';
  const status = node('quick-status');
  const manualWrap = node('quick-manual-wrap');
  const manual = node('quick-manual');
  const clean = (value) => value.trim().replace(/[\r\n]+/g, ' ');
  const compose = node('quick-compose');
  const copy = node('quick-copy');
  if (!status || !manualWrap || !manual || !compose || !copy || list.some(([, input]) => !input)) return;
  const draft = () => {
    for (const [, input] of list) {
      input.setCustomValidity(input.required && !clean(input.value) ? '이 항목을 입력해 주세요.' : '');
      if (!input.reportValidity()) return null;
    }
    const name = clean(list[0][1].value);
    const body = [
      '안녕하세요. 매쓰그립수학 수학 강사에 지원합니다.',
      '',
      ...list.map(([label, input]) => label + ': ' + (clean(input.value) || '미기재')),
      '',
      '이력서를 첨부합니다. 감사합니다.',
    ].join('\r\n');
    return { subject: '[수학강사 지원] ' + name, body };
  };
  for (const [, input] of list) input.addEventListener('input', () => input.setCustomValidity(''));
  compose.addEventListener('click', () => {
    const data = draft();
    if (!data) return;
    status.textContent = '메일 앱에서 내용을 확인하고 이력서를 첨부한 뒤 발송해 주세요.';
    window.location.href = 'mailto:' + recipient + '?subject=' + encodeURIComponent(data.subject) + '&body=' + encodeURIComponent(data.body);
  });
  copy.addEventListener('click', async () => {
    const data = draft();
    if (!data) return;
    const contents = '받는 사람: ' + recipient + '\r\n제목: ' + data.subject + '\r\n\r\n' + data.body;
    try {
      await navigator.clipboard.writeText(contents);
      manual.value = '';
      manualWrap.hidden = true;
      status.textContent = '지원 초안을 복사했습니다. 사용하시는 웹메일에 붙여 넣고 이력서를 첨부해 보내 주세요.';
    } catch {
      manual.value = contents;
      manualWrap.hidden = false;
      manual.focus();
      manual.select();
      status.textContent = '자동 복사가 지원되지 않습니다. 아래에 선택된 초안을 복사해 사용하세요.';
    }
  });
  root.hidden = false;
})();
