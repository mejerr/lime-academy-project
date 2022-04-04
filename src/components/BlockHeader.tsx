import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown, IconDefinition, faCopy } from '@fortawesome/free-solid-svg-icons';
import { ethereumImage } from 'assets';
import { ImageBlock } from 'components';
import { useHistory } from 'react-router-dom';

interface IProps {
  image: string;
  name: string,
  creator?: string,
  userBalance?: number,
  description?: string,
  showCreator?: boolean
}

const BlockHeader: FC<IProps> = ({
  image,
  name,
  creator,
  userBalance = 0,
  description = '',
  showCreator = true
}) => {
  const [height, setHeight] = useState<string>("120px");
  const [openDescription, setOpenDescription] = useState<boolean>(false);
  const descriptionNode = useRef<HTMLHeadingElement>(null);
  const creatorNode = useRef<HTMLHeadingElement>(null);
  const history = useHistory();

  const onOpenDescription = useCallback(() => {
    setOpenDescription(!openDescription);
  }, [openDescription]);

  const goToUserCollection = useCallback(() => {
    history.push(`/my-collection/${creator}`);
  }, [creator]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(creatorNode.current?.innerText ||'');
    alert("Copied the text: " + creatorNode.current?.innerText ||'');
  }, [creatorNode]);

  useEffect(() => {
    if (descriptionNode.current) {
      setHeight(openDescription ? `${descriptionNode.current.scrollHeight - 40}px` : "120px");
    }
  }, [openDescription]);

  return (
    <BlockWrapper>
      <ImageWrapper>
        <ImageBlock image={image} width={'100%'} height={'100%'}/>
      </ImageWrapper>
      <BlockName>{name}</BlockName>
      <BlockCreator >
        {showCreator && <div>Created by</div>}
        <span onClick={goToUserCollection} ref={creatorNode}>{creator}</span>
        <CopyIcon icon={faCopy} onClick={copyToClipboard}/>
      </BlockCreator>
      {!!userBalance &&
        <BalanceWrapper>
          <ValueIcon/>
          Balance: {userBalance.toString().substring(0, 10)}
        </BalanceWrapper>
      }
      {description && (<>
        <BlockDescriptionWrapper
          ref={descriptionNode}
          style={{ height }}
          isOpen={openDescription}
          onClick={onOpenDescription}
        >
          <BlockDescription>
            {description}
          </BlockDescription>
        </BlockDescriptionWrapper>
        <ArrowIcon icon={openDescription ? faAngleUp : faAngleDown} onClick={onOpenDescription}/>
      </>)}
    </BlockWrapper>
  );
};

export default BlockHeader;

const BlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
`;

const ImageWrapper = styled.div`
  height: 220px;
  width: 100%;

  & img {
    border-radius: 0;
  }
`;

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
  padding: 0 10px;

  > span {
    color: rgb(32, 129, 226);
    word-break: break-all;
    cursor: pointer;
    :hover {
      color: rgba(32, 129, 226, 0.7);
    }
  }
`;

const CopyIcon = styled(FontAwesomeIcon)`
  width: 20px;
  height: 20px;
  margin-left: 10px;
  cursor: pointer;
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
  cursor: pointer;
  top: ${({ icon }) => icon === faAngleUp ? "-22px" : "-35px"};
`;

const BalanceWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0 5px;
`;

const ValueIcon = styled.div`
  display: flex;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  background: transparent url(${ethereumImage}) center center no-repeat;
  background-size: contain;
`;