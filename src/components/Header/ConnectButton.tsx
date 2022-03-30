import React, { FC, useCallback, useContext } from 'react'
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignIn } from '@fortawesome/free-solid-svg-icons';
import { ellipseAddress } from '../../helpers/utilities';
import Button from '../Button';
import { AppStateContext, IConnectData } from 'views/AppContextWrapper';

const ConnectButton: FC<RouteComponentProps> = ({ history }) => {
  const { state, onConnect, killSession } = useContext(AppStateContext);
  const { connected, userAdress }: IConnectData = state;

  const onLogin = useCallback(() => {
    onConnect({ onSuccess: () => history.push('/marketplace') });
  }, [onConnect]);

  const onLogout = useCallback(() => {
    killSession({ onSuccess: () => history.push('/home') });
  }, [killSession]);

  return (
    <ConnectButtonWrapper >
      {connected ? (
        userAdress && (
          <Account>
            <Address connected={connected}>{ellipseAddress(userAdress, 8)}</Address>
            <DisconnectButton onClick={onLogout}>
              {'Disconnect'}
            </DisconnectButton>
          </Account>
        )
      ) :
        <ButtonWrapper onClick={onLogin}>
          <LoginIcon icon={faSignIn}/>
          <LoginButton>
            <Button
              title={'Login'}
              width={"60px"}
            />
          </LoginButton>
        </ButtonWrapper>
      }
    </ConnectButtonWrapper>
  )
}

export default withRouter(ConnectButton);

const ConnectButtonWrapper = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  background-color: #024bb0;
  display: flex;
  align-items: center;
  cursor: pointer;

  @media (max-width: 1000px) {
    width: 60px;
    height: 70px;
    justify-content: center;
  }

  @media (max-width: 400px) {
    width: 40px;
    height: 70px;
  }
`;

const LoginIcon = styled(FontAwesomeIcon)`
  width: 25px;
  height: 25px;
  color: white;
  margin-left: 10px;

  @media (max-width: 1000px) {
    margin-left: 0;
  }
`;

const LoginButton = styled.div`
  width: 100%;
  height: 100%;
  > div {
    color: white;

    :hover {
      color: white;
    }
  }

  @media (max-width: 1000px) {
    display: none;
  }
`;

const Account = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-right: 10px;
  font-weight: 500;
`;

const Address = styled.p<{ connected: boolean }>`
  font-size: 12px;
  font-weight: bold;
  margin: ${({ connected }) => (connected ? '-2px auto 0.7em' : '0')};
`;

const DisconnectButton = styled.div`
  font-size: 10px;
  font-family: monospace;
  position: absolute;
  right: 0;
  top: 20px;
  opacity: 0.7;
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
`;