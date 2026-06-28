import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleCallback } from '@/utils/auth';
import { showError, showSuccess } from '@/utils/toast';
import { Loader2 } from 'lucide-react';

const Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      showError(`Authentication failed: ${error}`);
      navigate('/');
      return;
    }

    if (code) {
      handleCallback(code)
        .then((provider) => {
          showSuccess(`Successfully authenticated with ${provider === 'spotify' ? 'Spotify' : 'YouTube'}`);
          navigate('/');
        })
        .catch((err) => {
          console.error('OAuth Error:', err);
          showError('Failed to complete authentication. Please try again.');
          navigate('/');
        });
    } else {
      navigate('/');
    }
  }, [code, error, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm uppercase font-bold tracking-widest">Processing Authentication...</p>
      </div>
    </div>
  );
};

export default Callback;
