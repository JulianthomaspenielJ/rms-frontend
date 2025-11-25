import { useState, useRef, useEffect } from 'react';
import { Check, Mail, ArrowLeft } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BASE_URL from '../../utils/url';

export default function ConfirmationCodeScreen() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem('verificationEmail');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      // If no email in localStorage, redirect back to login
      navigate('/login');
    }
    // Focus first input on mount
    inputRefs.current[0]?.focus();
    
    // Cleanup function to remove the email from localStorage when component unmounts
    return () => {
      // We'll keep the email in localStorage until verification is complete
      // or user navigates away
    };
  }, [navigate]);

  useEffect(() => {
    // Check if code is complete
    setIsComplete(code.every(digit => digit !== ''));
  }, [code]);

  const handleInputChange = (index, value) => {
    // Only allow single digit
    if (value.length > 1) return;
    
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto advance to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6).split('');
        const newCode = [...code];
        digits.forEach((digit, i) => {
          if (i < 6) newCode[i] = digit;
        });
        setCode(newCode);
        
        // Focus next empty input or last input
        const nextIndex = Math.min(digits.length, 5);
        inputRefs.current[nextIndex]?.focus();
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isComplete) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const otp = code.join('');
      const response = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          otp: otp
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      // Clear the stored email on successful verification
      localStorage.removeItem('verificationEmail');
      
      setSuccess('Email verified successfully! Redirecting to login...');
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Verification error:', error);
      setError(error.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setError('');
      const response = await fetch(`${BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      // Reset form
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      setSuccess('A new verification code has been sent to your email.');
    } catch (error) {
      console.error('Resend error:', error);
      setError(error.message || 'Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button className="mb-8 flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Mail className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-2">
            Verify Your Email
          </h1>
          
          <p className="text-gray-600 text-center mb-8 leading-relaxed">
            Code has been sent to your registered email<br />
            <span className="font-semibold text-blue-600">{email}</span>
          </p>

          {/* Code Input */}
          <div className="space-y-8">
            <div className="flex justify-center gap-3">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all duration-200 
                    bg-blue-600 border-white text-white placeholder-white/50
                    focus:border-white focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white/50`}
                  placeholder="•"
                />
              ))}
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="text-red-500 text-sm text-center mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-500 text-sm text-center mb-4">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!isComplete || isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${
                isComplete && !isLoading
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              } disabled:transform-none`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Check className="w-5 h-5 mr-2" />
                  Verify Code
                </div>
              )}
            </button>
          </div>

          {/* Resend Code */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResend}
              className="text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200 underline underline-offset-2"
            >
              Resend Code
            </button>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-gray-500 text-center text-sm mt-6">
          Having trouble? Contact our support team for assistance.
        </p>
      </div>
    </div>
  );
}
