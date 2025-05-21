
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { ROUTES } from '../lib/constants/routes';
 import { useTranslation } from 'react-i18next';

const AccessDenied = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <ShieldAlert aria-hidden="true" className="h-16 w-16 text-red-500 mx-auto mb-4" />

        <p className="text-gray-600 mb-6">
  {t('accessDenied.message')}
        </p>
        <Link
          to={ROUTES.HOME}
          className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
        >
          {t('accessDenied.returnHome')}
        </Link>
      </div>
    </div>
  );
};
export default AccessDenied;
