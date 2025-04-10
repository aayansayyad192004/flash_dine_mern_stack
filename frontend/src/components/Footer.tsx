const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#1B5E20] to-[#33691E] py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-6 gap-6">
        <span className="text-2xl font-bold tracking-wide text-white drop-shadow-md">
          Flash<span className="text-lime-300">Dine</span>
          <span className="text-white">.com</span>
        </span>
        <div className="flex gap-6 text-white text-sm font-medium">
        <p>&copy; 2024 PrepAhead. All rights reserved.</p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
