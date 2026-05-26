-- BK Option Ventures - Initial Product Seed Data
-- Run AFTER schema.sql
--
-- IMPORTANT – Before importing, upload your product images to Hostinger:
--   Copy the entire  src/Images/  folder to  public_html/images/
--   so that paths like /images/Tents/Tent1.jpeg resolve correctly.

SET NAMES utf8mb4;

-- ═══════════════════════════════════════════
-- RENTAL PRODUCTS
-- ═══════════════════════════════════════════

-- ── Canopies ──
INSERT INTO products (id, name, category, price, price_unit, type, description) VALUES
('r1',  'Small Canopy (15×7 ft)',        'Canopies', 15000, 'per day', 'rental', 'Perfect for intimate outdoor events. White canopy provides shade and shelter for up to 10 guests. Easy setup and takedown included in the rental.'),
('r2',  'Large Canopy (20 x 10 ft)',     'Canopies', 20000, 'per day', 'rental', 'Perfect for outdoor events. White canopy provides shade and shelter for up to 20 guests. Easy setup and takedown included in the rental.'),
('r27', 'Twin Pagoda Canopy Setup',      'Canopies', 30000, 'per day', 'rental', 'Set of two linked pagoda-style canopies providing a shaded outdoor event space, ideal for medium-sized private events and garden parties.'),
('r28', 'Large Linked Pagoda Canopy',    'Canopies', 60000, 'per day', 'rental', 'A series of linked high-peak pagoda canopies forming a large covered area, suitable for corporate events and large outdoor gatherings. Optional enclosed walls available.'),
('r29', 'Open-Sided Pagoda Canopy',      'Canopies', 25000, 'per day', 'rental', 'Classic open-sided pagoda canopy, great for private parties, corporate activations, and garden events.'),
('r30', 'High-Peak Event Canopy',        'Canopies', 45000, 'per day', 'rental', 'Premium high-peak event canopy, perfect for VIP outdoor receptions, corporate functions, and formal ceremonies.');

-- ── Chairs ──
INSERT INTO products (id, name, category, price, price_unit, type, description) VALUES
('r3',  'Lounge Chairs',              'Chairs', 5000,  'per day', 'rental', 'All white comfy lounge chairs perfect for lounges and events.'),
('r4',  'Cocktail Chairs',            'Chairs', 5000,  'per day', 'rental', 'Short cocktail chairs with golden back rests, perfect for gatherings and events.'),
('r12', 'Gold Banquet Chair',         'Chairs', 3000,  'per day', 'rental', 'Elegant gold-framed round-back banquet chairs with white upholstery, perfect for weddings and formal events.'),
('r13', 'Carved Wooden Armchair',     'Chairs', 4000,  'per day', 'rental', 'Elegantly carved wooden armchairs with plush white cushions, ideal for VIP seating areas and high-end events.'),
('r14', 'Baroque Gold Armchair',      'Chairs', 6000,  'per day', 'rental', 'Luxurious baroque-style armchair with an ornate gold frame and white leather cushion — a statement piece for any event.'),
('r15', 'Gold Napoleon Chair',        'Chairs', 3000,  'per day', 'rental', 'Classic gold Napoleon chair with white cushion pad — a timeless choice for elegant events and ceremonies.'),
('r16', 'Black Leather Lounge Set',   'Chairs', 35000, 'per day', 'rental', 'Sleek black leather sofa set with matching bench seats and a dark glass coffee table, ideal for VIP lounge areas.'),
('r17', 'Cross-Back Chair',           'Chairs', 3500,  'per day', 'rental', 'Rustic yet elegant cross-back wooden chairs, a popular choice for outdoor weddings and garden events.'),
('r19', 'Wooden O-Back Chair',        'Chairs', 3500,  'per day', 'rental', 'Elegant wooden O-back chairs with a smooth natural wood finish, perfect for modern and rustic-themed events.'),
('r20', 'Black Modular Sofa Set',     'Chairs', 30000, 'per day', 'rental', 'Modern tufted black leather modular sofa with matching round ottomans, perfect for VIP lounge setups.'),
('r21', 'White Event Lounge Set',     'Chairs', 20000, 'per day', 'rental', 'Contemporary white lounge sofas ideal for large-scale event lounges, concerts, and corporate gatherings.'),
('r22', 'Gold Chiavari Chair',        'Chairs', 3000,  'per day', 'rental', 'Classic gold Chiavari (Tiffany) chairs with white cushion pads — a staple for weddings and grand celebrations.'),
('r23', 'Black O-Back Chair',         'Chairs', 3500,  'per day', 'rental', 'Sleek black O-back chair with a modern infinity-ring back design, ideal for black-themed or contemporary events.'),
('r24', 'Red Banquet Chair',          'Chairs', 2500,  'per day', 'rental', 'Padded red fabric banquet chairs with gold metal frame, suitable for large outdoor events and ceremonies.');

