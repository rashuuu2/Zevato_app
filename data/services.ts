import { ServiceDetail } from '@/types/service';

export const services: ServiceDetail[] = [
  {
    id: 'ac-jet-service',
    categoryId: 'ac',
    title: 'AC Power Jet Service',
    subtitle: 'Deep foam cleaning of indoor & outdoor unit coils with pressure washer',
    image: 'ac-service',
    rating: 4.85,
    reviewCount: 2340,
    options: [
      {
        id: 'opt-ac-1',
        title: 'Foam & Power Jet Service (1 Unit)',
        description: 'Complete deep cleaning using specialized jet pump and foam solution',
        price: 599,
        originalPrice: 899,
        durationMinutes: 45,
        rating: 4.9,
        reviewCount: 1420,
        features: [
          'High pressure jet pump wash',
          'Anti-bacterial foam cleaning',
          'Drain pipe clearing',
          'Gas pressure inspection check',
        ],
      },
      {
        id: 'opt-ac-2',
        title: 'AC Gas Refill & Service Package',
        description: 'Full gas leak repair, pressure testing & R32/R410 gas charging',
        price: 2499,
        originalPrice: 2999,
        durationMinutes: 90,
        rating: 4.8,
        reviewCount: 920,
        features: [
          'Complete refrigerant gas charging',
          'Nitrogen leak detection test',
          'Complimentary jet wash service',
          '30-day post service warranty',
        ],
      },
    ],
    features: [
      { id: 'f1', title: 'Certified Engineers', description: 'Experienced technicians with 500+ jobs completed', icon: 'shield-checkmark-outline' },
      { id: 'f2', title: '30-Day Guarantee', description: 'Free re-service if issue recurs within 30 days', icon: 'ribbon-outline' },
      { id: 'f3', title: 'Transparent Pricing', description: 'Fixed rate cards without hidden charges', icon: 'pricetag-outline' },
    ],
    faq: [
      { question: 'How long does an AC Jet Service take?', answer: 'An AC Jet service takes approximately 45 to 60 minutes per unit.' },
      { question: 'What is included in foam cleaning?', answer: 'Foam cleaning dissolves stubborn dirt, mold, and grease inside the cooling coils to restore maximum cooling airflow.' },
    ],
  },
  {
    id: 'wm-deep-clean',
    categoryId: 'washing-machine',
    title: 'Washing Machine Scaling & Cleaning',
    subtitle: 'Internal drum descaling, filter flushing, and motor spin test',
    image: 'wm-service',
    rating: 4.78,
    reviewCount: 1150,
    options: [
      {
        id: 'opt-wm-1',
        title: 'Drum Descaling & Deep Service',
        description: 'Chemical tub wash and lint filter sanitation',
        price: 499,
        originalPrice: 699,
        durationMinutes: 40,
        rating: 4.8,
        reviewCount: 890,
        features: [
          'Organic descaling treatment',
          'Vibration & noise inspection',
          'Water inlet valve cleaning',
        ],
      },
    ],
    features: [
      { id: 'f4', title: 'Spare Parts Protection', description: '100% genuine OEM parts used for replacements', icon: 'checkmark-circle-outline' },
    ],
  },
];

export default services;
