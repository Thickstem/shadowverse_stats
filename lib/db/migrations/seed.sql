-- Initial seed data for deck archetypes
INSERT INTO deck_archetypes (name, description) VALUES
('ロイヤル', 'Royal class deck archetype'),
('ウィッチ', 'Witch class deck archetype'),
('ドラゴン', 'Dragon class deck archetype'),
('ネクロマンサー', 'Necromancer class deck archetype'),
('ヴァンパイア', 'Vampire class deck archetype'),
('ビショップ', 'Bishop class deck archetype'),
('ネメシス', 'Nemesis class deck archetype'),
('エルフ', 'Elf class deck archetype')
ON CONFLICT (name) DO NOTHING;