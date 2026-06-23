"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Users, Clock, Zap } from "lucide-react";

function GetSteps() {
  const { t } = useTranslation();
  return [
    {
      number: "I",
      title: t('how_it_works.step1'),
      description: t('how_it_works.step1_desc'),
      icon: Users,
      highlights: [t('how_it_works.step1'), t('how_it_works.step1_desc'), t('buttons.learn_more')]
    },
    {
      number: "II",
      title: t('how_it_works.step2'),
      description: t('how_it_works.step2_desc'),
      icon: Zap,
      highlights: [t('buttons.learn_more'), t('cta.book_demo'), t('buttons.contact_us')]
    },
    {
      number: "III",
      title: t('how_it_works.step3'),
      description: t('how_it_works.step3_desc'),
      icon: CheckCircle2,
      highlights: [t('buttons.learn_more'), t('cta.request_consultation'), t('buttons.get_started')]
    },
  ];
}

export function HowItWorksSection() {
  const { t } = useTranslation();
  const steps = GetSteps();
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-foreground text-background overflow-hidden"
    >
      {/* Diagonal lines pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 40px,
            currentColor 40px,
            currentColor 41px
          )`
        }} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <span className="inline-flex items-center gap-3 text-sm font-sans text-background/50 mb-6">
            <span className="w-8 h-px bg-background/30" />
            {t('how_it_works.title')}
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t('how_it_works.three_step')}
            <br />
            <span className="text-background/50">{t('how_it_works.tailored_solutions')}</span>
          </h2>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Steps */}
          <div className="space-y-0">
            {steps.map((step, index) => (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`w-full text-left py-8 border-b border-background/10 transition-all duration-500 group ${
                  activeStep === index ? "opacity-100" : "opacity-40 hover:opacity-70"
                }`}
              >
                <div className="flex items-start gap-6">
                  <span className="font-display text-3xl text-background/30">{step.number}</span>
                  <div className="flex-1">
                    <h3 className="text-2xl lg:text-3xl font-display mb-3 group-hover:translate-x-2 transition-transform duration-300">
                      {step.title}
                    </h3>
                    <p className="text-background/60 leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Progress indicator */}
                    {activeStep === index && (
                      <div className="mt-4 h-px bg-background/20 overflow-hidden">
                        <div 
                          className="h-full bg-background w-0"
                          style={{
                            animation: 'progress 5s linear forwards'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Visual step display */}
          <div className="lg:sticky lg:top-32 self-start">
            <div className="space-y-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeStep === index;
                
                return (
                  <div
                    key={step.number}
                    className={`p-8 border transition-all duration-500 ${
                      isActive
                        ? "border-background/30 bg-background/5"
                        : "border-background/10 bg-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`p-3 rounded-lg transition-colors duration-500 ${
                        isActive ? "bg-background/20" : "bg-background/10"
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-sm font-mono text-background/40 mb-1">Step {step.number}</div>
                        <h3 className="text-lg font-display">{step.title}</h3>
                      </div>
                    </div>

                    {isActive && (
                      <div className="space-y-3 mt-6 pt-6 border-t border-background/10">
                        <div className="text-sm text-background/60 leading-relaxed mb-4">
                          {step.description}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {step.highlights.map((highlight, i) => (
                            <div
                              key={i}
                              className="text-xs px-3 py-1 rounded-full bg-background/10 text-background/80"
                            >
                              {highlight}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Timeline connector */}
            <div className="mt-8 p-6 border border-background/10 bg-background/5 text-center">
              <Clock className="w-8 h-8 mx-auto mb-3 opacity-50" />
              <p className="text-sm text-background/60">
                Typical implementation: 2-4 weeks
              </p>
              <p className="text-xs text-background/40 mt-2">
                {t('how_it_works.step3_desc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  );
}
