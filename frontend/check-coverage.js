// check-coverage.js
const path = require('path');
const fs = require('fs');

// Путь к summary-файлу, если Jest пишет его в папку coverage/
const summaryPath = path.resolve(__dirname, 'coverage', 'coverage-summary.json');
if (!fs.existsSync(summaryPath)) {
  console.error(`🛑 Не найден файл покрытия: ${summaryPath}`);
  process.exit(1);
}

const { total: { lines: { pct } } } = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));

const MIN_COVERAGE = 20;
if (pct < MIN_COVERAGE) {
  console.error(`🛑 Покрытие слишком низкое: ${pct}% (требуется ≥ ${MIN_COVERAGE}%)`);
  process.exit(1);
} else {
  console.log(`✅ Покрытие OK: ${pct}%`);
}

