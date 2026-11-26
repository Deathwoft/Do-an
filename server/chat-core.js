const MAX_MESSAGE_LENGTH = 2000;
function cleanName(value) {
  return String(value ?? '').trim().replace(/\s+/g, ' ').slice(0, 24);
}
function createMessage({from, text, room='general', to=null, type='message'}, now=Date.now()) {
  const body = String(text ?? '').trim();
  if (!cleanName(from)) throw new Error('Tên người gửi không hợp lệ.');
  if (!body) throw new Error('Tin nhắn không được để trống.');
  if (body.length > MAX_MESSAGE_LENGTH) throw new Error(`Tin nhắn tối đa ${MAX_MESSAGE_LENGTH} ký tự.`);
  return {id: `${now}-${Math.random().toString(36).slice(2,9)}`, type, from:cleanName(from), text:body, room, to:to ? cleanName(to) : null, time:now};
}
function safePayload(raw) {
  if (typeof raw !== 'string' || raw.length > MAX_MESSAGE_LENGTH + 500) throw new Error('Dữ liệu gửi lên không hợp lệ.');
  const value = JSON.parse(raw);
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Gói tin không hợp lệ.');
  return value;
}
module.exports = {MAX_MESSAGE_LENGTH, cleanName, createMessage, safePayload};
