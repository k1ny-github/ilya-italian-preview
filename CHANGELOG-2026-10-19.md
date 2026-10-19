# Промежуточная версия Г — 19 октября 2026

- [Открыть текущий сайт](https://k1ny-github.github.io/ilya-italian-preview/).
- Сохранённый исходный checkpoint: `be8e80fbebf8f2c53e5f889e3b3ce3d6b746c17f`.
- Перенесён выбранный порядок 13 секций, цельная светлая карточка теста C, композиция «Обо мне» B и согласованные desktop-правки.
- Болонья открывается первой в Miro, 5 секунд; остальные задания по 4 секунды. Сохранены ровная карточка урока и компактный футер.
- Исправлен порядок CSS в сборке с несколькими точками входа.
- Предыдущий публичный commit: `6ad7d69af5918e04b676ef52b13d92fa76b40e2a`, метка `archive-before-version-g-2026-10-19`.
- Исторические отчёты, варианты, снимки и ресурсы сохранены. Числа отчёта 18 октября не пересчитывались.
- Публичная privacy-страница сохраняет прежнее согласованное уведомление. Это промежуточная версия для просмотра; финальная приёмка всей страницы и юридических материалов не заявляется.

Воспроизведение: в `source/current` выполнить `npm ci`, `npm run build`; результат `dist/client`, project base `/ilya-italian-preview/`. Исходники не включают зависимости и документы рабочего пространства.

## Точечная коррекция ширины Miro

Доска и её loading placeholder расширены до внешних границ двух пунктов над ней. Текст, интерфейс, тайминг, панорамирование и другие секции сохранены. Исходный checkpoint: `08b143e83424cb51cf1aff39a79b66811b6fab6d`.

## Утверждённая карточка «Обо мне»

Перенесён только About из выбранной пробы: белая карточка, CSS-кадрирование исходного портрета и две существующие ветви у краёв карточки. Фотография и тексты не изменены. Запись, заключительный CTA и Miro из экспериментальной пробы не переносились. Исходный checkpoint: `80953c128251c7f85b4c45cbd9b2f926d3a8b1e6`.

## Последние быстрые правки

Существующие Closing и Booking поменяны местами, обе секции сохранены. Miro показывает три прежних оригинала: Bologna→описание людей→множественное число,5/4/4секунды. Реальные ручные инструменты слайдеров убраны, декоративная оболочка сохранена. Ограничены нативные действия над изображениями, текст и ссылки остаются доступными. About и остальное оформление сохранены. Исходный ref `b8fc8e817aabbf7e3a7bdfdef276950bfd595b56`; версия с ручным управлением сохранена публичным тегом `archive-manual-controls-2026-10-19`.

## Удалён только заключительный CTA

Удалён блок «Давайте знакомиться». Booking и футер сохранены,12 секций. Miro и остальные блоки не менялись. Исходный checkpoint `0dab7a9620a1d7511394257bdc45ee9a72c4e2a5`.

## Miro F+ shared

Approved common white panel below880x580board,32pxicons,19pxheadings,exact owner paragraph. Three original frames5/4/4; other sections preserved. Source checkpoint: 92668e9c2b4d9b12bd1f3938f467579ba095aa18

## Compact mobile Miro

Below640 only: fluid stable board height, compact44pxheader, full original frames without extra inset. Desktop F+ shared/copy/other sections preserved. Source checkpoint 23a3fc637102d1a82bf54e32cb16eb80ff55d6c0

## Miro two separate cards

Selected F+ split,16px gap, separate white bordered cards. Bologna7s/people6s/plural6s. Compact mobile fit and other sections preserved. Source 7a57869e96c29e694a0d309593791e7475bd92a0

## Responsive Quiz shell

Selected white C card extends to all widths. Existing desktop composition, all images/copy/actions and other sections preserved.17 viewport/boundary browser checks and functional smoke completed. Source 264104eb35207edfcd584029f6b6cd6b4a3c0b2d

## Mobile Miro header

Both skins: decorative back/Italiano/search/two existing avatars/menu.44pxheader and compact board preserved. Official Help Center diagram;back/search library approximations,not native pixelperfect. Other sections untouched. Source 2115e208c188ef334d961615f58c0ab0fc3d6e09

## Quiz larger scene and bottom crop

Below1200 enlarged collage with opaque lower edge clipped by white card;question/options/CTA preserved. Desktop1200+,assets,Miro and other sections unchanged. Source b8ec6e939682e488d61201719d77a8e0cb10da93

## About selected variant A

Hide existing leaf decoration below1200 only. Desktop leaves,portrait/crop/copy/layout and all other sections unchanged. Source 8c1d500052a012ff52aed8470019eb0f53ecb435
