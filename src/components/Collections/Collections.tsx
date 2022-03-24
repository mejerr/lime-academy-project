import React, { FC, useCallback } from 'react'
import styled from 'styled-components';
import Collection from './Collection';

interface ICollection {
  id: number;
  image: string;
  smallImage: string;
  name: string;
  description: string;
  creator: string;
}

interface IProps {
  collections: ICollection[]
}

const Collections: FC<IProps> = ({ collections= [] }) => {
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
      {collections.map(renderCollections)}
    </CollectionsWrapper>
  )
};

export default Collections;

const CollectionsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 30px;
  padding: 30px 40px 20px;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 700px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;