import { Route } from 'react-router-dom';
import { Fragment } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { HomePage } from '../pages/HomePage';
import { HowItWorksPage } from '../pages/HowItWorksPage';
import { FeaturesPage } from '../pages/FeaturesPage';
import { TestimonialsPage } from '../pages/TestimonialsPage';
import { FAQPage } from '../pages/FAQPage';

export function PublicRoutes() {
  return (
    <Fragment>
      <Route
        path="/"
        element={
          <div className="min-h-screen">
            <Header />
            <HomePage />
            <Footer />
          </div>
        }
      />
      <Route
        path="/how-it-works"
        element={
          <div className="min-h-screen">
            <Header />
            <HowItWorksPage />
            <Footer />
          </div>
        }
      />
      <Route
        path="/features"
        element={
          <div className="min-h-screen">
            <Header />
            <FeaturesPage />
            <Footer />
          </div>
        }
      />
      <Route
        path="/testimonials"
        element={
          <div className="min-h-screen">
            <Header />
            <TestimonialsPage />
            <Footer />
          </div>
        }
      />
      <Route
        path="/faq"
        element={
          <div className="min-h-screen">
            <Header />
            <FAQPage />
            <Footer />
          </div>
        }
      />
    </Fragment>
  );
}