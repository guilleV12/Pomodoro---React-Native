import { StatusBar } from 'expo-status-bar';
import { Button, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import Header from './src/components/Header';
import Timer from './src/components/Timer';
import { Audio } from 'expo-av';

const colors = ['#F7DC6F', '#A2D9CE', '#D7BDE2'];

export default function App() {

  const [isWorking, setIsWorking] = useState(false);
  const [time, setTime] = useState(25 * 60);
  const [currentTime, setCurrentTime] = useState('POMODORO' | 'SHORT' | 'BREAK');
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setTime(time - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    if (time === 0){
      setIsActive(false);
      setTime(currentTime === 0 ? 1500 : ( currentTime === 1 ? 300 : 900 ));
    }

    return () => clearInterval(interval);
  }, [isActive, time, currentTime]);
  
  function handleStartStop() {
    playSound();
    setIsActive((prev) => !prev);
  }

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      require('./assets/Click.mp3')
    )
    await sound.playAsync();
  }

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: colors[currentTime]}]}>
      <View 
        style={{
                flex: 1,
                paddingHorizontal: 15,
                paddingTop: Platform.OS === 'android' && 35, 
              }}>
        <Text style={styles.title}>Pomodoro</Text>
        <Header 
          setTime={setTime} 
          currentTime={currentTime} 
          setCurrentTime={setCurrentTime} />
        <Timer 
          time={time} />
        <TouchableOpacity style={styles.button} onPress={handleStartStop}>
          <Text style={{color:'white', fontWeight: 'bold'}}>
            {isActive ? 'STOP' : 'START'}
          </Text>
        </TouchableOpacity>
      </View>
      <StatusBar style='auto'/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 32,
  },
  button: {
    backgroundColor: '#333333',
    marginTop: 15,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
});
