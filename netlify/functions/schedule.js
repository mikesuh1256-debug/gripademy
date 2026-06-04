const NOTION_TOKEN = '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';
const DATABASE_ID = '1b2a6cf4db6a811b9f5ce34f2725857c';

exports.handler = async (event) => {
  const role = event.queryStringParameters?.role || 'all';

  const today = new Date();
  const start = new Date(today); start.setMonth(start.getMonth() - 6);
  const end = new Date(today); end.setMonth(end.getMonth() + 6);

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sorts: [{ property: '날짜', direction: 'ascending' }],
        filter: {
          and: [
            { property: '날짜', date: { on_or_after: start.toISOString().split('T')[0] } },
            { property: '날짜', date: { on_or_before: end.toISOString().split('T')[0] } },
          ]
        }
      }),
    });

    const data = await response.json();

    let schedules = (data.results || []).map(page => ({
      id: page.id,
      title: page.properties['일정명']?.title?.[0]?.plain_text || '',
      date: page.properties['날짜']?.date || null,
      target: page.properties['공지대상']?.multi_select?.map(s => s.name) || [],
      department: page.properties['해당부서']?.select?.name || '',
      category: page.properties['분류']?.select?.name || '',
    })).filter(s => s.title && s.date?.start);

    // 역할별 필터링
    if (role === 'parent') {
      schedules = schedules.filter(s =>
        s.target.includes('수학학부모') ||
        s.target.includes('영어학부모') ||
        s.target.includes('전체학원')
      );
    } else if (role === 'teacher') {
      schedules = schedules.filter(s =>
        s.department === '영어과' ||
        s.department === '수학과' ||
        s.target.includes('전체학원') ||
        s.target.includes('수학학부모') ||
        s.target.includes('영어학부모')
      );
    }
    // admin: 필터 없이 전체 반환

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(schedules),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
