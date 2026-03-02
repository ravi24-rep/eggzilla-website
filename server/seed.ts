import db, { initDb } from './db.js';

// Initialize database tables first
initDb();

// All menu items from the original types.ts, now with public image paths
const MENU_ITEMS = [
    {
        id: 'm1',
        name: 'Keto Chicken & Veggies',
        description: 'High protein chicken breast paired with roasted cauliflower and pumpkin. Perfect for keto diets.',
        price: '₹60',
        category: 'Healthy Plates',
        image: '/menu/chicken-cauliflower-pumpkin.png',
        bestseller: 1
    },
    {
        id: 'm2',
        name: 'Chicken Egg Chapati Bowl',
        description: 'A complete meal featuring spiced chicken, hard-boiled egg, and soft chapatis.',
        price: '₹35',
        category: 'Combos',
        image: '/menu/chicken-egg-bowl-chapti.png',
        customizable: 1,
        options: 'Extra Egg,Extra Chapati'
    },
    {
        id: 'm3',
        name: 'Protein Chicken Salad',
        description: 'Fresh greens topped with juicy grilled chicken pieces and a light dressing.',
        price: '₹50',
        category: 'Salads',
        image: '/menu/chicken-salad.png'
    },
    {
        id: 'm4',
        name: '🍳🥗 Egg Sundal Bowl 🌿✨',
        description: 'Egg, Sundal, Veggies. Protein & Carb loaded with nutrition. Good for gut health.',
        price: '₹25',
        category: 'Healthy Plates',
        image: '/menu/egg-sundal-bowl.png',
        customizable: 1,
        options: 'Banana🍌,Tapioca🍠,Sweet Potato🍠',
        bestseller: 1
    },
    {
        id: 'm5',
        name: 'Garlic Chicken Pasta',
        description: 'Delicious pasta tossed in a rich garlic sauce with tender chicken chunks.',
        price: '₹80',
        category: 'Pasta',
        image: '/menu/garlic-chicken-pasta.png'
    },
    {
        id: 'm6',
        name: 'Lemon Chicken Egg Masala',
        description: 'Zesty lemon flavor infused in a spicy chicken and egg masala curry.',
        price: '₹110',
        category: 'Curries',
        image: '/menu/lemon-chicken-egg-masala.png',
        customizable: 1,
        options: 'Spicy,Mild'
    },
    {
        id: 'm7',
        name: 'Masala Chicken Egg Thokku',
        description: 'Traditional style thick gravy with chicken and egg, bursting with regional flavors.',
        price: '₹110',
        category: 'Curries',
        image: '/menu/masala-chicken-egg-thokku.png',
        bestseller: 1
    },
    {
        id: 'm8',
        name: 'Tomato Chicken',
        description: 'Tangy and savory tomato-based chicken dish, cooked to perfection.',
        price: '₹70',
        category: 'Curries',
        image: '/menu/tomato-chicken.png'
    },
    {
        id: 'm9',
        name: 'Beetroot Masala Chicken',
        description: 'A vibrant and healthy masala chicken cooked with fresh beetroot.',
        price: '₹80',
        category: 'Curries',
        image: '/menu/beetroot-masala-chicken.png'
    },
    {
        id: 'm10',
        name: 'Boiled Egg with Groundnuts',
        description: 'Simple, protein-packed boiled eggs served with roasted groundnuts.',
        price: '₹30',
        category: 'Healthy Plates',
        image: '/menu/boiled-egg-groundnuts.png'
    },
    {
        id: 'm11',
        name: 'Boiled Egg & Horse Gram',
        description: 'Nutritious boiled eggs paired with healthy horse gram for a complete diet.',
        price: '₹100',
        category: 'Healthy Plates',
        image: '/menu/boiled-egg-horse-gram.png'
    },
    {
        id: 'm12',
        name: 'Carrot Rice & Pumpkin Chicken',
        description: 'Flavorful carrot rice served alongside tender chicken and roasted pumpkin.',
        price: '₹120',
        category: 'Combos',
        image: '/menu/carrot-rice-chicken-with-pumpkin.png'
    },
    {
        id: 'm13',
        name: 'Cauliflower Chicken',
        description: 'Delicious chicken bits stir-fried with fresh, crunchy cauliflower.',
        price: '₹90',
        category: 'Healthy Plates',
        image: '/menu/cauliflower-chicken.png'
    },
    {
        id: 'm14',
        name: 'Chicken Salad with Sweet Potato',
        description: 'Fresh chicken salad accompanied by energy-boosting sweet potato.',
        price: '₹90',
        category: 'Salads',
        image: '/menu/chicken-salad-sweetpotato.png'
    },
    {
        id: 'm15',
        name: 'Egg & Chicken Salad',
        description: 'A doubled-up protein salad featuring both boiled eggs and grilled chicken.',
        price: '₹70',
        category: 'Salads',
        image: '/menu/egg-chicken-salad.png',
        bestseller: 1
    },
    {
        id: 'm16',
        name: 'Egg Salad & Sweet Potato',
        description: 'Light egg salad paired perfectly with sweet potato segments.',
        price: '₹50',
        category: 'Salads',
        image: '/menu/egg-salad-sweetpotato.png'
    },
    {
        id: 'm17',
        name: 'Horsegram, Beetroot & Chicken',
        description: 'The ultimate health bowl: horsegram, shredded beetroot, and tender chicken.',
        price: '₹100',
        category: 'Healthy Plates',
        image: '/menu/horsegram-chicken-beetroot-salad.png'
    },
    {
        id: 'm18',
        name: 'Masala Chicken Pasta Salad',
        description: 'An Indian twist on pasta salad with spicy masala chicken.',
        price: '₹110',
        category: 'Pasta',
        image: '/menu/masala-chicken-salad-pasta.jpg'
    },
    {
        id: 'm19',
        name: 'Masala Chicken & Sweet Potato',
        description: 'Spicy masala chicken balanced with the mild sweetness of roasted sweet potato.',
        price: '₹130',
        category: 'Combos',
        image: '/menu/masala-chicken-sweetpotato.png'
    },
    {
        id: 'm20',
        name: 'Chicken Pasta Salad',
        description: 'Cold and refreshing pasta salad tossed with seasoned chicken.',
        price: '₹120',
        category: 'Salads',
        image: '/menu/salad-chicken-pasta.png'
    },
    {
        id: 'm21',
        name: 'Pepper Chicken & Sundal Rice',
        description: 'Spicy black pepper chicken served over a bed of nutritious sundal rice.',
        price: '₹120',
        category: 'Combos',
        image: '/menu/sundal-rice-pepper-chicken.png',
        bestseller: 1
    },
    {
        id: 'm22',
        name: 'Chicken Sundal Salad',
        description: 'A light, high-protein mix of chicken and sundal, seasoned to perfection.',
        price: '₹110',
        category: 'Salads',
        image: '/menu/sundal-salad-chicken.png'
    }
];

// Seed the database
const insertStmt = db.prepare(`
  INSERT OR REPLACE INTO menu_items (id, name, description, price, category, image, customizable, options, bestseller, available)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
`);

const seedTransaction = db.transaction(() => {
    for (const item of MENU_ITEMS) {
        insertStmt.run(
            item.id,
            item.name,
            item.description,
            item.price,
            item.category,
            item.image,
            item.customizable || 0,
            item.options || null,
            item.bestseller || 0
        );
    }
});

seedTransaction();

console.log(`✅ Successfully seeded ${MENU_ITEMS.length} menu items into the database!`);
process.exit(0);
