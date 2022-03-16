import React, { FC } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import Button from '../Button';

const NavBar: FC<RouteComponentProps> = ( props ) => {
  const { location, push } = props.history;
  const { pathname } = location;

  return (
    <NavBarWrapper>
      <Button
        title={'Marketplace'}
        isActive={pathname === "/marketplace"}
        width={"110px"}
        onClick={() => push('/marketplace')}
      />
      <Button
        title={'Create'}
        isActive ={pathname === "/create"}
        width={"80px"}
        onClick={() => push('/create')}
      />
      <Button
          title={'My Collection'}
          isActive ={pathname === "/collection"}
          width={"100px"}
          onClick={() => push('/collection')}
      />
    </NavBarWrapper>
  )
}

const NavBarWrapper = styled.div`
  display: flex;

  @media (max-width: 1100px) {
    display: none;
  }
`;

export default withRouter(NavBar);