-- ── Tables ──
INSERT INTO products (id, name, category, price, price_unit, type, description) VALUES
('r5',  'Round Table',                'Tables', 7000,  'per day', 'rental', 'Plain white round tables, lightweight and easy to set up for any event.'),
('r6',  'Round Banquet Table',        'Tables', 7500,  'per day', 'rental', 'Round banquet tables with beautiful table coverings in your choice of color.'),
('r7',  'Rectangular Table',          'Tables', 7000,  'per day', 'rental', 'Plain white rectangular tables, perfect for banquet-style seating arrangements.'),
('r8',  'Rectangular Banquet Table',  'Tables', 7500,  'per day', 'rental', 'Rectangular banquet tables with beautiful table coverings in your choice of color.'),
('r9',  'Cocktail Table',             'Tables', 5000,  'per day', 'rental', 'Round cocktail tables with golden base, available in white and black finishes.'),
('r10', 'Glowing Cocktail Tables',    'Tables', 8000,  'per day', 'rental', 'LED-glowing cocktail tables, perfect for night parties and themed events.'),
('r18', 'Rustic Farm Table',          'Tables', 12000, 'per day', 'rental', 'Beautiful rustic wooden farm/harvest table, perfect for intimate wedding receptions and outdoor garden events.'),
('r25', 'LED Glow Bar Counter',       'Tables', 20000, 'per day', 'rental', 'Eye-catching curved LED-illuminated bar counter that glows white, perfect for nighttime parties, club events, and VIP receptions.'),
('r26', 'Plastic Folding Round Table','Tables', 5000,  'per day', 'rental', 'Sturdy white plastic folding round table, easy to set up and clean, suitable for large outdoor events.');

-- ── Fans ──
INSERT INTO products (id, name, category, price, price_unit, type, description) VALUES
('r11', 'Standing Fan', 'Fans', 0, 'per day', 'rental', 'Rotating standing fan suitable for indoor and outdoor events.');

-- ═══════════════════════════════════════════
-- SALES PRODUCTS
-- ═══════════════════════════════════════════

-- ── Tables ──
INSERT INTO products (id, name, category, price, price_unit, type, description, stock) VALUES
('s1',  'Round Table',                'Tables', 0, 'each', 'sale', 'Plain white round tables, ideal for events and everyday use. Lightweight and easy to set up.', 10),
('s2',  'Rectangular Table',          'Tables', 0, 'each', 'sale', 'Plain white rectangular tables, perfect for events and multipurpose use.', 10),
('s3',  'Cocktail Table',             'Tables', 0, 'each', 'sale', 'Round cocktail tables with golden base, available in white and black finishes.', 10),
('s6',  'Plastic Folding Round Table','Tables', 0, 'each', 'sale', 'Sturdy white plastic folding round table, perfect for events and everyday use. Easy to set up and clean.', 10),
('s13', 'Rustic Farm Table',          'Tables', 0, 'each', 'sale', 'Beautiful rustic wooden farm/harvest table, perfect for intimate wedding receptions and outdoor garden events.', 10),
('s20', 'LED Glow Bar Counter',       'Tables', 0, 'each', 'sale', 'Eye-catching curved LED-illuminated bar counter that glows white, perfect for nighttime parties, club events, and VIP receptions.', 10);

-- ── Fans ──
INSERT INTO products (id, name, category, price, price_unit, type, description, stock) VALUES
('s4',  'Standing Fan', 'Fans', 0, 'each', 'sale', 'Rotating standing fan suitable for indoor and outdoor events.', 10);

