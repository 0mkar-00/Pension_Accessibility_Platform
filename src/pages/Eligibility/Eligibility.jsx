import { useLanguage } from '../../features/regional-language/useLanguage';

const Eligibility = () => {
  const { translate } = useLanguage();

  return (
    <div>
      <h1>{translate('eligibility')}</h1>
    </div>
  );
};

export default Eligibility;