import BestSellers from "@/components/modules/Home/BestSellers"
import LeagueCarousel from "@/components/modules/Home/LeagueCarousel"
import TestimonialCarousel from "@/components/modules/Home/TestimonialCarousel"
import NewArrivals from "../../components/modules/Home/NewArrivals"

const Home = () => {
  return (
    <div className="w-full h-full flex flex-col items-center">
        {/* <Hero /> */}
        <BestSellers />
        <LeagueCarousel />
        <NewArrivals />
        <TestimonialCarousel />
    </div>
  )
}

export default Home