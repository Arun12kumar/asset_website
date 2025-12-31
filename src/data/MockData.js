

export const locations = [
  'Mumbai, Maharashtra',
  'Delhi, NCR',
  'Bangalore, Karnataka',
  'Pune, Maharashtra',
  'Hyderabad, Telangana',
  'Chennai, Tamil Nadu',
  'Kolkata, West Bengal',
  'Ahmedabad, Gujarat',
  'Jaipur, Rajasthan',
  'Gurgaon, Haryana',
  'Noida, Uttar Pradesh',
  'Kochi, Kerala',
  'Indore, Madhya Pradesh',
  'Chandigarh, Punjab',
  'Lucknow, Uttar Pradesh'
];

export const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: 'Smartphone',
    subcategories: ['Mobile Phones', 'Laptops', 'Tablets', 'Cameras', 'TVs', 'Audio']
  },
  {
    id: 'vehicles',
    name: 'Vehicles',
    icon: 'Car',
    subcategories: ['Cars', 'Motorcycles', 'Scooters', 'Bicycles', 'Commercial Vehicles']
  },
  {
    id: 'properties',
    name: 'Properties',
    icon: 'Home',
    subcategories: ['Apartments', 'Houses', 'Shops', 'Offices', 'Land']
  },
  {
    id: 'furniture',
    name: 'Furniture',
    icon: 'Sofa',
    subcategories: ['Sofas', 'Beds', 'Tables', 'Chairs', 'Wardrobes', 'Kitchen']
  },
  {
    id: 'appliances',
    name: 'Appliances',
    icon: 'Microwave',
    subcategories: ['Refrigerators', 'Washing Machines', 'Air Conditioners', 'Microwaves']
  },
  {
    id: 'fashion',
    name: 'Fashion',
    icon: 'Shirt',
    subcategories: ['Mens Clothing', 'Womens Clothing', 'Shoes', 'Accessories']
  },
  {
    id: 'sports',
    name: 'Sports',
    icon: 'Dumbbell',
    subcategories: ['Gym Equipment', 'Sports Gear', 'Outdoor', 'Fitness']
  },
  {
    id: 'books',
    name: 'Books',
    icon: 'Book',
    subcategories: ['Textbooks', 'Fiction', 'Non-Fiction', 'Comics']
  }
];

