// Can you convert the following script into react native?
// Great! Can you add a header?
// Can you add a Stack.Screen with a title?

import React from 'react'
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

// Create a set of components using properties
const ItemsScreen = props => {
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  
  React.useEffect(() => {
    const getData = async () => {
      try {
        // Use ES6's fetch
        const b = await fetch('http://localhost:3000/items.json')
        const c = await b.json()
        // Call the setData method from the useState hook
        setData(c)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    getData()
  }, [])
  
  // Header row
  function tableHeader() {
    return (
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>What</Text>
        <Text style={styles.headerCell}>When</Text>
      </View>
    )
  }
  
  // One table cell equivalent
  function tableData(item) {
    return (
      <>
        <Text style={styles.cell}>{item.what}</Text>
        <Text style={styles.cell}>{item.when}</Text>
      </>
    )
  }
  
  // Create a row and call the previous method
  function tableRow(item) {
    return (
      <View key={item.id} style={styles.row}>
        {tableData(item)}
      </View>
    )
  }
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    )
  }
  
  // Iterate though all the data using map
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
})

export default App
