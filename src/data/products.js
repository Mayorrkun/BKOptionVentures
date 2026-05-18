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

//chairs
import chair1 from '../Images/ChairTableSets/ChairTable1.jpeg';
import chair2 from '../Images/ChairTableSets/ChairTable2.jpeg';

import LoungeChair1 from '../Images/ChairTableSets/ChairTable6.jpeg';
import LoungeChair2 from '../Images/ChairTableSets/ChairTable26.jpeg';


import cocktailChair1 from '../Images/ChairTableSets/ChairTable7.jpeg';
import cocktailChair2 from '../Images/ChairTableSets/ChairTable4.jpeg';
//tables
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


//fans
 import standingFan from '../Images/EventSets/EventSet8.jpeg';
//set
import cocktailSet1 from '../Images/ChairTableSets/ChairTable20.jpeg';
import cocktailSet2 from '../Images/ChairTableSets/ChairTable19.jpeg';



export const rentalProducts = [
  {
      //tents
    id: 'r1',
    name: 'Small Canopy (15×7 ft)',
    category: 'Canopies',
    price: 15000,
    priceUnit: 'per day',
    description:
      'Perfect for intimate outdoor events. white canopy provides shade and shelter for up to 10 guests. Easy setup and takedown included in the rental.',
    specs: [
      'Size: 15ft × 7ft',
      'Colour: White',
      'Capacity: Up to 10 guests',
      'Minimum rental: 1 day',
    ],
    images: [tent1, tent2],
  },{
        id: 'r2',
        name: 'Large Canopy (20 x 10 ft)',
        category: 'Canopies',
        price: 20000,
        priceUnit: 'per day',
        description:
            'Perfect for intimate outdoor events. white canopy provides shade and shelter for up to 20 guests. Easy setup and takedown included in the rental.',
        specs: [
            'Size: 20ft x 10 ft',
            'Colour: White',
            'Capacity: Up to 20 guests',
            'Minimum rental: 1 day',
        ],
        images: [tent5, tent4],
    },
    //chairs
    {
        id: 'r3',
        name: 'Lounge Chairs',
        category: 'Chairs',
        price: 5000,
        priceUnit: 'per day',
        description:
            'All white comfy lounge chairs perfect for lounges and events',
        specs: [
            "Color: White",
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
            'short cocktail chairs with golden back rests perfect for gathering and your events',
        specs: [
            "Colors: White, Black"
        ],
        images: [cocktailChair1,cocktailChair2,cocktailSet1,cocktailChair2],
    },
    // tables
    {
        id: 'r5',
        name: 'Round Table',
        category: 'Tables',
        price: 7000,
        priceUnit: 'per day',
        description:
            'Plain white round tables',
        specs: [
            "Color: White",
            "Size: 4ft radius"
        ],
        images: [roundTable1],
    },{
        id: 'r6',
        name: 'Round Banquet Table',
        category: 'Tables',
        price: 7500,
        priceUnit: 'per day',
        description:
            'Round banquet tables with beautiful table coverings',
        specs: [
            "Color: Your Choice",
            "Table cloth inclusive"
        ],
        images: [roundBanquetTable1, roundBanquetTable2],
    },{
        id: 'r7',
        name: 'Rectangular Table',
        category: 'Tables',
        price: 7000,
        priceUnit: 'per day',
        description:
            'plain white rectangular tables',
        specs: [
            "Color: White",
            "Size: 5ft x 3ft"
        ],
        images: [rectTable1],
    },{
        id: 'r8',
        name: 'Rectangular Banquet Table',
        category: 'Tables',
        price: 7500,
        priceUnit: 'per day',
        description:
            'Rectangular banquet tables with beautiful table coverings',
        specs: [
            "Color: Your Choice",
            "Table cloth inclusive"
        ],
        images: [rectBanquetTable1, rectBanquetTable2],
    },{
        id: 'r9',
        name: 'Cocktail table',
        category: 'Tables',
        price: 5000,
        priceUnit: 'per day',
        description:
            'Round cocktail tables with golden base',
        specs: [
            'Color: White, Black',
        ],
        images: [cocktailTable, cocktailTables, cocktailSet2, cocktailSet1],
    },{
        id: 'r10',
        name: 'Glowing Cocktail tables',
        category: 'Tables',
        price: 8000,
        priceUnit: 'per day',
        description:
            'Glowing cocktail table , perfect for parties',
        specs: [
            "Color: Green ,Red",
        ],
        images: [glowingCocktailTable1, glowingCocktailTable2],
    },
    //
    {
        id: 'r11',
        name: 'Standing Fan',
        category: 'Fans',
        price: 5000,
        priceUnit: 'per day',
        description:
            'Rotating Standing Fan',
        specs: [

        ],
        images: [standingFan],
    }

];

export const salesProducts = [
  //tables
    {
    id: 's1',
    name: 'Round Table',
    category: 'Tables',
    price: 0,
    priceUnit: 'each',
    description: 'Plain white round tables',
    specs: [
        "Color: White",
        "Size: 4ft radius"
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
        description: 'Plain white rectangular tables',
        specs: [
            "Color: White",
            "Size: 5ft x 3ft"
        ],
        images: [rectTable1],
        stock: 10,
    },
    {
        id: 's3',
        name: 'Cocktail table',
        category: 'Tables',
        price: 0,
        priceUnit: 'each',
        description: 'Round cocktail tables with golden base',
        specs: [
            "Color: White,Black",
        ],
        images: [cocktailTable,cocktailTables],
        stock: 10,
    },
    //fans
    {
        id: 's4',
        name: 'Standing Fans',
        category: 'Fans',
        price: 0,
        priceUnit: 'each',
        description: 'Standing Fans',
        specs: [],
        images: [standingFan],
        stock: 10,
    },
    // {
    //     id: '',
    //     name: '',
    //     category: '',
    //     price: 0,
    //     priceUnit: 'each',
    //     description: '',
    //     specs: [],
    //     images: [],
    //     stock: 10,
    // },
    // {
    //     id: '',
    //     name: '',
    //     category: '',
    //     price: 0,
    //     priceUnit: 'each',
    //     description: '',
    //     specs: [],
    //     images: [],
    //     stock: 10,
    // },
];
