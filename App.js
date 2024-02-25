import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native'

// Create a set of components using properties
const Items = props => {
  // useState is a hook to create a variable React monitors. We call the
  // mutator setData, and the initial value of the variable is null.
  const [data, setData] = React.useState(null)

  React.useEffect(() => {
    const getData = async () => {
      // Use ES6's fetch
      const b = await fetch('http://localhost:3000/items.json')
      const c = await b.json()
      // Call the setData method from the useState hook
      setData(c)
    }
    getData()
  // The empty array denotes only calling once
  }, [])

  // One table datum
  function tableData (item) {
    return (
      <>
        <td>{item.what}</td>
        <td>{item.when}</td>
      </>
    )
  }

  // Create a row and call the previous method
  function tableRow (item) {
    return (
      <tr key={item.id}>
        { tableData(item) }
      </tr>
    )
  }
  // Iterate though all the data using map
  return (
    <table border="1px">
      <tbody>
        { data && data.map(item => tableRow(item)) }
      </tbody>
    </table>
  )
}

// Call the above components
const App = () => {
  return (
    <ScrollView>
      <Items/>
    </ScrollView>
  )
}

export default App
