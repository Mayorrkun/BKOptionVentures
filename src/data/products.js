//Canopies
import tent1 from '../Images/Tents/Tent1.jpeg';
import tent2 from '../Images/Tents/Tent2.jpeg';
import tent3 from '../Images/Tents/Tent3.jpeg';
import tent4 from '../Images/Tents/Tent4.jpeg';
import tent5 from '../Images/Tents/Tent5.jpeg';
import tent6 from '../Images/Tents/Tent6.jpeg';
import tent7 from '../Images/Tents/Tent7.jpeg';
import tent8 from '../Images/Tents/Tent8.jpeg';
import tent9 from '../Images/Tents/Tent9.jpeg';
import tent10 from '../Images/Tents/Tent10.jpeg';

//Chairs
import chair1 from '../Images/ChairTableSets/ChairTable1.jpeg';
import chair2 from '../Images/ChairTableSets/ChairTable2.jpeg';
import chair13 from '../Images/ChairTableSets/ChairTable13.jpeg';
import chair14 from '../Images/ChairTableSets/ChairTable14.jpeg';
import chair15 from '../Images/ChairTableSets/ChairTable15.jpeg';
import chair16 from '../Images/ChairTableSets/ChairTable16.jpeg';
import chair17 from '../Images/ChairTableSets/ChairTable17.jpeg';
import chair18 from '../Images/ChairTableSets/ChairTable18.jpeg';
import chair25 from '../Images/ChairTableSets/ChairTable25.jpeg';
import chair28 from '../Images/ChairTableSets/ChairTable28.jpeg';
import chair31 from '../Images/ChairTableSets/ChairTable31.jpeg';
import chair34 from '../Images/ChairTableSets/ChairTable34.jpeg';
import chair35 from '../Images/ChairTableSets/ChairTable35.jpeg';

import chair38 from '../Images/ChairTableSets/ChairTable38.jpeg';


import LoungeChair1 from '../Images/ChairTableSets/ChairTable6.jpeg';
import LoungeChair2 from '../Images/ChairTableSets/ChairTable26.jpeg';


import cocktailChair1 from '../Images/ChairTableSets/ChairTable7.jpeg';
import cocktailChair2 from '../Images/ChairTableSets/ChairTable4.jpeg';

//Tables
import roundTable1 from '../Images/ChairTableSets/ChairTable36.jpeg';
import roundBanquetTable1 from '../Images/EventSets/EventSet2.jpeg';
import roundBanquetTable2 from '../Images/EventSets/EventSet12.jpeg';

import rectTable1 from '../Images/ChairTableSets/ChairTable40.jpeg';
import rectBanquetTable1 from '../Images/EventSets/eventset1/EventSet1_5.jpeg';
import rectBanquetTable2 from '../Images/EventSets/eventset1/EventSet1_1.jpeg';

import cocktailTable from '../Images/ChairTableSets/ChairTable30.jpeg';
import cocktailTables from '../Images/ChairTableSets/ChairTable22.jpeg';
import glowingCocktailTable1 from '../Images/ChairTableSets/ChairTable21.jpeg';
import glowingCocktailTable2 from '../Images/ChairTableSets/ChairTable23.jpeg';

import cocktailSet1 from '../Images/ChairTableSets/ChairTable20.jpeg';
import cocktailSet2 from '../Images/ChairTableSets/ChairTable19.jpeg';

import table37 from '../Images/ChairTableSets/ChairTable37.jpeg';
import table33 from '../Images/ChairTableSets/ChairTable33.jpeg';

//Fans
import standingFan from '../Images/EventSets/EventSet8.jpeg';


