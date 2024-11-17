'use client';

import React, { useState } from 'react';

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (response.ok) {
        console.log('Login successful, setting items...');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-100 to-gray-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-10 border border-gray-100">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-[#2C3E50]">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="text-[#E74C3C] text-sm text-center bg-[#E74C3C]/10 py-2 px-4 rounded-md">
              {error}
            </div>
          )}
          <div className="rounded-md space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2C3E50] mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#18BC9C] focus:border-[#18BC9C] focus:z-10 sm:text-sm shadow-sm"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2C3E50] mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#18BC9C] focus:border-[#18BC9C] focus:z-10 sm:text-sm shadow-sm"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Google reCAPTCHA component */}
          <div className="flex justify-center mt-6">
            <div className="g-recaptcha" data-sitekey="YOUR_SITE_KEY"></div>
          </div>

          <div>
            <button
              type="submit"
              className="mt-8 w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#18BC9C] hover:bg-[#18BC9C]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#18BC9C] shadow-md transition-colors duration-200"
            >
              Sign in
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/register" className="font-medium text-[#18BC9C] hover:text-[#18BC9C]/80">
              Register here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
} 