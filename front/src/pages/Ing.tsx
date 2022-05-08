import React, {useEffect, useState} from 'react';
import {Dimensions, Text, View} from 'react-native';
import NaverMapView, {Marker, Path} from 'react-native-nmap';
import {useSelector} from 'react-redux';
import {RootState} from '../store/reducer';
import Geolocation from '@react-native-community/geolocation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {LoggedInParamList} from '../../AppInner';

type IngScreenProps = NativeStackScreenProps<LoggedInParamList, 'Delivery'>;

function Ing({navigation}: IngScreenProps) {
  console.dir(navigation);
  const deliveries = useSelector((state: RootState) => state.order.deliveries);
  const [myPosition, setMyPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    //내 위치 설정
    Geolocation.getCurrentPosition(
      //Geolocation.watchPosition하면 위치 바뀔떄마다 계속 가져옴
      info => {
        //성공
        setMyPosition({
          latitude: info.coords.latitude,
          longitude: info.coords.longitude,
        });
      },
      console.error, //실패
      {
        enableHighAccuracy: true, //정확하게 가져오기
        timeout: 20000, //20초내 안될시 실패
        // distanceFilter: 50 watchPosition일떄 50m? 마다 다시 불러오기
      },
    );
  }, []);

  if (!deliveries?.[0]) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Text>주문을 먼저 수락해주세요!</Text>
      </View>
    );
  }

  if (!myPosition || !myPosition.latitude) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <Text>내 위치를 로딩 중입니다. 권한을 허용했는지 확인해주세요.</Text>
      </View>
    );
  }

  const {start, end} = deliveries?.[0];

  return (
    <View>
      {/* 화면 꽉차게 하는법 */}
      <View
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
        }}>
        {/* center를 출발+도착/2로 해서 출발지 도착지 한눈에 보이게하기  */}
        <NaverMapView
          style={{width: '100%', height: '100%'}}
          zoomControl={false}
          center={{
            zoom: 10,
            tilt: 50,
            latitude: (start.latitude + end.latitude) / 2,
            longitude: (start.longitude + end.longitude) / 2,
          }}>
          {/* 내위치 */}
          {myPosition?.latitude && (
            <Marker
              coordinate={{
                latitude: myPosition.latitude,
                longitude: myPosition.longitude,
              }}
              width={15}
              height={15}
              anchor={{x: 0.5, y: 0.5}}
              caption={{text: '나'}}
              image={require('../assets/red-dot.png')}
            />
          )}
          {/* 내 위치랑 출발지 이어주는 선 */}
          {myPosition?.latitude && (
            <Path
              coordinates={[
                {
                  latitude: myPosition.latitude,
                  longitude: myPosition.longitude,
                },
                {latitude: start.latitude, longitude: start.longitude},
              ]}
              color="orange"
            />
          )}
          {/* 출발지 */}
          <Marker
            coordinate={{
              latitude: start.latitude,
              longitude: start.longitude,
            }}
            width={15}
            height={15}
            anchor={{x: 0.5, y: 0.5}}
            caption={{text: '출발'}}
            image={require('../assets/blue-dot.png')}
          />
          {/* 두개 연결 */}
          <Path
            coordinates={[
              {
                latitude: start.latitude,
                longitude: start.longitude,
              },
              {latitude: end.latitude, longitude: end.longitude},
            ]}
            color="orange"
          />
          {/* 도착지 */}
          <Marker
            coordinate={{latitude: end.latitude, longitude: end.longitude}}
            width={15}
            height={15}
            anchor={{x: 0.5, y: 0.5}}
            caption={{text: '도착'}}
            image={require('../assets/green-dot.png')}
            onClick={() => {
              console.log(navigation);
              navigation.push('Complete', {orderId: deliveries[0].orderId});
            }}
          />
        </NaverMapView>
      </View>
    </View>
  );
}

export default Ing;
