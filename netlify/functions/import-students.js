const NOTION_TOKEN = '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';
const DATABASE_ID = '1b2a6cf4db6a81ee9273ce8e72ec29a7';

exports.handler = async (event) => {
  try {
    // 페이지네이션으로 전체 데이터 가져오기
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

      // 보관(archived)된 항목 제외
      const active = data.results.filter(p => !p.archived && !p.in_trash);
      allResults = allResults.concat(active);
      hasMore = data.has_more;
      startCursor = data.next_cursor;
    }

    const data = { results: allResults };

    // 첫 번째 항목으로 필드 목록 파악
    const fields = allResults.length > 0
      ? Object.keys(allResults[0].properties)
      : [];

    // title 필드(이름) 찾기
    let titleField = '';
    if (allResults.length > 0) {
      const props = allResults[0].properties;
      titleField = Object.keys(props).find(k => props[k].type === 'title') || '';
    }

    // title 필드를 맨 앞으로
    const orderedFields = titleField
      ? [titleField, ...fields.filter(f => f !== titleField)]
      : fields;

    const students = allResults.map(page => {
      const p = page.properties;
      const get = (key) => {
        if (!p[key]) return '';
        const prop = p[key];
        if (prop.type === 'title') return prop.title?.[0]?.plain_text || '';
        if (prop.type === 'rich_text') return prop.rich_text?.[0]?.plain_text || '';
        if (prop.type === 'select') return prop.select?.name || '';
        if (prop.type === 'multi_select') return prop.multi_select?.map(s => s.name).join(', ') || '';
        if (prop.type === 'number') return prop.number ?? '';
        if (prop.type === 'phone_number') return prop.phone_number || '';
        if (prop.type === 'email') return prop.email || '';
        if (prop.type === 'checkbox') return prop.checkbox;
        if (prop.type === 'date') return prop.date?.start || '';
        if (prop.type === 'relation') return prop.relation?.map(r => r.id).join(',') || '';
        return '';
      };

      // 과목 자동 결합 (영어재원여부 + 수학재원여부)
      const isEng = p['영어재원여부']?.checkbox === true;
      const isMath = p['수학재원여부']?.checkbox === true;
      let course = '';
      if (isEng && isMath) course = 'both';
      else if (isEng) course = 'english';
      else if (isMath) course = 'math';

      const pick = (...keys) => { for (const k of keys) { const v = get(k); if (v !== '') return v; } return ''; };

      const record = {
        notionId: page.id,
        _titleField: titleField,
        _name:           get(titleField),
        _grade:          pick('학년','학년(한글수식)','학년 ','Grade'),
        _school:         pick('학교','학교명','School'),
        _course:         course,
        _parentName:     pick('학부모','보호자','학부모명','학부모이름','ParentName'),
        _phone:          pick('연락처','전화번호','핸드폰','학부모연락처','보호자연락처','Phone'),
        // 확장 필드
        _birthday:       pick('생년월일','생일','Birthday'),
        _gender:         pick('성별','Gender'),
        _address:        pick('주소','집주소','Address'),
        _studentPhone:   pick('학생연락처','학생전화','본인연락처','학생번호','StudentPhone'),
        _phone2:         pick('연락처2','학부모2연락처','보호자2연락처','핸드폰2','연락처 2'),
        _parentRelation1: pick('관계','보호자관계','학부모관계','관계1','Relation1'),
        _parentRelation2: pick('관계2','보호자2관계','학부모2관계','Relation2'),
        _memo:           pick('메모','비고','특이사항','Memo'),
      };
      orderedFields.forEach(f => { record[f] = get(f); });
      return record;
    });

    const fieldTypes = {};
    if (allResults.length > 0) {
      Object.entries(allResults[0].properties).forEach(([k,v]) => { fieldTypes[k] = v.type; });
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