-- ── Chairs ──
INSERT INTO products (id, name, category, price, price_unit, type, description, stock) VALUES
('s5',  'White Lounge Sofa Set',    'Chairs', 0, 'each', 'sale', 'White leather lounge sofas and bench seats with side tables, ideal for concert lounges and large outdoor events.', 10),
('s7',  'Gold Banquet Chair',       'Chairs', 0, 'each', 'sale', 'Elegant gold-framed round-back banquet chairs with white upholstery, perfect for weddings and formal events.', 10),
('s8',  'Carved Wooden Armchair',   'Chairs', 0, 'each', 'sale', 'Elegantly carved wooden armchairs with plush white cushions, ideal for VIP seating areas and high-end events.', 10),
('s9',  'Baroque Gold Armchair',    'Chairs', 0, 'each', 'sale', 'Luxurious baroque-style armchair with an ornate gold frame and white leather cushion — a statement piece for any event.', 10),
('s10', 'Gold Napoleon Chair',      'Chairs', 0, 'each', 'sale', 'Classic gold Napoleon chair with white cushion pad — a timeless choice for elegant events and ceremonies.', 10),
('s11', 'Black Leather Lounge Set', 'Chairs', 0, 'each', 'sale', 'Sleek black leather sofa set with matching bench seats and a dark glass coffee table, ideal for VIP lounge areas.', 10),
('s12', 'Cross-Back Chair',         'Chairs', 0, 'each', 'sale', 'Rustic yet elegant cross-back wooden chairs, a popular choice for outdoor weddings and garden events.', 10),
('s14', 'Wooden O-Back Chair',      'Chairs', 0, 'each', 'sale', 'Elegant wooden O-back chairs with a smooth natural wood finish, perfect for modern and rustic-themed events.', 10),
('s15', 'Black Modular Sofa Set',   'Chairs', 0, 'each', 'sale', 'Modern tufted black leather modular sofa with matching round ottomans, perfect for VIP lounge setups.', 10),
('s16', 'White Event Lounge Set',   'Chairs', 0, 'each', 'sale', 'Contemporary white lounge sofas ideal for large-scale event lounges, concerts, and corporate gatherings.', 10),
('s17', 'Gold Chiavari Chair',      'Chairs', 0, 'each', 'sale', 'Classic gold Chiavari (Tiffany) chairs with white cushion pads — a staple for weddings and grand celebrations.', 10),
('s18', 'Black O-Back Chair',       'Chairs', 0, 'each', 'sale', 'Sleek black O-back chair with a modern infinity-ring back design, ideal for black-themed or contemporary events.', 10),
('s19', 'Red Banquet Chair',        'Chairs', 0, 'each', 'sale', 'Padded red fabric banquet chairs with gold metal frame, suitable for large outdoor events and ceremonies.', 10);

-- ═══════════════════════════════════════════
-- IMAGES  (paths relative to public_html/)
-- ═══════════════════════════════════════════

-- Canopy images
INSERT INTO product_images (product_id, image_url, sort_order) VALUES
('r1',  '/images/Tents/Tent1.jpeg', 0),
('r1',  '/images/Tents/Tent2.jpeg', 1),
('r2',  '/images/Tents/Tent5.jpeg', 0),
('r2',  '/images/Tents/Tent4.jpeg', 1),
('r27', '/images/Tents/Tent3.jpeg', 0),
('r28', '/images/Tents/Tent6.jpeg', 0),
('r28', '/images/Tents/Tent7.jpeg', 1),
('r29', '/images/Tents/Tent8.jpeg', 0),
('r30', '/images/Tents/Tent9.jpeg', 0),
('r30', '/images/Tents/Tent10.jpeg',1);

