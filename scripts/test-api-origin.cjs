function testApiOrigin(value) {
  if (!value) return undefined;
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.port || url.username || url.password
      || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('테스트 주소는 경로·포트·인증 정보가 없는 HTTPS origin이어야 합니다.');
  }
  return url.origin;
}

module.exports = { testApiOrigin };
