"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Instagram, Send, Linkedin, MapPin, Youtube } from "lucide-react";

const socialLinks = [
  { name: "WhatsApp", href: "https://wa.me/989982550013", icon: MessageCircle },
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "Telegram", href: "#", icon: Send },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "TripAdvisor", href: "#", icon: MapPin },
  { name: "YouTube", href: "#", icon: Youtube },
];

export function ContactSection() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: "",
    contactPerson: "",
    email: "",
    phone: "",
    serviceInterest: "accommodation",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        organizationName: "",
        contactPerson: "",
        email: "",
        phone: "",
        serviceInterest: "accommodation",
        message: "",
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-24 lg:py-32 border-t border-foreground/10"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Left Content */}
          <div>
            <span className="inline-flex items-center gap-3 text-sm font-sans text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              {t('contact.title')}
            </span>
            <h2
              className={`text-4xl lg:text-6xl font-display tracking-tight mb-8 transition-all duration-700 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {t('contact.cta_text')}
            </h2>
            <p
              className={`text-lg text-muted-foreground leading-relaxed mb-12 transition-all duration-700 delay-100 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              {t('contact.description')}
            </p>

            {/* Contact Info */}
            <div
              className={`space-y-6 transition-all duration-700 delay-200 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <div>
                <p className="text-sm font-mono text-muted-foreground mb-2">{t('contact.business_whatsapp')}</p>
                <a href="https://wa.me/989982550013" className="text-lg text-foreground hover:text-foreground/80 transition-colors">+98 998 255 0013</a>
              </div>
              <div>
                <p className="text-sm font-mono text-muted-foreground mb-2">{t('contact.office')}</p>
                <p className="text-lg text-foreground">+98 21 5621 7234</p>
              </div>
              <div>
                <p className="text-sm font-mono text-muted-foreground mb-2">{t('contact.mobile')}</p>
                <div className="space-y-1">
                  <p className="text-lg text-foreground">+98 998 255 0013</p>
                  <p className="text-lg text-foreground">+98 998 255 0014</p>
                  <p className="text-lg text-foreground">+98 998 255 0015</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-mono text-muted-foreground mb-2">{t('contact.email')}</p>
                <p className="text-lg text-foreground">contact@sabat.ir</p>
              </div>
              <div>
                <p className="text-sm font-mono text-muted-foreground mb-2">{t('contact.address')}</p>
                <p className="text-lg text-foreground">Tehran, Iran</p>
              </div>

              {/* Social Links Box */}
              <div className="p-6 border border-foreground/10 rounded-lg bg-background/50 backdrop-blur-sm w-fit">
                <p className="text-xs font-medium text-foreground/60 mb-4 uppercase tracking-wide">{t('contact.connect_with_us')}</p>
                <div className="grid grid-cols-3 gap-3">
                  {socialLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        title={link.name}
                        className="flex items-center justify-center w-10 h-10 rounded-lg border border-foreground/10 text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all duration-200 group"
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Organization Name */}
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2">
                  {t('contact.organization_name')} *
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg focus:outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="Your company"
                />
              </div>

              {/* Contact Person */}
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2">
                  {t('contact.contact_person')} *
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg focus:outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2">
                  {t('contact.email')} *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg focus:outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="your@email.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2">
                  {t('contact.mobile')} *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg focus:outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 transition-all text-foreground placeholder:text-muted-foreground"
                  placeholder="+98 (XXX) XXX-XXXX"
                />
              </div>

              {/* Service Interest */}
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2">
                  {t('contact.service_interest')} *
                </label>
                <select
                  name="serviceInterest"
                  value={formData.serviceInterest}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg focus:outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 transition-all text-foreground"
                >
                  <option value="accommodation">{t('contact.corporate_accommodation')}</option>
                  <option value="transfers">{t('contact.transfers_hospitality')}</option>
                  <option value="business-travel">{t('contact.business_travel_operations')}</option>
                  <option value="all">{t('contact.all_services')}</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-mono text-muted-foreground mb-2">
                  {t('contact.message')}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 bg-background border border-foreground/10 rounded-lg focus:outline-none focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 transition-all text-foreground placeholder:text-muted-foreground resize-none"
                  placeholder={t('contact.message_placeholder')}
                />
              </div>

              {/* Submit */}
              <Button
                type="submit"
                className="w-full bg-foreground hover:bg-foreground/90 text-background rounded-lg h-12 text-base font-medium group"
              >
                {submitted ? t('contact.thank_you') : t('contact.book_consultation')}
                {!submitted && <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                {t('contact.response_time')}
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
