import React, { FC } from 'react';
import styled, { keyframes } from 'styled-components';
import { colors } from '../styles';

const load = keyframes`
  0% {
    transform: scale(1.0);
  }
  5% {
    transform: scale(1.0);
  }
  50% {
    transform: scale(0.8);
  }
  95% {
    transform: scale(1.0);
  }
  100% {
    transform: scale(1.0);
  }
`

interface IProps {
  size?: number;
  isLoading: boolean;
}

const Loader: FC<IProps> = ({ size = 60, isLoading = false }) => {
  const rgb = `rgb(${colors.lightBlue})`;

  return (
    <LoaderWrapper isLoading={isLoading}>
      <LoaderSVG viewBox="0 0 186 187" size={size}>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <path
            d="M60,10.34375 C32.3857625,10.34375 10,32.7295125 10,60.34375 L10,126.34375 C10,153.957987 32.3857625,176.34375 60,176.34375 L126,176.34375 C153.614237,176.34375 176,153.957987 176,126.34375 L176,60.34375 C176,32.7295125 153.614237,10.34375 126,10.34375 L60,10.34375 Z M60,0.34375 L126,0.34375 C159.137085,0.34375 186,27.206665 186,60.34375 L186,126.34375 C186,159.480835 159.137085,186.34375 126,186.34375 L60,186.34375 C26.862915,186.34375 0,159.480835 0,126.34375 L0,60.34375 C0,27.206665 26.862915,0.34375 60,0.34375 Z"
            id="Rectangle-Copy"
            fill={rgb}
            fillRule="nonzero"
          />
          <rect
            id="Rectangle"
            fill={rgb}
            x="44"
            y="44.34375"
            width="98"
            height="98"
            rx="35"
          />
        </g>
      </LoaderSVG>
    </LoaderWrapper>
  );
}

const LoaderWrapper = styled.div<{ isLoading: boolean }>`
  display: ${({ isLoading }) => isLoading ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 60%);
  z-index: 100;
  transition: all 3s ease;
`;

const LoaderSVG = styled.svg<{ size: number }>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  animation: ${load} 1s infinite cubic-bezier(0.25, 0, 0.75, 1);
  transform: translateZ(0);
`;

export default Loader;
