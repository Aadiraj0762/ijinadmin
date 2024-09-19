export const _homePlans = [
  {
    license: 'Normal Processing (Two-Three months)',
    commons: ['Submission: Free', 'Evaluation: Free'],
    options: [
      'Index and Abstract (INR): Rs. 4000.00 per year (Max. 150 articles)',
      'Calculation of IJIN Factor: Rs. 3000.00',
      'Old issue Abstracts Service (INR): Rs. 3000.00 per year (Max. 150 articles)',
    ],
    price: 'Cost (INR): Rs. 4000.00 + Rs. 3000.00 + Rs. 3000.00'
  },
  {
    license: 'Normal Processing (Two-Three months)',
    commons: ['Submission: Free', 'Evaluation: Free'],
    options: [
      'Index and Abstract (USD): $100.00 per year (Max. 150 articles)',
      'Calculation of SIA Factor: $120.00',
      'Old issue Abstracts Service (USD): $100.00 per year (Max. 150 articles)',
    ],
    price: 'Cost (USD): $100.00 + $120.00 + $100.00'
  },
  {
    license: 'Fast-Track / Priority: 15-20 Days',
    commons: ['Submission: Free', 'Evaluation: Free'],
    options: [
      'Index and Abstract (INR): Rs. 7000.00 per year (Max. 150 articles)',
      'Calculation of SIA Factor: Rs. 4000.00',
      'Old issue Abstracts Service (INR): Rs. 4000.00 per year (Max. 150 articles)',
    ],
    price: 'Cost (INR): Rs. 7000.00 + Rs. 4000.00 + Rs. 4000.00'
  },
  {
    license: 'Fast-Track / Priority: 15-20 Days',
    commons: ['Submission: Free', 'Evaluation: Free'],
    options: [
      'Index and Abstract (USD): $150.00 per year (Max. 150 articles)',
      'Calculation of SIA Factor: $200.00',
      'Old issue Abstracts Service (USD): $150.00 per year (Max. 150 articles)',
    ],
    price: 'Cost (USD): $150.00 + $200.00 + $150.00'
  }
];

export const _pricingPlans = [
  
    {
      subscription: 'Normal Processing (INR)',
      price: 10000,
      caption: '2-3 months',
      lists: [
        { text: 'Submission', isAvailable: true, cost: 'Free' },
        { text: 'Evaluation', isAvailable: true, cost: 'Free' },
        { text: 'Index and Abstract', isAvailable: true, cost: 'Rs. 4000.00 per year for all issues (Max. 150 articles)' },
        { text: 'Calculation of SIA Factor', isAvailable: true, cost: 'Rs. 3000.00' },
        { text: 'Old issue Abstracts Service', isAvailable: true, cost: 'Rs. 3000.00 per year for all issues (Max. 150 articles per year)' },
      ],
      labelAction: 'choose plan',
    },
    {
      subscription: 'Normal Processing (USD)',
      price: 320,
      caption: '2-3 months',
      lists: [
        { text: 'Submission', isAvailable: true, cost: 'Free' },
        { text: 'Evaluation', isAvailable: true, cost: 'Free' },
        { text: 'Index and Abstract', isAvailable: true, cost: '$100.00 per year (Max. 150 articles)' },
        { text: 'Calculation of SIA Factor', isAvailable: true, cost: '$120.00' },
        { text: 'Old issue Abstracts Service', isAvailable: true, cost: '$100.00 per year (Max. 150 articles per year)' },
      ],
      labelAction: 'choose plan',
    },
    {
      subscription: 'Fast-Track / Priority (INR)',
      price: 15000,
      caption: '15-20 days',
      lists: [
        { text: 'Submission', isAvailable: true, cost: 'Free' },
        { text: 'Evaluation', isAvailable: true, cost: 'Free' },
        { text: 'Index and Abstract', isAvailable: true, cost: 'Rs. 7000.00 per year (Max. 150 articles)' },
        { text: 'Calculation of SIA Factor', isAvailable: true, cost: 'Rs. 4000.00' },
        { text: 'Old issue Abstracts Service', isAvailable: true, cost: 'Rs. 4000.00 per year (Max. 150 articles per year)' },
      ],
      labelAction: 'choose plan',
    },
    {
      subscription: 'Fast-Track / Priority (USD)',
      price: 500,
      caption: '15-20 days',
      lists: [
        { text: 'Submission', isAvailable: true, cost: 'Free' },
        { text: 'Evaluation', isAvailable: true, cost: 'Free' },
        { text: 'Index and Abstract', isAvailable: true, cost: '$150.00 per year (Max. 150 articles)' },
        { text: 'Calculation of SIA Factor', isAvailable: true, cost: '$200.00' },
        { text: 'Old issue Abstracts Service', isAvailable: true, cost: '$150.00 per year (Max. 150 articles)' },
      ],
      labelAction: 'choose plan',
    }
  ]

