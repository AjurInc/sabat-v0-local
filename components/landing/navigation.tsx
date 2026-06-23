"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogIn, UserPlus } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import Image from "next/image";
import Link from "next/link";

export function Navigation() {
  const { t } = useTranslation();
  
  const navLinks = [
    { name: t('nav.services'), href: "/#services" },
    { name: t('nav.how_it_works'), href: "/#how-it-works" },
    { name: t('nav.industries'), href: "/#industries" },
    { name: t('nav.about'), href: "/#about" },
    { name: t('nav.faq'), href: "/#faq" },
  ];
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled 
          ? "top-4 left-4 right-4" 
          : "top-0 left-0 right-0"
      }`}
      dir="ltr"
    >
      <nav 
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "bg-background/40 backdrop-blur-2xl border border-foreground/15 rounded-2xl shadow-xl shadow-background/20 max-w-[1200px]"
            : "bg-transparent max-w-[1400px]"
        }`}
      >
        <div 
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image 
              src="/sabat-logo.png" 
              alt="SABAT Logo" 
              width={32} 
              height={32}
              className={`transition-all duration-500 ${isScrolled ? "w-7 h-7" : "w-8 h-8"}`}
            />
            <span className={`font-display tracking-tight transition-all duration-500 ${isScrolled ? "text-lg" : "text-xl"} font-bold`}>SABAT</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm text-foreground/70 hover:text-foreground transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                aria-label="Profile menu"
              >
                <User className="w-5 h-5" />
              </button>
              
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-background border border-foreground/10 rounded-lg shadow-lg z-50">
                  <Link
                    href="/auth/signin"
                    className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-foreground/5 transition-colors border-b border-foreground/10"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <LogIn className="w-4 h-4" />
                    {t('nav.sign_in')}
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-foreground/5 transition-colors"
                    onClick={() => setIsProfileMenuOpen(false)}
                  >
                    <UserPlus className="w-4 h-4" />
                    {t('nav.sign_up')}
                  </Link>
                </div>
              )}
            </div>
            
            <Button
              size="sm"
              className={`bg-foreground hover:bg-foreground/90 text-background rounded-full transition-all duration-500 ${isScrolled ? "px-4 h-8 text-xs" : "px-6"}`}
            >
              {t('nav.book_consultation')}
            </Button>
          </div>

          {/* Mobile Menu Controls */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

      </nav>
      
      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-background/95 backdrop-blur-sm z-40 transition-all duration-500 ${
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
        style={{ top: isScrolled ? "4rem" : "5rem" }}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className="flex flex-col h-full px-8 py-8 pb-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-start gap-8 pt-12">
            {navLinks.map((link, i) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-5xl font-display text-foreground hover:text-muted-foreground transition-all duration-500 ${
                  isMobileMenuOpen 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: isMobileMenuOpen ? `${i * 75}ms` : "0ms" }}
              >
                {link.name}
              </a>
            ))}
          </div>
          
          {/* Bottom CTAs */}
          <div className={`flex flex-col gap-3 pt-8 border-t border-foreground/10 transition-all duration-500 ${
            isMobileMenuOpen 
              ? "opacity-100 translate-y-0" 
              : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: isMobileMenuOpen ? "300ms" : "0ms" }}
          >
            <Link 
              href="/auth/signin"
              className="w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Button 
                variant="outline" 
                className="w-full rounded-full h-12 text-base"
              >
                {t('nav.sign_in')}
              </Button>
            </Link>
            <Link 
              href="/auth/signup"
              className="w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Button 
                className="w-full bg-foreground text-background rounded-full h-12 text-base"
              >
                {t('nav.sign_up')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
