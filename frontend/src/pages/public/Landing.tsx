import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowRight, Users, CalendarDays, Megaphone, Search, Shield } from 'lucide-react';

export default function Landing() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-50/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Bannari Amman Institute of Technology
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 tracking-tight leading-tight">
              BIT Clubs &<br />
              <span className="text-primary-600">Communities</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Discover. Connect. Participate. — Your one-stop platform to explore college clubs,
              join communities, and stay updated with campus activities.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className="btn-primary text-base px-8 py-3"
                >
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary text-base px-8 py-3">
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/login" className="btn-secondary text-base px-8 py-3">
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-navy-900">Everything you need</h2>
            <p className="mt-3 text-gray-500 text-lg">
              A centralized platform for club management at BIT
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Search,
                title: 'Discover Clubs',
                desc: 'Browse and search through all active clubs and communities on campus.',
              },
              {
                icon: Users,
                title: 'Join & Connect',
                desc: 'Join clubs that interest you and connect with like-minded students.',
              },
              {
                icon: CalendarDays,
                title: 'Track Activities',
                desc: 'Stay updated with upcoming events, workshops, and competitions.',
              },
              {
                icon: Megaphone,
                title: 'Announcements',
                desc: 'Never miss important club announcements and updates.',
              },
            ].map((feature) => (
              <div key={feature.title} className="card p-6 text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-navy-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} BIT Clubs & Communities — Bannari Amman Institute of Technology
          </p>
        </div>
      </footer>
    </div>
  );
}
