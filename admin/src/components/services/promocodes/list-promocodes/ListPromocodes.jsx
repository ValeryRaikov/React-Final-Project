import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { BASE_URL, multiplierToPercentage } from '../../utils';
import { useTranslation } from 'react-i18next';
import ActionButton from '../../../action-buttons/ActionButton';

import './ListPromocodes.css';

export default function ListPromocodes() {
    const [promocodes, setPromocodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { t } = useTranslation(['promocodes', 'common', 'others']);

    useEffect(() => {
        fetchPromocodes();
    }, []);

    // Function to fetch promocodes from the server
    const fetchPromocodes = async () => {
        try {
            const res = await fetch(`${BASE_URL}/all-promocodes`);
            const data = await res.json();

            if (!data.success) 
                throw new Error(data.message);

            setPromocodes(data.promocodes);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) 
        return <div className="list-promocode"><p className="loading-message">{t('promocodes:promocodesLoading')}</p></div>;

    if (error) 
        return <div className="list-promocode"><p className="error-message">{error}</p></div>;

    return (
        <div className="list-promocode">
            <h3>{t('promocodes:allPromocodes')}</h3>

            <div className="list-promocode-format-main">
                <p>{t('promocodes:code')}</p>
                <p>{t('promocodes:discountColumn')}</p>
                <p>{t('promocodes:expiresAtColumn')}</p>
                <p>{t('others:edit')}</p>
                <p>{t('others:delete')}</p>
            </div>

            <div className="list-promocode-all-items">
                {promocodes.length === 0 ? (
                    <p className="no-items-message">{t('promocodes:promocodesNotFound')}</p>
                ) : (
                    promocodes.map(promo => (
                        <div key={promo._id} className="list-promocode-format">
                            <p>{promo.code}</p>
                            <p>{multiplierToPercentage(promo.discount)}%</p> 
                            <p>{promo.expiresAt ? new Date(promo.expiresAt).toLocaleDateString() : 'No expiry'}</p>
                            <ActionButton
                                type="link"
                                to={`/update-promocode/${promo._id}`}
                                variant="edit"
                                title={t('others:edit')}
                                icon={<FontAwesomeIcon icon={faPencilAlt} />}
                            />

                            <ActionButton
                                type="link"
                                to={`/remove-promocode/${promo._id}`}
                                variant="delete"
                                title={t('others:delete')}
                                icon={<FontAwesomeIcon icon={faTrash} />}
                            />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}