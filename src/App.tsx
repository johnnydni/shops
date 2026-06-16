import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Grain } from './components/layout/Grain';
import { SiteHeader } from './components/layout/SiteHeader';
import { SiteFooter } from './components/layout/SiteFooter';
import { BauhausLine } from './components/layout/BauhausLine';
import { ToastHost } from './components/ui/Toast';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { SortimentPage } from './pages/SortimentPage';
import { NewsPage } from './pages/NewsPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { EventDnaQuizPage } from './pages/EventDnaQuizPage';
import { EventBuyPage } from './pages/EventBuyPage';
import { EventSuccessPage } from './pages/EventSuccessPage';
import { EventCancelPage } from './pages/EventCancelPage';
import { EventTicketPage } from './pages/EventTicketPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { SuccessPage } from './pages/SuccessPage';
import { CancelPage } from './pages/CancelPage';
import { NotFoundPage } from './pages/NotFoundPage';

/**
 * Root component. Composes the shared chrome (grain, header, footer,
 * bauhaus stripe, toast host) once and routes pages into the middle.
 *
 * Two scroll-helpers live here:
 *  - ResetScrollOnRouteChange: jumps the window to top whenever the
 *    URL changes (React Router otherwise preserves the previous scroll
 *    position when navigating).
 *  - ScrollToTop (UI component): the floating bottom-left button the
 *    user clicks to scroll back up manually.
 */
export function App() {
  return (
    <>
      <Grain />
      <SiteHeader />
      <ResetScrollOnRouteChange />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sortiment" element={<SortimentPage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/events/:id/dna-quiz" element={<EventDnaQuizPage />} />
        <Route path="/event/buy/:eventId" element={<EventBuyPage />} />
        <Route path="/event/success" element={<EventSuccessPage />} />
        <Route path="/event/cancel" element={<EventCancelPage />} />
        <Route path="/event/ticket/:token" element={<EventTicketPage />} />
        <Route path="/produkt/:slug" element={<ProductPage />} />
        <Route path="/warenkorb" element={<CartPage />} />
        <Route path="/bestellt" element={<SuccessPage />} />
        <Route path="/abbruch" element={<CancelPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <SiteFooter />
      <BauhausLine />
      <ToastHost />
      <ScrollToTop />
    </>
  );
}

/** Reset scroll on route change — without this React Router preserves position. */
function ResetScrollOnRouteChange() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}
