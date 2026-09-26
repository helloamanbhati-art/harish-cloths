import { useEffect } from 'react';
import { useLocation } from 'react-router';

const pagesTitleMap: Record<string, string> = {
  '/': 'Siddhi Fashion',
  '/cart': 'Shopping Cart - Siddhi Fashion',
  '/checkout': 'Checkout - Siddhi Fashion',
  '/payment': 'Payment - Siddhi Fashion',
  '/order-success': 'Order Success - Siddhi Fashion',
  '/my-orders': 'My Orders - Siddhi Fashion',
  '/privacy-policy': 'Privacy Policy - Siddhi Fashion',
  '/product': 'Product - Siddhi Fashion',
};

export function usePageTitle(title?: string) {
  const location = useLocation();

  useEffect(() => {
    let pageTitle = 'Siddhi Fashion';

    if (title) {
      pageTitle = `${title} - Siddhi Fashion`;
    } else {
      // Check for exact path match
      pageTitle = pagesTitleMap[location.pathname] || 'Siddhi Fashion';

      // Check for dynamic routes like /product/:id
      if (location.pathname.startsWith('/product/')) {
        pageTitle = pagesTitleMap['/product'] || 'Product - Siddhi Fashion';
      }
      if (location.pathname.startsWith('/order/')) {
        pageTitle = 'Order Details - Siddhi Fashion';
      }
    }

    document.title = pageTitle;
  }, [location.pathname, title]);
}