export const rentalProducts = [
    //canopies
    {
        id: 'r1',
        name: 'Small Canopy (15×7 ft)',
        category: 'Canopies',
        price: 15000,
        priceUnit: 'per day',
        description:
            'Perfect for intimate outdoor events. White canopy provides shade and shelter for up to 10 guests. Easy setup and takedown included in the rental.',
        specs: [
            'Size: 15ft × 7ft',
            'Colour: White',
            'Capacity: Up to 10 guests',
            'Minimum rental: 1 day',
        ],
        images: [tent1, tent2],
    },
    {
        id: 'r2',
        name: 'Large Canopy (20 x 10 ft)',
        category: 'Canopies',
        price: 20000,
        priceUnit: 'per day',
        description:
            'Perfect for outdoor events. White canopy provides shade and shelter for up to 20 guests. Easy setup and takedown included in the rental.',
        specs: [
            'Size: 20ft x 10ft',
            'Colour: White',
            'Capacity: Up to 20 guests',
            'Minimum rental: 1 day',
        ],
        images: [tent5, tent4],
    },
    {
        id: 'r27',
        name: 'Twin Pagoda Canopy Setup',
        category: 'Canopies',
        price: 30000,
        priceUnit: 'per day',
        description:
            'Set of two linked pagoda-style canopies providing a shaded outdoor event space, ideal for medium-sized private events and garden parties.',
        specs: [
            'Each unit: 10ft × 10ft',
            'Colour: White',
            'Style: Pagoda/High-peak',
            'Setup included',
            'Minimum rental: 1 day',
        ],
        images: [tent3],
    },
    {
        id: 'r28',
        name: 'Large Linked Pagoda Canopy',
        category: 'Canopies',
        price: 60000,
        priceUnit: 'per day',
        description:
            'A series of linked high-peak pagoda canopies forming a large covered area, suitable for corporate events and large outdoor gatherings. Optional enclosed walls available.',
        specs: [
            'Customizable length',
            'Colour: White',
            'Optional: Enclosed side walls',
            'Style: High-peak pagoda',
            'Setup included',
            'Minimum rental: 1 day',
        ],
        images: [tent6, tent7],
    },
    {
        id: 'r29',
        name: 'Open-Sided Pagoda Canopy',
        category: 'Canopies',
        price: 25000,
        priceUnit: 'per day',
        description:
            'Classic open-sided pagoda canopy, great for private parties, corporate activations, and garden events.',
        specs: [
            'Size: 10ft × 10ft',
            'Colour: White',
            'Style: Pagoda, open sides',
            'Setup included',
            'Minimum rental: 1 day',
        ],
        images: [tent8],
    },
    {
        id: 'r30',
        name: 'High-Peak Event Canopy',
        category: 'Canopies',
        price: 45000,
        priceUnit: 'per day',
        description:
            'Premium high-peak event canopy, perfect for VIP outdoor receptions, corporate functions, and formal ceremonies.',
        specs: [
            'Size: 20ft × 30ft+',
            'Colour: White',
            'Style: High-peak',
            'VIP-grade structure',
            'Setup included',
            'Minimum rental: 1 day',
        ],
        images: [tent9, tent10],
    },
    //chairs
    {
        id: 'r3',
        name: 'Lounge Chairs',
        category: 'Chairs',
        price: 5000,
        priceUnit: 'per day',
        description:
            'All white comfy lounge chairs perfect for lounges and events.',
        specs: [
            'Color: White',
            'Minimum rental: 1 day',
        ],
        images: [LoungeChair1, LoungeChair2],
    },
    {
        id: 'r4',
        name: 'Cocktail Chairs',
        category: 'Chairs',
        price: 5000,
        priceUnit: 'per day',
        description:
            'Short cocktail chairs with golden back rests, perfect for gatherings and events.',
        specs: [
            'Colors: White, Black',
            'Minimum rental: 1 day',
        ],
        images: [cocktailChair1, cocktailChair2, cocktailSet1, cocktailChair2],
    },
    {
        id: 'r12',
        name: 'Gold Banquet Chair',
        category: 'Chairs',
        price: 3000,
        priceUnit: 'per day',
        description:
            'Elegant gold-framed round-back banquet chairs with white upholstery, perfect for weddings and formal events.',
        specs: [
            'Color: Gold/White',
            'Style: Round-back banquet',
            'Minimum rental: 1 day',
        ],
        images: [chair13],
    },
    {
        id: 'r13',
        name: 'Carved Wooden Armchair',
        category: 'Chairs',
        price: 4000,
        priceUnit: 'per day',
        description:
            'Elegantly carved wooden armchairs with plush white cushions, ideal for VIP seating areas and high-end events.',
        specs: [
            'Color: Rose Gold/White',
            'Material: Carved Wood',
            'Armrests: Included',
            'Minimum rental: 1 day',
        ],
        images: [chair14],
    },
    {
        id: 'r14',
        name: 'Baroque Gold Armchair',
        category: 'Chairs',
        price: 6000,
        priceUnit: 'per day',
        description:
            'Luxurious baroque-style armchair with an ornate gold frame and white leather cushion — a statement piece for any event.',
        specs: [
            'Color: Gold/White',
            'Style: Baroque',
            'Armrests: Included',
            'Minimum rental: 1 day',
        ],
        images: [chair15],
    },
    {
        id: 'r15',
        name: 'Gold Napoleon Chair',
        category: 'Chairs',
        price: 3000,
        priceUnit: 'per day',
        description:
            'Classic gold Napoleon chair with white cushion pad — a timeless choice for elegant events and ceremonies.',
        specs: [
            'Color: Gold/White',
            'Style: Napoleon',
            'Cushion: Included',
            'Minimum rental: 1 day',
        ],
        images: [chair16],
    },
    {
        id: 'r16',
        name: 'Black Leather Lounge Set',
        category: 'Chairs',
        price: 35000,
        priceUnit: 'per day',
        description:
            'Sleek black leather sofa set with matching bench seats and a dark glass coffee table, ideal for VIP lounge areas.',
        specs: [
            'Color: Black',
            'Includes: 1 sofa, 2 bench seats, 1 coffee table',
            'Material: Leather',
            'Minimum rental: 1 day',
        ],
        images: [chair1],
    },
    {
        id: 'r17',
        name: 'Cross-Back Chair',
        category: 'Chairs',
        price: 3500,
        priceUnit: 'per day',
        description:
            'Rustic yet elegant cross-back wooden chairs, a popular choice for outdoor weddings and garden events.',
        specs: [
            'Color: Natural Wood/Brown',
            'Style: Cross-back',
            'Minimum rental: 1 day',
        ],
        images: [chair17],
    },
    {
        id: 'r19',
        name: 'Wooden O-Back Chair',
        category: 'Chairs',
        price: 3500,
        priceUnit: 'per day',
        description:
            'Elegant wooden O-back chairs with a smooth natural wood finish, perfect for modern and rustic-themed events.',
        specs: [
            'Color: Natural Wood',
            'Style: O-Back/Infinity',
            'Minimum rental: 1 day',
        ],
        images: [chair25],
    },
    {
        id: 'r20',
        name: 'Black Modular Sofa Set',
        category: 'Chairs',
        price: 30000,
        priceUnit: 'per day',
        description:
            'Modern tufted black leather modular sofa with matching round ottomans, perfect for VIP lounge setups.',
        specs: [
            'Color: Black',
            'Includes: 2 sofa sections, 2 round ottomans',
            'Material: Leather',
            'Minimum rental: 1 day',
        ],
        images: [chair28],
    },
    {
        id: 'r21',
        name: 'White Event Lounge Set',
        category: 'Chairs',
        price: 20000,
        priceUnit: 'per day',
        description:
            'Contemporary white lounge sofas ideal for large-scale event lounges, concerts, and corporate gatherings.',
        specs: [
            'Color: White',
            'Style: Modern/Contemporary',
            'Available for large-scale event setups',
            'Minimum rental: 1 day',
        ],
        images: [chair31],
    },
    {
        id: 'r22',
        name: 'Gold Chiavari Chair',
        category: 'Chairs',
        price: 3000,
        priceUnit: 'per day',
        description:
            'Classic gold Chiavari (Tiffany) chairs with white cushion pads — a staple for weddings and grand celebrations.',
        specs: [
            'Color: Gold/White',
            'Style: Chiavari/Tiffany',
            'Cushion: Included',
            'Minimum rental: 1 day',
        ],
        images: [chair34],
    },
    {
        id: 'r23',
        name: 'Black O-Back Chair',
        category: 'Chairs',
        price: 3500,
        priceUnit: 'per day',
        description:
            'Sleek black O-back chair with a modern infinity-ring back design, ideal for black-themed or contemporary events.',
        specs: [
            'Color: Black',
            'Style: O-Back/Infinity',
            'Minimum rental: 1 day',
        ],
        images: [chair35],
    },
    {
        id: 'r24',
        name: 'Red Banquet Chair',
        category: 'Chairs',
        price: 2500,
        priceUnit: 'per day',
        description:
            'Padded red fabric banquet chairs with gold metal frame, suitable for large outdoor events and ceremonies.',
        specs: [
            'Color: Red/Gold',
            'Style: Padded Banquet',
            'Material: Fabric cushion + metal frame',
            'Minimum rental: 1 day',
        ],
        images: [chair38],
    },
    // tables
    {
        id: 'r5',
        name: 'Round Table',
        category: 'Tables',
        price: 7000,
        priceUnit: 'per day',
        description:
            'Plain white round tables, lightweight and easy to set up for any event.',
        specs: [
            'Color: White',
            'Size: 4ft radius',
            'Minimum rental: 1 day',
        ],
        images: [roundTable1],
    },
    {
        id: 'r6',
        name: 'Round Banquet Table',
        category: 'Tables',
        price: 7500,
        priceUnit: 'per day',
        description:
            'Round banquet tables with beautiful table coverings in your choice of color.',
        specs: [
            'Color: Your Choice',
            'Table cloth inclusive',
            'Minimum rental: 1 day',
        ],
        images: [roundBanquetTable1, roundBanquetTable2],
    },
    {
        id: 'r7',
        name: 'Rectangular Table',
        category: 'Tables',
        price: 7000,
        priceUnit: 'per day',
        description:
            'Plain white rectangular tables, perfect for banquet-style seating arrangements.',
        specs: [
            'Color: White',
            'Size: 5ft x 3ft',
            'Minimum rental: 1 day',
        ],
        images: [rectTable1],
    },
    {
        id: 'r8',
        name: 'Rectangular Banquet Table',
        category: 'Tables',
        price: 7500,
        priceUnit: 'per day',
        description:
            'Rectangular banquet tables with beautiful table coverings in your choice of color.',
        specs: [
            'Color: Your Choice',
            'Table cloth inclusive',
            'Minimum rental: 1 day',
        ],
        images: [rectBanquetTable1, rectBanquetTable2],
    },
    {
        id: 'r9',
        name: 'Cocktail Table',
        category: 'Tables',
        price: 5000,
        priceUnit: 'per day',
        description:
            'Round cocktail tables with golden base, available in white and black finishes.',
        specs: [
            'Color: White, Black',
            'Base: Golden',
            'Minimum rental: 1 day',
        ],
        images: [cocktailTable, cocktailTables, cocktailSet2, cocktailSet1],
    },
    {
        id: 'r10',
        name: 'Glowing Cocktail Tables',
        category: 'Tables',
        price: 8000,
        priceUnit: 'per day',
        description:
            'LED-glowing cocktail tables, perfect for night parties and themed events.',
        specs: [
            'Color: Green, Red',
            'Power: Electric (LED)',
            'Minimum rental: 1 day',
        ],
        images: [glowingCocktailTable1, glowingCocktailTable2],
    },
    {
        id: 'r18',
        name: 'Rustic Farm Table',
        category: 'Tables',
        price: 12000,
        priceUnit: 'per day',
        description:
            'Beautiful rustic wooden farm/harvest table, perfect for intimate wedding receptions and outdoor garden events.',
        specs: [
            'Color: Natural Wood',
            'Style: Farm/Harvest',
            'Size: Approx 8ft × 3ft',
            'Minimum rental: 1 day',
        ],
        images: [chair18],
    },
    {
        id: 'r25',
        name: 'LED Glow Bar Counter',
        category: 'Tables',
        price: 20000,
        priceUnit: 'per day',
        description:
            'Eye-catching curved LED-illuminated bar counter that glows white, perfect for nighttime parties, club events, and VIP receptions.',
        specs: [
            'Color: White (LED illuminated)',
            'Shape: Curved',
            'Size: Approx 5ft wide',
            'Power: Electric',
            'Minimum rental: 1 day',
        ],
        images: [table37],
    },
    {
        id: 'r26',
        name: 'Plastic Folding Round Table',
        category: 'Tables',
        price: 5000,
        priceUnit: 'per day',
        description:
            'Sturdy white plastic folding round table, easy to set up and clean, suitable for large outdoor events.',
        specs: [
            'Color: White',
            'Shape: Round',
            'Size: 5ft diameter',
            'Type: Folding',
            'Minimum rental: 1 day',
        ],
        images: [table33],
    },
    //fans
    {
        id: 'r11',
        name: 'Standing Fan',
        category: 'Fans',
        price: 0,
        priceUnit: 'per day',
        description:
            'Rotating standing fan suitable for indoor and outdoor events.',
        specs: [
            'Type: Standing/Oscillating',
            'Power: Electric',
            'Minimum rental: 1 day',
        ],
        images: [standingFan],
    },
];

