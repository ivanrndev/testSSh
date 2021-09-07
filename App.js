import React, {useEffect, useState, useRef} from 'react';
import {PersistGate} from 'redux-persist/integration/react';
import NetInfo from '@react-native-community/netinfo';
import {store, persistor} from './src/redux/store';
import {Provider} from 'react-redux';

import {
  FETCH_AUTH,
  FETCH_CONNECT,
  FETCH_CONNECT_FAILED,
  FETCH_CONNECT_SUCESS,
} from './src/constants/constants';

import {AppNavigator} from './src/navigation/navigation';
import ModalCustom from './src/components/modal';

//XMLHttpRequest = GLOBAL.originalXMLHttpRequest ?
//    GLOBAL.originalXMLHttpRequest :
//   GLOBAL.XMLHttpRequest;

export default function App() {
  const [activeModal, setActiveModal] = useState(false);
  const [internetConnection, setInternetConnection] = useState(true);

  const btn = {
    text: 'Ok',
    onPress: () => {
      setActiveModal(false);
    },
  };
  useEffect(() => {
    store.dispatch({type: FETCH_CONNECT});
    if (!internetConnection) {
      setActiveModal(true);
      store.dispatch({type: FETCH_CONNECT_FAILED});
    } else {
      setActiveModal(false);
      store.dispatch({type: FETCH_CONNECT_SUCESS});
    }
  }, [internetConnection]);

  useEffect(() => {
    const internetHandler = (netState: any) => {
      const {isConnected} = netState;
      setInternetConnection(isConnected);
    };
    NetInfo.fetch().then(internetHandler);
    const unsubscribe = NetInfo.addEventListener(internetHandler);
    return () => {
      unsubscribe();
    };
  }, []);



  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
        <ModalCustom btn={btn} shown={activeModal} setShown={setActiveModal} />
      </PersistGate>
    </Provider>
  );
}
