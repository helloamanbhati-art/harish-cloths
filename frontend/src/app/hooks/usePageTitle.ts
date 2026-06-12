import { useEffect } from 'react';
import { useLocation } from 'react-router';

const pagesTitleMap: Record<string, string> = {
  '/': 'Harish Cloths',
  '/cart': 'Shopping Cart - Harish Cloths',
  '/checkout': 'Checkout - Harish Cloths',
  '/payment': 'Payment - Harish Cloths',
  '/order-success': 'Order Success - Harish Cloths',
  '/my-orders': 'My Orders - Harish Cloths',
  '/privacy-policy': 'Privacy Policy - Harish Cloths',
  '/product': 'Product - Harish Cloths',
};

export function usePageTitle(title?: string) {
  const location = useLocation();

  useEffect(() => {
    let pageTitle = 'Harish Cloths';

    if (title) {
      pageTitle = `${title} - Harish Cloths`;
    } else {
      // Check for exact path match
      pageTitle = pagesTitleMap[location.pathname] || 'Harish Cloths';

      // Check for dynamic routes like /product/:id
      if (location.pathname.startsWith('/product/')) {
        pageTitle = pagesTitleMap['/product'] || 'Product - Harish Cloths';
      }
      if (location.pathname.startsWith('/order/')) {
        pageTitle = 'Order Details - Harish Cloths';
      }
    }

    document.title = pageTitle;
  }, [location.pathname, title]);
}
