import Navbar          from './components/Navbar';
import useReveal       from './components/useReveal';
import Hero            from './sections/Hero';
import Marquee         from './sections/Marquee';
import Services        from './sections/Services';
import Process         from './sections/Process';
import Portfolio       from './sections/Portfolio';
import Team            from './sections/Team';
import Blogs           from './sections/Blogs';
import Reviews         from './sections/Reviews';
import AuditContact    from './sections/AuditContact';
import FAQ             from './sections/FAQ';
import Footer          from './sections/Footer';
import WhatsAppChatbot from './components/WhatsAppChatbot';
import './App.css';

export default function MainWebsite() {
  useReveal();
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Marquee />
      <Services />
      <Process />
      <Portfolio />
      <Team />
      <Blogs />
      <Reviews />
      <AuditContact />
      <FAQ />
      <Footer />
      <WhatsAppChatbot />
    </div>
  );
}
