import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

const { width, height } = Dimensions.get('window');

export default function NotFoundScreen() {
  // Animation values
  const cowTranslateY = useSharedValue(0);
  const cowRotate = useSharedValue(0);
  const cowLeft = useSharedValue(0);
  const tailRotate = useSharedValue(3);
  const tailHeight = useSharedValue(100);
  const btnRotate = useSharedValue(95);
  const btnTranslateX = useSharedValue(-100);
  const textTranslateY = useSharedValue(-100);
  const textOpacity = useSharedValue(0);

  // Cow jump animation
  useEffect(() => {
    cowTranslateY.value = withRepeat(
      withSequence(
        withTiming(5, { duration: 100 }),
        withTiming(0, { duration: 100 })
      ),
      -1
    );
  }, []);

  // Cow movement animation
  useEffect(() => {
    cowLeft.value = withTiming(width * 0.38, { duration: 2000 });
    cowRotate.value = withSequence(
      withTiming(0, { duration: 1700 }),
      withTiming(5, { duration: 100 }),
      withTiming(90, { duration: 300 }),
      withTiming(90, { duration: 200 })
    );
  }, []);

  // Tail animation
  useEffect(() => {
    tailRotate.value = withRepeat(
      withSequence(
        withTiming(3, { duration: 375 }),
        withTiming(-3, { duration: 375 })
      ),
      -1
    );
    tailHeight.value = withRepeat(
      withSequence(
        withTiming(100, { duration: 375 }),
        withTiming(80, { duration: 375 })
      ),
      -1
    );
  }, []);

  // Button animation
  useEffect(() => {
    setTimeout(() => {
      btnRotate.value = withTiming(0, { duration: 500 });
      btnTranslateX.value = withTiming(0, { duration: 500 });
    }, 1000);
  }, []);

  // Text animation
  useEffect(() => {
    setTimeout(() => {
      textTranslateY.value = withSequence(
        withTiming(height * 0.28, { duration: 300 }),
        withTiming(height * 0.23, { duration: 100 }),
        withTiming(height * 0.28, { duration: 100 }),
        withTiming(height * 0.33, { duration: 100 }),
        withTiming(height * 0.28, { duration: 100 })
      );
      textOpacity.value = withTiming(1, { duration: 300 });
    }, 1200);
  }, []);

  // Animated styles
  const cowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: cowTranslateY.value },
      { rotate: `${cowRotate.value}deg` },
    ],
    left: cowLeft.value,
  }));

  const tailAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${tailRotate.value}deg` }],
    height: tailHeight.value,
  }));

  const btnAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: btnTranslateX.value },
      { rotate: `${btnRotate.value}deg` },
    ],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    top: textTranslateY.value,
    opacity: textOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: '404 Not Found' }} />

      {/* Animated Cow */}
      <Animated.View style={[styles.cow, cowAnimatedStyle]}>
        <View style={styles.head}>
          <View style={styles.face} />
          <View style={styles.horn1} />
          <View style={styles.horn2} />
        </View>
        <View style={[styles.leg, styles.legBL]} />
        <View style={[styles.leg, styles.legBR]} />
        <View style={[styles.leg, styles.legFL]} />
        <View style={[styles.leg, styles.legFR]} />
        <Animated.View style={[styles.tail, tailAnimatedStyle]}>
          <View style={styles.tailEnd} />
        </Animated.View>
      </Animated.View>

      {/* Well with Home Button */}
      <View style={styles.well}>
        <Animated.View style={btnAnimatedStyle}>
          <Link href="/" style={styles.homeBtn}>
            <Text style={styles.homeBtnText}>Go Home</Text>
          </Link>
        </Animated.View>
      </View>

      {/* Error Text */}
      <Animated.View style={[styles.textBox, textAnimatedStyle]}>
        <Text style={styles.errorCode}>404</Text>
        <Text style={styles.errorMessage}>Sorry, page not found...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF8A65',
    overflow: 'hidden',
  },
  cow: {
    width: 300,
    height: 150,
    borderRadius: 60,
    backgroundColor: '#fefefe',
    position: 'absolute',
    top: '40%',
    zIndex: 10,
    transformOrigin: '100% 150%',
  },
  head: {
    position: 'absolute',
    top: 0,
    left: '100%',
    zIndex: 1,
  },
  face: {
    width: 110,
    height: 75,
    backgroundColor: '#fff',
    borderRadius: 10,
    transform: [
      { rotateX: '180deg' },
      { rotate: '-55deg' },
      { translateX: -25 },
      { translateY: -55 },
    ],
    borderWidth: 10,
    borderColor: 'transparent',
    borderBottomColor: '#000',
  },
  horn1: {
    position: 'absolute',
    top: -35,
    left: -55,
    transform: [{ rotate: '-25deg' }],
    backgroundColor: '#000',
    width: 40,
    height: 50,
    zIndex: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  horn2: {
    position: 'absolute',
    top: -40,
    left: -50,
    transform: [{ rotate: '-5deg' }],
    backgroundColor: '#000',
    width: 40,
    height: 50,
    zIndex: 2,
    borderRadius: 20,
  },
  leg: {
    position: 'absolute',
    top: '95%',
    backgroundColor: '#FFF',
    width: 15,
    height: 30,
    transformOrigin: 'top center',
  },
  legBL: {
    left: '4%',
  },
  legBR: {
    left: '13%',
  },
  legFL: {
    right: '10%',
  },
  legFR: {
    right: '5%',
  },
  tail: {
    position: 'absolute',
    right: '98%',
    top: '12%',
    width: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#fff',
    borderTopWidth: 5,
    borderTopColor: '#fff',
    transformOrigin: 'top left',
  },
  tailEnd: {
    position: 'absolute',
    left: '7%',
    top: '100%',
    backgroundColor: '#000',
    width: 15,
    height: 17.5,
    borderRadius: 10,
    transform: [{ rotate: '-60deg' }],
  },
  well: {
    backgroundColor: '#000',
    width: 300,
    height: 20,
    position: 'absolute',
    top: '60%',
    left: '60%',
    borderRadius: 50,
    overflow: 'visible',
  },
  homeBtn: {
    backgroundColor: '#FFD600',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  homeBtnText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#000',
  },
  textBox: {
    position: 'absolute',
    left: '10%',
    alignItems: 'center',
  },
  errorCode: {
    fontSize: 240,
    color: '#fff',
    lineHeight: 180,
    fontWeight: '700',
    fontFamily: 'CabinSketch-Bold',
  },
  errorMessage: {
    width: 420,
    fontSize: 50,
    color: '#fff',
    lineHeight: 50,
    fontWeight: '700',
    fontFamily: 'CabinSketch-Bold',
    textAlign: 'center',
  },
});
