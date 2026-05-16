//Canopies
import tent1 from '../Images/Tents/WhatsApp Image 2026-05-13 at 11.59.58 AM.jpeg';
import tent2 from '../Images/Tents/WhatsApp Image 2026-05-13 at 11.59.59 AM.jpeg';
import tent3 from '../Images/Tents/WhatsApp Image 2026-05-13 at 12.00.01 PM (1).jpeg';
import tent4 from '../Images/Tents/WhatsApp Image 2026-05-13 at 12.00.02 PM.jpeg';
import tent5 from '../Images/Tents/WhatsApp Image 2026-05-13 at 12.08.08 PM.jpeg';

//chairs
import chair1 from '../Images/ChairTableSets/WhatsApp Image 2026-05-13 at 12.00.03 PM.jpeg';
import chair2 from '../Images/ChairTableSets/WhatsApp Image 2026-05-13 at 12.00.04 PM.jpeg';
import chair3 from '../Images/ChairTableSets/WhatsApp Image 2026-05-13 at 12.00.07 PM.jpeg';
import chair4 from '../Images/ChairTableSets/WhatsApp Image 2026-05-13 at 12.07.14 PM.jpeg';
import chair5 from '../Images/ChairTableSets/WhatsApp Image 2026-05-13 at 12.07.20 PM.jpeg';

//tables
import event1 from '../Images/EventSets/WhatsApp Image 2026-05-13 at 12.00.12 PM.jpeg';
import banquetTable1 from '../Images/EventSets/WhatsApp Image 2026-05-13 at 12.08.52 PM.jpeg';
import event3 from '../Images/EventSets/WhatsApp Image 2026-05-13 at 12.08.54 PM (1).jpeg';
import standFan from '../Images/EventSets/WhatsApp Image 2026-05-13 at 12.09.01 PM.jpeg';

export const rentalProducts = [
  {
    id: 'r1',
    name: 'Small Canopy (10×10 ft)',
    category: 'Canopies',
    price: 15000,
    priceUnit: 'per day',
    description:
      'Perfect for intimate outdoor events. Our 10×10 white canopy provides shade and shelter for up to 20 guests. Easy setup and takedown included in the rental.',
    specs: [
      'Size: 10ft × 10ft',
      'Colour: White',
      'Capacity: Up to 20 guests',
      'Setup included',
      'Minimum rental: 1 day',
    ],
    images: [tent1, tent2],
  },
  {
    id: 'r2',
    name: 'Large Canopy (20×20 ft)',
    category: 'Canopies',
    price: 35000,
    priceUnit: 'per day',
    description:
      'Our flagship large canopy is ideal for weddings, corporate events, and large outdoor gatherings of up to 80 guests.',
    specs: [
      'Size: 20ft × 20ft',
      'Colour: White',
      'Capacity: Up to 80 guests',
      'Setup & takedown included',
      'Minimum rental: 1 day',
    ],
    images: [tent3, tent4, tent5],
  },
  {
    id: 'r3',
    name: 'Lounge Chairs',
    category: 'Chairs',
    price: 5000,
    priceUnit: 'per day',
    description:
      'A set of comfy sofa chairs perfect for Lounges and small gatherings',
    specs: [
      'Quantity: ',
      'Colour: White',
      'Material: Heavy-duty plastic',
      'Max load: 120 kg per chair',
    ],
    images: [chair1, chair2],
  },
  {
    id: 'r4',
    name: 'Banquet Chairs',
    category: 'Chairs',
    price: 10000,
    priceUnit: 'per day',
    description:
      'Elegant padded banquet chairs with gold or silver frames. Perfect for weddings and formal dinners.',
    specs: [
      'Quantity: 10 chairs per set',
      'Frame: Gold or Silver (specify on order)',
      'Padding: White cushion',
      'Max load: 150 kg per chair',
    ],
    images: [chair4],
  },
  {
    id: 'r5',
    name: 'Banquet Tables (set of 5)',
    category: 'Tables',
    price: 8000,
    priceUnit: 'per day',
    description:
      'Classic round banquet tables seating 8–10 guests each. Available with or without tablecloths.',
    specs: [
      'Quantity: 5 tables per set',
      'Diameter: 152 cm (5 ft)',
      'Seats: 8–10 per table',
      'Height: 76 cm',
    ],
    images: [banquetTable1],
  },
  {
    id: 'r6',
    name: 'Round Tables (set of 5)',
    category: 'Tables',
    price: 7000,
    priceUnit: 'per day',
    description:
      'Versatile round tables for buffet lines, gift tables, or banquet seating.',
    specs: [
      'Quantity: 5 tables per set',
      'Size: 183 cm × 76 cm (6 ft)',
      'Seats: 6–8 per table',
      'Height: 76 cm',
    ],
    images: [banquetTable1],
  },
  {
    id: 'r7',
    name: 'Standing Fan',
    category: 'Fans',
    price: 4000,
    priceUnit: 'per day',
    description:
      'Powerful industrial-grade standing fans to keep your guests cool during outdoor events.',
    specs: [
      'Height: Adjustable 100–130 cm',
      'Power: 120W',
      'Speeds: 3',
      'Blade diameter: 45 cm',
    ],
    images: [standFan, tent1],
  },
  {
    id: 'r8',
    name: 'Air Conditioner Unit (1.5 HP)',
    category: 'Air Conditioners',
    price: 20000,
    priceUnit: 'per day',
    description:
      'Window or portable A/C unit for tented events. Keeps enclosed spaces at a comfortable temperature regardless of outdoor heat.',
    specs: [
      'Capacity: 1.5 HP',
      'Coverage: Up to 25 m²',
      'Power: 220V',
      'Installation included',
    ],
    images: [tent2, tent3],
  },
];

