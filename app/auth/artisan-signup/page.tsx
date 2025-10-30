// components/SignupForm.tsx
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Link from 'next/link';

interface FormData {
  shopName: string;
  shopDescription: string;
  email: string;
  password: string;
  profilePhoto: File | null;
  coverPhoto: File | null;
}

interface FormErrors {
  shopName?: string;
  shopDescription?: string;
  email?: string;
  password?: string;
}

export default function SignupForm() {
  const [formData, setFormData] = useState<FormData>({
    shopName: '',
    shopDescription: '',
    email: '',
    password: '',
    profilePhoto: null,
    coverPhoto: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string>('');
  const [coverPreview, setCoverPreview] = useState<string>('');

  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const coverPhotoRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.shopName.trim()) {
      newErrors.shopName = 'Shop name is required';
    }

    if (!formData.shopDescription.trim()) {
      newErrors.shopDescription = 'Shop description is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'profile') {
        setFormData(prev => ({ ...prev, profilePhoto: file }));
        const reader = new FileReader();
        reader.onload = (e) => setProfilePreview(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        setFormData(prev => ({ ...prev, coverPhoto: file }));
        const reader = new FileReader();
        reader.onload = (e) => setCoverPreview(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const removePhoto = (type: 'profile' | 'cover') => {
    if (type === 'profile') {
      setFormData(prev => ({ ...prev, profilePhoto: null }));
      setProfilePreview('');
      if (profilePhotoRef.current) profilePhotoRef.current.value = '';
    } else {
      setFormData(prev => ({ ...prev, coverPhoto: null }));
      setCoverPreview('');
      if (coverPhotoRef.current) coverPhotoRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically send the data to your backend
      console.log('Form data:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form after successful submission
      setFormData({
        shopName: '',
        shopDescription: '',
        email: '',
        password: '',
        profilePhoto: null,
        coverPhoto: null,
      });
      setProfilePreview('');
      setCoverPreview('');
      
      alert('Shop registered successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error registering shop. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your shop account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Shop Name */}
            <div>
              <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">
                Shop Name *
              </label>
              <div className="mt-1">
                <input
                  id="shopName"
                  name="shopName"
                  type="text"
                  required
                  value={formData.shopName}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.shopName ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your shop name"
                />
                {errors.shopName && (
                  <p className="mt-1 text-sm text-red-600">{errors.shopName}</p>
                )}
              </div>
            </div>

            {/* Shop Description */}
            <div>
              <label htmlFor="shopDescription" className="block text-sm font-medium text-gray-700">
                Shop Description *
              </label>
              <div className="mt-1">
                <textarea
                  id="shopDescription"
                  name="shopDescription"
                  rows={3}
                  required
                  value={formData.shopDescription}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.shopDescription ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe your shop..."
                />
                {errors.shopDescription && (
                  <p className="mt-1 text-sm text-red-600">{errors.shopDescription}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            {/* Profile Photo (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profile Photo (Optional)
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {profilePreview ? (
                    <div className="relative">
                      <img
                        className="h-16 w-16 rounded-full object-cover"
                        src={profilePreview}
                        alt="Profile preview"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto('profile')}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-sm">Photo</span>
                    </div>
                  )}
                </div>
                <div>
                  <input
                    ref={profilePhotoRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'profile')}
                    className="hidden"
                    id="profilePhoto"
                  />
                  <label
                    htmlFor="profilePhoto"
                    className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Choose photo
                  </label>
                </div>
              </div>
            </div>

            {/* Cover Photo (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cover Photo (Optional)
              </label>
              <div className="mt-1">
                {coverPreview ? (
                  <div className="relative">
                    <img
                      className="h-32 w-full object-cover rounded-md"
                      src={coverPreview}
                      alt="Cover preview"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto('cover')}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                    <input
                      ref={coverPhotoRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'cover')}
                      className="hidden"
                      id="coverPhoto"
                    />
                    <label
                      htmlFor="coverPhoto"
                      className="cursor-pointer text-sm text-gray-600 hover:text-gray-500"
                    >
                      <span>Upload a cover photo</span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Shop Account'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}