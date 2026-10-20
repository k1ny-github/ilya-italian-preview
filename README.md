# Илья Хорьков — промежуточная версия Г

Обновление 19.10.2026: [список изменений](CHANGELOG-2026-10-19.md).

- [Текущий сайт](https://k1ny-github.github.io/ilya-italian-preview/)
- [Вход для согласования](https://k1ny-github.github.io/ilya-italian-preview/review/)
- [Отчёт и план](https://k1ny-github.github.io/ilya-italian-preview/report/)
- [Исторические версии](https://k1ny-github.github.io/ilya-italian-preview/history/)

Это согласованный просмотр владельцем, не утверждение юридической/коммерческой готовности.

## Точки возврата

Локальная текущая версия: 0167c020c9b84b5d73bf7cad27289169282b89f2, локальная метка hero-benefits-alignment-2026-10-20. Версия с ручными слайдерами сохранена публичным тегом archive-manual-controls-2026-10-19.
Её локальная история не отправлялась в этот репозиторий вместе с документами workspace.
Публичная версия содержит чистую копию исходников source/current/ и собранные интерфейсы.
Старый публичный HEAD be39e02ab451ae96790c8c1398f7a8081946b4b8 сохранён меткой archive-2026-10-18-before-update и страницей history/legacy-2026-09-08/.
Происхождение сборок и исключения: SOURCE-MANIFEST.json.
Старые публичные ресурсы в корне сохранены; новый index использует новую сборку.

## Воспроизведение текущего интерфейса

В source/current/: npm ci, затем npm run build.
Статический результат: dist/client/, project base /ilya-italian-preview/.
Размещать содержимое этой папки в корне существующего GitHub Pages project.
Не публиковать node_modules, локальные журналы или workspace.
