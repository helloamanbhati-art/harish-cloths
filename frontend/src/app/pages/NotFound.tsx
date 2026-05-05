import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl">404</h1>
        <h2 className="text-2xl">Page Not Found</h2>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button>
            <Home className="size-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
