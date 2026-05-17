//Canopies
import tent1 from '../Images/Tents/Tent1.jpeg';
import tent2 from '../Images/Tents/Tent2.jpeg';

//chairs
import chair1 from '../Images/ChairTableSets/ChairTable1.jpeg';
import chair2 from '../Images/ChairTableSets/ChairTable2.jpeg';




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
    stock: 10,
  },
];
