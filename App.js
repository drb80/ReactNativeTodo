// Can you convert the following script into react native?
// Great! Can you add a header?
// Can you add a Stack.Screen with a title?
// Can you add swiping left to delete an item in the following react native script?
// Nice. Can you add a function similar to getData that calls the JSON API with a delete HTTP verb?

import React from 'react'
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Animated, PanResponder, TouchableOpacity } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

// Swipeable row component
const SwipeableRow = ({ item, onDelete, children }) => {
  const pan = React.useRef(new Animated.Value(0)).current
  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to horizontal swipes
        return Math.abs(gestureState.dx) > 5
      },
      onPanResponderMove: (evt, gestureState) => {
        // Only allow left swipe (negative values)
        if (gestureState.dx < 0) {
          pan.setValue(gestureState.dx)
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // If swiped far enough left, trigger delete
        if (gestureState.dx < -100) {
          Animated.timing(pan, {
            toValue: -300,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onDelete(item.id))
        } else {
          // Otherwise snap back
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: true,
          }).start()
        }
      },
    })
  ).current

  return (
    <View style={styles.swipeContainer}>
      <View style={styles.deleteBackground}>
        <Text style={styles.deleteText}>Delete</Text>
      </View>
      <Animated.View
        style={[
          styles.swipeableRow,
          {
            transform: [{ translateX: pan }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        {children}
      </Animated.View>
    </View>
  )
}

const ItemsScreen = props => {
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const getData = async () => {
      try {
        const b = await fetch('http://localhost:3000/items.json')
        const c = await b.json()
        setData(c)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [])

  const deleteData = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return true
    } catch (error) {
      console.error('Error deleting item:', error)
      return false
    }
  }

  const handleDelete = async (id) => {
    // Optimistically update UI
    setData(prevData => prevData.filter(item => item.id !== id))

    // Call API to delete on server
    const success = await deleteData(id)

    if (!success) {
      // If delete failed, we could optionally restore the item
      console.error('Failed to delete item from server')
    }
  }

  function tableHeader() {
    return (
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>What</Text>
        <Text style={styles.headerCell}>When</Text>
      </View>
    )
  }

  function tableData(item) {
    return (
      <>
        <Text style={styles.cell}>{item.what}</Text>
        <Text style={styles.cell}>{item.when}</Text>
      </>
    )
  }

  function tableRow(item) {
    return (
      <SwipeableRow key={item.id} item={item} onDelete={handleDelete}>
        <View style={styles.row}>
          {tableData(item)}
        </View>
      </SwipeableRow>
    )
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.table}>
        <Text style={styles.headerTitle}>Items List</Text>
        <View style={styles.tableBody}>
          {tableHeader()}
          {data && data.map(item => tableRow(item))}
        </View>
      </View>
    </ScrollView>
  )
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Items"
          component={ItemsScreen}
          options={{
            title: 'My Items',
            headerStyle: {
              backgroundColor: 'blue',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  table: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  tableBody: {
    borderWidth: 1,
    borderColor: '#000',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 2,
    borderColor: '#000',
    padding: 10,
  },
  headerCell: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
    padding: 10,
    backgroundColor: '#fff',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  swipeContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  swipeableRow: {
    backgroundColor: '#fff',
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
    width: '100%',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
})

export default App
