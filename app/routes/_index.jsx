import {defer} from '@shopify/remix-oxygen';
import {Await, useLoaderData, Link} from '@remix-run/react';
import {Suspense} from 'react';
import {Image, Money} from '@shopify/hydrogen';

/**
 * @type {MetaFunction}
 */
export const meta = () => {
  return [{title: 'Hydrogen | Home'}];
};

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({context}) {
  const {collections} = await storefront.query(FEATURED_COLLECTION_QUERY);
  const featuredCollection = collections.nodes[0];
  return defer({featuredCollection})
  /** nothing do do, since all i do is show tool tiles **/
}

export default function Homepage() {
  const data = useLoaderData();
  
  return (
    <div className="home">
      <BuildTools image={data.collection.image} />
    </div>
  );
}

function BuildTools({image}) {
  boardBuilderImage = null;
  cableBuilderImage = null;
  return (
    {({builders}) => (
      <div className="user-build-tools-grid">
        {builders.nodes.map((builder) => (
          <Link
            key={builder.id}
            className="user-build-tools"
            to={`/builders/${builder.handle}`}
          >
            <Image
              data={builder.images.nodes[0]}
              aspectRatio="1/1"
              sizes="(min-width: 45em) 20vw, 50vw"
            />
            <h4>{builder.title}</h4>
          </Link>
        ))}
      </div>
    )}
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @template T @typedef {import('@remix-run/react').MetaFunction<T>} MetaFunction */
/** @typedef {import('storefrontapi.generated').FeaturedCollectionFragment} FeaturedCollectionFragment */
/** @typedef {import('storefrontapi.generated').RecommendedProductsQuery} RecommendedProductsQuery */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
