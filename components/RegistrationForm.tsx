import React, { useState } from 'react';
import type { Attendee } from '../types';
import { generatePersonalizedMessage } from '../services/geminiService';

interface RegistrationFormProps {
  onFormSubmit: (attendee: Omit<Attendee, 'id' | 'submittedAt'>) => void;
}

const InputField: React.FC<{ id: string; label: string; type?: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean }> = ({ id, label, type = "text", value, onChange, required = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            required={required}
            className="block w-full px-4 py-3 bg-gray-100/70 border-2 border-transparent rounded-lg placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300 ease-in-out"
        />
    </div>
);

const TextAreaField: React.FC<{ id: string; label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; required?: boolean }> = ({ id, label, value, onChange, required = false }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
        </label>
        <textarea
            id={id}
            name={id}
            rows={4}
            value={value}
            onChange={onChange}
            required={required}
            className="block w-full px-4 py-3 bg-gray-100/70 border-2 border-transparent rounded-lg placeholder-gray-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-300 ease-in-out"
            placeholder="e.g., SEO strategy, social media management, content creation..."
        />
    </div>
);

const RegistrationForm: React.FC<RegistrationFormProps> = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    supportRequired: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmissionResult(null);
    try {
      const message = await generatePersonalizedMessage(formData);
      setSubmissionResult(message);
      onFormSubmit(formData);
      setFormData({
        name: '', profession: '', phone: '', email: '', address: '', city: '', supportRequired: '',
      });
    } catch (error) {
      console.error("Submission failed:", error);
      setSubmissionResult('<p class="text-red-500">Sorry, there was an error with your submission. Please try again.</p>');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSubmissionResult(null);
  }

  if (submissionResult) {
    return (
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-2xl mx-auto border border-white/30 animate-fade-in">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Thank You for Registering!</h2>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: submissionResult }} />
            <button
                onClick={resetForm}
                className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
                Register Another Attendee
            </button>
        </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl w-full max-w-2xl mx-auto border border-white/30">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Share your details</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField id="name" label="Full Name" value={formData.name} onChange={handleChange} required />
            <InputField id="profession" label="Profession / Job Title" value={formData.profession} onChange={handleChange} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField id="phone" label="Phone Number" type="tel" value={formData.phone} onChange={handleChange} required />
            <InputField id="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <InputField id="address" label="Address" value={formData.address} onChange={handleChange} />
        <InputField id="city" label="City" value={formData.city} onChange={handleChange} required />
        <TextAreaField id="supportRequired" label="What digital marketing support do you need?" value={formData.supportRequired} onChange={handleChange} required />
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:from-indigo-400 disabled:to-purple-400 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl"
          >
            {isLoading ? (
                <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Personalized Welcome...
                </div>
            ) : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;