export const salesProducts = [
  {
    id: 's1',
    name: 'Plastic Chair (Single)',
    category: 'Chairs',
    price: 8500,
    priceUnit: 'each',
    description: 'Heavy-duty white plastic chair for sale. Suitable for home and office use.',
    specs: ['Colour: White', 'Material: Polypropylene', 'Max load: 120 kg'],
    images: [chair1, chair2],
    stock: 120,
  },
  {
    id: 's2',
    name: 'Banquet Chair (Single)',
    category: 'Chairs',
    price: 18000,
    priceUnit: 'each',
    description: 'Premium padded banquet chair with gold frame. Ideal for events and catering businesses.',
    specs: ['Frame: Gold', 'Cushion: White', 'Max load: 150 kg'],
    images: [chair3, chair4],
    stock: 60,
  },
  {
    id: 's3',
    name: 'Round Table (Single)',
    category: 'Tables',
    price: 22000,
    priceUnit: 'each',
    description: '5-foot round banquet table, foldable legs for easy storage. Perfect for event businesses.',
    specs: ['Diameter: 152 cm', 'Height: 76 cm', 'Foldable legs', 'Material: Steel + MDF top'],
    images: [chair5, event1],
    stock: 40,
  },
  {
    id: 's4',
    name: 'Rectangular Table (Single)',
    category: 'Tables',
    price: 18000,
    priceUnit: 'each',
    description: '6-foot rectangular folding table. Multipurpose for events, offices, and markets.',
    specs: ['Size: 183 × 76 cm', 'Height: 76 cm', 'Foldable legs', 'Material: Steel + MDF top'],
    images: [banquetTable1, event3],
    stock: 35,
  },
  {
    id: 's5',
    name: 'Standing Fan',
    category: 'Fans',
    price: 45000,
    priceUnit: 'each',
    description: 'Brand new industrial-grade standing fan. Energy-efficient with 3-speed motor.',
    specs: ['Height: Adjustable 100–130 cm', 'Power: 120W', 'Speeds: 3', 'Blade: 45 cm'],
    images: [tent1],
    stock: 15,
  },
];
