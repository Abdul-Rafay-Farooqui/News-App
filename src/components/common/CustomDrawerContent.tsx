import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';

interface CustomDrawerContentProps extends DrawerContentComponentProps {}

const CustomDrawerContent: React.FC<CustomDrawerContentProps> = (props) => {
  const menuItems = [
    { id: 'home', title: 'Home', icon: 'home-outline' as const, screen: 'MainApp' },
    { id: 'latest', title: 'Latest', icon: 'information-circle-outline' as const, screen: 'Category' },
    { id: 'sports', title: 'Sports', icon: 'football-outline' as const, screen: 'Category' },
    { id: 'global', title: 'Global', icon: 'globe-outline' as const, screen: 'Category' },
    { id: 'tech', title: 'Technology', icon: 'laptop-outline' as const, screen: 'Category' },
    { id: 'admin', title: 'Admin Panel', icon: 'lock-closed-outline' as const, screen: 'Admin' },
  ];

  const handleMenuPress = (item: typeof menuItems[0]) => {
    if (item.screen === 'Category') {
      props.navigation.navigate('MainApp', {
        screen: 'Category',
        params: {
          category: item.id,
        },
      });
    } else if (item.screen === 'Admin') {
      props.navigation.navigate('Admin');
    } else {
      props.navigation.navigate('MainApp');
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://picsum.photos/seed/newslogo/100/100.jpg' }} 
          style={styles.logo}
        />
        <Text style={styles.appName}>NEWS APP</Text>
        <Text style={styles.tagline}>Your Daily News Source</Text>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Menu</Text>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={24} color="#666" />
                <Text style={styles.menuItemText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Version 1.0.0</Text>
        <Text style={styles.footerText}>© 2024 News App</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#c7b198',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  appName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: "center",
  },
  tagline: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: "center",
  },
  drawerContent: {
    paddingTop: 10,
  },
  menuSection: {
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    paddingHorizontal: 15,
    paddingVertical: 10,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 2,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
});

export default CustomDrawerContent;