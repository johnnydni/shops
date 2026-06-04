import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Grain } from './components/layout/Grain';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { BauhausLine } from './components/layout/BauhausLine';
import { ToastHost } from './components/ui/Toast';
import { HomePage } from './pages/HomePage';
import { SortimentPage } from './pages/SortimentPage';
import { NewsPage } from './pages/NewsPage';
import { EventsPage } from './pages/EventsPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { SuccessPage } from './pages/SuccessPage';
import { CancelPage } from './pages/CancelPage';
import { NotFoundPage } from './pages/NotFoundPage';

/**
 * Root component. Composes the shared chrome (grain, header, footer,
 * bauhaus stripe, toast host) once and routes pages into the middle.
 */
export function App() {
  return (
    <>
      <Grain />
      <SiteHeader />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sortiment" element={<SortimentPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/produkt/:slug" element={<ProductPage />} />
        <Route path="/warenkorb" element={<CartPage />} />
        <Route path="/bestellt" element={<SuccessPage />} />
        <Route path="/abbruch" element={<CancelPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SiteFooter />
      <BauhausLine />
      <ToastHost />
    </>
  );
}

/** Reset scroll on route change — without this React Router preserves position. */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}
