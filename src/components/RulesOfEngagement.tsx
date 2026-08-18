import { useTranslation } from 'react-i18next';
import { FiAlertOctagon, FiAward, FiHeart, FiShield } from 'react-icons/fi';
import { MdPostAdd } from 'react-icons/md';
import { useNavigate, useRevalidator } from 'react-router';
import { useAcceptRulesMutation } from '../features/api/userApi';
import './../css/Rules.css';
import Loading from './Loading';


const RulesOfEngagement = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {revalidate} = useRevalidator()

  const [acceptRules, { isLoading }] = useAcceptRulesMutation();

  const handleAgree = async () => {
    try {
      const response = await acceptRules().unwrap();

        if(response){
          revalidate();
          navigate('/landing')
        }
      
    } catch (err) {
      console.error("Failed to commit rules validation to backend", err);
    }
  };

  if(isLoading){
    return <Loading/>
  }

  return (
    <div className="rules-onboarding-screen">
      <div className="rules-onboarding-box">
        
        <div className="rules-hero-header">
          <FiShield className="rules-main-shield-icon" />
          <h2>{t('Rules.title')}</h2>
          <p>{t('Rules.subtitle')}</p>
        </div>

        <div className="rules-scrollable-stack">
          
          {/* Rule 1: Respect */}
          <div className="rule-card-row">
            <FiHeart className="rule-row-icon color-love" />
            <div className="rule-row-body">
              <h4>{t('Rules.respect_title')}</h4>
              <p>{t('Rules.respect_desc')}</p>
            </div>
          </div>

          {/* Rule 2: Hallmark Authenticity Rule */}
          <div className="rule-card-row hallmark-highlight">
            <FiAward className="rule-row-icon color-hallmark" />
            <div className="rule-row-body">
              <h4>{t('Rules.media_title')}</h4>
              <p>{t('Rules.media_desc')}</p>
            </div>
          </div>
              {/* Rule 3: Moments */}
          <div className="rule-card-row">
            <MdPostAdd className="rule-row-icon color-safe" />
            <div className="rule-row-body">
              <h4>{t('Rules.moment_title')}</h4>
              <p>{t('Rules.moment_desc')}</p>
            </div>
          </div>

          {/* Rule 4: Safety */}
          <div className="rule-card-row">
            <FiAlertOctagon className="rule-row-icon color-safe" />
            <div className="rule-row-body">
              <h4>{t('Rules.safety_title')}</h4>
              <p>{t('Rules.safety_desc')}</p>
            </div>
          </div>
        

        </div>

        <div className="rules-action-bar">
          <button 
            type="button" 
            className="rules-submit-confirmation-btn" 
            onClick={handleAgree}
            disabled={isLoading}
          >
            {isLoading ? "..." : t('Rules.btn_agree')}
          </button>
        </div>

      </div>
    </div>
  );
};

export default RulesOfEngagement;
