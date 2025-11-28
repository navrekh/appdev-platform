import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Rocket, Zap, Smartphone, Code, Cloud, 
  Menu, X, ChevronRight, Check, Star, Download,
  MessageSquare, Layout, Settings, CreditCard,
  Play, Pause, XCircle, CheckCircle, Clock, Upload, ExternalLink
} from 'lucide-react';

// ============================================
// LANDING PAGE
// ============================================

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    { icon: Sparkles, title: "AI-Powered", desc: "Advanced AI understands your requirements" },
    { icon: Smartphone, title: "Live Preview", desc: "See your app as it's being built" },
    { icon: Code, title: "Full Backend", desc: "Complete API and database generated" },
    { icon: Zap, title: "Lightning Fast", desc: "From idea to working app in minutes" },
    { icon: Cloud, title: "Cloud Build", desc: "No Mac or Android Studio needed" },
    { icon: Rocket, title: "Auto Deploy", desc: "Direct to App Store & Play Store" }
  ];

  const pricing = [
    { 
      name: "Free Trial", 
      price: "Free", 
      credits: "5", 
      features: [
        "5 credits on signup",
        "Test the platform",
        "Android & iOS builds",
        "24/7 support"
      ]
    },
    { 
      name: "Pay As You Go", 
      price: "₹2,000", 
      credits: "100", 
      popular: true,
      features: [
        "100 credits",
        "No subscription",
        "All features included",
        "Template access",
        "Figma import",
        "Play Store publishing",
        "App Store publishing"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                AppDev
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Docs</a>
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-600">Features</a>
              <a href="#pricing" className="block text-gray-600">Pricing</a>
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Build Apps with{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Describe your app idea in plain English. Our AI generates, builds, and deploys it automatically.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <div className="w-full sm:w-auto px-6 py-3 bg-white rounded-lg border-2 border-blue-200 flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <input 
                  type="text" 
                  placeholder="Build me a food delivery app..."
                  className="outline-none text-gray-700 w-full sm:w-96"
                />
              </div>
              <button 
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Generate App
              </button>
            </div>

            <div className="flex flex-wrap gap-6 justify-center text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                No coding required
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Minutes not months
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                iOS + Android
              </div>
            </div>
          </motion.div>

          {/* Animated Phone Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16"
          >
            <div className="relative inline-block">
              <div className="w-[300px] h-[600px] bg-gray-900 rounded-[50px] p-3 shadow-2xl">
                <div className="w-full h-full bg-white rounded-[40px] overflow-hidden">
                  <div className="h-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center animate-pulse">
                        <Sparkles className="w-10 h-10 text-white" />
                      </div>
                      <p className="text-gray-700 font-medium">Your app<br />generating...</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <Rocket className="w-10 h-10 text-white" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Everything You Need to Build Amazing Apps
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-gray-600 text-center mb-16">Pay as you go with credits. No subscriptions.</p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricing.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`bg-white rounded-2xl p-8 ${plan.popular ? 'border-4 border-blue-600 shadow-2xl scale-105' : 'border border-gray-200 shadow-lg'}`}
              >
                {plan.popular && (
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <div className="text-sm text-gray-600 mt-1">
                    {plan.credits} credits
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => navigate('/dashboard')}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg' 
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Build Your App?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of developers building amazing apps with AI
          </p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-2xl transition-all"
          >
            Start Building Now
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>© 2025 AppDev Platform. Powered by AI.</p>
        </div>
      </footer>
    </div>
  );
};

// ============================================
// DASHBOARD PAGE
// ============================================

const Dashboard = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      text: 'Hi! 👋 I\'m your AI app builder. Tell me what kind of app you want to create, and I\'ll build it step by step while you watch!',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [buildStage, setBuildStage] = useState('idle'); // idle, planning, designing, coding, building
  const [currentScreen, setCurrentScreen] = useState('idle');
  const [appFeatures, setAppFeatures] = useState([]);

  const conversationFlow = {
    initial: {
      question: "What kind of app would you like to build?",
      follow: "idea"
    },
    idea: {
      responses: [
        "Great idea! 🚀 Let me clarify a few things...",
        "What features would you like? For example:",
        "• User login and registration?",
        "• Payment integration?",
        "• Real-time notifications?",
        "• Maps and location?",
        "Tell me which features you need!"
      ],
      follow: "features"
    },
    features: {
      responses: [
        "Perfect! I'll include those features. 📝",
        "What should we call your app?"
      ],
      follow: "name"
    },
    name: {
      responses: [
        "Love it! {name} it is! ✨",
        "Now, what's your preferred color theme?",
        "• Modern Blue",
        "• Vibrant Orange", 
        "• Clean White",
        "• Dark Mode",
        "Or describe your own!"
      ],
      follow: "theme"
    },
    theme: {
      responses: [
        "Great choice! 🎨",
        "Alright, I have everything I need!",
        "Let me start building {name} for you...",
        "",
        "I'll show you each screen as I create it in the preview on the right. Watch the magic happen! ✨"
      ],
      follow: "build"
    }
  };

  const previewScreens = {
    idle: {
      icon: '✨',
      title: 'Ready to Build',
      subtitle: 'Start a conversation',
      gradient: 'from-blue-50 to-indigo-50'
    },
    planning: {
      icon: '🧠',
      title: 'AI Planning',
      subtitle: 'Analyzing requirements...',
      gradient: 'from-purple-50 to-pink-50',
      progress: 0
    },
    login: {
      component: (app, setScreen) => (
        <div className="p-6 space-y-4">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
              FE
            </div>
            <h2 className="text-2xl font-bold">Welcome Back!</h2>
            <p className="text-gray-500 text-sm">Sign in to continue</p>
          </div>
          <input 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-colors" 
            placeholder="Email"
            defaultValue="demo@example.com"
          />
          <input 
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none transition-colors" 
            placeholder="Password" 
            type="password"
            defaultValue="••••••••"
          />
          <button 
            onClick={() => {
              // Simulate login animation
              const btn = event.target;
              btn.textContent = 'Signing in...';
              setTimeout(() => {
                setScreen('home');
              }, 1000);
            }}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            Sign In
          </button>
          <p className="text-center text-sm text-gray-500">
            Don't have an account? <span onClick={() => setScreen('register')} className="text-blue-600 font-semibold cursor-pointer hover:underline">Sign Up</span>
          </p>
        </div>
      )
    },
    register: {
      component: (app, setScreen) => (
        <div className="p-6 space-y-4">
          <div className="mb-6">
            <button onClick={() => setScreen('login')} className="text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back
            </button>
          </div>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">Create Account</h2>
            <p className="text-gray-500 text-sm">Join us today!</p>
          </div>
          <input className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none" placeholder="Full Name" />
          <input className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none" placeholder="Email" />
          <input className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 outline-none" placeholder="Password" type="password" />
          <button 
            onClick={() => {
              event.target.textContent = 'Creating account...';
              setTimeout(() => setScreen('home'), 1000);
            }}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            Sign Up
          </button>
        </div>
      )
    },
    home: {
      component: (app, setScreen) => (
        <div className="flex flex-col h-full">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-bold">FoodExpress</h1>
              <button onClick={() => setScreen('profile')} className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 active:scale-95 transition-all cursor-pointer">
                👤
              </button>
            </div>
            <input className="w-full px-4 py-2 rounded-lg text-gray-800" placeholder="Search restaurants..." />
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-auto">
            {[
              { name: 'Pizza Palace', time: '30 min', rating: '4.5', cuisine: '🍕 Pizza' },
              { name: 'Burger King', time: '25 min', rating: '4.3', cuisine: '🍔 Burgers' },
              { name: 'Sushi World', time: '40 min', rating: '4.8', cuisine: '🍱 Japanese' },
              { name: 'Taco Bell', time: '20 min', rating: '4.2', cuisine: '🌮 Mexican' }
            ].map((restaurant, i) => (
              <div 
                key={i} 
                onClick={() => setScreen('detail')}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md active:scale-98 transition-all cursor-pointer"
              >
                <div className="flex gap-3">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center text-3xl">
                    {restaurant.cuisine.split(' ')[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{restaurant.name}</h3>
                    <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                      <span>⭐ {restaurant.rating}</span>
                      <span>🕐 {restaurant.time}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 self-center" />
                </div>
              </div>
            ))}
          </div>
          <div className="border-t bg-white p-2 flex justify-around">
            <button onClick={() => setScreen('home')} className="flex-1 py-2 text-blue-600 font-medium">Home</button>
            <button onClick={() => setScreen('cart')} className="flex-1 py-2 text-gray-500">Cart</button>
            <button onClick={() => setScreen('orders')} className="flex-1 py-2 text-gray-500">Orders</button>
            <button onClick={() => setScreen('profile')} className="flex-1 py-2 text-gray-500">Profile</button>
          </div>
        </div>
      )
    },
    detail: {
      component: (app, setScreen) => (
        <div className="flex flex-col h-full">
          <div className="relative h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-6xl">
            🍕
            <button 
              onClick={() => setScreen('home')} 
              className="absolute top-4 left-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white active:scale-95 transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <h2 className="text-2xl font-bold mb-2">Pizza Palace</h2>
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
              <span>⭐ 4.5 (234 reviews)</span>
              <span>🕐 30 min</span>
            </div>
            <p className="text-gray-600 mb-6">Delicious pizzas made with fresh ingredients. Free delivery on orders over $20.</p>
            
            <h3 className="font-bold mb-3">Popular Items</h3>
            <div className="space-y-3">
              {['Margherita Pizza', 'Pepperoni Special', 'Veggie Delight'].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-semibold">{item}</p>
                    <p className="text-sm text-gray-500">₹{(i + 2) * 99}</p>
                  </div>
                  <button 
                    onClick={() => {
                      event.target.textContent = '✓ Added';
                      setTimeout(() => {
                        event.target.textContent = '+ Add';
                      }, 1500);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t bg-white">
            <button 
              onClick={() => setScreen('cart')}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              View Cart • ₹598
            </button>
          </div>
        </div>
      )
    },
    cart: {
      component: (app, setScreen) => (
        <div className="flex flex-col h-full">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center gap-3">
            <button onClick={() => setScreen('home')} className="hover:bg-white/20 p-1 rounded active:scale-95 transition-all cursor-pointer">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <h1 className="text-xl font-bold">Cart</h1>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            {[
              { name: 'Margherita Pizza', qty: 2, price: 199 },
              { name: 'Pepperoni Special', qty: 1, price: 299 }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm mb-3">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">₹{item.price} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition-all cursor-pointer">-</button>
                  <span className="font-semibold">{item.qty}</span>
                  <button className="w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition-all cursor-pointer">+</button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t bg-white space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹697</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>₹697</span>
            </div>
            <button 
              onClick={() => setScreen('checkout')}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg active:scale-95 transition-all cursor-pointer mt-2"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )
    },
    checkout: {
      component: (app, setScreen) => (
        <div className="flex flex-col h-full">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center gap-3">
            <button onClick={() => setScreen('cart')} className="hover:bg-white/20 p-1 rounded active:scale-95 transition-all cursor-pointer">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            <h1 className="text-xl font-bold">Checkout</h1>
          </div>
          <div className="flex-1 p-4 overflow-auto space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-3">Delivery Address</h3>
              <input className="w-full px-3 py-2 border rounded-lg mb-2" placeholder="Street Address" />
              <input className="w-full px-3 py-2 border rounded-lg" placeholder="City, State, ZIP" />
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <h3 className="font-semibold mb-3">Payment Method</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="payment" defaultChecked />
                  <span>💳 Credit/Debit Card</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="payment" />
                  <span>📱 UPI</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="payment" />
                  <span>💵 Cash on Delivery</span>
                </label>
              </div>
            </div>
          </div>
          <div className="p-4 border-t bg-white">
            <button 
              onClick={() => {
                event.target.textContent = 'Processing...';
                setTimeout(() => setScreen('success'), 1500);
              }}
              className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              Place Order • ₹697
            </button>
          </div>
        </div>
      )
    },
    success: {
      component: (app, setScreen) => (
        <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="text-center">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-bounce">
              ✓
            </div>
            <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
            <p className="text-gray-600 mb-6">Your food will arrive in 30 minutes</p>
            <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
              <p className="text-sm text-gray-500 mb-1">Order ID</p>
              <p className="font-mono font-bold">#FE2025{Math.floor(Math.random() * 1000)}</p>
            </div>
            <button 
              onClick={() => setScreen('orders')}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
            >
              Track Order
            </button>
            <button 
              onClick={() => setScreen('home')}
              className="block w-full mt-3 py-2 text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      )
    },
    orders: {
      component: (app, setScreen) => (
        <div className="flex flex-col h-full">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <h1 className="text-xl font-bold">My Orders</h1>
          </div>
          <div className="flex-1 p-4 space-y-3 overflow-auto">
            {[
              { id: 'FE2025789', restaurant: 'Pizza Palace', status: 'Delivered', time: '2 days ago' },
              { id: 'FE2025456', restaurant: 'Burger King', status: 'Delivered', time: '5 days ago' },
              { id: 'FE2025123', restaurant: 'Sushi World', status: 'Delivered', time: '1 week ago' }
            ].map((order, i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow-sm border cursor-pointer hover:shadow-md active:scale-98 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{order.restaurant}</p>
                    <p className="text-xs text-gray-500 font-mono">#{order.id}</p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">{order.status}</span>
                </div>
                <p className="text-sm text-gray-500">{order.time}</p>
              </div>
            ))}
          </div>
          <div className="border-t bg-white p-2 flex justify-around">
            <button onClick={() => setScreen('home')} className="flex-1 py-2 text-gray-500">Home</button>
            <button onClick={() => setScreen('cart')} className="flex-1 py-2 text-gray-500">Cart</button>
            <button onClick={() => setScreen('orders')} className="flex-1 py-2 text-blue-600 font-medium">Orders</button>
            <button onClick={() => setScreen('profile')} className="flex-1 py-2 text-gray-500">Profile</button>
          </div>
        </div>
      )
    },
    profile: {
      component: (app, setScreen) => (
        <div className="flex flex-col h-full">
          <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="text-center">
              <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                👤
              </div>
              <h2 className="text-xl font-bold">John Doe</h2>
              <p className="text-blue-100 text-sm">john@example.com</p>
            </div>
          </div>
          <div className="flex-1 p-4 space-y-2 overflow-auto">
            {[
              { icon: '✏️', label: 'Edit Profile', screen: 'editprofile' },
              { icon: '⚙️', label: 'Settings', screen: 'settings' },
              { icon: '🔔', label: 'Notifications', screen: 'notifications' },
              { icon: '❤️', label: 'Favorites', screen: 'favorites' },
              { icon: '❓', label: 'Help & Support', screen: 'help' },
              { icon: '🚪', label: 'Logout', screen: 'login' }
            ].map((item, i) => (
              <div 
                key={i}
                onClick={() => setScreen(item.screen)}
                className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md active:scale-98 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
          <div className="border-t bg-white p-2 flex justify-around">
            <button onClick={() => setScreen('home')} className="flex-1 py-2 text-gray-500">Home</button>
            <button onClick={() => setScreen('cart')} className="flex-1 py-2 text-gray-500">Cart</button>
            <button onClick={() => setScreen('orders')} className="flex-1 py-2 text-gray-500">Orders</button>
            <button onClick={() => setScreen('profile')} className="flex-1 py-2 text-blue-600 font-medium">Profile</button>
          </div>
        </div>
      )
    },
    building: {
      icon: '⚙️',
      title: 'Building APK',
      subtitle: 'Compiling your app...',
      gradient: 'from-green-50 to-emerald-50',
      progress: 75
    },
    complete: {
      icon: '🎉',
      title: 'App Ready!',
      subtitle: 'Download available',
      gradient: 'from-green-50 to-teal-50'
    }
  };

  const simulateConversation = async (userMessage, stage = 'idea') => {
    setIsTyping(true);
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const flow = conversationFlow[stage];
    if (!flow) return;

    // Add AI responses
    if (Array.isArray(flow.responses)) {
      for (let i = 0; i < flow.responses.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        const response = flow.responses[i].replace('{name}', userMessage);
        setMessages(prev => [...prev, {
          role: 'assistant',
          text: response,
          timestamp: new Date().toLocaleTimeString()
        }]);
      }
    }

    setIsTyping(false);

    // Start building process if at final stage
    if (flow.follow === 'build') {
      await startBuildingProcess(userMessage);
    }
  };

  const startBuildingProcess = async (appName) => {
    const buildSteps = [
      { 
        msg: '1️⃣ Creating login screen...', 
        screen: 'login',
        duration: 2000 
      },
      { 
        msg: '2️⃣ Designing home page...', 
        screen: 'home',
        duration: 2500 
      },
      { 
        msg: '3️⃣ Building user profile...', 
        screen: 'profile',
        duration: 2000 
      },
      { 
        msg: '4️⃣ Setting up navigation...', 
        screen: 'home',
        duration: 1500 
      },
      { 
        msg: '5️⃣ Generating backend APIs...', 
        screen: 'planning',
        duration: 3000 
      },
      { 
        msg: '6️⃣ Building Android APK...', 
        screen: 'building',
        duration: 4000 
      },
      { 
        msg: '7️⃣ Building iOS IPA...', 
        screen: 'building',
        duration: 4000 
      }
    ];

    for (const step of buildSteps) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: step.msg,
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true
      }]);
      
      setCurrentScreen(step.screen);
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }

    // Complete
    setCurrentScreen('complete');
    setMessages(prev => [...prev, {
      role: 'assistant',
      text: `✅ ${appName} is ready! Your app has been built successfully.\n\n📥 You can now download the APK and IPA files from the "My Apps" page.\n\n🎨 Want to make changes? Just tell me what you'd like to modify!`,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    setMessages(prev => [...prev, { 
      role: 'user', 
      text: userMessage,
      timestamp: new Date().toLocaleTimeString()
    }]);
    setInput('');
    
    // Determine conversation stage
    const messageCount = messages.filter(m => m.role === 'user').length;
    const stages = ['idea', 'features', 'name', 'theme'];
    const currentStage = stages[Math.min(messageCount, stages.length - 1)];
    
    await simulateConversation(userMessage, currentStage);
  };

  const renderPreview = () => {
    const screen = previewScreens[currentScreen] || previewScreens.idle;
    
    if (screen.component) {
      // For interactive screens, pass setCurrentScreen as second argument
      if (typeof screen.component === 'function') {
        return screen.component(null, setCurrentScreen);
      }
      return screen.component;
    }
    
    return (
      <div className={`h-full bg-gradient-to-br ${screen.gradient} flex flex-col items-center justify-center p-8`}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">{screen.icon}</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{screen.title}</h3>
          <p className="text-gray-600">{screen.subtitle}</p>
          {screen.progress !== undefined && (
            <div className="mt-6 w-48">
              <div className="w-full h-2 bg-white/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000"
                  style={{ width: `${screen.progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">{screen.progress}%</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">AppDev</span>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full" />
              <div>
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-gray-600">5 credits (Free)</p>
                <Link to="/" className="text-xs text-blue-600 hover:underline">
                  Buy more credits
                </Link>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg">
            <Layout className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/apps" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
            <Smartphone className="w-5 h-5" />
            <span>My Apps</span>
          </Link>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Link>
        </nav>

        <div className="pt-4 border-t text-sm text-gray-600">
          <div className="space-y-2">
            <div>• 12 Apps Created</div>
            <div>• 8 Successful</div>
            <div>• 2 In Progress</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold">AI App Builder</h1>
          <p className="text-gray-600">Chat with AI to build your app • Watch it being created live</p>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[70%] ${msg.isSystem ? 'max-w-full' : ''}`}>
                    <div className={`rounded-2xl px-4 py-3 ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' 
                        : msg.isSystem
                        ? 'bg-blue-50 text-blue-900 border-2 border-blue-200'
                        : 'bg-white shadow-md'
                    }`}>
                      <p className={`whitespace-pre-line ${msg.role === 'user' ? 'text-white' : msg.isSystem ? 'text-blue-900 font-medium' : 'text-gray-800'}`}>
                        {msg.text}
                      </p>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 px-1">{msg.timestamp}</p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      👤
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white shadow-md rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSend}
                  disabled={isTyping}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 font-semibold"
                >
                  Send
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">💡 Tip: Be specific about features, colors, and design preferences</p>
            </div>
          </div>

          {/* Phone Preview */}
          <div className="w-[400px] bg-white border-l border-gray-200 p-6 flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">Live Preview</h3>
              <p className="text-sm text-gray-600">Watch your app being built in real-time</p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <div className="relative">
                <div className="w-[300px] h-[600px] bg-gray-900 rounded-[50px] p-3 shadow-2xl">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-3xl z-10" />
                  <div className="w-full h-full bg-white rounded-[40px] overflow-hidden relative">
                    <div className="h-11 bg-white flex items-center justify-between px-6 text-xs border-b">
                      <span>9:41</span>
                      <div className="flex gap-1">
                        <span>📶</span>
                        <span>📡</span>
                        <span>🔋</span>
                      </div>
                    </div>
                    <div className="h-[calc(100%-44px)] overflow-hidden">
                      {renderPreview()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MY APPS PAGE
// ============================================

const MyAppsPage = () => {
  const [filter, setFilter] = useState('all');
  
  const apps = [
    {
      id: 1,
      name: 'Food Delivery App',
      icon: '🍔',
      status: 'ready',
      created: 'Nov 28, 2025',
      version: '1.2',
      builds: 3
    },
    {
      id: 2,
      name: 'E-commerce Store',
      icon: '🛍️',
      status: 'building',
      created: 'Nov 28, 2025',
      version: '1.0',
      builds: 1,
      progress: 45
    },
    {
      id: 3,
      name: 'Travel Booking',
      icon: '✈️',
      status: 'failed',
      created: 'Nov 27, 2025',
      version: '1.0',
      builds: 2
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'building': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'building': return <Clock className="w-4 h-4 animate-spin" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar (same as Dashboard) */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold">AppDev</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg">
            <Layout className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link to="/apps" className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg">
            <Smartphone className="w-5 h-5" />
            <span>My Apps</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Apps</h1>
              <p className="text-gray-600">Manage your generated applications</p>
            </div>
            <Link to="/dashboard">
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                New App
              </button>
            </Link>
          </div>

          {/* Filters */}
          <div className="flex gap-2 mb-6">
            {['all', 'ready', 'building', 'failed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Apps Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-3xl">
                    {app.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{app.name}</h3>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {getStatusIcon(app.status)}
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-4 space-y-1">
                  <div>Created: {app.created}</div>
                  <div>Version: {app.version}</div>
                  <div>Builds: {app.builds}</div>
                </div>

                {app.progress && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Building...</span>
                      <span>{app.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all"
                        style={{ width: `${app.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {app.status === 'ready' && (
                    <>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            // Simulate APK download
                            const link = document.createElement('a');
                            link.href = '#'; // Will be replaced with actual S3 URL
                            link.download = `${app.name.replace(/\s+/g, '-')}.apk`;
                            alert('APK download will start from your S3 bucket');
                          }}
                          className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Download APK
                        </button>
                        <button 
                          onClick={() => {
                            // Simulate IPA download
                            const link = document.createElement('a');
                            link.href = '#'; // Will be replaced with actual S3 URL
                            link.download = `${app.name.replace(/\s+/g, '-')}.ipa`;
                            alert('IPA download will start from your S3 bucket');
                          }}
                          className="flex-1 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                          <Download className="w-4 h-4" />
                          Download IPA
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            alert('This will open the Play Store publishing wizard. You\'ll need to connect your Play Console account.');
                          }}
                          className="flex-1 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                          <Upload className="w-4 h-4" />
                          Publish to Play Store
                        </button>
                        <button 
                          onClick={() => {
                            alert('This will open the App Store publishing wizard. You\'ll need to connect your App Store Connect account.');
                          }}
                          className="flex-1 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                          <Upload className="w-4 h-4" />
                          Publish to App Store
                        </button>
                      </div>
                      <button className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                        <Code className="w-4 h-4" />
                        Download Source Code
                      </button>
                    </>
                  )}
                  {app.status === 'building' && (
                    <button className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                      View Build Progress
                    </button>
                  )}
                  {app.status === 'failed' && (
                    <button className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium">
                      Retry Build
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN APP WITH ROUTING
// ============================================

function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/apps" element={<MyAppsPage />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
