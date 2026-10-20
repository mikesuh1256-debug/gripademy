'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const pages = [
  { file: 'math.html', subject: 'math', duration: '2분 19초' },
  { file: 'english.html', subject: 'english', duration: '2분 24초' },
];

for (const page of pages) {
  test(`${page.file} 영상 종료 화면에 신청, 다시보기, 공유 선택지가 있다`, () => {
    const html = fs.readFileSync(path.join(__dirname, '..', page.file), 'utf8');

    assert.match(html, new RegExp(`apply\\?subject=${page.subject}&amp;source=homepage`));
    assert.match(html, /data-video-action="replay">↻ 다시보기<\/button>/);
    assert.match(html, /data-video-action="share"[^>]*>공유하기<\/button>/);
    assert.match(html, new RegExp(`data-share-title="${page.duration}`));
    assert.match(html, /navigator\.share/);
    assert.match(html, /navigator\.clipboard\.writeText/);
  });
}
