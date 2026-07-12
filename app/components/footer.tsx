import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 mt-8 md:mt-0">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-8 pb-24 md:pb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Mahan Ghafarian ·{" "}
          <a href="https://mahanghafarian.com" className="hover:text-amber-400 transition-colors duration-300">
            engineering portfolio →
          </a>
        </p>
        <div className="flex items-center gap-5 text-gray-500">
          <a href="https://www.instagram.com/qwzynx/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-white transition-colors duration-300">
            <FaInstagram size={18} />
          </a>
          <a href="https://www.linkedin.com/in/mahan-ghafarian-b02ba0298/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-white transition-colors duration-300">
            <FaLinkedin size={18} />
          </a>
          <a href="https://github.com/qwzynx" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-white transition-colors duration-300">
            <FaGithub size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
