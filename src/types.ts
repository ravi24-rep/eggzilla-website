import imgCauliflowerPumpkin from '../src/assets/menu/chicken-cauliflower-pumpkin.png';
import imgBowlChapti from '../src/assets/menu/chicken-egg-bowl-chapti.png';
import imgChickenSalad from '../src/assets/menu/chicken-salad.png';
import imgEggSundal from '../src/assets/menu/egg-sundal-bowl.png';
import imgGarlicPasta from '../src/assets/menu/garlic-chicken-pasta.png';
import imgLemonChicken from '../src/assets/menu/lemon-chicken-egg-masala.png';
import imgMasalaThokku from '../src/assets/menu/masala-chicken-egg-thokku.png';
import imgTomatoChicken from '../src/assets/menu/tomato-chicken.png';
import imgBeetrootMasala from '../src/assets/menu/beetroot-masala-chicken.png';
import imgBoiledEggGroundnuts from '../src/assets/menu/boiled-egg-groundnuts.png';
import imgBoiledEggHorsegram from '../src/assets/menu/boiled-egg-horse-gram.png';
import imgCarrotRicePumpkin from '../src/assets/menu/carrot-rice-chicken-with-pumpkin.png';
import imgCauliflowerChicken from '../src/assets/menu/cauliflower-chicken.png';
import imgChickenSaladSweetpotato from '../src/assets/menu/chicken-salad-sweetpotato.png';
import imgEggChickenSalad from '../src/assets/menu/egg-chicken-salad.png';
import imgEggSaladSweetpotato from '../src/assets/menu/egg-salad-sweetpotato.png';
import imgHorsegramBeetroot from '../src/assets/menu/horsegram-chicken-beetroot-salad.png';
import imgMasalaSaladPasta from '../src/assets/menu/masala-chicken-salad-pasta.jpg';
import imgMasalaSweetpotato from '../src/assets/menu/masala-chicken-sweetpotato.png';
import imgSaladPasta from '../src/assets/menu/salad-chicken-pasta.png';
import imgSundalPepperRice from '../src/assets/menu/sundal-rice-pepper-chicken.png';
import imgSundalSalad from '../src/assets/menu/sundal-salad-chicken.png';


