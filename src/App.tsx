import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { UIProvider } from "@/context/UIContext";
import { useBootReady } from "@/hooks/useBootReady";
import { useEconomyMode } from "@/hooks/useEconomyMode";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { EconomyToggle } from "@/components/EconomyToggle";
import { HeroSection } from "@/sections/HeroSection";
import { AboutSection } from "@/sections/AboutSection";
import { StatsSection } from "@/sections/StatsSection";
import { HowToPlaySection } from "@/sections/HowToPlaySection";
import { CommunitySection } from "@/sections/CommunitySection";
import { RulesSection } from "@/sections/RulesSection";
import { LegalOrgsSection } from "@/sections/LegalOrgsSection";
import { CreatorsSection } from "@/sections/CreatorsSection";

// Imagens que precisam estar prontas antes da animação de entrada do Hero.
const HERO_IMAGES = ["/images/logo-cidadela-640.webp", "/images/personagem-1000.webp"];

export default function App() {
  const ready = useBootReady(HERO_IMAGES);
  const [economy, toggleEconomy] = useEconomyMode();

  return (
    <LazyMotion features={domAnimation} strict>
      {/* Modo econômico: animações de movimento viram instantâneas (além do que o CSS desliga) */}
      <MotionConfig reducedMotion={economy ? "always" : "user"}>
        <UIProvider>
          <div className="grain">
            <SkipLink />
            <Navbar ready={ready} />
            <main id="conteudo">
              <HeroSection ready={ready} />
              <AboutSection />
              <StatsSection />
              <LegalOrgsSection />
              <HowToPlaySection />
              <CreatorsSection />
              <CommunitySection />
              <RulesSection />
            </main>
            <Footer />
            <EconomyToggle on={economy} onToggle={toggleEconomy} ready={ready} />
          </div>
        </UIProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
