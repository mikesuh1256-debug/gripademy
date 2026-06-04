const NOTION_TOKEN = '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';
const DATABASE_ID = '1b2a6cf4db6a81ee9273ce8e72ec29a7';

exports.handler = async (event) => {
  try {
    let allResults = [];
    let hasMore = true;
    let startCursor = undefined;

    while (hasMore) {
      const body = {
        page_size: 100,
        filter: { property: '등록', checkbox: { equals: true } }
      };
      if (startCursor) body.start_cursor = startCursor;

      const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_TOKEN}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!data.results) return { statusCode: 500, body: JSON.stringify({ error: data }) };

      const active = data.results.filter(p => !p.archived && !p.in_trash);
      allResults = allResults.concat(active);
      hasMore = data.has_more;
      startCursor = data.next_cursor;
    }

    // 첫 번째 항목으로 필드 목록 파악
    const fields = allResults.length > 0 ? Object.keys(allResults[0].properties) : [];

    // title 필드(이름) 찾기
    let titleField = '';
    if (allResults.length > 0) {
      const props = allResults[0].properties;
      titleField = Object.keys(props).find(k => props[k].type === 'title') || '';
    }

    const orderedFields = titleField
      ? [titleField, ...fields.filter(f => f !== titleField)]
      : fields;

    const students = allResults.map(page => {
      const p = page.properties;
      const get = (key) => {
        if (!p[key]) return '';
        const prop = p[key];
        if (prop.type === 'title')        return prop.title?.[0]?.plain_text || '';
        if (prop.type === 'rich_text')    return prop.rich_text?.[0]?.plain_text || '';
        if (prop.type === 'select')       return prop.select?.name || '';
        if (prop.type === 'multi_select') return prop.multi_select?.map(s => s.name).join(', ') || '';
        if (prop.type === 'number')       return prop.number ?? '';
        if (prop.type === 'phone_number') return prop.phone_number || '';
        if (prop.type === 'email')        return prop.email || '';
        if (prop.type === 'checkbox')     return prop.checkbox;
        if (prop.type === 'date')         return prop.date?.start || '';
        if (prop.type === 'relation')     return prop.relation?.map(r => r.id).join(',') || '';
        return '';
      };
      const pick = (...keys) => { for (const k of keys) { const v = get(k); if (v !== '') return v; } return ''; };

      // 과목: 수학 등록 / 영어 등록 체크박스
      const isEng  = p['영어 등록']?.checkbox === true;
      const isMath = p['수학 등록']?.checkbox === true;
      let course = '';
      if (isEng && isMath) course = 'both';
      else if (isEng)      course = 'english';
      else if (isMath)     course = 'math';

      // 보호자 연락처 쉼표 분리 → phone1 / phone2
      const rawPhone = get('보호자 연락처');
      const phoneParts = rawPhone.split(',').map(s => s.trim()).filter(Boolean);
      const phone1 = phoneParts[0] || '';
      const phone2 = phoneParts[1] || '';

      const record = {
        notionId:         page.id,
        _titleField:      titleField,
        _name:            get(titleField),
        _grade:           pick('학년', '학년(한글수식)', 'Grade'),
        _school:          pick('학교', '학교명', 'School'),
        _course:          course,
        _phone:           phone1,
        _phone2:          phone2,
        _studentPhone:    get('학생 연락처'),
        _birthday:        pick('생년월일', '생일', 'Birthday'),
        _gender:          pick('성별', 'Gender'),
        _address:         pick('주소', '집주소', 'Address'),
        _parentRelation1: pick('관계', '보호자관계', '관계1'),
        _parentRelation2: pick('관계2', '보호자2관계'),
        _memo:            pick('메모', '비고', '특이사항'),
      };
      orderedFields.forEach(f => { record[f] = get(f); });
      return record;
    });

    const fieldTypes = {};
    if (allResults.length > 0) {
      Object.entries(allResults[0].properties).forEach(([k, v]) => { fieldTypes[k] = v.type; });
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ fields: orderedFields, titleField, fieldTypes, students }),
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