-- Chair images
INSERT INTO product_images (product_id, image_url, sort_order) VALUES
('r3',  '/images/ChairTableSets/ChairTable6.jpeg',  0),
('r3',  '/images/ChairTableSets/ChairTable26.jpeg', 1),
('r4',  '/images/ChairTableSets/ChairTable7.jpeg',  0),
('r4',  '/images/ChairTableSets/ChairTable4.jpeg',  1),
('r4',  '/images/ChairTableSets/ChairTable20.jpeg', 2),
('r12', '/images/ChairTableSets/ChairTable13.jpeg', 0),
('r13', '/images/ChairTableSets/ChairTable14.jpeg', 0),
('r14', '/images/ChairTableSets/ChairTable15.jpeg', 0),
('r15', '/images/ChairTableSets/ChairTable16.jpeg', 0),
('r16', '/images/ChairTableSets/ChairTable1.jpeg',  0),
('r17', '/images/ChairTableSets/ChairTable17.jpeg', 0),
('r19', '/images/ChairTableSets/ChairTable25.jpeg', 0),
('r20', '/images/ChairTableSets/ChairTable28.jpeg', 0),
('r21', '/images/ChairTableSets/ChairTable31.jpeg', 0),
('r22', '/images/ChairTableSets/ChairTable34.jpeg', 0),
('r23', '/images/ChairTableSets/ChairTable35.jpeg', 0),
('r24', '/images/ChairTableSets/ChairTable38.jpeg', 0);

-- Table images
INSERT INTO product_images (product_id, image_url, sort_order) VALUES
('r5',  '/images/ChairTableSets/ChairTable36.jpeg',         0),
('r6',  '/images/EventSets/EventSet2.jpeg',                 0),
('r6',  '/images/EventSets/EventSet12.jpeg',                1),
('r7',  '/images/ChairTableSets/ChairTable40.jpeg',         0),
('r8',  '/images/EventSets/eventset1/EventSet1_5.jpeg',     0),
('r8',  '/images/EventSets/eventset1/EventSet1_1.jpeg',     1),
('r9',  '/images/ChairTableSets/ChairTable30.jpeg',         0),
('r9',  '/images/ChairTableSets/ChairTable22.jpeg',         1),
('r9',  '/images/ChairTableSets/ChairTable19.jpeg',         2),
('r10', '/images/ChairTableSets/ChairTable21.jpeg',         0),
('r10', '/images/ChairTableSets/ChairTable23.jpeg',         1),
('r18', '/images/ChairTableSets/ChairTable18.jpeg',         0),
('r25', '/images/ChairTableSets/ChairTable37.jpeg',         0),
('r26', '/images/ChairTableSets/ChairTable33.jpeg',         0);

-- Fan images
INSERT INTO product_images (product_id, image_url, sort_order) VALUES
('r11', '/images/EventSets/EventSet8.jpeg', 0);

-- Sales product images
INSERT INTO product_images (product_id, image_url, sort_order) VALUES
('s1',  '/images/ChairTableSets/ChairTable36.jpeg',     0),
('s2',  '/images/ChairTableSets/ChairTable40.jpeg',     0),
('s3',  '/images/ChairTableSets/ChairTable30.jpeg',     0),
('s3',  '/images/ChairTableSets/ChairTable22.jpeg',     1),
('s4',  '/images/EventSets/EventSet8.jpeg',             0),
('s5',  '/images/ChairTableSets/ChairTable2.jpeg',      0),
('s6',  '/images/ChairTableSets/ChairTable33.jpeg',     0),
('s7',  '/images/ChairTableSets/ChairTable13.jpeg',     0),
('s8',  '/images/ChairTableSets/ChairTable14.jpeg',     0),
('s9',  '/images/ChairTableSets/ChairTable15.jpeg',     0),
('s10', '/images/ChairTableSets/ChairTable16.jpeg',     0),
('s11', '/images/ChairTableSets/ChairTable1.jpeg',      0),
('s12', '/images/ChairTableSets/ChairTable17.jpeg',     0),
('s13', '/images/ChairTableSets/ChairTable18.jpeg',     0),
('s14', '/images/ChairTableSets/ChairTable25.jpeg',     0),
('s15', '/images/ChairTableSets/ChairTable28.jpeg',     0),
('s16', '/images/ChairTableSets/ChairTable31.jpeg',     0),
('s17', '/images/ChairTableSets/ChairTable34.jpeg',     0),
('s18', '/images/ChairTableSets/ChairTable35.jpeg',     0),
('s19', '/images/ChairTableSets/ChairTable38.jpeg',     0),
('s20', '/images/ChairTableSets/ChairTable37.jpeg',     0);

-- ═══════════════════════════════════════════
-- SPECS
-- ═══════════════════════════════════════════

