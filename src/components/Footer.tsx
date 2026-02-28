import { Instagram, Facebook, Twitter } from 'lucide-react';
import eggzillaLogo from '../assets/eggzilla-logo.png';

export default function Footer() {
  return (
    <footer className="bg-egg-black text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16 text-center md:text-left">
          <div className="col-span-2 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-2 mb-6">
              <img src={eggzillaLogo} alt="Eggzilla Logo" className="w-10 h-10 object-contain" />
              <span className="text-2xl font-display font-extrabold tracking-tighter">
                EGG<span className="text-egg-orange">ZILLA</span>
              </span>
            </div>
            <p className="text-white/50 max-w-sm mb-8">
              Dharmapuri's favorite spot for healthy, protein-rich egg varieties. We serve students, gym-goers, and families with love and fresh ingredients.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/eggzilla_food_company" target="_blank" rel="noopener noreferrer" className="bg-white/5 p-3 rounded-xl hover:bg-egg-orange transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-white/5 p-3 rounded-xl hover:bg-egg-orange transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-white/5 p-3 rounded-xl hover:bg-egg-orange transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-white/50">
              <li><a href="#home" className="hover:text-egg-yellow transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-egg-yellow transition-colors">About Us</a></li>
              <li><a href="#menu" className="hover:text-egg-yellow transition-colors">Our Menu</a></li>
              <li><a href="#location" className="hover:text-egg-yellow transition-colors">Location</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-white/50">
              <li>Located near District Stadium, Dharmapuri</li>
              <li>9486318604 | 9659750099</li>
              <li>@eggzilla_food_company</li>
              <li className="text-egg-yellow font-bold">Orders Open Now</li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/30">
          <p>© {new Date().getFullYear()} Eggzilla Food Stall. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
