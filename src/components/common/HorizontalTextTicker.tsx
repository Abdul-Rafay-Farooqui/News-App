import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

interface HorizontalTextTickerProps {
  text: string;
  speed?: number;
  style?: any;
}

const { width: screenWidth } = Dimensions.get('window');

const HorizontalTextTicker: React.FC<HorizontalTextTickerProps> = ({ 
  text, 
  speed = 50,
  style 
}) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [textWidth, setTextWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(screenWidth);

  useEffect(() => {
    if (textWidth > 0) {
      const duration = (textWidth + containerWidth) / speed * 1000;
      
      Animated.loop(
        Animated.timing(translateX, {
          toValue: -textWidth - containerWidth,
          duration: duration,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [textWidth, containerWidth, speed, translateX]);

  const handleTextLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setTextWidth(width);
  };

  const handleContainerLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  return (
    <View style={[styles.container, style]} onLayout={handleContainerLayout}>
      <Animated.View
        style={[
          styles.tickerContainer,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <Text
          style={styles.tickerText}
          onLayout={handleTextLayout}
        >
          {text}
        </Text>
        <Text style={styles.tickerText}>
          {text}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#007AFF',
    paddingVertical: 8,
  },
  tickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tickerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    paddingHorizontal: 50,
    textTransform: 'uppercase',
  },
});

export default HorizontalTextTicker;