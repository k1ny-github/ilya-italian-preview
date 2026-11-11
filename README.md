# Илья Хорьков — промежуточная версия Г

Обновление 19.10.2026: [список изменений](CHANGELOG-2026-10-19.md).

- [Текущий сайт](https://k1ny-github.github.io/ilya-italian-preview/)
- [Вход для согласования](https://k1ny-github.github.io/ilya-italian-preview/review/)
- [Отчёт и план](https://k1ny-github.github.io/ilya-italian-preview/report/)
- [Исторические версии](https://k1ny-github.github.io/ilya-italian-preview/history/)

Это согласованный просмотр владельцем, не утверждение юридической/коммерческой готовности.

## Точки возврата

Локальная текущая версия: 44bb722bde0f3668bed2551f56b6b48f2898db60, локальная метка quiz-final-action-2026-10-20. Версия с ручными слайдерами сохранена публичным тегом archive-manual-controls-2026-10-19.
Её локальная история не отправлялась в этот репозиторий вместе с документами workspace.
Публичная версия содержит чистую копию исходников source/current/ и собранные интерфейсы.
Старый публичный HEAD be39e02ab451ae96790c8c1398f7a8081946b4b8 сохранён меткой archive-2026-10-18-before-update и страницей history/legacy-2026-09-08/.
Происхождение сборок и исключения: SOURCE-MANIFEST.json.
Старые публичные ресурсы в корне сохранены; новый index использует новую сборку.

## Воспроизведение текущего интерфейса

В папке `source/current/` выполните `npm ci`. Для локального предпросмотра из корня достаточно `npm run build`. Готовые страницы лежат в `dist/client/`.

Для повторения текущего выпуска GitHub Pages в PowerShell задайте адрес проекта и режим индексации перед сборкой:

```powershell
$env:SITE_BASE = '/ilya-italian-preview/'
$env:VITE_SITE_URL = 'https://k1ny-github.github.io/ilya-italian-preview/'
$env:SEO_INDEXING = 'true'
$env:SEO_RELEASE_APPROVED = 'true'
npm run build
```

Команда собирает файлы локально. Для публикации проект использует готовые HTML, ресурсы и SEO-файлы в корне репозитория; список публикуемых файлов определён в `scripts/package-pages.py`. После переноса укажите актуальные адрес и путь проекта при сборке.
