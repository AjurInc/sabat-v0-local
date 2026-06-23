"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

function GetIndustries(t: any) {
  return [
    t('industries.corporations'),
    t('industries.government'),
    t('industries.healthcare'),
    t('industries.education'),
    t('industries.industrial'),
    t('industries.executive'),
  ];
}

export function IndustriesSection() {
  const { t } = useTranslation();
  const industries = GetIndustries(t);
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

  return (
    <section
      id="industries"
      ref={sectionRef}
      className="relative py-24 lg:py-32 border-y border-foreground/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <span className="inline-flex items-center gap-3 text-sm font-sans text-muted-foreground mb-6">
            <span className="w-8 h-px bg-foreground/30" />
            {t('industries.title')}
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {t('industries.trusted_by')}
            <br />
            <span className="text-muted-foreground">{t('industries.across_sectors')}</span>
          </h2>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {industries.map((industry, index) => (
            <div
              key={industry}
              className={`group relative transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }
              hover-lift p-8 lg:p-10 border border-foreground/10 rounded-2xl hover:border-foreground/30 hover:bg-foreground/2.5 bg-background/50`}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              <h3 className="text-xl lg:text-2xl font-display tracking-tight group-hover:translate-x-2 transition-transform duration-500">
                {industry}
              </h3>
              <p className="text-sm text-muted-foreground mt-3 group-hover:text-foreground/70 transition-colors">
                {t('industries.description')}
              </p>
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center group-hover:border-foreground/30 group-hover:bg-foreground/5 transition-all duration-500">
                <span className="text-xs font-mono text-muted-foreground">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
