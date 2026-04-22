import { useTranslation } from 'react-i18next';
import './Company.css';
import logo from '../assets/logo.png';

export default function Company() {
    const { t } = useTranslation('about');

    return (
        <div className="company">
            <div className="company-header">
                <img src={logo} alt="" />
                <h2>{t('ourCompany')}</h2>
            </div>
            <div className="company-description">
            <p>{t('welcomeToShopify')}</p>
            <h3>{t('ourJourney')}</h3>
            <p>{t('foundedIn2020')}</p>
            <h3>{t('ourMission')}</h3>
            <p>{t('missionStatement')}</p>
            <h3>{t('ourValues')}</h3>
            <div className="company-list-display">
                <ol>
                    <li><span>{t('quality')}</span> {t('qualityDesc')}</li>
                    <li><span>{t('innovation')}</span> {t('innovationDesc')}</li>
                    <li><span>{t('sustainability')}</span> {t('sustainabilityDesc')}</li>
                    <li><span>{t('customerSatisfaction')}</span> {t('customerSatisfactionDesc')}</li>
                </ol>
            </div>
            <h3>{t('ourTeam')}</h3>
            <p>{t('teamDesc')}</p>
            <h3>{t('joinUsOnOurJourney')}</h3>
            <p>{t('joinUsDesc')}</p>
            <p>{t('thankYou')}</p>
            </div>        
        </div>
    );
}