-- r1 Small Canopy
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r1','Size: 15ft × 7ft',0),('r1','Colour: White',1),('r1','Capacity: Up to 10 guests',2),('r1','Minimum rental: 1 day',3);

-- r2 Large Canopy
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r2','Size: 20ft x 10ft',0),('r2','Colour: White',1),('r2','Capacity: Up to 20 guests',2),('r2','Minimum rental: 1 day',3);

-- r27 Twin Pagoda
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r27','Each unit: 10ft × 10ft',0),('r27','Colour: White',1),('r27','Style: Pagoda/High-peak',2),('r27','Setup included',3),('r27','Minimum rental: 1 day',4);

-- r28 Large Linked Pagoda
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r28','Customizable length',0),('r28','Colour: White',1),('r28','Optional: Enclosed side walls',2),('r28','Style: High-peak pagoda',3),('r28','Setup included',4),('r28','Minimum rental: 1 day',5);

-- r29 Open-Sided Pagoda
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r29','Size: 10ft × 10ft',0),('r29','Colour: White',1),('r29','Style: Pagoda, open sides',2),('r29','Setup included',3),('r29','Minimum rental: 1 day',4);

-- r30 High-Peak
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r30','Size: 20ft × 30ft+',0),('r30','Colour: White',1),('r30','Style: High-peak',2),('r30','VIP-grade structure',3),('r30','Setup included',4),('r30','Minimum rental: 1 day',5);

-- r3 Lounge Chairs
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r3','Color: White',0),('r3','Minimum rental: 1 day',1);

-- r4 Cocktail Chairs
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r4','Colors: White, Black',0),('r4','Minimum rental: 1 day',1);

-- r12 Gold Banquet Chair
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r12','Color: Gold/White',0),('r12','Style: Round-back banquet',1),('r12','Minimum rental: 1 day',2);

-- r13 Carved Wooden Armchair
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r13','Color: Rose Gold/White',0),('r13','Material: Carved Wood',1),('r13','Armrests: Included',2),('r13','Minimum rental: 1 day',3);

-- r14 Baroque Gold Armchair
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r14','Color: Gold/White',0),('r14','Style: Baroque',1),('r14','Armrests: Included',2),('r14','Minimum rental: 1 day',3);

-- r15 Gold Napoleon Chair
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r15','Color: Gold/White',0),('r15','Style: Napoleon',1),('r15','Cushion: Included',2),('r15','Minimum rental: 1 day',3);

-- r16 Black Leather Lounge Set
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r16','Color: Black',0),('r16','Includes: 1 sofa, 2 bench seats, 1 coffee table',1),('r16','Material: Leather',2),('r16','Minimum rental: 1 day',3);

-- r17 Cross-Back Chair
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r17','Color: Natural Wood/Brown',0),('r17','Style: Cross-back',1),('r17','Minimum rental: 1 day',2);

-- r19 Wooden O-Back
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r19','Color: Natural Wood',0),('r19','Style: O-Back/Infinity',1),('r19','Minimum rental: 1 day',2);

-- r20 Black Modular Sofa
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r20','Color: Black',0),('r20','Includes: 2 sofa sections, 2 round ottomans',1),('r20','Material: Leather',2),('r20','Minimum rental: 1 day',3);

-- r21 White Event Lounge Set
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r21','Color: White',0),('r21','Style: Modern/Contemporary',1),('r21','Available for large-scale event setups',2),('r21','Minimum rental: 1 day',3);

-- r22 Gold Chiavari
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r22','Color: Gold/White',0),('r22','Style: Chiavari/Tiffany',1),('r22','Cushion: Included',2),('r22','Minimum rental: 1 day',3);

-- r23 Black O-Back
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r23','Color: Black',0),('r23','Style: O-Back/Infinity',1),('r23','Minimum rental: 1 day',2);

-- r24 Red Banquet Chair
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r24','Color: Red/Gold',0),('r24','Style: Padded Banquet',1),('r24','Material: Fabric cushion + metal frame',2),('r24','Minimum rental: 1 day',3);

-- r5 Round Table
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r5','Color: White',0),('r5','Size: 4ft radius',1),('r5','Minimum rental: 1 day',2);

