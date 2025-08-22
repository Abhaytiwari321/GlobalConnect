import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto lg:mx-0 mb-6">
              <span className="text-white font-bold text-3xl">C</span>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-4">
              ConnectPro
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your professional network awaits. Connect, grow, and succeed together.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-emerald-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Build Your Network</h3>
                <p className="text-gray-600">Connect with professionals worldwide</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Discover Opportunities</h3>
                <p className="text-gray-600">Find your dream job or top talent</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Share & Learn</h3>
                <p className="text-gray-600">Exchange knowledge and insights</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div>
          {isLogin ? (
            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;