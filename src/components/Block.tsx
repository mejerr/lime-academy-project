import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withRouter } from 'react-router-dom';
import { faAngleUp, faAngleDown, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { nftImage } from 'assets';

const Block: FC<RouteComponentProps> = ({ history }) => {
  const [height, setHeight] = useState<string>("120px");
  const [openDescription, setOpenDescription] = useState<boolean>(false);
  const descriptionNode = useRef<HTMLHeadingElement>(null);

  const onOpenDescription = useCallback(() => {
    setOpenDescription(!openDescription)
  }, [openDescription]);

  useEffect(() => {
    if (descriptionNode.current) {
      setHeight(openDescription ? `${descriptionNode.current.scrollHeight - 40}px` : "120px");
    }
  }, [openDescription]);


  return (
    <BlockWrapper>
      <BlockImage />
      <SmallImageWrapper>
        <SmallImage />
      </SmallImageWrapper>
      <BlockName>{"New generation"}</BlockName>
      <BlockCreator>Created by <span>{"MisterPizza"}</span></BlockCreator>
      <BlockDescriptionWrapper ref={descriptionNode} style={{ height }} isOpen={openDescription}>
        <BlockDescription onClick={onOpenDescription}>
        {"asdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsa dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsa dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsa dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsa dsadsa dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsaasdcxzcxzczxczcxzczxcxzczxczcxzczcxxzcxzcxzccxzcz dsadsa dsadsa"}
        </BlockDescription>
      </BlockDescriptionWrapper>
      <ArrowIcon icon={openDescription? faAngleUp : faAngleDown}/>
    </BlockWrapper>
  );
};

export default withRouter(Block);

const BlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
`;

const BlockImage = styled.div`
  height: 220px;
  width: 100%;
  background: transparent url(${nftImage}) center center no-repeat;
  background-size: cover;
`;

const SmallImageWrapper = styled.div``;

const SmallImage = styled.div``;

const BlockName = styled.div`
  font-size: 40px;
  width: 100%;
  text-align: center;
  margin: 20px 0;
`;

const BlockCreator = styled.div`
  font-size: 16px;
  width: 100%;
  text-align: center;
  color: rgb(112, 122, 131);

  > span {
    color: rgb(32, 129, 226);
  }
`;

const BlockDescriptionWrapper = styled.div<{ isOpen: boolean }>`
  margin: 20px 0;
  padding: 20px;
  width: 100%;
  max-width: 700px;
  overflow: hidden;
  position: relative;
  cursor: pointer;

  height: ${({ isOpen }) => isOpen ? "300px" : "120px"};
  transition: all 0.3s ease-out;
  mask: ${({ isOpen }) => isOpen ? "initial": "linear-gradient(rgb(255, 255, 255) 45%, transparent)"};
`;

const BlockDescription = styled.div`
  font-size: 16px;
  text-align: center;
  word-break: break-all;
  line-height: 22px;
  color: rgb(112, 122, 131);
`;

const ArrowIcon = styled(FontAwesomeIcon)<{ icon: IconDefinition }>`
  width: 12px;
  height: 12px;
  position: relative;
  top: ${({ icon }) => icon === faAngleUp ? "-22px" : "-35px"};
`;