export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  image: string;
  customizable?: boolean;
  options?: string[];
  bestseller?: boolean;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Keto Chicken & Veggies',
    description: 'High protein chicken breast paired with roasted cauliflower and pumpkin. Perfect for keto diets.',
    price: '₹60',
    category: 'Healthy Plates',
    image: imgCauliflowerPumpkin,
    bestseller: true
  },
  {
    id: 'm2',
    name: 'Chicken Egg Chapati Bowl',
    description: 'A complete meal featuring spiced chicken, hard-boiled egg, and soft chapatis.',
    price: '₹35',
    category: 'Combos',
    image: imgBowlChapti,
    customizable: true,
    options: ['Extra Egg', 'Extra Chapati']
  },
  {
    id: 'm3',
    name: 'Protein Chicken Salad',
    description: 'Fresh greens topped with juicy grilled chicken pieces and a light dressing.',
    price: '₹50',
    category: 'Salads',
    image: imgChickenSalad
  },
  {
    id: 'm4',
    name: '🍳🥗 Egg Sundal Bowl 🌿✨',
    description: 'Egg, Sundal, Veggies. Protein & Carb loaded with nutrition. Good for gut health.',
    price: '₹25',
    category: 'Healthy Plates',
    image: imgEggSundal,
    customizable: true,
    options: ['Banana🍌', 'Tapioca🍠', 'Sweet Potato🍠'],
    bestseller: true
  },
  {
    id: 'm5',
    name: 'Garlic Chicken Pasta',
    description: 'Delicious pasta tossed in a rich garlic sauce with tender chicken chunks.',
    price: '₹80',
    category: 'Pasta',
    image: imgGarlicPasta
  },
  {
    id: 'm6',
    name: 'Lemon Chicken Egg Masala',
    description: 'Zesty lemon flavor infused in a spicy chicken and egg masala curry.',
    price: '₹110',
    category: 'Curries',
    image: imgLemonChicken,
    customizable: true,
    options: ['Spicy', 'Mild']
  },
  {
    id: 'm7',
    name: 'Masala Chicken Egg Thokku',
    description: 'Traditional style thick gravy with chicken and egg, bursting with regional flavors.',
    price: '₹110',
    category: 'Curries',
    image: imgMasalaThokku,
    bestseller: true
  },
  {
    id: 'm8',
    name: 'Tomato Chicken',
    description: 'Tangy and savory tomato-based chicken dish, cooked to perfection.',
    price: '₹70',
    category: 'Curries',
    image: imgTomatoChicken
  },
  {
    id: 'm9',
    name: 'Beetroot Masala Chicken',
    description: 'A vibrant and healthy masala chicken cooked with fresh beetroot.',
    price: '₹80',
    category: 'Curries',
    image: imgBeetrootMasala
  },
  {
    id: 'm10',
    name: 'Boiled Egg with Groundnuts',
    description: 'Simple, protein-packed boiled eggs served with roasted groundnuts.',
    price: '₹30',
    category: 'Healthy Plates',
    image: imgBoiledEggGroundnuts
  },
  {
    id: 'm11',
    name: 'Boiled Egg & Horse Gram',
    description: 'Nutritious boiled eggs paired with healthy horse gram for a complete diet.',
    price: '₹100',
    category: 'Healthy Plates',
    image: imgBoiledEggHorsegram
  },
  {
    id: 'm12',
    name: 'Carrot Rice & Pumpkin Chicken',
    description: 'Flavorful carrot rice served alongside tender chicken and roasted pumpkin.',
    price: '₹120',
    category: 'Combos',
    image: imgCarrotRicePumpkin
  },
  {
    id: 'm13',
    name: 'Cauliflower Chicken',
    description: 'Delicious chicken bits stir-fried with fresh, crunchy cauliflower.',
    price: '₹90',
    category: 'Healthy Plates',
    image: imgCauliflowerChicken
  },
  {
    id: 'm14',
    name: 'Chicken Salad with Sweet Potato',
    description: 'Fresh chicken salad accompanied by energy-boosting sweet potato.',
    price: '₹90',
    category: 'Salads',
    image: imgChickenSaladSweetpotato
  },
  {
    id: 'm15',
    name: 'Egg & Chicken Salad',
    description: 'A doubled-up protein salad featuring both boiled eggs and grilled chicken.',
    price: '₹70',
    category: 'Salads',
    image: imgEggChickenSalad,
    bestseller: true
  },
  {
    id: 'm16',
    name: 'Egg Salad & Sweet Potato',
    description: 'Light egg salad paired perfectly with sweet potato segments.',
    price: '₹50',
    category: 'Salads',
    image: imgEggSaladSweetpotato
  },
  {
    id: 'm17',
    name: 'Horsegram, Beetroot & Chicken',
    description: 'The ultimate health bowl: horsegram, shredded beetroot, and tender chicken.',
    price: '₹100',
    category: 'Healthy Plates',
    image: imgHorsegramBeetroot
  },
  {
    id: 'm18',
    name: 'Masala Chicken Pasta Salad',
    description: 'An Indian twist on pasta salad with spicy masala chicken.',
    price: '₹110',
    category: 'Pasta',
    image: imgMasalaSaladPasta
  },
  {
    id: 'm19',
    name: 'Masala Chicken & Sweet Potato',
    description: 'Spicy masala chicken balanced with the mild sweetness of roasted sweet potato.',
    price: '₹130',
    category: 'Combos',
    image: imgMasalaSweetpotato
  },
  {
    id: 'm20',
    name: 'Chicken Pasta Salad',
    description: 'Cold and refreshing pasta salad tossed with seasoned chicken.',
    price: '₹120',
    category: 'Salads',
    image: imgSaladPasta
  },
  {
    id: 'm21',
    name: 'Pepper Chicken & Sundal Rice',
    description: 'Spicy black pepper chicken served over a bed of nutritious sundal rice.',
    price: '₹120',
    category: 'Combos',
    image: imgSundalPepperRice,
    bestseller: true
  },
  {
    id: 'm22',
    name: 'Chicken Sundal Salad',
    description: 'A light, high-protein mix of chicken and sundal, seasoned to perfection.',
    price: '₹110',
    category: 'Salads',
    image: imgSundalSalad
  }
];

export interface CartItem extends MenuItem {
  quantity: number;
  selectedOptions?: string[];
}

export const CATEGORIES = [
  'All',
  'Healthy Plates',
  'Combos',
  'Salads',
  'Pasta',
  'Curries'
];
