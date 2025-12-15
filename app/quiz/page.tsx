'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function QuizPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState({
    seekingHelpFor: '',
    primaryIssue: '',
    duration: '',
    frequency: '',
    withdrawal: '',
    previousTreatment: '',
    environment: '',
    mentalHealth: [] as string[],
    insuranceType: '',
    insuranceProvider: '',
    insuranceCardImage: null as string | null,
    recoveryReadiness: 5,
    dateOfBirth: '',
    urgency: '',
    fullName: '',
    phone: '',
    email: '',
    consentToContact: false,
  });

  type StepType = {
    type: string;
    headline?: string;
    subheadline?: string;
    question?: string;
    options?: string[];
    key?: string;
    placeholder?: string;
    accept?: string;
  };

  const steps: StepType[] = [
    {
      type: 'intro',
      headline: 'Free Confidential Assessment',
      subheadline: 'Answer a few quick questions so we can understand your situation and guide you toward the right level of care.',
    },
    {
      type: 'single-choice',
      question: 'Who are you seeking help for?',
      options: ['Myself', 'A family member', 'A friend', 'Someone else'],
      key: 'seekingHelpFor',
    },
    {
      type: 'single-choice',
      question: 'What kind of help are you looking for?',
      options: ['Alcohol', 'Opioids', 'Fentanyl', 'Benzodiazepines', 'Methamphetamine', 'Cocaine', 'Prescription medications', 'Mental health support', 'Dual diagnosis', 'Not sure yet'],
      key: 'primaryIssue',
    },
    {
      type: 'single-choice',
      question: 'When did this first become a concern?',
      options: ['In the past 30 days', '1-3 months ago', '3-12 months ago', 'Over a year ago'],
      key: 'duration',
    },
    {
      type: 'single-choice',
      question: 'How would you describe the current pattern of use?',
      options: ['Using every day', 'Several times a week', 'Mostly weekends', 'Occasional use', 'Not using currently'],
      key: 'frequency',
    },
    {
      type: 'single-choice',
      question: 'Have there been any withdrawal symptoms?',
      options: ['Yes', 'No', 'Not sure'],
      key: 'withdrawal',
    },
    {
      type: 'single-choice',
      question: 'Has treatment been attempted before?',
      options: ['Yes', 'No', 'Not sure'],
      key: 'previousTreatment',
    },
    {
      type: 'single-choice',
      question: 'Is the current living situation safe and stable?',
      options: ['Yes', 'No', 'Not sure'],
      key: 'environment',
    },
    {
      type: 'multi-choice',
      question: 'Are there any mental health concerns?',
      options: ['Anxiety', 'Depression', 'PTSD', 'Bipolar symptoms', 'Trauma related symptoms', 'Not sure', 'None'],
      key: 'mentalHealth',
    },
    {
      type: 'single-choice',
      question: 'What type of insurance do you have?',
      options: ['PPO', 'HMO', 'Medicaid', 'Medicare', 'No insurance', 'Not sure'],
      key: 'insuranceType',
    },
    {
      type: 'text-input',
      question: 'Who is your insurance provider?',
      key: 'insuranceProvider',
      placeholder: 'Enter your insurance provider',
    },
    {
      type: 'file-upload',
      question: 'Optional: Upload a photo of your insurance card',
      key: 'insuranceCardImage',
      accept: 'image/*',
    },
    {
      type: 'rating',
      question: 'How ready do you feel to start recovery?',
      key: 'recoveryReadiness',
    },
    {
      type: 'text-input',
      question: 'What is your date of birth?',
      key: 'dateOfBirth',
      placeholder: 'MM/DD/YYYY',
    },
    {
      type: 'single-choice',
      question: 'When are you hoping to get help?',
      options: ['Immediately', 'Within 24-48 hours', 'Within a week', 'Just gathering information'],
      key: 'urgency',
    },
    {
      type: 'contact-info',
      question: 'Where should we send your confidential assessment results?',
    },
    {
      type: 'final',
      headline: 'Thank You',
      subheadline: 'Your confidential assessment has been submitted. A treatment specialist will reach out shortly.',
    },
  ];

  const handleAnswer = (key: string, value: string | boolean | number) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleMultiChoice = (key: string, value: string) => {
    setAnswers((prev) => {
      const currentArray = prev[key as keyof typeof prev] as string[];
      const isSelected = currentArray.includes(value);
      return {
        ...prev,
        [key]: isSelected ? currentArray.filter((v) => v !== value) : [...currentArray, value],
      };
    });
  };

  const handleFileUpload = (key: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAnswers((prev) => ({
          ...prev,
          [key]: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submit-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      handleNext();
    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('There was an error submitting your assessment. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const step = steps[currentStep];
  const progress = currentStep > 0 && currentStep < steps.length - 1
    ? (currentStep / (steps.length - 2)) * 100
    : 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
      padding: '2rem 1rem'
    }}>
      {/* Header */}
      <div style={{ maxWidth: '800px', margin: '0 auto', marginBottom: '2rem' }}>
        <a href="/" style={{ display: 'inline-block' }}>
          <Image
            src="/images/22.webp"
            alt="Forward Recovery Logo"
            width={60}
            height={60}
          />
        </a>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Progress Bar */}
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: '#374151'
            }}>
              <span>Step {currentStep} of {steps.length - 2}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#d1d5db',
              borderRadius: '9999px'
            }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: '#2d7a87',
                borderRadius: '9999px',
                transition: 'width 0.3s'
              }} />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: 'white',
              borderRadius: '1rem',
              padding: '3rem',
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}
          >
            {/* Intro Step */}
            {step.type === 'intro' && (
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                  {step.headline}
                </h1>
                <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem', lineHeight: 1.6 }}>
                  {step.subheadline}
                </p>
                <button
                  onClick={handleNext}
                  style={{
                    padding: '1rem 2.5rem',
                    backgroundColor: '#2d7a87',
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Start Assessment
                </button>
              </div>
            )}

            {/* Single Choice */}
            {step.type === 'single-choice' && step.options && step.key && (
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
                  {step.question}
                </h2>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  {step.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(step.key!, option)}
                      style={{
                        padding: '1rem',
                        borderRadius: '0.75rem',
                        border: `2px solid ${(answers as Record<string, unknown>)[step.key!] === option ? '#2d7a87' : '#d1d5db'}`,
                        backgroundColor: (answers as Record<string, unknown>)[step.key!] === option ? '#e0f7fa' : 'white',
                        color: (answers as Record<string, unknown>)[step.key!] === option ? '#2d7a87' : '#374151',
                        fontWeight: 600,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  disabled={!(answers as Record<string, unknown>)[step.key!]}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: (answers as Record<string, unknown>)[step.key!] ? '#2d7a87' : '#9ca3af',
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: (answers as Record<string, unknown>)[step.key!] ? 'pointer' : 'not-allowed'
                  }}
                >
                  Continue →
                </button>
              </div>
            )}

            {/* Multi Choice */}
            {step.type === 'multi-choice' && step.options && step.key && (
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
                  {step.question}
                </h2>
                <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Select all that apply</p>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '2rem'
                }}>
                  {step.options.map((option) => {
                    const isSelected = ((answers as Record<string, unknown>)[step.key!] as string[])?.includes(option);
                    return (
                      <button
                        key={option}
                        onClick={() => handleMultiChoice(step.key!, option)}
                        style={{
                          padding: '1rem',
                          borderRadius: '0.75rem',
                          border: `2px solid ${isSelected ? '#2d7a87' : '#d1d5db'}`,
                          backgroundColor: isSelected ? '#e0f7fa' : 'white',
                          color: isSelected ? '#2d7a87' : '#374151',
                          fontWeight: 600,
                          fontSize: '1rem',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleNext}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: '#2d7a87',
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Continue →
                </button>
              </div>
            )}

            {/* Text Input */}
            {step.type === 'text-input' && step.key && (
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
                  {step.question}
                </h2>
                <input
                  type="text"
                  placeholder={step.placeholder}
                  value={(answers as Record<string, unknown>)[step.key] as string || ''}
                  onChange={(e) => handleAnswer(step.key!, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #d1d5db',
                    borderRadius: '0.75rem',
                    fontSize: '1rem',
                    marginBottom: '2rem'
                  }}
                />
                <button
                  onClick={handleNext}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: '#2d7a87',
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Continue →
                </button>
              </div>
            )}

            {/* File Upload */}
            {step.type === 'file-upload' && step.key && (
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
                  {step.question}
                </h2>
                <label
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '3rem 2rem',
                    border: '2px dashed #d1d5db',
                    borderRadius: '0.75rem',
                    cursor: 'pointer',
                    marginBottom: '2rem',
                    backgroundColor: answers.insuranceCardImage ? '#e0f7fa' : '#f9fafb',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="file"
                    accept={step.accept}
                    onChange={(e) => handleFileUpload(step.key!, e)}
                    style={{ display: 'none' }}
                  />
                  {answers.insuranceCardImage ? (
                    <div style={{ textAlign: 'center' }}>
                      <img
                        src={answers.insuranceCardImage}
                        alt="Insurance card preview"
                        style={{
                          maxWidth: '300px',
                          maxHeight: '200px',
                          borderRadius: '0.5rem',
                          marginBottom: '1rem'
                        }}
                      />
                      <p style={{ color: '#2d7a87', fontWeight: 600 }}>Image uploaded! Click to change</p>
                    </div>
                  ) : (
                    <>
                      <svg
                        style={{ width: '48px', height: '48px', color: '#9ca3af', marginBottom: '1rem' }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p style={{ color: '#374151', fontWeight: 600, marginBottom: '0.5rem' }}>
                        Click to upload insurance card
                      </p>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        PNG, JPG up to 10MB
                      </p>
                    </>
                  )}
                </label>
                <button
                  onClick={handleNext}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: '#2d7a87',
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {answers.insuranceCardImage ? 'Continue →' : 'Skip & Continue →'}
                </button>
              </div>
            )}

            {/* Rating */}
            {step.type === 'rating' && step.key && (
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
                  {step.question}
                </h2>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <button
                      key={value}
                      onClick={() => handleAnswer(step.key!, value)}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '0.5rem',
                        border: `2px solid ${(answers as Record<string, unknown>)[step.key!] === value ? '#2d7a87' : '#d1d5db'}`,
                        backgroundColor: (answers as Record<string, unknown>)[step.key!] === value ? '#2d7a87' : 'white',
                        color: (answers as Record<string, unknown>)[step.key!] === value ? 'white' : '#374151',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {value}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#6b7280', marginBottom: '2rem' }}>
                  <span>Not Ready</span>
                  <span>Completely Ready</span>
                </div>
                <button
                  onClick={handleNext}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: '#2d7a87',
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Continue →
                </button>
              </div>
            )}

            {/* Contact Info */}
            {step.type === 'contact-info' && (
              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '2rem' }}>
                  {step.question}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={answers.fullName}
                    onChange={(e) => handleAnswer('fullName', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '0.75rem',
                      fontSize: '1rem'
                    }}
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={answers.phone}
                    onChange={(e) => handleAnswer('phone', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '0.75rem',
                      fontSize: '1rem'
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={answers.email}
                    onChange={(e) => handleAnswer('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #d1d5db',
                      borderRadius: '0.75rem',
                      fontSize: '1rem'
                    }}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={answers.consentToContact}
                      onChange={(e) => handleAnswer('consentToContact', e.target.checked)}
                      style={{ width: '20px', height: '20px' }}
                    />
                    <span style={{ color: '#374151' }}>I consent to receive texts and calls</span>
                  </label>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!answers.fullName || !answers.phone || !answers.email || isSubmitting}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    backgroundColor: answers.fullName && answers.phone && answers.email ? '#2d7a87' : '#9ca3af',
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    borderRadius: '0.75rem',
                    border: 'none',
                    cursor: answers.fullName && answers.phone && answers.email ? 'pointer' : 'not-allowed'
                  }}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Assessment →'}
                </button>
              </div>
            )}

            {/* Final Step */}
            {step.type === 'final' && (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#2d7a87',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <span style={{ color: 'white', fontSize: '2.5rem' }}>✓</span>
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>
                  {step.headline}
                </h1>
                <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '2rem', lineHeight: 1.6 }}>
                  {step.subheadline}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
                  <a
                    href="tel:+18449501936"
                    style={{
                      padding: '1rem 2rem',
                      backgroundColor: '#2d7a87',
                      color: 'white',
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      borderRadius: '0.75rem',
                      textAlign: 'center'
                    }}
                  >
                    Call Now: (844) 950-1936
                  </a>
                  <a
                    href="/"
                    style={{
                      padding: '1rem 2rem',
                      border: '2px solid #2d7a87',
                      color: '#2d7a87',
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      borderRadius: '0.75rem',
                      textAlign: 'center'
                    }}
                  >
                    Back to Home
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
