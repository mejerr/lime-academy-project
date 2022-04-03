import React, { FC, Fragment, useCallback, useState } from 'react';
import styled from 'styled-components';

interface IProps {
  image?: string;
  width: string;
  height?: string;
}

const ImageBlock: FC<IProps>  = ({ image, width, height = '500px' }) => {
  const [openImage, setOpenImage] = useState<boolean>(false);

  const onImageClick = useCallback(() => {
    setOpenImage(!openImage);
  }, [openImage]);

  return (
    <Fragment>
      <ImageWrapper width={width} height={height}>
        <Image src={image} onClick={onImageClick}/>
      </ImageWrapper>
      {openImage &&
        <OpenedImageBackground onClick={onImageClick}>
          <OpenedImage onClick={(e) => e.stopPropagation()}>
            <Image src={image}/>
          </OpenedImage>
        </OpenedImageBackground>
      }
    </Fragment>
  );
}

export default ImageBlock;

const ImageWrapper = styled.div<{ width: string, height: string }>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};

  cursor: pointer;

  @media (max-width: 1400px) {
    width: 400px;
  }

  @media (max-width: 1000px) {
    width: 580px;
  }

  @media (max-width: 600px) {
    width: 430px;
  }

  @media (max-width: 450px) {
    width: 330px;
  }
`;

const Image = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
  border-radius: 10px;
`;

const OpenedImageBackground = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  z-index: 5;
`;

const OpenedImage = styled.div`
  width: auto;
  height: auto;
  max-width: 100%;
  max-width: 100%;
`;