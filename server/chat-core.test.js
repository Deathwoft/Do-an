const test = require('node:test');
const assert = require('node:assert/strict');
const {cleanName,createMessage,safePayload,MAX_MESSAGE_LENGTH} = require('./chat-core');
test('cleanName trims and limits display name',()=>{assert.equal(cleanName('  Nguyen   An  '),'Nguyen An');assert.equal(cleanName('a'.repeat(30)).length,24);});
test('createMessage creates valid message with timestamp',()=>{const m=createMessage({from:'An',text:' Xin chào '},1234);assert.equal(m.from,'An');assert.equal(m.text,'Xin chào');assert.equal(m.time,1234);});
test('createMessage rejects blank and oversized messages',()=>{assert.throws(()=>createMessage({from:'An',text:'  '}));assert.throws(()=>createMessage({from:'An',text:'x'.repeat(MAX_MESSAGE_LENGTH+1)}));});
test('safePayload parses valid JSON and rejects invalid payload',()=>{assert.deepEqual(safePayload('{"type":"join"}'),{type:'join'});assert.throws(()=>safePayload('not-json'));assert.throws(()=>safePayload('[]'));});
