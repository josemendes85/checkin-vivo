import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, View } from 'react-native';

interface PulseRingsProps {
  children: React.ReactNode;
  isConfirmed: boolean;
}

export function PulseRings({ children, isConfirmed }: PulseRingsProps) {
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;
  const anim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createLoop = (anim: Animated.Value, delay: number) => {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 1800,
            useNativeDriver: true,
          }),
        ])
      );

      let timeoutId: ReturnType<typeof setTimeout> | undefined;
      if (delay > 0) {
        timeoutId = setTimeout(() => {
          animation.start();
        }, delay);
      } else {
        animation.start();
      }

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
        animation.stop();
      };
    };

    const clean1 = createLoop(anim1, 0);
    const clean2 = createLoop(anim2, 600);
    const clean3 = createLoop(anim3, 1200);

    return () => {
      clean1();
      clean2();
      clean3();
      anim1.setValue(0);
      anim2.setValue(0);
      anim3.setValue(0);
    };
  }, []);

  const getStyle = (anim: Animated.Value, sizePercent: '64%' | '82%' | '100%') => {
    const scale = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.94, 1.04],
    });
    const opacity = anim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.55, 0.15],
    });

    const ringBorderColor = isConfirmed
      ? 'rgba(90, 140, 70, 0.35)'
      : 'rgba(184, 127, 34, 0.35)';

    return {
      width: sizePercent,
      height: sizePercent,
      opacity,
      borderColor: ringBorderColor,
      transform: [{ scale }],
    } as any;
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.ring, getStyle(anim1, '64%')]} />
      <Animated.View style={[styles.ring, getStyle(anim2, '82%')]} />
      <Animated.View style={[styles.ring, getStyle(anim3, '100%')]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    maxHeight: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 18,
  },
  ring: {
    position: 'absolute',
    borderRadius: 9999,
    borderWidth: 1.5,
  },
});
