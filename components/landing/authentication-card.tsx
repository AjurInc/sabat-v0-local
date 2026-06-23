"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Check, Shield, X, AlertCircle } from "lucide-react"
import { authAPI } from "@/lib/auth-client"

type AuthStep = "login" | "signup" | "forgot-password" | "reset-password" | "otp" | "success"
type AuthMode = "login" | "signup"

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
}

const passwordRequirements: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (pwd) => pwd.length >= 8 },
  { label: "One uppercase letter", test: (pwd) => /[A-Z]/.test(pwd) },
  { label: "One lowercase letter", test: (pwd) => /[a-z]/.test(pwd) },
  { label: "One number", test: (pwd) => /\d/.test(pwd) },
  { label: "One special character", test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
]

interface AuthenticationCardProps {
  initialMode?: AuthMode;
}

export default function AuthenticationCard({ initialMode = "login" }: AuthenticationCardProps) {
  const router = useRouter()
  const [step, setStep] = useState<AuthStep>(initialMode)
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    otp: ["", "", "", "", "", ""],
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...formData.otp]
      newOtp[index] = value
      setFormData((prev) => ({ ...prev, otp: newOtp }))

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const getPasswordStrength = (password: string) => {
    const passedRequirements = passwordRequirements.filter((req) => req.test(password)).length
    if (passedRequirements === 0) return { strength: 0, label: "", color: "" }
    if (passedRequirements <= 2) return { strength: 25, label: "Weak", color: "bg-red-500" }
    if (passedRequirements <= 3) return { strength: 50, label: "Fair", color: "bg-yellow-500" }
    if (passedRequirements <= 4) return { strength: 75, label: "Good", color: "bg-blue-500" }
    return { strength: 100, label: "Strong", color: "bg-green-500" }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (step === "signup") {
        // Sign up user
        const response = await authAPI.signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.confirmPassword,
        })
        
        if (response.success) {
          setUserId(response.data.user_id)
          setStep("otp")
        } else {
          setError(response.message || "Signup failed")
        }
      } else if (step === "login") {
        // Sign in user
        const response = await authAPI.signin({
          email: formData.email,
          password: formData.password,
        })

        if (!response.success) {
          setError(response.message || "Sign in failed")
        } else if (response.data.verification_required) {
          // User needs to verify OTP
          setUserId(response.data.user_id || null)
          setStep("otp")
        } else if (response.data.access_token) {
          // Already verified, logged in successfully
          setStep("success")
          setTimeout(() => {
            router.push("/dashboard")
          }, 1000)
        }
      } else if (step === "otp") {
        // Verify OTP code
        const otpCode = formData.otp.join("")
        
        if (!userId) {
          setError("User ID not found")
          return
        }

        if (otpCode.length !== 6) {
          setError("Please enter a 6-digit code")
          return
        }

        const response = await authAPI.verifyCode({
          user_id: userId,
          verification_code: otpCode,
        })

        if (response.success) {
          setStep("success")
          setTimeout(() => {
            router.push("/dashboard")
          }, 1000)
        } else {
          setError(response.message || "Invalid verification code")
        }
      } else if (step === "forgot-password") {
        // Request password reset
        // Note: This endpoint needs to be implemented in the backend
        setStep("reset-password")
      } else if (step === "reset-password") {
        // Reset password with code
        // Note: This endpoint needs to be implemented in the backend
        setStep("success")
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode)
    setStep(newMode)
    setError(null)
    setUserId(null)
    setFormData({ email: "", password: "", confirmPassword: "", name: "", otp: ["", "", "", "", "", ""] })
  }

  const resetToLogin = () => {
    setStep("login")
    setMode("login")
    setError(null)
    setUserId(null)
    setFormData({ email: "", password: "", confirmPassword: "", name: "", otp: ["", "", "", "", "", ""] })
  }

  const goToForgotPassword = () => {
    setStep("forgot-password")
    setError(null)
    setFormData((prev) => ({ ...prev, password: "", confirmPassword: "", name: "", otp: ["", "", "", "", "", ""] }))
  }

  const getCardHeight = () => {
    switch (step) {
      case "login":
        return "h-[480px]"
      case "signup":
        return "h-[680px]"
      case "forgot-password":
        return "h-[380px]"
      case "reset-password":
        return "h-[520px]"
      case "otp":
        return "h-[380px]"
      case "success":
        return "h-[320px]"
      default:
        return "h-[480px]"
    }
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const isSignupValid =
    step === "signup" &&
    formData.name &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    passwordRequirements.every((req) => req.test(formData.password))

  return (
    <div className={`w-[450px] max-w-[450px] transition-all duration-700 ease-out ${getCardHeight()}`}>
      <div className="relative h-full">
        {/* Glass morphism card */}
        <div className="absolute inset-0 bg-white/10 dark:bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/20 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-transparent dark:from-white/10 dark:via-transparent dark:to-transparent rounded-3xl" />
        </div>

        {/* Content */}
        <div className="relative h-full p-8 flex flex-col">
          {step === "login" && (
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold text-foreground dark:text-white">Welcome Back</h1>
                <p className="text-foreground/70 dark:text-white/70">Sign in to your account</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground/90 dark:text-white/90">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 dark:text-white/50 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-foreground/5 dark:bg-white/10 border-foreground/20 dark:border-white/20 text-foreground dark:text-white placeholder:text-foreground/50 dark:placeholder:text-white/50 focus:border-foreground/40 dark:focus:border-white/40 focus:ring-foreground/20 dark:focus:ring-white/20"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground/90 dark:text-white/90">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 dark:text-white/50 w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 bg-foreground/5 dark:bg-white/10 border-foreground/20 dark:border-white/20 text-foreground dark:text-white placeholder:text-foreground/50 dark:placeholder:text-white/50 focus:border-foreground/40 dark:focus:border-white/40 focus:ring-foreground/20 dark:focus:ring-white/20"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50 dark:text-white/50 hover:text-foreground/70 dark:hover:text-white/70"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={goToForgotPassword}
                    className="text-foreground/70 dark:text-white/70 hover:text-foreground dark:hover:text-white text-sm transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-foreground/10 dark:bg-white/20 hover:bg-foreground/20 dark:hover:bg-white/30 text-foreground dark:text-white border border-foreground/30 dark:border-white/30 hover:border-foreground/40 dark:hover:border-white/40 h-11 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="text-center">
                <button
                  onClick={() => switchMode("signup")}
                  className="text-foreground/70 dark:text-white/70 hover:text-foreground dark:hover:text-white text-sm transition-colors"
                >
                  {"Don't have an account? Sign up"}
                </button>
              </div>
            </div>
          )}

          {step === "signup" && (
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold text-foreground dark:text-white">Create Account</h1>
                <p className="text-foreground/70 dark:text-white/70">Join us today</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground/90 dark:text-white/90">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 dark:text-white/50 w-4 h-4" />
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-10 bg-foreground/5 dark:bg-white/10 border-foreground/20 dark:border-white/20 text-foreground dark:text-white placeholder:text-foreground/50 dark:placeholder:text-white/50 focus:border-foreground/40 dark:focus:border-white/40 focus:ring-foreground/20 dark:focus:ring-white/20"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-foreground/90 dark:text-white/90">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 dark:text-white/50 w-4 h-4" />
                    <Input
                      id="signup-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-foreground/5 dark:bg-white/10 border-foreground/20 dark:border-white/20 text-foreground dark:text-white placeholder:text-foreground/50 dark:placeholder:text-white/50 focus:border-foreground/40 dark:focus:border-white/40 focus:ring-foreground/20 dark:focus:ring-white/20"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-foreground/90 dark:text-white/90">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 dark:text-white/50 w-4 h-4" />
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 bg-foreground/5 dark:bg-white/10 border-foreground/20 dark:border-white/20 text-foreground dark:text-white placeholder:text-foreground/50 dark:placeholder:text-white/50 focus:border-foreground/40 dark:focus:border-white/40 focus:ring-foreground/20 dark:focus:ring-white/20"
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50 dark:text-white/50 hover:text-foreground/70 dark:hover:text-white/70"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {formData.password && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-foreground/60 dark:text-white/60">Password strength</span>
                        <span
                          className={`text-xs font-medium ${
                            passwordStrength.strength === 100
                              ? "text-foreground/90 dark:text-white/90"
                              : passwordStrength.strength >= 75
                                ? "text-foreground/80 dark:text-white/80"
                                : passwordStrength.strength >= 50
                                  ? "text-foreground/70 dark:text-white/70"
                                  : "text-foreground/50 dark:text-white/50"
                          }`}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full bg-foreground/10 dark:bg-white/10 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        />
                      </div>
                      <div className="space-y-1">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                req.test(formData.password) ? "bg-foreground/80 dark:bg-white/80" : "bg-foreground/20 dark:bg-white/20"
                              }`}
                            />
                            <span
                              className={`text-xs ${req.test(formData.password) ? "text-foreground/80 dark:text-white/80" : "text-foreground/40 dark:text-white/40"}`}
                            >
                              {req.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-foreground/90 dark:text-white/90">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 dark:text-white/50 w-4 h-4" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10 pr-10 bg-foreground/5 dark:bg-white/10 border-foreground/20 dark:border-white/20 text-foreground dark:text-white placeholder:text-foreground/50 dark:placeholder:text-white/50 focus:border-foreground/40 dark:focus:border-white/40 focus:ring-foreground/20 dark:focus:ring-white/20"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50 dark:text-white/50 hover:text-foreground/70 dark:hover:text-white/70"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-600 dark:text-red-400">Passwords do not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !isSignupValid}
                  className="w-full bg-foreground/10 dark:bg-white/20 hover:bg-foreground/20 dark:hover:bg-white/30 text-foreground dark:text-white border border-foreground/30 dark:border-white/30 hover:border-foreground/40 dark:hover:border-white/40 h-11 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm disabled:opacity-50"
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>

              <div className="text-center">
                <button
                  onClick={() => switchMode("login")}
                  className="text-foreground/70 dark:text-white/70 hover:text-foreground dark:hover:text-white text-sm transition-colors"
                >
                  Already have an account? Sign in
                </button>
              </div>
            </div>
          )}

          {step === "forgot-password" && (
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <button
                onClick={resetToLogin}
                className="absolute top-6 left-6 text-foreground/70 dark:text-white/70 hover:text-foreground dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold text-foreground dark:text-white">Reset Password</h1>
                <p className="text-foreground/70 dark:text-white/70">Enter your email to receive reset instructions</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-foreground/90 dark:text-white/90">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 dark:text-white/50 w-4 h-4" />
                    <Input
                      id="reset-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-foreground/5 dark:bg-white/10 border-foreground/20 dark:border-white/20 text-foreground dark:text-white placeholder:text-foreground/50 dark:placeholder:text-white/50 focus:border-foreground/40 dark:focus:border-white/40 focus:ring-foreground/20 dark:focus:ring-white/20"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-foreground/10 dark:bg-white/20 hover:bg-foreground/20 dark:hover:bg-white/30 text-foreground dark:text-white border border-foreground/30 dark:border-white/30 hover:border-foreground/40 dark:hover:border-white/40 h-11 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </div>
          )}

          {step === "reset-password" && (
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <button
                onClick={() => setStep("forgot-password")}
                className="absolute top-6 left-6 text-foreground/70 dark:text-white/70 hover:text-foreground dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-foreground/10 dark:bg-white/20 backdrop-blur-sm border border-foreground/30 dark:border-white/30 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6 text-foreground dark:text-white" />
                </div>
                <h1 className="text-2xl font-semibold text-foreground dark:text-white">Create New Password</h1>
                <p className="text-foreground/70 dark:text-white/70">Enter your new password below</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-foreground/90 dark:text-white/90">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 dark:text-white/50 w-4 h-4" />
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 bg-foreground/5 dark:bg-white/10 border-foreground/20 dark:border-white/20 text-foreground dark:text-white placeholder:text-foreground/50 dark:placeholder:text-white/50 focus:border-foreground/40 dark:focus:border-white/40 focus:ring-foreground/20 dark:focus:ring-white/20"
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50 dark:text-white/50 hover:text-foreground/70 dark:hover:text-white/70"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-new-password" className="text-foreground/90 dark:text-white/90">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 dark:text-white/50 w-4 h-4" />
                    <Input
                      id="confirm-new-password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10 pr-10 bg-foreground/5 dark:bg-white/10 border-foreground/20 dark:border-white/20 text-foreground dark:text-white placeholder:text-foreground/50 dark:placeholder:text-white/50 focus:border-foreground/40 dark:focus:border-white/40 focus:ring-foreground/20 dark:focus:ring-white/20"
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50 dark:text-white/50 hover:text-foreground/70 dark:hover:text-white/70"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-600 dark:text-red-400">Passwords do not match</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-foreground/10 dark:bg-white/20 hover:bg-foreground/20 dark:hover:bg-white/30 text-foreground dark:text-white border border-foreground/30 dark:border-white/30 hover:border-foreground/40 dark:hover:border-white/40 h-11 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            </div>
          )}

          {step === "otp" && (
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <button
                onClick={() => setStep(mode)}
                className="absolute top-6 left-6 text-foreground/70 dark:text-white/70 hover:text-foreground dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold text-foreground dark:text-white">Verify Your Email</h1>
                <p className="text-foreground/70 dark:text-white/70">Enter the 6-digit code sent to</p>
                <p className="text-foreground dark:text-white font-medium">{formData.email}</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center space-x-3">
                  {formData.otp.map((digit, index) => (
                    <Input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-lg font-semibold bg-foreground/5 dark:bg-white/10 border-foreground/20 dark:border-white/20 text-foreground dark:text-white focus:border-foreground/40 dark:focus:border-white/40 focus:ring-foreground/20 dark:focus:ring-white/20 rounded-xl"
                      maxLength={1}
                    />
                  ))}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || formData.otp.some((digit) => !digit)}
                  className="w-full bg-foreground/10 dark:bg-white/20 hover:bg-foreground/20 dark:hover:bg-white/30 text-foreground dark:text-white border border-foreground/30 dark:border-white/30 hover:border-foreground/40 dark:hover:border-white/40 h-11 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm"
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
              </form>

              <div className="text-center">
                <button className="text-foreground/70 dark:text-white/70 hover:text-foreground dark:hover:text-white text-sm transition-colors">Resend code</button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex-1 flex flex-col justify-center items-center space-y-6">
              <button
                onClick={resetToLogin}
                className="absolute top-6 right-6 text-foreground/70 dark:text-white/70 hover:text-foreground dark:hover:text-white transition-colors p-1 rounded-full hover:bg-foreground/10 dark:hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 bg-foreground/10 dark:bg-white/20 backdrop-blur-sm border border-foreground/30 dark:border-white/30 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-foreground dark:text-white" />
              </div>

              <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold text-foreground dark:text-white">
                  {step === "success" && mode === "signup" ? "Welcome!" : "Success!"}
                </h1>
                <p className="text-foreground/70 dark:text-white/70">
                  {step === "success" && mode === "signup"
                    ? "Your account has been verified successfully"
                    : "Your password has been reset successfully"}
                </p>
              </div>

              <Button
                onClick={resetToLogin}
                className="w-full bg-foreground/10 dark:bg-white/20 hover:bg-foreground/20 dark:hover:bg-white/30 text-foreground dark:text-white border border-foreground/30 dark:border-white/30 hover:border-foreground/40 dark:hover:border-white/40 h-11 rounded-xl font-medium transition-all duration-200 backdrop-blur-sm"
              >
                Back to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
