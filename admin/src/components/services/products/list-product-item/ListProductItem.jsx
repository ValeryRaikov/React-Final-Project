import '../ProductDisplay.css';
import {useTranslation} from 'react-i18next';

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
    const { t } = useTranslation('common');

    return (
        <div className="list-product-format-main list-product-format">
            <img src={image} alt="" className="list-product-product-icon" />
            <p>{name}</p>
            <p>${oldPrice}</p>
            <p>${newPrice}</p>
            <p>{category}</p>
            <button className="edit-btn" onClick={() => onEdit(id)}>{t('edit')}</button>
            <button className="delete-btn" onClick={() => onDelete(id)}>{t('delete')}</button>
        </div>
    );
}