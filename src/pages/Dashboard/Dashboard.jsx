import { useLanguage } from '../../features/regional-language/useLanguage';

const Dashboard = () => {
  const { translate } = useLanguage();

  return (
    <div>
      <h1>{translate('dashboard')}</h1>
    </div>
  );
};

export default Dashboard;