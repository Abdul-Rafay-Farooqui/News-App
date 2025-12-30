import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface VideoPlayerProps {
  videoUri: string;
  shouldAutoPlay?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoUri, 
  shouldAutoPlay = true 
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(shouldAutoPlay);

  // Determine the video source
  const videoSource = videoUri.startsWith('assets/videos/') 
    ? require('../../assets/videos/sample.mp4') 
    : { uri: videoUri };

  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    if (shouldAutoPlay) {
      player.play();
    }
  });

  useEffect(() => {
    const subscription = player.addListener('playingChange', (isPlaying) => {
      setIsPlaying(isPlaying);
    });

    const errorSubscription = player.addListener('error', (error) => {
      setError('Failed to load video. Using fallback video.');
    });

    return () => {
      subscription?.remove();
      errorSubscription?.remove();
    };
  }, [player]);

  const handlePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const getFallbackVideoUri = () => {
    return 'https://www.w3schools.com/html/mov_bbb.mp4';
  };

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={40} color="#ff6b6b" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            player.replay();
          }}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        contentFit="contain"
        allowsFullscreen
        allowsPictureInPicture
      />
      
      <TouchableOpacity 
        style={styles.playPauseButton}
        onPress={handlePlayPause}
        activeOpacity={0.8}
      >
        <Ionicons 
          name={isPlaying ? 'pause-circle' : 'play-circle'} 
          size={60} 
          color="#fff" 
        />
      </TouchableOpacity>

      <View style={styles.videoInfo}>
        <Text style={styles.videoInfoText}>
          {isPlaying ? 'Playing...' : 'Paused'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 10,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playPauseButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -30,
    marginLeft: -30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoInfo: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  videoInfoText: {
    color: '#fff',
    fontSize: 12,
  },
  errorContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  errorText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default VideoPlayer;