"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GraduationCap, Users, ArrowRight, Sparkles, BookOpen, ShieldCheck, BrainCircuit, Menu, X, Globe, Rocket, CheckCircle, Play, Lock, Layout, ListChecks, PieChart, MousePointer2, Loader2, Clock, Zap, Database, Heart, Quote, ChevronLeft, ChevronRight, UserPlus, Search, Wand2, School, Accessibility, Settings, FileCheck, Server, UserCheck } from 'lucide-react';
import { Button } from '../components/ui/shared';
import { signup } from '../lib/auth';

// Translations
const translations = {
  EN: {
    nav: {
      pricing: "Pricing",
      enterCode: "Enter Class Code",
      login: "Log in",
      signup: "Sign Up Free"
    },
    hero: {
      badge: "IDÉLLIA: AI-Powered Learning Journeys",
      title: "Transform Passive Content into",
      titleHighlight: "Active Learning",
      subtitle: "Generate curriculum-aligned learning journeys in under 2 minutes with IDÉLLIA. Secure, culturally relevant, and designed for the modern classroom.",
      headline: "Create a Classroom-Ready Lesson in",
      headlineHighlight: "Under 2 Minutes",
      subtext: "AI-powered lesson creation that saves teachers 5+ hours per week.",
      signupLabel: "Start free — built for educators",
      benefits: [
        "Save hours on lesson planning",
        "Curriculum-aligned automatically",
        "No student data collected"
      ],
      emailPlaceholder: "Enter your work email",
      passwordPlaceholder: "Create a password",
      cta: "Start Free & Create My First Lesson →",
      creating: "Creating Account...",
      success: "Success! Redirecting...",
      microTrust: "No credit card • Free forever tier • Setup in 60 seconds",
      previewLabel: "This is what you’ll build after signup",
      previewTitle: "Grade 5 Fractions",
      previewSubtitle: "Interactive Lesson",
      previewActivity: "Activity 1: Visualizing Halves",
      previewStudentView: "Student View",
      previewInstruction: "Select the shape that represents 1/2",
      previewNext: "Next Activity →",
      previewSidebar: {
        activities: "Activities"
      }
    },
    roi: {
      hours: "Hours Saved / Week",
      engagement: "Student Engagement",
      resources: "Curated Resources",
      trust: "Teachers Trust Us"
    },
    howItWorks: {
      title: "How It Works",
      subtitle: "From idea to classroom-ready lesson in three simple steps.",
      steps: [
        { title: "Sign up in 60 seconds", description: "Create your free account and get instant access to the platform." },
        { title: "Enter your lesson topic", description: "Tell us what you want to teach, for which grade and subject." },
        { title: "AI builds your lesson", description: "Get a complete, curriculum-aligned learning journey instantly." }
      ]
    },
    socialProof: {
      title: "Trusted by Educators Across North America",
      testimonials: [
        { quote: "IDÉLLIA saves me 6 hours a week — I can finally focus on teaching instead of searching for resources.", role: "Grade 5 Teacher" },
        { quote: "The cultural relevance of the content is unmatched. My students finally see themselves in the curriculum.", role: "High School History" },
        { quote: "Setting up a lesson takes minutes, not hours. The AI suggestions are surprisingly accurate.", role: "French Immersion" }
      ]
    },
    features: {
      title: "Built for Modern Schools",
      subtitle: "Everything you need to deliver high-quality, engaging lessons.",
      items: [
        { title: "Curriculum-Aligned", description: "Every resource is vetted and mapped to specific learning outcomes." },
        { title: "Privacy-First", description: "No student data collection. Anonymous access via class codes." },
        { title: "Culturally Relevant", description: "Prioritizing diverse voices and local indigenous content." },
        { title: "Google Classroom Ready", description: "Seamlessly integrate with your existing LMS and tools." },
        { title: "Inclusive & Accessible", description: "Designed for all learners with built-in accessibility features." },
        { title: "Admin-Friendly", description: "Easy deployment and management for schools and districts." }
      ]
    },
    risk: {
      badge: "Security Guarantee",
      title: "Safe, Secure, and Built for Schools",
      subtitle: "We take student privacy seriously. Our platform is designed to meet the strictest security standards.",
      items: [
        { title: "No Student Data Stored", description: "We never collect or store PII from students. Access is completely anonymous." },
        { title: "FERPA / COPPA Ready", description: "Compliant with all major student privacy regulations and standards." },
        { title: "Privacy-First Architecture", description: "Built from the ground up with security and privacy as core principles." },
        { title: "Trusted by Schools", description: "Vetted and approved by district administrators across the country." }
      ]
    },
    role: {
      title: "Who are you signing up as?",
      educator: {
        title: "Educator",
        desc: "Create structured lesson plans, discover resources, and deploy to your class instantly.",
        cta: "Get Started"
      },
      student: {
        title: "Student",
        desc: "Enter your class code to access your personalized learning journey.",
        cta: "Join Class"
      }
    },
    footer: {
      poweredBy: "Powered by IDÉLLO",
      text: "IDÉLLIA utilizes the certified 15,000+ resource library of IDÉLLO to ensure 100% pedagogical safety.",
      privacy: "Privacy",
      terms: "Terms"
    }
  },
  FR: {
    nav: {
      pricing: "Tarifs",
      enterCode: "Entrer le code classe",
      login: "Connexion",
      signup: "Inscription Gratuite"
    },
    hero: {
      badge: "IDÉLLIA : Parcours d'apprentissage propulsés par l'IA",
      title: "Transformez le contenu passif en",
      titleHighlight: "Apprentissage Actif",
      subtitle: "Générez des parcours d'apprentissage alignés sur le programme en moins de 2 minutes avec IDÉLLIA. Sécurisé, culturellement pertinent et conçu pour la classe moderne.",
      headline: "Créez une leçon prête pour la classe en",
      headlineHighlight: "Moins de 2 Minutes",
      subtext: "Création de leçons assistée par IA qui fait gagner aux enseignants plus de 5 heures par semaine.",
      signupLabel: "Commencez gratuitement — conçu pour les éducateurs",
      benefits: [
        "Gagnez des heures sur la planification",
        "Alignement automatique au programme",
        "Aucune donnée élève collectée"
      ],
      emailPlaceholder: "Entrez votre email professionnel",
      passwordPlaceholder: "Créez un mot de passe",
      cta: "Commencer Gratuitement & Créer Ma Première Leçon →",
      creating: "Création du compte...",
      success: "Succès ! Redirection...",
      microTrust: "Pas de carte de crédit • Gratuit pour toujours • Configuration en 60s",
      previewLabel: "Voici ce que vous créerez après l'inscription",
      previewTitle: "Fractions 5e année",
      previewSubtitle: "Leçon Interactive",
      previewActivity: "Activité 1 : Visualiser les moitiés",
      previewStudentView: "Vue Élève",
      previewInstruction: "Sélectionnez la forme qui représente 1/2",
      previewNext: "Activité Suivante →",
      previewSidebar: {
        activities: "Activités"
      }
    },
    roi: {
      hours: "Heures Gagnées / Semaine",
      engagement: "Engagement des Élèves",
      resources: "Ressources Certifiées",
      trust: "Enseignants nous font confiance"
    },
    howItWorks: {
      title: "Comment ça marche",
      subtitle: "De l'idée à la leçon prête pour la classe en trois étapes simples.",
      steps: [
        { title: "Inscrivez-vous en 60 secondes", description: "Créez votre compte gratuit et accédez instantanément à la plateforme." },
        { title: "Entrez votre sujet de leçon", description: "Dites-nous ce que vous voulez enseigner, pour quel niveau et quelle matière." },
        { title: "L'IA construit votre leçon", description: "Obtenez instantanément un parcours d'apprentissage complet et aligné sur le programme." }
      ]
    },
    socialProof: {
      title: "Reconnu par les éducateurs à travers l'Amérique du Nord",
      testimonials: [
        { quote: "IDÉLLIA me fait gagner 6 heures par semaine — je peux enfin me concentrer sur l'enseignement au lieu de chercher des ressources.", role: "Enseignante 5e année" },
        { quote: "La pertinence culturelle du contenu est inégalée. Mes élèves se voient enfin dans le programme.", role: "Histoire Secondaire" },
        { quote: "Préparer une leçon prend des minutes, pas des heures. Les suggestions de l'IA sont étonnamment précises.", role: "Immersion Française" }
      ]
    },
    features: {
      title: "Conçu pour les Écoles Modernes",
      subtitle: "Tout ce dont vous avez besoin pour dispenser des leçons engageantes de haute qualité.",
      items: [
        { title: "Aligné au Programme", description: "Chaque ressource est vérifiée et mappée à des résultats d'apprentissage spécifiques." },
        { title: "Confidentialité Avant Tout", description: "Aucune collecte de données élèves. Accès anonyme via codes de classe." },
        { title: "Culturellement Pertinent", description: "Priorité aux voix diverses et au contenu autochtone local." },
        { title: "Prêt pour Google Classroom", description: "Intégration transparente avec vos outils et LMS existants." },
        { title: "Inclusif & Accessible", description: "Conçu pour tous les apprenants avec des fonctionnalités d'accessibilité intégrées." },
        { title: "Facile pour l'Admin", description: "Déploiement et gestion faciles pour les écoles et les districts." }
      ]
    },
    risk: {
      badge: "Garantie de Sécurité",
      title: "Sûr, Sécurisé et Conçu pour les Écoles",
      subtitle: "Nous prenons la confidentialité des élèves au sérieux. Notre plateforme respecte les normes de sécurité les plus strictes.",
      items: [
        { title: "Aucune Donnée Élève Stockée", description: "Nous ne collectons ni ne stockons jamais de PII des élèves. L'accès est totalement anonyme." },
        { title: "Conforme FERPA / COPPA", description: "Conforme à toutes les principales réglementations et normes de confidentialité des élèves." },
        { title: "Architecture Privacy-First", description: "Construit dès le départ avec la sécurité et la confidentialité comme principes fondamentaux." },
        { title: "Approuvé par les Écoles", description: "Vérifié et approuvé par les administrateurs de district à travers le pays." }
      ]
    },
    role: {
      title: "En tant que qui vous inscrivez-vous ?",
      educator: {
        title: "Éducateur",
        desc: "Créez des plans de cours structurés, découvrez des ressources et déployez-les instantanément dans votre classe.",
        cta: "Commencer"
      },
      student: {
        title: "Élève",
        desc: "Entrez votre code de classe pour accéder à votre parcours d'apprentissage personnalisé.",
        cta: "Rejoindre la classe"
      }
    },
    footer: {
      poweredBy: "Propulsé par IDÉLLO",
      text: "IDÉLLIA utilise la bibliothèque de plus de 15 000 ressources certifiées d'IDÉLLO pour garantir une sécurité pédagogique à 100%.",
      privacy: "Confidentialité",
      terms: "Conditions"
    }
  }
};

