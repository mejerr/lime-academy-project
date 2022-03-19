import React, { FC, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { nftImage } from 'assets';

const Collections: FC<RouteComponentProps> = ({ history }) => {
  const onClick = useCallback((collectionId) => {
    history.push(`/marketplace/collections/${collectionId}`);
  }, []);

  return (
    <CollectionsWrapper>
      {[1, 2, 3].map((el, index) => {
        return (
          <Collection key={index} onClick={() => onClick(1)}>
            <Image />
            <SmallImageWrapper>
            <SmallImage />
            </SmallImageWrapper>
            <Name>{"New generation"}</Name>
            <Creator>creator <span>{"MisterPizza"}</span></Creator>
            <Description>{"asdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsa"}</Description>
          </Collection>
        );
      })}
    </CollectionsWrapper>
  )
};

export default withRouter(Collections);

const CollectionsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 30px;
  padding: 30px 40px 20px;

  @media (max-width: 700px) {
  grid-template-columns: repeat(1, 1fr);
  }
`;

export const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Collection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  border: 1px solid rgb(229, 232, 235);
  border-radius: 10px;
  cursor: pointer;

  :hover {
    box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
    transition: all 0.1s ease 0s;
  }
`;

const Name = styled.div`
  width: 100%;
  text-align: center;
  font-size: 16px;
  margin-bottom: 5px;
`;

const Description = styled.div`
  text-align: center;
  margin: 15px 0 15px;
  width: 100%;
  font-size: 16px;
  color: rgb(112, 122, 131);
  max-width: 80%;
  height: 60px;
  word-break: break-all;
  overflow: hidden;
`;

const Image = styled.div`
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 280px;
  width: 100%;

  background: transparent url(${nftImage}) center center no-repeat;
  background-size: cover;
`;

const SmallImageWrapper = styled.div`
  box-shadow: rgb(14 14 14 / 60%) 0px 0px 2px 0px;
  border: 3px solid rgb(251, 253, 255);

  border-radius: 50%;
  width: 40px;
  height: 40px;
  position: relative;
  top: -20px;
`;

const SmallImage = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;

  background: transparent url(${nftImage}) center center no-repeat;
  background-size: cover;`;


const Creator = styled.div`
  text-align: center;
  width: 100%;
  font-size: 14px;
  color: rgb(112, 122, 131);

  > span {
    color: rgb(32, 129, 226);
  }
`;