-- r6 Round Banquet Table
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r6','Color: Your Choice',0),('r6','Table cloth inclusive',1),('r6','Minimum rental: 1 day',2);

-- r7 Rectangular Table
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r7','Color: White',0),('r7','Size: 5ft x 3ft',1),('r7','Minimum rental: 1 day',2);

-- r8 Rectangular Banquet Table
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r8','Color: Your Choice',0),('r8','Table cloth inclusive',1),('r8','Minimum rental: 1 day',2);

-- r9 Cocktail Table
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r9','Color: White, Black',0),('r9','Base: Golden',1),('r9','Minimum rental: 1 day',2);

-- r10 Glowing Cocktail Tables
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r10','Color: Green, Red',0),('r10','Power: Electric (LED)',1),('r10','Minimum rental: 1 day',2);

-- r18 Rustic Farm Table
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r18','Color: Natural Wood',0),('r18','Style: Farm/Harvest',1),('r18','Size: Approx 8ft × 3ft',2),('r18','Minimum rental: 1 day',3);

-- r25 LED Glow Bar Counter
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r25','Color: White (LED illuminated)',0),('r25','Shape: Curved',1),('r25','Size: Approx 5ft wide',2),('r25','Power: Electric',3),('r25','Minimum rental: 1 day',4);

-- r26 Plastic Folding Round Table
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r26','Color: White',0),('r26','Shape: Round',1),('r26','Size: 5ft diameter',2),('r26','Type: Folding',3),('r26','Minimum rental: 1 day',4);

-- r11 Standing Fan
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('r11','Type: Standing/Oscillating',0),('r11','Power: Electric',1),('r11','Minimum rental: 1 day',2);

-- Sales specs
INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('s1','Color: White',0),('s1','Size: 4ft radius',1),('s1','Type: Round',2);

INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('s2','Color: White',0),('s2','Size: 5ft x 3ft',1),('s2','Type: Rectangular',2);

INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('s3','Color: White, Black',0),('s3','Base: Golden',1),('s3','Type: Cocktail/High-top',2);

INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('s4','Type: Standing/Oscillating',0),('s4','Power: Electric',1);

INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('s5','Color: White',0),('s5','Material: Leather',1),('s5','Includes: Sofas, bench seats, side tables',2);

INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('s6','Color: White',0),('s6','Shape: Round',1),('s6','Size: 5ft diameter',2),('s6','Type: Folding',3);

INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('s7','Color: Gold/White',0),('s7','Style: Round-back banquet',1);

INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('s8','Color: Rose Gold/White',0),('s8','Material: Carved Wood',1),('s8','Armrests: Included',2);

INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('s9','Color: Gold/White',0),('s9','Style: Baroque',1),('s9','Armrests: Included',2);

INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('s10','Color: Gold/White',0),('s10','Style: Napoleon',1),('s10','Cushion: Included',2);

INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('s11','Color: Black',0),('s11','Includes: 1 sofa, 2 bench seats, 1 coffee table',1),('s11','Material: Leather',2);

INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('s12','Color: Natural Wood/Brown',0),('s12','Style: Cross-back',1);

INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('s13','Color: Natural Wood',0),('s13','Style: Farm/Harvest',1),('s13','Size: Approx 8ft × 3ft',2);

INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('s14','Color: Natural Wood',0),('s14','Style: O-Back/Infinity',1);

INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('s15','Color: Black',0),('s15','Includes: 2 sofa sections, 2 round ottomans',1),('s15','Material: Leather',2);

INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('s16','Color: White',0),('s16','Style: Modern/Contemporary',1);

INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('s17','Color: Gold/White',0),('s17','Style: Chiavari/Tiffany',1),('s17','Cushion: Included',2);

INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('s18','Color: Black',0),('s18','Style: O-Back/Infinity',1);

INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('s19','Color: Red/Gold',0),('s19','Style: Padded Banquet',1),('s19','Material: Fabric cushion + metal frame',2);

INSERT INTO product_specs (product_id, spec_text, sort_order) VALUES
('s20','Color: White (LED illuminated)',0),('s20','Shape: Curved',1),('s20','Size: Approx 5ft wide',2),('s20','Power: Electric',3);
