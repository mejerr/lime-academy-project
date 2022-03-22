import React, { FC, useCallback } from 'react'
import styled from 'styled-components';
import { nftImage } from 'assets';
import Collection from './Collection';

const COLLECTIONS_DUMMY = [
  {
    id: 0,
    image: nftImage,
    smallImage: nftImage,
    name: "New generation",
    creator: "MisterPizza",
    description: "asdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsa"
  },
  {
    id: 1,
    image: nftImage,
    smallImage: nftImage,
    name: "New generation",
    creator: "MisterPizza",
    description: "asdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsa"
  },
  {
    id: 2,
    image: nftImage,
    smallImage: nftImage,
    name: "New generation",
    creator: "MisterPizza",
    description: "asdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsa"
  },  {
    id: 3,
    image: nftImage,
    smallImage: nftImage,
    name: "New generation",
    creator: "MisterPizza",
    description: "asdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsa"
  }
];

const Collections: FC = () => {
  const renderCollections = useCallback(({ id, image, smallImage, name, creator, description }) => {
    return (
      <Collection
        key={id}
        id={id}
        image={image}
        smallImage={smallImage}
        name={name}
        creator={creator}
        description={description}
      />);
  }, []);

  return (
    <CollectionsWrapper>
      {COLLECTIONS_DUMMY.map(renderCollections)}
    </CollectionsWrapper>
  )
};

export default Collections;

const CollectionsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 30px;
  padding: 30px 40px 20px;

  @media (max-width: 700px) {
  grid-template-columns: repeat(1, 1fr);
  }
`;