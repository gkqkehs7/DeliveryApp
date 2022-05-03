import React, {useCallback} from 'react';
import {View, Text, Pressable, FlatList, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import EachOrder from '../components/EachOrder';
import {Order} from '../slices/order';
import {RootState} from '../store/reducer';

//scrollview는 안에 반복문이 들어가면 계속 rendering하기 때문에
//안에 반복문을 사용한다면 flatlist를 사용하자

function Orders() {
  const orders = useSelector((state: RootState) => state.order.orders);

  //그냥 item인지 객체안에 item자리인지는 공식문서 확인해야함
  const renderItem = useCallback(({item}: {item: Order}) => {
    return <EachOrder item={item} />;
  }, []);

  return (
    <FlatList
      data={orders}
      keyExtractor={item => item.orderId}
      renderItem={renderItem}
    />
  );
}

export default Orders;
