import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Challenges from "@/components/Challenges";
import Features from "@/components/Features";
import Impact from "@/components/Impact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Challenges />
        <Features />
        <Impact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
