import { useLanguage } from '../../features/regional-language/useLanguage';

const Welcome = () => {
  const { translate } = useLanguage();

  return (
    <div>
      <h1>{translate('welcome')}</h1>
    </div>
  );
};

export default Welcome;