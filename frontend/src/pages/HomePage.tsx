import { useNavigate } from "react-router-dom";
import SearchBar, { SearchForm } from "@/components/SearchBar";
import { FaRocket, FaUtensils } from "react-icons/fa";

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearchSubmit = (searchFormValues: SearchForm) => {
    navigate(`/search/${searchFormValues.searchQuery}`);
  };

  return (
    <div className="bg-[#f0fdf4] min-h-screen">
      {/* Hero + Search Section */}
      <div className="pt-24 pb-20 px-6 md:px-32 bg-[#f0fdf4]">
        <div className="max-w-6xl mx-auto text-center flex flex-col items-center gap-8">
          <h1 className="text-5xl md:text-6xl font-extrabold text-green-800 tracking-tight leading-tight drop-shadow-md">
            Craving Something Delicious? 🍛
          </h1>
          <p className="text-lg md:text-xl text-[#4E342E] max-w-2xl">
            Explore your city's best meals from top-rated restaurants. Quick, tasty, and delivered with love ❤️
          </p>
          <button className="bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white text-lg px-8 py-3 rounded-full font-semibold shadow-lg transition-transform hover:scale-105">
            Find Your Feast
          </button>

          {/* Search Bar */}
          <div className="mt-10 w-full max-w-3xl bg-white rounded-2xl shadow-xl py-6 px-6 flex flex-col gap-3 border-l-4 border-green-600 transition-transform hover:scale-[1.02]">
            <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
              🥗 Find Food Fast
            </h2>
            <p className="text-base text-[#6D4C41] leading-relaxed">
              Search your city for the best bites and hidden gems.
            </p>
            <SearchBar
              placeHolder="Search by City or Town"
              onSubmit={handleSearchSubmit}
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 px-6 md:px-32 bg-[#f0fdf4]">
        <h2 className="text-4xl font-bold text-center text-green-800 mb-16 drop-shadow-sm">
          Why You'll Love Us 💚
        </h2>
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center justify-center text-center gap-6 transition-transform hover:scale-105 hover:shadow-green-200">
            <div className="bg-green-100 p-5 rounded-full text-green-700 text-5xl shadow-md">
              <FaRocket />
            </div>
            <h3 className="font-bold text-2xl text-green-800">
              Lightning-fast Delivery 🚀
            </h3>
            <p className="text-[#5D4037] text-md">
              Get your food fresh and hot in no time. We prioritize speed without compromising quality.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center justify-center text-center gap-6 transition-transform hover:scale-105 hover:shadow-green-200">
            <div className="bg-green-100 p-5 rounded-full text-green-700 text-5xl shadow-md">
              <FaUtensils />
            </div>
            <h3 className="font-bold text-2xl text-green-800">
              Discover Local Delights 🍽️
            </h3>
            <p className="text-[#5D4037] text-md">
              Explore trending dishes and hidden gems in your area, loved by foodies just like you.
            </p>
            <button className="mt-2 bg-gradient-to-r from-green-500 to-lime-500 hover:from-green-600 hover:to-lime-600 text-white px-6 py-2 rounded-xl font-semibold shadow-md transition-all hover:scale-105">
              Start Exploring
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