export const salesProducts = [
    //tables
    {
        id: 's1',
        name: 'Round Table',
        category: 'Tables',
        price: 0,
        priceUnit: 'each',
        description: 'Plain white round tables, ideal for events and everyday use. Lightweight and easy to set up.',
        specs: [
            'Color: White',
            'Size: 4ft radius',
            'Type: Round',
        ],
        images: [roundTable1],
        stock: 10,
    },
    {
        id: 's2',
        name: 'Rectangular Table',
        category: 'Tables',
        price: 0,
        priceUnit: 'each',
        description: 'Plain white rectangular tables, perfect for events and multipurpose use.',
        specs: [
            'Color: White',
            'Size: 5ft x 3ft',
            'Type: Rectangular',
        ],
        images: [rectTable1],
        stock: 10,
    },
    {
        id: 's3',
        name: 'Cocktail Table',
        category: 'Tables',
        price: 0,
        priceUnit: 'each',
        description: 'Round cocktail tables with golden base, available in white and black finishes.',
        specs: [
            'Color: White, Black',
            'Base: Golden',
            'Type: Cocktail/High-top',
        ],
        images: [cocktailTable, cocktailTables],
        stock: 10,
    },
    {
        id: 's6',
        name: 'Plastic Folding Round Table',
        category: 'Tables',
        price: 0,
        priceUnit: 'each',
        description: 'Sturdy white plastic folding round table, perfect for events and everyday use. Easy to set up and clean.',
        specs: [
            'Color: White',
            'Shape: Round',
            'Size: 5ft diameter',
            'Type: Folding',
        ],
        images: [table33],
        stock: 10,
    },
    {
        id: 's13',
        name: 'Rustic Farm Table',
        category: 'Tables',
        price: 0,
        priceUnit: 'each',
        description: 'Beautiful rustic wooden farm/harvest table, perfect for intimate wedding receptions and outdoor garden events.',
        specs: [
            'Color: Natural Wood',
            'Style: Farm/Harvest',
            'Size: Approx 8ft × 3ft',
        ],
        images: [chair18],
        stock: 10,
    },
    {
        id: 's20',
        name: 'LED Glow Bar Counter',
        category: 'Tables',
        price: 0,
        priceUnit: 'each',
        description: 'Eye-catching curved LED-illuminated bar counter that glows white, perfect for nighttime parties, club events, and VIP receptions.',
        specs: [
            'Color: White (LED illuminated)',
            'Shape: Curved',
            'Size: Approx 5ft wide',
            'Power: Electric',
        ],
        images: [table37],
        stock: 10,
    },
    //fans
    {
        id: 's4',
        name: 'Standing Fan',
        category: 'Fans',
        price: 0,
        priceUnit: 'each',
        description: 'Rotating standing fan suitable for indoor and outdoor events.',
        specs: [
            'Type: Standing/Oscillating',
            'Power: Electric',
        ],
        images: [standingFan],
        stock: 10,
    },
    //chairs
    {
        id: 's5',
        name: 'White Lounge Sofa Set',
        category: 'Chairs',
        price: 0,
        priceUnit: 'each',
        description: 'White leather lounge sofas and bench seats with side tables, ideal for concert lounges and large outdoor events.',
        specs: [
            'Color: White',
            'Material: Leather',
            'Includes: Sofas, bench seats, side tables',
        ],
        images: [chair2],
        stock: 10,
    },
    {
        id: 's7',
        name: 'Gold Banquet Chair',
        category: 'Chairs',
        price: 0,
        priceUnit: 'each',
        description: 'Elegant gold-framed round-back banquet chairs with white upholstery, perfect for weddings and formal events.',
        specs: [
            'Color: Gold/White',
            'Style: Round-back banquet',
        ],
        images: [chair13],
        stock: 10,
    },
    {
        id: 's8',
        name: 'Carved Wooden Armchair',
        category: 'Chairs',
        price: 0,
        priceUnit: 'each',
        description: 'Elegantly carved wooden armchairs with plush white cushions, ideal for VIP seating areas and high-end events.',
        specs: [
            'Color: Rose Gold/White',
            'Material: Carved Wood',
            'Armrests: Included',
        ],
        images: [chair14],
        stock: 10,
    },
    {
        id: 's9',
        name: 'Baroque Gold Armchair',
        category: 'Chairs',
        price: 0,
        priceUnit: 'each',
        description: 'Luxurious baroque-style armchair with an ornate gold frame and white leather cushion — a statement piece for any event.',
        specs: [
            'Color: Gold/White',
            'Style: Baroque',
            'Armrests: Included',
        ],
        images: [chair15],
        stock: 10,
    },
    {
        id: 's10',
        name: 'Gold Napoleon Chair',
        category: 'Chairs',
        price: 0,
        priceUnit: 'each',
        description: 'Classic gold Napoleon chair with white cushion pad — a timeless choice for elegant events and ceremonies.',
        specs: [
            'Color: Gold/White',
            'Style: Napoleon',
            'Cushion: Included',
        ],
        images: [chair16],
        stock: 10,
    },
    {
        id: 's11',
        name: 'Black Leather Lounge Set',
        category: 'Chairs',
        price: 0,
        priceUnit: 'each',
        description: 'Sleek black leather sofa set with matching bench seats and a dark glass coffee table, ideal for VIP lounge areas.',
        specs: [
            'Color: Black',
            'Includes: 1 sofa, 2 bench seats, 1 coffee table',
            'Material: Leather',
        ],
        images: [chair1],
        stock: 10,
    },
    {
        id: 's12',
        name: 'Cross-Back Chair',
        category: 'Chairs',
        price: 0,
        priceUnit: 'each',
        description: 'Rustic yet elegant cross-back wooden chairs, a popular choice for outdoor weddings and garden events.',
        specs: [
            'Color: Natural Wood/Brown',
            'Style: Cross-back',
        ],
        images: [chair17],
        stock: 10,
    },
    {
        id: 's14',
        name: 'Wooden O-Back Chair',
        category: 'Chairs',
        price: 0,
        priceUnit: 'each',
        description: 'Elegant wooden O-back chairs with a smooth natural wood finish, perfect for modern and rustic-themed events.',
        specs: [
            'Color: Natural Wood',
            'Style: O-Back/Infinity',
        ],
        images: [chair25],
        stock: 10,
    },
    {
        id: 's15',
        name: 'Black Modular Sofa Set',
        category: 'Chairs',
        price: 0,
        priceUnit: 'each',
        description: 'Modern tufted black leather modular sofa with matching round ottomans, perfect for VIP lounge setups.',
        specs: [
            'Color: Black',
            'Includes: 2 sofa sections, 2 round ottomans',
            'Material: Leather',
        ],
        images: [chair28],
        stock: 10,
    },
    {
        id: 's16',
        name: 'White Event Lounge Set',
        category: 'Chairs',
        price: 0,
        priceUnit: 'each',
        description: 'Contemporary white lounge sofas ideal for large-scale event lounges, concerts, and corporate gatherings.',
        specs: [
            'Color: White',
            'Style: Modern/Contemporary',
        ],
        images: [chair31],
        stock: 10,
    },
    {
        id: 's17',
        name: 'Gold Chiavari Chair',
        category: 'Chairs',
        price: 0,
        priceUnit: 'each',
        description: 'Classic gold Chiavari (Tiffany) chairs with white cushion pads — a staple for weddings and grand celebrations.',
        specs: [
            'Color: Gold/White',
            'Style: Chiavari/Tiffany',
            'Cushion: Included',
        ],
        images: [chair34],
        stock: 10,
    },
    {
        id: 's18',
        name: 'Black O-Back Chair',
        category: 'Chairs',
        price: 0,
        priceUnit: 'each',
        description: 'Sleek black O-back chair with a modern infinity-ring back design, ideal for black-themed or contemporary events.',
        specs: [
            'Color: Black',
            'Style: O-Back/Infinity',
        ],
        images: [chair35],
        stock: 10,
    },
    {
        id: 's19',
        name: 'Red Banquet Chair',
        category: 'Chairs',
        price: 0,
        priceUnit: 'each',
        description: 'Padded red fabric banquet chairs with gold metal frame, suitable for large outdoor events and ceremonies.',
        specs: [
            'Color: Red/Gold',
            'Style: Padded Banquet',
            'Material: Fabric cushion + metal frame',
        ],
        images: [chair38],
        stock: 10,
    },
];
