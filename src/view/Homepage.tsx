import React, { FC } from 'react'
import styled from 'styled-components'
import Header from '../components/Header/Header';

const Homepage: FC = () => {
  return (
    <HomepageWrapper >
      <Header />
    </HomepageWrapper>
  )
}

const HomepageWrapper = styled.div``;

export default Homepage;
