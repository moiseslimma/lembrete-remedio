import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import Colors from '@/constant/Colors'
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { getAuth, signOut } from 'firebase/auth'
import { auth } from '@/config/FirebaseConfig'
import { getLocalStorage } from '@/service/Storage'

interface User {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

const Profile = () => {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  
  useEffect(() => {
    getUserDetails()
  }, [])

  const getUserDetails = async () => {
    try {
      const userInfo = await getLocalStorage('userDetail')
      setUser(userInfo)
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
    }
  }
  
  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.replace('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const navigateToNewMedication = () => {
    router.push('/add-new-medication')
  }

  const navigateToMyMedication = () => {
    router.push('/(tabs)')
  }

  const navigateToHistory = () => {
    router.push('/(tabs)/History')
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Perfil</Text>
      
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Text style={styles.avatarText}>
                {user?.displayName 
                  ? user.displayName.split(' ').map(name => name[0]).slice(0, 2).join('').toUpperCase()
                  : '?'}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.username}>{user?.displayName || 'Usuário'}</Text>
        <Text style={styles.email}>{user?.email || 'Sem email'}</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem} onPress={navigateToNewMedication}>
          <View style={[styles.iconContainer, {backgroundColor: '#e6f2ff'}]}>
            <Ionicons name="add-circle-outline" size={24} color="#007bff" />
          </View>
          <Text style={styles.menuText}>Adicionar Nova Medicação</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={navigateToMyMedication}>
          <View style={[styles.iconContainer, {backgroundColor: '#e6f9ff'}]}>
            <Ionicons name="medkit-outline" size={24} color="#00b8d4" />
          </View>
          <Text style={styles.menuText}>Minhas Medicações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={navigateToHistory}>
          <View style={[styles.iconContainer, {backgroundColor: '#e6f0ff'}]}>
            <Ionicons name="time-outline" size={24} color="#0057d4" />
          </View>
          <Text style={styles.menuText}>Histórico</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={[styles.iconContainer, {backgroundColor: '#ffebee'}]}>
            <MaterialIcons name="logout" size={24} color="#f44336" />
          </View>
          <Text style={styles.menuText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  defaultAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '500',
  },
})