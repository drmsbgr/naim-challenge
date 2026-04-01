import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CARBON_KEYWORDS = [
  'tanıt', 'tanit', 'eğer', 'eger', 'değilse', 'degilse', 'iken', 'her', 'herbiri', 'içinden',
  'dön', 'çıkış', 'cikis', 'fırlat', 'firlat', 'tamsayı', 'ondalık', 'metin', 'mantıksal',
  'liste', 'sözlük', 'boş', 'sınıf', 'arayüz', 'kategorik', 'yeni', 'bu', 'görünür', 'özel',
  'statik', 'paket', 'kullan', 'oku', 'yaz', 'değer', 'doğru', 'yanlış', 've', 'veya'
];

const BUILTINS = [
  'yazdır', 'girdi', 'tip', 'sayıya_çevir', 'donustur', 'konsol', 'matematik', 'dosya', 'tarih',
  'uzunluk', 'boşMu', 'ekle', 'çıkar', 'temizle', 'büyükYap', 'küçükYap'
];

export default function CarbonHighlighter({ code, style }) {
  if (!code) return null;

  // Regex to tokenize Carbon code
  // 1: Comments (// or /* */)
  // 2: Strings ("..." or $"...")
  // 3: Numbers (\d+ or \d+.\d+)
  // 4: Identifiers / Keywords
  // 5: Operators / Punctuation
  // 6: Whitespace
  const lexerRegex = /(\/\/.*|\/\*[\s\S]*?\*\/)|(\$?"[^"]*")|(\b\d+(?:\.\d+)?\b)|([a-zA-ZğüşıöçĞÜŞİÖÇ_][a-zA-Z0-9ğüşıöçĞÜŞİÖÇ_]*)|([^\w\s"\/]+)|(\s+)/g;

  const tokens = [];
  let match;

  // Since String.match() doesn't give us groups directly in a clean way without matchAll,
  // we can use match() to just get the chunks, because our regex matches the entire string fully.
  const chunks = code.match(lexerRegex) || [];

  return (
    <Text style={[styles.baseText, style]}>
      {chunks.map((chunk, index) => {
        let chunkStyle = styles.normalText;

        if (chunk.startsWith('//') || chunk.startsWith('/*')) {
          chunkStyle = styles.commentText;
        } else if (chunk.startsWith('"') || chunk.startsWith('$"')) {
          chunkStyle = styles.stringText;
        } else if (/^\d+(?:\.\d+)?$/.test(chunk)) {
          chunkStyle = styles.numberText;
        } else if (CARBON_KEYWORDS.includes(chunk)) {
          chunkStyle = styles.keywordText;
        } else if (BUILTINS.includes(chunk)) {
          chunkStyle = styles.builtinText;
        }

        return (
          <Text key={index} style={chunkStyle}>
            {chunk}
          </Text>
        );
      })}
    </Text>
  );
}

const styles = StyleSheet.create({
  baseText: {
    fontFamily: 'Courier New', // Using a generic monospace font
    fontSize: 14,
    lineHeight: 20,
  },
  normalText: {
    color: '#E5E2E1', // onSurface
  },
  keywordText: {
    color: '#FF6B6B', // Reddish Pink for Carbon keywords
    fontWeight: 'bold',
  },
  builtinText: {
    color: '#60A5FA', // Blue for builtins
  },
  stringText: {
    color: '#34D399', // Green for strings
  },
  numberText: {
    color: '#A78BFA', // Purple for numbers
  },
  commentText: {
    color: '#9CA3AF', // Gray for comments
    fontStyle: 'italic',
  },
});
