import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Title, Text, Button } from 'react-native-paper';
import { Audio } from 'expo-av';

import SoundFiles from '../constants/Sounds';

import useInterval from '../hooks/useInterval';

const sloatReel = [
  ['ð', '7ï¸â£'],
  ['ð', '7ï¸â£'],
  ['7ï¸â£', 'ð'],
]; // , 'ð'

// ã¹ã¯ãªã¼ã³
export default function SlotScreen({ navigation }) {
  const [slot, setSlot] = useState([
    Math.floor(Math.random() * sloatReel[0].length),
    Math.floor(Math.random() * sloatReel[1].length),
    Math.floor(Math.random() * sloatReel[2].length),
  ]);
  const [slotMove, setSlotMove] = useState([false, false, false]); //ãã¢ãã¡ã¼ã·ã§ã³ç¶æ
  const [point, setPoint] = useState(60); //ãç¹æ°
  const [result, setResult] = useState(null); //ãå¤å®çµæ
  const [resultRecodes, setResultRecodes] = useState([]);

  //betãã¿ã³å¦ç
  const bet = (betPoint) => {
    setPoint(point - betPoint);
    setSlotMove([true, true, true]);
    setResult(null);
    playSlotMusicSound(SoundFiles.slotMusic1); //ãéå§é³æ¥½
  };

  //stopãã¿ã³å¦ç
  const stop = (slotNum) => {
    playSound(SoundFiles.buttonPushSound1); //ããã¿ã³ã®é³
    const newSlotMove = [...slotMove];
    newSlotMove[slotNum] = false;
    setSlotMove(newSlotMove);
    //ãï¼ã¤ã®ã¹ã­ãããæ­¢ã¾ã£ã¦åãçµµæã®æ
    // if (
    //   !newSlotMove[0] && !newSlotMove[1] && newSlotMove[2] && sloatReel[0][slot[0]] === sloatReel[1][slot[1]] ||
    //   !newSlotMove[0] && newSlotMove[1] && !newSlotMove[2] && sloatReel[0][slot[0]] === sloatReel[2][slot[2]] ||
    //   newSlotMove[0] && !newSlotMove[1] && !newSlotMove[2]  && sloatReel[1][slot[1]] === sloatReel[2][slot[2]]  ) {
    //     playSlotMusicSound(SoundFiles.slotMusic2);//ãã©ã ã­ã¼ã«
    // }
    //å¨ã¦ã®ã¹ã­ãããæ­¢ã¾ã£ãã
    if (!newSlotMove[0] && !newSlotMove[1] && !newSlotMove[2]) {
      slotMusic.unloadAsync(); //é³æ¥½åæ­¢
      let getPoint = 0;
      //å¨ã¦ã®çµµæãåã
      if (
        sloatReel[0][slot[0]] === sloatReel[1][slot[1]] &&
        sloatReel[0][slot[0]] === sloatReel[2][slot[2]]
      ) {
        getPoint = 15;
        // playSlotMusicSound(SoundFiles.successSound1); //ããããµã¦ã³ã successSound1, successSound2, successSound3
      }
      setPoint(point + getPoint);
      setResult(getPoint);
      setResultRecodes([getPoint, ...resultRecodes]);
    }
  };

  //ãªã»ãããã¿ã³å¦ç
  const reset = () => {
    setSlotMove([false, false, false]);
    setPoint(60);
    setResult(null);
    setResultRecodes([]);
    buttonSound.unloadAsync(); //é³æ¥½åæ­¢
    slotMusic.unloadAsync(); //é³æ¥½åæ­¢
  };

  //ãã¹ã­ããã¢ãã¡ã¼ã·ã§ã³
  useInterval(
    () => {
      const newSlot = [...slot];
      if (slotMove[0]) newSlot[0] += 1;
      if (slotMove[1]) newSlot[1] += 1;
      if (slotMove[2]) newSlot[2] += 1;
      if (newSlot[0] >= sloatReel[0].length) newSlot[0] = 0;
      if (newSlot[1] >= sloatReel[1].length) newSlot[1] = 0;
      if (newSlot[2] >= sloatReel[2].length) newSlot[2] = 0;
      setSlot(newSlot);
    },
    slotMove[0] || slotMove[1] || slotMove[2] ? 200 : null
  );

  //ãµã¦ã³ãåç
  const [buttonSound, setButtonSound] = React.useState();
  const [slotMusic, setSlotMusic] = React.useState();
  var playSound = async (soundFile) => {
    if (buttonSound) buttonSound.unloadAsync();
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
    setButtonSound(sound);
  };
  var playSlotMusicSound = async (soundFile) => {
    if (slotMusic) slotMusic.unloadAsync();
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
    setSlotMusic(sound);
  };

  // ç»é¢æ§æ
  return (
    <ScrollView style={[styles.container, { backgroundColor: 'whitesmoke' }]}>
      <View>
        <Title>ã¹ã­ããã®å¤å®ãããã</Title>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text>çµµæãæããã</Text>
      </View>
      <View
        style={{
          marginTop: 20,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'flex-end',
        }}>
        {/*ãã¤ã³ãã¨éå§  ----------------------*/}
        <View style={{ alignItems: 'center', marginRight: 10 }}>
          <Title>{point}</Title>
          <Button
            mode="contained"
            color="gold"
            disabled={slotMove[0] || slotMove[1] || slotMove[2] || point < 3}
            onPress={() => bet(3)}>
            START
          </Button>
        </View>

        {/*ã¹ã­ãã1 ----------------------*/}
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 40 }}>{sloatReel[0][slot[0]]}</Text>
          <Button
            mode="contained"
            color="gold"
            disabled={!slotMove[0]}
            onPress={() => stop(0)}>
            stop
          </Button>
        </View>

        {/*ã¹ã­ãã2 ----------------------*/}
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 40 }}>{sloatReel[1][slot[1]]}</Text>
          <Button
            mode="contained"
            color="gold"
            disabled={!slotMove[1]}
            onPress={() => stop(1)}>
            stop
          </Button>
        </View>

        {/*ã¹ã­ãã3 ----------------------*/}
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 40 }}>{sloatReel[2][slot[2]]}</Text>
          <Button
            mode="contained"
            color="gold"
            disabled={!slotMove[2]}
            onPress={() => stop(2)}>
            stop
          </Button>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <Text style={{}}>{result !== null ? `${result}ãã¤ã³ã` : ''}</Text>
      </View>

      <View style={{ marginTop: 20, width: '80%' }}>
        <Title>è¨é²</Title>
        <Text>{resultRecodes.join(',')}</Text>
      </View>
      <View style={{ marginTop: 20 }}>
        <Button
          mode="contained"
          onPress={() => {
            reset();
          }}>
          ãªã»ãã
        </Button>
      </View>

      <View
        style={{ marginTop: 40, borderTopWidth: 1, borderTopColor: 'gray' }}
      />
      <View style={{ marginTop: 20 }}>
        <Title>ãã­ã°ã©ã ãã£ã¬ã³ã¸</Title>
        <Text>ã»çµµæãæã£ãæã«ãããé³ãæµã</Text>
        <Text>èè©¦ãï¼åãçµµæï¼ã¤æã£ãæã«ãã©ã ã­ã¼ã«ãæµã</Text>
        <Text>èè©¦ãï¼æã£ãæã®çµµæã§é³ãå¤ãã¦ã¿ãã</Text>
        <Text>èè©¦ãï¼ã¹ã­ããã®çµµæãå¢ããã¿ãã</Text>
        <Text>èè©¦ãï¼ç¢ºçãå¤ããã</Text>
        <Text>èè©¦ãï¼ã²ã¼ã ãã©ã³ã¹ãå¤ãã¦ã¿ãã</Text>
      </View>
    </ScrollView>
  );
}

//ãã¹ã¯ãªã¼ã³è¨­å®ãã¹ã¿ã¤ã«ãªã©
export const SloatScreenSetting = {
  title: 'ã¹ã­ãã',
  screenName: 'slot',
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
