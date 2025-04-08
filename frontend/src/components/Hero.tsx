const Hero = () => {
  return (
    <div className="w-full bg-gradient-to-br from-green-100 via-white to-[#f5f5dc] py-24 px-6 md:px-32 rounded-b-3xl shadow-lg">
      <div className="max-w-5xl mx-auto text-center flex flex-col items-center gap-6">
        <h1 className="text-5xl md:text-6xl font-extrabold text-green-800 tracking-tight leading-tight">
          Craving Something Delicious? 🍛
        </h1>
        <p className="text-lg md:text-xl text-[#5D4037] max-w-2xl">
          Explore your city's best meals from top-rated restaurants. Quick, tasty, and delivered with love ❤️
        </p>
        <button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-3 rounded-full font-semibold shadow-md transition-transform hover:scale-105">
          Find Your Feast
        </button>
      </div>
    </div>
  );
};

export default Hero;
