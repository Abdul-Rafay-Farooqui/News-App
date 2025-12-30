import React, { useRef } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLatestNews, useGlobalNews, useSportsNews, useTechNews } from '../hooks/useNews';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import HorizontalNewsCarousel from '../components/news/HorizontalNewsCarousel';
import HorizontalTextTicker from '../components/common/HorizontalTextTicker';

const HomeScreen: React.FC = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  
  // React Query hooks
  const { 
    data: latestNews, 
    isLoading: latestLoading, 
    error: latestError, 
    refetch: refetchLatest 
  } = useLatestNews(4);
  
  const { 
    data: globalNews, 
    isLoading: globalLoading, 
    error: globalError, 
    refetch: refetchGlobal 
  } = useGlobalNews(4);
  
  const { 
    data: sportsNews, 
    isLoading: sportsLoading, 
    error: sportsError, 
    refetch: refetchSports 
  } = useSportsNews(4);
  
  const { 
    data: techNews, 
    isLoading: techLoading, 
    error: techError, 
    refetch: refetchTech 
  } = useTechNews(4);

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchLatest(),
        refetchGlobal(),
        refetchSports(),
        refetchTech(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchLatest, refetchGlobal, refetchSports, refetchTech]);

  const isLoading = latestLoading || globalLoading || sportsLoading || techLoading;
  const hasError = latestError || globalError || sportsError || techError;

  if (isLoading && !latestNews && !globalNews && !sportsNews && !techNews) {
    return <LoadingSpinner message="Loading news..." />;
  }

  if (hasError) {
    return (
      <ErrorMessage 
        message="Failed to load news. Please check your internet connection and try again." 
        onRetry={onRefresh}
      />
    );
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >

        {/* Latest News Section */}
        <HorizontalNewsCarousel
          title="Latest"
          news={latestNews || []}
          category="latest"
        />

        {/* Global News Section */}
        <HorizontalNewsCarousel
          title="Global"
          news={globalNews || []}
          category="global"
        />

        {/* Sports News Section */}
        <HorizontalNewsCarousel
          title="Sports"
          news={sportsNews || []}
          category="sports"
        />

        {/* Technology News Section */}
        <HorizontalNewsCarousel
          title="Technology"
          news={techNews || []}
          category="tech"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#faf6e9',
  },
  scrollView: {
    flex: 1,
  },
});

export default HomeScreen;