export const mockAssets = [
  {
    id: '1',
    title: 'iPhone 14 Pro Max - 256GB',
    price: 45000,
    description: 'Brand new iPhone 14 Pro Max in Deep Purple. Still under warranty. All accessories included with original box.',
    category: 'electronics',
    subcategory: 'Mobile Phones',
    location: 'Mumbai, Maharashtra',
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1761907174062-c8baf8b7edb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzbWFydHBob25lfGVufDF8fHx8MTc2MjY4MDY3Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjI2ODY3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1630283017802-785b7aff9aac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzYyNzI1NzY3fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    postedDate: '2025-11-08',
    seller: {
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh.k@email.com',
      memberSince: '2023-05-15'
    },
    featured: true
  },
  {
    id: '2',
    title: 'BMW 3 Series 320d',
    price: 1850000,
    description: 'Well maintained BMW 3 Series 2019 model. Single owner, full service history. Driven 35,000 km. All features working perfectly.',
    category: 'vehicles',
    subcategory: 'Cars',
    location: 'Delhi, NCR',
    condition: 'like-new',
    images: [
      'https://images.unsplash.com/photo-1614200179396-2bdb77ebf81b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXJ8ZW58MXx8fHwxNzYyNzE5MzY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1597588561267-7a9507649ab9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNlZGFuJTIwY2FyfGVufDF8fHx8MTc2MjY2ODUyMXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1671834214096-6aa88bd6470d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwYmlrZXxlbnwxfHx8fDE3NjI3NTk4ODV8MA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    postedDate: '2025-11-07',
    seller: {
      name: 'Amit Sharma',
      phone: '+91 98765 43211',
      email: 'amit.s@email.com',
      memberSince: '2022-08-20'
    },
    featured: true
  },
  {
    id: '3',
    title: '3BHK Apartment for Sale',
    price: 8500000,
    description: 'Spacious 3BHK apartment in prime location. 1850 sq.ft with modern amenities, gym, pool, security. Ready to move.',
    category: 'properties',
    subcategory: 'Apartments',
    location: 'Bangalore, Karnataka',
    condition: 'like-new',
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnR8ZW58MXx8fHwxNzYyNjc3OTY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1675279200694-8529c73b1fd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjI3MTEzMjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwaG91c2V8ZW58MXx8fHwxNzYyNzU0NDM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmdXJuaXR1cmV8ZW58MXx8fHwxNzYyNzMzNDkzfDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    postedDate: '2025-11-06',
    seller: {
      name: 'Priya Reddy',
      phone: '+91 98765 43212',
      email: 'priya.r@email.com',
      memberSince: '2024-01-10'
    },
    featured: true
  },
  {
    id: '4',
    title: 'MacBook Pro 16" M2 Max',
    price: 165000,
    description: 'Latest MacBook Pro 16 inch with M2 Max chip. 32GB RAM, 1TB SSD. Perfect for professionals. Like new condition with warranty.',
    category: 'electronics',
    subcategory: 'Laptops',
    location: 'Pune, Maharashtra',
    condition: 'like-new',
    images: [
      'https://images.unsplash.com/photo-1511385348-a52b4a160dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NjI2ODY3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1532198528077-0d9e4ca9bb40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNib29rJTIwd29ya3NwYWNlfGVufDF8fHx8MTc2Mjc2MDY3OXww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1630283017802-785b7aff9aac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzYyNzI1NzY3fDA&ixlib=rb-4.1.0&q=80&w=1080'
    ],
    postedDate: '2025-11-09',
    seller: {
      name: 'Vikram Singh',
      phone: '+91 98765 43213',
      email: 'vikram.s@email.com',
      memberSince: '2023-03-22'
    },
    featured: false
  },
  {
    id: '5',
    title: 'Royal Enfield Classic 350',
    price: 125000,
    description: 'Royal Enfield Classic 350 in excellent condition. Well maintained, single owner. Driven 18,000 km. All papers clear.',
    category: 'vehicles',
    subcategory: 'Motorcycles',
    location: 'Jaipur, Rajasthan',
    condition: 'good',
    images: ['https://images.unsplash.com/photo-1671834214096-6aa88bd6470d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3RvcmN5Y2xlJTIwYmlrZXxlbnwxfHx8fDE3NjI3NTk4ODV8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    postedDate: '2025-11-05',
    seller: {
      name: 'Arjun Mehra',
      phone: '+91 98765 43214',
      email: 'arjun.m@email.com',
      memberSince: '2022-11-30'
    },
    featured: false
  },
  {
    id: '6',
    title: 'L-Shaped Sofa Set',
    price: 35000,
    description: 'Premium quality L-shaped sofa in grey fabric. Almost new, used for only 6 months. Very comfortable and stylish.',
    category: 'furniture',
    subcategory: 'Sofas',
    location: 'Chennai, Tamil Nadu',
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmdXJuaXR1cmV8ZW58MXx8fHwxNzYyNzMzNDkzfDA&ixlib=rb-4.1.0&q=80&w=1080'],
    postedDate: '2025-11-04',
    seller: {
      name: 'Lakshmi Iyer',
      phone: '+91 98765 43215',
      email: 'lakshmi.i@email.com',
      memberSince: '2024-06-18'
    },
    featured: false
  },
  {
    id: '7',
    title: 'Samsung Double Door Refrigerator',
    price: 28000,
    description: 'Samsung 253L double door refrigerator. Excellent cooling, energy efficient. 3 years old but works like new.',
    category: 'appliances',
    subcategory: 'Refrigerators',
    location: 'Hyderabad, Telangana',
    condition: 'good',
    images: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwYXBwbGlhbmNlc3xlbnwxfHx8fDE3NjI2NDk2OTR8MA&ixlib=rb-4.1.0&q=80&w=1080'],
    postedDate: '2025-11-03',
    seller: {
      name: 'Srinivas Rao',
      phone: '+91 98765 43216',
      email: 'sri.rao@email.com',
      memberSince: '2023-09-12'
    },
    featured: false
  },
  {
    id: '8',
    title: 'Designer Mens Jacket Collection',
    price: 4500,
    description: 'Brand new designer jacket, high quality material. Never worn, with tags. Perfect for winter season.',
    category: 'fashion',
    subcategory: 'Mens Clothing',
    location: 'Kolkata, West Bengal',
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmd8ZW58MXx8fHwxNzYyNzU5MDAwfDA&ixlib=rb-4.1.0&q=80&w=1080'],
    postedDate: '2025-11-02',
    seller: {
      name: 'Rahul Banerjee',
      phone: '+91 98765 43217',
      email: 'rahul.b@email.com',
      memberSince: '2024-02-28'
    },
    featured: false
  },
  {
    id: '9',
    title: 'Villa for Sale - 4BHK',
    price: 15000000,
    description: 'Luxury 4BHK independent villa with garden, parking for 3 cars. Premium location with all modern amenities. 2800 sq.ft built-up area.',
    category: 'properties',
    subcategory: 'Houses',
    location: 'Gurgaon, Haryana',
    condition: 'new',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwaG91c2V8ZW58MXx8fHwxNzYyNzU0NDM4fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    postedDate: '2025-11-01',
    seller: {
      name: 'Anjali Kapoor',
      phone: '+91 98765 43218',
      email: 'anjali.k@email.com',
      memberSince: '2023-07-05'
    },
    featured: true
  },
  {
    id: '10',
    title: 'Home Gym Equipment Set',
    price: 25000,
    description: 'Complete home gym setup including dumbbells, bench, weights, and exercise mat. Excellent condition, barely used.',
    category: 'sports',
    subcategory: 'Gym Equipment',
    location: 'Ahmedabad, Gujarat',
    condition: 'like-new',
    images: ['https://images.unsplash.com/photo-1602211844066-d3bb556e983b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzYyNjk3NDI4fDA&ixlib=rb-4.1.0&q=80&w=1080'],
    postedDate: '2025-10-31',
    seller: {
      name: 'Karan Patel',
      phone: '+91 98765 43219',
      email: 'karan.p@email.com',
      memberSince: '2024-04-12'
    },
    featured: false
  }
];
