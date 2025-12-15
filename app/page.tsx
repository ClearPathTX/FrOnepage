'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function Home() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...contactForm, formType: 'contact' })
      })

      if (response.ok) {
        alert('Message sent successfully! We\'ll get back to you soon.')
        setContactForm({ name: '', email: '', message: '' })
      } else {
        throw new Error('Failed to send')
      }
    } catch (error) {
      alert('Failed to send message. Please call us directly at (844) 950-1936')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main style={{ width: '100%' }}>
      {/* Header */}
      <header style={{
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: '#2d7a87',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <a href="#top">
            <Image
              src="/images/22.webp"
              alt="Forward Recovery Logo"
              width={64}
              height={64}
              style={{ width: '64px', height: '64px' }}
              priority
            />
          </a>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <a href="#about" style={{ color: 'white', fontWeight: 600 }}>About</a>
            <a href="#services" style={{ color: 'white', fontWeight: 600 }}>Services</a>
            <a href="#facilities" style={{ color: 'white', fontWeight: 600 }}>Facilities</a>
            <a href="#contact" style={{ color: 'white', fontWeight: 600 }}>Contact</a>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <a href="/quiz" style={{
              backgroundColor: 'white',
              color: '#2d7a87',
              padding: '0.5rem 1.5rem',
              borderRadius: '9999px',
              fontWeight: 600
            }}>
              Get Help
            </a>
            <a href="tel:+18449501936" style={{
              backgroundColor: 'transparent',
              color: 'white',
              padding: '0.5rem 1.5rem',
              borderRadius: '9999px',
              fontWeight: 600,
              border: '2px solid white'
            }}>
              Call Now
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="top" style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <Image
          src="/images/newhero.jpg"
          alt="Forward Recovery Hero"
          fill
          style={{ objectFit: 'cover' }}
          priority
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}></div>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 20,
          padding: '0 1.5rem'
        }}>
          <div style={{ textAlign: 'center', maxWidth: '48rem' }}>
            <h1 style={{
              color: 'white',
              fontSize: '3.5rem',
              fontWeight: 'bold',
              marginBottom: '1.5rem'
            }}>
              Forward Recovery
            </h1>
            <p style={{
              color: 'white',
              fontSize: '1.5rem',
              lineHeight: 1.6,
              marginBottom: '2rem'
            }}>
              Start Living Life the way you love with our substance abuse treatment facility
            </p>
            <a href="/quiz" style={{
              display: 'inline-block',
              backgroundColor: '#2d7a87',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '9999px',
              fontSize: '1.125rem',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
            }}>
              GET HELP NOW
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={{ backgroundColor: 'white', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <h2 style={{
            color: '#2d7a87',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            Find Solid Footing in Recovery
          </h2>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '3rem'
          }}>
            <div style={{ flex: '1 1 300px', minWidth: '300px' }}>
              <Image
                src="/images/image1.webp"
                alt="Forward Recovery Treatment Center"
                width={600}
                height={400}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '1rem',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                }}
              />
            </div>

            <div style={{ flex: '1 1 300px', minWidth: '300px' }}>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151', marginBottom: '1.5rem' }}>
                Are you tired of feeling alone? Powerless? Tired of the lies and the shame? Now is the time to get help for your addiction.
              </p>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151', marginBottom: '1.5rem' }}>
                At Forward Recovery, we treat adults of all ages with a full continuum of care, giving us the ability to begin your treatment wherever you are—whether you&apos;re still using, have attended treatment before and are ready to try again or simply need outpatient support.
              </p>
              <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151', marginBottom: '2rem' }}>
                We can help you heal from opioid addiction, alcohol abuse or from any other substance that&apos;s causing problems in your life.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="#contact" style={{
                  backgroundColor: '#2d7a87',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '9999px',
                  fontWeight: 600
                }}>
                  Contact Us
                </a>
                <a href="tel:+18449501936" style={{
                  border: '2px solid #2d7a87',
                  color: '#2d7a87',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '9999px',
                  fontWeight: 600
                }}>
                  (844) 950-1936
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{ backgroundColor: '#f3f4f6', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <h2 style={{
            color: '#2d7a87',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            We Are Here For You
          </h2>
          <p style={{
            color: '#6b7280',
            fontSize: '1.25rem',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            What we offer
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ color: '#2d7a87', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Our Facilities
              </h3>
              <p style={{ color: '#374151', lineHeight: 1.8 }}>
                Forward Recovery offers a peaceful environment to focus on your recovery. Our modern facilities provide a comfortable setting where you can heal and grow.
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ color: '#2d7a87', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Real People, Real Expertise
              </h3>
              <p style={{ color: '#374151', lineHeight: 1.8 }}>
                Our well-rounded team of clinicians and support staff brings decades of combined experience to the table. Addiction rehab is what we do, and we do it well.
              </p>
            </div>

            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '1rem',
              textAlign: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.08)'
            }}>
              <h3 style={{ color: '#2d7a87', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                Helping You To Heal
              </h3>
              <p style={{ color: '#374151', lineHeight: 1.8 }}>
                We don&apos;t use outdated treatment methods or tolerate shaming. Addiction is a medical disorder, not a personal shortcoming. Healing usually requires help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance Section */}
      <section style={{ backgroundColor: 'white', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '896px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            color: '#2d7a87',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem'
          }}>
            We Work With Most Major Insurance Providers
          </h2>
          <p style={{ fontSize: '1.125rem', lineHeight: 1.8, color: '#374151' }}>
            Want to take the leap into recovery, but worried about the treatment expenses? Forward Recovery helps you get the treatment you need. We work with AmeriHealth, Exclusive Care, Magellan, ValueOptions, Medical Mutual, ComPsych, MultiPlan, Cigna, and many more insurance providers.
          </p>
        </div>
      </section>

      {/* Facilities/Programs Section */}
      <section id="facilities" style={{ position: 'relative', padding: '5rem 1.5rem', minHeight: '600px' }}>
        <Image
          src="/images/image2.jpg"
          alt="Facilities Background"
          fill
          style={{ objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.7)'
        }}></div>

        <div style={{ position: 'relative', zIndex: 10, maxWidth: '1152px', margin: '0 auto' }}>
          <h2 style={{
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: 600,
            textAlign: 'center',
            marginBottom: '0.5rem'
          }}>
            Facilities
          </h2>
          <h3 style={{
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            Forward Recovery&apos;s Continuum of Care
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}>
            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                Detox
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.7 }}>
                Unlike alcohol, drugs can remain in the system for days and in some cases, even months after being taken.
              </p>
            </div>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                Residential Treatment
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.7 }}>
                Live on property in a supported, trigger-free environment with expert staff at our residential rehab center.
              </p>
            </div>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                Outpatient Treatment
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.7 }}>
                Our outpatient program offers therapy on a flexible schedule and encourages increasing independence as you learn.
              </p>
            </div>

            <div style={{
              backgroundColor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h4 style={{ color: 'white', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                Aftercare
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.7 }}>
                Recovery doesn&apos;t end once you&apos;ve graduated from treatment. We offer ongoing support, and we&apos;re always here when you need us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={{ backgroundColor: 'white', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <p style={{ color: '#6b7280', fontSize: '1.125rem', textAlign: 'center', marginBottom: '0.5rem' }}>
            Talk to Us
          </p>
          <h2 style={{
            color: '#2d7a87',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '3rem'
          }}>
            Get In Touch
          </h2>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3rem' }}>
            <div style={{ flex: '1 1 280px', minWidth: '280px' }}>
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ color: '#2d7a87', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Our Phone
                </h4>
                <a href="tel:+18449501936" style={{ color: '#374151', fontSize: '1.125rem' }}>
                  (844) 950-1936
                </a>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ color: '#2d7a87', fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  Our Email
                </h4>
                <a href="mailto:info@forwardrecovery.com" style={{ color: '#374151', fontSize: '1.125rem' }}>
                  info@forwardrecovery.com
                </a>
              </div>

            </div>

            <div style={{ flex: '2 1 300px', minWidth: '300px' }}>
              <form onSubmit={handleContactSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', color: '#374151', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#374151', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="Your email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#374151', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Message
                  </label>
                  <textarea
                    required
                    placeholder="Your message"
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: isSubmitting ? '#9ca3af' : '#2d7a87',
                    color: 'white',
                    padding: '0.75rem 2rem',
                    borderRadius: '9999px',
                    border: 'none',
                    fontWeight: 600,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#2d7a87', padding: '4rem 1.5rem', color: 'white' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            {/* Logo & About */}
            <div>
              <Image
                src="/images/22.webp"
                alt="Forward Recovery Logo"
                width={80}
                height={80}
                style={{ marginBottom: '1rem' }}
              />
              <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
                Premier substance abuse treatment facility, helping you find your path to recovery.
              </p>
            </div>


            {/* Contact */}
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Contact Us</h4>
              <a href="tel:+18449501936" style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', display: 'block', marginBottom: '1rem' }}>
                (844) 950-1936
              </a>
              <a href="mailto:info@forwardrecovery.com" style={{ color: 'white' }}>
                info@forwardrecovery.com
              </a>
            </div>

            {/* Accreditations */}
            <div>
              <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Accreditations</h4>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Image
                  src="/images/image3.png"
                  alt="Accreditation 1"
                  width={60}
                  height={60}
                  style={{ objectFit: 'contain', backgroundColor: 'white', borderRadius: '0.5rem', padding: '0.5rem' }}
                />
                <Image
                  src="/images/image4.webp"
                  alt="Accreditation 2"
                  width={60}
                  height={60}
                  style={{ objectFit: 'contain', backgroundColor: 'white', borderRadius: '0.5rem', padding: '0.5rem' }}
                />
                <Image
                  src="/images/image5.webp"
                  alt="Accreditation 3"
                  width={60}
                  height={60}
                  style={{ objectFit: 'contain', backgroundColor: 'white', borderRadius: '0.5rem', padding: '0.5rem' }}
                />
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '2rem',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.8)'
          }}>
            <p>&copy; {new Date().getFullYear()} Forward Recovery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
