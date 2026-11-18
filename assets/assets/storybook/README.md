# Нарисованные текстуры карты (Карта мира v30)

Сюда кладутся картинки из `gemini/09_storybook_textures.md`. Загрузчик —
`lib/world/storybook_textures.dart`: ищет файл `<имя>.webp`, потом `.png`,
потом `.jpg`. Чего нет — рисуется кодом, пустая папка ничего не ломает.

- `ground_<поляна>` — 14 бесшовных квадратов (value, trust, power, acceptance,
  love, expression, meaning, worthlessness, hostility, helplessness,
  resentment, alienation, hiding, emptiness). Одна картинка ≈ 14 единиц мира.
- `water_emerald|azure|amber|mint|rose|turquoise|murky|ice`, `smoke_ravine` —
  бесшовная вода, течение снизу вверх. Ручьи: value→emerald, trust→azure,
  power→amber, acceptance→mint, love→rose, expression→turquoise,
  meaning→azure, alienation→ice, emptiness→smoke_ravine, остальные теневые→murky.
- `bank_high|gentle|rocky|reeds|roots|ice` — полосы 1024×256, бесшовные по
  горизонтали, вода снизу, земля сверху.
- `bridge_<имя>` (18) и `bridge_rotten_log_soft`, `bridge_drawbridge_soft`,
  `bridge_ice_arch_soft`, `bridge_broken_viaduct_soft` — мост идёт слева
  направо, **фон прозрачный** (белый фон нужно вырезать до того, как класть сюда).
- `feature_pool|rapids|waterfall|spring|island|heart_island|ford|ice_jam|swamp_pool|stone_gate`
  — особые места, тоже на прозрачном фоне.
- `tree_<дерево>_l1..l4` (7 светлых: value, trust, power, acceptance, love,
  expression, meaning — уровень 1–4) и `tree_<дерево>_s0..s2` (7 теневых:
  worthlessness, hostility, helplessness, resentment, alienation, hiding,
  emptiness — ступень смягчения 0–2) — дерево целиком на **прозрачном фоне**;
  низ-середина картинки — основание ствола, высота картинки = 1,5 высоты
  дерева, крона светлых наклонена вправо, теневых — влево (к краю карты).
  Есть картинка — рисуется она (без моргания и жителей), нет — код.

- `detail_<поляна>_<имя>` — рабочие детали полян (Карта мира, шаг 4,
  `lib/world/glade_details.dart`): маленький предмет на земле, **фон
  прозрачный**, квадрат; земля (точка, где предмет стоит) — по центру на
  2/3 высоты снизу вверх (x = 0,5, y = 0,667 картинки), предмет занимает
  примерно середину. У теневых полян три картинки по ступени смягчения:
  `_s0` (тяжёлый вид), `_s1`, `_s2` (исцелённый). Живое состояние (запас,
  заряд) рисуется поверх кодом — маленькой полоской под предметом, поэтому
  в картинке его не нужно. Полный список — `StorybookTextures.detailNames`:
  - value: `detail_value_ore_chest`, `detail_value_guard_lamp`, `detail_value_exp_hearth`
  - trust: `detail_trust_will_anchor`, `detail_trust_soil_hollow`
  - power: `detail_power_will_forge`, `detail_power_anger_ember`
  - acceptance: `detail_acceptance_memory_cup`, `detail_acceptance_belief_soil`
  - love: `detail_love_fruit_spring`, `detail_love_watch_nest`
  - expression: `detail_expression_curiosity_bell`, `detail_expression_thread_spool`
  - meaning: `detail_meaning_hope_lanterns`
  - worthlessness: `detail_worthlessness_guilt_well_s0..s2`, `detail_worthlessness_sabotage_snare_s0..s2`
  - hostility: `detail_hostility_control_thorn_s0..s2`, `detail_hostility_anger_resonator_s0..s2`
  - helplessness: `detail_helplessness_inertia_moss_s0..s2`, `detail_helplessness_bog_hollow_s0..s2`
  - resentment: `detail_resentment_false_scales_s0..s2`, `detail_resentment_salt_hollow_s0..s2`
  - alienation: `detail_alienation_ice_lock_s0..s2`
  - hiding: `detail_hiding_mist_mirror_s0..s2`, `detail_hiding_grey_leaves_s0..s2`
  - emptiness: `detail_emptiness_habit_anchor_s0..s2`, `detail_emptiness_ash_hollow_s0..s2`

Размер: земля и вода — 512×512 или 1024×1024 WebP (качество ~80), берега
1024×256, предметы 512×512 WebP с альфой.

Текущие земля, вода, берега, мосты и особые места сгенерированы конвейером
`tools/world_pipeline` (см. HANDOFF.md там): земля и вода 1024×1024 бесшовные,
мосты — вид строго сверху (они поворачиваются вдоль переправы).
