// Шифр для писем-сверок (lib/compat/letters.dart через window.heartTg).
// AES-GCM, ключ 128 бит. Ключ уходит только в ссылку на письмо, сервер
// получает одни зашифрованные байты. Проверка: node tools/telegram_bot/letters_js_test.mjs
(function (root) {
  function b64u(bytes) {
    var s = '';
    for (var i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function unb64u(str) {
    var s = str.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    var bin = atob(s);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function importKey(raw) {
    return crypto.subtle.importKey('raw', raw, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
  }
  // Зашифровать текст. key = null → новый ключ. Ответ: {box, key}.
  function seal(text, key) {
    var raw = key ? unb64u(key) : crypto.getRandomValues(new Uint8Array(16));
    var iv = crypto.getRandomValues(new Uint8Array(12));
    return importKey(raw).then(function (k) {
      return crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, k, new TextEncoder().encode(text));
    }).then(function (ct) {
      var all = new Uint8Array(12 + ct.byteLength);
      all.set(iv, 0);
      all.set(new Uint8Array(ct), 12);
      return { box: b64u(all), key: b64u(raw) };
    });
  }
  // Расшифровать. Неверный ключ или испорченный конверт → null.
  function unseal(box, key) {
    try {
      var all = unb64u(box);
      return importKey(unb64u(key)).then(function (k) {
        return crypto.subtle.decrypt({ name: 'AES-GCM', iv: all.slice(0, 12) }, k, all.slice(12));
      }).then(function (pt) { return new TextDecoder().decode(pt); }).catch(function () { return null; });
    } catch (e) {
      return Promise.resolve(null);
    }
  }
  root.heartLetters = { seal: seal, unseal: unseal };
})(typeof window !== 'undefined' ? window : globalThis);
