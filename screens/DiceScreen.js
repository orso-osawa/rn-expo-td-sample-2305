import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Title, Text, Button } from 'react-native-paper';
import { Audio } from 'expo-av';

import SoundFiles from '../constants/Sounds';

// スクリーン
export default function DiceScreen({ navigation }) {
  //さいころの目の変数
  const [dice, setDice] = useState(0);
  //さいころの目の記録の変数
  const [diceRecode, setDiceRecode] = useState([]);
  //さいころの表示テキスト
  const diceText = ['', '①', '②', '③', '④', '⑤', '⑥']; // '凶', '小吉', '中吉', '大吉'
  //サイコロをふる
  const playDice = () => {
    //音を鳴らす
    playSound(SoundFiles.buttonPushSound1); // buttonPushSound1, buttonPushSound2, buttonPushSound3
    //ランダムで抽選
    const dice = Math.floor(Math.random() * (diceText.length - 1)) + 1;
    setDice(dice);
    setDiceRecode([diceText[dice], ...diceRecode]);
  };

  //サウンド再生
  const [buttonSound, setButtonSound] = React.useState();
  var playSound = async (soundFile) => {
    if (buttonSound) buttonSound.unloadAsync();
    const { sound } = await Audio.Sound.createAsync(soundFile);
    await sound.playAsync();
    setButtonSound(sound);
  };

  // 画面構成
  return (
    <ScrollView style={[styles.container, { backgroundColor: 'whitesmoke' }]}>
      <View>
        <Title>ランダムで表示を変えよう</Title>
      </View>
      <View style={{ marginTop: 20 }}>
        <Text>どの目が出るかな？</Text>
      </View>
      <View style={{ marginTop: 20 }}>
        {/*　ボタン ----------------------*/}
        <Button
          mode="contained"
          style={{ backgroundColor: 'lavender' }}
          labelStyle={{ color: 'dimgray', fontSize: 20 }}
          onPress={() => playDice()}>
          サイコロを振る
        </Button>
      </View>

      {/*結果表示 ----------------------*/}
      <View style={{ marginTop: 10, alignItems: 'center' }}>
        <Text style={{ fontSize: 100, color: 'lightseagreen' }}>
          {diceText[dice]}
        </Text>
      </View>

      <View style={{ marginTop: 20 }}>
        <Title>記録</Title>
        <Text>{diceRecode.join(',')}</Text>
      </View>
      <View style={{ marginTop: 20 }}>
        <Button
          mode="contained"
          onPress={() => {
            setDiceRecode([]);
          }}>
          リセット
        </Button>
      </View>

      <View
        style={{ marginTop: 40, borderTopWidth: 1, borderTopColor: 'gray' }}
      />
      <View style={{ marginTop: 20 }}>
        <Title>プログラムチャレンジ</Title>
        <Text>・さいころからおみくじに変えてみよう</Text>
        <Text>腕試し）ボタンの音を変えてみよう</Text>
        <Text>腕試し）出てくる確率を変えよう</Text>
      </View>
    </ScrollView>
  );
}

//　スクリーン設定やスタイルなど
export const DiceScreenSetting = {
  title: 'さいころ',
  screenName: 'dice',
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
