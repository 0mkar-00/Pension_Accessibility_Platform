import { useLanguage } from '../../features/regional-language/useLanguage';

const PersonalDetails = () => {
  const { translate } = useLanguage();

  return (
    <div>
      <h1>{translate('personalDetails')}</h1>
    </div>
  );
};

export default PersonalDetails;