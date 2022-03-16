import React, { FC, useCallback, useContext } from 'react'
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignIn } from '@fortawesome/free-solid-svg-icons';
import { AppStateContext } from '../../App';
import { ellipseAddress } from '../../helpers/utilities';
import Button from '../Button';

const ActiveAccount: FC<RouteComponentProps> = ( props ) => {
  const { state, onConnect, killSession } = useContext(AppStateContext);
  const { connected, address } = state;
  const { push } = props.history;

  const onLogin = useCallback(() => {
    onConnect();
    push('/marketplace');
  }, []);

  return (
    <ActiveAccountWrapper >
      {connected ? (
        address && (
          <Account>
            <Address connected={connected}>{ellipseAddress(address)}</Address>
            <DisconnectButton onClick={killSession}>
              {'Disconnect'}
            </DisconnectButton>
          </Account>
        )
      ) :
        <ButtonWrapper>
          <LoginIcon icon={faSignIn}/>
          <Button
            title={'Login'}
            width={"60px"}
            onClick={onLogin}
          />
        </ButtonWrapper>
      }
    </ActiveAccountWrapper>
  )
}

export default withRouter(ActiveAccount);

const ActiveAccountWrapper = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
`;

const ButtonWrapper = styled.div`
  background-color: #024bb0;
  display: flex;
  align-items: center;

  > div {
    color: white;
  }
`;

const LoginIcon = styled(FontAwesomeIcon)`
  width: 25px;
  height: 25px;
  color: white;
  margin-left: 10px;
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