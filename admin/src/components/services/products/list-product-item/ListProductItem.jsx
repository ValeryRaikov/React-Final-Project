import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import ActionButton from '../../../action-buttons/ActionButton';

import '../ProductDisplay.css';

export default function ListProductItem({
    id,
    name,
    image,
    category,
    newPrice,
    oldPrice,
    onEdit,
    onDelete,
}) {
    const { t } = useTranslation('products');

    return (
        <div className="list-product-format-main list-product-format">
            <img src={image} alt="" className="list-product-product-icon" />
            <p>{name}</p>
            <p>${oldPrice}</p>
            <p>${newPrice}</p>
            <p>{t(`${category}`)}</p>
            <ActionButton
                variant="edit"
                title={t('others:edit')}
                icon={<FontAwesomeIcon icon={faPencilAlt} />}
                onClick={() => onEdit(id)}
            />

            <ActionButton
                variant="delete"
                title={t('others:delete')}
                icon={<FontAwesomeIcon icon={faTrash} />}
                onClick={() => onDelete(id)}
            />
        </div>
    );
}