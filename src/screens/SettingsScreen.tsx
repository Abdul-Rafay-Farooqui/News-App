import React from 'react';
import { View, StyleSheet, ScrollView, Text, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store/store';
import { updateSettings } from '../redux/slices/settingsSlice';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state: RootState) => state.settings);

  const handleNotificationToggle = (value: boolean) => {
    dispatch(updateSettings({ notifications: value }));
  };

  const handleAutoPlayToggle = (value: boolean) => {
    dispatch(updateSettings({ autoPlay: value }));
  };

  const settingsSections = [
    {
      title: 'Options',
      items: [
        {
          id: 'notifications',
          title: 'Push Notifications',
          subtitle: 'Receive notifications for breaking news',
          type: 'switch',
          value: settings.notifications,
          onToggle: handleNotificationToggle,
          icon: 'notifications-outline' as const,
        },
        {
          id: 'autoplay',
          title: 'Auto-play Videos',
          subtitle: 'Automatically play videos in news',
          type: 'switch',
          value: settings.autoPlay,
          onToggle: handleAutoPlayToggle,
          icon: 'play-circle-outline' as const,
        },
      ],
    },
    {
      title: 'About',
      items: [
        {
          id: 'version',
          title: 'Version',
          subtitle: '1.0.0',
          type: 'info',
          icon: 'information-circle-outline' as const,
        },
        {
          id: 'developer',
          title: 'Developer',
          subtitle: 'NinjaTech AI',
          type: 'info',
          icon: 'code-outline' as const,
        },
      ],
    },
  ];

  const renderSettingItem = (item: any) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={item.icon} size={24} color="#007AFF" />
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{item.title}</Text>
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        </View>
      </View>

      {item.type === 'switch' && (
        <Switch
          value={item.value}
          onValueChange={item.onToggle}
          trackColor={{ false: '#e0e0e0', true: '#007AFF' }}
          thumbColor={item.value ? '#fff' : '#f4f3f4'}
        />
      )}
    </View>
  );

  const renderSection = (section: any, index: number) => (
    <View key={index} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map((item: any, itemIndex: number) => (
          <View key={item.id}>
            {renderSettingItem(item)}
            {itemIndex < section.items.length - 1 && (
              <View style={styles.divider} />
            )}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {settingsSections.map(renderSection)}
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#f5f5f5', }, header: { padding: 25, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0', }, headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', }, scrollView: { flex: 1, }, section: { marginBottom: 20, }, sectionTitle: { fontSize: 16, fontWeight: '600', color: '#666', marginLeft: 20, marginBottom: 10, textTransform: 'uppercase', }, sectionContent: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 12, overflow: 'hidden', }, settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, }, settingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, }, settingText: { marginLeft: 12, flex: 1, }, settingTitle: { fontSize: 16, fontWeight: '500', color: '#333', marginBottom: 2, }, settingSubtitle: { fontSize: 14, color: '#666', }, divider: { height: 1, backgroundColor: '#e0e0e0', marginLeft: 52, }, });
export default SettingsScreen;