const AnimatedCounter = ({ end, duration = 2000, prefix = "", suffix = "" }: { end: number, duration?: number, prefix?: string, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-[#00b6ff] mb-2 tracking-tight">
      {prefix}{count.toLocaleString('en-US')}{suffix}
    </div>
  );
};

const SocialProof = ({ t }: { t: typeof translations['EN']['socialProof'] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const testimonials = [
    {
      quote: t.testimonials[0].quote,
      author: "Sarah Jenkins",
      role: t.testimonials[0].role,
      school: "Westwood Elementary",
      avatar: "S"
    },
    {
      quote: t.testimonials[1].quote,
      author: "David Chen",
      role: t.testimonials[1].role,
      school: "Oak Ridge District",
      avatar: "D"
    },
    {
      quote: t.testimonials[2].quote,
      author: "Marie Dubois",
      role: t.testimonials[2].role,
      school: "École Saint-Laurent",
      avatar: "M"
    }
  ];

  const next = () => setActiveIndex((current) => (current + 1) % testimonials.length);
  const prev = () => setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);

  // Autoplay
  useEffect(() => {
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, []);

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) next();
    if (isRightSwipe) prev();
    setTouchStart(0);
    setTouchEnd(0);
  };

  return (
    <div className="w-full bg-[#F8FAFC] py-24 border-b border-slate-200 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#00b6ff]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-16">
          {t.title}
        </h2>

        {/* Logos */}
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 mb-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
           <div className="flex items-center gap-2 font-bold text-xl text-slate-600"><div className="w-8 h-8 bg-slate-400 rounded-full"></div> District 9</div>
           <div className="flex items-center gap-2 font-bold text-xl text-slate-600"><div className="w-8 h-8 bg-slate-400 rounded-md"></div> EduTech</div>
           <div className="flex items-center gap-2 font-bold text-xl text-slate-600"><div className="w-8 h-8 bg-slate-400 rounded-tr-xl"></div> NorthStar</div>
           <div className="flex items-center gap-2 font-bold text-xl text-slate-600"><div className="w-8 h-8 bg-slate-400 rounded-bl-xl"></div> FutureLearn</div>
           <div className="flex items-center gap-2 font-bold text-xl text-slate-600"><div className="w-8 h-8 bg-slate-400 rounded-full border-4 border-slate-200"></div> Academix</div>
        </div>

        {/* Testimonial Carousel */}
        <div 
          className="max-w-4xl mx-auto relative bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-100"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
           <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[#00b6ff] text-white p-3 rounded-full shadow-lg">
             <Quote className="w-6 h-6 fill-current" />
           </div>
           
           <div className="overflow-hidden relative min-h-[240px] flex items-center justify-center">
             {testimonials.map((t, i) => (
               <div 
                 key={i}
                 className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ease-in-out transform ${
                   i === activeIndex ? 'opacity-100 translate-x-0 scale-100' : 
                   i < activeIndex ? 'opacity-0 -translate-x-10 scale-95' : 
                   'opacity-0 translate-x-10 scale-95'
                 }`}
               >
                 <p className="text-xl md:text-2xl font-medium text-slate-700 mb-8 leading-relaxed italic text-center">
                   "{t.quote}"
                 </p>
                 <div className="flex items-center gap-4">
                   <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#00b6ff] to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                     {t.avatar}
                   </div>
                   <div className="text-left">
                     <div className="font-bold text-[#0F172A] text-lg">{t.author}</div>
                     <div className="text-sm text-slate-500 font-medium">{t.role}, {t.school}</div>
                   </div>
                 </div>
               </div>
             ))}
           </div>
           
           {/* Controls */}
           <div className="flex justify-center items-center gap-4 mt-8">
             <button onClick={prev} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#00b6ff] transition-colors">
               <ChevronLeft className="w-5 h-5" />
             </button>
             <div className="flex gap-2">
               {testimonials.map((_, i) => (
                 <button
                   key={i}
                   onClick={() => setActiveIndex(i)}
                   className={`h-2 rounded-full transition-all duration-300 ${
                     i === activeIndex ? 'bg-[#00b6ff] w-8' : 'bg-slate-200 w-2 hover:bg-slate-300'
                   }`}
                   aria-label={`Go to testimonial ${i + 1}`}
                 />
               ))}
             </div>
             <button onClick={next} className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#00b6ff] transition-colors">
               <ChevronRight className="w-5 h-5" />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const HowItWorks = ({ t }: { t: typeof translations['EN']['howItWorks'] }) => {
  const steps = [
    {
      icon: <UserPlus className="w-8 h-8 text-white" />,
      title: t.steps[0].title,
      description: t.steps[0].description
    },
    {
      icon: <Search className="w-8 h-8 text-white" />,
      title: t.steps[1].title,
      description: t.steps[1].description
    },
    {
      icon: <Wand2 className="w-8 h-8 text-white" />,
      title: t.steps[2].title,
      description: t.steps[2].description
    }
  ];

  return (
    <div className="w-full bg-white py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-100 -z-10"></div>

          {steps.map((step, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#00b6ff] to-blue-600 flex items-center justify-center shadow-lg shadow-[#00b6ff]/20 mb-6 group-hover:shadow-[#00b6ff]/40 transition-shadow duration-300 relative">
                {step.icon}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white border-2 border-[#00b6ff] flex items-center justify-center font-bold text-[#00b6ff] shadow-sm">
                  {index + 1}
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-[#00b6ff] transition-colors">
                {step.title}
              </h3>
              <p className="text-slate-500 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FeatureGrid = ({ t }: { t: typeof translations['EN']['features'] }) => {
  const features = [
    {
      icon: <BookOpen className="w-6 h-6 text-[#00b6ff]" />,
      title: t.items[0].title,
      description: t.items[0].description
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#00b6ff]" />,
      title: t.items[1].title,
      description: t.items[1].description
    },
    {
      icon: <Sparkles className="w-6 h-6 text-[#00b6ff]" />,
      title: t.items[2].title,
      description: t.items[2].description
    },
    {
      icon: <School className="w-6 h-6 text-[#00b6ff]" />,
      title: t.items[3].title,
      description: t.items[3].description
    },
    {
      icon: <Accessibility className="w-6 h-6 text-[#00b6ff]" />,
      title: t.items[4].title,
      description: t.items[4].description
    },
    {
      icon: <Settings className="w-6 h-6 text-[#00b6ff]" />,
      title: t.items[5].title,
      description: t.items[5].description
    }
  ];

  return (
    <div className="w-full bg-white py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white border border-slate-200 rounded-xl p-8 hover:shadow-lg hover:border-[#00b6ff]/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#00b6ff]/10 flex items-center justify-center mb-6 group-hover:bg-[#00b6ff] transition-colors duration-300">
                {React.cloneElement(feature.icon as React.ReactElement, { 
                  className: "w-6 h-6 text-[#00b6ff] group-hover:text-white transition-colors duration-300" 
                })}
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-[#00b6ff] transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RiskReversal = ({ t }: { t: typeof translations['EN']['risk'] }) => {
  const items = [
    {
      icon: <Lock className="w-6 h-6 text-green-600" />,
      title: t.items[0].title,
      description: t.items[0].description
    },
    {
      icon: <FileCheck className="w-6 h-6 text-green-600" />,
      title: t.items[1].title,
      description: t.items[1].description
    },
    {
      icon: <Server className="w-6 h-6 text-green-600" />,
      title: t.items[2].title,
      description: t.items[2].description
    },
    {
      icon: <UserCheck className="w-6 h-6 text-green-600" />,
      title: t.items[3].title,
      description: t.items[3].description
    }
  ];

  return (
    <div className="w-full bg-slate-50 py-20 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 mr-2" /> {t.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
            {t.title}
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-[#0F172A] mb-2">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RoleSelection = ({ t }: { t: typeof translations['EN']['role'] }) => {
  return (
    <div className="w-full bg-[#F8FAFC] py-24 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-12">
          {t.title}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Educator Card */}
          <Link href="/educator" className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00b6ff] to-blue-400 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur"></div>
            <div className="relative h-full bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center text-center hover:border-[#00b6ff]/50 hover:shadow-xl hover:shadow-[#00b6ff]/10 transition duration-300">
              <div className="w-20 h-20 rounded-2xl bg-[#00b6ff]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                <GraduationCap className="w-10 h-10 text-[#00b6ff]" />
              </div>
              <h3 className="text-2xl font-bold text-[#0F172A] mb-3">{t.educator.title}</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                {t.educator.desc}
              </p>
              <div className="mt-auto w-full">
                <div className="w-full py-3 bg-[#00b6ff] text-white rounded-xl font-bold shadow-lg shadow-[#00b6ff]/20 group-hover:bg-[#0095d1] transition-colors flex items-center justify-center">
                  {t.educator.cta} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Student Card */}
          <Link href="/student" className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00b6ff] to-cyan-400 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 blur"></div>
            <div className="relative h-full bg-white border border-slate-200 rounded-2xl p-10 flex flex-col items-center text-center hover:border-[#00b6ff]/50 hover:shadow-xl hover:shadow-[#00b6ff]/10 transition duration-300">
              <div className="w-20 h-20 rounded-2xl bg-[#00b6ff]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition duration-300">
                <Users className="w-10 h-10 text-[#00b6ff]" />
              </div>
              <h3 className="text-2xl font-bold text-[#0F172A] mb-3">{t.student.title}</h3>
              <p className="text-slate-500 mb-8 leading-relaxed">
                {t.student.desc}
              </p>
              <div className="mt-auto w-full">
                <div className="w-full py-3 bg-white text-[#00b6ff] border-2 border-[#00b6ff] rounded-xl font-bold hover:bg-[#00b6ff]/5 transition-colors flex items-center justify-center">
                  {t.student.cta} <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [classCode, setClassCode] = useState('');
  const [language, setLanguage] = useState<'EN' | 'FR'>('EN');
  const [mounted, setMounted] = useState(false);
  
  // Signup Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const t = translations[language];

  // Handle hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if user is logged in and redirect to educator dashboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      if (token) {
        router.push('/educator');
      }
    }
  }, [router]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleJoinClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (classCode.length >= 6) {
      router.push(`/student/journey/${classCode.toUpperCase()}`);
    }
  };

  const handleTeacherSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSigningUp(true);
    
    try {
      // Call the actual signup API
      await signup({
        email,
        password,
        name: email.split('@')[0] // Use email prefix as default name
      });
      
      setIsSigningUp(false);
      setSignupSuccess(true);
      
      // Redirect after brief success message
      setTimeout(() => {
        router.push('/educator');
      }, 1000);
    } catch (error) {
      console.error("Signup failed:", error);
      setIsSigningUp(false);
      // You might want to show an error message to the user here
      alert(error instanceof Error ? error.message : "Signup failed. Please try again.");
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'FR' : 'EN');
  };

  // Prevent hydration mismatch by rendering a simple loading state or nothing until mounted
  if (!mounted) {
    return <div className="min-h-screen bg-[#F8FAFC]"></div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] overflow-hidden selection:bg-[#00b6ff]/30 flex flex-col font-sans">
      
      {/* Sticky Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          {/* Left: Logo */}
          <button 
            onClick={() => {
              const token = localStorage.getItem('auth_token');
              if (token) {
                router.push('/educator');
              }
            }}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-[#00b6ff] flex items-center justify-center shadow-md shadow-[#00b6ff]/20">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-[#0F172A]">
              IDÉLL<span className="text-[#00b6ff]">IA</span>
            </span>
          </button>

          {/* Center: Pricing & Class Code (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#" className="text-sm font-medium text-slate-600 hover:text-[#00b6ff] transition-colors">
              {t.nav.pricing}
            </Link>
            
            <form onSubmit={handleJoinClass} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Rocket className="h-4 w-4 text-slate-400 group-focus-within:text-[#00b6ff] transition-colors" />
              </div>
              <input
                type="text"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                placeholder={t.nav.enterCode}
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:border-[#00b6ff] focus:ring-2 focus:ring-[#00b6ff]/10 w-48 transition-all shadow-sm"
                maxLength={6}
              />
            </form>
          </div>

          {/* Right: Actions (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-[#00b6ff] transition-colors px-2 py-1 rounded-md hover:bg-slate-50"
            >
              <Globe className="w-4 h-4" />
              {language}
            </button>
            
            <div className="h-4 w-px bg-slate-200"></div>
            
            <Link href="/educator" className="text-sm font-medium text-slate-600 hover:text-[#00b6ff] transition-colors">
              {t.nav.login}
            </Link>
            
            <Button 
              onClick={() => router.push('/educator')}
              className="bg-[#00b6ff] hover:bg-[#0095d1] text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg shadow-[#00b6ff]/20"
            >
              {t.nav.signup}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:text-[#00b6ff]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 shadow-lg p-6 md:hidden flex flex-col gap-6 animate-fade-in-up">
            <Link href="#" className="text-base font-medium text-slate-600 hover:text-[#00b6ff]">
              {t.nav.pricing}
            </Link>
            
            <form onSubmit={handleJoinClass} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Rocket className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                placeholder={t.nav.enterCode}
                className="pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#00b6ff] w-full"
                maxLength={6}
              />
            </form>

            <div className="h-px bg-slate-100 w-full"></div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Language</span>
                <button 
                  onClick={toggleLanguage}
                  className="flex items-center gap-1 text-sm font-bold text-[#00b6ff] bg-[#00b6ff]/10 px-3 py-1 rounded-full"
                >
                  <Globe className="w-4 h-4" />
                  {language}
                </button>
              </div>
              
              <Link href="/educator" className="text-center py-3 text-slate-600 font-medium hover:text-[#00b6ff]">
                {t.nav.login}
              </Link>
              
              <Button 
                onClick={() => router.push('/educator')}
                className="w-full bg-[#00b6ff] hover:bg-[#0095d1] text-white py-3 rounded-xl font-bold shadow-lg shadow-[#00b6ff]/20"
              >
                {t.nav.signup}
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00b6ff]/10 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[128px] animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 lg:pt-48 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Column: Value + Signup */}
          <div className="flex flex-col text-left z-10 animate-fade-in-up">
             <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-[#0F172A] mb-6 leading-tight">
               {t.hero.headline} <span className="text-[#00b6ff]">{t.hero.headlineHighlight}</span>
             </h1>
             <p className="text-lg text-slate-600 mb-8 max-w-lg leading-relaxed">
               {t.hero.subtext}
             </p>

             {/* Signup Card */}
             <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00b6ff] to-blue-400"></div>
               <div className="text-sm font-bold text-[#00b6ff] uppercase tracking-wider mb-6">{t.hero.signupLabel}</div>
               
               <ul className="space-y-3 mb-8">
                 {t.hero.benefits.map((benefit, i) => (
                   <li key={i} className="flex items-center text-slate-700 font-medium">
                     <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                     {benefit}
                   </li>
                 ))}
               </ul>

               <form onSubmit={handleTeacherSignup} className="space-y-4">
                  <input 
                    id="email"
                    name="email"
                    autoComplete="email"
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.hero.emailPlaceholder}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#00b6ff] focus:ring-4 focus:ring-[#00b6ff]/10 outline-none transition-all"
                    required
                    disabled={isSigningUp || signupSuccess}
                  />
                  <input 
                    id="password"
                    name="password"
                    autoComplete="new-password"
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.hero.passwordPlaceholder}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#00b6ff] focus:ring-4 focus:ring-[#00b6ff]/10 outline-none transition-all"
                    required
                    disabled={isSigningUp || signupSuccess}
                  />
                  <Button 
                    className={`w-full py-4 text-lg font-bold rounded-xl shadow-lg shadow-[#00b6ff]/25 transition-all duration-300 ${signupSuccess ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    disabled={isSigningUp || signupSuccess}
                  >
                    {isSigningUp ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t.hero.creating}
                      </span>
                    ) : signupSuccess ? (
                      <span className="flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 mr-2" /> {t.hero.success}
                      </span>
                    ) : (
                      t.hero.cta
                    )}
                  </Button>
               </form>

               <div className="mt-6 flex gap-3">
                  <button className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Google
                  </button>
                  <button className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 23 23" fill="currentColor"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
                    Microsoft
                  </button>
               </div>

               <div className="mt-6 text-xs text-slate-400 text-center font-medium">
                 {t.hero.microTrust}
               </div>
             </div>
          </div>

          {/* Right Column: Product Preview */}
          <div className="relative z-10 hidden lg:block animate-fade-in-up delay-200">
             {/* Abstract background blob */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-[#00b6ff]/20 to-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
             
             {/* Floating Label */}
             <div className="absolute -top-6 -right-6 z-20 bg-[#0F172A] text-white px-4 py-2 rounded-lg shadow-xl text-sm font-bold transform rotate-3 flex items-center animate-bounce">
               <Sparkles className="w-4 h-4 text-[#00b6ff] mr-2" />
               {t.hero.previewLabel}
             </div>

             {/* Mock UI Card */}
             <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform rotate-[-1deg] hover:rotate-0 transition-transform duration-500 max-w-lg mx-auto">
                {/* Header of mock app */}
                <div className="bg-white border-b border-slate-100 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00b6ff]/10 flex items-center justify-center text-[#00b6ff]">
                      <PieChart className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#0F172A]">{t.hero.previewTitle}</h3>
                      <p className="text-xs text-slate-500">{t.hero.previewSubtitle}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                    <div className="h-2 w-2 rounded-full bg-slate-200"></div>
                  </div>
                </div>
                
                <div className="flex h-80">
                  {/* Sidebar */}
                  <div className="w-1/3 bg-slate-50 border-r border-slate-100 p-4 space-y-4">
                    <div className="flex items-center gap-3 text-slate-400">
                      <Layout className="w-4 h-4" />
                      <div className="h-2 w-16 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="flex items-center gap-3 text-[#00b6ff] bg-white p-2 rounded-lg shadow-sm border border-slate-100">
                      <Play className="w-4 h-4" />
                      <span className="text-xs font-bold">{t.hero.previewSidebar.activities}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400">
                      <ListChecks className="w-4 h-4" />
                      <div className="h-2 w-12 bg-slate-200 rounded-full"></div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-bold text-[#0F172A]">{t.hero.previewActivity}</h4>
                      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">{t.hero.previewStudentView}</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center gap-6">
                      <div className="flex gap-8">
                        <div className="w-20 h-20 rounded-full border-4 border-slate-200 flex items-center justify-center relative group cursor-pointer hover:border-[#00b6ff] transition-colors">
                          <div className="absolute inset-0 bg-slate-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <span className="relative z-10 font-bold text-slate-400 group-hover:text-[#00b6ff]">1/3</span>
                        </div>
                        <div className="w-20 h-20 rounded-full border-4 border-[#00b6ff] flex items-center justify-center relative cursor-pointer shadow-lg shadow-[#00b6ff]/20">
                          <div className="absolute top-0 bottom-0 left-0 right-1/2 bg-[#00b6ff]/10 rounded-l-full border-r border-[#00b6ff]"></div>
                          <span className="relative z-10 font-bold text-[#00b6ff]">1/2</span>
                          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                            <MousePointer2 className="w-5 h-5 text-[#00b6ff] fill-[#00b6ff]" />
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-500 text-center">{t.hero.previewInstruction}</p>
                    </div>

                    <div className="mt-auto flex justify-end">
                      <div className="px-4 py-2 bg-[#00b6ff] text-white text-xs font-bold rounded-lg shadow-md">
                        {t.hero.previewNext}
                      </div>
                    </div>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>

      {/* ROI Metrics Strip */}
      <div className="w-full bg-white border-y border-slate-200 py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <div className="mb-3 p-3 bg-[#00b6ff]/10 rounded-full">
              <Clock className="w-6 h-6 text-[#00b6ff]" />
            </div>
            <AnimatedCounter end={5} suffix="+" />
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{t.roi.hours}</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-3 p-3 bg-[#00b6ff]/10 rounded-full">
              <Zap className="w-6 h-6 text-[#00b6ff]" />
            </div>
            <AnimatedCounter end={2} suffix="x" />
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{t.roi.engagement}</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-3 p-3 bg-[#00b6ff]/10 rounded-full">
              <Database className="w-6 h-6 text-[#00b6ff]" />
            </div>
            <AnimatedCounter end={15000} suffix="+" />
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{t.roi.resources}</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="mb-3 p-3 bg-[#00b6ff]/10 rounded-full">
              <Heart className="w-6 h-6 text-[#00b6ff]" />
            </div>
            <AnimatedCounter end={3000} suffix="+" />
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{t.roi.trust}</div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <HowItWorks t={t.howItWorks} />

      {/* Social Proof Section */}
      <SocialProof t={t.socialProof} />

      {/* Feature Grid Section */}
      <FeatureGrid t={t.features} />

      {/* Risk Reversal Section */}
      <RiskReversal t={t.risk} />

      {/* Role Selection Section */}
      <RoleSelection t={t.role} />

      {/* Footer / Trust Section */}
      <footer className="relative z-10 w-full bg-white border-t border-slate-200 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-[#00b6ff]/5 border border-[#00b6ff]/10 rounded-2xl p-8 text-center">
            <div className="flex items-center justify-center mb-4">
               <span className="text-sm font-bold tracking-wider text-[#00b6ff] uppercase">{t.footer.poweredBy}</span>
            </div>
            <p className="text-slate-700 text-lg font-medium leading-relaxed">
              {t.footer.text}
            </p>
          </div>
          
          <div className="mt-8 flex justify-center items-center gap-6 text-sm text-slate-400">
             <span>&copy; {new Date().getFullYear()} IDÉLLIA</span>
             <a href="#" className="hover:text-[#00b6ff] transition-colors">{t.footer.privacy}</a>
             <a href="#" className="hover:text-[#00b6ff] transition-colors">{t.footer.terms}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

