import { motion } from 'framer-motion';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import LoginForm from '../components/auth/LoginForm';

const pageEntrance = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeOut' },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <motion.main
        className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative"
        {...pageEntrance}
      >
        {/* Gradient Background Decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[-20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-blue-400/10 blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-10%] h-[350px] w-[350px] rounded-full bg-purple-400/10 blur-[100px]" />
        </div>

        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}
