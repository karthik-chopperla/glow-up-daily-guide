
import { Check, Brain, Droplet, Moon, Activity, BarChart3, Calendar } from 'lucide-react';

const features = [
  {
    icon: Check,
    title: "Daily health check-in",
    description: "Track your daily wellness with quick mood and health assessments",
    color: "bg-green-50 text-green-600"
  },
  {
    icon: Brain,
    title: "AI Chatbot for health/mood tips",
    description: "Get personalized wellness advice and mood support anytime",
    color: "bg-purple-50 text-purple-600"
  },
  {
    icon: Droplet,
    title: "Water & medication reminders",
    description: "Stay hydrated and never miss your medications with smart alerts",
    color: "bg-blue-50 text-blue-600"
  },
  {
    icon: Moon,
    title: "Sleep tracker",
    description: "Monitor your sleep patterns and improve your rest quality",
    color: "bg-indigo-50 text-indigo-600"
  },
  {
    icon: Activity,
    title: "Steps/activity log",
    description: "Keep track of your daily movement and fitness goals",
    color: "bg-orange-50 text-orange-600"
  },
  {
    icon: BarChart3,
    title: "Health stats dashboard",
    description: "Visualize your health data with beautiful charts and insights",
    color: "bg-emerald-50 text-emerald-600"
  },
  {
    icon: Calendar,
    title: "Weekly reports or insights",
    description: "Get comprehensive weekly summaries of your health journey",
    color: "bg-rose-50 text-rose-600"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-6">
            WellnessTracker
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your personal health companion for a better, healthier you. Track, monitor, and improve your wellness journey with AI-powered insights.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-white/40 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto shadow-lg border border-white/20">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to start your wellness journey?
            </h2>
            <p className="text-muted-foreground mb-6 text-lg">
              Join thousands of users who have transformed their health with our comprehensive tracking tools.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
              Get Started Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
