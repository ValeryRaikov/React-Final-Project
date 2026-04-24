import Hero from '../hero/Hero';
import NewCollections from '../new-collections/NewCollections';
import Newsletter from '../newsletter/Newsletter';
import Offers from '../offers/Offers';
import Popular from '../popular/Popular';
import RecentlyViewed from '../recently-viewed/RecentlyViewed';

export default function Shop() {
    return (
        <>
            <Hero />
            <Popular />
            <Offers />
            <NewCollections />
            <RecentlyViewed />
            <Newsletter />
        </>
    );
}